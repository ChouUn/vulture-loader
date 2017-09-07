"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var source_map_1 = require("source-map");
var code_1 = require("./code");
var Builder = (function () {
    function Builder() {
        this.root = new source_map_1.SourceNode(null, null, null, '');
        this.blockDepth = 0;
    }
    Object.defineProperty(Builder.prototype, "indent", {
        get: function () {
            return this.blockDepth * 2;
        },
        enumerable: true,
        configurable: true
    });
    Builder.prototype.enterBlock = function (start, end, fn) {
        this.root.add(code_1.default(start, this.indent) + '\n');
        this.blockDepth += 1;
        fn();
        this.blockDepth -= 1;
        this.root.add(code_1.default(end, this.indent) + '\n');
    };
    Builder.prototype.addLine = function (text, map) {
        if (map) {
            var smc = new source_map_1.SourceMapConsumer(map);
            var node = source_map_1.SourceNode.fromStringWithSourceMap(text, smc);
            this.root.add([node, '\n']);
        }
        else {
            this.root.add(code_1.default(text, this.indent) + '\n');
        }
    };
    Builder.prototype.generate = function () {
        assert(this.blockDepth === 0, "Builder still does not leave from " + this.blockDepth + " block(s) yet");
        var result = this.root.toStringWithSourceMap();
        return {
            code: result.code,
            map: JSON.parse(result.map.toString())
        };
    };
    return Builder;
}());
exports.default = Builder;
