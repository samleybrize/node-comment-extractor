/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export interface ContextDetector {
    addCharacter(character:string);
    isInContext(): boolean;
    noMoreCharacter();
    reset();
}
