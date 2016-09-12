import { expect } from 'chai';

import { ParserHelperCommentMultiLineSlashAsterisk } from '../../../../src';

describe('parser helper: comment: multiline slash asterisk', () => {
    it('should not be in comment by default', () => {
        let parserHelper = new ParserHelperCommentMultiLineSlashAsterisk();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should enter in comment', () => {
        let sourceCodeString    = ' ' + '\n' + '  /*\ncomment \n*/';
        let parserHelper        = new ParserHelperCommentMultiLineSlashAsterisk();

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
        expect(parserHelper.isInComment()).to.equal(true);
    });

    it('should leave comment', () => {
        let sourceCodeString    = '/* comment \n   */';
        let parserHelper        = new ParserHelperCommentMultiLineSlashAsterisk();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);
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
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should reset its state', () => {
        let sourceCodeString    = '/* ';
        let parserHelper        = new ParserHelperCommentMultiLineSlashAsterisk();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);

        parserHelper.reset();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should return comment text', () => {
        let sourceCodeString    = '/** \n * comment \n **/';
        let parserHelper        = new ParserHelperCommentMultiLineSlashAsterisk();

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

        expect(parserHelper.getLastCommentText()).to.equal('comment');
    });
});
