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
      tasks: [],
      taskHeaders: [],
      currentTask: {},
      isTaskEditLock: true,
      isTaskEditing: false,
      columnBlacklist:["id","tactic_id","order","updated_at"]
    },
    mounted: function() {
      if ($("#tactics-flow-container").length > 0) {
        setFlowChatrt();
        myDiagram.addDiagramListener("ChangedSelection", this.setCurrentTaskId);
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
        var sels = myDiagram.selection;
        return (sels.count === 1 && sels.first() instanceof go.Node);
      },
      getFirstSelected: function() {
        return myDiagram.selection.first();
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
          myDiagram.model.setDataProperty(target.data,"task_id",parseInt(taskId));
        }else{
          var targetId = parseInt(target);
          var targetNode;
          myDiagram.nodes.each(function(node){
            if(node.data.task_id == targetId){
              targetNode = node;
              return;
            }
          });
          myDiagram.model.setDataProperty(targetNode.data,"task_id",parseInt(taskId));
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
              outer.updateTaskIdOfNodeData(response["data"].id, myDiagram.selection.first());
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

      }
    }
  });
}

function setFlowChatrt() {
  function init() {
    var $$ = go.GraphObject.make; // for conciseness in defining templates
    myDiagram = $$(go.Diagram, "tactics-flow-container", // must name or refer to the DIV HTML element
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
    myDiagram.nodeTemplateMap.add("", // the default category
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
    myDiagram.nodeTemplateMap.add("Start",
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
    myDiagram.nodeTemplateMap.add("End",
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
    myDiagram.nodeTemplateMap.add("Comment",
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
    myDiagram.linkTemplate =
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
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    load(); // load an initial diagram from some JSON text
    // initialize the Palette that is on the left side of the page
    myPalette =
      $$(go.Palette, "tactics-flow-palette", // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
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
    myDiagram.doFocus = customFocus;
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
  // Show the diagram's model in JSON format that the user may edit
  function save() {
    //  document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    //  myDiagram.isModified = false;
  }

  function load() {
    var json = {
      "class": "go.GraphLinksModel",
      "linkFromPortIdProperty": "fromPort",
      "linkToPortIdProperty": "toPort",
      "nodeDataArray": [{
          "task_id": 1,
          "fill": "yellow",
          "stroke": "green",
          "category": "Comment",
          "loc": "360 -10",
          "text": "Kookie Brittle",
          "key": -13
        },
        {
          "task_id": 2,
          "fill": "yellow",
          "stroke": "green",
          "key": -1,
          "category": "Start",
          "loc": "175 0",
          "text": "Start"
        },
        {
          "task_id": 3,
          "fill": "yellow",
          "stroke": "green",
          "key": 0,
          "loc": "0 77",
          "text": "Preheat oven to 375 F"
        },
        {
          "task_id": 4,
          "fill": "yellow",
          "stroke": "green",
          "key": 1,
          "loc": "175 100",
          "text": "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"
        },
        {
          "task_id": 5,
          "fill": "yellow",
          "stroke": "green",
          "key": 2,
          "loc": "175 190",
          "text": "Gradually beat in 1 cup sugar and 2 cups sifted flour"
        },
        {
          "task_id": 6,
          "font": " 11pt Helvetica, Arial, sans-serif",
          "fill": "yellow",
          "stroke": "green",
          "key": 3,
          "loc": "175 270",
          "text": "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
        },
        {
          "task_id": 7,
          "fill": "yellow",
          "stroke": "green",
          "key": 4,
          "loc": "175 370",
          "text": "Press evenly into ungreased 15x10x1 pan"
        },
        {
          "task_id": 8,
          "fill": "yellow",
          "stroke": "green",
          "key": 5,
          "loc": "352 85",
          "text": "Finely chop 1/2 cup of your choice of nuts"
        },
        {
          "task_id": 9,
          "fill": "yellow",
          "stroke": "green",
          "key": 6,
          "loc": "175 440",
          "text": "Sprinkle nuts on top"
        },
        {
          "task_id": 10,
          "fill": "yellow",
          "stroke": "green",
          "key": 7,
          "loc": "175 500",
          "text": "Bake for 25 minutes and let cool"
        },
        {
          "task_id": 11,
          "fill": "yellow",
          "stroke": "green",
          "key": 8,
          "loc": "175 570",
          "text": "Cut into rectangular grid"
        },
        {
          "task_id": 12,
          "fill": "yellow",
          "stroke": "green",
          "key": -2,
          "category": "End",
          "loc": "175 640",
          "text": "Enjoy!"
        }
      ],
      "linkDataArray": [{
          "from": 1,
          "to": 2,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 2,
          "to": 3,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 3,
          "to": 4,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 4,
          "to": 6,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 6,
          "to": 7,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 7,
          "to": 8,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 8,
          "to": -2,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": -1,
          "to": 0,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": -1,
          "to": 1,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": -1,
          "to": 5,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 5,
          "to": 4,
          "fromPort": "B",
          "toPort": "T"
        },
        {
          "from": 0,
          "to": 4,
          "fromPort": "B",
          "toPort": "T"
        }
      ]
    }

    myDiagram.model = go.Model.fromJson(json);
  }
  // add an SVG rendering of the diagram at the end of this page
}
