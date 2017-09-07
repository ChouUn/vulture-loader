
/**
 * source code: https://github.com/ktsn/vue-template-loader/blob/master/lib/builder/code.js
 */

import * as assert from 'assert'

export default function code (text: string, preserveIndentNum = 0) {
  const lines = text.split('\n')
    .filter(l => !/^\s*$/.test(l))
    .map(l => (whitespace(preserveIndentNum) + l.replace(/\s+$/, '')))

  const match = lines[0].match(/^(\s+)/)
  const suppress = !match ? 0 : match[1].length - preserveIndentNum

  const validateRE = new RegExp('^\\s{' + suppress + '}')
  return lines.map(l => {
    assert(
      validateRE.test(l),
      `Expected indent count is ${suppress} or more but the line is "${l}"`
    )

    return l.slice(suppress)
  }).join('\n')
}

function whitespace (count: number) {
  return Array.apply(null, Array(count)).map(() => ' ').join('')
}
