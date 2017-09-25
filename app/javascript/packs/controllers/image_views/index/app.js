import App from './app.vue'

$(function() {
  if ($('#image-views-index-app').length > 0) {
    initApp()
  }
})

function initApp() {
  const app = new Vue({
    el: '#image-views-index-app',
    components: {
      'app': App
    },
    created: function () {
      this.images[0] = sessionStorage.getItem("image-view-page-src")
    },
    data: {
      images: ['']
    }
  })
  return app
}
