/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { Comment } from './comment';
import { Todo } from './todo';

export class TodoRetriever {
    private tagList:string[] = ['TODO', '@TODO', '@todo', 'FIXME'];

    constructor(tagList?:string[]) {
        if (tagList) {
            this.validateTagList(tagList);
            this.tagList = tagList;
        }
    }

    private validateTagList(tagList:string[]) {
        for (let tag of tagList) {
            if (tag.match(/\s/g)) {
                throw 'White spaces are not allowed';
            }
        }
    }

    getTodoList(commentList:Comment[]): Todo[] {
        let todoList:Todo[] = [];

        for (let comment of commentList) {
            todoList = todoList.concat(this.getTodoListInComment(comment));
        }

        return todoList;
    }

    private getTodoListInComment(comment:Comment): Todo[] {
        let todoList:Todo[]     = [];
        let commentText         = comment.text.replace(/(\r\n|\r)/g, '\n');
        let commentTextLineList = commentText.split('\n');

        for (let lineIndex in commentTextLineList) {
            let line        = commentTextLineList[lineIndex];
            let todoText    = this.getTodoTextInCommentLine(line);

            if (todoText) {
                let todoLine = comment.lineStart + (+lineIndex);
                todoList.push(this.createTodo(todoText, todoLine, comment.sourceIdentifier));
            }
        }

        return todoList;
    }

    private createTodo(todoText:string, todoLine:number, sourceIdentifier:string) {
        return new Todo(
            todoText,
            todoLine,
            sourceIdentifier
        );
    }

    private getTodoTextInCommentLine(commentLineText:string): string {
        let foundOffset = null;

        for (let tag of this.tagList) {
            let tagOffset = commentLineText.indexOf(tag);

            if (this.isTagOffsetBeforeFoundOffset(tagOffset, foundOffset)) {
                foundOffset = tagOffset;
            }
        }

        if (null !== foundOffset) {
            let todoText = commentLineText.substr(foundOffset).trim();
            return todoText;
        }
    }

    private isTagOffsetBeforeFoundOffset(tagOffset:number, foundOffset:number) {
        return tagOffset >= 0 && (null === foundOffset || tagOffset < foundOffset);
    }
}
