$(document).on("turbolinks:load", function() {
  if ($("#calllist-analyse-index-app").length > 0) {
    initCalllistAnalyseToolsIndexVue();
  }
});

/*
 *描述：初始化Vue
 *问题：貌似Vue与GoJS有点不兼容，如果先初始化GoJs再初始化Vue会导致画布元素无法显示
 *     解决办法是（1）先初始化Vue再初始化GoJS;（2）在Vue的mounted函数中初始化
 *   （3）缩小Vue挂载根节点的范围，使之不包含GoJS画布容器
 *说明：本页面中使用Vue的原因是因为使用了vue模态框组件；但是本页面的核心功能————绘图和交互
 *     相关的状态变量和事件并没有交由Vue管理，因为实在太分散而且太多，因此直接委托各个Manager
 *     例如dhlm、dvm、fsm等管理，结合JQuery事件进行操作。
 */
function initCalllistAnalyseToolsIndexVue() {
  var Modal = {
    template: "#modal-template",
    data: function() {
      return {
        modalWidth: "600px"
      };
    }
  };
  new Vue({
    el: "#calllist-analyse-index-app",
    components: {
      'modal': Modal
    },
    mounted: function() {
      initCalllistAnalyseIndexDiagram();
      $(':input').labelauty();
    },
    data: {
      showModal: false
    }

  });
}

/*
 *功能：初始化话单分析图标
 *描述：各个Manager用来统一管理diagram的交互事件
 *     通过AddDOMTrigger将DOM事件与diagram功能
 *     相绑定，也实现了Manager与DOM操作解耦，Manager中
 *     不应该包含任何DOM操作逻辑，仅仅关心diagram逻辑。
 */
function initCalllistAnalyseIndexDiagram() {
  diagram = judgeCalllistDiagramTypeAndDraw();
  if(!diagram) return;
  //缩略图
  diagram.createOverview("tools_main_overview");
  //高亮管理器
  var dhlm = new DiagramHighlightManager(diagram);
  //选择改变时触发高亮更新
  dhlm.addDiagramTrigger("ChangedSelection", "flush");
  //复选框改变时触发高亮更新
  dhlm.addDOMTrigger("#tab_diagram_operation :checkbox", "change", "flush", {
    doBefore: function() {
      this.displayMax = $("#check-diaplay-max").is(":checked");
      this.displayCon = $("#check-diaplay-connected").is(":checked");
      this.displayBtw = $("#check-diaplay-between").is(":checked");
    }
  });

  //可见性管理器
  var dvm = new DiagramVisibleMnager(diagram, dhlm);
  //增加触发相应操作的DOM事件
  dvm.addDOMTrigger("#btn-hide-unselected", "click", "hideUnselected");
  dvm.addDOMTrigger("#btn-show-unselected", "click", "showUnselected");
  dvm.addDOMTrigger("#btn-hide-unhlighted", "click", "hideUnhighLighted");
  dvm.addDOMTrigger("#btn-show-unhlighted", "click", "showUnhighLighted");
  dvm.addDOMTrigger("#btn-reset-all", "click", "showUnselected");
  dvm.addDOMTrigger("#btn-reset-all", "click", "showUnhighLighted");

  //频率筛选管理器
  var fsm = new FrequencyScreenManager(diagram, dhlm);
  //增加触发相应操作的DOM事件
  fsm.addDOMTrigger("#btn-filter-feq", "click", "doFilter", {
    doBefore: function() {
      this.method = $("#fitler-method").val();
      this.type = $("#fitler-type").val();
      this.feq = $("#filter-feq").val();
    }
  });
  fsm.addDOMTrigger("#btn-reset-feq", "click", "resetFilter");
  fsm.addDOMTrigger("#btn-reset-all", "click", "resetFilter");

  //数据管理器
  var ddm = new DiagramDataManager(diagram, dhlm);
  //单选更改时更新Manager变量和视图
  ddm.addDOMTrigger("input[name='save-location']", "change", null, {
    doAfter: function() {
      this.setSaveLocation($("input[name='save-location']:checked").val());
      this.saveLocation === "server-new" ? $("#div-save-title").show() : $("#div-save-title").hide();
    }
  });
  ddm.addDOMTrigger("#btn-image-export", "click", "exportImage");
  //保存前更新各个设置变量
  ddm.addDOMTrigger("#btn-data-save", "click", "saveData", {
    doBefore: function() {
      this.setSaveLocation($("input[name='save-location']:checked").val());
      this.setSaveTitle($("#text-save-title").val());
    }
  });
  //显示文件选择框
  ddm.addDOMTrigger("#btn-data-import", "click", null, {
    doAfter: function() {
      $("#field-data-import").click();
    }
  });
  //导入前更新文件
  ddm.addDOMTrigger("#field-data-import", "change", "importFromFile", {
    doBefore: function() {
      this.setFile($("#field-data-import"));
    }
  });

  //布局管理
  var dlm = new DiagramLayoutManager(diagram);
  dlm.addDOMTrigger(".layout-setter", "click", "applyLayout", {
    doBefore: function(element) {
      var layout = $(element).data("layout");
      this.setLayout(layout);
    }
  });
  dlm.addDOMTrigger(".wheel-setter", "click", "applyWheelBehavior", {
    doBefore: function(element) {
      var behavior = $(element).data("behavior");
      this.setWheelBehavior(behavior);
    }
  });
  dlm.addDOMTrigger(".scale-setter", "click", "adjustScale", function(element){
    var scaleType = $(element).data("scale-type");
    return [scaleType];
  });
}

