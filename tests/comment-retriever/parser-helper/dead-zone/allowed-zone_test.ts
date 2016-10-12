/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperDeadZoneAllowedZone, SourceCodeZone } from '../../../../src';

describe('parser helper: dead zone: allowed zone', () => {
    it('should not be in dead zone by default', () => {
        let parserHelper = new ParserHelperDeadZoneAllowedZone([]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
    });

    it('should enter in dead zone', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(4, 6),
        ]);

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should leave dead zone', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(4, 6),
        ]);

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[1]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[2]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[4]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[5]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should not leave dead zone for a one character allowed zone', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(4, 6),
            new SourceCodeZone(10, 10),
        ]);

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        parserHelper.addCharacter(sourceCodeString[4]);
        parserHelper.addCharacter(sourceCodeString[5]);
        parserHelper.addCharacter(sourceCodeString[6]);
        parserHelper.addCharacter(sourceCodeString[7]);
        parserHelper.addCharacter(sourceCodeString[8]);
        parserHelper.addCharacter(sourceCodeString[9]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[10]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[11]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should merge allowed zones when there are allowed zones collisions', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(4, 6),
            new SourceCodeZone(3, 5),
            new SourceCodeZone(5, 10),
        ]);

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[1]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[2]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[4]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[5]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[6]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[7]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[8]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[9]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should act as if there is a character when next character is ignored', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(4, 6),
        ]);

        parserHelper.nextCharacterIsIgnored();
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.nextCharacterIsIgnored();
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.nextCharacterIsIgnored();
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.nextCharacterIsIgnored();
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.nextCharacterIsIgnored();
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should reset its state', () => {
        let sourceCodeString    = 'source code';
        let parserHelper        = new ParserHelperDeadZoneAllowedZone([
            new SourceCodeZone(2, 3),
        ]);

        parserHelper.addCharacter(sourceCodeString[0]);

        parserHelper.reset();
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[1]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });
});
