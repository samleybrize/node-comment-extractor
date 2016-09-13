import { Comment } from '../../comment';
import { LineCounter } from '../../line-counter';
import { ParserHelperDeadZone } from './dead-zone/dead-zone';
import { ParserHelperComment } from './comment/comment';
import { SourceCode } from '../../source-code/source-code';

export class ParserHelper {
    getCommentList(sourceCode:SourceCode, parserHelperDeadZone:ParserHelperDeadZone, parserHelperComment:ParserHelperComment): Comment[] {
        let lineCounter             = new LineCounter();
        let commentList:Comment[]   = [];
        let commentLineStart        = null;

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
