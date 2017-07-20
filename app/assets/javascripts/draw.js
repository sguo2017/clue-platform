$(document).on("turbolinks:load", function(){
  draw(go_tools_init());
});

function go_tools_init() {
	if(jQuery("#tools_main_diagram").length==0) return false;

	var $$ = go.GraphObject.make;

	// GoTools
	goTools = new GoTools("tools_main_diagram");

	// Filesystem state object
	goTools.goToolsFilesSystem = new GoToolsFilesSystem(goTools, {
		openWindowId: "openDocument",
		removeWindowId: "removeDocument",
		currentFileId: "currentFile",
		filesToRemoveListId: "filesToRemove",
		filesToOpenListId: "filesToOpen"
	});

	// UI Interaction state object
	goTools.goToolsUI = new GoToolsUI(goTools, "ui", "goTools");
	goTools.goToolsUI.setBehavior("dragging");

	// Overview
	$$(go.Overview, "tools_main_overview", { observed: goTools, contentAlignment: go.Spot.Center, maxScale: 0.5 });

	// Palettes
	goTools.palette = new GoToolsPalette("tools_main_palette", goTools);

	return true;
}

function draw(status){
	if(!status) return;
  var type=getQueryString('type');
  var sources=getQueryString('sources');
  switch(type){
    case 'calllist':
      drawCalllist(sources);
      break;
    default:
      true;
  }
}

function drawCalllist(sources){
    switch (sources) {
    case 'excel':
      calllistDrawing.rawNodesArray=excelUtils.nodesForGoJs;
      calllistDrawing.rawLinksArray=excelUtils.linksForGoJs;
      calllistDrawing.formatData();
      calllistDrawing.force_directed();
      break;
    case 'db':
      calllistDrawing.getDataFromServer();
      calllistDrawing.force_directed();
      break;
    default:
      calllistDrawing.force_directed();
  }
}
