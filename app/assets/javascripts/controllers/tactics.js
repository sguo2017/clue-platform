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
      tacticFlowchart: null,
      tasks: [],
      taskHeaders: [],
      currentTask: {},
      isTaskEditLock: true,
      isTaskEditing: false,
      columnBlacklist: ["id", "tactic_id", "order", "updated_at"],
      fontStyle: "",
      fontVariant: "",
      fontWeight: "",
      fontSize: "",
      fontFamily: "",
      isUnderline: "",
      textAlign: "",
      // textColor: "",
      // nodeFill: "",
      // nodeOutlineColor: "",
      // nodeOutlineWidth: "",
      // lineWidth: "",
      // lineColor: "",
      // arrowStyle: "",
      showDataAdjustPanel: false,
      showSizePicker: false,
      showColorPicker: false,
      showArrowPicker: false,
      sizeArray: [0, 5, 10, 12, 13, 15, 18, 20, 22, 24, 28, 36, 48, 64, 72, 96],
      colorArray: ["rgb(0, 0, 0)", "rgb(0, 0, 51)", "rgb(0, 0, 102)", "rgb(0, 0, 153)", "rgb(0, 51, 0)", "rgb(0, 51, 51)", "rgb(0, 51, 102)", "rgb(0, 51, 153)", "rgb(0, 102, 0)", "rgb(0, 102, 51)",
        "rgb(0, 153, 0)", "rgb(51, 0, 0)", "rgb(51, 0, 51)", "rgb(51, 0, 102)", "rgb(51, 51, 0)", "rgb(51, 51, 102)", "rgb(102, 0, 0)", "rgb(102, 0, 51)", "rgb(102, 51, 0)", "rgb(102, 102, 0)", "rgb(102, 102, 51)",
        "rgb(102, 102, 102)", "rgb(102, 102, 153)", "rgb(153, 0, 0)", "rgb(153, 0, 51)", "rgb(153, 0, 51)", "rgb(153, 102, 0)", "rgb(255, 204, 0)", "rgb(255, 204, 204)", "rgb(255, 204, 153)", "rgb(255, 255, 0)",
        "rgb(255, 153, 0)", "rgb(204, 255, 204)", "rgb(204, 255, 255)", "rgb(204, 255, 153)"
      ],
      arrowArray: [{
        name: "无向",
        value: "none"
      }, {
        name: "双向",
        value: "double"
      }, {
        name: "单向(指向终止节点)",
        value: "forward"
      }, {
        name: "单向(指向出发节点)",
        value: "backward"
      }],
      inputSize: "",
      inputColor: "",
      sizeTarget: "",
      colorTarget: ""

    },
    mounted: function() {
      if ($("#tactics-flow-container").length > 0) {
        this.tacticFlowchart = setFlowChatrt();
        this.tacticFlowchart.addDiagramListener("ChangedSelection", this.setCurrentTaskId);
        this.tacticFlowchart.addDiagramListener("ChangedSelection", this.updateFlowchartStyle);
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
      findTaskById: function(taskId) {
        if (taskId && this.tasks) {
          taskId = taskId.toString();
          var result = this.tasks.filter(function(x) {
            return x.id.toString() === taskId
          });
          if (result.length == 1) {
            return result[0];
          } else {
            return null;
          }
        }
        return null;
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
      updateTaskIdOfNodeData: function(taskId, target) {
        if (target instanceof go.Node) {
          this.tacticFlowchart.model.setDataProperty(target.data, "task_id", parseInt(taskId));
        } else {
          var targetId = parseInt(target);
          var targetNode;
          this.tacticFlowchart.nodes.each(function(node) {
            if (node.data.task_id == targetId) {
              targetNode = node;
              return;
            }
          });
          this.tacticFlowchart.model.setDataProperty(targetNode.data, "task_id", parseInt(taskId));
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
          var url, method, isUpdate, outer = this;
          if (this.currentTask.id) {
            url = "/tactic_tasks/" + this.currentTask.id;
            method = "PATCH";
            isUpdate = true;
          } else {
            url = "/tactic_tasks";
            method = "POST";
            isUpdate = false;
            this.currentTask.tactic_id = this.tacticId();
          }
          $.ajax({
            url: url,
            method: method,
            dataType: "json",
            data: {
              "tactic_task": this.currentTask
            }
          }).done(function(response) {
            if (!isUpdate) { //创建对象时
              outer.tasks.push(response["data"]);
              $("#current-task-id").val(response["data"].id);
              outer.updateTaskIdOfNodeData(response["data"].id, outer.tacticFlowchart.selection.first());
            }
            outer.isTaskEditing = !outer.isTaskEditing;
          }); // end ajax
        } else {
          this.isTaskEditing = !this.isTaskEditing;
        } //end if
      }, //end function
      deleteTask: function(taskId) {
        taskId = taskId.toString();
        var outer = this,
          conf = confirm("确定删除这个任务吗？");
        if (conf) {
          $.ajax({
            url: "/tactic_tasks/" + taskId,
            method: "DELETE",
            dataType: "json"
          }).done(function() {
            var targetIndex = outer.tasks.indexOf(outer.findTaskById(taskId));
            if (targetIndex >= 0) {
              outer.tasks.splice(targetIndex, 1);
              if (outer.currentTask.id.toString() == taskId) {
                outer.currentTask = {};
                $("#current-task-id").val('');
                outer.updateTaskIdOfNodeData('', taskId);
              }
            }
          });
        }

      },
      finishTask: function(taskId) {
        taskId = taskId.toString();
        var outer = this,
          conf = confirm("确定完成这个任务吗？");
        if (conf) {
          $.ajax({
            url: "/tactic_tasks/" + taskId,
            method: "PATCH",
            dataType: "json",
            data: {
              tactic_task: {
                status: "已完成"
              }
            }
          }).done(function() {
            var target = outer.findTaskById(taskId);
            if (target) target.status = "已完成";
          });
        }

      },
      saveFlowchart: function() {
        var outer = this;
        var data = new Blob([this.tacticFlowchart.model.toJson()], {
          type: 'text/plain'
        });
        var formData = new FormData();
        var url = 'http://123.56.157.233:9090/FastDFSWeb/servlet/imageUploadServlet';
        var imageDataUrl = this.tacticFlowchart.makeImageData({
          size: new go.Size(240, 120)
        });
        var image = imageDataUrl.toBlob();
        formData.append('data', data, 'data.json');
        formData.append('image', image, 'image.png');
        fetch(url, {
            method: 'POST',
            mode: "cors",
            body: formData
          })
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            var dataUrl = json["data"];
            var imageUrl = json["image"];
            $.ajax({
                url: '/tactics/' + outer.tacticId(),
                method: "PATCH",
                dataType: "JSON",
                data: {
                  tactic: {
                    flow_image_url: imageUrl,
                    flow_data_url: dataUrl
                  }
                }
              })
              .done(function() {
                $("#tactics-flow-container").data("flowDataUrl", dataUrl);
                alert("保存成功！");
              })
              .error(function() {
                alert("服务器发生错误！");
              });
          }).catch(function() {
            alert("文件服务器连接失败，请重试！");
          });
      },
      exportFlowImage: function() {
        var img = this.tacticFlowchart.makeImageData({
          maxSize: new go.Size(Infinity, Infinity), //去掉默认最大2000*2000的限制
          scale: 1 //显示整个图片而非可见部分
        });
        window.open(img);
      },
      pick: function(showPanel, showSize, showColor, showArrow) {
        this.showDataAdjustPanel = showPanel;
        this.showSizePicker = showSize;
        this.showColorPicker = showColor;
        this.showArrowPicker = showArrow;
      },
      pickFontSize: function() {
        this.sizeTarget = "fontSize";
        this.pick(true, true, false, false);
      },
      pickFontColor: function() {
        this.colorTarget = "textColor";
        this.pick(true, false, true, false);
      },
      pickNodeFill: function() {
        this.colorTarget = "nodeFill";
        this.pick(true, false, true, false);
      },
      pickNodeOutlineColor: function() {
        this.colorTarget = "nodeOutlineColor";
        this.pick(true, false, true, false);
      },
      pickNodeOutlineWidth: function() {
        this.sizeTarget = "nodeOutlineWidth";
        this.pick(true, true, false, false);
      },
      pickLineWidth: function() {
        this.sizeTarget = "lineWidth";
        this.pick(true, true, false, false);
      },
      pickLineColor: function() {
        this.colorTarget = "lineColor";
        this.pick(true, false, true, false);
      },
      pickArrow: function() {
        this.colorTarget = "lineColor";
        this.pick(true, false, false, true);
      },
      updateFlowchartStyle: function() {
        var style = this.tacticFlowchart.getDiagramElemStyle();
        shallowAbsorb(this, style);
      },
      setFlowchartStyle: function(key, value) {
        var outer = this;
        this.tacticFlowchart.setDiagramElemStyle(key, value, function(v) {
          if (outer[key] !== undefined) {
            if (v.constructor == String) v = v.toLowerCase();
            outer[key] = v;
          }
        });
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
      }
    );

    // helper definitions for node templates
    function nodeStyle() {
      return [
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("task_id", "task_id").makeTwoWay(),
        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
        {
          zOrder: 0,
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
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $$(go.Shape, "Circle", {
        fill: "transparent",
        stroke: null, // this is changed to "white" in the showPorts function
        desiredSize: new go.Size(12, 12),
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
              name: "NODEFILLSHAPE",
              fill: "#00A9C9",
              stroke: null
            },
            new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
            new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
            new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay(), //边框大小
            new go.Binding("figure", "figure")
          ),

          $$(go.TextBlock, {
              name: "TEXTOBJECT",
              stroke: lightText,
              margin: 8,
              wrap: go.TextBlock.WrapFit,
              editable: true,
              minSize: new go.Size(20,NaN)
            },
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
            new go.Binding("textAlign", "textAlign").makeTwoWay()
          )
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, true)
      )
    );
    tacticFlowchart.nodeTemplateMap.add("Start",
      $$(go.Node, "Spot", nodeStyle(),
        $$(go.Panel, "Auto",
          $$(go.Shape, "Circle", {
              name: "NODEFILLSHAPE",
              fill: "#79C900",
              stroke: null
            },
            new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
            new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
            new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay(), //边框大小
            new go.Binding("figure", "figure")
          ),
          $$(go.TextBlock, "Start", {
              name: "TEXTOBJECT",
              stroke: lightText,
              editable: true,
              minSize: new go.Size(20,NaN)
            },
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
            new go.Binding("textAlign", "textAlign").makeTwoWay()
          )
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, true, false),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      )
    );
    tacticFlowchart.nodeTemplateMap.add("End",
      $$(go.Node, "Spot", nodeStyle(),
        $$(go.Panel, "Auto",
          $$(go.Shape, "Circle", {
              name: "NODEFILLSHAPE",
              fill: "#DC3C00",
              stroke: null
            },
            new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
            new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
            new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay(), //边框大小
            new go.Binding("figure", "figure")
          ),
          $$(go.TextBlock, "End", {
              name: "TEXTOBJECT",
              stroke: lightText,
              editable: true,
              minSize: new go.Size(20,NaN)
            },
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
            new go.Binding("textAlign", "textAlign").makeTwoWay()
          )
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true),
        makePort("B", go.Spot.Bottom, false, true)
      )
    );
    tacticFlowchart.nodeTemplateMap.add("Circle",
      $$(go.Node, "Spot", nodeStyle(),
        $$(go.Panel, "Auto",
          $$(go.Shape, "Circle", {
              name: "NODEFILLSHAPE",
              fill: "#00A9C9",
              stroke: null
            },
            new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
            new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
            new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay(), //边框大小
            new go.Binding("figure", "figure")
          ),
          $$(go.TextBlock,{
              name: "TEXTOBJECT",
              stroke: lightText,
              editable: true,
              minSize: new go.Size(20,NaN)
            },
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
            new go.Binding("textAlign", "textAlign").makeTwoWay()
          )
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, true)
      )
    );
    tacticFlowchart.nodeTemplateMap.add("Comment",
      $$(go.Node, "Auto", nodeStyle(),
        $$(go.Shape, "File", {
            name: "NODEFILLSHAPE",
            fill: "#EFFAB4",
            stroke: null
          },
          new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
          new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
          new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay(), //边框大小
          new go.Binding("figure", "figure")
        ),
        $$(go.TextBlock, {
            name: "TEXTOBJECT",
            wrap: go.TextBlock.WrapFit,
            margin: 8,
            textAlign: "center",
            editable: true,
            stroke: '#454545',
            minSize: new go.Size(20,NaN)
          },
          new go.Binding("font", "font").makeTwoWay(),
          new go.Binding("stroke", "textColor").makeTwoWay(),
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
          new go.Binding("textAlign", "textAlign").makeTwoWay()
        )
      )
    );
    tacticFlowchart.nodeTemplateMap.add("Outline",
    $$(go.Node, "Spot", nodeStyle(),
      new go.Binding("zOrder", "zOrder").makeTwoWay(), //叠放次序
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $$(go.Panel, "Auto",
        $$(go.Shape, "Rectangle", {
            name: "NODEFILLSHAPE",
            fill: "rgba(255,255,255,0)",
            stroke: "gray",
            strokeWidth: 2
          },
          new go.Binding("fill", "nodeColor").makeTwoWay(), //填充颜色
          new go.Binding("stroke", "nodeOutlineColor").makeTwoWay(), //边框颜色
          new go.Binding("strokeWidth", "nodeOutlineWidth").makeTwoWay() //边框大小
        )
      )
    )
  );
    tacticFlowchart.nodeTemplateMap.add("Textbox",
    $$(go.Node, "Spot", nodeStyle(),
      $$(go.Panel, "Auto",
        $$(go.TextBlock, {
            name: "TEXTOBJECT",
            wrap: go.TextBlock.WrapFit,
            textAlign: "left",
            editable: true,
            stroke: '#454545',
            minSize: new go.Size(20,NaN)
          },
          new go.Binding("font", "font").makeTwoWay(),
          new go.Binding("stroke", "textColor").makeTwoWay(),
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
          new go.Binding("textAlign", "textAlign").makeTwoWay()
        )
      )
    )
  );
    // replace the default Link template in the linkTemplateMap
    tacticFlowchart.linkTemplate =
      $$(go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 15,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
            link.findObject("HIGHLIGHTSHAPE").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function(e, link) {
            link.findObject("HIGHLIGHTSHAPE").stroke = "transparent";
          }
        },
        new go.Binding("points").makeTwoWay(),
        $$(go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHTSHAPE"
          },
          new go.Binding("stroke", "highlightWidth").makeTwoWay()
        ),
        $$(go.Shape, // the link path shape
          {
            name: "LINKSHAPE",
            isPanelMain: true,
            stroke: "gray"
          },
          new go.Binding("stroke", "lineColor").makeTwoWay(),
          new go.Binding("strokeWidth", "lineWidth").makeTwoWay()
        ),
        $$(go.Shape, // the arrowhead
          {
            name: "TOARROWSHAPE",
            toArrow: "Standard",
            stroke: "gray",
            fill: "gray",
            strokeWidth: 3
          },
          new go.Binding("fill", "toArrowColor").makeTwoWay(),
          new go.Binding("stroke", "toArrowOutlineColor").makeTwoWay(),
          new go.Binding("strokeWidth", "toArrowWidth").makeTwoWay(),
          new go.Binding("visible", "showToArrow").makeTwoWay()
        ),
        $$(go.Shape, // the arrowhead
          {
            name: "FROMARROWSHAPE",
            fromArrow: "Backward",
            stroke: "gray",
            fill: "gray",
            strokeWidth: 3,
            visible: false
          },
          new go.Binding("fill", "fromArrowColor").makeTwoWay(),
          new go.Binding("stroke", "fromArrowOutlineColor").makeTwoWay(),
          new go.Binding("strokeWidth", "fromArrowWidth").makeTwoWay(),
          new go.Binding("visible", "showFromArrow").makeTwoWay()
        ),
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
            }
          ),
          $$(go.TextBlock, "Yes", // the label
            {
              textAlign: "center",
              name: "TEXTOBJECT",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("isUnderline", "isUnderline").makeTwoWay(),
            new go.Binding("textAlign", "textAlign").makeTwoWay())
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
              category: "Circle",
              text: "圆形"
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
            },
            {
              category: "Outline",
              width: 60,
              height: 30,
              zOrder: -1
            },
            {
              category: "Textbox",
              text: "文本框"
            },
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
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        tacticFlowchart.model = go.Model.fromJson(json);
      });
  }
  // add an SVG rendering of the diagram at the end of this page
  return tacticFlowchart;
}
