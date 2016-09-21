/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { commentRetrieverFactory, extractCommentsFromFile, extractCommentsFromString, fileExtensionMatcher } from '../src';

describe('functions', () => {
    describe('extractCommentsFromFile', () => {
        it('should return comments contained in a file', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/sample.php');
            return extractCommentsFromFile(fixtureFilePath)
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[0].text).to.equal('should appear1');
                    expect(commentList[0].lineStart).to.equal(3);

                    expect(commentList[1].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[1].text).to.equal('should appear2');
                    expect(commentList[1].lineStart).to.equal(5);

                    expect(commentList[2].sourceIdentifier).to.equal(fixtureFilePath);
                    expect(commentList[2].text).to.equal('should appear3');
                    expect(commentList[2].lineStart).to.equal(8);
                })
            ;
        });

        it.skip('should use the language provided as option', () => {
            
        });

        it('should use the identifier provided as option', () => {
            let fixtureFilePath = path.join(__dirname, '../../tests/fixtures/sample.php');
            return extractCommentsFromFile(fixtureFilePath, {identifier: 'custom_identifier'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[1].sourceIdentifier).to.equal('custom_identifier');
                    expect(commentList[2].sourceIdentifier).to.equal('custom_identifier');
                })
            ;
        });

        it.skip('should use the factory', () => {
            
        });

        it.skip('should use the file extension matcher', () => {
            
        });

        it.skip('should throw an error when language does not exists', () => {
            
        });
    });

    describe('extractCommentsFromString', () => {
        it('should return comments contained in a string', () => {
            let fixtureFilePath     = path.join(__dirname, '../../tests/fixtures/sample.php');
            let fixtureFileContent  = fs.readFileSync(fixtureFilePath, 'utf8');
            return extractCommentsFromString(fixtureFileContent, {language: 'php'})
                .then((commentList) => {
                    expect(commentList).to.be.an('array').that.have.lengthOf(3);
                    expect(commentList[0].sourceIdentifier).to.equal('unknown');
                    expect(commentList[0].text).to.equal('should appear1');
                    expect(commentList[0].lineStart).to.equal(3);

                    expect(commentList[1].sourceIdentifier).to.equal('unknown');
                    expect(commentList[1].text).to.equal('should appear2');
                    expect(commentList[1].lineStart).to.equal(5);

                    expect(commentList[2].sourceIdentifier).to.equal('unknown');
                    expect(commentList[2].text).to.equal('should appear3');
                    expect(commentList[2].lineStart).to.equal(8);
                })
            ;
        });

        it.skip('should use the language provided as option', () => {
            
        });

        it('should use the identifier provided as option', () => {
            let fixtureFilePath     = path.join(__dirname, '../../tests/fixtures/sample.php');
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

        it.skip('should use the factory', () => {
            
        });

        it.skip('should throw an error when language does not exists', () => {
            
        });
    });
});
