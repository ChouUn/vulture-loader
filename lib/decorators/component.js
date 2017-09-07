"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var R = require("ramda");
function Component(first) {
    if (typeof first === 'function') {
        return componentFactory(first);
    }
    return function (component) {
        return componentFactory(component, first);
    };
}
exports.Component = Component;
exports.$internalHooks = [
    'data',
    'props',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
];
function componentFactory(component, options) {
    if (options === void 0) { options = {}; }
    var wrapTemplate = options.template;
    delete options.template;
    options = wrapTemplate(options);
    options.name = options.name || component.name;
    if (R.is(Function, options.data)) {
        options.data = options.data();
    }
    options.data = options.data || {};
    options.props = options.props || {};
    options.computed = options.computed || {};
    var proto = component.prototype;
    var ins = new component();
    for (var key in ins) {
        if (key === 'constructor') {
            continue;
        }
        if (key.startsWith('$') || key.startsWith('_')) {
            continue;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (!descriptor) {
            options.data[key] = ins[key];
            continue;
        }
        if (descriptor.get || descriptor.set) {
            options.computed[key] = {
                get: descriptor.get,
                set: descriptor.set,
            };
            continue;
        }
        options[key] = proto[key];
    }
    var data = options.data;
    options.data = function () { return data; };
    var sPropto = Object.getPrototypeOf(proto);
    var ssProto = sPropto instanceof vue_1.default
        ? sPropto.constructor
        : vue_1.default;
    return ssProto.extend(options);
}
