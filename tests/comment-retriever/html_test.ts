/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { CommentRetrieverHtml, SourceCodeString, SourceCodeZone } from '../../src';

describe('comment retriever: html', () => {
    it('should return all comments', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.html');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode          = new SourceCodeString('html-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverHtml();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(5);

            expect(commentList[0].text).to.equal('should appear 1');
            expect(commentList[0].lineStart).to.equal(23);
            expect(commentList[0].sourceIdentifier).to.equal('html-sample');

            expect(commentList[1].text).to.equal('// should appear 2');
            expect(commentList[1].lineStart).to.equal(24);
            expect(commentList[1].sourceIdentifier).to.equal('html-sample');

            expect(commentList[2].text).to.equal('should appear 3');
            expect(commentList[2].lineStart).to.equal(5);
            expect(commentList[2].sourceIdentifier).to.equal('html-sample');

            expect(commentList[3].text).to.equal('should appear 4');
            expect(commentList[3].lineStart).to.equal(9);
            expect(commentList[3].sourceIdentifier).to.equal('html-sample');

            expect(commentList[4].text).to.equal('should appear 5');
            expect(commentList[4].lineStart).to.equal(13);
            expect(commentList[4].sourceIdentifier).to.equal('html-sample');
        });
    });

    it('should be able to handle multiple files', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.html');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode1         = new SourceCodeString('html-sample1', sourceCodeContent);
        let sourceCode2         = new SourceCodeString('html-sample2', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverHtml();

        return commentRetriever.getCommentList(sourceCode1)
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(5);
                expect(commentList[0].lineStart).to.equal(23);
                expect(commentList[1].lineStart).to.equal(24);
                expect(commentList[2].lineStart).to.equal(5);
                expect(commentList[3].lineStart).to.equal(9);
                expect(commentList[4].lineStart).to.equal(13);

                return commentRetriever.getCommentList(sourceCode2);
            })
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(5);
                expect(commentList[0].lineStart).to.equal(23);
                expect(commentList[1].lineStart).to.equal(24);
                expect(commentList[2].lineStart).to.equal(5);
                expect(commentList[3].lineStart).to.equal(9);
                expect(commentList[4].lineStart).to.equal(13);
            })
        ;
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent   = '\n<!-- comment';
        let sourceCode          = new SourceCodeString('html-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverHtml();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('html-sample');
        });
    });

    it.skip('should use the given factory', () => {
        //
    });

    it('should ignore ignored zones', () => {
        let sourceCodeContent   = '<!-- ignored --> \n <!-- comment -->';
        let sourceCode          = new SourceCodeString('html-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverHtml();
        let ignoredZoneList     = [
            new SourceCodeZone(1, 16),
        ];

        return commentRetriever.getCommentList(sourceCode, ignoredZoneList).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('html-sample');
        });
    });
});
