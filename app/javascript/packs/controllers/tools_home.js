$(document).on("turbolinks:load", function() {
  if($("#tools-home-vue-app").length > 0){
    initToolsHomeVue();
  }
});

function initToolsHomeVue() {
  // register modal component
  var Modal = {
    template: '#modal-template',
    data: function() {
      return {
        modalWidth: "300px"
      };
    }
  };
  // start app
  var app = new Vue({
    el: '#tools-home-vue-app',
    components: {
      'modal': Modal
    },
    data: {
      showModal: false,
      cas_id: '',
      cas_title: ''
    },
    methods: {
      set_cas: function(id, title) {
        this.cas_id = parseInt(id);
        this.cas_title = title;
        this.showModal = true;
      }
    },
    computed: {
      action: function() {
        return "/call_analyse_savers/" + this.cas_id;
      }
    }
  });
}
