/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from './comment';
import { CommentRetrieverFactory } from './comment-retriever/factory';
import { FileExtensionMatcher } from './file-extension-matcher';
import { SourceCode } from './source-code/source-code';
import { SourceCodeFile } from './source-code/file';
import { SourceCodeString } from './source-code/string';

export let commentRetrieverFactory  = new CommentRetrieverFactory();
export let fileExtensionMatcher     = new FileExtensionMatcher();

export interface ExtractCommentsOptions {
    language?:string;
    identifier?:string;
};
export interface ExtractCommentsFromFileOptions extends ExtractCommentsOptions {
    charset?:string;
};

export function extractCommentsFromFile(filePath:string, options?:ExtractCommentsFromFileOptions): Promise<Comment[]> {
    let sourceCodeIdentifier    = options.identifier ? options.identifier : filePath;
    let sourceCode              = new SourceCodeFile(sourceCodeIdentifier, filePath, options.charset);

    if (!options.language) {
        options.language = fileExtensionMatcher.getLanguageFromFilePath(filePath);
    }

    return extractCommentsFromSourceCode(sourceCode, options);
}

export function extractCommentsFromString(sourceCodeText:string, options?:ExtractCommentsFromFileOptions): Promise<Comment[]> {
    let sourceCodeIdentifier    = options.identifier ? options.identifier : 'unknown';
    let sourceCode              = new SourceCodeString(sourceCodeIdentifier, sourceCodeText);

    return extractCommentsFromSourceCode(sourceCode, options);
}

function extractCommentsFromSourceCode(sourceCode:SourceCode, options?:ExtractCommentsOptions): Promise<Comment[]> {
    let sourceCodeLanguage      = options.language;
    let commentRetriever        = commentRetrieverFactory.getNewCommentRetriever(sourceCodeLanguage);
    return commentRetriever.getCommentList(sourceCode);
}
