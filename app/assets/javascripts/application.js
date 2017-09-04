//******项目自有JS单独放在放在这里，可以加快调试时AssetPipline实时编译的速度***********
//***************************************************************************
//= require_tree ./extensions
//= require_self
//= require_tree ./controllers
//= require cable


$(document).on("turbolinks:load",function(){
  initDatePicker();
});

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
