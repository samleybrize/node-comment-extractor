/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ContextDetector } from './context-detector';
import { SourceCodeZone } from '../../../source-code/zone';

// TODO if script with no type attribute: default to javascript
// TODO if style with no type attribute: default to css
// TODO handle html comments

export class SourceCodeLanguageZoneList {
    constructor(public readonly languageName:string, public readonly zoneList:SourceCodeZone[]) {
    }
}

interface HtmlAttribute {
    name:string;
    value:string;
}

export class ContextDetectorHtml implements ContextDetector {
    private languageZoneList:SourceCodeLanguageZoneList[];
    private lastCharacter;
    private isInTag = false;
    private isInTagName = false;
    private isInAttributeName = false;
    private isInAttributeValue = false;
    private isCurrentTagDiscarded = false;
    private bufferTagName = null;
    private bufferAttributeName = null;
    private bufferAttributeValue = null;
    private currentTagName = null;
    private currentAttributeName = null;
    private currentAttributeValueStartCharacter = null;
    private currentAttributeList:HtmlAttribute[];

    addCharacter(character:string) {
        if (this.isInTagName) {
            this.addCharacterToTagName(character);
        } else if (!this.isCurrentTagDiscarded && this.isInAttributeName) {
            this.addCharacterToAttributeName(character);
        } else if (!this.isCurrentTagDiscarded && this.isInAttributeValue) {
            this.addCharacterToAttributeValue(character);
        } else if (!this.isCurrentTagDiscarded && this.isInTag && this.isBlankSpace(character)) {
            this.startAttributeName();
        } else if (this.isInTag && '>' == character) {
            this.endTag();
        } else if (!this.isInTag && '<' == this.lastCharacter && '!' != character) {
            this.startTagName(character);
        }

        this.lastCharacter = character;
    }

    private addCharacterToTagName(character:string) {
        if (this.isBlankSpace(character)) {
            this.endTagName();
        } else if ('>' == character) {
            this.endTag();
        } else {
            this.bufferTagName += character;
        }
    }

    private isBlankSpace(character:string) {
        return ' ' == character || '\t' == character || '\r' == character || '\n' == character;
    }

    private isQuote(character:string) {
        return "'" == character || '"' == character;
    }

    private startTagName(firstCharacter:string) {
        this.isInTag                = true;
        this.isInTagName            = true;
        this.currentTagName         = null;
        this.bufferTagName          = firstCharacter;
        this.isCurrentTagDiscarded  = false;
    }

    private endTagName() {
        this.isInTagName = false;

        if ('script' == this.bufferTagName || 'style' == this.bufferTagName) {
            this.currentTagName         = this.bufferTagName;
            this.bufferTagName          = null;
            this.currentAttributeList   = [];
            this.startAttributeName();
        } else {
            this.endTagNameAndDiscard();
        }
    }

    private endTagNameAndDiscard() {
        this.isInTagName            = false;
        this.bufferTagName          = null;
        this.isCurrentTagDiscarded  = true;
    }

    private addCharacterToAttributeName(character:string) {
        let isBlankSpace                = this.isBlankSpace(character);
        let isBufferAttributeNameEmpty  = (0 == this.bufferAttributeName.length);

        if ('>' == character && isBufferAttributeNameEmpty) {
            this.endTag();
        } else if (isBlankSpace && !isBufferAttributeNameEmpty) {
            this.endAttributeNameAndDiscard();
        } else if ('=' == character && !isBufferAttributeNameEmpty) {
            this.endAttributeName();
        } else if (!isBlankSpace) {
            this.bufferAttributeName += character;
        }
    }

    private startAttributeName() {
        this.isInAttributeName      = true;
        this.bufferAttributeName    = '';
        this.currentAttributeName   = null;
    }

    private endAttributeName() {
        this.isInAttributeName      = false;
        this.currentAttributeName   = this.bufferAttributeName;
        this.bufferAttributeName    = null;
        this.startAttributeValue();
    }

    private endAttributeNameAndDiscard() {
        this.bufferAttributeName    = null;
        this.currentAttributeName   = null;
    }

    private addCharacterToAttributeValue(character:string) {
        if (null == this.currentAttributeValueStartCharacter && this.isQuote(character)) {
            this.currentAttributeValueStartCharacter = character;
        } else if (this.currentAttributeValueStartCharacter && character == this.currentAttributeValueStartCharacter) {
            this.endAttributeValue();
        } else if (this.currentAttributeValueStartCharacter && character != this.currentAttributeValueStartCharacter) {
            this.bufferAttributeValue += character;
        }
    }

    private startAttributeValue() {
        this.isInAttributeValue                     = true;
        this.bufferAttributeValue                   = '';
        this.currentAttributeValueStartCharacter    = null;
    }

    private endAttributeValue() {
        this.currentAttributeList.push({
            name: this.currentAttributeName,
            value: this.bufferAttributeValue,
        });
        this.isInAttributeValue                     = false;
        this.bufferAttributeValue                   = null;
        this.currentAttributeValueStartCharacter    = null;
        this.currentAttributeName                   = null;
    }

    private endTag() {
        console.log(this.currentTagName);
        console.log(this.currentAttributeList);
        console.log('-----');
        this.resetState();
    }

    private resetState() {
        this.bufferAttributeName                    = null;
        this.bufferAttributeValue                   = null;
        this.bufferTagName                          = null;
        this.currentAttributeList                   = [];
        this.currentAttributeName                   = null;
        this.currentAttributeValueStartCharacter    = null;
        this.currentTagName                         = null;
        this.isCurrentTagDiscarded                  = false;
        this.isInAttributeName                      = false;
        this.isInAttributeValue                     = false;
        this.isInTag                                = false;
        this.isInTagName                            = false;
        this.lastCharacter                          = null;
    }

    isInContext(): boolean {
        return null;
    }

    noMoreCharacter() {
        
    }

    reset() {
        
    }

    getLanguageZoneList(): SourceCodeLanguageZoneList[] {
        return this.languageZoneList;
    }
}
