"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
function Prop(first, second) {
    if (R.is(String, second)) {
        propFactory({})(first, second);
    }
    else {
        return propFactory(first);
    }
}
exports.Prop = Prop;
function propFactory(options) {
    return function (target, key) {
        (target.props || (target.props = {}))[key] = options;
        delete target[key];
    };
}
