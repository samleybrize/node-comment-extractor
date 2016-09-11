import { expect } from 'chai';
import * as path from 'path';

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

        expect(parserHelperMock1.getLastCharacter()).to.equal('a');
        expect(parserHelperMock2.getLastCharacter()).to.equal('b');
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

    it('should reset all of its parser helpers when one of them leaves dead zone', () => {
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
        expect(parserHelperMock2.getLastCharacter()).to.equal('');
    });
});
