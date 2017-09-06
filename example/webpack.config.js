
const path = require('path')

module.exports = {
  entry: './example/index.ts',
  output: {
    path: __dirname,
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // resolveLoader: {
  //   modules: [
  //     'node_modules',
  //     path.resolve(__dirname, '..')
  //   ]
  // },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.html$/,
        use: ['./'],
      },
    ],
  },
  devtool: 'source-map',
}
