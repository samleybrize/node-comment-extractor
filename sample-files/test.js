var fs = require("fs");

var sampleContentPhp    = fs.readFileSync('./sample-files/sample.php', 'utf8');
var sampleContentJs     = fs.readFileSync('./sample-files/sample.js', 'utf8');

// var todoListFromPhpSample   = getTodoList(sampleContentPhp);
// var todoListFromJsSample    = getTodoList(sampleContentJs);

// console.log('PHP', todoListFromPhpSample);
// console.log('JS', todoListFromJsSample);

// function getTodoList(content) {
//     var todoList = [];
//     var todoList = todoList.concat(content.match(new RegExp('^\s*//.* TODO .*', 'gm')));
//     var todoList = todoList.concat(content.match(new RegExp('^\s*#.* TODO .*', 'gm')));

//     return todoList;
// }

/************************* */
function Scanner(str) {
    this.index  = 0;
    this.string = str;
}

Scanner.prototype.getNextChar = function() {
    var char = this.string[this.index];

    if (!char) {
        return;
    }

    this.index++;
    return char;
}

Scanner.prototype.hasEnded = function() {
    return !this.string[this.index];
}

/************************ */
function parsePhp(content) {
    var scanner                 = new Scanner(content);
    var isInSingleLineComment   = false;
    var isInMultiLineComment    = false;
    var isInSingleQuotedString  = false;
    var isInDoubleQuotedString  = false;
    var isInHereDocString       = false;
    var isInHereDocTag          = false;
    var hereDocTag              = null;
    var previousChar            = "";
    var charDouble              = "";
    var charTriple              = "";
    var buffer                  = "";
    var commentList             = [];

    while (!scanner.hasEnded.call(scanner)) {
        var char        = scanner.getNextChar.call(scanner);
        charTriple      = charDouble + char;
        charDouble      = previousChar + char;
        previousChar    = char;

        if (isInDoubleQuotedString && '"' == char && '\\"' != charDouble) {
            isInDoubleQuotedString = false;
            continue;
        } else if (isInSingleQuotedString && "'" == char && "\\'" != charDouble) {
            isInSingleQuotedString = false;
            continue;
        } else if (isInHereDocTag) {
            if ("\n" == char || "\r" == char) {
                hereDocTag          = buffer;
                hereDocTag          = hereDocTag.replace(/['"]/g, '');
                buffer              = "";
                isInHereDocTag      = false;
                isInHereDocString   = true;
                continue;
            }

            buffer += char;
            continue;
        } else if (isInHereDocString) {
            if ("\n" == char || "\r" == char) {
                if (hereDocTag == buffer || `${hereDocTag};` == buffer) {
                    isInHereDocString = false;
                }

                buffer = "";
                continue;
            }

            buffer += char;
            continue;
        } else if (isInSingleQuotedString || isInDoubleQuotedString || isInHereDocString) {
            continue;
        } else if ('"' == char) {
            isInDoubleQuotedString = true;
            continue;
        } else if ("'" == char) {
            isInSingleQuotedString = true;
            continue;
        } else if ("<<<" == charTriple) {
            isInHereDocTag = true;
            continue;
        }

        if (isInSingleLineComment) {
            if ("\n" == char || "\r" == char) {
                buffer = buffer.trim();

                commentList.push(buffer);
                isInSingleLineComment   = false;
                buffer                  = "";
                continue;
            }

            buffer += char;
            continue;
        } else if (isInMultiLineComment) {
            if ("*/" == charDouble) {
                buffer = buffer.replace(new RegExp('^\\s*\\*+'), '');
                buffer = buffer.replace(new RegExp('\\*+\\s*$'), '');
                buffer = buffer.trim();

                commentList.push(buffer);
                isInMultiLineComment    = false;
                buffer                  = "";
                continue;
            }

            buffer += char;
            continue;
        } else if ("//" == charDouble || "#" == char) {
            isInSingleLineComment = true;
            continue;
        } else if ("/*" == charDouble) {
            isInMultiLineComment = true;
            continue;
        }
    }

    console.log(commentList);
}

/************************ */
parsePhp(sampleContentPhp);
