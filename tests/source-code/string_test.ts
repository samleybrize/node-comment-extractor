/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { SourceCodeString } from '../../src';

describe('source code: string', () => {
    it('should return the right identifier', () => {
        let sourceCode = new SourceCodeString('the-identifier', 'source \ncode');
        expect(sourceCode.getIdentifier()).to.equal('the-identifier');
    });
    it('should return all characters in order', () => {
        let sourceCode = new SourceCodeString('the-identifier', 'source \ncode');
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
        let sourceCode = new SourceCodeString('the-identifier', 'source\n');
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
});
