/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperComment } from './comment';

export class ParserHelperCommentSingleLineSharp implements ParserHelperComment {
    private isInCommentProperty = false;
    private commentTextBuffer = '';
    private lastCommentText:string;
    private isNoMoreCharacter = false;

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

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
        this.lastCommentText        = null;
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
        return (null !== this.lastCommentText) ? 1 : null;
    }

    noMoreCharacter() {
        this.isNoMoreCharacter = true;

        if (this.isInComment()) {
            this.endOfComment();
        } else {
            this.lastCommentText = null;
        }
    }

    reset() {
        this.isInCommentProperty    = false;
        this.commentTextBuffer      = '';
        this.lastCommentText        = null;
        this.isNoMoreCharacter      = false;
    }
}
