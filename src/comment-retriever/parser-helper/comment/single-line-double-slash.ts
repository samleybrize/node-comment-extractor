import { ParserHelperComment } from './comment';

export class ParserHelperCommentSingleLineDoubleSlash implements ParserHelperComment {
    private isInCommentProperty = false;
    private lastCharacter = '';
    private commentTextBuffer = '';
    private lastCommentText:string;

    addCharacter(character:string) {
        if (this.isInComment()) {
            if ('\r' == character || '\n' == character) {
                this.endOfComment();
            } else {
                this.commentTextBuffer += character;
            }
        } else if ('/' == character && '/' == this.lastCharacter) {
            this.startOfComment();
        } else {
            this.lastCharacter = character;
        }
    }

    private startOfComment() {
        this.isInCommentProperty    = true;
        this.commentTextBuffer      = '';
    }

    private endOfComment() {
        let lastCommentText         = this.commentTextBuffer;
        lastCommentText             = lastCommentText.replace(/^\/+/, '');
        lastCommentText             = lastCommentText.trim();

        this.lastCommentText        = lastCommentText;
        this.lastCharacter          = '';
        this.commentTextBuffer      = '';
        this.isInCommentProperty    = false;
    }

    isInComment(): boolean {
        return this.isInCommentProperty;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    reset() {
        this.isInCommentProperty    = false;
        this.lastCharacter          = '';
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
    }
}
