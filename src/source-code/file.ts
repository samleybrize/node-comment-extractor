import * as fs from 'fs';

import { SourceCode } from './source-code';

export class SourceCodeFile implements SourceCode {
    private sourceCodeString:string;

    constructor(private filePath:string) {
    }

    getNextCharacter() : string {
        if (this.hasReachedEndOfSourceCode()) {
            return "";
        }

        let char = this.sourceCodeString[this.index];
        this.index++;
        return char;
    }

    hasReachedEndOfSourceCode() : boolean {
        return !this.sourceCodeString[this.index];
    }
}
