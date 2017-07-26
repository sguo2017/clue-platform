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
//= require jquery
//= require jquery-ui
//= require jquery.turbolinks
//= require jquery_ujs
//= require bootstrap
//= require turbolinks
//= require_self
//= require_tree .

$(document).on("turbolinks:load",initApp);

function initApp(){
  go_tools_init();
}

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
  Window.isGoToolsInit=true;
  return true;
}

function getQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

String.prototype.compareTo= function (another,_method_){
  another=another.toString();
  switch (_method_.toString()) {
    case "gt":
    return this>another;
    break;
    case "gte":
    return this>=another;
    break;
    case "lt":
    return this<another;
    break;
    case "lte":
    return this<=another;
    break;
    case "eq":
    return this===another;
    break;
    case "neq":
    return this!=another;
    break;
    default:
    return false;
  }
}
