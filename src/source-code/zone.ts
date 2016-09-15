/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export class SourceCodeZone {
    constructor(public startPosition:number, public endPosition:number) {
        if (startPosition > endPosition) {
            throw "Start position can't be higher than end position";
        }
    }

    isOverlapping(zone:SourceCodeZone) {
        return (zone.startPosition <= this.endPosition) && (zone.endPosition >= this.startPosition);
    }

    isAdjacentTo(zone:SourceCodeZone) {
        return (zone.endPosition === this.startPosition - 1) || (zone.startPosition === this.endPosition + 1);
    }

    /**
     * Collapses overlapping or adjacent zones
     * eg: zones are [3, 5] and [4, 6] => return [3, 6]
     * eg: zones are [3, 5] and [6, 7] => return [3, 7]
     */
    static mergeZoneList(zoneList:SourceCodeZone[]): SourceCodeZone[] {
        this.sortZoneListByStartPositionThenEndPositionAsc(zoneList);

        // merge zones
        // continue until no more change is made
        let previousLength;

        do {
            previousLength  = zoneList.length;
            zoneList        = this.doMergePass(zoneList);
        } while (zoneList.length != previousLength);

        return zoneList;
    }

    private static sortZoneListByStartPositionThenEndPositionAsc(zoneList:SourceCodeZone[]) {
        zoneList.sort((a, b) => {
            if (a.startPosition < b.startPosition) {
                return -1;
            } else if (a.startPosition > b.startPosition) {
                return 1;
            } else if (a.endPosition > b.endPosition) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    private static doMergePass(zoneList:SourceCodeZone[]): SourceCodeZone[] {
        // when two zones are merged, a new array is returned
        for (let i in zoneList) {
            for (let j in zoneList) {
                if (j <= i) {
                    continue;
                }

                if (zoneList[j].isAdjacentTo(zoneList[i]) || zoneList[j].isOverlapping(zoneList[i])) {
                    zoneList[i] = new SourceCodeZone(
                        Math.min(zoneList[i].startPosition, zoneList[j].startPosition),
                        Math.max(zoneList[i].endPosition, zoneList[j].endPosition)
                    );
                    zoneList.splice(+j, 1);
                    return zoneList;
                }
            }
        }

        return zoneList;
    }
}
