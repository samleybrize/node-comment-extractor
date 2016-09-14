/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperComment } from '../../../../../src';

export class ParserHelperCommentMock implements ParserHelperComment {
    private isInCommentProperty = false;
    private willBeInCommentOnNextCharacter = false;
    private willLeaveCommentOnNextCharacter = false;
    private commentLineStartOnNextCharacter;
    private lastCharacter = '';
    private buffer = '';
    private lastCommentText;
    private lastCommentLineStart;
    private isNoMoreCharacter = false;

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        this.lastCharacter = character;

        if (this.isInComment()) {
            this.buffer += character;
        }

        if (this.willBeInCommentOnNextCharacter) {
            this.startOfComment();
        } else if (this.willLeaveCommentOnNextCharacter) {
            this.endOfComment();
        }
    }

    private startOfComment() {
        this.setIsInComment(true);
        this.willBeInCommentOnNextCharacter = false;
        this.lastCommentLineStart           = this.commentLineStartOnNextCharacter ? this.commentLineStartOnNextCharacter : 1;
    }

    private endOfComment() {
        this.lastCommentText = this.buffer;
        this.setIsInComment(false);
        this.willLeaveCommentOnNextCharacter = false;
    }

    isInComment(): boolean {
        return this.isInCommentProperty;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    getLastCommentLineStart(): number {
        return this.lastCommentLineStart;
    }

    noMoreCharacter() {
        this.isNoMoreCharacter = true;

        if (this.isInComment()) {
            this.endOfComment();
        } else {
            this.lastCharacter          = '';
            this.lastCommentText        = null;
            this.lastCommentLineStart   = null;
        }
    }

    reset() {
        this.isInCommentProperty                = false;
        this.buffer                             = '';
        this.lastCharacter                      = '';
        this.lastCommentText                    = null;
        this.lastCommentLineStart               = null;
        this.isNoMoreCharacter                  = false;
        this.willBeInCommentOnNextCharacter     = false;
        this.willLeaveCommentOnNextCharacter    = false;
        this.commentLineStartOnNextCharacter    = null;
    }

    setIsInComment(isInComment:boolean) {
        this.isInCommentProperty    = isInComment;
        this.buffer                 = '';
    }

    setWillBeInCommentOnNextCharacter(willBeInCommentOnNextCharacter:boolean) {
        this.willBeInCommentOnNextCharacter = willBeInCommentOnNextCharacter;
    }

    setWillLeaveCommentOnNextCharacter(willLeaveCommentOnNextCharacter:boolean) {
        this.willLeaveCommentOnNextCharacter = willLeaveCommentOnNextCharacter;
    }

    setCommentLineStartOnNextCharacter(lineStart:number) {
        this.commentLineStartOnNextCharacter = lineStart;
    }

    getLastCharacter(): string {
        return this.lastCharacter;
    }
}
