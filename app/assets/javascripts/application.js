// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's 
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// require jquery
//= require jquery.turbolinks
//= require rails-ujs
//= require turbolinks
// require bootstrap --这里和bootstrap.min.js冲突，屏蔽掉，否则下拉菜单出不来
//= require suspects_teams
//= require_tree .
//= require cp-global

function go_tools_init() {
	if(jQuery("#tools_main_diagram").length==0) return;
	
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

	
}

document.addEventListener("turbolinks:load", go_tools_init);
