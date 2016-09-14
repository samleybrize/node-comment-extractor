/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { SourceCode } from '../source-code/source-code';

export interface CommentRetriever {
    getCommentList(sourceCode:SourceCode): Comment[];
}
