const { env, publicPath } = require('../configuration.js')

module.exports = {
  test: /\.(svg|eot|ttf|otf|woff|woff2)$/i,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: env.NODE_ENV === 'production' ? '[name]-[hash].[ext]' : '[name].[ext]'
    }
  }]
}
