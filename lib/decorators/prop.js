"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Prop(first) {
    return propFactory(first || {});
}
exports.Prop = Prop;
function propFactory(options) {
    return function (target, key) {
        (target.props || (target.props = {}))[key] = options;
        delete target[key];
        (target['ignores'] || (target['ignores'] = [])).push(key);
    };
}
