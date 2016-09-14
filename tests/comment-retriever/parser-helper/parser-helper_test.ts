/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelper, SourceCodeString } from '../../../src';

import { ParserHelperCommentMockPosition } from '../../mock/comment-retriever/parser-helper/comment/comment-mock-position';
import { ParserHelperDeadZoneMockPosition } from '../../mock/comment-retriever/parser-helper/dead-zone/dead-zone-mock-position';

describe('parser helper', () => {
    it('should return all comments', () => {
        let sourceCodeContent       = '..\nZEddddddd\nWERT';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelper            = new ParserHelper();
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();

        parserHelperComment.addCommentPosition(3, 5);
        parserHelperComment.addCommentPosition(6, 10);
        parserHelperDeadZone.addDeadZonePosition(4, 5);
        parserHelperDeadZone.addDeadZonePosition(6, 10);
        let commentList             = parserHelper.getCommentList(sourceCode, parserHelperDeadZone, parserHelperComment);

        expect(commentList).to.be.an('array').that.have.lengthOf(2);

        expect(commentList[0].text).to.equal('ZE');
        expect(commentList[0].lineStart).to.equal(2);
        expect(commentList[0].sourceIdentifier).to.equal('parser-helper');

        expect(commentList[1].text).to.equal('WERT');
        expect(commentList[1].lineStart).to.equal(3);
        expect(commentList[1].sourceIdentifier).to.equal('parser-helper');
    });

    it('should be able to handle multiple files', () => {
        let sourceCodeContent1      = '..\nZEddddd\nWERT';
        let sourceCodeContent2      = '...\n\n\n!ZERT';
        let sourceCode1             = new SourceCodeString('parser-helper1', sourceCodeContent1);
        let sourceCode2             = new SourceCodeString('parser-helper2', sourceCodeContent2);
        let parserHelper            = new ParserHelper();
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();

        parserHelperComment.addCommentPosition(3, 5);
        parserHelperComment.addCommentPosition(6, 10);
        parserHelperDeadZone.addDeadZonePosition(4, 8);
        let commentList1            = parserHelper.getCommentList(sourceCode1, parserHelperDeadZone, parserHelperComment);
        parserHelperComment.reset();
        parserHelperDeadZone.reset();
        parserHelperComment.addCommentPosition(2, 6);
        parserHelperDeadZone.addDeadZonePosition(2, 6);
        let commentList2            = parserHelper.getCommentList(sourceCode2, parserHelperDeadZone, parserHelperComment);

        expect(commentList1).to.be.an('array').that.have.lengthOf(2);
        expect(commentList2).to.be.an('array').that.have.lengthOf(1);

        expect(commentList1[0].text).to.equal('ZE');
        expect(commentList1[0].lineStart).to.equal(2);
        expect(commentList1[0].sourceIdentifier).to.equal('parser-helper1');
        expect(commentList1[1].text).to.equal('WERT');
        expect(commentList1[1].lineStart).to.equal(3);
        expect(commentList1[1].sourceIdentifier).to.equal('parser-helper1');

        expect(commentList2[0].text).to.equal('ZERT');
        expect(commentList2[0].lineStart).to.equal(4);
        expect(commentList2[0].sourceIdentifier).to.equal('parser-helper2');
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent       = '..!ZE';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelper            = new ParserHelper();
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();

        parserHelperComment.addCommentPosition(3, 20);
        let commentList             = parserHelper.getCommentList(sourceCode, parserHelperDeadZone, parserHelperComment);

        expect(commentList).to.be.an('array').that.have.lengthOf(1);
        expect(commentList[0].text).to.equal('ZE');
        expect(commentList[0].lineStart).to.equal(1);
        expect(commentList[0].sourceIdentifier).to.equal('parser-helper');
    });
});
