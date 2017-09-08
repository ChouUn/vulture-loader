
import Vue, { ComponentOptions, ComputedOptions, WatchHandler } from 'vue'
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

const reservedMember = [
  'data',
  'props',
  'propsData',
  'computed',
  'methods',
  'watch',

  'beforeCreate',
  'created',
  'beforeDestroy',
  'destroyed',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',

  'el',
  'template',
  'render',
  'renderError',
  'staticRenderFns',

  'directives',
  'components',
  'transitions',
  'filters',

  'provide',
  'inject',

  'model',

  'parent',
  'mixins',
  'name',
  'extends',
  'delimiters',
  'comments',
  'inheritAttrs',
]

const mergableMember = [
  'data',
  'props',
  'propsData',
  'computed',
  'methods',
  'watch',
]

const lifecycleHooks = [
  'beforeCreate',
  'created',
  'beforeDestroy',
  'destroyed',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
]

declare type WrapTemplate = (options: ComponentOptions<any>) => ComponentOptions<any> & ICompiledFunctionsResult

function normalizeOptions (options: ComponentOptions<any>) {
  // data
  if (R.is(Function, options.data)) {
    options.data = (options.data as (this: any) => Object)()
  }

  if (!R.is(Object, options.data)) {
    options.data = {}
  }
  // props
  if (R.is(Array, options.props)) {
    options.props = (options.props as string[]).reduce((props, prop) => {
      props[prop] = {}
      return props
    }, {})
  }
  if (!R.is(Object, options.props)) {
    options.props = {}
  }

  // computed
  if (options.computed) {
    R.forEachObjIndexed((value, key) => {
      if (R.is(Function, value)) {
        options.computed![key] = {
          get: value as (this: any) => any,
        }
      }
    }, options.computed)
  }
  if (!R.is(Object, options.computed)) {
    options.computed = {}
  }

  // watch
  if (options.watch) {
    R.forEachObjIndexed((value, key) => {
      if (R.is(Function, value)) {
        options.watch![key] = {
          handler: value as WatchHandler<any>
        }
      }
    }, options.watch)
  }
  if (!R.is(Object, options.watch)) {
    options.watch = {}
  }

  return options
}

function componentFactory (component: any, options: ComponentOptions<any> = {}) {

  // template
  const wrapTemplate = options.template as any as WrapTemplate
  delete options.template
  options = wrapTemplate(options)

  // name
  options.name = options.name || (component as any).name
  options = normalizeOptions(options)

  const proto = component.prototype
  const ins = new component()

  for (let key in ins) {
    if (key === 'constructor') {
      continue
    }
    // Vue component instance properties
    if (key.startsWith('$') || key.startsWith('_')) {
      continue
    }

    if (mergableMember.includes(key)) {
      options[key] = { ...options[key], ...proto[key] }
      continue
    }
    if (reservedMember.includes(key)) {
      options[key] = proto[key]
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    // data properties
    if (!descriptor) {
      options.data![key] = ins[key]
      continue
    }
    // computed properties
    if (descriptor.get || descriptor.set) {
      options.computed![key] = {
        get: descriptor.get,
        set: descriptor.set,
      }
      continue
    }

    options[key] = proto[key]
    console.debug(key, proto[key], ins[key])
  }

  const data = options.data
  options.data = () => data

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
