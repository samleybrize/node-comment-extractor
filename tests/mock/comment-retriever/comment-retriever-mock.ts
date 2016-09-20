/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment, CommentRetriever, SourceCode } from '../../../src';

export class CommentRetrieverMock implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        return;
    }
}
