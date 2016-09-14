/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as path from 'path';

import { SourceCodeFile } from '../../src';

describe('source code: file', () => {
    it('should return the right identifier', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-identifier');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-identifier', fixtureFilePath);
        expect(sourceCode.getIdentifier()).to.equal('tests/fixtures/source-code/file-identifier');
    });

    it('should return all characters in order', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-characters');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-characters', fixtureFilePath);
        sourceCode.setBufferSize(5);
        expect(sourceCode.getNextCharacter()).to.equal('s');
        expect(sourceCode.getNextCharacter()).to.equal('o');
        expect(sourceCode.getNextCharacter()).to.equal('u');
        expect(sourceCode.getNextCharacter()).to.equal('r');
        expect(sourceCode.getNextCharacter()).to.equal('c');
        expect(sourceCode.getNextCharacter()).to.equal('e');
        expect(sourceCode.getNextCharacter()).to.equal(' ');
        expect(sourceCode.getNextCharacter()).to.equal('\n');
        expect(sourceCode.getNextCharacter()).to.equal('c');
        expect(sourceCode.getNextCharacter()).to.equal('o');
        expect(sourceCode.getNextCharacter()).to.equal('d');
        expect(sourceCode.getNextCharacter()).to.equal('e');
        expect(sourceCode.getNextCharacter()).to.equal('');
    });

    it('should return true if there is no more characters', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-end-of-source-code');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-end-of-source-code', fixtureFilePath);
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCode.getNextCharacter();
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(true);
    });

    it('should throw an error when file does not exists', () => {
        let fn = () => {
            new SourceCodeFile('tests/fixtures/source-code/file-that-does-not-exists', 'tests/fixtures/source-code/file-that-does-not-exists');
        };
        expect(fn).to.throw("no such file or directory, access 'tests/fixtures/source-code/file-that-does-not-exists'");
    });

    it('should throw an error when buffer size is lower than 1', () => {
        let fn = () => {
            let sourceFile = new SourceCodeFile('tests/fixtures/source-code/file-end-of-source-code', 'tests/fixtures/source-code/file-end-of-source-code');
            sourceFile.setBufferSize(0);
        };
        expect(fn).to.throw("Buffer size can't be lower than 1");
    });

    it('should reset its state', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-reset');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-reset', fixtureFilePath);
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();
        sourceCode.getNextCharacter();

        sourceCode.rewind();
        let character = sourceCode.getNextCharacter();
        expect(character).to.equal('s');
        expect(sourceCode.hasReachedEndOfSourceCode()).to.equal(false);
    });
});
