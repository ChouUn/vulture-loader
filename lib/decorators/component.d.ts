import Vue, { ComponentOptions } from 'vue';
import { VueClass } from '../declaration';
declare function Component<V extends VueClass>(target: V): V;
declare function Component<U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>(target: V) => V;
export { Component };
