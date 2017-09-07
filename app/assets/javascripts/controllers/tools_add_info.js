$(document).on("turbolinks:load", function() {
  if ($("#data-screen-app").length > 0) {
    initDataScreenVueApp();
  }
});

function initDataScreenVueApp() {
  new Vue({
    el: '#data-screen-app',
    data: {
      isNoteSelected: false,
      isDateSelected: false,
      isBatchSelected: false,
      noteOptions: [],
      dateOptions: [],
      batchOptions: [],
      noteSelected: [],
      dateSelected: [],
      batchSelected: []
    },
    created: function() {
      $(':input').labelauty();
    },
    methods: {
      loadOptions: function(type) {
        var isSelected, options, url;
        switch (type) {
          case "note":
            isSelected = "isNoteSelected";
            options = "noteOptions";
            url = "/calllists/load_note_options";
            break;
          case "date":
            isSelected = "isDateSelected";
            options = "dateOptions";
            url = "/calllists/load_date_options";
            break;
          case "batch":
            isSelected = "isBatchSelected";
            options = "batchOptions";
            url = "/calllists/load_batch_options";
            break;
          default:
            return;
        }
        if (this[isSelected]) {
          var outer = this;
          $.ajax({
            url: url,
            method: "get"
          }).done(function(response) {
            outer[options] = response['data'];
          }).error(function(err) {
            alert("数据加载失败！");
            console.log(err);
          });
        }
      }, //
      updateSelected: function(event, target) {
        var selectedValues = Array.prototype.slice.call(event.target.selectedOptions, 0).map(function(x) {
          return x.value
        });
        var outer = this;
        selectedValues.forEach(function(x) {
          if (outer[target].indexOf(x) < 0) {
            outer[target].push(x);
          }
        });
        this[target] = this[target].filter(function(x) {
          return selectedValues.indexOf(x) >= 0;
        });
      }, //
      setFilterData: function() {
        if (this.isNoteSelected) {
          sessionStorage.setItem("ca_note_filters", this.noteSelected);
        } else {
          sessionStorage.setItem("ca_note_filters", '');
        }
        if (this.isDateSelected) {
          sessionStorage.setItem("ca_date_filters", this.dateSelected);
        } else {
          sessionStorage.setItem("ca_date_filters", '');
        }
        if (this.isBatchSelected) {
          sessionStorage.setItem("ca_batch_filters", this.batchSelected);
        } else {
          sessionStorage.setItem("ca_batch_filters", '');
        }
      }
    }
  });
}
