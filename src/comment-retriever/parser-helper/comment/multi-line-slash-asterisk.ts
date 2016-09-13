import { ParserHelperComment } from './comment';
import { LineCounter } from '../../../line-counter';

export class ParserHelperCommentMultiLineSlashAsterisk implements ParserHelperComment {
    private isInCommentProperty = false;
    private lastCharacter = '';
    private commentTextBuffer = '';
    private lastCommentText:string;
    private lastCommentLineStart:number;

    addCharacter(character:string) {
        if (this.isInComment()) {
            if ('*' == this.lastCharacter && '/' == character) {
                this.endOfComment();
            } else {
                this.commentTextBuffer += character;
            }
        } else if ('/' == this.lastCharacter && '*' == character) {
            this.startOfComment();
        }

        this.lastCharacter = character;
    }

    private startOfComment() {
        this.isInCommentProperty    = true;
        this.commentTextBuffer      = '';
    }

    private endOfComment() {
        let lastCommentText         = this.commentTextBuffer;
        let lastCommentLineStart    = this.calculateLineStart(lastCommentText);
        lastCommentText             = lastCommentText.replace(/^[\t *]+/gm, '');
        lastCommentText             = lastCommentText.replace(/[\t *]+$/gm, '');
        lastCommentText             = lastCommentText.trim();

        this.lastCommentText        = lastCommentText;
        this.lastCommentLineStart   = lastCommentLineStart;
        this.lastCharacter          = '';
        this.commentTextBuffer      = '';
        this.isInCommentProperty    = false;
    }

    private calculateLineStart(text:string): number {
        let commentLineStart    = 1;
        let commentToStripMatch = text.match(/^[\s*]+/);

        if (commentToStripMatch) {
            let commentLineCounter = new LineCounter();
            commentLineCounter.addText(commentToStripMatch[0]);
            commentLineStart = commentLineCounter.getCurrentLineNumber();
        }

        return commentLineStart;
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

    reset() {
        this.isInCommentProperty    = false;
        this.lastCharacter          = '';
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
        this.lastCommentLineStart   = null;
    }
}
