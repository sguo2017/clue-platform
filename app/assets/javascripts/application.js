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
//= require layer
//= require swiper
//= require bootstrap
//= require turbolinks
//= require vue
//= require cable
//= require_directory ../../../vendor/assets/gojs
//= require_tree ../../../vendor/assets/gojs/tools
//= require_tree ../../../vendor/assets/gojs/extensions
//= require_tree ./extensions
//= require_self
//= require_tree ./controllers
//= require_tree ./for_draw_page
//= require jquery-zoom
//= require bootstrap-datepicker

$(document).on("turbolinks:load",function(){
  go_tools_init();
  initDatePicker();
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
  return true;
}

function initDatePicker(){
  $.fn.datepicker.dates['cn'] = {
    days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六"],
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    today: "今天",
    clear: "清除",
    format: "yyyy-mm-dd",
    titleFormat: "yyyy年 MM",
    weekStart: 0
  };
  $('.date-picker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'cn'
  }).on('changeDate', function(ev){
      ev.currentTarget.dispatchEvent(new Event("input"));
      $(this).datepicker("hide");
  });
}
