$(document).on("turbolinks:load",function(){
  if(typeof(goTools)!=="undefined"){ //goTools是否已经初始化
    highLightMainFunction();
    goTools.addDiagramListener("ChangedSelection",highLightMainFunction);
    $("#tab_diagram_operation :checkbox").change(highLightMainFunction);///////
    $("#btn-filter-feq").click(function(){
      var filterMethod=$("#fitler-method").val();
      var filterType=$("#fitler-type").val();
      var feq=$("#filter-feq").val();
      frequencyFilter(feq,filterMethod,filterType);
    });
    $("#btn-reset-feq").click(resetFilter);
  }
});

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
    sel.findNodesConnected().each(function(node) { node.highlight = {color,width};});
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
  switch (type) {
    case "continuous":  //连续筛选
      if(!feq ){
        resetFilter();
      }
      break;
    case "renew":  //重新筛选
      resetFilter();
      break;
    default:
      true;
  }
  feq=feq.toString();
  goTools.links.each(function(link){
    var text=link.findObject("TEXTBLOCK").text;
    link._visible_=text.compareTo(feq,method);
  });
  goTools.nodes.each(function(node){
    var lonely=true;
    node.linksConnected.each(function(link){
      if(link._visible_){
        lonely=false;
        return;
      }
    });
    if(lonely){
      node.visible=false;
    }
  });
}

function resetFilter(){
  goTools.nodes.each(function(node){node.visible=true});
  goTools.links.each(function(link){link._visible_=true});
}

function setFeqMax(color,width){
  var maxLink={target:null,value:-999};
  goTools.links.each(function(link){
    var feq=link.findObject("TEXTBLOCK").text;
    if(feq>maxLink["value"]) {
      maxLink["target"]=link;
      maxLink["value"]=feq;
    }
  });
  var target=maxLink["target"];
  target.highlight={color,width};
  target.fromNode.highlight={color,width};
  target.toNode.highlight={color,width};
  return [target,target.fromNode,target.toNode];
}
