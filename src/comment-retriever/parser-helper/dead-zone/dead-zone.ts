/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export interface ParserHelperDeadZone {
    addCharacter(character:string);
    nextCharacterIsIgnored();
    isInDeadZone(): boolean;
    reset();
}
