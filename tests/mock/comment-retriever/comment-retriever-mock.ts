/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment, CommentRetriever, SourceCode } from '../../../src';

export class CommentRetrieverMock implements CommentRetriever {
    private commentList:Comment[] = [];

    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        return Promise.resolve(this.commentList);
    }

    setCommentList(commentList:Comment[]) {
        this.commentList = commentList;
    }
}
