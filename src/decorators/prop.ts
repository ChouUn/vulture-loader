
import { ComponentOptions, PropOptions } from 'vue'
import * as R from 'ramda'

function Prop (target: any, key: string): void
function Prop (options: PropOptions): (target: any, key: string) => void
function Prop (first: any | PropOptions, second?: string) {
  if (R.is(String, second)) {
    propFactory({})(first as ComponentOptions<any>, second as string)
  } else {
    return propFactory(first as PropOptions)
  }
}

function propFactory (options?: PropOptions) {
  return function (target: ComponentOptions<any>, key: string) {
    (target.props || (target.props = {}))[key] = options
    delete target[key]
  }
}

export {
  Prop
}
