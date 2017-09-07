"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_loader_1 = require("./loaders/template-loader");
var component_1 = require("./decorators/component");
exports.Component = component_1.Component;
var prop_1 = require("./decorators/prop");
exports.Prop = prop_1.Prop;
exports.default = template_loader_1.TemplateLoader;
