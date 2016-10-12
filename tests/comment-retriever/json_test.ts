/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { CommentRetrieverJson, SourceCodeString, SourceCodeZone } from '../../src';

describe('comment retriever: json', () => {
    it('should return all comments', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.json');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode          = new SourceCodeString('json-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverJson();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(7);

            expect(commentList[0].text).to.equal('should appear1');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('json-sample');

            expect(commentList[1].text).to.equal('text\nshould appear2\ntext');
            expect(commentList[1].lineStart).to.equal(6);
            expect(commentList[1].sourceIdentifier).to.equal('json-sample');

            expect(commentList[2].text).to.equal('should appear3');
            expect(commentList[2].lineStart).to.equal(12);
            expect(commentList[2].sourceIdentifier).to.equal('json-sample');

            expect(commentList[3].text).to.equal('should appear4');
            expect(commentList[3].lineStart).to.equal(15);
            expect(commentList[3].sourceIdentifier).to.equal('json-sample');

            expect(commentList[4].text).to.equal('should appear5');
            expect(commentList[4].lineStart).to.equal(17);
            expect(commentList[4].sourceIdentifier).to.equal('json-sample');

            expect(commentList[5].text).to.equal('should appear6');
            expect(commentList[5].lineStart).to.equal(19);
            expect(commentList[5].sourceIdentifier).to.equal('json-sample');

            expect(commentList[6].text).to.equal('should "appear7"');
            expect(commentList[6].lineStart).to.equal(25);
            expect(commentList[6].sourceIdentifier).to.equal('json-sample');
        });
    });

    it('should be able to handle multiple files', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.json');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode1         = new SourceCodeString('json-sample1', sourceCodeContent);
        let sourceCode2         = new SourceCodeString('json-sample2', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverJson();

        return commentRetriever.getCommentList(sourceCode1)
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(7);
                expect(commentList[0].lineStart).to.equal(2);
                expect(commentList[1].lineStart).to.equal(6);
                expect(commentList[2].lineStart).to.equal(12);
                expect(commentList[3].lineStart).to.equal(15);
                expect(commentList[4].lineStart).to.equal(17);
                expect(commentList[5].lineStart).to.equal(19);
                expect(commentList[6].lineStart).to.equal(25);

                return commentRetriever.getCommentList(sourceCode2);
            })
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(7);
                expect(commentList[0].lineStart).to.equal(2);
                expect(commentList[1].lineStart).to.equal(6);
                expect(commentList[2].lineStart).to.equal(12);
                expect(commentList[3].lineStart).to.equal(15);
                expect(commentList[4].lineStart).to.equal(17);
                expect(commentList[5].lineStart).to.equal(19);
                expect(commentList[6].lineStart).to.equal(25);
            })
        ;
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent   = '\n// comment';
        let sourceCode          = new SourceCodeString('json-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverJson();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('json-sample');
        });
    });

    it('should ignore ignored zones', () => {
        let sourceCodeContent   = '/* ignored */ \n /* comment */';
        let sourceCode          = new SourceCodeString('json-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverJson();
        let ignoredZoneList     = [
            new SourceCodeZone(1, 13),
        ];

        return commentRetriever.getCommentList(sourceCode, ignoredZoneList).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('json-sample');
        });
    });

    it.skip('should ignore non-allowed zones', () => {
        
    });
});
