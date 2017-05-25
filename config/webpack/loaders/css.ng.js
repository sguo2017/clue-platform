const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  include: /(angular-blur|angular-adminlte)/,
  exclude: /angular-blur\/app\/theme\/theme/,
  use: [
      'to-string-loader',
      { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
      'postcss-loader',
      'sass-loader'
  ]
}
