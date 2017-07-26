//= require_self
//= require_tree .

$(document).on("turbolinks:load",function(){
  go_tools_init();
});

function go_tools_init() {
  if($("#tools_main_diagram").length==0) return false;
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
  document.isGoToolsInit=true;
}
