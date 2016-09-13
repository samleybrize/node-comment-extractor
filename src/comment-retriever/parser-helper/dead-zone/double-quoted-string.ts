import { ParserHelperDeadZone } from './dead-zone';

export class ParserHelperDeadZoneDoubleQuotedString implements ParserHelperDeadZone {
    private lastCharacter = '';
    private isInString = false;

    addCharacter(character:string) {
        if (!this.isInDeadZone() && '"' == character) {
            this.isInString = true;
        } else if (this.isInDeadZone() && '"' == character && '\\' != this.lastCharacter) {
            this.isInString = false;
        }

        this.lastCharacter = character;
    }

    isInDeadZone(): boolean {
        return this.isInString;
    }

    reset() {
        this.isInString     = false;
        this.lastCharacter  = '';
    }
}
