/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { CommentRetrieverFactory, CommentRetrieverPhp } from '../../src';
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

    it('should return the PHP comment retriever', () => {
        let factory             = new CommentRetrieverFactory();
        let commentRetriever    = factory.getNewCommentRetriever('php');
        expect(commentRetriever).to.be.an.instanceof(CommentRetrieverPhp);
    });

    it('should throw an error when requested language is unknown', () => {
        let fn = () => {
            let factory = new CommentRetrieverFactory();
            factory.getNewCommentRetriever('unknown-language');
        };
        expect(fn).to.throw('Unknown language "unknown-language"');
    });
});
