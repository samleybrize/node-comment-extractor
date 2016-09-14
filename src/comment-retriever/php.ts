/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneCollection } from './parser-helper/dead-zone/dead-zone-collection';
import { ParserHelperDeadZoneDoubleQuotedString } from './parser-helper/dead-zone/double-quoted-string';
import { ParserHelperDeadZoneHeredocString } from './parser-helper/dead-zone/heredoc-string';
import { ParserHelperDeadZoneSingleQuotedString } from './parser-helper/dead-zone/single-quoted-string';
import { ParserHelperCommentCollection } from './parser-helper/comment/comment-collection';
import { ParserHelperCommentMultiLineSlashAsterisk } from './parser-helper/comment/multi-line-slash-asterisk';
import { ParserHelperCommentSingleLineDoubleSlash } from './parser-helper/comment/single-line-double-slash';
import { ParserHelperCommentSingleLineSharp } from './parser-helper/comment/single-line-sharp';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverPhp implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Comment[] {
        let parserHelper            = new ParserHelper();
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneDoubleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneSingleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneHeredocString());
        let parserHelperComment     = new ParserHelperCommentCollection();
        parserHelperComment.addParserHelper(new ParserHelperCommentMultiLineSlashAsterisk());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineDoubleSlash());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineSharp());

        return parserHelper.getCommentList(sourceCode, parserHelperDeadZone, parserHelperComment);
    }
}
