import { ParserHelperComment } from '../../../../../src';

export class ParserHelperCommentMock implements ParserHelperComment {
    private isInCommentProperty = false;
    private willBeInCommentOnNextCharacter = false;
    private willLeaveCommentOnNextCharacter = false;
    private lastCharacter = '';
    private buffer = '';
    private lastCommentText;

    addCharacter(character:string) {
        this.lastCharacter = character;

        if (this.isInComment()) {
            this.buffer += character;
        }

        if (this.willBeInCommentOnNextCharacter) {
            this.setIsInComment(true);
            this.willBeInCommentOnNextCharacter = false;
        } else if (this.willLeaveCommentOnNextCharacter) {
            this.lastCommentText = this.buffer;
            this.setIsInComment(false);
            this.willLeaveCommentOnNextCharacter = false;
        }
    }

    isInComment(): boolean {
        return this.isInCommentProperty;
    }

    getLastCommentText(): string {
        return this.lastCommentText;
    }

    reset() {
        this.isInCommentProperty                = false;
        this.buffer                             = '';
        this.lastCharacter                      = '';
        this.lastCommentText                    = null;
        this.willBeInCommentOnNextCharacter     = false;
        this.willLeaveCommentOnNextCharacter    = false;
    }

    setIsInComment(isInComment:boolean) {
        this.isInCommentProperty    = isInComment;
        this.buffer                 = '';
    }

    setWillBeInCommentOnNextCharacter(willBeInCommentOnNextCharacter:boolean) {
        this.willBeInCommentOnNextCharacter = willBeInCommentOnNextCharacter;
    }

    setWillLeaveCommentOnNextCharacter(willLeaveCommentOnNextCharacter:boolean) {
        this.willLeaveCommentOnNextCharacter = willLeaveCommentOnNextCharacter;
    }

    getLastCharacter(): string {
        return this.lastCharacter;
    }
}
