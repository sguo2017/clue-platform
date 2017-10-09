import App from './app.vue'

$(document).on('turbolinks:load', function () {
  if ($('#tactics-edit-covers-app').length > 0) {
    initApp()
  }
})

function initApp () {
  const app = new Vue({
    el: '#tactics-edit-covers-app',
    components: {
      'app': App
    }
  })
  return app
}
