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
        // TODO check if next character's position starts an ignored zone
        // TODO = if yes:
        // TODO = retrieve the object that ignores this position
        // TODO = iterate over the characters until the end position is reached, or the end of source code
        // TODO return the next character
        return this.sourceCode.getNextCharacter();
    }

    private getIgnoredZoneByStartPosition(): SourceCodeZone {

    }

    private isNextPositionStartsAnIgnoredZone(): boolean {

    }

    private isNextPositionEndsAnIgnoredZone(ignoredZone:SourceCodeZone): boolean {

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
