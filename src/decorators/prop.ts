
import { ComponentOptions, PropOptions } from 'vue'
import * as R from 'ramda'

function Prop (): (target: any, key: string) => void
function Prop (options: PropOptions): (target: any, key: string) => void
function Prop (first?: PropOptions) {
  return propFactory(first || {})
}

function propFactory (options?: PropOptions) {
  return function (target: ComponentOptions<any>, key: string) {
    (target.props || (target.props = {}))[key] = options
    delete target[key]
    // for cleaning
    ; (target['ignores'] || (target['ignores'] = [])).push(key)
  }
}

export {
  Prop
}
