/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { SourceCode } from './source-code';

export class SourceCodeString implements SourceCode {
    private index = 0;

    constructor(private identifier:string, private sourceCodeString:string) {
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getNextCharacter(): Promise<string> {
        if (this.hasReachedEndOfSourceCode()) {
            return Promise.resolve('');
        }

        let char = this.sourceCodeString[this.index];
        this.index++;
        return Promise.resolve(char);
    }

    getCurrentPosition(): number {
        return this.index;
    }

    hasReachedEndOfSourceCode(): boolean {
        return !this.sourceCodeString[this.index];
    }

    rewind(): Promise<void> {
        this.index = 0;
        return Promise.resolve(null);
    }
}
