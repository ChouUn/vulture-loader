
# Vulture Loader

A Typescript decorator for class-style Vue component with Webpack loader

## Example

app.html

``` html
<div>
  Hello
  <span class="message">{{ message }}</span>
  {{ propMessage }}
  {{ propEnding }}
  <button @click.once="changeMessage">Refuse</button>
</div>
```

app.html preview

```
Hello Cruel World !
```

app.html preview (after click)

```
Hello Merciful World !
```

app.ts

``` typescript
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
```

index.ts

``` typescript
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
```

webpack.config.js

``` javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.html$/,
        use: ['vulture-loader'],
      },
    ],
  },
  // ...
}
```

### Source Code

See `example/`

### How to Run it

1. open terminal 
2. type `npm run dev`, wait for finishing
3. type `open example/index.html`

## Features

- [x] Component
- [x] Pre-compile Template
- [x] ES2015 in Templates
- [ ] Hot Reload
- [ ] Internal Hooks
- [x] Prop
- [ ] Computed
- [x] Watch
- [x] Method
- [ ] Global CSS
- [ ] Scoped CSS
- [ ] CSS Modules
- [ ] src (HTMl, CSS)
