/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from './dead-zone';
import { SourceCodeZone } from '../../../source-code/zone';

export class ParserHelperDeadZoneIgnoredZone implements ParserHelperDeadZone {
    private ignoredZoneList:SourceCodeZone[];
    private currentPosition = 0;
    private isInIgnoredZone = false;
    private currentIgnoredZone:SourceCodeZone = null;

    constructor(ignoredZoneList:SourceCodeZone[]) {
        this.ignoredZoneList = SourceCodeZone.mergeZoneList(ignoredZoneList);
    }

    addCharacter(character:string) {
        
    }

    nextCharacterIsIgnored() {

    }

    isInDeadZone(): boolean {
        return this.isInIgnoredZone;
    }

    reset() {
        this.currentPosition    = 0;
        this.currentIgnoredZone = null;
        this.isInIgnoredZone    = false;
    }
}
