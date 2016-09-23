/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export class Comment {
    constructor(public readonly text:string, public readonly lineStart:number, public readonly sourceIdentifier:string) {
    }
}
