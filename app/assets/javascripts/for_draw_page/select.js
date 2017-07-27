$(document).on("turbolinks:load",function(){
  if(typeof(goTools)!=="undefined"){ //goTools是否已经初始化
    bindHighLighEvents();
    bindFeqEvents();
  }
});

function bindHighLighEvents(){
  highLightMainFunction();
  goTools.addDiagramListener("ChangedSelection",highLightMainFunction);  //选择改变时
  $("#tab_diagram_operation :checkbox").change(highLightMainFunction);  //复选框改变时
}

function  bindFeqEvents(){
  $("#btn-filter-feq").click(function(){
    var filterMethod=$("#fitler-method").val();
    var filterType=$("#fitler-type").val();
    var feq=$("#filter-feq").val();
    frequencyFilter(feq,filterMethod,filterType);
  });
  $("#btn-reset-feq").click(resetFilter);
  $(document).on("filter",highLightMainFunction);//自定义事件
}

function highLightMainFunction(){
  var ogirinColor="#7B7B7B";
  var originWidth=4;
  var displayMax=$("#check-diaplay-max").is(":checked");
  var displayCon=$("#check-diaplay-connected").is(":checked");
  var displayBtw=$("#check-diaplay-between").is(":checked");
  var selections=goTools.selection;
  if(displayMax && selections.count===0){
    doHighLight(selections,"DISPLAY_MAX","red",ogirinColor,15,originWidth);
  }else if(displayCon && selections.count===1){
    doHighLight(selections,"ALL_CONNECT","red",ogirinColor,10,originWidth);
  }else if(displayBtw && selections.count===2){
    doHighLight(selections,"LINKS_BETWEEN","red",ogirinColor,10,originWidth);
  }else{
    unHighLightAll(ogirinColor,originWidth);
  }
}

function doHighLight(selections,type,color,originColor,width,originWidth) {
  goTools.nodes.each(function(node) { node.highlight = {color:originColor,width:originWidth};});
  goTools.links.each(function(link) { link.highlight = {color:originColor,width:originWidth};});
  var targets=null;
  switch (type) {
    case "ALL_CONNECT": setAllConnect(selections,color,width); break;
    case "LINKS_BETWEEN": setLinksBetween(selections,color,width);break;
    case "DISPLAY_MAX": setFeqMax(color,width);break;
  }
  highLightExec(targets);
}

function highLightExec(targets){
  function lightIt(obj){
    var hlt = obj.highlight;
    var shp = obj.findObject("OBJSHAPE");
    shp.stroke = hlt["color"];
    shp.strokeWidth = hlt["width"];
  }
  if(targets instanceof Array && targets.size>0){
    targets.forEach(function(t){
      lightIt(t);
    });
  }else{
    goTools.nodes.each(function(node) {
      lightIt(node);
    });
    goTools.links.each(function(link) {
      lightIt(link);
    });
  }
}

function unHighLightAll(originColor,originWidth){
  goTools.nodes.each(function(node) {
    var shp = node.findObject("OBJSHAPE");
    shp.stroke = originColor;
    shp.strokeWidth = originWidth;
  });
  goTools.links.each(function(link) {
    var shp = link.findObject("OBJSHAPE");
    shp.stroke = originColor;
    shp.strokeWidth = originWidth;
  });
}

function setAllConnect (selections,color,width) {
  var sel=selections.first();
  if (sel instanceof go.Node) {
    sel.highlight= {color,width};
    sel.linksConnected.each(function(link) { link.highlight = {color,width}; });
    sel.findNodesConnected().each(function(node) {
      var isLinksAllVisible=false;
      sel.findLinksBetween(node).each(function(l){
        if(l.visible){
          isLinksAllVisible=true;
          return;
        }
      });
      if(isLinksAllVisible){
        node.highlight = {color,width};
      }
    });
  }
}

function setLinksBetween (selections,color,width) {
  var selArray=selections.toArray();
  var first=selArray[0];
  var second=selArray[1];
  var links=first.findLinksTo(second);
  if (first instanceof go.Node &&second instanceof go.Node) {
    first.highlight= {color,width};
    second.highlight= {color,width};
    links.each(function(link){link.highlight = {color,width};});
  }
}

function frequencyFilter(feq,method,type){
  feq=feq.toString();
  switch (type) {
    case "continuous":  //连续筛选
      if(!feq ){
        resetFilter();
        return;
      }
      goTools.links.each(function(link){
        var text=link.findObject("TEXTBLOCK").text;
        link.visible=link.visible && text.compareTo(feq,method);
      });
      break;
    case "renew":  //重新筛选
      resetFilter();
      goTools.links.each(function(link){
        var text=link.findObject("TEXTBLOCK").text;
        link.visible=text.compareTo(feq,method);
      });
      break;
    default:
      true;
  }
  goTools.nodes.each(function(node){
    var lonely=true;
    node.linksConnected.each(function(link){
      if(link.visible){
        lonely=false;
        return;
      }
    });
    if(lonely){
      node.visible=false;
    }
  });
  $(document).trigger("filter");
}

function resetFilter(){
  goTools.nodes.each(function(node){node.visible=true});
  goTools.links.each(function(link){link.visible=true});
  $(document).trigger("filter");
}

function setFeqMax(color,width){
  var maxLinks={targets:[],value:-999};
  goTools.links.each(function(link){
    var feq=parseInt(link.findObject("TEXTBLOCK").text);
    if(link.visible && feq>maxLinks["value"]) {
      maxLinks["targets"]=[link];
      maxLinks["value"]=feq;
    }else if(link.visible && feq==maxLinks["value"]){
      maxLinks["targets"].push(link);
    }
  });
  var targets=maxLinks["targets"];
  var toBeHighLights=[];
  targets.forEach(function(t){
    t.highlight={color,width};
    t.fromNode.highlight={color,width};
    t.toNode.highlight={color,width};
    toBeHighLights.push(t,t.fromNode,t.toNode);
  });
  return toBeHighLights;
}
