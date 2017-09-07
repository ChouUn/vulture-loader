"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler = require("vue-template-compiler");
var js_beautify_1 = require("js-beautify");
var transpile = require("vue-template-es2015-compiler");
var builder_1 = require("../utils/builder");
function toFunction(code) {
    return js_beautify_1.js_beautify('function () {' + code + '}', {
        indent_size: 2,
    });
}
function compileTemplate(template, options) {
    var compiled = compiler.compile(template);
    if (compiled.errors && compiled.errors.length > 0) {
        return {
            errors: compiled.errors,
            code: "var render = " + toFunction('') + "\n" +
                'var staticRenderFns = []'
        };
    }
    var transpiled = transpile("var render = " + toFunction(compiled.render) + "\n" +
        ("var staticRenderFns = [" + compiled.staticRenderFns.map(toFunction).join(',') + "]"));
    var result = {
        errors: [],
        code: transpiled
    };
    return result;
}
exports.compileTemplate = compileTemplate;
function TemplateLoader(content) {
    var _this = this;
    var options = {};
    var compiled = compileTemplate(content, options);
    compiled.errors.forEach(function (error) {
        _this.emitError('template syntax error ' + error);
    });
    var builder = new builder_1.default();
    builder.addLine(compiled.code);
    builder.enterBlock('module.exports = function (_exports) {', '}', function () {
        builder.addLine("\n      var options = typeof _exports === 'function'\n        ? _exports.options\n        : _exports\n      options.render = render\n      options.staticRenderFns = staticRenderFns\n    ");
        builder.addLine('return _exports');
    });
    var result = builder.generate();
    this.callback(null, result.code, result.map);
}
exports.TemplateLoader = TemplateLoader;
