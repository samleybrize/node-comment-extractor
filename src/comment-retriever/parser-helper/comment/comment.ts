export interface ParserHelperComment {
    addCharacter(character:string);
    isInComment(): boolean;
    getLastCommentText(): string;
    getLastCommentLineStart(): number;
    reset();
}
