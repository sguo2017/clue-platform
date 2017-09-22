import {DiagramCreator} from '../extensions/diagram_creator';
import {DiagramHighlightManager} from '../extensions/go_diagram_managers';
(function() {
  $(document).on("turbolinks:load", function() {
    if ($("#cas_show_diagram").length > 0) {
      initCasShowDiagram();
    }
  });

  function initCasShowDiagram() {
    fetchDiagramData().then(function(response){
      return response.json();
    }).then(function(model){
      var diagramCreator = new DiagramCreator();
      var diagram = diagramCreator.createCalllistDiagram({
        el: "cas_show_diagram",
        model: model
      });
      var dhlm = new DiagramHighlightManager(diagram);
      dhlm.addDiagramTrigger("ChangedSelection", "flush");
    }).catch(function(e){
      alert("发生错误!");
      console.log(e);
    })
  }

  function fetchDiagramData() {
    return fetch($("#cas_show_diagram").data("data-url"), {
      method: "get"
    });
  }
})();
