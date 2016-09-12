import { SourceCode } from './source-code';

export class SourceCodeString implements SourceCode {
    private index = 0;

    constructor(private identifier:string, private sourceCodeString:string) {
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getNextCharacter(): string {
        if (this.hasReachedEndOfSourceCode()) {
            return '';
        }

        let char = this.sourceCodeString[this.index];
        this.index++;
        return char;
    }

    hasReachedEndOfSourceCode(): boolean {
        return !this.sourceCodeString[this.index];
    }
}
