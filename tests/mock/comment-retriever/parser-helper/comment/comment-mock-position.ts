import { ParserHelperComment } from '../../../../../src';

export class ParserHelperCommentMockPosition implements ParserHelperComment {
    private isInCommentProperty = false;
    private lastCommentText;
    private commentTextBuffer = '';
    private characterCounter = 0;
    private enterInCommentAtCharacter:number[] = [];
    private leaveCommentAtCharacter:number[] = [];

    addCharacter(character:string) {
        this.characterCounter++;

        if (this.isInComment()) {
            this.commentTextBuffer += character;
        }

        if (this.enterInCommentAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.isInCommentProperty    = true;
            this.commentTextBuffer      = '';
        } else if (this.leaveCommentAtCharacter.indexOf(this.characterCounter) >= 0) {
            this.isInCommentProperty    = false;
            this.lastCommentText        = this.commentTextBuffer;
        }
    }

    isInComment(): boolean {
        return this.isInCommentProperty;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    getLastCommentLineStart(): number {
        return 1;
    }

    reset() {
        this.characterCounter           = 0;
        this.lastCommentText            = null;
        this.isInCommentProperty        = false;
        this.commentTextBuffer          = '';
        this.enterInCommentAtCharacter  = [];
        this.leaveCommentAtCharacter    = [];
    }

    addCommentPosition(characterStart:number, characterEnd:number) {
        this.enterInCommentAtCharacter.push(characterStart);
        this.leaveCommentAtCharacter.push(characterEnd);
    }
}
