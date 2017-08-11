$(document).on("turbolinks:load", function() {
  if ($("#tactic-app").length > 0) {
    initVue();
  }
});

function initVue() {
  function translateTask(origin) {
    switch (origin) {
      case "name":
        return "名称";
      case "category":
        return "类型";
      case "executor":
        return "执行人";
      case "status":
        return "状态";
      case "finished_time":
        return "完成时间";
      case "start_time":
        return "开始时间";
      case "end_time":
        return "结束时间";
      case "description":
        return "描述";
      case "created_at":
        return "创建时间";
      default:
        return origin;
    }
  }
  vvv = new Vue({
    el: "#tactic-app",
    data: {
      tacticFlowchart:null,
      tasks: [],
      taskHeaders: [],
      currentTask: {},
      isTaskEditLock: true,
      isTaskEditing: false,
      columnBlacklist:["id","tactic_id","order","updated_at"]
    },
    mounted: function() {
      if ($("#tactics-flow-container").length > 0) {
        this.tacticFlowchart = setFlowChatrt();
        this.tacticFlowchart.addDiagramListener("ChangedSelection", this.setCurrentTaskId);
      }
      var outer = this;
      $.ajax({
        url: "/tactics/" + this.tacticId() + "/get_tactic_tasks",
        method: "get"
      }).done(function(response) {
        if (response) {
          outer.tasks = response;
        }
        if (outer.tasks.length > 0) {
          outer.taskHeaders = Object.keys(outer.tasks[0]).map(translateTask);
        }
      });
    },
    methods: {
      tacticId: function() {
        return $("#tactic-app").data("tacticId");
      },
      findTaskById: function(taskId){
        if(taskId && this.tasks) {
          var taskId = taskId.toString();
          var result = this.tasks.filter(function(x){return x.id.toString() === taskId});
          if(result.length == 1){
            return result[0];
          }else{
            return null;
          }
        }
      },
      isSelectedOneNode: function() {
        var sels = this.tacticFlowchart.selection;
        return (sels.count === 1 && sels.first() instanceof go.Node);
      },
      getFirstSelected: function() {
        return this.tacticFlowchart.selection.first();
      },
      setCurrentTaskId: function() {
        if (this.isSelectedOneNode()) {
          $("#current-task-id").val(this.getFirstSelected().data["task_id"]);
        } else {
          $("#current-task-id").val('');
        }
        $("#current-task-id").click();
      },
      updateTaskIdOfNodeData: function(taskId,target){
        if(target instanceof go.Node){
          this.tacticFlowchart.model.setDataProperty(target.data,"task_id",parseInt(taskId));
        }else{
          var targetId = parseInt(target);
          var targetNode;
          this.tacticFlowchart.nodes.each(function(node){
            if(node.data.task_id == targetId){
              targetNode = node;
              return;
            }
          });
          this.tacticFlowchart.model.setDataProperty(targetNode.data,"task_id",parseInt(taskId));
        }
      },
      changeCurrentTask: function(event) {
        var currentTaskId = event.target.value;
        var target = this.findTaskById(currentTaskId);
        if (target) {
          this.currentTask = target;
          this.isTaskEditLock = false; //允许编辑
        } else if (this.isSelectedOneNode()) {
          this.currentTask = {};
          this.isTaskEditLock = false; //允许编辑
        } else {
          this.currentTask = {};
          this.isTaskEditLock = true; //禁止编辑
        }
        this.isTaskEditing = false;
      },
      editOrSave: function() {
        if (this.isTaskEditing) { //编辑状态下
          var url,method,isUpdate,outer=this;
          if(this.currentTask.id){
            url= "/tactic_tasks/"+this.currentTask.id;
            method = "PATCH";
            isUpdate = true;
          }else{
            url = "/tactic_tasks";
            method = "POST";
            isUpdate = false;
            this.currentTask.tactic_id = this.tacticId();
          }
          $.ajax({
            url: url,
            method: method,
            dataType: "json",
            data: {"tactic_task":this.currentTask}
          }).done(function(response){
            if(!isUpdate){ //创建对象时
              outer.tasks.push(response["data"]);
              $("#current-task-id").val(response["data"].id);
              outer.updateTaskIdOfNodeData(response["data"].id, outer.tacticFlowchart.selection.first());
            }
            outer.isTaskEditing = !outer.isTaskEditing;
          });  // end ajax
        }else{
          this.isTaskEditing = !this.isTaskEditing;
        }  //end if
      },  //end function
      deleteTask: function(taskId){
        var taskId = taskId.toString();
        var outer = this, conf=confirm("确定删除这个任务吗？");
        if(conf){
          $.ajax({
            url: "/tactic_tasks/"+taskId,
            method: "DELETE",
            dataType: "json"
          }).done(function(response){
            var targetIndex = outer.tasks.indexOf(outer.findTaskById(taskId));
            if(targetIndex >= 0){
              outer.tasks.splice(targetIndex,1);
              if(outer.currentTask.id.toString() == taskId){
                outer.currentTask = {};
                $("#current-task-id").val('');
                outer.updateTaskIdOfNodeData('',taskId);
              }
            }
          });
        }

      },
      finishTask: function(taskId){
        var taskId = taskId.toString();
        var outer = this, conf=confirm("确定完成这个任务吗？");
        if(conf){
          $.ajax({
            url: "/tactic_tasks/"+taskId,
            method: "PATCH",
            dataType: "json",
            data: {tactic_task: {status: "已完成"}}
          }).done(function(){
            var target = outer.findTaskById(taskId);
            if(target) target.status = "已完成";
          });
        }

      },
      saveFlowchart: function(){
        var outer = this;
        var data = new Blob([this.tacticFlowchart.model.toJson()],{type: 'text/plain'});
        var formData = new FormData();
        var url = 'http://123.56.157.233:9090/FastDFSWeb/servlet/imageUploadServlet';
        var imageDataUrl = this.tacticFlowchart.makeImageData({
          size: new go.Size(240, 120)
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
          $.ajax({
            url: '/tactics/'+outer.tacticId(),
            method: "PATCH",
            dataType: "JSON",
            data: {tactic:{flow_image_url:imageUrl,flow_data_url:dataUrl}}
          })
          .done(function(){
            $("#tactics-flow-container").data("flowDataUrl",dataUrl);
            alert("保存成功！");
          })
          .error(function(){alert("服务器发生错误！");});
        }).catch(function(){
          alert("文件服务器连接失败，请重试！");
        });
      },
      exportFlowImage:function(){
        var img = this.tacticFlowchart.makeImageData({
          maxSize: new go.Size(Infinity, Infinity),//去掉默认最大2000*2000的限制
          scale:1  //显示整个图片而非可见部分
        });
        window.open(img);
      }
    }
  });
}

