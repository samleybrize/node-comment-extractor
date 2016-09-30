/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetrieverFactory } from './factory';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export interface CommentRetriever {
    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[]): Promise<Comment[]>;
    setCommentRetrieverFactory(commentRetrieverFactory:CommentRetrieverFactory);
}
