"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
function code(text, preserveIndentNum) {
    if (preserveIndentNum === void 0) { preserveIndentNum = 0; }
    var lines = text.split('\n')
        .filter(function (l) { return !/^\s*$/.test(l); })
        .map(function (l) { return (whitespace(preserveIndentNum) + l.replace(/\s+$/, '')); });
    var match = lines[0].match(/^(\s+)/);
    var suppress = !match ? 0 : match[1].length - preserveIndentNum;
    var validateRE = new RegExp('^\\s{' + suppress + '}');
    return lines.map(function (l) {
        assert(validateRE.test(l), "Expected indent count is " + suppress + " or more but the line is \"" + l + "\"");
        return l.slice(suppress);
    }).join('\n');
}
exports.default = code;
function whitespace(count) {
    return Array.apply(null, Array(count)).map(function () { return ' '; }).join('');
}
