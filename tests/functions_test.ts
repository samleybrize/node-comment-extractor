/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { Comment, commentRetrieverFactory, extractCommentsFromFile, extractCommentsFromString, extractTodosFromComments, fileExtensionMatcher } from '../src';
import { CommentRetrieverMock } from './mock/comment-retriever/comment-retriever-mock';

describe('functions', () => {
    describe('extractCommentsFromFile', () => {
        it('should return comments contained in a file', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            return extractCommentsFromFile(fixtureFilePath)
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[0].text).to.equal('php comment 1');
                    expect(commentList[0].lineStart).to.equal(3);

                    expect(commentList[1].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[1].text).to.equal('php comment 2');
                    expect(commentList[1].lineStart).to.equal(5);

                    expect(commentList[2].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[2].text).to.equal('php comment 3');
                    expect(commentList[2].lineStart).to.equal(8);
                })
            ;
        });

        it('should use the language provided as option', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/functions/sample.css.php');
            return extractCommentsFromFile(fixtureFilePath, {language: 'css'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(1);
                    expect(commentList[0].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[0].text).to.equal('css comment 1');
                    expect(commentList[0].lineStart).to.equal(1);
                })
            ;
        });

        it('should use the identifier provided as option', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            return extractCommentsFromFile(fixtureFilePath, {identifier: 'custom_identifier'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[1].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[2].sourceIdentifier).to.equal('custom_identifier');
                })
            ;
        });

        it('should use the factory', () => {
            let fixtureFilePath         = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            let commentRetrieverMock    = new CommentRetrieverMock();
            commentRetrieverMock.setCommentList([
                new Comment('comment1', 5, 'id'),
            ]);
            commentRetrieverFactory.addBuilder('custom-language', () => commentRetrieverMock);

            return extractCommentsFromFile(fixtureFilePath, {language: 'custom-language'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(1);
                    expect(commentList[0].sourceIdentifier).to.equal('id');
                    expect(commentList[0].text).to.equal('comment1');
                    expect(commentList[0].lineStart).to.equal(5);
                })
            ;
        });

        it('should use the file extension matcher', () => {
            fileExtensionMatcher.addAssociation('dummy', 'php');
            let fixtureFilePath         = path.join(__dirname, '../../tests/fixtures/functions/sample.dummy');
            return extractCommentsFromFile(fixtureFilePath)
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].lineStart).to.equal(3);
                    expect(commentList[1].lineStart).to.equal(5);
                    expect(commentList[2].lineStart).to.equal(8);
                })
            ;
        });

        it('should throw an error when file does not exists', () => {
            let fixtureFilePath = 'file-that-does-not-exists.php';
            return expect(extractCommentsFromFile(fixtureFilePath)).to.eventually.be.rejectedWith("no such file or directory, access 'file-that-does-not-exists.php'");
        });

        it('should throw an error when language does not exists', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            return expect(extractCommentsFromFile(fixtureFilePath, {language: 'unknown-language'})).to.eventually.be.rejectedWith('Unknown language "unknown-language"');
        });
    });

    describe('extractCommentsFromString', () => {
        it('should return comments contained in a string', () => {
            let fixtureFilePath     = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            let fixtureFileContent  = fs.readFileSync(fixtureFilePath, 'utf8');
            return extractCommentsFromString(fixtureFileContent, {language: 'php'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal('unknown');
                    expect(commentList[0].text).to.equal('php comment 1');
                    expect(commentList[0].lineStart).to.equal(3);

                    expect(commentList[1].sourceIdentifier).to.equal('unknown');
                    expect(commentList[1].text).to.equal('php comment 2');
                    expect(commentList[1].lineStart).to.equal(5);

                    expect(commentList[2].sourceIdentifier).to.equal('unknown');
                    expect(commentList[2].text).to.equal('php comment 3');
                    expect(commentList[2].lineStart).to.equal(8);
                })
            ;
        });

        it('should use the identifier provided as option', () => {
            let fixtureFilePath     = path.join(__dirname, '../../tests/fixtures/functions/sample.php');
            let fixtureFileContent  = fs.readFileSync(fixtureFilePath, 'utf8');
            return extractCommentsFromString(fixtureFileContent, {identifier: 'custom_identifier', language: 'php'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[1].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[2].sourceIdentifier).to.equal('custom_identifier');
                })
            ;
        });

        it('should use the factory', () => {
            let commentRetrieverMock = new CommentRetrieverMock();
            commentRetrieverMock.setCommentList([
                new Comment('comment1', 5, 'id'),
            ]);
            commentRetrieverFactory.addBuilder('custom-language', () => commentRetrieverMock);

            return extractCommentsFromString('', {language: 'custom-language'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(1);
                    expect(commentList[0].sourceIdentifier).to.equal('id');
                    expect(commentList[0].text).to.equal('comment1');
                    expect(commentList[0].lineStart).to.equal(5);
                })
            ;
        });

        it('should throw an error when language does not exists', () => {
            return expect(extractCommentsFromString('', {language: 'unknown-language'})).to.eventually.be.rejectedWith('Unknown language "unknown-language"');
        });
    });

    describe('extractTodosFromComments', () => {
        it('should return all todos', () => {
            let commentList = [
                new Comment('TODO text 1', 3, 'id'),
                new Comment('text before\n TODO text 6 TODO text 7', 145, 'id4'),
            ];
            let todoList = extractTodosFromComments(commentList);

            expect(todoList).to.be.an('array').that.have.lengthOf(2);

            expect(todoList[0].text).to.equal('TODO text 1');
            expect(todoList[0].line).to.equal(3);
            expect(todoList[0].sourceIdentifier).to.equal('id');

            expect(todoList[1].text).to.equal('TODO text 6 TODO text 7');
            expect(todoList[1].line).to.equal(146);
            expect(todoList[1].sourceIdentifier).to.equal('id4');
        });

        it('should interpret user defined tags', () => {
            let commentList = [
                new Comment('text before custom_tag text 1', 6, 'id1'),
                new Comment('text before\n OTHER-TAG text 2\r\ntext after', 9, 'id2'),
                new Comment('TODO should not appear', 56, 'id3'),
            ];
            let todoList = extractTodosFromComments(commentList, ['custom_tag', 'OTHER-TAG']);

            expect(todoList).to.be.an('array').that.have.lengthOf(2);

            expect(todoList[0].text).to.equal('custom_tag text 1');
            expect(todoList[0].line).to.equal(6);
            expect(todoList[0].sourceIdentifier).to.equal('id1');

            expect(todoList[1].text).to.equal('OTHER-TAG text 2');
            expect(todoList[1].line).to.equal(10);
            expect(todoList[1].sourceIdentifier).to.equal('id2');
        });

        it('should throw an error when an invalid tag is detected', () => {
            let fn = () => {
                extractTodosFromComments([], ['valid_tag', 'invalid tag']);
            };
            expect(fn).to.throw('White spaces are not allowed');
        });
    });
});
