/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperDeadZoneSingleQuotedString } from '../../../../src';

describe('parser helper: dead zone: single quoted string', () => {
    it('should not be in dead zone by default', () => {
        let parserHelper = new ParserHelperDeadZoneSingleQuotedString();
        expect(parserHelper.isInDeadZone()).to.equal(false);
    });

    it('should enter in dead zone', () => {
        let sourceCodeString    = ' ' + '\n' + "$t = 4; 'str';";
        let parserHelper        = new ParserHelperDeadZoneSingleQuotedString();

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[1]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
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
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[10]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should leave dead zone', () => {
        let sourceCodeString    = ' ' + '\n' + "$t = 4; 'str';";
        let parserHelper        = new ParserHelperDeadZoneSingleQuotedString();

        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[12]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[13]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[14]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
    });

    it('should not leave dead zone if there is a backslash', () => {
        let sourceCodeString    = "s\\'tr';";
        let parserHelper        = new ParserHelperDeadZoneSingleQuotedString();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should reset its state', () => {
        let sourceCodeString    = "'s\\'tr';";
        let parserHelper        = new ParserHelperDeadZoneSingleQuotedString();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[2]);

        parserHelper.reset();
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });
});
