/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { CommentRetrieverFactory } from './factory';
import { ContextDetectorPhp } from './parser-helper/context-detector/php';
import { ParserHelper } from './parser-helper/parser-helper';
import { ParserHelperDeadZoneAllowedZone } from './parser-helper/dead-zone/allowed-zone';
import { ParserHelperDeadZoneCollection } from './parser-helper/dead-zone/dead-zone-collection';
import { ParserHelperDeadZoneDoubleQuotedString } from './parser-helper/dead-zone/double-quoted-string';
import { ParserHelperDeadZoneHeredocString } from './parser-helper/dead-zone/heredoc-string';
import { ParserHelperDeadZoneIgnoredZone } from './parser-helper/dead-zone/ignored-zone';
import { ParserHelperDeadZoneSingleQuotedString } from './parser-helper/dead-zone/single-quoted-string';
import { ParserHelperCommentCollection } from './parser-helper/comment/comment-collection';
import { ParserHelperCommentMultiLineSlashAsterisk } from './parser-helper/comment/multi-line-slash-asterisk';
import { ParserHelperCommentSingleLineDoubleSlash } from './parser-helper/comment/single-line-double-slash';
import { ParserHelperCommentSingleLineSharp } from './parser-helper/comment/single-line-sharp';
import { SourceCode } from '../source-code/source-code';
import { SourceCodeZone } from '../source-code/zone';

export class CommentRetrieverPhp implements CommentRetriever {
    private commentRetrieverFactory:CommentRetrieverFactory;

    getCommentList(sourceCode:SourceCode, ignoredZoneList?:SourceCodeZone[], allowedZoneList?:SourceCodeZone[]): Promise<Comment[]> {
        let contextDetector         = new ContextDetectorPhp();
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneDoubleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneSingleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneHeredocString());
        let parserHelperComment     = new ParserHelperCommentCollection();
        parserHelperComment.addParserHelper(new ParserHelperCommentMultiLineSlashAsterisk());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineDoubleSlash());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineSharp());
        let parserHelper            = new ParserHelper(sourceCode, parserHelperDeadZone, parserHelperComment, contextDetector);

        if (ignoredZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneIgnoredZone(ignoredZoneList));
        }

        if (allowedZoneList) {
            parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneAllowedZone(allowedZoneList));
        }

        let commentListPhp:Comment[];

        return parserHelper.getCommentList()
            .then((commentList): Promise<Comment[]> => {
                commentListPhp              = commentList;
                let processedZoneList       = contextDetector.getProcessedZones();
                let commentRetrieverHtml    = this.getCommentRetrieverFactory().getNewCommentRetriever('html');
                sourceCode.rewind();

                return commentRetrieverHtml.getCommentList(sourceCode, processedZoneList);
            })
            .then((commentListHtml): Comment[] => {
                return commentListPhp.concat(commentListHtml);
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
