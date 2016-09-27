/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { CommentRetrieverXml, SourceCodeString } from '../../src';

describe('comment retriever: xml', () => {
    it('should return all comments', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.xml');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode          = new SourceCodeString('xml-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverXml();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(2);

            expect(commentList[0].text).to.equal('should appear 1');
            expect(commentList[0].lineStart).to.equal(5);
            expect(commentList[0].sourceIdentifier).to.equal('xml-sample');

            expect(commentList[1].text).to.equal('// should appear 2');
            expect(commentList[1].lineStart).to.equal(6);
            expect(commentList[1].sourceIdentifier).to.equal('xml-sample');
        });
    });

    it('should be able to handle multiple files', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.xml');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode1         = new SourceCodeString('xml-sample1', sourceCodeContent);
        let sourceCode2         = new SourceCodeString('xml-sample2', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverXml();

        return commentRetriever.getCommentList(sourceCode1)
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(2);
                expect(commentList[0].lineStart).to.equal(5);
                expect(commentList[1].lineStart).to.equal(6);

                return commentRetriever.getCommentList(sourceCode2);
            })
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(2);
                expect(commentList[0].lineStart).to.equal(5);
                expect(commentList[1].lineStart).to.equal(6);
            })
        ;
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent   = '\n<!-- comment';
        let sourceCode          = new SourceCodeString('xml-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverXml();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('xml-sample');
        });
    });
});
