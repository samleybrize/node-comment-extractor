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
import { ParserHelperDeadZoneCollection } from './parser-helper/dead-zone/dead-zone-collection';
import { ParserHelperDeadZoneIgnoredZone } from './parser-helper/dead-zone/ignored-zone';
import { ParserHelperDeadZoneXmlTag } from './parser-helper/dead-zone/xml-tag';
import { ParserHelperCommentMultiLineXml } from './parser-helper/comment/multi-line-xml';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export class CommentRetrieverXml implements CommentRetriever {
    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[]): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneXmlTag());
        let parserHelperComment     = new ParserHelperCommentMultiLineXml();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment);

        if (ignoredZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneIgnoredZone(ignoredZoneList));
        }

        return parserHelper.getCommentList();
    }

    setCommentRetrieverFactory(commentRetrieverFactory:CommentRetrieverFactory) {
        //
    }
}
