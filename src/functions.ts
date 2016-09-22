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
import { Todo } from './todo';
import { TodoRetriever } from './todo-retriever';

export let commentRetrieverFactory  = new CommentRetrieverFactory();
export let fileExtensionMatcher     = new FileExtensionMatcher();

export interface ExtractCommentsOptions {
    language?:string;
    identifier?:string;
};
export interface ExtractCommentsFromFileOptions extends ExtractCommentsOptions {
    charset?:string;
};

export let extractCommentsFromFile = (filePath:string, options:ExtractCommentsFromFileOptions = {}): Promise<Comment[]> => {
    try {
        let sourceCodeIdentifier    = options.identifier ? options.identifier : filePath;
        let sourceCodeCharset       = options.charset ? options.charset : null;
        let sourceCode              = new SourceCodeFile(sourceCodeIdentifier, filePath, sourceCodeCharset);

        if (!options.language) {
            options.language = fileExtensionMatcher.getLanguageFromFilePath(filePath);
        }

        return extractCommentsFromSourceCode(sourceCode, options);
    } catch (error) {
        return Promise.reject(error);
    }
};

export let extractCommentsFromString = (sourceCodeText:string, options:ExtractCommentsFromFileOptions = {}): Promise<Comment[]> => {
    try {
        let sourceCodeIdentifier    = options.identifier ? options.identifier : 'unknown';
        let sourceCode              = new SourceCodeString(sourceCodeIdentifier, sourceCodeText);

        return extractCommentsFromSourceCode(sourceCode, options);
    } catch (error) {
        return Promise.reject(error);
    }
};

let extractCommentsFromSourceCode = (sourceCode:SourceCode, options?:ExtractCommentsOptions): Promise<Comment[]> => {
    let sourceCodeLanguage      = options.language;
    let commentRetriever        = commentRetrieverFactory.getNewCommentRetriever(sourceCodeLanguage);
    return commentRetriever.getCommentList(sourceCode);
};

export let extractTodosFromComments = (commentList:Comment[], todoTagList?:string[]): Todo[] => {
    let todoRetriever = new TodoRetriever(todoTagList);
    return todoRetriever.getTodoList(commentList);
};
