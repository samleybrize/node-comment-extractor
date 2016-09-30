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
        this.currentPosition++;

        if (this.isInIgnoredZone && this.isCurrentPositionEndsCurrentIgnoredZone()) {
            this.leaveIgnoredZone();
        } else if (!this.isInIgnoredZone && this.isCurrentPositionStartsAnIgnoredZone()) {
            this.isInIgnoredZone    = true;
            this.currentIgnoredZone = this.getIgnoredZoneStartedByCurrentPosition();
        }
    }

    private isCurrentPositionStartsAnIgnoredZone(): boolean {
        for (let i in this.ignoredZoneList) {
            if (this.currentPosition === this.ignoredZoneList[i].startPosition && !this.isIgnoredZoneIsOneCharacterLong(this.ignoredZoneList[i])) {
                return true;
            }
        }

        return false;
    }

    private isIgnoredZoneIsOneCharacterLong(ignoredZone:SourceCodeZone) {
        return ignoredZone.startPosition == ignoredZone.endPosition;
    }

    private getIgnoredZoneStartedByCurrentPosition(): SourceCodeZone {
        for (let i in this.ignoredZoneList) {
            if (this.currentPosition === this.ignoredZoneList[i].startPosition) {
                return this.ignoredZoneList[i];
            }
        }
    }

    private isCurrentPositionEndsCurrentIgnoredZone(): boolean {
        return this.currentPosition === this.currentIgnoredZone.endPosition;
    }

    private leaveIgnoredZone() {
        this.isInIgnoredZone    = false;
        this.currentIgnoredZone = null;
    }

    nextCharacterIsIgnored() {
        this.addCharacter('');
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
