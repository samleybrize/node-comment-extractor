/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export class Todo {
    constructor(public readonly text:string, public readonly line:number, public readonly sourceIdentifier:string) {
    }
}
