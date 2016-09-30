/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../../comment';
import { ContextDetector } from './context-detector/context-detector';
import { LineCounter } from '../../line-counter';
import { ParserHelperDeadZone } from './dead-zone/dead-zone';
import { ParserHelperComment } from './comment/comment';
import { SourceCode } from '../../source-code/source-code';

export class ParserHelper {
    private lineCounter = new LineCounter();
    private commentList:Comment[] = null;
    private commentLineStart:number = null;

    constructor(
        private sourceCode:SourceCode,
        private parserHelperDeadZone:ParserHelperDeadZone,
        private parserHelperComment:ParserHelperComment,
        private contextDetector?:ContextDetector
    ) {
    }

    getCommentList(): Promise<Comment[]> {
        if (null === this.commentList) {
            this.commentList = [];
            return this.retrieveCommentListFromSourceCode();
        } else {
            return Promise.resolve(this.commentList);
        }
    }

    private retrieveCommentListFromSourceCode(): Promise<Comment[]> {
        return this.readSourceCode()
            .then(() => {
                if (this.parserHelperComment.isInComment()) {
                    this.parserHelperComment.noMoreCharacter();
                    this.commentList.push(new Comment(
                        this.parserHelperComment.getLastCommentText(),
                        this.commentLineStart + this.parserHelperComment.getLastCommentLineStart() - 1,
                        this.sourceCode.getIdentifier()
                    ));
                }
            })
            .then(() => this.commentList)
        ;
    }

    private readSourceCode() {
        return this.retrieveNextCharacterFromSourceCode();
    }

    private retrieveNextCharacterFromSourceCode(): Promise<void> {
        return this.sourceCode.hasReachedEndOfSourceCode()
            .then((hasReachedEndOfSourceCode) => {
                if (hasReachedEndOfSourceCode) {
                    return;
                }

                return this.sourceCode.getNextCharacter()
                    .then((character) => this.addCharacter(character))
                    .then(() => this.retrieveNextCharacterFromSourceCode())
                ;
            })
        ;
    }

    private addCharacter(character:string) {
        this.lineCounter.addText(character);

        if (this.contextDetector) {
            this.contextDetector.addCharacter(character);

            if (!this.contextDetector.isInContext()) {
                // TODO this.parserHelperDeadZone.nextCharacterIsIgnored();
                return;
            }
        }

        if (!this.parserHelperComment.isInComment()) {
            let isInDeadZone = this.parserHelperDeadZone.isInDeadZone();
            this.parserHelperDeadZone.addCharacter(character);

            if (isInDeadZone && !this.parserHelperDeadZone.isInDeadZone()) {
                // just leaved a dead zone, we don't want to give the character to the comment parser helper
                return;
            } else if (!isInDeadZone && this.parserHelperDeadZone.isInDeadZone()) {
                // just entered in a dead zone, we reset comment helper
                this.parserHelperComment.reset();
            }
        } else {
            this.parserHelperDeadZone.nextCharacterIsIgnored();
        }

        if (!this.parserHelperDeadZone.isInDeadZone()) {
            let isInComment = this.parserHelperComment.isInComment();
            this.parserHelperComment.addCharacter(character);

            if (!isInComment && this.parserHelperComment.isInComment()) {
                // entered in a comment
                this.commentLineStart = this.lineCounter.getCurrentLineNumber();
            } else if (isInComment && !this.parserHelperComment.isInComment()) {
                // leaved a comment
                this.commentList.push(new Comment(
                    this.parserHelperComment.getLastCommentText(),
                    this.commentLineStart + this.parserHelperComment.getLastCommentLineStart() - 1,
                    this.sourceCode.getIdentifier()
                ));
                this.commentLineStart = null;
            }
        }
    }
}
