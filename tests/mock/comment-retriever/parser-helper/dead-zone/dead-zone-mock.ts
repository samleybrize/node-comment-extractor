/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from '../../../../../src';

export class ParserHelperDeadZoneMock implements ParserHelperDeadZone {
    private isInDeadZoneProperty = false;
    private willBeInDeadZoneOnNextCharacter = false;
    private willLeaveDeadZoneOnNextCharacter = false;
    private lastCharacter = '';
    private characterCounter = 0;

    addCharacter(character:string) {
        this.lastCharacter = character;
        this.characterCounter++;

        if (this.willBeInDeadZoneOnNextCharacter) {
            this.setIsInDeadZone(true);
            this.willBeInDeadZoneOnNextCharacter = false;
        } else if (this.willLeaveDeadZoneOnNextCharacter) {
            this.setIsInDeadZone(false);
            this.willLeaveDeadZoneOnNextCharacter = false;
        }
    }

    nextCharacterIsIgnored() {
        this.addCharacter('');
    }

    isInDeadZone(): boolean {
        return this.isInDeadZoneProperty;
    }

    reset() {
        this.characterCounter                   = 0;
        this.isInDeadZoneProperty               = false;
        this.lastCharacter                      = '';
        this.willBeInDeadZoneOnNextCharacter    = false;
        this.willLeaveDeadZoneOnNextCharacter   = false;
    }

    setIsInDeadZone(isInDeadZone:boolean) {
        this.isInDeadZoneProperty = isInDeadZone;
    }

    setWillBeInDeadZoneOnNextCharacter(willBeInDeadZoneOnNextCharacter:boolean) {
        this.willBeInDeadZoneOnNextCharacter = willBeInDeadZoneOnNextCharacter;
    }

    setWillLeaveDeadZoneOnNextCharacter(willLeaveDeadZoneOnNextCharacter:boolean) {
        this.willLeaveDeadZoneOnNextCharacter = willLeaveDeadZoneOnNextCharacter;
    }

    getLastCharacter(): string {
        return this.lastCharacter;
    }

    getCharacterCounter(): number {
        return this.characterCounter;
    }
}
