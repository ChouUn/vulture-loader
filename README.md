
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
</div>
```

performance

```
Hello Cruel World !
```

app.ts

``` typescript
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
