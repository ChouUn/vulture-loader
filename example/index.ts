
import Vue from 'vue'
import App from './app'

// mount
const app = new Vue({
  el: '#app',
  render: h => h(App, {
    props: {
      propMessage: 'World',
      propEnding: '!',
    }
  })
})
