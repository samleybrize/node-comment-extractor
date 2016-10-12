/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ParserHelperDeadZone } from './dead-zone';
import { SourceCodeZone } from '../../../source-code/zone';

export class ParserHelperDeadZoneAllowedZone implements ParserHelperDeadZone {
    private allowedZoneList:SourceCodeZone[];
    private currentPosition = 0;
    private isInAllowedZone = false;
    private currentAllowedZone:SourceCodeZone = null;

    constructor(allowedZoneList:SourceCodeZone[]) {
        this.allowedZoneList = SourceCodeZone.mergeZoneList(allowedZoneList);
    }

    addCharacter(character:string) {
        this.currentPosition++;

        if (this.isInAllowedZone && this.isCurrentPositionEndsCurrentAllowedZone()) {
            this.leaveAllowedZone();
        } else if (!this.isInAllowedZone && this.isCurrentPositionStartsAnAllowedZone()) {
            this.isInAllowedZone    = true;
            this.currentAllowedZone = this.getAllowedZoneStartedByCurrentPosition();
        }
    }

    private isCurrentPositionStartsAnAllowedZone(): boolean {
        for (let i in this.allowedZoneList) {
            if (this.currentPosition === this.allowedZoneList[i].startPosition && !this.isAllowedZoneIsOneCharacterLong(this.allowedZoneList[i])) {
                return true;
            }
        }

        return false;
    }

    private isAllowedZoneIsOneCharacterLong(allowedZone:SourceCodeZone) {
        return allowedZone.startPosition == allowedZone.endPosition;
    }

    private getAllowedZoneStartedByCurrentPosition(): SourceCodeZone {
        for (let i in this.allowedZoneList) {
            if (this.currentPosition === this.allowedZoneList[i].startPosition) {
                return this.allowedZoneList[i];
            }
        }
    }

    private isCurrentPositionEndsCurrentAllowedZone(): boolean {
        return this.currentPosition === this.currentAllowedZone.endPosition;
    }

    private leaveAllowedZone() {
        this.isInAllowedZone    = false;
        this.currentAllowedZone = null;
    }

    nextCharacterIsIgnored() {
        this.addCharacter('');
    }

    isInDeadZone(): boolean {
        return !this.isInAllowedZone && 0 !== this.currentPosition;
    }

    reset() {
        this.currentPosition    = 0;
        this.currentAllowedZone = null;
        this.isInAllowedZone    = false;
    }
}
