/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { ParserHelperDeadZoneCollection } from '../../../../src';

import { ParserHelperDeadZoneMock } from '../../../mock/comment-retriever/parser-helper/dead-zone/dead-zone-mock';

describe('parser helper: dead zone: collection', () => {
    it('should be in dead zone if at least one of its parser helpers is in dead zone', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        expect(parserHelperCollection.isInDeadZone()).to.equal(false);
        parserHelperMock2.setIsInDeadZone(true);
        expect(parserHelperCollection.isInDeadZone()).to.equal(true);
    });

    it('should push characters to all of its parser helpers', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
        parserHelperCollection.addCharacter('r');
        expect(parserHelperMock1.getLastCharacter()).to.equal('r');
        expect(parserHelperMock2.getLastCharacter()).to.equal('r');
    });

    it('should push characters only to the parser helper that is in dead zone', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock2.setWillBeInDeadZoneOnNextCharacter(true);
        parserHelperCollection.addCharacter('a');
        parserHelperCollection.addCharacter('b');

        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('b');
        expect(parserHelperMock1.getCharacterCounter()).to.equal(2);
        expect(parserHelperMock2.getCharacterCounter()).to.equal(2);
    });

    it('should reset all of its parser helpers', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperMock1.addCharacter('r');
        parserHelperMock2.addCharacter('r');
        parserHelperCollection.reset();
        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
    });

    it('should not reset its parser helpers when one of them leaves dead zone', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperCollection.addCharacter('a');
        parserHelperMock2.setWillBeInDeadZoneOnNextCharacter(true);
        parserHelperCollection.addCharacter('b');
        parserHelperMock2.setWillLeaveDeadZoneOnNextCharacter(true);
        parserHelperCollection.addCharacter('c');
        expect(parserHelperMock1.getLastCharacter()).to.equal('');
        expect(parserHelperMock2.getLastCharacter()).to.equal('c');
        expect(parserHelperMock1.getCharacterCounter()).to.equal(3);
        expect(parserHelperMock2.getCharacterCounter()).to.equal(3);
    });

    it('should tell to all of its parser helpers to ignore the next character', () => {
        let parserHelperMock1       = new ParserHelperDeadZoneMock();
        let parserHelperMock2       = new ParserHelperDeadZoneMock();
        let parserHelperCollection  = new ParserHelperDeadZoneCollection();
        parserHelperCollection.addParserHelper(parserHelperMock1);
        parserHelperCollection.addParserHelper(parserHelperMock2);

        parserHelperCollection.nextCharacterIsIgnored();
        parserHelperCollection.nextCharacterIsIgnored();
        expect(parserHelperMock1.getCharacterCounter()).to.equal(2);
        expect(parserHelperMock2.getCharacterCounter()).to.equal(2);
    });
});
