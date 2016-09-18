/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import * as fs from 'mz/fs';

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
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getNextCharacter(): Promise<string> {
        if (!this.isSourceCodeFileOpened()) {
            return this.openFile().then(this.getNextCharacter);
        }

        if (!this.hasReachedEndOfSourceCode() && this.isAllBufferReaded()) {
            return this.readFileIntoBuffer().then(this.getNextCharacter);
        }

        if (this.hasReachedEndOfSourceCode()) {
            return Promise.resolve('');
        }

        let char = this.sourceCodeBuffer[this.sourceCodeBufferIndex];
        this.sourceCodeBufferIndex++;
        this.sourceCodeIndex++;
        return Promise.resolve(char);
    }

    private isSourceCodeFileOpened() {
        return null !== this.sourceCodeFileDescriptor;
    }

    private openFile(): Promise<void> {
        return this.isFileExists().then(() => {
            if (this.sourceCodeFileDescriptor) {
                let oldFileDescriptor = this.sourceCodeFileDescriptor;
                fs.close(oldFileDescriptor);
                this.sourceCodeFileDescriptor = null;
            }

            return fs.open(this.filePath, 'r');
        }).then((fileDescriptor) => {
            this.sourceCodeFileDescriptor   = fileDescriptor;
            this.sourceCodeBuffer           = null;
            this.sourceCodeBufferSize       = 0;
            this.sourceCodeBufferIndex      = 0;
            this.sourceCodeIndex            = 0;
            this.sourceCodeEndOfFileReached = false;
        });
    }

    private isFileExists(): Promise<void> {
        return fs.access(this.filePath, fs.R_OK);
    }

    private isAllBufferReaded() {
        return this.sourceCodeBufferIndex >= this.sourceCodeBufferSize;
    }

    private readFileIntoBuffer(): Promise<void> {
        let buffer = new Buffer(this.bufferSize);
        return fs.read(this.sourceCodeFileDescriptor, buffer, 0, this.bufferSize, null).then((result) => {
            this.sourceCodeBufferSize   = result[0];
            this.sourceCodeBuffer       = buffer.toString(this.sourceCodeCharset);
            this.sourceCodeBufferIndex  = 0;

            if (0 == this.sourceCodeBufferSize) {
                this.sourceCodeEndOfFileReached = true;
            }
        });
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

    setBufferSize(bufferSize:number) {
        if (bufferSize < 1) {
            throw "Buffer size can't be lower than 1";
        }

        this.bufferSize = bufferSize;
    }

    rewind(): Promise<void> {
        return this.openFile();
    }
}
