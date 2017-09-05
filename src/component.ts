
import Vue, { ComponentOptions } from 'vue'
import { ICompiledFunctionsResult } from 'vue-template-compiler'

import { VueClass } from './declaration'

export const $internalHooks = [
  'data',
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
  'render'
]

declare type WrapTemplate = (options: ComponentOptions<any>) => ComponentOptions<any> & ICompiledFunctionsResult

function componentFactory (component: VueClass, options: ComponentOptions<any> = {}) {
  options.name = options.name || (component as any).name

  const wrapTemplate = options.template as any as WrapTemplate
  delete options.template
  options = wrapTemplate(options)

  const proto = component.prototype
  Object
    .getOwnPropertyNames(proto)
    .forEach(function (key) {
      if (key === 'constructor') {
        return
      }

      // hooks
      if ($internalHooks.indexOf(key) > -1) {
        options[key] = proto[key]
        return
      }

      const descriptor = Object.getOwnPropertyDescriptor(proto, key)
      if (typeof descriptor.value === 'function') {
        // methods
        (options.methods || (options.methods = {}))[key] = descriptor.value
      } else if (descriptor.get || descriptor.set) {
        // computed properties
        (options.computed || (options.computed = {}))[key] = {
          get: descriptor.get,
          set: descriptor.set
        }
      }
    })

  // find super
  const superProto = Object.getPrototypeOf(proto)
  const Super = superProto instanceof Vue
    ? superProto.constructor as VueClass
    : Vue
  return Super.extend(options)
}

function wrapComponent <U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>(target: V) => V
function wrapComponent <V extends VueClass>(target: V): V
function wrapComponent <V extends VueClass, U extends Vue>(options: ComponentOptions<U> | V): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: V) {
    return componentFactory(Component, options)
  }
}

export {
  wrapComponent as Component,
}
