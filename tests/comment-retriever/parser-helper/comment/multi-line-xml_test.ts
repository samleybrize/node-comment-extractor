/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperCommentMultiLineXml } from '../../../../src';

describe('parser helper: comment: multiline xml', () => {
    it('should not be in comment by default', () => {
        let parserHelper = new ParserHelperCommentMultiLineXml();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should enter in comment', () => {
        let sourceCodeString    = ' ' + '\n' + ' <!--\ncomment \n-->';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[1]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[2]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[4]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[5]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[6]);
        expect(parserHelper.isInComment()).to.equal(true);
    });

    it('should leave comment', () => {
        let sourceCodeString    = '<!-- comment \n -->';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[9]);
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[15]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[16]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[17]);
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should reset its state', () => {
        let sourceCodeString    = '<!-- ';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);

        parserHelper.reset();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should reset lastCommentText when it enter in a new comment', () => {
        let sourceCodeString    = '<!-- comment --> <!--';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

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
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        parserHelper.addCharacter(sourceCodeString[17]);
        parserHelper.addCharacter(sourceCodeString[18]);
        parserHelper.addCharacter(sourceCodeString[19]);
        parserHelper.addCharacter(sourceCodeString[20]);

        expect(parserHelper.getLastCommentText()).to.equal(null);
        expect(parserHelper.getLastCommentLineStart()).to.equal(null);
    });

    it('should return comment text', () => {
        let sourceCodeString    = '<!--- \n - comment \n \n k --->';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

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
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);
        parserHelper.addCharacter(sourceCodeString[16]);
        parserHelper.addCharacter(sourceCodeString[17]);
        parserHelper.addCharacter(sourceCodeString[18]);
        parserHelper.addCharacter(sourceCodeString[19]);
        parserHelper.addCharacter(sourceCodeString[20]);
        parserHelper.addCharacter(sourceCodeString[21]);
        parserHelper.addCharacter(sourceCodeString[22]);
        parserHelper.addCharacter(sourceCodeString[23]);
        parserHelper.addCharacter(sourceCodeString[24]);
        parserHelper.addCharacter(sourceCodeString[25]);
        parserHelper.addCharacter(sourceCodeString[26]);
        parserHelper.addCharacter(sourceCodeString[27]);

        expect(parserHelper.getLastCommentText()).to.equal('- comment\n\nk');
        expect(parserHelper.getLastCommentLineStart()).to.equal(2);
    });

    it('should end current comment when noMoreCharacter() is called', () => {
        let sourceCodeString    = '<!-- \n comment ';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

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
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);

        parserHelper.noMoreCharacter();
        expect(parserHelper.getLastCommentText()).to.equal('comment');
        expect(parserHelper.getLastCommentLineStart()).to.equal(2);
    });

    it('should reset lastCommentText when noMoreCharacter() is called', () => {
        let sourceCodeString    = '<!-- comment -->';
        let parserHelper        = new ParserHelperCommentMultiLineXml();

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
        parserHelper.addCharacter(sourceCodeString[10]);
        parserHelper.addCharacter(sourceCodeString[11]);
        parserHelper.addCharacter(sourceCodeString[12]);
        parserHelper.addCharacter(sourceCodeString[13]);
        parserHelper.addCharacter(sourceCodeString[14]);
        parserHelper.addCharacter(sourceCodeString[15]);

        parserHelper.noMoreCharacter();
        expect(parserHelper.getLastCommentText()).to.equal(null);
        expect(parserHelper.getLastCommentLineStart()).to.equal(null);
    });

    it('should throw an error when calling addCharacter() after noMoreCharacter()', () => {
        let fn = () => {
            let parserHelper = new ParserHelperCommentMultiLineXml();
            parserHelper.noMoreCharacter();
            parserHelper.addCharacter('e');
        };
        expect(fn).to.throw("Can't add a character because noMoreCharacter() was called. Use reset() before adding any character");
    });

    it('should accept a character when reset() was called after noMoreCharacter()', () => {
        let parserHelper = new ParserHelperCommentMultiLineXml();
        parserHelper.noMoreCharacter();
        parserHelper.reset();
        parserHelper.addCharacter('e');
    });
});
