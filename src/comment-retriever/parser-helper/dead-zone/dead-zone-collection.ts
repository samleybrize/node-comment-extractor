/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from './dead-zone';

export class ParserHelperDeadZoneCollection implements ParserHelperDeadZone {
    private parserHelperList:ParserHelperDeadZone[] = [];
    private inDeadZoneParserHelper:ParserHelperDeadZone;

    addParserHelper(parserHelper:ParserHelperDeadZone) {
        this.parserHelperList.push(parserHelper);
    }

    addCharacter(character:string) {
        if (this.inDeadZoneParserHelper) {
            this.inDeadZoneParserHelper.addCharacter(character);

            if (!this.inDeadZoneParserHelper.isInDeadZone()) {
                this.inDeadZoneParserHelper = null;
                this.reset();
            }

            return;
        }

        for (let i in this.parserHelperList) {
            this.parserHelperList[i].addCharacter(character);

            if (this.parserHelperList[i].isInDeadZone()) {
                this.inDeadZoneParserHelper = this.parserHelperList[i];
                break;
            }
        }
    }

    nextCharacterIsIgnored() {
        for (let i in this.parserHelperList) {
            this.parserHelperList[i].nextCharacterIsIgnored();
        }
    }

    isInDeadZone(): boolean {
        for (let i in this.parserHelperList) {
            if (this.parserHelperList[i].isInDeadZone()) {
                return true;
            }
        }

        return false;
    }

    reset() {
        for (let i in this.parserHelperList) {
            this.parserHelperList[i].reset();
        }
    }
}
