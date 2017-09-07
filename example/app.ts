
import Vue from 'vue'

import { Component, Prop } from '../src/index'

@Component({
  template: require('./app.html'),
})
export default class App extends Vue {

  message = 'Cruel'

  @Prop({
    type: String
  })
  propMessage: string

  @Prop
  propEnding: string

}
