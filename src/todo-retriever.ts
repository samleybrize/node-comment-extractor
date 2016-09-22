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
        }

        this.tagList = tagList;
    }

    private validateTagList(tagList:string[]) {
        for (let tag of tagList) {
            if (tag.match(/\s/g)) {
                throw 'White spaces are not allowed';
            }
        }
    }

    getTodoList(commentList:Comment[]): Todo[] {
        return [];
    }
}
