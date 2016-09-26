/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneBacktickedString } from './parser-helper/dead-zone/backticked-string';
import { ParserHelperDeadZoneCollection } from './parser-helper/dead-zone/dead-zone-collection';
import { ParserHelperDeadZoneDoubleQuotedString } from './parser-helper/dead-zone/double-quoted-string';
import { ParserHelperDeadZoneSingleQuotedString } from './parser-helper/dead-zone/single-quoted-string';
import { ParserHelperCommentCollection } from './parser-helper/comment/comment-collection';
import { ParserHelperCommentMultiLineSlashAsterisk } from './parser-helper/comment/multi-line-slash-asterisk';
import { ParserHelperCommentSingleLineDoubleSlash } from './parser-helper/comment/single-line-double-slash';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverTypescript implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneBacktickedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneDoubleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneSingleQuotedString());
        let parserHelperComment     = new ParserHelperCommentCollection();
        parserHelperComment.addParserHelper(new ParserHelperCommentMultiLineSlashAsterisk());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineDoubleSlash());
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        return parserHelper.getCommentList();
    }
}
