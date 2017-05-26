const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  include: /(react-budgeting)/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: env.NODE_ENV === 'production',
          module: true, // css-loader 0.14.5 compatible
          modules: true,
          localIdentName: '[hash:base64:5]'
        }
      },
      'postcss-loader',
      'sass-loader'
    ]
  })
}
