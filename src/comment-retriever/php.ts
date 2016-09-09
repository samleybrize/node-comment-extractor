import { Comment } from '../comment';
import { CommentRetriever } from './comment-retriever';
import { SourceCode } from '../source-code/source-code';

export class CommentRetrieverPhp implements CommentRetriever {
    getCommentList(sourceCode:SourceCode) : Comment[] {
        let isInSingleLineComment   = false;
        let isInMultiLineComment    = false;
        let isInSingleQuotedString  = false;
        let isInDoubleQuotedString  = false;
        let isInHereDocString       = false;
        let isInHereDocTag          = false;
        let hereDocTag              = null;
        let previousChar            = "";
        let charDouble              = "";
        let charTriple              = "";
        let buffer                  = "";
        let commentList:Comment[]   = [];

        while (!sourceCode.hasReachedEndOfSourceCode) {
            let char        = sourceCode.getNextCharacter();
            charTriple      = charDouble + char;
            charDouble      = previousChar + char;
            previousChar    = char;

            if (isInDoubleQuotedString && '"' == char && '\\"' != charDouble) {
                isInDoubleQuotedString = false;
                continue;
            } else if (isInSingleQuotedString && "'" == char && "\\'" != charDouble) {
                isInSingleQuotedString = false;
                continue;
            } else if (isInHereDocTag) {
                if ("\n" == char || "\r" == char) {
                    hereDocTag          = buffer;
                    hereDocTag          = hereDocTag.replace(/['"]/g, '');
                    buffer              = "";
                    isInHereDocTag      = false;
                    isInHereDocString   = true;
                    continue;
                }

                buffer += char;
                continue;
            } else if (isInHereDocString) {
                if ("\n" == char || "\r" == char) {
                    if (hereDocTag == buffer || `${hereDocTag};` == buffer) {
                        isInHereDocString = false;
                    }

                    buffer = "";
                    continue;
                }

                buffer += char;
                continue;
            } else if (isInSingleQuotedString || isInDoubleQuotedString || isInHereDocString) {
                continue;
            } else if ('"' == char) {
                isInDoubleQuotedString = true;
                continue;
            } else if ("'" == char) {
                isInSingleQuotedString = true;
                continue;
            } else if ("<<<" == charTriple) {
                isInHereDocTag = true;
                continue;
            }

            if (isInSingleLineComment) {
                if ("\n" == char || "\r" == char) {
                    buffer = buffer.trim();

                    commentList.push(new Comment(buffer, 0, 1, ''));
                    isInSingleLineComment   = false;
                    buffer                  = "";
                    continue;
                }

                buffer += char;
                continue;
            } else if (isInMultiLineComment) {
                if ("*/" == charDouble) {
                    buffer = buffer.replace(new RegExp('^\\s*\\*+'), '');
                    buffer = buffer.replace(new RegExp('\\*+\\s*$'), '');
                    buffer = buffer.trim();

                    commentList.push(new Comment(buffer, 0, 0, ''));
                    isInMultiLineComment    = false;
                    buffer                  = "";
                    continue;
                }

                buffer += char;
                continue;
            } else if ("//" == charDouble || "#" == char) {
                isInSingleLineComment = true;
                continue;
            } else if ("/*" == charDouble) {
                isInMultiLineComment = true;
                continue;
            }
        }

        return commentList;
    }
}
