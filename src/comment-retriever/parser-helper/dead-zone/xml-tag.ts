/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from './dead-zone';

export class ParserHelperDeadZoneXmlTag implements ParserHelperDeadZone {
    private isInTag = false;
    private isInString = false;
    private stringStartCharacter:string;
    private lastCharacter;

    addCharacter(character:string) {
        if (this.isInString) {
            if ('"' == character && '"' == this.stringStartCharacter) {
                this.isInString         = false;
                this.stringStartCharacter    = null;
            } else if ("'" == character && "'" == this.stringStartCharacter) {
                this.isInString         = false;
                this.stringStartCharacter    = null;
            }
        } else if (this.isInTag) {
            if ('"' == character) {
                this.isInString         = true;
                this.stringStartCharacter    = '"';
            } else if ("'" == character) {
                this.isInString         = true;
                this.stringStartCharacter    = "'";
            } else if ('>' == character) {
                this.isInTag = false;
            }
        } else if (!this.isInDeadZone() && '<' == this.lastCharacter && '!' != character) {
            this.isInTag = true;
        }

        this.lastCharacter = character;
    }

    nextCharacterIsIgnored() {
        //
    }

    isInDeadZone(): boolean {
        return this.isInString || this.isInTag;
    }

    reset() {
        this.isInString             = false;
        this.isInTag                = false;
        this.stringStartCharacter   = null;
        this.lastCharacter          = null;
    }
}
