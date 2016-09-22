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
            let commentText         = comment.text.replace(/(\r\n|\r)/g, '\n');
            let commentTextLineList = commentText.split('\n');

            for (let lineIndex in commentTextLineList) {
                let line        = commentTextLineList[lineIndex];
                let foundOffset = -1;

                for (let tag of this.tagList) {
                    let tagOffset = line.indexOf(tag);

                    if (tagOffset > foundOffset) {
                        foundOffset = tagOffset;
                    }
                }

                if (foundOffset >= 0) {
                    let todoText    = line.substr(foundOffset).trim();
                    let todoLine    = comment.lineStart + lineIndex;
                    todoList.push(new Todo(
                        todoText,
                        todoLine,
                        comment.sourceIdentifier
                    ));
                }
            }
        }

        return todoList;
    }
}
