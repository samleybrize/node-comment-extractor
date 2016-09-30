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

    getNextCharacter(): Promise<string> {
        if (this.isNextCharacterPreFetched()) {
            let character           = this.nextCharacter;
            this.nextCharacter      = null;
            this.currentPosition    = null;
            this.hasReachedEnd      = null;
            return Promise.resolve(character);
        }

        if (this.isNextPositionStartsAnIgnoredZone()) {
            let ignoredZone = this.getIgnoredZoneByStartPosition(this.getNextPosition());
            return this.getNextCharacterThatEndsAnIgnoredZone(ignoredZone);
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

    private getNextCharacterThatEndsAnIgnoredZone(ignoredZone:SourceCodeZone) {
        return this.sourceCode.getNextCharacter().then((character) => {
            if (this.isCurrentPositionEndsAnIgnoredZone(ignoredZone)) {
                return this.sourceCode.getNextCharacter();
            } else {
                return this.getNextCharacterThatEndsAnIgnoredZone(ignoredZone);
            }
        });
    }

    getCurrentPosition(): number {
        return (null !== this.currentPosition) ? this.currentPosition : this.sourceCode.getCurrentPosition();
    }

    hasReachedEndOfSourceCode(): Promise<boolean> {
        if (this.isNextCharacterPreFetched()) {
            return Promise.resolve(false);
        } else if (this.hasReachedEnd) {
            return Promise.resolve(true);
        }

        return this.sourceCode.hasReachedEndOfSourceCode().then((hasReachedEnd) => {
            if (hasReachedEnd) {
                return true;
            }

            return this.preFetchNextCharacter().then(() => {
                return this.hasReachedEnd;
            });
        });
    }

    private preFetchNextCharacter(): Promise<void> {
        let currentHasReachedEnd;
        let currentPosition;

        return this.sourceCode.hasReachedEndOfSourceCode().then((hasReachedEnd) => {
            currentHasReachedEnd    = hasReachedEnd;
            currentPosition         = this.sourceCode.getCurrentPosition();
            return this.getNextCharacter();
        }).then((character) => {
            this.nextCharacter      = character;
            this.currentPosition    = currentPosition;
            this.hasReachedEnd      = currentHasReachedEnd;

            if ('' === this.nextCharacter) {
                this.hasReachedEnd = true;
            }
        });
    }

    rewind(): Promise<void> {
        this.nextCharacter      = null;
        this.currentPosition    = null;
        this.hasReachedEnd      = null;
        return this.sourceCode.rewind();
    }
}
