/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { Comment, TodoRetriever } from '../src';

describe('todo retriever', () => {
    it('should return all todos', () => {
        let commentList = [
            new Comment('TODO text 1', 3, 'id'),
            new Comment('text before @TODO text 2', 5, 'id2'),
            new Comment('text before\n @todo text 3\r\ntext after', 12, 'id3'),
            new Comment('text before\n TODO text 4\r\nFIXME text 5', 124, 'id4'),
            new Comment('text before\n TODO text 6 TODO text 7', 145, 'id4'),
        ];
        let todoRetriever   = new TodoRetriever();
        let todoList        = todoRetriever.getTodoList(commentList);

        expect(todoList).to.be.an('array').that.have.lengthOf(6);

        expect(todoList[0].text).to.equal('TODO text 1');
        expect(todoList[0].line).to.equal(3);
        expect(todoList[0].sourceIdentifier).to.equal('id');

        expect(todoList[0].text).to.equal('@TODO text 2');
        expect(todoList[0].line).to.equal(5);
        expect(todoList[0].sourceIdentifier).to.equal('id2');

        expect(todoList[0].text).to.equal('@todo text 3');
        expect(todoList[0].line).to.equal(13);
        expect(todoList[0].sourceIdentifier).to.equal('id3');

        expect(todoList[0].text).to.equal('TODO text 4');
        expect(todoList[0].line).to.equal(125);
        expect(todoList[0].sourceIdentifier).to.equal('id4');

        expect(todoList[0].text).to.equal('FIXME text 5');
        expect(todoList[0].line).to.equal(126);
        expect(todoList[0].sourceIdentifier).to.equal('id4');

        expect(todoList[0].text).to.equal('TODO text 6 TODO text 7');
        expect(todoList[0].line).to.equal(146);
        expect(todoList[0].sourceIdentifier).to.equal('id4');
    });

    it.skip('should interpret user defined tags', () => {
    });
});
