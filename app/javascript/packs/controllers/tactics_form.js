$(document).on("turbolinks:load", function() {
  if ($("#tactics-form-app").length > 0) {
    initTacticsFormVue();
  }
});

function initTacticsFormVue() {
  new Vue({
    el: "#tactics-form-app",
    data: {
      originCase: [],
      cases: [],
      showSearchModal: false,
      keyword: "",
      results: [],
      start_time: null,
      end_time: null,

    },
    created: function() {
      this.loadCases();
    },
    mounted: function() {

    },
    methods: {
      loadCases: function() {
        this.originCase = $("#associated-case-fields").data("associated-cases") || [];
        this.cases = this.originCase.slice(0);
      },
      caseIndexOf: function(id) {
        var index = -1;
        for (var i = 0; i < this.cases.length; i++) {
          if (this.cases[i].id == id) {
            index = i;
            break;
          }
        }
        return index;
      },
      addCase: function(id, name) {
        if (this.caseIndexOf(id) === -1) {
          this.cases.push({
            id,
            name
          });
        }
      },
      removeCase: function(id) {
        var index = this.caseIndexOf(id);
        if (index > -1) {
          this.cases.splice(index, 1);
        }
      },
      search: function() {
        var outer = this;
        $.ajax({
          url: "/cases/search",
          method: "get",
          data: {
            key: outer.keyword
          },
          dataType: "JSON"
        }).done(function(response) {
          outer.results = response["data"] || [];
        });
      }
    }
  });
}
