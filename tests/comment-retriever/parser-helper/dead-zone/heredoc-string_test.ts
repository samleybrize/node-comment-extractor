/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperDeadZoneHeredocString } from '../../../../src';

describe('parser helper: dead zone: heredoc string', () => {
    it('should not be in dead zone by default', () => {
        let parserHelper = new ParserHelperDeadZoneHeredocString();
        expect(parserHelper.isInDeadZone()).to.equal(false);
    });

    it('should enter in dead zone', () => {
        let sourceCodeString    = ' ' + '\n' + '$t = 4; <<<TAG\nstr\nTAG;';
        let parserHelper        = new ParserHelperDeadZoneHeredocString();

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
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should leave dead zone', () => {
        let sourceCodeString    = ' ' + '\n' + '$t = 4; <<<TAG\nstr\nTAG;\n';
        let parserHelper        = new ParserHelperDeadZoneHeredocString();

        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[17]);
        parserHelper.addCharacter(sourceCodeString[18]);
        parserHelper.addCharacter(sourceCodeString[19]);
        parserHelper.addCharacter(sourceCodeString[20]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[21]);
        parserHelper.addCharacter(sourceCodeString[22]);
        parserHelper.addCharacter(sourceCodeString[23]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[24]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[25]);
        expect(parserHelper.isInDeadZone()).to.equal(false);
    });

    it('should not leave dead zone if close tag does not match open tag', () => {
        let sourceCodeString    = '<<<TAG\nstr\nTAG2;\n';
        let parserHelper        = new ParserHelperDeadZoneHeredocString();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        parserHelper.addCharacter(sourceCodeString[4]);
        parserHelper.addCharacter(sourceCodeString[5]);
        parserHelper.addCharacter(sourceCodeString[6]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should not leave dead zone if close tag is not at line start', () => {
        let sourceCodeString    = '<<<TAG\nstr\n TAG;\n';
        let parserHelper        = new ParserHelperDeadZoneHeredocString();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        parserHelper.addCharacter(sourceCodeString[4]);
        parserHelper.addCharacter(sourceCodeString[5]);
        parserHelper.addCharacter(sourceCodeString[6]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });

    it('should reset its state', () => {
        let sourceCodeString    = '<<<TAG\n<<<TAG\nTAG;\n';
        let parserHelper        = new ParserHelperDeadZoneHeredocString();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        parserHelper.addCharacter(sourceCodeString[4]);
        parserHelper.addCharacter(sourceCodeString[5]);
        parserHelper.addCharacter(sourceCodeString[6]);

        parserHelper.reset();
        expect(parserHelper.isInDeadZone()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[7]);
        parserHelper.addCharacter(sourceCodeString[8]);
        parserHelper.addCharacter(sourceCodeString[9]);
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        expect(parserHelper.isInDeadZone()).to.equal(true);
    });
});
