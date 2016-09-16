/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ContextDetectorPhp } from '../../../../src';

describe('parser helper: context detector: php', () => {
    it('should not be in context by default', () => {
        let contextDetector = new ContextDetectorPhp();
        expect(contextDetector.isInContext()).to.equal(false);
    });

    it('should enter in context when short open tag is encountered', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = 'aze<?';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        expect(contextDetector.isInContext()).to.equal(false);

        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should enter in context when long open tag is encountered', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = 'aze<?php';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        expect(contextDetector.isInContext()).to.equal(false);

        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        contextDetector.addCharacter(sourceCode[6]);
        contextDetector.addCharacter(sourceCode[7]);
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should leave context when end tag is encountered', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = '<? aze ?>';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        contextDetector.addCharacter(sourceCode[6]);
        expect(contextDetector.isInContext()).to.equal(true);

        contextDetector.addCharacter(sourceCode[7]);
        contextDetector.addCharacter(sourceCode[8]);
        expect(contextDetector.isInContext()).to.equal(false);
    });

    it('should return processed zones', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = '...<? aze ?>......<?php qwerty ?>.';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        contextDetector.addCharacter(sourceCode[6]);
        contextDetector.addCharacter(sourceCode[7]);
        contextDetector.addCharacter(sourceCode[8]);
        contextDetector.addCharacter(sourceCode[9]);
        contextDetector.addCharacter(sourceCode[10]);
        contextDetector.addCharacter(sourceCode[11]);
        contextDetector.addCharacter(sourceCode[12]);
        contextDetector.addCharacter(sourceCode[13]);
        contextDetector.addCharacter(sourceCode[14]);
        contextDetector.addCharacter(sourceCode[15]);
        contextDetector.addCharacter(sourceCode[16]);
        contextDetector.addCharacter(sourceCode[17]);
        contextDetector.addCharacter(sourceCode[18]);
        contextDetector.addCharacter(sourceCode[19]);
        contextDetector.addCharacter(sourceCode[20]);
        contextDetector.addCharacter(sourceCode[21]);
        contextDetector.addCharacter(sourceCode[22]);
        contextDetector.addCharacter(sourceCode[23]);
        contextDetector.addCharacter(sourceCode[24]);
        contextDetector.addCharacter(sourceCode[25]);
        contextDetector.addCharacter(sourceCode[26]);
        contextDetector.addCharacter(sourceCode[27]);
        contextDetector.addCharacter(sourceCode[28]);
        contextDetector.addCharacter(sourceCode[29]);
        contextDetector.addCharacter(sourceCode[30]);
        contextDetector.addCharacter(sourceCode[31]);
        contextDetector.addCharacter(sourceCode[32]);
        contextDetector.addCharacter(sourceCode[33]);

        let processedZoneList = contextDetector.getProcessedZones();
        expect(processedZoneList).to.be.an('array').that.have.lengthOf(2);
        expect(processedZoneList[0].startPosition).to.equal(4);
        expect(processedZoneList[0].endPosition).to.equal(12);
        expect(processedZoneList[1].startPosition).to.equal(19);
        expect(processedZoneList[1].endPosition).to.equal(33);
    });

    it('should register the last zone as processed if it is at the end of the source code', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = '...<? aze';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        contextDetector.addCharacter(sourceCode[6]);
        contextDetector.addCharacter(sourceCode[7]);
        contextDetector.addCharacter(sourceCode[8]);
        contextDetector.noMoreCharacter();

        let processedZoneList = contextDetector.getProcessedZones();
        expect(processedZoneList).to.be.an('array').that.have.lengthOf(1);
        expect(processedZoneList[0].startPosition).to.equal(4);
        expect(processedZoneList[0].endPosition).to.equal(9);
    });

    it('should throw an error when calling addCharacter() after noMoreCharacter()', () => {
        let fn = () => {
            let contextDetector = new ContextDetectorPhp();
            contextDetector.noMoreCharacter();
            contextDetector.addCharacter('e');
        };
        expect(fn).to.throw("Can't add a character because noMoreCharacter() was called. Use reset() before adding any character");
    });

    it('should reset its state', () => {
        let contextDetector = new ContextDetectorPhp();
        let sourceCode      = '...<? aze';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        contextDetector.addCharacter(sourceCode[6]);
        contextDetector.addCharacter(sourceCode[7]);
        contextDetector.addCharacter(sourceCode[8]);
        contextDetector.noMoreCharacter();
        contextDetector.reset();

        expect(contextDetector.getProcessedZones()).to.be.an('array').that.have.lengthOf(0);
        expect(contextDetector.isInContext()).to.equal(false);

        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.noMoreCharacter();
        let processedZoneList = contextDetector.getProcessedZones();
        expect(processedZoneList[0].startPosition).to.equal(1);
        expect(processedZoneList[0].endPosition).to.equal(2);
    });
});
