/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { SourceCode } from './source-code';
import { SourceCodeZone } from './zone';

export class SourceCodePartial implements SourceCode {
    private ignoredZoneList:SourceCodeZone[];
    private currentPosition:number = null;
    private hasReachedEnd:boolean = null;
    private nextCharacter:string = null;

    constructor(private sourceCode:SourceCode, ignoredZoneList:SourceCodeZone[]) {
        this.ignoredZoneList = SourceCodeZone.mergeZoneList(ignoredZoneList);
    }

    getIdentifier(): string {
        return this.sourceCode.getIdentifier();
    }

    getNextCharacter(): string {
        if (this.isNextCharacterPreFetched()) {
            let character           = this.nextCharacter;
            this.nextCharacter      = null;
            this.currentPosition    = null;
            this.hasReachedEnd      = null;
            return character;
        }

        if (this.isNextPositionStartsAnIgnoredZone()) {
            let ignoredZone = this.getIgnoredZoneByStartPosition(this.getNextPosition());

            do {
                this.sourceCode.getNextCharacter();
            } while (!this.isCurrentPositionEndsAnIgnoredZone(ignoredZone));
        }

        return this.sourceCode.getNextCharacter();
    }

    private isNextCharacterPreFetched() {
        return null !== this.nextCharacter;
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
        return (null !== this.currentPosition) ? this.currentPosition : this.sourceCode.getCurrentPosition();
    }

    hasReachedEndOfSourceCode(): boolean {
        if (!this.isNextCharacterPreFetched() && !this.sourceCode.hasReachedEndOfSourceCode()) {
            this.preFetchNextCharacter();
        }

        return (null !== this.hasReachedEnd) ? this.hasReachedEnd : this.sourceCode.hasReachedEndOfSourceCode();
    }

    private preFetchNextCharacter() {
        let currentPosition     = this.sourceCode.getCurrentPosition();
        let hasReachedEnd       = this.sourceCode.hasReachedEndOfSourceCode();

        this.nextCharacter      = this.getNextCharacter();
        this.currentPosition    = currentPosition;
        this.hasReachedEnd      = hasReachedEnd;

        if ('' === this.nextCharacter) {
            this.hasReachedEnd = true;
        }
    }

    rewind() {
        return this.sourceCode.rewind();
    }
}
