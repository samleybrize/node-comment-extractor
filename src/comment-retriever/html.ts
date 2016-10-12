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
import { ParserHelperDeadZoneIgnoredZone } from './parser-helper/dead-zone/ignored-zone';
import { ParserHelperDeadZoneXmlTag } from './parser-helper/dead-zone/xml-tag';
import { ParserHelperCommentMultiLineXml } from './parser-helper/comment/multi-line-xml';
import { ContextDetectorHtml, SourceCodeLanguageZone } from './parser-helper/context-detector/html';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export class CommentRetrieverHtml implements CommentRetriever {
    private commentRetrieverFactory:CommentRetrieverFactory;

    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[], allowedZoneList?:SourceCodeZone[]): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneXmlTag());
        let parserHelperComment     = new ParserHelperCommentMultiLineXml();
        let contextDetector         = new ContextDetectorHtml();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment, contextDetector);

        if (ignoredZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneIgnoredZone(ignoredZoneList));
        }

        if (allowedZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneAllowedZone(allowedZoneList));
        }

        return parserHelper.getCommentList()
            .then((commentList): Promise<Comment[]> => {
                return this.processLanguageZoneList(sourceCode, contextDetector.getLanguageZoneList(), commentList);
            })
        ;
    }

    private processLanguageZoneList(sourceCode:SourceCode, languageZoneList:SourceCodeLanguageZone[], commentList:Comment[]): Promise<Comment[]> {
        if (0 == languageZoneList.length) {
            return Promise.resolve(commentList);
        }

        let languageZone = languageZoneList.shift();
        let parserHelper:CommentRetriever;

        try {
            parserHelper = this.getCommentRetrieverFactory().getNewCommentRetriever(languageZone.languageName);
        } catch (error) {
            return this.processLanguageZoneList(sourceCode, languageZoneList, commentList);
        }

        sourceCode.rewind();
        return parserHelper.getCommentList(sourceCode, null, [languageZone.zone])
            .then((languageZoneCommentList) => {
                commentList = commentList.concat(languageZoneCommentList);
                return this.processLanguageZoneList(sourceCode, languageZoneList, commentList);
            })
        ;
    }

    setCommentRetrieverFactory(commentRetrieverFactory:CommentRetrieverFactory) {
        this.commentRetrieverFactory = commentRetrieverFactory;
    }

    private getCommentRetrieverFactory(): CommentRetrieverFactory {
        if (!this.commentRetrieverFactory) {
            this.commentRetrieverFactory = new CommentRetrieverFactory();
        }

        return this.commentRetrieverFactory;
    }
}
