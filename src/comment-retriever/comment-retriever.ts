import { Comment } from '../comment';
import { SourceCode } from '../source-code/source-code';

export interface CommentRetriever {
    getCommentList(sourceCode:SourceCode) : Comment[];
}
