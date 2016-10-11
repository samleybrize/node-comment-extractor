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
import { ContextDetectorHtml, SourceCodeLanguageZoneList } from './parser-helper/context-detector/html';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export class CommentRetrieverHtml implements CommentRetriever {
    private commentRetrieverFactory:CommentRetrieverFactory;

    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[]): Promise<Comment[]> {
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneXmlTag());
        let parserHelperComment     = new ParserHelperCommentMultiLineXml();
        let contextDetector         = new ContextDetectorHtml();
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment, contextDetector);

        if (ignoredZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneIgnoredZone(ignoredZoneList));
        }

        return parserHelper.getCommentList()
            .then((commentList): Promise<Comment[]> => {
                return this.t(sourceCode, contextDetector.getLanguageZoneList(), ignoredZoneList);
            })
        ;
    }

    private t(sourceCode:SourceCode, languageZoneList:SourceCodeLanguageZoneList[], ignoredZoneList:SourceCodeZone[]): Promise<Comment[]> {
        for (let languageZone of languageZoneList) {
            console.log(languageZone.languageName);
            for (let zoneToProcess of languageZone.zoneList) {
                sourceCode.rewind();
                console.log(zoneToProcess);
                // promise.then(() => {

                // });
            }
        }

        return Promise.resolve([]);
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
