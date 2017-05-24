module.exports = {
  test: /.(ts|tsx)$/,
  exclude: /node_modules/,
  loader: [
  	'awesome-typescript-loader',
  	'angular-router-loader',
    'angular2-template-loader'
  ]
}
