"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
function Watch(name, options) {
    return watchFactory(name, options);
}
exports.Watch = Watch;
function watchFactory(name, options) {
    return function (target, key) {
        var watched = target[key] ? name : key;
        var handler = target[key];
        (target.watch || (target.watch = {}))[watched] = R.is(String, handler)
            ? handler
            : __assign({ handler: target[key] }, options);
        delete target[key];
        (target['ignores'] || (target['ignores'] = [])).push(key);
    };
}