//判断绘画类型以及数据来源等
function judgeCalllistDiagramTypeAndDraw() {
  var type = window.location.href.getQueryString('type');
  var sources = window.location.href.getQueryString('sources');
  var diagram;
  switch (type) {
    case 'calllist':
      diagram = drawCalllistAnalyseDiagram(sources);
      break;
    default:
      false;
  }
  return diagram;
}

//实际的画图操作
function drawCalllistAnalyseDiagram(sources) {
  var $$ = go.GraphObject.make;
  var calllistDiagram;
  if ($("#tools_main_diagram").length === 1) {
    calllistDiagram = $$(go.Diagram, "tools_main_diagram", {
      'initialContentAlignment': go.Spot.Center,
      'initialDocumentSpot': go.Spot.TopCenter,
      'initialViewportSpot': go.Spot.TopCenter,
      "animationManager.isEnabled": true, // turn off automatic animations
      "grid.visible": true, // display a background grid for the whole diagram
      "grid.gridCellSize": new go.Size(20, 20),
      // allow double-click in background to create a new node
      //  "clickCreatingTool.archetypeNodeData": { text: "Node" },
      // allow Ctrl-G to call the groupSelection command
      //  "commandHandler.archetypeGroupData":
      //      { text: "Group", isGroup: true, color: "blue" },
      //  "commandHandler.copiesTree": true,  // Ctrl+C复制整棵树
      //  "commandHandler.deletesTree": true, // Delete删除整棵树
      "toolManager.hoverDelay": 100, // how quickly tooltips are shown
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //鼠标滚轮定义为缩放
      "draggingTool.dragsTree": true, // 允许拖动整棵树，按住Ctrl拖动复制整棵树
      "draggingTool.isGridSnapEnabled": true,
      "undoManager.isEnabled": true, // enable undo & redo
      'initialAutoScale': go.Diagram.UniformToFill,
      'allowZoom': true,
      'allowDrop': true,
      'allowLink': true,
      'allowSelect': true
      // 'layout.isOngoing': false

    });
    var templatesManager = new DiagramTemplatesManager();
    calllistDiagram.nodeTemplate = templatesManager.calllist.nodeTemplate;
    calllistDiagram.linkTemplate = templatesManager.calllist.linkTemplate;

    var cdr = new CalllistDataReader();
    switch (sources) {
      case 'excel':
        cdr.getDataFromLocal();
        cdr.formatData();
        break;
      case 'db':
        cdr.getDataFromServer();
        cdr.formatData();
        break;
      default:
        break;
    }
    calllistDiagram.layout = $$(go.ForceDirectedLayout);
    calllistDiagram.startTransaction("generateTree");
    calllistDiagram.model.nodeDataArray = setExtraNodeAttr(cdr.nodesArray);
    calllistDiagram.model.linkDataArray = setExtraLinkAttr(cdr.linksArray);
    calllistDiagram.commitTransaction("generateTree");
    calllistDiagram.layout = $$(go.Layout);
    setTimeout(function() {
      if (cdr.nodesArray.length <= 0 && cdr.linksArray.length <= 0) {
        alert('没有数据');
      }
    }, 0);
  }

  function setExtraNodeAttr(nodes) {
    return nodes.map(function(node) {
      node = shallowCopy(node);
      node.visible_attr = {
        can_show: true,
        hidden_by_feq: false,
        hidden_by_hlight: false,
        hidden_by_sel: false
      };
      return node;
    });
  }

  function setExtraLinkAttr(links) {
    var show = links.map(function(link) {
      var result = shallowCopy(link);
      result.visible_attr = {
        can_show: true,
        hidden_by_feq: false,
        hidden_by_hlight: false,
        hidden_by_sel: false
      };
      return result;
    });

    var hide = links.map(function(link) {
      var result = shallowCopy(link);
      var temp = result.from;
      result.from = result.to;
      result.to = temp;
      result.visible_attr = {
        can_show: false,
        hidden_by_feq: false,
        hidden_by_hlight: false,
        hidden_by_sel: false
      };
      return result;
    });
    return show.concat(hide);
  }

  return calllistDiagram;
}
