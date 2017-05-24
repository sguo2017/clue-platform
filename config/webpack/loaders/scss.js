const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass)$/i,
  exclude: /^angular_blur/,
  use: [
      'raw-loader',
      { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
      'postcss-loader',
      'sass-loader'
  ]
}
