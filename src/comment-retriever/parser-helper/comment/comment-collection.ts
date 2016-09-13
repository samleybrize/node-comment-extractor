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
                let lastCommentText         = this.inCommentParserHelper.getLastCommentText();
                let lastCommentLineStart    = this.inCommentParserHelper.getLastCommentLineStart();
                this.inCommentParserHelper  = null;
                this.reset();
                this.lastCommentText        = lastCommentText;
                this.lastCommentLineStart   = lastCommentLineStart;
            }

            return;
        }

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].addCharacter(character);

            if (this.parserHelperList[i].isInComment()) {
                this.inCommentParserHelper  = this.parserHelperList[i];
                this.lastCommentText        = null;
                this.lastCommentLineStart   = null;
                break;
            }
        }
    }

    isInComment(): boolean {
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

    reset() {
        this.lastCommentText = null;

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].reset();
        }
    }
}
