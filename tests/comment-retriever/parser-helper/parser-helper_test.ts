/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelper, SourceCodeString } from '../../../src';

import { ContextDetectorMock } from '../../mock/comment-retriever/parser-helper/context-detector/context-detector-mock';
import { ParserHelperCommentMockPosition } from '../../mock/comment-retriever/parser-helper/comment/comment-mock-position';
import { ParserHelperDeadZoneMockPosition } from '../../mock/comment-retriever/parser-helper/dead-zone/dead-zone-mock-position';

describe('parser helper', () => {
    it('should return all comments', () => {
        let sourceCodeContent       = '..\nZEddddddd\nWERT';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        parserHelperComment.addCommentPosition(3, 5);
        parserHelperComment.addCommentPosition(6, 10);
        parserHelperDeadZone.addDeadZonePosition(4, 5);
        parserHelperDeadZone.addDeadZonePosition(6, 10);

        return parserHelper.getCommentList().then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(2);

            expect(commentList[0].text).to.equal('ZE');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('parser-helper');

            expect(commentList[1].text).to.equal('WERT');
            expect(commentList[1].lineStart).to.equal(3);
            expect(commentList[1].sourceIdentifier).to.equal('parser-helper');
        });
    });

    it('should return the same comment list on subsequent calls to getCommentList()', () => {
        let sourceCodeContent       = '..\nZEddddd\nWERT';
        let sourceCode              = new SourceCodeString('parser-helper1', sourceCodeContent);
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        parserHelperComment.addCommentPosition(3, 5);
        parserHelperComment.addCommentPosition(6, 10);
        parserHelperDeadZone.addDeadZonePosition(4, 8);

        let commentList1;
        let commentList2;
        return parserHelper.getCommentList()
            .then((commentList) => {
                commentList1 = commentList;
                return parserHelper.getCommentList();
            })
            .then((commentList) => {
                commentList2 = commentList;

                expect(commentList1).to.be.an('array').that.have.lengthOf(2);
                expect(commentList2).to.be.an('array').that.have.lengthOf(2);

                expect(commentList1[0].text).to.equal('ZE');
                expect(commentList1[0].lineStart).to.equal(2);
                expect(commentList1[0].sourceIdentifier).to.equal('parser-helper1');
                expect(commentList1[1].text).to.equal('WERT');
                expect(commentList1[1].lineStart).to.equal(3);
                expect(commentList1[1].sourceIdentifier).to.equal('parser-helper1');

                expect(commentList2[0].text).to.equal('ZE');
                expect(commentList2[0].lineStart).to.equal(2);
                expect(commentList2[0].sourceIdentifier).to.equal('parser-helper1');
                expect(commentList2[1].text).to.equal('WERT');
                expect(commentList2[1].lineStart).to.equal(3);
                expect(commentList2[1].sourceIdentifier).to.equal('parser-helper1');
            })
        ;
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent       = '..!ZE';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        parserHelperComment.addCommentPosition(3, 20);

        return parserHelper.getCommentList().then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('ZE');
            expect(commentList[0].lineStart).to.equal(1);
            expect(commentList[0].sourceIdentifier).to.equal('parser-helper');
        });
    });

    it('should return comments in zones allowed by the context detector', () => {
        let sourceCodeContent       = '..!ZE!..';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();
        let contextDetector         = new ContextDetectorMock();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment, contextDetector);

        contextDetector.addContextRange(3, 6);
        parserHelperComment.addCommentPosition(1, 3);
        parserHelperComment.addCommentPosition(4, 6);

        return parserHelper.getCommentList().then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('ZE');
            expect(commentList[0].lineStart).to.equal(1);
            expect(commentList[0].sourceIdentifier).to.equal('parser-helper');
        });
    });

    it('should reset last comment text when enter in dead zone', () => {
        let sourceCodeContent       = '........';
        let sourceCode              = new SourceCodeString('parser-helper', sourceCodeContent);
        let parserHelperComment     = new ParserHelperCommentMockPosition();
        let parserHelperDeadZone    = new ParserHelperDeadZoneMockPosition();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        parserHelperComment.setLastCommentText('text');
        parserHelperDeadZone.addDeadZonePosition(1, 3);

        return parserHelper.getCommentList().then((commentList) => {
            expect(parserHelperComment.getLastCommentText()).to.equal(null);
        });
    });
});