function setFlowChatrt() {
  var tacticFlowchart;
  function init() {
    var $$ = go.GraphObject.make; // for conciseness in defining templates
    tacticFlowchart = $$(go.Diagram, "tactics-flow-container", // must name or refer to the DIV HTML element
      {
        initialContentAlignment: go.Spot.Center,
        allowDrop: true, // must be true to accept drops from the Palette
        "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
        "LinkRelinked": showLinkLabel,
        "animationManager.duration": 800, // slightly longer than default (600ms) animation
        "undoManager.isEnabled": true, // enable undo & redo
        'allowZoom': true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom //鼠标滚轮定义为缩放
      });

    // helper definitions for node templates
    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("task_id", "task_id").makeTwoWay(),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center,
          // handle mouse enter/leave events to show/hide the ports
          locationObjectName: "SHAPE",
          resizable: true,
          resizeObjectName: "SHAPE", // user can resize the Shape
          // rotatable: true, rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized, // don't re-layout when node changes size
          mouseEnter: function(e, obj) {
            showPorts(obj.part, true);
          },
          mouseLeave: function(e, obj) {
            showPorts(obj.part, false);
          }
        }
      ];
    }
    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $$(go.Shape, "Circle", {
        fill: "transparent",
        stroke: null, // this is changed to "white" in the showPorts function
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        alignmentFocus: spot, // align the port on the main Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
    }
    // define the Node templates for regular nodes
    var lightText = 'whitesmoke';
    tacticFlowchart.nodeTemplateMap.add("", // the default category
      $$(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $$(go.Panel, "Auto",
          $$(go.Shape, "Rectangle", {
              fill: "#00A9C9",
              stroke: null
            },
            new go.Binding("fill", "fill").makeTwoWay(), //填充颜色
            new go.Binding("stroke", "stroke").makeTwoWay(), //边框颜色
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(), //边框大小
            new go.Binding("figure", "figure")),

          $$(go.TextBlock, {
              name: "TEXTOBJECT",
              font: "normal normal normal 13px sans-serif",
              stroke: lightText,
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("font").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, true)
      ));
    tacticFlowchart.nodeTemplateMap.add("Start",
      $$(go.Node, "Spot", nodeStyle(),
        $$(go.Panel, "Auto",
          $$(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            stroke: null
          }),
          $$(go.TextBlock, "Start", {
              name: "TEXTOBJECT",
              font: "normal normal normal 13px sans-serif",
              stroke: lightText,
              editable: true
            },
            new go.Binding("font").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("text").makeTwoWay())
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, true, false),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));
    tacticFlowchart.nodeTemplateMap.add("End",
      $$(go.Node, "Spot", nodeStyle(),
        $$(go.Panel, "Auto",
          $$(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#DC3C00",
            stroke: null
          }),
          $$(go.TextBlock, "End", {
              name: "TEXTOBJECT",
              font: "normal normal normal 13px sans-serif",
              stroke: lightText,
              editable: true
            },
            new go.Binding("font").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("text").makeTwoWay())
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true),
        makePort("B", go.Spot.Bottom, false, true)
      ));
    tacticFlowchart.nodeTemplateMap.add("Comment",
      $$(go.Node, "Auto", nodeStyle(),
        $$(go.Shape, "File", {
          fill: "#EFFAB4",
          stroke: null
        }),
        $$(go.TextBlock, {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: "normal normal normal 10px sans-serif",
            stroke: '#454545'
          },
          new go.Binding("font").makeTwoWay(),
          new go.Binding("stroke").makeTwoWay(),
          new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));
    // replace the default Link template in the linkTemplateMap
    tacticFlowchart.linkTemplate =
      $$(go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          }
        },
        new go.Binding("points").makeTwoWay(),
        $$(go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT"
          }),
        $$(go.Shape, // the link path shape
          {
            isPanelMain: true,
            stroke: "gray",
            strokeWidth: 2
          }),
        $$(go.Shape, // the arrowhead
          {
            toArrow: "standard",
            stroke: null,
            fill: "gray"
          }),
        $$(go.Panel, "Auto", // the link label, normally not visible
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $$(go.Shape, "RoundedRectangle", // the label shape
            {
              fill: "#F8F8F8",
              stroke: null
            }),
          $$(go.TextBlock, "Yes", // the label
            {
              textAlign: "center",
              name: "TEXTOBJECT",
              font: "normal normal normal 10px sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("font").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("text").makeTwoWay())
        )
      );
    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }
    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    tacticFlowchart.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    tacticFlowchart.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    load(); // load an initial diagram from some JSON text
    // initialize the Palette that is on the left side of the page
    myPalette =
      $$(go.Palette, "tactics-flow-palette", // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: tacticFlowchart.nodeTemplateMap, // share the templates used by tacticFlowchart
          model: new go.GraphLinksModel([ // specify the contents of the Palette
            {
              category: "Start",
              text: "开始"
            },
            {
              text: "步骤"
            },
            {
              text: "条件?",
              figure: "Diamond"
            },
            {
              category: "End",
              text: "结束"
            },
            {
              category: "Comment",
              text: "备注"
            }
          ])
        });
    // The following code overrides GoJS focus to stop the browser from scrolling
    // the page when either the Diagram or Palette are clicked or dragged onto.
    function customFocus() {
      var x = window.scrollX || window.pageXOffset;
      var y = window.scrollY || window.pageYOffset;
      go.Diagram.prototype.doFocus.call(this);
      window.scrollTo(x, y);
    }
    tacticFlowchart.doFocus = customFocus;
    myPalette.doFocus = customFocus;
  } // end init

  init();

  // Make all ports on a node visible when the mouse is over the node
  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
      port.stroke = (show ? "white" : null);
    });
  }

  function load() {
    var dataUrl = $("#tactics-flow-container").data("flowDataUrl");
    fetch(dataUrl, {
      method: 'GET',
      mode: "cors"
    })
    .then(function(response){return response.json();})
    .then(function(json){
      tacticFlowchart.model = go.Model.fromJson(json);
    });
  }
  // add an SVG rendering of the diagram at the end of this page
  return tacticFlowchart;
}
