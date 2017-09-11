
import { ComponentOptions, WatchOptions, WatchHandler } from 'vue'
import * as R from 'ramda'

function Method (): (target: any, key: string) => void {
  return methodFactory()
}

function methodFactory () {
  return function (target: ComponentOptions<any>, key: string) {
    (target.methods || (target.methods = {}))[key] = target[key]
    delete target[key]
    // for cleaning
    ; (target['ignores'] || (target['ignores'] = [])).push(key)
  }
}

export {
  Method
}
