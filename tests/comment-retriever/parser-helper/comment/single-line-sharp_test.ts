import { expect } from 'chai';

import { ParserHelperCommentSingleLineSharp } from '../../../../src';

describe('parser helper: comment: single line sharp', () => {
    it('should not be in comment by default', () => {
        let parserHelper = new ParserHelperCommentSingleLineSharp();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should enter in comment', () => {
        let sourceCodeString    = ' ' + '\n' + '$t = 4; # comment';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

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
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[7]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[8]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[9]);
        expect(parserHelper.isInComment()).to.equal(false);
        parserHelper.addCharacter(sourceCodeString[10]);
        expect(parserHelper.isInComment()).to.equal(true);
    });

    it('should leave comment', () => {
        let sourceCodeString    = '# comment\n';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

        parserHelper.addCharacter(sourceCodeString[0]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[1]);
        parserHelper.addCharacter(sourceCodeString[2]);
        parserHelper.addCharacter(sourceCodeString[3]);
        expect(parserHelper.isInComment()).to.equal(true);
        parserHelper.addCharacter(sourceCodeString[9]);
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should reset its state', () => {
        let sourceCodeString    = '# ';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

        parserHelper.addCharacter(sourceCodeString[0]);
        parserHelper.addCharacter(sourceCodeString[1]);

        parserHelper.reset();
        expect(parserHelper.isInComment()).to.equal(false);
    });

    it('should reset lastCommentText when it enter in a new comment', () => {
        let sourceCodeString    = '# comment\n#';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

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

        expect(parserHelper.getLastCommentText()).to.equal(null);
        expect(parserHelper.getLastCommentLineStart()).to.equal(null);
    });

    it('should return comment text', () => {
        let sourceCodeString    = '### comment\n';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

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

        expect(parserHelper.getLastCommentText()).to.equal('comment');
        expect(parserHelper.getLastCommentLineStart()).to.equal(1);
    });

    it('should end current comment when noMoreCharacter() is called', () => {
        let sourceCodeString    = '### comment ';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

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

        parserHelper.noMoreCharacter();
        expect(parserHelper.getLastCommentText()).to.equal('comment');
        expect(parserHelper.getLastCommentLineStart()).to.equal(1);
    });

    it('should reset lastCommentText when noMoreCharacter() is called', () => {
        let sourceCodeString    = '# comment\n';
        let parserHelper        = new ParserHelperCommentSingleLineSharp();

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

        parserHelper.noMoreCharacter();
        expect(parserHelper.getLastCommentText()).to.equal(null);
        expect(parserHelper.getLastCommentLineStart()).to.equal(null);
    });

    it('should throw an error when calling addCharacter() after noMoreCharacter()', () => {
        let fn = () => {
            let parserHelper = new ParserHelperCommentSingleLineSharp();
            parserHelper.noMoreCharacter();
            parserHelper.addCharacter('e');
        };
        expect(fn).to.throw("Can't add a character because noMoreCharacter() was called. Use reset() before adding any character");
    });

    it('should accept a character when reset() was called after noMoreCharacter()', () => {
        let parserHelper = new ParserHelperCommentSingleLineSharp();
        parserHelper.noMoreCharacter();
        parserHelper.reset();
        parserHelper.addCharacter('e');
    });
});
