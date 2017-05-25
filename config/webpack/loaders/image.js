const { env, publicPath } = require('../configuration.js')

module.exports = {
  test: /\.(jpg|jpeg|png|gif)$/i,
  use: [
  	{
	    loader: 'file-loader',
	    options: {
	      publicPath,
	      name: env.NODE_ENV === 'production' ? '[name]-[hash].[ext]' : '[name].[ext]'
	    }
  	}//,'image-webpack-loader?bypassOnDebug'
  ]
}
