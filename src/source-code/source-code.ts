/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export interface SourceCode {
    getIdentifier(): string;
    getNextCharacter(): Promise<string>;
    getCurrentPosition(): number;
    hasReachedEndOfSourceCode(): boolean;
    rewind(): Promise<void>;
}
