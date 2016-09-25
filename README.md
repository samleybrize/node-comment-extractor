# node-comment-extractor

NodeJS module to extract comments from source files with a not regex-based parser.

[![Build Status](https://travis-ci.org/samleybrize/node-comment-extractor.svg?branch=master)](https://travis-ci.org/samleybrize/node-comment-extractor)

## Installation

You can install with `npm`:

```bash
npm install comment-extractor
```

## Usage

```javascript
var commentExtractor = require('comment-extractor');

// extracts comments from a source file
var commentList = commentExtractor.extractCommentsFromFile('/path/to/file.php');

// extracts comments from a source code
var commentList = commentExtractor.extractCommentsFromString('source code', {language: 'php'});

// extracts TODOs contained in comments
var todoList = commentExtractor.extractTodosFromComments(commentList);
```

## API

### extractCommentsFromFile(*filePath* [, *options*])

> * *filePath:* `String`
> * *options:* `Object`
>   * *identifier:* a string used to help you to identify the source file (default: `filePath`).
>   * *language:* force the language used to parse source file.
>   * *charset:* specify the charset (default: utf8). Valid charsets are those used by the `fs` NodeJS module.
> * Return: `Comment[]`
>
> Extracts comments from a source file.
>
> By default, the language is determined by the file extension.

### extractCommentsFromString(*sourceCode*, *options*)

> * *sourceCode:* `String`
> * *options:* `Object`
>   * *identifier:* a string used to help you to identify the source code (default: `unknown`).
>   * *language:* specify the language used to parse source file. **required**
> * Return: `Comment[]`
>
> Extracts comments from a source code string.

### extractTodosFromComments(*commentList* [, *tagList*])

> * *commentList:* `Comment[]`
> * *tagList:* `string[]`
> * Return: `Todo[]`
>
> Extracts TODOs from a comment list.
>
> By default, TODO tags are : `TODO`, `@TODO`, `@todo`, `FIXME`.
> You can specify your own list of tags with the `tagList` parameter, which will override the default tag list.

### Comment

> * *text:* the comment text
> * *lineStart:* start line of the comment in the source file.
> * *sourceIdentifier:* a string used to help you to identify the source file in which the comment was extracted.

### Todo

> * *text:* the TODO text
> * *line:* line of the TODO in the source file.
> * *sourceIdentifier:* a string used to help you to identify the source file in which the TODO was extracted.

## Examples

### Retrieve comments from a PHP file

**Source file:**
```php
<?php
/*
 * Comment text
 */

$string = '
    // is part of a string, so it is ignored
';
```

**JS code:**
```javascript
var commentList = commentExtractor.extractCommentsFromFile('/path/to/source-file.php');
console.log(commentList);
```

**Output:**
```
[
    Comment {
        text: 'Comment text',
        lineStart: 3,
        sourceIdentifier: '/path/to/source-file.php'
    }
]
```

### Retrieve TODOs from a PHP file

**Source file:**
```php
<?php
/*
 * hidden text TODO todo text
 */

$string = '
    // TODO is part of a string, so it is ignored
';
```

**JS code:**
```javascript
var commentList = commentExtractor.extractCommentsFromFile('/path/to/source-file.php');
var todoList    = commentExtractor.extractTodosFromComments(commentList);
console.log(todoList);
```

**Output:**
```
[
    Todo {
        text: 'todo text',
        line: 3,
        sourceIdentifier: '/path/to/source-file.php'
    }
]
```

### Retrieve TODOs with custom tags

**Source file:**
```php
<?php
/*
 * CUSTOM_TAG todo text
 * TODO this tag no longer works
 */
```

**JS code:**
```javascript
var commentList = commentExtractor.extractCommentsFromFile('/path/to/source-file.php');
var todoList    = commentExtractor.extractTodosFromComments(commentList, ['CUSTOM_TAG']);
console.log(todoList);
```

**Output:**
```
[
    Todo {
        text: 'todo text',
        line: 3,
        sourceIdentifier: '/path/to/source-file.php'
    }
]
```

## Supported languages

Currently, supported languages are : CSS, PHP. More coming soon.

Any PR to add languages are welcome.

## Author

This project is authored and maintained by Stephen Berquet.

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details
