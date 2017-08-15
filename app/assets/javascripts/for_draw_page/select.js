$(document).on("turbolinks:load",function(){
  if(typeof(goTools)!=="undefined"){ //goTools是否已经初始化
    bindHighLighEvents();
    bindFeqEvents();
    bindHideEvents();
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
}

function bindHideEvents(){
  $("#btn-hide-unselected").click(hideUnselected);
  $("#btn-show-unselected").click(showUnselected);
  $("#btn-hide-unhlighted").click(hideUnhighLighted);
  $("#btn-show-unhlighted").click(showUnhighLighted);
  $("#btn-reset-all").click(function(){
    resetFilter();
    showUnselected();
    showUnhighLighted();
  });
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
    if(link.visible){
      var feq=parseInt(link.findObject("TEXTBLOCK").text);
      if(feq>maxLinks["value"]) {
        maxLinks["targets"]=[link];
        maxLinks["value"]=feq;
      }else if(feq==maxLinks["value"]){
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
      if(link.visible){
        lightIt(link);
      }
    });
    sel.findNodesConnected().each(function(node) {
      var isLinksAllVisible=false;
      sel.findLinksBetween(node).each(function(l){
        if(l.visible){
          isLinksAllVisible=true;
          return;
        }
      });
      if(isLinksAllVisible && node.visible){
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
        if(link.visible){
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
          if(link.visible){
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
  function setFeqHide(link,value){
    var model = goTools.model;
    var data =  link.data;
    var new_visible_attr = shallowCopy(data.visible_attr);
    new_visible_attr.hidden_by_feq = value;
    model.setDataProperty(data,"visible_attr",new_visible_attr);
  }
  feq=feq.toString();
  switch (type) {
    case "continuous":  //连续筛选
    if(!feq ){
      resetFilter();
      return;
    }
    goTools.links.each(function(link){
      if(link.visible_attr.can_show){
        var text=link.findObject("TEXTBLOCK").text;
        setFeqHide(link,!text.compareTo(feq,method));
      }
    });
    break;
    case "renew":  //重新筛选
    resetFilter();
    goTools.links.each(function(link){
      if(link.visible_attr.can_show){
        var text=link.findObject("TEXTBLOCK").text;
        setFeqHide(link,!text.compareTo(feq,method));
      }
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
      var model = goTools.model;
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_feq = true;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
    }
  });
  highLightMainFunction();
}

function resetFilter(){
  goTools.nodes.each(function(node){
    if(node.visible_attr.can_show){
      var model = goTools.model;
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_feq = false;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
    }
  });
  goTools.links.each(function(link){
    if(link.visible_attr.can_show){
      var model = goTools.model;
      var data =  link.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_feq = false;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
    }
  });
  highLightMainFunction();
}

function hideUnselected(){
  var model = goTools.model;
  goTools.nodes.each(function(node){
    if(!node.isSelected && node.visible_attr.can_show){
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_sel = true;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
      node.linksConnected.each(function(link){
        if(link.visible){
          var ldata =  link.data;
          var lnew_visible_attr = shallowCopy(ldata.visible_attr);
          lnew_visible_attr.hidden_by_sel = true;
          model.setDataProperty(ldata,"visible_attr",lnew_visible_attr);
        }
      });
    }
  });
  highLightMainFunction();
}

function showUnselected(){
  var model = goTools.model;
  goTools.nodes.each(function(node){
    if(node.visible_attr.can_show){
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_sel = false;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
    }
  });
  goTools.links.each(function(link){
    if(link.visible_attr.can_show){
      var ldata =  link.data;
      var lnew_visible_attr = shallowCopy(ldata.visible_attr);
      lnew_visible_attr.hidden_by_sel = false;
      model.setDataProperty(ldata,"visible_attr",lnew_visible_attr);
    }
  });
  highLightMainFunction();
}

function hideUnhighLighted(){
  var model = goTools.model;
  goTools.nodes.each(function(node){
    if(!node.isHighlighted && node.visible_attr.can_show){
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_hlight = true;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
      node.linksConnected.each(function(link){
        if(link.visible){
          var ldata =  link.data;
          var lnew_visible_attr = shallowCopy(ldata.visible_attr);
          lnew_visible_attr.hidden_by_hlight = true;
          model.setDataProperty(ldata,"visible_attr",lnew_visible_attr);
        }
      });
    }
  });
  highLightMainFunction();
}

function showUnhighLighted(){
  var model = goTools.model;
  goTools.nodes.each(function(node){
    if(node.visible_attr.can_show){
      var data =  node.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_hlight = false;
      model.setDataProperty(data,"visible_attr",new_visible_attr);
    }
  });
  goTools.links.each(function(link){
    if(link.visible_attr.can_show){
      var ldata =  link.data;
      var lnew_visible_attr = shallowCopy(ldata.visible_attr);
      lnew_visible_attr.hidden_by_hlight = false;
      model.setDataProperty(ldata,"visible_attr",lnew_visible_attr);
    }
  });
  highLightMainFunction();
}
