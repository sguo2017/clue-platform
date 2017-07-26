$(document).on("turbolinks:load",function(){
  if(typeof(goTools)!=="undefined"){
    bindDataEvents();
  }
});

function bindDataEvents(){
  $("#btn-image-export").click(exportImage);
  $("#btn-data-save").click({selector: $("#btn-data-save")},exportToFile);
  $("#btn-data-import").click({selector: $("#field-data-import")},showFilePicker);
  $("#field-data-import").change({selector: $("#field-data-import")},importFromFile);
}

function exportImage(event){
  var img = goTools.makeImageData({
    maxSize: new go.Size(Infinity, Infinity),//去掉默认最大2000*2000的限制
    scale:1  //显示整个图片而非可见部分
  });
  window.open(img);
}

function exportToFile(event){
  var data=goTools.model.toJson();
  event.data["selector"].attr("href","data:text/txt;charset=utf-8,"+data);
}

function showFilePicker(event){
  event.data["selector"].click();
}

function importFromFile(event){
  var files=event.data["selector"].get(0).files;
  if(files.length<=0) return;
  var file=files[0];
  var reader=new FileReader();
  reader.readAsText(file,"utf-8");
  reader.onload=function(e){
    try{
      goTools.layout = $$(go.ForceDirectedLayout);
      goTools.startTransaction("importData");
      go.Model.fromJson(this.result,goTools.model);
      goTools.commitTransaction("importData");
      goTools.layout = $$(go.Layout);
      highLightMainFunction();
    }catch(err){
      alert("文件内容错误！");
      goTools.rollbackTransaction();
      goTools.layout = $$(go.Layout);
    }
  };
}
