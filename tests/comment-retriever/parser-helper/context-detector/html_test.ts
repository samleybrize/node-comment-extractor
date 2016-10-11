/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ContextDetectorHtml } from '../../../../src';

describe('parser helper: context detector: html', () => {
    // TODO todel
    it('test context detector html', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode  = '<script type="text/javascript">11';
        sourceCode     += '</script>2';
        sourceCode     += '<style type="text/css">33';
        sourceCode     += '</style>4';
        sourceCode     += '<script>55';
        sourceCode     += '<!--</script>-->';
        sourceCode     += '</script>6';
        sourceCode     += '<style type="</style>">77';
        sourceCode     += '<ul>';
        sourceCode     += '</li>';
        sourceCode     += '</style>8';
        sourceCode     += '<!--<script type="text/javascript">99';
        sourceCode     += '</script>-->10';
        sourceCode     += '<script type="text/javascript" src="..">11';
        sourceCode     += '</script>12';

        for (let char of sourceCode) {
            contextDetector.addCharacter(char);
        }

        console.log('======');
        console.log(contextDetector.getLanguageZoneList());
        // console.log(sourceCode.substr(31, 2));
        // console.log(sourceCode.substr(66, 2));
        // console.log(sourceCode.substr(108, 18));
        // console.log(sourceCode.substr(159, 11));
    });

    it('should be in context by default', () => {
        let contextDetector = new ContextDetectorHtml();
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should leave context when "script" tag is encountered', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<html>\n<script type="text/javascript">';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        expect(contextDetector.isInContext()).to.equal(true);

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        expect(contextDetector.isInContext()).to.equal(false);
    });

    it('should enter context when "script" end tag is encountered', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<html>\n<script type="text/javascript">..\n.</script>';

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        expect(contextDetector.isInContext()).to.equal(false);

        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[40]);
        contextDetector.addCharacter(sourceCode[41]);
        contextDetector.addCharacter(sourceCode[42]);
        contextDetector.addCharacter(sourceCode[43]);
        contextDetector.addCharacter(sourceCode[44]);
        contextDetector.addCharacter(sourceCode[45]);
        contextDetector.addCharacter(sourceCode[46]);
        contextDetector.addCharacter(sourceCode[47]);
        contextDetector.addCharacter(sourceCode[48]);
        contextDetector.addCharacter(sourceCode[49]);
        contextDetector.addCharacter(sourceCode[50]);
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should not leave context when "script" with a "src" attribute tag is encountered', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script\n type="text/javascript" src="...">';

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[41]);
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should leave context when "style" tag is encountered', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<html>\n<style type="text/css">';

        contextDetector.addCharacter(sourceCode[0]);
        contextDetector.addCharacter(sourceCode[1]);
        contextDetector.addCharacter(sourceCode[2]);
        contextDetector.addCharacter(sourceCode[3]);
        contextDetector.addCharacter(sourceCode[4]);
        contextDetector.addCharacter(sourceCode[5]);
        expect(contextDetector.isInContext()).to.equal(true);

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
        expect(contextDetector.isInContext()).to.equal(false);
    });

    it('should enter context when "style" end tag is encountered', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<html>\n<style type="text/css">..\n.</style>';

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
        expect(contextDetector.isInContext()).to.equal(false);

        contextDetector.addCharacter(sourceCode[31]);
        contextDetector.addCharacter(sourceCode[32]);
        contextDetector.addCharacter(sourceCode[33]);
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[40]);
        contextDetector.addCharacter(sourceCode[41]);
        expect(contextDetector.isInContext()).to.equal(true);
    });

    it('should return languages zones', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script type="text/javascript">..</script>.<style type="text/css">..</style>.<script type="text/javascript">..</script>';

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[40]);
        contextDetector.addCharacter(sourceCode[41]);
        contextDetector.addCharacter(sourceCode[42]);
        contextDetector.addCharacter(sourceCode[43]);
        contextDetector.addCharacter(sourceCode[44]);
        contextDetector.addCharacter(sourceCode[45]);
        contextDetector.addCharacter(sourceCode[46]);
        contextDetector.addCharacter(sourceCode[47]);
        contextDetector.addCharacter(sourceCode[48]);
        contextDetector.addCharacter(sourceCode[49]);
        contextDetector.addCharacter(sourceCode[50]);
        contextDetector.addCharacter(sourceCode[51]);
        contextDetector.addCharacter(sourceCode[52]);
        contextDetector.addCharacter(sourceCode[53]);
        contextDetector.addCharacter(sourceCode[54]);
        contextDetector.addCharacter(sourceCode[55]);
        contextDetector.addCharacter(sourceCode[56]);
        contextDetector.addCharacter(sourceCode[57]);
        contextDetector.addCharacter(sourceCode[58]);
        contextDetector.addCharacter(sourceCode[59]);
        contextDetector.addCharacter(sourceCode[60]);
        contextDetector.addCharacter(sourceCode[61]);
        contextDetector.addCharacter(sourceCode[62]);
        contextDetector.addCharacter(sourceCode[63]);
        contextDetector.addCharacter(sourceCode[64]);
        contextDetector.addCharacter(sourceCode[65]);
        contextDetector.addCharacter(sourceCode[66]);
        contextDetector.addCharacter(sourceCode[67]);
        contextDetector.addCharacter(sourceCode[68]);
        contextDetector.addCharacter(sourceCode[69]);
        contextDetector.addCharacter(sourceCode[70]);
        contextDetector.addCharacter(sourceCode[71]);
        contextDetector.addCharacter(sourceCode[72]);
        contextDetector.addCharacter(sourceCode[73]);
        contextDetector.addCharacter(sourceCode[74]);
        contextDetector.addCharacter(sourceCode[75]);
        contextDetector.addCharacter(sourceCode[76]);
        contextDetector.addCharacter(sourceCode[77]);
        contextDetector.addCharacter(sourceCode[78]);
        contextDetector.addCharacter(sourceCode[79]);
        contextDetector.addCharacter(sourceCode[80]);
        contextDetector.addCharacter(sourceCode[81]);
        contextDetector.addCharacter(sourceCode[82]);
        contextDetector.addCharacter(sourceCode[83]);
        contextDetector.addCharacter(sourceCode[84]);
        contextDetector.addCharacter(sourceCode[85]);
        contextDetector.addCharacter(sourceCode[86]);
        contextDetector.addCharacter(sourceCode[87]);
        contextDetector.addCharacter(sourceCode[88]);
        contextDetector.addCharacter(sourceCode[89]);
        contextDetector.addCharacter(sourceCode[90]);
        contextDetector.addCharacter(sourceCode[91]);
        contextDetector.addCharacter(sourceCode[92]);
        contextDetector.addCharacter(sourceCode[93]);
        contextDetector.addCharacter(sourceCode[94]);
        contextDetector.addCharacter(sourceCode[95]);
        contextDetector.addCharacter(sourceCode[96]);
        contextDetector.addCharacter(sourceCode[97]);
        contextDetector.addCharacter(sourceCode[98]);
        contextDetector.addCharacter(sourceCode[99]);
        contextDetector.addCharacter(sourceCode[100]);
        contextDetector.addCharacter(sourceCode[101]);
        contextDetector.addCharacter(sourceCode[102]);
        contextDetector.addCharacter(sourceCode[103]);
        contextDetector.addCharacter(sourceCode[104]);
        contextDetector.addCharacter(sourceCode[105]);
        contextDetector.addCharacter(sourceCode[106]);
        contextDetector.addCharacter(sourceCode[107]);
        contextDetector.addCharacter(sourceCode[108]);
        contextDetector.addCharacter(sourceCode[109]);
        contextDetector.addCharacter(sourceCode[110]);
        contextDetector.addCharacter(sourceCode[111]);
        contextDetector.addCharacter(sourceCode[112]);
        contextDetector.addCharacter(sourceCode[113]);
        contextDetector.addCharacter(sourceCode[114]);
        contextDetector.addCharacter(sourceCode[115]);
        contextDetector.addCharacter(sourceCode[116]);
        contextDetector.addCharacter(sourceCode[117]);
        contextDetector.addCharacter(sourceCode[118]);

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(2);
        expect(languageZoneList[0].languageName).to.equal('javascript');
        expect(languageZoneList[0].zoneList).to.be.an('array').that.have.lengthOf(2);
        expect(languageZoneList[0].zoneList[0].startPosition).to.equal(32);
        expect(languageZoneList[0].zoneList[0].endPosition).to.equal(34);
        expect(languageZoneList[0].zoneList[1].startPosition).to.equal(109);
        expect(languageZoneList[0].zoneList[1].endPosition).to.equal(111);
        expect(languageZoneList[1].languageName).to.equal('css');
        expect(languageZoneList[1].zoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[1].zoneList[0].startPosition).to.equal(67);
        expect(languageZoneList[1].zoneList[0].endPosition).to.equal(69);
    });

    it('should defaults to javascript when no type specified in script tag', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script>..</script>';

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

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].languageName).to.equal('javascript');
    });

    it('should defaults to css when no type specified in style tag', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<style>..</style>';

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

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].languageName).to.equal('css');
    });

    it('should ignore script tags in html comments', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<!--<script>..</script>-->';

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
        expect(contextDetector.isInContext()).to.equal(true);

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

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(0);
    });

    it('should ignore script end tags in html comments', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script>..<!--</script>-->';

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

        expect(contextDetector.isInContext()).to.equal(false);
    });

    it('should ignore html comments in returned languages zones', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script>..<!--</script>-->..</script>';

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(2);
        expect(languageZoneList[0].languageName).to.equal('javascript');
        expect(languageZoneList[0].zoneList).to.be.an('array').that.have.lengthOf(2);
        expect(languageZoneList[0].zoneList[0].startPosition).to.equal(9);
        expect(languageZoneList[0].zoneList[0].endPosition).to.equal(11);
        expect(languageZoneList[0].zoneList[1].startPosition).to.equal(27);
        expect(languageZoneList[0].zoneList[1].endPosition).to.equal(29);
    });

    it('should register the last zone as processed if it is at the end of the source code', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<html>\n<script type="text/javascript">..\n.';

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
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[40]);
        contextDetector.addCharacter(sourceCode[41]);
        contextDetector.noMoreCharacter();

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].languageName).to.equal('javascript');
        expect(languageZoneList[0].zoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].zoneList[0].startPosition).to.equal(39);
        expect(languageZoneList[0].zoneList[0].endPosition).to.equal(43);
    });

    it('should throw an error when calling addCharacter() after noMoreCharacter()', () => {
        let fn = () => {
            let contextDetector = new ContextDetectorHtml();
            contextDetector.noMoreCharacter();
            contextDetector.addCharacter('e');
        };
        expect(fn).to.throw("Can't add a character because noMoreCharacter() was called. Use reset() before adding any character");
    });

    it('should reset its state', () => {
        let contextDetector = new ContextDetectorHtml();
        let sourceCode      = '<script type="text/javascript">.<style type="text/css">.</style>';

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
        contextDetector.noMoreCharacter();
        contextDetector.reset();

        expect(contextDetector.getLanguageZoneList()).to.be.an('array').that.have.lengthOf(0);
        expect(contextDetector.isInContext()).to.equal(true);

        contextDetector.addCharacter(sourceCode[32]);
        contextDetector.addCharacter(sourceCode[33]);
        contextDetector.addCharacter(sourceCode[34]);
        contextDetector.addCharacter(sourceCode[35]);
        contextDetector.addCharacter(sourceCode[36]);
        contextDetector.addCharacter(sourceCode[37]);
        contextDetector.addCharacter(sourceCode[38]);
        contextDetector.addCharacter(sourceCode[39]);
        contextDetector.addCharacter(sourceCode[40]);
        contextDetector.addCharacter(sourceCode[41]);
        contextDetector.addCharacter(sourceCode[42]);
        contextDetector.addCharacter(sourceCode[43]);
        contextDetector.addCharacter(sourceCode[44]);
        contextDetector.addCharacter(sourceCode[45]);
        contextDetector.addCharacter(sourceCode[46]);
        contextDetector.addCharacter(sourceCode[47]);
        contextDetector.addCharacter(sourceCode[48]);
        contextDetector.addCharacter(sourceCode[49]);
        contextDetector.addCharacter(sourceCode[50]);
        contextDetector.addCharacter(sourceCode[51]);
        contextDetector.addCharacter(sourceCode[52]);
        contextDetector.addCharacter(sourceCode[53]);
        contextDetector.addCharacter(sourceCode[54]);
        contextDetector.addCharacter(sourceCode[55]);
        contextDetector.addCharacter(sourceCode[56]);
        contextDetector.addCharacter(sourceCode[57]);
        contextDetector.addCharacter(sourceCode[58]);
        contextDetector.addCharacter(sourceCode[59]);
        contextDetector.addCharacter(sourceCode[60]);
        contextDetector.addCharacter(sourceCode[61]);
        contextDetector.addCharacter(sourceCode[62]);
        contextDetector.addCharacter(sourceCode[63]);

        let languageZoneList = contextDetector.getLanguageZoneList();
        expect(languageZoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].languageName).to.equal('css');
        expect(languageZoneList[0].zoneList).to.be.an('array').that.have.lengthOf(1);
        expect(languageZoneList[0].zoneList[0].startPosition).to.equal(24);
        expect(languageZoneList[0].zoneList[0].endPosition).to.equal(25);
    });
});
