"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Method() {
    return methodFactory();
}
exports.Method = Method;
function methodFactory() {
    return function (target, key) {
        (target.methods || (target.methods = {}))[key] = target[key];
        delete target[key];
        (target['ignores'] || (target['ignores'] = [])).push(key);
    };
}
