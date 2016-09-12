import { ParserHelperComment } from './comment';

export class ParserHelperCommentCollection implements ParserHelperComment {
    private parserHelperList:ParserHelperComment[] = [];
    private inCommentParserHelper:ParserHelperComment;
    private lastCommentText:string;

    addParserHelper(parserHelper:ParserHelperComment) {
        this.parserHelperList.push(parserHelper);
    }

    addCharacter(character:string) {
        if (this.inCommentParserHelper) {
            this.inCommentParserHelper.addCharacter(character);

            if (!this.inCommentParserHelper.isInComment()) {
                let lastCommentText         = this.inCommentParserHelper.getLastCommentText();
                this.inCommentParserHelper  = null;
                this.reset();
                this.lastCommentText        = lastCommentText;
            }

            return;
        }

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].addCharacter(character);

            if (this.parserHelperList[i].isInComment()) {
                this.inCommentParserHelper  = this.parserHelperList[i];
                this.lastCommentText        = null;
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

    reset() {
        this.lastCommentText = null;

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].reset();
        }
    }
}
