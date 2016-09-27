/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneXmlTag } from './parser-helper/dead-zone/xml-tag';
import { ParserHelperCommentMultiLineXml } from './parser-helper/comment/multi-line-xml';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverXml implements CommentRetriever {
    getCommentList(sourceCode:SourceCode): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneXmlTag();
        let parserHelperComment     = new ParserHelperCommentMultiLineXml();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        return parserHelper.getCommentList();
    }
}
