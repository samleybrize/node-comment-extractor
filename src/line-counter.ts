/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export class LineCounter {
    private currentLineNumber = 1;
    private lastCharacter = '';

    addText(text:string) {
        let textLength = text.length;

        for (let i = 0; i < textLength; i++) {
            this.addCharacter(text[i]);
        }
    }

    private addCharacter(character:string) {
        if ('\r' == character) {
            this.currentLineNumber++;
        } else if ('\n' == character && '\r' != this.lastCharacter) {
            this.currentLineNumber++;
        }

        this.lastCharacter = character;
    }

    getCurrentLineNumber(): number {
        return this.currentLineNumber;
    }

    reset() {
        this.currentLineNumber  = 1;
        this.lastCharacter      = '';
    }
}
