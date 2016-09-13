import { ParserHelperComment } from '../../../../../src';

export class ParserHelperCommentMock implements ParserHelperComment {
    private isInCommentProperty = false;
    private willBeInCommentOnNextCharacter = false;
    private willLeaveCommentOnNextCharacter = false;
    private commentLineStartOnNextCharacter;
    private lastCharacter = '';
    private buffer = '';
    private lastCommentText;
    private lastCommentLineStart;

    addCharacter(character:string) {
        this.lastCharacter = character;

        if (this.isInComment()) {
            this.buffer += character;
        }

        if (this.willBeInCommentOnNextCharacter) {
            this.setIsInComment(true);
            this.willBeInCommentOnNextCharacter = false;
            this.lastCommentLineStart           = this.commentLineStartOnNextCharacter ? this.commentLineStartOnNextCharacter : 1;
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

    getLastCommentLineStart(): number {
        return this.lastCommentLineStart;
    }

    reset() {
        this.isInCommentProperty                = false;
        this.buffer                             = '';
        this.lastCharacter                      = '';
        this.lastCommentText                    = null;
        this.lastCommentLineStart               = null;
        this.willBeInCommentOnNextCharacter     = false;
        this.willLeaveCommentOnNextCharacter    = false;
        this.commentLineStartOnNextCharacter    = null;
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

    setCommentLineStartOnNextCharacter(lineStart:number) {
        this.commentLineStartOnNextCharacter = lineStart;
    }

    getLastCharacter(): string {
        return this.lastCharacter;
    }
}
