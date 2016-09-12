import { ParserHelperDeadZone } from './dead-zone';

export class ParserHelperDeadZoneHeredocString implements ParserHelperDeadZone {
    private lastCharacter = '';
    private lastLastCharacter = '';
    private tagName = '';
    private tagNameBuffer = '';
    private stringBuffer = '';
    private isInString = false;
    private isInTagName = false;

    addCharacter(character:string) {
        if (this.isInTagName) {
            if ('\n' == character || '\r' == character) {
                this.tagName        = this.tagNameBuffer;
                this.tagName        = this.tagName.replace(/['"]/g, '');
                this.tagNameBuffer  = '';
                this.isInTagName    = false;
                this.isInString     = true;
                return;
            }

            this.tagNameBuffer += character;
            return;
        } else if (this.isInString) {
            if ('\n' == character || '\r' == character) {
                if (this.tagName == this.stringBuffer || `${this.tagName};` == this.stringBuffer) {
                    this.isInString = false;
                }

                this.stringBuffer = '';
                return;
            }

            this.stringBuffer += character;
        } else if (!this.isInDeadZone() && '<<<' == `${this.lastLastCharacter}${this.lastCharacter}${character}`) {
            this.isInTagName        = true;
            this.lastCharacter      = '';
            this.lastLastCharacter  = '';
        } else {
            this.lastLastCharacter  = this.lastCharacter;
            this.lastCharacter      = character;
        }
    }

    isInDeadZone(): boolean {
        return this.isInString || this.isInTagName;
    }

    reset() {
        this.isInString         = false;
        this.isInTagName        = false;
        this.lastCharacter      = '';
        this.lastLastCharacter  = '';
    }
}
