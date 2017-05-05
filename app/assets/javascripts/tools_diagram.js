
function file_new(){
	tools.diagram.model.nodeDataArray = [];
}
function toggle_search(){
	$(".tools_search").toggle();
}
function tools_initial(){
	if($("#tools_main_diagram").length>0){

		var diagram = $$(go.Diagram, "tools_main_diagram", {
			initialContentAlignment: go.Spot.Center,
			initialAutoScale: go.Diagram.UniformToFill,
			allowDrop: true,
			"animationManager.duration": 600,
			"animationManager.isEnabled": false,
			"undoManager.isEnabled": true,
			"grid.visible": true
		})

		for(var key in tools.node_templates){
			diagram.nodeTemplateMap.add(key, tools.node_templates[key]);	
		}
		for(var key in tools.link_templates){
			diagram.linkTemplateMap.add(key, tools.link_templates[key]);	
		}

	    diagram.addDiagramListener("Modified", function(e) {
	      var button = document.getElementById("SaveButton");
	      if (button) button.disabled = !diagram.isModified;
	      var idx = document.title.indexOf("（未保存）");
	      if (diagram.isModified) {
	        if (idx < 0) document.title = "（未保存）" + document.title;
	      } else {
	        if (idx >= 0) document.title = document.title.substr(0, idx);
	      }
	    });

		tools.diagram = diagram;
		tools.overview = $$(go.Overview, "tools_main_overview", {observed: diagram, contentAlignment: go.Spot.Center, maxScale: 0.5});
		tools.palette = new go.Palette("tools_main_palette"); 
		tools.palette.nodeTemplateMap = diagram.nodeTemplateMap;
		tools.palette.model.nodeDataArray = getPaletteNodeData("circuit");

		if ($("#dataInspector").length>0) {
			tools.dataInspector = new Inspector("dataInspector", diagram,{
		        properties: {
		          "key": { readOnly: true },
		          "comments": {}
		        }
		    })
		}
		if ($("#debugInspector").length>0) {
			tools.debugInspector = new DebugInspector('debugInspector', diagram, {
		        acceptButton: true,
		        resetButton: true,
		        /*
		        // example predicate, only show data objects:
		        inspectPredicate: function(value) {
		          return !(value instanceof go.GraphObject)
		        }
		        */
	      	});
	     }

		//diagram_ruler();
	}
}

//document.addEventListener("turbolinks:load", tools_initial);