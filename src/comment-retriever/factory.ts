/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { CommentRetriever } from './comment-retriever';
import { CommentRetrieverPhp } from './php';

export type CommentRetrieverBuilder = () => CommentRetriever;

export class CommentRetrieverFactory {
    private commentRetrieverBuilderList:CommentRetrieverBuilder[] = [];

    addBuilder(languageName:string, builderFunction:CommentRetrieverBuilder) {
        this.commentRetrieverBuilderList[languageName] = builderFunction;
    }

    getNewCommentRetriever(languageName:string): CommentRetriever {
        let commentRetrieverBuilder = this.getBuilder(languageName);

        if (!commentRetrieverBuilder) {
            throw `Unknown language "${languageName}"`;
        }

        return commentRetrieverBuilder();
    }

    private getBuilder(languageName:string): CommentRetrieverBuilder {
        let userDefinedBuilder = this.getUserDefinedBuilder(languageName);

        if (userDefinedBuilder) {
            return userDefinedBuilder;
        }

        let defaultBuilder = this.getDefaultBuilder(languageName);

        if (defaultBuilder) {
            return defaultBuilder;
        }
    }

    private getUserDefinedBuilder(languageName:string): CommentRetrieverBuilder {
        if (this.commentRetrieverBuilderList[languageName]) {
            return this.commentRetrieverBuilderList[languageName];
        }
    }

    private getDefaultBuilder(languageName:string): CommentRetrieverBuilder {
        switch (languageName) {
            case 'php':
                return this.getDefaultBuilderPhp;
        }
    }

    private getDefaultBuilderPhp(): CommentRetrieverPhp {
        return new CommentRetrieverPhp();
    }
}
