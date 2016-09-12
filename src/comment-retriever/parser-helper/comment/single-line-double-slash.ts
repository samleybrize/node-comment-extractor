import { ParserHelperComment } from './comment';

export class ParserHelperCommentSingleLineDoubleSlash implements ParserHelperComment {
    addCharacter(character:string) {
        // TODO
    }

    isInComment(): boolean {
        // TODO

        return false;
    }

    getLastCommentText(): string {
        // TODO
        return '';
    }

    reset() {
        // TODO
    }
}
