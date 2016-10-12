/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { CommentRetrieverFactory } from './factory';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneAllowedZone } from './parser-helper/dead-zone/allowed-zone';
import { ParserHelperDeadZoneCollection } from './parser-helper/dead-zone/dead-zone-collection';
import { ParserHelperDeadZoneDoubleQuotedString } from './parser-helper/dead-zone/double-quoted-string';
import { ParserHelperDeadZoneIgnoredZone } from './parser-helper/dead-zone/ignored-zone';
import { ParserHelperDeadZoneSingleQuotedString } from './parser-helper/dead-zone/single-quoted-string';
import { ParserHelperCommentMultiLineSlashAsterisk } from './parser-helper/comment/multi-line-slash-asterisk';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export class CommentRetrieverCss implements CommentRetriever {
    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[], allowedZoneList?:SourceCodeZone[]): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneDoubleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneSingleQuotedString());
        let parserHelperComment     = new ParserHelperCommentMultiLineSlashAsterisk();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        if (ignoredZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneIgnoredZone(ignoredZoneList));
        }

        if (allowedZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneAllowedZone(allowedZoneList));
        }

        return parserHelper.getCommentList();
    }

    setCommentRetrieverFactory(commentRetrieverFactory:CommentRetrieverFactory) {
        //
    }
}
