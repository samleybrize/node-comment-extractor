import { ParserHelperComment } from './comment';

export class ParserHelperCommentSingleLineSharp implements ParserHelperComment {
    private isInCommentProperty = false;
    private commentTextBuffer = '';
    private lastCommentText:string;

    addCharacter(character:string) {
        if (this.isInComment()) {
            if ('\r' == character || '\n' == character) {
                this.endOfComment();
            } else {
                this.commentTextBuffer += character;
            }
        } else if ('#' == character) {
            this.startOfComment();
        }
    }

    private startOfComment() {
        this.isInCommentProperty    = true;
        this.commentTextBuffer      = '';
    }

    private endOfComment() {
        let lastCommentText         = this.commentTextBuffer;
        lastCommentText             = lastCommentText.replace(/^#+/, '');
        lastCommentText             = lastCommentText.trim();

        this.lastCommentText        = lastCommentText;
        this.commentTextBuffer      = '';
        this.isInCommentProperty    = false;
    }

    isInComment(): boolean {
        return this.isInCommentProperty;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    getLastCommentLineStart(): number {
        return 1;
    }

    reset() {
        this.isInCommentProperty    = false;
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
    }
}
