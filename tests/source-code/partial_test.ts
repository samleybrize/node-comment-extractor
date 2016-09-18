/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { SourceCodeString, SourceCodePartial, SourceCodeZone } from '../../src';

describe('source code: partial', () => {
    it('should return the right identifier', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source \ncode');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, []);
        expect(sourceCodePartial.getIdentifier()).to.equal('the-identifier');
    });

    it('should return all non-ignored characters in order', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source \ncode');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
            new SourceCodeZone(10, 10),
        ]);
        expect(sourceCodePartial.getNextCharacter()).to.equal('s');
        expect(sourceCodePartial.getNextCharacter()).to.equal('o');
        expect(sourceCodePartial.getNextCharacter()).to.equal('u');
        expect(sourceCodePartial.getNextCharacter()).to.equal(' ');
        expect(sourceCodePartial.getNextCharacter()).to.equal('\n');
        expect(sourceCodePartial.getNextCharacter()).to.equal('c');
        expect(sourceCodePartial.getNextCharacter()).to.equal('d');
        expect(sourceCodePartial.getNextCharacter()).to.equal('e');
        expect(sourceCodePartial.getNextCharacter()).to.equal('');
    });

    it('should return all non-ignored characters when there are ignored position collisions', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source \ncode');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
            new SourceCodeZone(3, 5),
            new SourceCodeZone(5, 8),
        ]);
        expect(sourceCodePartial.getNextCharacter()).to.equal('s');
        expect(sourceCodePartial.getNextCharacter()).to.equal('o');
        expect(sourceCodePartial.getNextCharacter()).to.equal('c');
        expect(sourceCodePartial.getNextCharacter()).to.equal('o');
        expect(sourceCodePartial.getNextCharacter()).to.equal('d');
        expect(sourceCodePartial.getNextCharacter()).to.equal('e');
        expect(sourceCodePartial.getNextCharacter()).to.equal('');
    });

    it('should return true if there is no more characters', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(false);
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(true);
    });

    it('should return true if there is no more non-ignored characters', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(true);
    });

    it('should return true if source code is empty', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', '');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(true);
    });

    it('should reset its state', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(true);

        sourceCodePartial.rewind();
        expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.equal(false);
        expect(sourceCodePartial.getCurrentPosition()).to.equal(0);
        expect(sourceCodePartial.getNextCharacter()).to.equal('s');
        expect(sourceCodePartial.getNextCharacter()).to.equal('o');
        expect(sourceCodePartial.getNextCharacter()).to.equal('u');
        expect(sourceCodePartial.getNextCharacter()).to.equal('\n');
    });

    it('should return the current position', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(3, 5),
        ]);

        expect(sourceCodePartial.getCurrentPosition()).to.equal(0);
        sourceCodePartial.getNextCharacter();
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.getCurrentPosition()).to.equal(2);
        sourceCodePartial.getNextCharacter();
        expect(sourceCodePartial.getCurrentPosition()).to.equal(6);
    });
});
