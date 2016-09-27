/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperComment } from '../../../../../src';

export class ParserHelperCommentMockPosition implements ParserHelperComment {
    private isInCommentProperty = false;
    private isNoMoreCharacter = false;
    private lastCommentText;
    private commentTextBuffer = '';
    private characterCounter = 0;
    private enterInCommentAtCharacter:number[] = [];
    private leaveCommentAtCharacter:number[] = [];

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        this.characterCounter++;

        if (this.isInComment()) {
            this.commentTextBuffer += character;
        }

        if (this.enterInCommentAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.startOfComment();
        } else if (this.leaveCommentAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.endOfComment();
        }
    }

    private startOfComment() {
        this.isInCommentProperty    = true;
        this.commentTextBuffer      = '';
    }

    private endOfComment() {
        this.isInCommentProperty    = false;
        this.lastCommentText        = this.commentTextBuffer;
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
        this.lastCommentText            = null;
        this.isInCommentProperty        = false;
        this.isNoMoreCharacter          = false;
        this.commentTextBuffer          = '';
    }

    addCommentPosition(characterStart:number, characterEnd:number) {
        this.enterInCommentAtCharacter.push(characterStart);
        this.leaveCommentAtCharacter.push(characterEnd);
    }

    setLastCommentText(lastCommentText:string) {
        this.lastCommentText = lastCommentText;
    }
}
