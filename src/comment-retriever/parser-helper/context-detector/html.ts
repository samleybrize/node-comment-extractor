/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ContextDetector } from './context-detector';
import { SourceCodeZone } from '../../../source-code/zone';

export class SourceCodeLanguageZoneList {
    constructor(public readonly languageName:string, public readonly zoneList:SourceCodeZone[]) {
    }
}

export class ContextDetectorHtml implements ContextDetector {
    private languageZoneList:SourceCodeLanguageZoneList[];

    addCharacter(character:string) {
        
    }

    isInContext(): boolean {
        return null;
    }

    noMoreCharacter() {
        
    }

    reset() {
        
    }

    getLanguageZoneList(): SourceCodeLanguageZoneList[] {
        return this.languageZoneList;
    }
}
