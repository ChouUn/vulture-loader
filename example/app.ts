
import Vue from 'vue'
import { Component } from '../src/component'

// import template from './app.html'

@Component({
  template: require('./app.html'),
})
export default class App extends Vue {
  data () {
    return {
      message: 'Hello Cruel World'
    }
  }
  message: 1
  computed () {
    this.message
  }
}
