/*
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * Licensed under the MIT License. See the LICENSE file in
 * the project root for license information.
 */

import { ContextDetector } from './context-detector';
import { ParserHelperCommentMultiLineXml } from '../comment/multi-line-xml';
import { SourceCodeZone } from '../../../source-code/zone';

export class SourceCodeLanguageZoneList {
    constructor(public readonly languageName:string, public readonly zoneList:SourceCodeZone[]) {
    }
}

interface RawLanguageZoneList {
    languageName:string;
    startPosition:number;
    endPosition:number;
}

class HtmlAttribute {
    name:string;
    value:string;
}

export class ContextDetectorHtml implements ContextDetector {
    private rawLanguageZoneList:RawLanguageZoneList[] = [];
    private startTagParser:StartTagParser;
    private endTagParser:EndTagParser;
    private commentParser:CommentTagParser;
    private currentTagParser:TagParser;
    private isInContextProperty = true;
    private isNoMoreCharacter = false;
    private isStartTagParserEnabled = true;
    private isCurrentTagIsStartTag = false;
    private isCurrentTagIsEndTag = false;
    private currentLanguageZoneStartPosition:number = null;
    private currentLanguageZoneEndPosition:number = null;
    private characterCounter:number = 0;

    constructor() {
        this.startTagParser = new StartTagParser();
        this.endTagParser   = new EndTagParser();
        this.commentParser  = new CommentTagParser();
    }

    addCharacter(character:string) {
        if (this.isNoMoreCharacter) {
            throw "Can't add a character because noMoreCharacter() was called. Use reset() before adding any character";
        }

        this.characterCounter++;

        if (this.currentTagParser) {
            this.addCharacterToCurrentTagParser(character);
        } else {
            this.addCharacterToAllTagParsers(character);
        }
    }

    private addCharacterToCurrentTagParser(character:string) {
        this.currentTagParser.addCharacter(character);

        if (!this.currentTagParser.isInTag()) {
            this.endCurrentTag();
        }
    }

    private addCharacterToAllTagParsers(character:string) {
        if (this.isStartTagParserEnabled) {
            this.startTagParser.addCharacter(character);
        }

        this.endTagParser.addCharacter(character);
        this.commentParser.addCharacter(character);

        if (this.startTagParser.isInTag()) {
            this.currentTagParser       = this.startTagParser;
            this.isCurrentTagIsStartTag = true;
            this.endTagParser.resetState();
            this.commentParser.resetState();
        } else if (this.endTagParser.isInTag()) {
            this.currentTagParser               = this.endTagParser;
            this.isCurrentTagIsEndTag           = true;
            this.currentLanguageZoneEndPosition = this.characterCounter - 1;
            this.startTagParser.resetState();
            this.commentParser.resetState();
        } else if (this.commentParser.isInTag()) {
            this.currentTagParser = this.commentParser;
            this.startTagParser.resetState();
            this.endTagParser.resetState();
        }
    }

    private endCurrentTag() {
        if (this.isCurrentTagIsStartTag && null != this.startTagParser.getLastTagName()) {
            this.isStartTagParserEnabled            = false;
            this.isCurrentTagIsStartTag             = false;
            this.isInContextProperty                = false;
            this.currentLanguageZoneStartPosition   = this.characterCounter + 1;
            this.currentLanguageZoneEndPosition     = null;
        } else if (this.isCurrentTagIsEndTag && this.endTagParser.getLastTagName() == this.startTagParser.getLastTagName()) {
            this.leaveCurrentLanguageZone();
        }

        this.currentTagParser.resetState();
        this.currentTagParser = null;
    }

    private leaveCurrentLanguageZone() {
        if (null == this.currentLanguageZoneStartPosition) {
            this.currentLanguageZoneEndPosition = null;
            return;
        }

        this.isStartTagParserEnabled            = true;
        this.isCurrentTagIsEndTag               = false;
        this.isInContextProperty                = true;
        this.addToLanguageZoneList(
            this.startTagParser.getLastTagLanguage(),
            this.currentLanguageZoneStartPosition,
            this.currentLanguageZoneEndPosition
        );

        this.currentLanguageZoneStartPosition   = null;
        this.currentLanguageZoneEndPosition     = null;
    }

