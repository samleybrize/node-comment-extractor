/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import * as fs from 'fs';

import { SourceCode } from './source-code';

export class SourceCodeFile implements SourceCode {
    private sourceCodeBuffer:string;
    private sourceCodeBufferSize = 0;
    private sourceCodeBufferIndex = 0;
    private sourceCodeIndex = 0;
    private sourceCodeFileDescriptor:number;
    private sourceCodeEndOfFileReached = false;
    private bufferSize = 1000;

    constructor(private identifier:string, private filePath:string, private sourceCodeCharset = 'utf8') {
        this.openFile();
    }

    private openFile() {
        fs.accessSync(this.filePath, fs.constants.R_OK);

        if (this.sourceCodeFileDescriptor) {
            fs.closeSync(this.sourceCodeFileDescriptor);
        }

        this.sourceCodeFileDescriptor   = fs.openSync(this.filePath, 'r');
        this.sourceCodeBuffer           = null;
        this.sourceCodeBufferSize       = 0;
        this.sourceCodeBufferIndex      = 0;
        this.sourceCodeIndex            = 0;
        this.sourceCodeEndOfFileReached = false;
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getNextCharacter(): string {
        if (this.hasReachedEndOfSourceCode()) {
            return '';
        }

        let char = this.sourceCodeBuffer[this.sourceCodeBufferIndex];
        this.sourceCodeBufferIndex++;
        this.sourceCodeIndex++;
        return char;
    }

    getCurrentPosition(): number {
        return this.sourceCodeIndex;
    }

    hasReachedEndOfSourceCode(): boolean {
        if (!this.sourceCodeEndOfFileReached && this.isAllBufferReaded()) {
            this.readFileIntoBuffer();
        }

        return this.sourceCodeEndOfFileReached;
    }

    private isAllBufferReaded() {
        return this.sourceCodeBufferIndex >= this.sourceCodeBufferSize;
    }

    private readFileIntoBuffer() {
        let buffer                  = new Buffer(this.bufferSize);
        this.sourceCodeBufferSize   = fs.readSync(this.sourceCodeFileDescriptor, buffer, 0, this.bufferSize, null);
        this.sourceCodeBuffer       = buffer.toString(this.sourceCodeCharset);
        this.sourceCodeBufferIndex  = 0;

        if (0 == this.sourceCodeBufferSize) {
            this.sourceCodeEndOfFileReached = true;
        }
    }

    setBufferSize(bufferSize:number) {
        if (bufferSize < 1) {
            throw "Buffer size can't be lower than 1";
        }

        this.bufferSize = bufferSize;
    }

    rewind() {
        this.openFile();
    }
}
