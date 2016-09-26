/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverHtml implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        return null;
    }
}
