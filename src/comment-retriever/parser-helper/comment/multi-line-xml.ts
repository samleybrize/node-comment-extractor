/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperComment } from './comment';
import { LineCounter } from '../../../line-counter';

export class ParserHelperCommentMultiLineXml implements ParserHelperComment {
    private isInCommentProperty = false;
    private lastCharacter = '';
    private lastLastCharacter = '';
    private lastLastLastCharacter = '';
    private commentTextBuffer = '';
    private lastCommentText:string;
    private lastCommentLineStart:number;
    private isNoMoreCharacter = false;

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        if (this.isInComment()) {
            if ('-' == this.lastLastCharacter && '-' == this.lastCharacter && '>' == character) {
                this.endOfComment();
            } else {
                this.commentTextBuffer += character;
            }
        } else if ('<' == this.lastLastLastCharacter && '!' == this.lastLastCharacter && '-' == this.lastCharacter && '-' == character) {
            this.startOfComment();
        }

        this.lastLastLastCharacter  = this.lastLastCharacter;
        this.lastLastCharacter      = this.lastCharacter;
        this.lastCharacter          = character;
    }

    private startOfComment() {
        this.isInCommentProperty    = true;
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
        this.lastCommentLineStart   = null;
    }

    private endOfComment() {
        let lastCommentText         = this.commentTextBuffer;
        let lastCommentLineStart    = this.calculateLineStart(lastCommentText);
        lastCommentText             = lastCommentText.replace(/^[\t -]+/g, '');
        lastCommentText             = lastCommentText.replace(/[\t -]+$/g, '');
        lastCommentText             = lastCommentText.replace(/^[\t ]+/gm, '');
        lastCommentText             = lastCommentText.replace(/[\t ]+$/gm, '');
        lastCommentText             = lastCommentText.trim();

        this.lastCommentText        = lastCommentText;
        this.lastCommentLineStart   = lastCommentLineStart;
        this.lastCharacter          = '';
        this.lastLastCharacter      = '';
        this.lastLastLastCharacter  = '';
        this.commentTextBuffer      = '';
        this.isInCommentProperty    = false;
    }

    private calculateLineStart(text:string): number {
        let commentLineStart    = 1;
        let commentToStripMatch = text.match(/^[\s-]+/);

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

    noMoreCharacter() {
        this.isNoMoreCharacter = true;

        if (this.isInComment()) {
            this.endOfComment();
        } else {
            this.lastCharacter          = '';
            this.lastLastCharacter      = '';
            this.lastLastLastCharacter  = '';
            this.lastCommentText        = null;
            this.lastCommentLineStart   = null;
        }
    }

    reset() {
        this.isInCommentProperty    = false;
        this.lastCharacter          = '';
        this.lastLastCharacter      = '';
        this.lastLastLastCharacter  = '';
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
        this.lastCommentLineStart   = null;
        this.isNoMoreCharacter      = false;
    }
}
