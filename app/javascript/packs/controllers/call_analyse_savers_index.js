import {DiagramCreator} from '../extensions/diagram_creator';
import {DiagramHighlightManager} from '../extensions/go_diagram_managers';
(function() {
  $(document).on("turbolinks:load", function() {
    if ($("#cas_index_diagram").length > 0) {
      initCasIndexDiagram();
    }
  });

  function initCasIndexDiagram() {
    //Promise 链式写法避免Ajax回调嵌套
    asyncReadParams().then(function(params) {
      updatePageValue(params);
      return params;
    }).then(function(params) {
      return asyncFetchModelData(params["data_url"]);
    }).then(function(response) {
      return response.json();
    }).then(function(model) {
      if (model) {
        let diagramCreator = new DiagramCreator();
        return diagramCreator.createCalllistDiagram({
          el: "cas_index_diagram",
          model: model
        });
      }else{
        return null;
      }
    }).then(function(diagram) {
      var dhlm = new DiagramHighlightManager(diagram, {
        'displayMax': true
      });
      dhlm.addDiagramTrigger("ChangedSelection", "flush");
      diagram && $(".cas-list-item").click(function() {
        changeModel(this, diagram);
        dhlm.flush();
      });
    }).catch(function(e) {
      alert("发生错误！");
      console.log(e);
    });
  }

  function asyncReadParams() {
    var params = {};
    params["id"] = sessionStorage.getItem('call_analyse_id');
    params["data_url"] = sessionStorage.getItem('call_analyse_data_url');
    params["title"] = sessionStorage.getItem('call_analyse_title');
    params["created_at"] = sessionStorage.getItem('call_analyse_created_at');
    if (!params["id"] || !params["data_url"]) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: "/call_analyse_savers/default",
          method: 'get'
        }).done(function(response) {
          var params = {};
          params["id"] = response['id'];
          params["data_url"] = response['data_url'];
          params["title"] = response['title'];
          params["created_at"] = response['created_at'];
          resolve(params);
        }).fail(function(e) {
          reject(e);
        });
      });
    } else {
      return new Promise(function(resolve) {
        resolve(params);
      });
    }
  }

  function asyncFetchModelData(url) {
    return fetch(url, {
      method: 'GET'
    });
  }

  function updatePageValue(params) {
    $("#cas_index_diagram").data("diagram-id",params["id"]);
    $("#cas_title").text(params["title"]);
    $("#cas_date").text(params["created_at"]);
    $("#cas_link_to_show").attr("href","/call_analyse_savers/"+params["id"]);
  }

  function changeModel(eventTarget, diagram) {
    var selector = $(eventTarget);
    selector.siblings(".active").removeClass('active');
    selector.addClass("active");
    var params = {}
    params["id"] = selector.data('casId');
    params["data_url"] = selector.data('casDataUrl');
    params["title"] = selector.data('casTitle');
    params["created_at"] = selector.data('casCreatedAt');
    updatePageValue(params);
    sessionStorage.setItem('call_analyse_id', params["id"]);
    sessionStorage.setItem('call_analyse_data_url', params["data_url"]);
    sessionStorage.setItem('call_analyse_title', params["title"]);
    sessionStorage.setItem('call_analyse_created_at', params["created_at"]);
    asyncFetchModelData(params["data_url"]).then(function(response) {
      return response.json();
    }).then(function(model) {
      diagram.changeModel(model, {
        layoutBefore: "forceDirected",
        layoutAfter: "default"
      });
    });
  }
})();
