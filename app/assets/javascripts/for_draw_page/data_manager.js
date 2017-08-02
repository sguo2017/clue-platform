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

function dataUrlToBlob(dataUrl) {
  var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

function saveAnalyseResult(dataUrl,imageUrl,title){
  $.ajax({
    url: "/call_analyse_savers",
    method: "POST",
    data: {call_analyse_saver: {data_url: dataUrl,image_url: imageUrl,title: title}}
  }).done(function(response){
    alert("成功保存数据到服务器！");
  }).error(function(response){
    alert("保存失败");
  });
}

function saveDataToFastDFS(title){
  var formData = new FormData();
  var url = 'http://123.56.157.233:9090/FastDFSWeb/servlet/imageUploadServlet';
  var data = new Blob([goTools.model.toJson()],{type: 'text/plain'});
  var imageDataUrl = goTools.makeImageData({
    size: new go.Size(160, 120)
  });
  var image = dataUrlToBlob(imageDataUrl);
  formData.append('data',data,'data.json');
  formData.append('image',image,'image.png');
  fetch(url, {
    method: 'POST',
    mode: "cors",
    body: formData
  })
  .then(function(response){return response.json();})
  .then(function(json){
    var dataUrl = json["data"];
    var imageUrl = json["image"];
    saveAnalyseResult(dataUrl,imageUrl,title);
  }).catch(function(error){
    alert("服务器连接失败，请重试！");
  });
}
