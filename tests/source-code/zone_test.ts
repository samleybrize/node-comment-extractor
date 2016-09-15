/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { SourceCodeZone } from '../../src';

describe('source code: zone', () => {
    it('should return the right start and end positions', () => {
        let zone = new SourceCodeZone(5, 12);
        expect(zone.startPosition).to.equal(5);
        expect(zone.endPosition).to.equal(12);
    });

    it('should throw an error when start position is higher than end position', () => {
        let fn = () => {
            /* tslint:disable */
            new SourceCodeZone(5, 3);
            /* tslint:enable */
        };
        expect(fn).to.throw("Start position can't be higher than end position");
    });

    it('should indicate that it is adjacent', () => {
        let zone1 = new SourceCodeZone(3, 7);
        let zone2 = new SourceCodeZone(8, 10);
        let zone3 = new SourceCodeZone(1, 2);

        expect(zone1.isAdjacentTo(zone2)).to.equal(true);
        expect(zone2.isAdjacentTo(zone1)).to.equal(true);
        expect(zone1.isAdjacentTo(zone3)).to.equal(true);
        expect(zone3.isAdjacentTo(zone1)).to.equal(true);
    });

    it('should indicate that it is not adjacent', () => {
        let zone1 = new SourceCodeZone(3, 7);
        let zone2 = new SourceCodeZone(7, 10);
        let zone3 = new SourceCodeZone(15, 20);

        expect(zone1.isAdjacentTo(zone2)).to.equal(false);
        expect(zone2.isAdjacentTo(zone1)).to.equal(false);
        expect(zone1.isAdjacentTo(zone3)).to.equal(false);
        expect(zone3.isAdjacentTo(zone1)).to.equal(false);
    });

    it('should indicate that it is overlapping', () => {
        let zone1 = new SourceCodeZone(2, 5);
        let zone2 = new SourceCodeZone(2, 3);
        let zone3 = new SourceCodeZone(3, 4);
        let zone4 = new SourceCodeZone(4, 5);
        let zone5 = new SourceCodeZone(4, 6);
        let zone6 = new SourceCodeZone(5, 7);

        expect(zone1.isOverlapping(zone1)).to.equal(true);
        expect(zone1.isOverlapping(zone2)).to.equal(true);
        expect(zone2.isOverlapping(zone1)).to.equal(true);
        expect(zone1.isOverlapping(zone3)).to.equal(true);
        expect(zone3.isOverlapping(zone1)).to.equal(true);
        expect(zone1.isOverlapping(zone4)).to.equal(true);
        expect(zone4.isOverlapping(zone1)).to.equal(true);
        expect(zone1.isOverlapping(zone5)).to.equal(true);
        expect(zone5.isOverlapping(zone1)).to.equal(true);
        expect(zone1.isOverlapping(zone6)).to.equal(true);
        expect(zone6.isOverlapping(zone1)).to.equal(true);
    });

    it('should indicate that it is not overlapping', () => {
        let zone1 = new SourceCodeZone(2, 5);
        let zone2 = new SourceCodeZone(6, 7);
        let zone3 = new SourceCodeZone(1, 1);
        let zone4 = new SourceCodeZone(15, 20);

        expect(zone1.isOverlapping(zone2)).to.equal(false);
        expect(zone2.isOverlapping(zone1)).to.equal(false);
        expect(zone1.isOverlapping(zone3)).to.equal(false);
        expect(zone3.isOverlapping(zone1)).to.equal(false);
        expect(zone1.isOverlapping(zone4)).to.equal(false);
        expect(zone4.isOverlapping(zone1)).to.equal(false);
    });

    it('should merge zones (case 1)', () => {
        // .iiii.
        // .jj...
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(2, 3),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(5);
    });

    it('should merge zones (case 2)', () => {
        // .ii...
        // .jjjj.
        let zoneList = [
            new SourceCodeZone(2, 3),
            new SourceCodeZone(2, 5),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(5);
    });

    it('should merge zones (case 3)', () => {
        // .iiii.
        // .jjjj.
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(2, 5),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(5);
    });

    it('should merge zones (case 4)', () => {
        // .iiii.
        // ..jj..
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(3, 4),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(5);
    });

    it('should merge zones (case 5)', () => {
        // .iiii.
        // ...jj.
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(4, 5),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(5);
    });

    it('should merge zones (case 6)', () => {
        // .iiii..
        // ...jjj.
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(4, 6),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(6);
    });

    it('should merge zones (case 7)', () => {
        // .iiii...
        // ....jjj.
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(5, 7),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(7);
    });

    it('should merge zones (case 8)', () => {
        // .iiii...
        // .....jj.
        let zoneList = [
            new SourceCodeZone(2, 5),
            new SourceCodeZone(6, 7),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(1);

        expect(mergedZoneList[0].startPosition).to.equal(2);
        expect(mergedZoneList[0].endPosition).to.equal(7);
    });

    it('should merge more than two zones', () => {
        let zoneList = [
            new SourceCodeZone(4, 6),
            new SourceCodeZone(3, 5),
            new SourceCodeZone(9, 11),
            new SourceCodeZone(13, 14),
            new SourceCodeZone(5, 8),
        ];
        let mergedZoneList = SourceCodeZone.mergeZoneList(zoneList);

        expect(mergedZoneList).to.be.an('array').that.have.lengthOf(2);

        expect(mergedZoneList[0].startPosition).to.equal(3);
        expect(mergedZoneList[0].endPosition).to.equal(11);
        expect(mergedZoneList[1].startPosition).to.equal(13);
        expect(mergedZoneList[1].endPosition).to.equal(14);
    });
});