    private addToLanguageZoneList(languageName:string, startPosition:number, endPosition:number) {
        if (!this.rawLanguageZoneList[languageName]) {
            this.rawLanguageZoneList.push({languageName, startPosition, endPosition});
        }
    }

    isInContext(): boolean {
        return this.isInContextProperty;
    }

    noMoreCharacter() {
        this.isNoMoreCharacter              = true;
        this.currentLanguageZoneEndPosition = this.characterCounter + 1;
        this.leaveCurrentLanguageZone();
    }

    reset() {
        this.rawLanguageZoneList                = [];
        this.currentTagParser                   = null;
        this.isInContextProperty                = true;
        this.isNoMoreCharacter                  = false;
        this.isStartTagParserEnabled            = true;
        this.isCurrentTagIsStartTag             = false;
        this.isCurrentTagIsEndTag               = false;
        this.currentLanguageZoneStartPosition   = null;
        this.currentLanguageZoneEndPosition     = null;
        this.characterCounter                   = 0;

        this.startTagParser.resetState();
        this.endTagParser.resetState();
        this.commentParser.resetState();
    }

    getLanguageZoneList(): SourceCodeLanguageZoneList[] {
        let languageZoneList:SourceCodeLanguageZoneList[] = [];
        let temporaryLanguageZoneList = this.getLanguageZoneListGroupedByLanguage();

        for (let languageName in temporaryLanguageZoneList) {
            languageZoneList.push(new SourceCodeLanguageZoneList(languageName, temporaryLanguageZoneList[languageName]));
        }

        return languageZoneList;
    }

    private getLanguageZoneListGroupedByLanguage(): SourceCodeZone[][] {
        let languageZoneList:SourceCodeZone[][] = [];

        for (let languageZone of this.rawLanguageZoneList) {
            if (!languageZoneList[languageZone.languageName]) {
                languageZoneList[languageZone.languageName] = [];
            }

            languageZoneList[languageZone.languageName].push(new SourceCodeZone(languageZone.startPosition, languageZone.endPosition));
        }

        return languageZoneList;
    }
}

interface TagParser {
    addCharacter(character:string);
    isInTag(): boolean;
    resetState();
}

class StartTagParser implements TagParser {
    private readonly OPEN_TAG_CHARACTER = '<';
    private readonly CLOSE_TAG_CHARACTER = '>';
    private readonly END_TAG_CHARACTER = '/';
    private readonly COMMENT_TAG_CHARACTER = '!';

    private isInStartTag = false;
    private lastCharacter:string;
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
    private currentAttributeList:HtmlAttribute[] = [];
    private lastTagName:string = null;
    private lastTagLanguage:string = null;

    addCharacter(character:string) {
        if (this.isInTagName) {
            this.addCharacterToTagName(character);
        } else if (!this.isCurrentTagDiscarded && this.isInAttributeName) {
            this.addCharacterToAttributeName(character);
        } else if (!this.isCurrentTagDiscarded && this.isInAttributeValue) {
            this.addCharacterToAttributeValue(character);
        } else if (!this.isCurrentTagDiscarded && this.isInStartTag && this.isBlankSpace(character)) {
            this.startAttributeName();
        } else if (this.isInStartTag && this.CLOSE_TAG_CHARACTER == character) {
            this.closeTag();
        } else if (!this.isInStartTag && this.OPEN_TAG_CHARACTER == this.lastCharacter && this.COMMENT_TAG_CHARACTER != character && this.END_TAG_CHARACTER != character) {
            this.startTagName(character);
        }

        this.lastCharacter = character;
    }

