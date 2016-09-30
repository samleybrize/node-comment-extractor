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
            this.ignoreNextCharacterOnAllHelpersButCurrentHelper();

            if (!this.inDeadZoneParserHelper.isInDeadZone()) {
                this.inDeadZoneParserHelper = null;
            }
        } else {
            this.addCharacterToAllHelpers(character);
        }
    }

    private ignoreNextCharacterOnAllHelpersButCurrentHelper() {
        for (let parserHelper of this.parserHelperList) {
            if (parserHelper != this.inDeadZoneParserHelper) {
                parserHelper.nextCharacterIsIgnored();
            }
        }
    }

    private addCharacterToAllHelpers(character:string) {
        for (let parserHelper of this.parserHelperList) {
            parserHelper.addCharacter(character);

            if (parserHelper.isInDeadZone()) {
                this.inDeadZoneParserHelper = parserHelper;
                break;
            }
        }
    }

    nextCharacterIsIgnored() {
        for (let parserHelper of this.parserHelperList) {
            parserHelper.nextCharacterIsIgnored();
        }
    }

    isInDeadZone(): boolean {
        for (let parserHelper of this.parserHelperList) {
            if (parserHelper.isInDeadZone()) {
                return true;
            }
        }

        return false;
    }

    reset() {
        for (let parserHelper of this.parserHelperList) {
            parserHelper.reset();
        }
    }
}
