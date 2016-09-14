/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperComment } from './comment';

export class ParserHelperCommentCollection implements ParserHelperComment {
    private parserHelperList:ParserHelperComment[] = [];
    private inCommentParserHelper:ParserHelperComment;
    private lastCommentText:string;
    private lastCommentLineStart:number;

    addParserHelper(parserHelper:ParserHelperComment) {
        this.parserHelperList.push(parserHelper);
    }

    addCharacter(character:string) {
        if (this.inCommentParserHelper) {
            this.inCommentParserHelper.addCharacter(character);

            if (!this.inCommentParserHelper.isInComment()) {
                this.endOfComment();
            }

            return;
        }

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].addCharacter(character);

            if (this.parserHelperList[i].isInComment()) {
                this.startOfComment(this.parserHelperList[i]);
                break;
            }
        }
    }

    private startOfComment(parserHelper:ParserHelperComment) {
        this.inCommentParserHelper  = parserHelper;
        this.lastCommentText        = null;
        this.lastCommentLineStart   = null;
    }

    private endOfComment() {
        let lastCommentText         = this.inCommentParserHelper.getLastCommentText();
        let lastCommentLineStart    = this.inCommentParserHelper.getLastCommentLineStart();
        this.inCommentParserHelper  = null;
        this.reset();
        this.lastCommentText        = lastCommentText;
        this.lastCommentLineStart   = lastCommentLineStart;
    }

    isInComment(): boolean {
        if (this.inCommentParserHelper) {
            return true;
        }

        for (let i in this.parserHelperList) {
            if (this.parserHelperList[i].isInComment()) {
                return true;
            }
        }

        return false;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    getLastCommentLineStart(): number {
        return this.lastCommentLineStart;
    }

    noMoreCharacter() {
        for (let i in this.parserHelperList) {
            this.parserHelperList[i].noMoreCharacter();
        }

        if (this.isInComment()) {
            this.endOfComment();
        } else {
            this.lastCommentText        = null;
            this.lastCommentLineStart   = null;
        }
    }

    reset() {
        this.lastCommentText        = null;
        this.lastCommentLineStart   = null;

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].reset();
        }
    }
}
