/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from '../../../../../src';

export class ParserHelperDeadZoneMockPosition implements ParserHelperDeadZone {
    private isInDeadZoneProperty = false;
    private currentPosition = 0;
    private characterCounter = 0;
    private enterInDeadZoneAtCharacter:number[] = [];
    private leaveDeadZoneAtCharacter:number[] = [];

    addCharacter(character:string) {
        this.currentPosition++;
        this.characterCounter++;

        if (this.enterInDeadZoneAtCharacter.indexOf(this.currentPosition) >= 0) {
            this.isInDeadZoneProperty = true;
        } else if (this.leaveDeadZoneAtCharacter.indexOf(this.currentPosition) >= 0) {
            this.isInDeadZoneProperty = false;
        }
    }

    nextCharacterIsIgnored() {
        this.characterCounter++;
    }

    isInDeadZone(): boolean {
        return this.isInDeadZoneProperty;
    }

    reset() {
        this.currentPosition            = 0;
        this.characterCounter           = 0;
        this.isInDeadZoneProperty       = false;
        this.enterInDeadZoneAtCharacter = [];
        this.leaveDeadZoneAtCharacter   = [];
    }

    addDeadZonePosition(characterStart:number, characterEnd:number) {
        this.enterInDeadZoneAtCharacter.push(characterStart);
        this.leaveDeadZoneAtCharacter.push(characterEnd);
    }

    getCharacterCounter(): number {
        return this.characterCounter;
    }
}
