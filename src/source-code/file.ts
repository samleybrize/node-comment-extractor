import * as fs from 'fs';

import { SourceCode } from './source-code';

export class SourceCodeFile implements SourceCode {
    private sourceCodeString:string;

    constructor(private identifier:string, private filePath:string) {
    }

    getIdentifier() : string {
        return this.identifier;
    }

    getNextCharacter() : string {
        // if (this.hasReachedEndOfSourceCode()) {
        //     return "";
        // }

        // let char = this.sourceCodeString[this.index];
        // this.index++;
        // return char;
        return "";
    }

    hasReachedEndOfSourceCode() : boolean {
        // return !this.sourceCodeString[this.index];
        return true;
    }

    setBufferSize(bufferSize:number) {

    }
}
