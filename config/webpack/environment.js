const {environment} = require('@rails/webpacker')

const webpack = require('webpack')

// Get a pre-configured plugin
environment.plugins.get('ExtractText') // Is an ExtractTextPlugin instance

// 暴露全局变量到每个模块当中
environment.plugins.set(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    Vue: 'vue/dist/vue.common.js',
    moment: 'moment'
  }))

// 暴露全局变量到window以及浏览器控制台
environment.loaders.set('json', {
  test: require.resolve('jquery'),
  use: [{
    loader: 'expose-loader',
    options: 'jQuery'
  }, {
    loader: 'expose-loader',
    options: '$'
  }]
})

module.exports = environment
