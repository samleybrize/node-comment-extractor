import { ParserHelperDeadZone } from '../../../../../src';

export class ParserHelperDeadZoneMock implements ParserHelperDeadZone {
    private isInDeadZoneProperty = false;
    private willBeInDeadZoneOnNextCharacter = false;
    private willLeaveDeadZoneOnNextCharacter = false;
    private lastCharacter = '';

    addCharacter(character:string) {
        this.lastCharacter = character;

        if (this.willBeInDeadZoneOnNextCharacter) {
            this.setIsInDeadZone(true);
            this.willBeInDeadZoneOnNextCharacter = false;
        } else if (this.willLeaveDeadZoneOnNextCharacter) {
            this.setIsInDeadZone(false);
            this.willLeaveDeadZoneOnNextCharacter = false;
        }
    }

    isInDeadZone() : boolean {
        return this.isInDeadZoneProperty;
    }

    reset() {
        this.isInDeadZoneProperty               = false;
        this.lastCharacter                      = '';
        this.willBeInDeadZoneOnNextCharacter    = false;
        this.willLeaveDeadZoneOnNextCharacter   = false;
    }

    setIsInDeadZone(isInDeadZone:boolean) {
        this.isInDeadZoneProperty = isInDeadZone;
    }

    setWillBeInDeadZoneOnNextCharacter(willBeInDeadZoneOnNextCharacter:boolean) {
        this.willBeInDeadZoneOnNextCharacter = willBeInDeadZoneOnNextCharacter;
    }

    setWillLeaveDeadZoneOnNextCharacter(willLeaveDeadZoneOnNextCharacter:boolean) {
        this.willLeaveDeadZoneOnNextCharacter = willLeaveDeadZoneOnNextCharacter;
    }

    getLastCharacter() : string {
        return this.lastCharacter;
    }
}
