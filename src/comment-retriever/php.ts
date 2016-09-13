import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { LineCounter } from '../line-counter';
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
        let lineCounter             = new LineCounter();
        let commentList:Comment[]   = [];
        let commentLineStart        = null;
        let parserHelperDeadZone    = new ParserHelperDeadZoneCollection();
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneDoubleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneSingleQuotedString());
        parserHelperDeadZone.addParserHelper(new ParserHelperDeadZoneHeredocString());
        let parserHelperComment     = new ParserHelperCommentCollection();
        parserHelperComment.addParserHelper(new ParserHelperCommentMultiLineSlashAsterisk());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineDoubleSlash());
        parserHelperComment.addParserHelper(new ParserHelperCommentSingleLineSharp());

        while (!sourceCode.hasReachedEndOfSourceCode()) {
            let character = sourceCode.getNextCharacter();
            lineCounter.addText(character);

            if (!parserHelperComment.isInComment()) {
                let isInDeadZone = parserHelperDeadZone.isInDeadZone();
                parserHelperDeadZone.addCharacter(character);

                if (isInDeadZone && !parserHelperDeadZone.isInDeadZone()) {
                    // just leaved a dead zone, we don't want to give the character to the comment parser helper
                    continue;
                }
            }

            if (!parserHelperDeadZone.isInDeadZone()) {
                let isInComment = parserHelperComment.isInComment();
                parserHelperComment.addCharacter(character);

                if (!isInComment && parserHelperComment.isInComment()) {
                    // entered in a comment
                    commentLineStart = lineCounter.getCurrentLineNumber();
                } else if (isInComment && !parserHelperComment.isInComment()) {
                    // leaved a comment
                    commentList.push(new Comment(
                        parserHelperComment.getLastCommentText(),
                        commentLineStart + parserHelperComment.getLastCommentLineStart() - 1,
                        sourceCode.getIdentifier()
                    ));
                    commentLineStart = null;
                }
            }
        }

        return commentList;
    }
}
