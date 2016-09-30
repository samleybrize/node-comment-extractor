/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from './dead-zone';

export class ParserHelperDeadZoneSingleQuotedString implements ParserHelperDeadZone {
    private lastCharacter = '';
    private isInString = false;

    addCharacter(character:string) {
        if (!this.isInDeadZone() && "'" == character) {
            this.isInString = true;
        } else if (this.isInDeadZone() && "'" == character && '\\' != this.lastCharacter) {
            this.isInString = false;
        }

        this.lastCharacter = character;
    }

    nextCharacterIsIgnored() {
        //
    }

    isInDeadZone(): boolean {
        return this.isInString;
    }

    reset() {
        this.isInString     = false;
        this.lastCharacter  = '';
    }
}
