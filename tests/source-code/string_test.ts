/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { use as chaiUse, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { SourceCodeString } from '../../src';

chaiUse(chaiAsPromised);

describe('source code: string', () => {
    it('should return the right identifier', () => {
        let sourceCode = new SourceCodeString('the-identifier', 'source \ncode');
        expect(sourceCode.getIdentifier()).to.equal('the-identifier');
    });

    it('should return all characters in order', () => {
        let sourceCode = new SourceCodeString('the-identifier', 'source \ncode');
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
        let sourceCode = new SourceCodeString('the-identifier', 'source\n');
        expect(sourceCode.hasReachedEndOfSourceCode()).to.eventually.equal(false)
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

    it('should reset its state', () => {
        let sourceCode = new SourceCodeString('the-identifier', 'source\n');
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
        let sourceCode = new SourceCodeString('the-identifier', 'source\n');

        expect(sourceCode.getCurrentPosition()).to.equal(0);

        return sourceCode.getNextCharacter()
            .then(() => sourceCode.getNextCharacter())
            .then(() => sourceCode.getNextCharacter())
            .then(() => expect(sourceCode.getCurrentPosition()).to.equal(3))
        ;
    });
});
