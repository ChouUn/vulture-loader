
import Vue, { ComponentOptions } from 'vue'
import * as compiler from 'vue-template-compiler'
import { js_beautify } from 'js-beautify'
import transpile = require('vue-template-es2015-compiler')

import { VueClass } from './declaration'

function toFunction (code: string) {
  return js_beautify('function () {' + code + '}', {
    indent_size: 2,
  })
}

export interface ICompileResult {
  errors: string[]
  code: string
}

export function compile (template: string, options?: any): ICompileResult {
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
