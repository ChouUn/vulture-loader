
import { ComponentOptions, WatchOptions, WatchHandler } from 'vue'
import * as R from 'ramda'

function Watch (name: string, options?: WatchOptions): (target: any, key: string) => void {
  return watchFactory(name, options)
}

function watchFactory (name: string, options?: WatchOptions) {
  return function (target: ComponentOptions<any>, key: string) {
    const watched = target[key] ? name : key
    const handler = target[key] as (WatchHandler<any> | string)
    ; (target.watch || (target.watch = {}))[watched] = R.is(String, handler)
      ? handler
      : {
        handler: target[key],
        ...options
      }
    delete target[key]
    // for cleaning
    ; (target['ignores'] || (target['ignores'] = [])).push(key)
  }
}

export {
  Watch
}
