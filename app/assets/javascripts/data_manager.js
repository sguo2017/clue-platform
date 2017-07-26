$(document).on("turbolinks:load",function(){
  $("#btn-image-export").on("click", function() {
    var img = goTools.makeImageData({
      maxSize: new go.Size(Infinity, Infinity),//去掉默认最大2000*2000的限制
      scale:1  //显示整个图片而非可见部分
    });
    window.open(img);
  });
});
