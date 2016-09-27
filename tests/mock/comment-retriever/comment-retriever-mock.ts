/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment, CommentRetriever, CommentRetrieverFactory, SourceCode } from '../../../src';

export class CommentRetrieverMock implements CommentRetriever {
    private commentList:Comment[] = [];
    private commentRetrieverFactory:CommentRetrieverFactory;

    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        return Promise.resolve(this.commentList);
    }

    setCommentRetrieverFactory(commentRetrieverFactory:CommentRetrieverFactory) {
        this.commentRetrieverFactory = commentRetrieverFactory;
    }

    setCommentList(commentList:Comment[]) {
        this.commentList = commentList;
    }

    getCommentRetrieverFactory(): CommentRetrieverFactory {
        return this.commentRetrieverFactory;
    }
}
