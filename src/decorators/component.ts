
import Vue, { ComponentOptions, ComputedOptions } from 'vue'
import { ICompiledFunctionsResult } from 'vue-template-compiler'
import * as R from 'ramda'

import { VueClass } from '../declaration'

function Component <V extends VueClass>(target: V): V
function Component <U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>(target: V) => V
function Component <U extends Vue, V extends VueClass>(first: ComponentOptions<U> | V): any {
  if (typeof first === 'function') {
    return componentFactory(first as V)
  }
  return function (component: V) {
    return componentFactory(component, first as ComponentOptions<U>)
  }
}

export const $internalHooks = [
  'data',
  'props',
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeDestroy',
  'destroyed',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'render',
]

declare type WrapTemplate = (options: ComponentOptions<any>) => ComponentOptions<any> & ICompiledFunctionsResult

function componentFactory (component: any, options: ComponentOptions<any> = {}) {

  // template
  const wrapTemplate = options.template as any as WrapTemplate
  delete options.template
  options = wrapTemplate(options)

  // name
  options.name = options.name || (component as any).name
  // data
  if (R.is(Function, options.data)) {
    options.data = (options.data as (this: any) => Object)()
  }
  options.data = options.data || {}
  // props
  options.props = options.props || {}
  // computed
  options.computed = options.computed || {}

  const proto = component.prototype
  const ins = new component()

  for (let key in ins) {
    if (key === 'constructor') {
      continue
    }

    if (key.startsWith('$') || key.startsWith('_')) {
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (!descriptor) {
      options.data[key] = ins[key]
      continue
    }

    if (descriptor.get || descriptor.set) {
      // computed properties
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      }
      continue
    }

    options[key] = proto[key]
  }

  const data = options.data
  options.data = () => data

  // Object
  //   .getOwnPropertyNames(proto)
  //   .forEach(key => {
  //     if (key === 'constructor') {
  //       return
  //     }

  //     // hooks
  //     if ($internalHooks.indexOf(key) > -1) {
  //       options[key] = proto[key]
  //       return
  //     }

  //     const descriptor = Object.getOwnPropertyDescriptor(proto, key)
  //     if (R.is(Function, descriptor.value)) {
  //       // methods
  //       (options.methods || (options.methods = {}))[key] = descriptor.value
  //     } else {
  //       (options.data || (options.data = {}))[key] = descriptor.value
  //     }
  //   })

  // find super
  const sPropto = Object.getPrototypeOf(proto)
  const ssProto = sPropto instanceof Vue
    ? sPropto.constructor as VueClass
    : Vue
  return ssProto.extend(options)
}

export {
  Component,
}
