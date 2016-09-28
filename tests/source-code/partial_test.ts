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
        return expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('s')
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('u'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal(' '))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('\n'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('c'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('d'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('e'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal(''))
        ;
    });

    it('should return all non-ignored characters when there are ignored position collisions', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source \r\ncode');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
            new SourceCodeZone(3, 5),
            new SourceCodeZone(5, 10),
        ]);
        return expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('s')
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('\r'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('\n'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('d'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('e'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal(''))
        ;
    });

    it('should return all non-ignored characters when an ignored zone ends on a newline', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source \ncode');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(3, 8),
        ]);
        return expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('s')
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('\n'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('c'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('d'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('e'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal(''))
        ;
    });

    it('should return true if there is no more characters', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        return expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(false)
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(true))
        ;
    });

    it('should return true if there is no more non-ignored characters', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        return sourceCodePartial.getNextCharacter()
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(true))
        ;
    });

    it('should return true if source code is empty', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', '');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        return expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(true);
    });

    it('should reset its state', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(4, 6),
        ]);
        return sourceCodePartial.getNextCharacter()
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(true))
            .then(() => sourceCodePartial.rewind())
            .then(() => expect(sourceCodePartial.hasReachedEndOfSourceCode()).to.eventually.equal(false))
            .then(() => expect(sourceCodePartial.getCurrentPosition()).to.equal(0))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('s'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('o'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('u'))
            .then(() => expect(sourceCodePartial.getNextCharacter()).to.eventually.equal('\n'))
        ;
    });

    it('should return the current position', () => {
        let sourceCodeString    = new SourceCodeString('the-identifier', 'source\n');
        let sourceCodePartial   = new SourceCodePartial(sourceCodeString, [
            new SourceCodeZone(3, 5),
        ]);

        expect(sourceCodePartial.getCurrentPosition()).to.equal(0);

        return sourceCodePartial.getNextCharacter()
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.getCurrentPosition()).to.equal(2))
            .then(() => sourceCodePartial.getNextCharacter())
            .then(() => expect(sourceCodePartial.getCurrentPosition()).to.equal(6))
        ;
    });
});
