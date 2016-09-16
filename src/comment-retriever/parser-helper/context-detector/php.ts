/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ContextDetector } from './context-detector';
import { SourceCodeZone } from '../../../source-code/zone';

export class ContextDetectorPhp implements ContextDetector {
    private isInContextProperty = false;
    private isNoMoreCharacter = false;
    private contextStartCharacter:number = null;
    private previousCharacter = '';
    private characterCounter = 0;
    private processedZoneList:SourceCodeZone[] = [];

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        if (!this.isInContext() && '<' == this.previousCharacter && '?' == character) {
            this.enterInContext(this.characterCounter);
        } else if (this.isInContext() && '?' == this.previousCharacter && '>' == character) {
            this.leaveContext(this.characterCounter + 1);
        }

        this.previousCharacter = character;
        this.characterCounter++;
    }

    private enterInContext(startPosition:number) {
        this.isInContextProperty    = true;
        this.contextStartCharacter  = startPosition;
    }

    private leaveContext(endPosition:number) {
        if (!this.isInContext()) {
            return;
        }

        this.isInContextProperty = false;
        this.processedZoneList.push(new SourceCodeZone(
            this.contextStartCharacter,
            endPosition
        ));
    }

    isInContext(): boolean {
        return this.isInContextProperty;
    }

    getProcessedZones(): SourceCodeZone[] {
        return this.processedZoneList;
    }

    noMoreCharacter() {
        this.isNoMoreCharacter = true;
        this.leaveContext(this.characterCounter);
    }

    reset() {
        this.isInContextProperty    = false;
        this.isNoMoreCharacter      = false;
        this.previousCharacter      = '';
        this.characterCounter       = 0;
        this.processedZoneList      = [];
        this.contextStartCharacter  = null;
    }
}
