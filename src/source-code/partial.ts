/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { SourceCode } from './source-code';
import { SourceCodeZone } from './zone';

export class SourceCodePartial implements SourceCode {
    constructor(private sourceCode:SourceCode, private ignoredZoneList:SourceCodeZone[]) {
    }

    getIdentifier(): string {
        return this.sourceCode.getIdentifier();
    }

    getNextCharacter(): string {
        if (this.isNextPositionStartsAnIgnoredZone()) {
            let ignoredZone = this.getIgnoredZoneByStartPosition(this.getNextPosition());

            do {
                this.sourceCode.getNextCharacter();
            } while (!this.isCurrentPositionEndsAnIgnoredZone(ignoredZone));
        }

        return this.sourceCode.getNextCharacter();
    }

    private getNextPosition() {
        return this.sourceCode.getCurrentPosition() + 1;
    }

    private getIgnoredZoneByStartPosition(startPosition:number): SourceCodeZone {
        for (let i in this.ignoredZoneList) {
            if (startPosition === this.ignoredZoneList[i].startPosition) {
                return this.ignoredZoneList[i];
            }
        }
    }

    private isNextPositionStartsAnIgnoredZone(): boolean {
        let nextPosition = this.getNextPosition();

        for (let i in this.ignoredZoneList) {
            if (nextPosition === this.ignoredZoneList[i].startPosition) {
                return true;
            }
        }

        return false;
    }

    private isCurrentPositionEndsAnIgnoredZone(ignoredZone:SourceCodeZone): boolean {
        return this.getCurrentPosition() === ignoredZone.endPosition;
    }

    getCurrentPosition(): number {
        return this.sourceCode.getCurrentPosition();
    }

    hasReachedEndOfSourceCode(): boolean {
        return this.sourceCode.hasReachedEndOfSourceCode();
    }

    rewind() {
        return this.sourceCode.rewind();
    }
}
