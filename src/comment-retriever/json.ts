/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneDoubleQuotedString } from './parser-helper/dead-zone/double-quoted-string';
import { ParserHelperCommentCollection } from './parser-helper/comment/comment-collection';
import { ParserHelperCommentMultiLineSlashAsterisk } from './parser-helper/comment/multi-line-slash-asterisk';
import { ParserHelperCommentSingleLineDoubleSlash } from './parser-helper/comment/single-line-double-slash';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverJson implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneDoubleQuotedString();
        let parserHelperComment     = new ParserHelperCommentCollection();
        parserHelperComment.addParserHelper(new ParserHelperCommentMultiLineSlashAsterisk());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineDoubleSlash());
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        return parserHelper.getCommentList();
    }
}
