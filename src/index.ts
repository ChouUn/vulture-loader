
import { compile } from './template-loader'

import Builder from './utils/builder'

export default function (this: any, content: string) {
  const options = {}
  const compiled = compile(content, options)
  compiled.errors.forEach(error => {
    this.emitError('template syntax error ' + error)
  })

  const builder = new Builder()
  
  // Inject compiled render functions
  builder.addLine(compiled.code)

  // builder.addLine(`
  //   module.exports = {
  //     render: render
  //     staticRenderFns: staticRenderFns
  //   }
  // `)
  
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
