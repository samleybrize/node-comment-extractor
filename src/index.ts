/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

export * from './comment-retriever/comment-retriever';
export * from './comment-retriever/factory';
export * from './comment-retriever/css';
export * from './comment-retriever/html';
export * from './comment-retriever/javascript';
export * from './comment-retriever/json';
export * from './comment-retriever/typescript';
export * from './comment-retriever/php';
export * from './comment-retriever/xml';

export * from './comment-retriever/parser-helper/parser-helper';

export * from './comment-retriever/parser-helper/comment/comment';
export * from './comment-retriever/parser-helper/comment/comment-collection';
export * from './comment-retriever/parser-helper/comment/multi-line-slash-asterisk';
export * from './comment-retriever/parser-helper/comment/multi-line-xml';
export * from './comment-retriever/parser-helper/comment/single-line-double-slash';
export * from './comment-retriever/parser-helper/comment/single-line-sharp';

export * from './comment-retriever/parser-helper/context-detector/context-detector';
export * from './comment-retriever/parser-helper/context-detector/html';
export * from './comment-retriever/parser-helper/context-detector/php';

export * from './comment-retriever/parser-helper/dead-zone/dead-zone';
export * from './comment-retriever/parser-helper/dead-zone/backticked-string';
export * from './comment-retriever/parser-helper/dead-zone/dead-zone-collection';
export * from './comment-retriever/parser-helper/dead-zone/double-quoted-string';
export * from './comment-retriever/parser-helper/dead-zone/heredoc-string';
export * from './comment-retriever/parser-helper/dead-zone/ignored-zone';
export * from './comment-retriever/parser-helper/dead-zone/single-quoted-string';
export * from './comment-retriever/parser-helper/dead-zone/xml-tag';

export * from './source-code/source-code';
export * from './source-code/file';
export * from './source-code/partial';
export * from './source-code/string';
export * from './source-code/zone';

export * from './comment';
export * from './file-extension-matcher';
export * from './functions';
export * from './line-counter';
export * from './todo';
export * from './todo-retriever';
