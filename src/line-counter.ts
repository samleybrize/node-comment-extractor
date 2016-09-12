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
