module.exports = {
  test: /.(ts|tsx)$/,
  exclude: /node_modules/,
  loader: [
  	'ts-loader',
  	'angular2-template-loader'
  ]
}
