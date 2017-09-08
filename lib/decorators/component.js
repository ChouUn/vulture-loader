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
var reservedMember = [
    'data',
    'props',
    'propsData',
    'computed',
    'methods',
    'watch',
    'beforeCreate',
    'created',
    'beforeDestroy',
    'destroyed',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'el',
    'template',
    'render',
    'renderError',
    'staticRenderFns',
    'directives',
    'components',
    'transitions',
    'filters',
    'provide',
    'inject',
    'model',
    'parent',
    'mixins',
    'name',
    'extends',
    'delimiters',
    'comments',
    'inheritAttrs',
];
var mergableMember = [
    'data',
    'props',
    'propsData',
    'computed',
    'methods',
    'watch',
];
var lifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeDestroy',
    'destroyed',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
];
function normalizeOptions(options) {
    if (R.is(Function, options.data)) {
        options.data = options.data();
    }
    if (!R.is(Object, options.data)) {
        options.data = {};
    }
    if (R.is(Array, options.props)) {
        options.props = options.props.reduce(function (props, prop) {
            props[prop] = {};
            return props;
        }, {});
    }
    if (!R.is(Object, options.props)) {
        options.props = {};
    }
    if (options.computed) {
        R.forEachObjIndexed(function (value, key) {
            if (R.is(Function, value)) {
                options.computed[key] = {
                    get: value,
                };
            }
        }, options.computed);
    }
    if (!R.is(Object, options.computed)) {
        options.computed = {};
    }
    if (options.watch) {
        R.forEachObjIndexed(function (value, key) {
            if (R.is(Function, value)) {
                options.watch[key] = {
                    handler: value
                };
            }
        }, options.watch);
    }
    if (!R.is(Object, options.watch)) {
        options.watch = {};
    }
    return options;
}
function componentFactory(component, options) {
    if (options === void 0) { options = {}; }
    var wrapTemplate = options.template;
    delete options.template;
    options = wrapTemplate(options);
    options.name = options.name || component.name;
    options = normalizeOptions(options);
    var proto = component.prototype;
    var ins = new component();
    for (var key in ins) {
        if (key === 'constructor') {
            continue;
        }
        if (key.startsWith('$') || key.startsWith('_')) {
            continue;
        }
        if (mergableMember.includes(key)) {
            options[key] = __assign({}, options[key], proto[key]);
            continue;
        }
        if (reservedMember.includes(key)) {
            options[key] = proto[key];
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
        console.debug(key, proto[key], ins[key]);
    }
    var data = options.data;
    options.data = function () { return data; };
    var sPropto = Object.getPrototypeOf(proto);
    var ssProto = sPropto instanceof vue_1.default
        ? sPropto.constructor
        : vue_1.default;
    return ssProto.extend(options);
}
