export interface SourceCode {
    getIdentifier(): string;
    getNextCharacter(): string;
    hasReachedEndOfSourceCode(): boolean;
}
