
import Vue, { ComponentOptions } from 'vue'
import * as compiler from 'vue-template-compiler'
import { js_beautify } from 'js-beautify'
import transpile = require('vue-template-es2015-compiler')

import { VueClass } from '../declaration'
import Builder from '../utils/builder'

function toFunction (code: string) {
  return js_beautify('function () {' + code + '}', {
    indent_size: 2,
  })
}

export interface ICompileResult {
  errors: string[]
  code: string
}

export function compileTemplate (template: string, options?: any): ICompileResult {
  const compiled = compiler.compile(template)

  if (compiled.errors && compiled.errors.length > 0) {
    return {
      errors: compiled.errors,
      code:
        `var render = ${toFunction('')}\n` +
        'var staticRenderFns = []'
    }
  }

  const transpiled = transpile(
    `var render = ${toFunction(compiled.render)}\n` +
    `var staticRenderFns = [${compiled.staticRenderFns.map(toFunction).join(',')}]`
  )

  const result = {
    errors: [],
    code: transpiled
  }

  return result
}

export function TemplateLoader (this: any, content: string) {
  const options = {}
  const compiled = compileTemplate(content, options)
  compiled.errors.forEach(error => {
    this.emitError('template syntax error ' + error)
  })

  const builder = new Builder()

  // Inject compiled render functions
  builder.addLine(compiled.code)

  // Start to write the exported function
  builder.enterBlock('module.exports = function (_exports) {', '}', () => {

    // Extract component options object and inject render functions
    builder.addLine(`
      var options = typeof _exports === 'function'
        ? _exports.options
        : _exports
      options.render = render
      options.staticRenderFns = staticRenderFns
    `)

    builder.addLine('return _exports')
  })

  const result = builder.generate()
  this.callback(null, result.code, result.map)
}
