/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ContextDetector } from '../../../../../src';

export class ContextDetectorMock implements ContextDetector {
    private isInContextProperty = false;
    private isNoMoreCharacter = false;
    private characterCounter = 0;
    private enterInContextAtCharacter:number[] = [];
    private leaveContextAtCharacter:number[] = [];

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        this.characterCounter++;

        if (this.enterInContextAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.isInContextProperty = true;
        } else if (this.leaveContextAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.isInContextProperty = false;
        }
    }

    isInContext(): boolean {
        return this.isInContextProperty;
    }

    noMoreCharacter() {
        this.isNoMoreCharacter      = true;
        this.isInContextProperty    = false;
    }

    reset() {
        this.characterCounter           = 0;
        this.isInContextProperty        = false;
        this.isNoMoreCharacter          = false;
        this.enterInContextAtCharacter  = [];
        this.leaveContextAtCharacter    = [];
    }

    addContextRange(characterStart:number, characterEnd:number) {
        this.enterInContextAtCharacter.push(characterStart);
        this.leaveContextAtCharacter.push(characterEnd);
    }
}
