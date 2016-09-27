/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { CommentRetrieverFactory, CommentRetrieverCss, CommentRetrieverHtml, CommentRetrieverJavascript, CommentRetrieverJson, CommentRetrieverTypescript, CommentRetrieverPhp, CommentRetrieverXml } from '../../src';
import { CommentRetrieverMock } from '../mock/comment-retriever/comment-retriever-mock';

describe('comment retriever: factory', () => {
    it('should return the user defined comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        factory.addBuilder('custom', () => new CommentRetrieverMock());
        let commentRetriever    = factory.getNewCommentRetriever('custom');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverMock);
    });

    it('should return the user defined comment retriever instead of the default one', () => {
        let factory             = new CommentRetrieverFactory();
        factory.addBuilder('php', () => new CommentRetrieverMock());
        let commentRetriever    = factory.getNewCommentRetriever('php');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverMock);
    });

    it('should return the CSS comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('css');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverCss);
    });

    it('should return the HTML comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('html');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverHtml);
    });

    it('should return the JS comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('javascript');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverJavascript);
    });

    it('should return the JSON comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('json');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverJson);
    });

    it('should return the Typescript comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('typescript');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverTypescript);
    });

    it('should return the PHP comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('php');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverPhp);
    });

    it('should return the XML comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('xml');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverXml);
    });

    it('should throw an error when requested language is unknown', () => {
        let fn = () => {
            let factory = new CommentRetrieverFactory();
            factory.getNewCommentRetriever('unknown-language');
        };
        expect(fn).to.throw('Unknown language "unknown-language"');
    });
});
