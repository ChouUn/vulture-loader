
import Vue, { ComponentOptions } from 'vue'

export type VueClass = { new (): Vue } & typeof Vue
