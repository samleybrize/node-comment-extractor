/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { expect } from 'chai';

import { LineCounter } from '../src';

describe('line counter', () => {
    it('should detect CR end line', () => {
        let lineCounter = new LineCounter();
        lineCounter.addText('az\rer');
        lineCounter.addText('\rty');
        expect(lineCounter.getCurrentLineNumber()).to.equal(3);
    });
    it('should detect LF end line', () => {
        let lineCounter = new LineCounter();
        lineCounter.addText('az\ner');
        lineCounter.addText('\nty');
        lineCounter.addText('\n');
        expect(lineCounter.getCurrentLineNumber()).to.equal(4);
    });
    it('should detect CRLF end line', () => {
        let lineCounter = new LineCounter();
        lineCounter.addText('az\r');
        lineCounter.addText('\ner');
        lineCounter.addText('\r\nty');
        expect(lineCounter.getCurrentLineNumber()).to.equal(3);
    });
    it('should reset its state', () => {
        let lineCounter = new LineCounter();
        lineCounter.addText('az\ner');
        lineCounter.reset();
        lineCounter.addText('\rty');
        expect(lineCounter.getCurrentLineNumber()).to.equal(2);
    });
});
