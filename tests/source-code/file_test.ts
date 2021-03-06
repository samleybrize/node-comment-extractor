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

        return expect(sourceCode.getNextCharacter()).to.eventually.equal('s')
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('u'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('r'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('c'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('e'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal(' '))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('\n'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('c'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('d'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('e'))
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal(''))
        ;
    });

    it('should return true if there is no more characters', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-end-of-source-code');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-end-of-source-code', fixtureFilePath);

        return expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false)
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(true))
        ;
    });

    it('should throw an error when file does not exists', () => {
        let sourceCode = new SourceCodeFile('tests/fixtures/source-code/file-that-does-not-exists', 'tests/fixtures/source-code/file-that-does-not-exists');
        return expect(sourceCode.getNextCharacter()).to.eventually.be.rejectedWith("no such file or directory, access 'tests/fixtures/source-code/file-that-does-not-exists'");
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
        sourceCode.setBufferSize(3);

        return sourceCode.getNextCharacter()
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.rewind())
            .then(() => expect(sourceCode.getNextCharacter()).to.eventually.equal('s'))
            .then(() => expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => expect(sourceCode.getCurrentPosition()).to.equal(1))
        ;
    });

    it('should return the current position', () => {
        let fixtureFilePath = path.join(__dirname, '../../../tests/fixtures/source-code/file-current-position');
        let sourceCode      = new SourceCodeFile('tests/fixtures/source-code/file-current-position', fixtureFilePath);

        expect(sourceCode.getCurrentPosition()).to.equal(0);

        return sourceCode.getNextCharacter()
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.getCurrentPosition()).to.equal(3))
        ;
    });
});
