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

function bindFeqEvents(){
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
  goTools.clearHighlighteds();
  var displayMax=$("#check-diaplay-max").is(":checked");
  var displayCon=$("#check-diaplay-connected").is(":checked");
  var displayBtw=$("#check-diaplay-between").is(":checked");
  var selections=goTools.selection;
  if(displayMax && selections.count===0){
    setFeqMax();
  }else if(displayCon && selections.count===1){
    setAllConnected(selections);
  }else if(displayBtw && selections.count===2){
    var sa=selections.toArray();
    setAllPaths(findAllPaths(sa[0],sa[1]));
  }
}

function setFeqMax(){
  var maxLinks={targets:[],value:-999};
  goTools.links.each(function(link){
    if(link.can_show!=false){
      var feq=parseInt(link.findObject("TEXTBLOCK").text);
      if(link.visible && feq>maxLinks["value"]) {
        maxLinks["targets"]=[link];
        maxLinks["value"]=feq;
      }else if(link.visible && feq==maxLinks["value"]){
        maxLinks["targets"].push(link);
      }
    }
  });
  var targets=maxLinks["targets"];
  targets.forEach(function(t){
    lightIt(t);
    lightIt(t.fromNode);
    lightIt(t.toNode);
  });
}

function setAllConnected (selections) {
  var sel=selections.first();
  if (sel instanceof go.Node) {
    lightIt(sel);
    sel.linksConnected.each(function(link) {
      if(link.can_show!=false && link.visible){
        lightIt(link);
      }
    });
    sel.findNodesConnected().each(function(node) {
      var isLinksAllVisible=false;
      sel.findLinksBetween(node).each(function(l){
        if(l.can_show!=false && l.visible){
          isLinksAllVisible=true;
          return;
        }
      });
      if(isLinksAllVisible){
        lightIt(node);
      }
    });
  }
}

function setAllPaths(paths){
  function isInterrupt(path){
    var interupt=false;
    for(var i=0;i<path.count-1;i++){
      var links=path.elt(i).findLinksBetween(path.elt(i+1));
      var hasVisibleLinks=false;
      links.each(function(link){
        if(link.can_show!=false && link.visible){
          hasVisibleLinks=true;
          return;
        }
      });
      if(!hasVisibleLinks){
        interupt=true;
        break;
      }
    }
    return interupt;
  }
  paths.each(function(path){
    if(!isInterrupt(path)){
      for(var i=0;i<path.count-1;i++){
        lightIt(path.elt(i));
        var links=path.elt(i).findLinksBetween(path.elt(i+1));
        links.each(function(link){
          if(link.can_show!=false && link.visible){
            lightIt(link);
          }
        });
      }
      lightIt(path.elt(path.count-1));
    }
  });
}

function findAllPaths(begin, end) {
  var stack = new go.List(go.Node);
  var coll = new go.List(go.List);
  function find(source, end) {
    source.findNodesOutOf().each(function(n) {
      if (n === source) return;  // ignore reflexive links
      if (n === end) {  // success
        var path = stack.copy();
        path.add(end);  // finish the path at the end node
        coll.add(path);  // remember the whole path
      } else if (!stack.contains(n)) {  // inefficient way to check having visited
        stack.add(n);  // remember that we've been here for this path (but not forever)
        find(n, end);
        stack.removeAt(stack.count - 1);
      }  // else might be a cycle
    });
  }
  stack.add(begin);  // start the path at the begin node
  find(begin, end);
  return coll;
}

function lightIt(obj){
  obj.isHighlighted=true;
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
      if(link.can_show!=false){
        var text=link.findObject("TEXTBLOCK").text;
        link.visible=link.visible && text.compareTo(feq,method);
      }
    });
    break;
    case "renew":  //重新筛选
    resetFilter();
    goTools.links.each(function(link){
      if(link.can_show!=false){
        var text=link.findObject("TEXTBLOCK").text;
        link.visible=text.compareTo(feq,method);
      }
    });
    break;
    default:
    true;
  }
  goTools.nodes.each(function(node){
    var lonely=true;
    node.linksConnected.each(function(link){
      if(link.can_show!=false && link.visible){
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
  goTools.links.each(function(link){
    if(link.can_show!=false){
      link.visible=true
    }
  });
  $(document).trigger("filter");
}
