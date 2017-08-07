$(document).on("turbolinks:load",function(){
  mainFunction($("#cas_diagram"),$("#cas_title"),$("#cas_date"));
  $(".cas-list-item").click(function(){
    changeItem(this);
  });
});

function mainFunction(diagramSelector,titleSelector,dateSelector){
  if(diagramSelector.length>0){
    var call_analyse_id = sessionStorage.getItem('call_analyse_id');
    var call_analyse_data_url = sessionStorage.getItem('call_analyse_data_url');
    var call_analyse_title = sessionStorage.getItem('call_analyse_title');
    var call_analyse_created_at = sessionStorage.getItem('call_analyse_created_at');
    if(!call_analyse_id || !call_analyse_data_url){
      var dataReciveObject = {};
      syncLoadDefaultData(dataReciveObject);
      if(dataReciveObject['success']){
        call_analyse_id = dataReciveObject['call_analyse_id'];
        call_analyse_data_url = dataReciveObject['call_analyse_data_url'];
        call_analyse_title = dataReciveObject['call_analyse_title'];
        call_analyse_created_at = dataReciveObject['call_analyse_created_at'];
      }
    }
    titleSelector.text(call_analyse_title);
    dateSelector.text(call_analyse_created_at);
    loadModelData(call_analyse_data_url,diagramSelector);
  }
}

function syncLoadDefaultData(dataReciveObject){
  $.ajax({
    url: "/call_analyse_savers/default",
    method: 'get',
    async: false
  }).done(function(response){
    dataReciveObject['success'] = true;
    dataReciveObject['call_analyse_id'] = response['id'];
    dataReciveObject['call_analyse_data_url']=  response['data_url'];
    dataReciveObject['call_analyse_title'] = response['title'];
    dataReciveObject['call_analyse_created_at'] = response['created_at'];
  }).error(function(err){
    alert("加载默认数据失败！");
    console.log(err);
  });
}

function drawAnalyseDiagram(jsonData,diagramSelector){
  var $$ = go.GraphObject.make;
  if(typeof(analyseDiagram)==="undefined"){
    analyseDiagram =$$(go.Diagram, diagramSelector.attr("id"),{
      'initialContentAlignment': go.Spot.Center,
      'initialDocumentSpot': go.Spot.TopCenter,
      'initialViewportSpot': go.Spot.TopCenter,
      "animationManager.isEnabled": true,  // turn off automatic animations
      "grid.visible": true,  // display a background grid for the whole diagram
      "grid.gridCellSize": new go.Size(20, 20),
      // allow double-click in background to create a new node
      //  "clickCreatingTool.archetypeNodeData": { text: "Node" },
      // allow Ctrl-G to call the groupSelection command
      //  "commandHandler.archetypeGroupData":
      //      { text: "Group", isGroup: true, color: "blue" },
      //  "commandHandler.copiesTree": true,  // Ctrl+C复制整棵树
      //  "commandHandler.deletesTree": true, // Delete删除整棵树
      "toolManager.hoverDelay": 100,  // how quickly tooltips are shown
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //鼠标滚轮定义为缩放
      "draggingTool.dragsTree": true,  // 允许拖动整棵树，按住Ctrl拖动复制整棵树
      "draggingTool.isGridSnapEnabled": true,
      "undoManager.isEnabled": true,  // enable undo & redo
      'initialAutoScale': go.Diagram.UniformToFill,
      'allowZoom': true,
      'allowDrop': true,
      'allowLink': true,
      'allowSelect': true
      // 'layout.isOngoing': false

    });

    analyseDiagram.nodeTemplate = $$(
      go.Node,
      "Auto",
      {},
      new go.Binding("key", "key"),
      new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
      new go.Binding("visible", "visible_attr",function(v){
        return v.can_show&&!v.hidden_by_feq&&!v.hidden_by_hlight&&!v.hidden_by_sel;
      }),

      $$(
        go.Shape,
        "circle", // 预定义的形状通过字符串来标示
        { /* 设置Shape的属性 */
          name: "OBJSHAPE",
          strokeWidth: 4,
          stroke: "#7B7B7B"
        },
        new go.Binding("fill", "fill"),
        new go.Binding("stroke", "isHighlighted", function(h) { return h ? "red" : "#7B7B7B"; }).ofObject(),
        new go.Binding("strokeWidth", "isHighlighted", function(h) { return h ? 10 : 4; }).ofObject()
      ),

      $$(
        go.TextBlock,
        "default text",  // 初始化时的文本属性，可以通过字符串参数直接设置
        { /* 设置文本块的属性 */
          margin: 2,
          stroke: "#181818",
          font: "bold 12pt serif",
          alignment: go.Spot.Center,
          verticalAlignment: go.Spot.Center
        },
        // 绑定举例：将文本块的text属性绑定到数据的key属性
        new go.Binding("text", "key"))
      );
      analyseDiagram.linkTemplate = $$(
        go.Link,
        {
          layerName: "Background",
          selectable: false
        },
        new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
        new go.Binding("visible", "visible_attr",function(v){
          return v.can_show&&!v.hidden_by_feq&&!v.hidden_by_hlight&&!v.hidden_by_sel;
        }),
        new go.Binding("visible", "can_show"),
        new go.Binding("can_show", "can_show"),
        $$(
          go.Shape,
          {
            name: "OBJSHAPE",
            strokeWidth: 4,
            stroke: "#7B7B7B"
          },
          new go.Binding("stroke", "isHighlighted", function(h) { return h ? "red" : "#7B7B7B"; }).ofObject(),
          new go.Binding("strokeWidth", "isHighlighted", function(h) { return h ? 10 : 4; }).ofObject()
        ),
        $$(
          go.TextBlock,
          {
            name: "TEXTBLOCK",
            stroke: "black",
            font: "bold 12pt serif",
            background: "lightblue"
          },
          new go.Binding("text", "feq")
        )
      );
    }
    try {
      analyseDiagram.layout = $$(go.ForceDirectedLayout);
      analyseDiagram.startTransaction("importData");
      go.Model.fromJson(jsonData,analyseDiagram.model);
      analyseDiagram.commitTransaction("importData");
    } catch (e) {
      analyseDiagram.rollbackTransaction();
      alert("绘制失败！");
      console.log(e);
    } finally {
      analyseDiagram.layout = $$(go.Layout);
    }
  }

  function loadModelData(url,diagramSelector){
    fetch(url, {
      method: 'GET',
      mode: "cors"
    })
    .then(function(response){return response.json();})
    .then(function(json){drawAnalyseDiagram(json,diagramSelector);})
    .catch(function(err){console.log(err);alert("从服务器获取数据失败，请重试！");});
  }
  
  function changeItem(selector){
    selector=$(selector);
    selector.siblings(".active").removeClass('active');
    selector.addClass("active");
    sessionStorage.setItem('call_analyse_id',selector.data('casId'));
    sessionStorage.setItem('call_analyse_data_url',selector.data('casDataUrl'));
    sessionStorage.setItem('call_analyse_title',selector.data('casTitle'));
    sessionStorage.setItem('call_analyse_created_at',selector.data('casCreatedAt'));
    mainFunction($("#cas_diagram"),$("#cas_title"),$("#cas_date"));

  }
