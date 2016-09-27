/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { CommentRetrieverPhp, SourceCodeString } from '../../src';

describe('comment retriever: php', () => {
    it('should return all comments', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.php');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode          = new SourceCodeString('php-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverPhp();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(11);

            expect(commentList[0].text).to.equal('should appear1');
            expect(commentList[0].lineStart).to.equal(3);
            expect(commentList[0].sourceIdentifier).to.equal('php-sample');

            expect(commentList[1].text).to.equal('should appear2');
            expect(commentList[1].lineStart).to.equal(5);
            expect(commentList[1].sourceIdentifier).to.equal('php-sample');

            expect(commentList[2].text).to.equal('text\nshould appear3\ntext');
            expect(commentList[2].lineStart).to.equal(8);
            expect(commentList[2].sourceIdentifier).to.equal('php-sample');

            expect(commentList[3].text).to.equal('should appear8');
            expect(commentList[3].lineStart).to.equal(14);
            expect(commentList[3].sourceIdentifier).to.equal('php-sample');

            expect(commentList[4].text).to.equal('should appear4');
            expect(commentList[4].lineStart).to.equal(17);
            expect(commentList[4].sourceIdentifier).to.equal('php-sample');

            expect(commentList[5].text).to.equal('should appear5');
            expect(commentList[5].lineStart).to.equal(19);
            expect(commentList[5].sourceIdentifier).to.equal('php-sample');

            expect(commentList[6].text).to.equal('should appear6');
            expect(commentList[6].lineStart).to.equal(21);
            expect(commentList[6].sourceIdentifier).to.equal('php-sample');

            expect(commentList[7].text).to.equal('should appear7');
            expect(commentList[7].lineStart).to.equal(23);
            expect(commentList[7].sourceIdentifier).to.equal('php-sample');

            expect(commentList[8].text).to.equal("should 'appear9'");
            expect(commentList[8].lineStart).to.equal(70);
            expect(commentList[8].sourceIdentifier).to.equal('php-sample');

            expect(commentList[9].text).to.equal('should appear10');
            expect(commentList[9].lineStart).to.equal(78);
            expect(commentList[9].sourceIdentifier).to.equal('php-sample');

            expect(commentList[10].text).to.equal('// should appear11');
            expect(commentList[10].lineStart).to.equal(78);
            expect(commentList[10].sourceIdentifier).to.equal('php-sample');
        });
    });

    it('should be able to handle multiple files', () => {
        let fixtureFilePath     = path.join(__dirname, '../../../tests/fixtures/comment-retriever/sample.php');
        let sourceCodeContent   = fs.readFileSync(fixtureFilePath, 'utf8');
        let sourceCode1         = new SourceCodeString('php-sample1', sourceCodeContent);
        let sourceCode2         = new SourceCodeString('php-sample2', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverPhp();

        return commentRetriever.getCommentList(sourceCode1)
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(11);
                expect(commentList[0].lineStart).to.equal(3);
                expect(commentList[1].lineStart).to.equal(5);
                expect(commentList[2].lineStart).to.equal(8);
                expect(commentList[3].lineStart).to.equal(14);
                expect(commentList[4].lineStart).to.equal(17);
                expect(commentList[5].lineStart).to.equal(19);
                expect(commentList[6].lineStart).to.equal(21);
                expect(commentList[7].lineStart).to.equal(23);
                expect(commentList[8].lineStart).to.equal(70);
                expect(commentList[9].lineStart).to.equal(78);
                expect(commentList[10].lineStart).to.equal(78);

                return commentRetriever.getCommentList(sourceCode2);
            })
            .then((commentList) => {
                expect(commentList).to.be.an('array').that.have.lengthOf(11);
                expect(commentList[0].lineStart).to.equal(3);
                expect(commentList[1].lineStart).to.equal(5);
                expect(commentList[2].lineStart).to.equal(8);
                expect(commentList[3].lineStart).to.equal(14);
                expect(commentList[4].lineStart).to.equal(17);
                expect(commentList[5].lineStart).to.equal(19);
                expect(commentList[6].lineStart).to.equal(21);
                expect(commentList[7].lineStart).to.equal(23);
                expect(commentList[8].lineStart).to.equal(70);
                expect(commentList[9].lineStart).to.equal(78);
                expect(commentList[10].lineStart).to.equal(78);
            })
        ;
    });

    it('should add a non-ended comment when reached the end of the source code', () => {
        let sourceCodeContent   = '<?php\n// comment';
        let sourceCode          = new SourceCodeString('php-sample', sourceCodeContent);
        let commentRetriever    = new CommentRetrieverPhp();

        return commentRetriever.getCommentList(sourceCode).then((commentList) => {
            expect(commentList).to.be.an('array').that.have.lengthOf(1);
            expect(commentList[0].text).to.equal('comment');
            expect(commentList[0].lineStart).to.equal(2);
            expect(commentList[0].sourceIdentifier).to.equal('php-sample');
        });
    });
});
