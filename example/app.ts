
import Vue from 'vue'

import { Component, Prop, Watch, Method } from '../src/index'

@Component({
  template: require('./app.html'),
})
export default class App extends Vue {

  // data
  message = 'Cruel'

  // props
  @Prop({
    type: String
  })
  propMessage: string

  @Prop()
  propEnding: string

  // methods
  @Method()
  changeMessage($event: Event) {
    this.message = 'Merciful'
  }

  // watch
  @Watch('message')
  watchMessage(val: string, oldVal: string) {
    console.log('new: %s, old: %s', val, oldVal)
  }

  // computed
  get buttonDisabled () {
    return this.message !== 'Cruel'
  }
}
