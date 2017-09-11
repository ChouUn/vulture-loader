
import Vue from 'vue'

import { Component, Prop, Watch, Method } from '../src/index'

@Component({
  template: require('./app.html'),
})
export default class App extends Vue {

  message = 'Cruel'

  @Prop({
    type: String
  })
  propMessage: string

  @Prop()
  propEnding: string

  @Method()
  changeMessage($event: Event) {
    this.message = 'Merciful'
  }

  @Watch('message')
  watchMessage(val: string, oldVal: string) {
    console.log('new: %s, old: %s', val, oldVal)
  }

}
