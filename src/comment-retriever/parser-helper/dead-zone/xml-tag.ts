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
    private stringStartChar:string;

    addCharacter(character:string) {
        if (this.isInString) {
            if ('"' == character && '"' == this.stringStartChar) {
                this.isInString         = false;
                this.stringStartChar    = null;
            } else if ("'" == character && "'" == this.stringStartChar) {
                this.isInString         = false;
                this.stringStartChar    = null;
            }
        } else if (this.isInTag) {
            if ('"' == character) {
                this.isInString         = true;
                this.stringStartChar    = '"';
            } else if ("'" == character) {
                this.isInString         = true;
                this.stringStartChar    = "'";
            } else if ('>' == character) {
                this.isInTag = false;
            }
        } else if (!this.isInDeadZone() && '<' == character) {
            this.isInTag = true;
        }
    }

    isInDeadZone(): boolean {
        return this.isInString || this.isInTag;
    }

    reset() {
        this.isInString         = false;
        this.isInTag            = false;
        this.stringStartChar    = null;
    }
}
