/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperCommentCollection } from '../../../../src';

import { ParserHelperCommentMock } from '../../../mock/comment-retriever/parser-helper/comment/comment-mock';

describe('parser helper: comment: collection', () => {
    it('should be in comment if at least one of its parser helpers is in comment', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        expect(parserHelperCollection.isInComment()).to.equal(false);
        parserHelperMock2.setIsInComment(true);
        expect(parserHelperCollection.isInComment()).to.equal(true);
    });

    it('should push characters to all of its parser helpers', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
        parserHelperCollection.addCharacter('r');
        expect(parserHelperMock1.getLastCharacter()).to.equal('r');
        expect(parserHelperMock2.getLastCharacter()).to.equal('r');
    });

    it('should push characters only to the parser helper that is in comment', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('a');
        parserHelperCollection.addCharacter('b');

        expect(parserHelperMock1.getLastCharacter()).to.equal('a');
        expect(parserHelperMock2.getLastCharacter()).to.equal('b');
    });

    it('should reset all of its parser helpers', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock1.addCharacter('r');
        parserHelperMock2.addCharacter('r');
        parserHelperCollection.reset();
        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
    });

    it('should reset its last comment text', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('c');
        parserHelperCollection.addCharacter('b');
        parserHelperMock2.setWillLeaveCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('c');
        parserHelperCollection.reset();
        expect(parserHelperCollection.getLastCommentText()).to.equal(null);
    });

    it('should reset all of its parser helpers when one of them leaves comment', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperCollection.addCharacter('a');
        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('b');
        parserHelperMock2.setWillLeaveCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('c');
        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
    });

    it('should return comment text when one of its parser helpers leaves comment', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperCollection.addCharacter('a');
        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperMock2.setCommentLineStartOnNextCharacter(3);
        parserHelperCollection.addCharacter('b');
        parserHelperCollection.addCharacter('c');
        parserHelperCollection.addCharacter('d');
        parserHelperCollection.addCharacter('\n');
        parserHelperCollection.addCharacter('e');
        parserHelperCollection.addCharacter('f');
        parserHelperMock2.setWillLeaveCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('g');
        parserHelperCollection.addCharacter('h');

        expect(parserHelperMock1.getLastCommentText()).to.equal(null);
        expect(parserHelperMock2.getLastCommentText()).to.equal(null);
        expect(parserHelperCollection.getLastCommentText()).to.equal('cd\nefg');
        expect(parserHelperCollection.getLastCommentLineStart()).to.equal(3);
    });

    it('should empty last comment text when one of its parser helpers enters comment', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('a');
        parserHelperCollection.addCharacter('b');
        parserHelperMock2.setWillLeaveCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('c');
        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('d');
        parserHelperCollection.addCharacter('e');
        expect(parserHelperCollection.getLastCommentText()).to.equal(null);
        expect(parserHelperCollection.getLastCommentLineStart()).to.equal(null);
    });

    it('should end current comment when noMoreCharacter() is called', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperMock2.setCommentLineStartOnNextCharacter(3);
        parserHelperCollection.addCharacter('a');
        parserHelperCollection.addCharacter('b');
        parserHelperCollection.addCharacter('c');

        parserHelperCollection.noMoreCharacter();
        expect(parserHelperCollection.getLastCommentText()).to.equal('bc');
        expect(parserHelperCollection.getLastCommentLineStart()).to.equal(3);
    });

    it('should reset lastCommentText when noMoreCharacter() is called', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('a');
        parserHelperCollection.addCharacter('b');
        parserHelperCollection.addCharacter('c');
        parserHelperMock2.setWillLeaveCommentOnNextCharacter(true);
        parserHelperCollection.addCharacter('d');

        parserHelperCollection.noMoreCharacter();
        expect(parserHelperCollection.getLastCommentText()).to.equal(null);
        expect(parserHelperCollection.getLastCommentLineStart()).to.equal(null);
    });

    it('should throw an error when calling addCharacter() after noMoreCharacter()', () => {
        let fn = () => {
            let parserHelperMock1       = new ParserHelperCommentMock();
            let parserHelperMock2       = new ParserHelperCommentMock();
            let parserHelperCollection  = new ParserHelperCommentCollection();
            parserHelperCollection.addParserHelper(parserHelperMock1);
            parserHelperCollection.addParserHelper(parserHelperMock2);

            parserHelperCollection.noMoreCharacter();
            parserHelperCollection.addCharacter('e');
        };
        expect(fn).to.throw("Can't add a character because noMoreCharacter() was called. Use reset() before adding any character");
    });

    it('should accept a character when reset() was called after noMoreCharacter()', () => {
        let parserHelperMock1       = new ParserHelperCommentMock();
        let parserHelperMock2       = new ParserHelperCommentMock();
        let parserHelperCollection  = new ParserHelperCommentCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperCollection.noMoreCharacter();
        parserHelperCollection.reset();
        parserHelperCollection.addCharacter('e');
    });
});