    private addCharacterToTagName(character:string) {
        if (this.isBlankSpace(character)) {
            this.endTagName();
        } else if (this.CLOSE_TAG_CHARACTER == character) {
            this.endTagName();
            this.closeTag();
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
        this.isInStartTag           = true;
        this.isInTagName            = true;
        this.currentTagName         = null;
        this.bufferTagName          = firstCharacter;
        this.isCurrentTagDiscarded  = false;
        this.lastTagName            = null;
        this.lastTagLanguage        = null;
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
            this.closeTag();
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

    private closeTag() {
        if (this.currentTagName && this.hasAttribute('src')) {
            this.resetState();
            return;
        }

        this.lastTagName        = this.currentTagName;
        this.lastTagLanguage    = this.getLanguageNameFromTagNameAndAttributeList();
        this.resetState();
    }

    private hasAttribute(attributeName:string) {
        for (let attribute of this.currentAttributeList) {
            if (attributeName == attribute.name) {
                return true;
            }
        }

        return false;
    }

    private getAttributeValue(attributeName:string): string {
        for (let attribute of this.currentAttributeList) {
            if (attributeName == attribute.name) {
                return attribute.value;
            }
        }

        return null;
    }

    private getLanguageNameFromTagNameAndAttributeList(): string {
        let type = this.getAttributeValue('type');

        if (type) {
            let index = type.lastIndexOf('/') + 1;
            return type.substr(index);
        } else {
            // TODO default
            return this.getDefaultLanguageName();
        }
    }

    private getDefaultLanguageName(): string {
        if ('script' == this.currentTagName) {
            return 'javascript';
        } else if ('style' == this.currentTagName) {
            return 'css';
        }
    }

    resetState() {
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
        this.isInStartTag                           = false;
        this.isInTagName                            = false;
        this.lastCharacter                          = null;
    }

    isInTag(): boolean {
        return this.isInStartTag;
    }

    getLastTagName(): string {
        return this.lastTagName;
    }

    getLastTagLanguage(): string {
        return this.lastTagLanguage;
    }
}

class EndTagParser implements TagParser {
    private readonly OPEN_TAG_CHARACTER = '<';
    private readonly CLOSE_TAG_CHARACTER = '>';
    private readonly END_TAG_CHARACTER = '/';

    private isInEndTag = false;
    private lastCharacter:string;
    private isInTagName = false;
    private bufferTagName = null;
    private currentTagName = null;
    private lastTagName:string = null;

    addCharacter(character:string) {
        if (this.isInTagName) {
            this.addCharacterToTagName(character);
        } else if (this.isInEndTag && this.CLOSE_TAG_CHARACTER == character) {
            this.endTag();
        } else if (!this.isInEndTag && this.OPEN_TAG_CHARACTER == this.lastCharacter && this.END_TAG_CHARACTER == character) {
            this.startTagName();
        }

        this.lastCharacter = character;
    }

    private addCharacterToTagName(character:string) {
        if (this.isBlankSpace(character)) {
            this.endTagName();
        } else if ('>' == character) {
            this.endTagName();
        } else {
            this.bufferTagName += character;
        }
    }

    private isBlankSpace(character:string) {
        return ' ' == character || '\t' == character || '\r' == character || '\n' == character;
    }

    private startTagName() {
        this.isInEndTag         = true;
        this.isInTagName        = true;
        this.currentTagName     = null;
        this.bufferTagName      = '';
        this.lastTagName        = null;
    }

    private endTagName() {
        this.isInTagName = false;

        if ('script' == this.bufferTagName || 'style' == this.bufferTagName) {
            this.currentTagName = this.bufferTagName;
        }

        this.bufferTagName = null;
        this.endTag();
    }

    private endTag() {
        this.lastTagName = this.currentTagName;
        this.resetState();
    }

    resetState() {
        this.bufferTagName      = null;
        this.currentTagName     = null;
        this.isInEndTag         = false;
        this.isInTagName        = false;
        this.lastCharacter      = null;
    }

    isInTag(): boolean {
        return this.isInEndTag;
    }

    getLastTagName(): string {
        return this.lastTagName;
    }
}

class CommentTagParser implements TagParser {
    private parserHelperComment:ParserHelperCommentMultiLineXml;

    constructor() {
        this.parserHelperComment = new ParserHelperCommentMultiLineXml();
    }

    addCharacter(character:string) {
        this.parserHelperComment.addCharacter(character);
    }

    isInTag(): boolean {
        return this.parserHelperComment.isInComment();
    }

    resetState() {
        this.parserHelperComment.reset();
    }
}
