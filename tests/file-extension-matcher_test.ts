/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { FileExtensionMatcher } from '../src';

describe('file extension matcher', () => {
    it('should return the language name corresponding to a file extension', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('php3')).to.equal('php');
    });

    it('should return the language name corresponding to the file extension of a path', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFilePath('/az/er/ty.php3')).to.equal('php');
    });

    it('should return the user defined language name instead of the default one', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        fileExtensionMatcher.addAssociation('php5', 'newlang');
        expect(fileExtensionMatcher.getLanguageFromFileExtension('php5')).to.equal('newlang');
        expect(fileExtensionMatcher.getLanguageFromFilePath('/az/er/ty.php5')).to.equal('newlang');
    });

    it('should return css', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('css')).to.equal('css');
    });

    it('should return html', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('html')).to.equal('html');
    });

    it('should return javascript', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('js')).to.equal('javascript');
    });

    it('should return json', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('json')).to.equal('json');
    });

    it('should return typescript', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('ts')).to.equal('typescript');
    });

    it('should return php', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('php')).to.equal('php');
        expect(fileExtensionMatcher.getLanguageFromFileExtension('phtml')).to.equal('php');
        expect(fileExtensionMatcher.getLanguageFromFileExtension('php3')).to.equal('php');
        expect(fileExtensionMatcher.getLanguageFromFileExtension('php5')).to.equal('php');
    });

    it('should return xml', () => {
        let fileExtensionMatcher = new FileExtensionMatcher();
        expect(fileExtensionMatcher.getLanguageFromFileExtension('xml')).to.equal('xml');
    });
});
