/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import * as path from 'path';

export class FileExtensionMatcher {
    private userDefinedAssociations = {};
    private defaultAssociations = {
        css: 'css',
        htm: 'html',
        html: 'html',
        js: 'javascript',
        json: 'json',
        ts: 'typescript',
        php: 'php',
        phtml: 'php',
        php3: 'php',
        php5: 'php',
        xml: 'xml',
    };

    getLanguageFromFileExtension(fileExtension:string): string {
        if (this.userDefinedAssociations[fileExtension]) {
            return this.userDefinedAssociations[fileExtension];
        } else if (this.defaultAssociations[fileExtension]) {
            return this.defaultAssociations[fileExtension];
        }

        return null;
    }

    getLanguageFromFilePath(filePath:string): string {
        let fileExtension = path.extname(filePath);

        if (!fileExtension || fileExtension.length < 2) {
            return null;
        }

        fileExtension = fileExtension.substr(1);
        return this.getLanguageFromFileExtension(fileExtension);
    }

    addAssociation(fileExtension:string, languageName:string) {
        this.userDefinedAssociations[fileExtension] = languageName;
    }
}
