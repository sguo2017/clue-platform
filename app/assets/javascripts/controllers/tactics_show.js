$(document).on("turbolinks:load", function() {
  if ($("#tactic-app").length > 0) {
    initTacticShowVue();
  }
});

function Task(obj){
  this.id = null;
  this.name = null;
  this.tactic_id = null;
  this.category = null;
  this.user = null;
  this.status = null;
  this.finished_time = null;
  this.start_time = null;
  this.end_time = null;
  this.description = null;
  this.order = null;
  this.temp_guid = null;
  this._modify_ = null;
  this.created_at = null;
  this.updated_at = null;
  if(obj){ //从JSON对象构建Task
    for(var key in obj){
      this[key] !== undefined && (this[key] = obj[key]);
    }
  }
}

function initTacticShowVue() {
  var Modal = {
    template: "#modal-template",
    data: function(){
      return {
        modalWidth: "600px"
      }
    }
  };
  vvv = new Vue({
    el: "#tactic-app",
    components: {
      "modal": Modal
    },
    data: {
      taskHeadersTranslator: {
        "name": "名称",
        "category": "类型",
        "user": "执行人",
        "status": "状态",
        "finished_time": "完成时间",
        "start_time": "开始时间",
        "end_time": "结束时间",
        "description": "描述",
        "created_at": "创建时间",
        $get: function(key){
          return (key && this[key]) ? this[key] : key;
        }
      },
      tacticFlowchart: null,
      tasks: [],
      taskHeaders: [],
      currentTask: new Task(),
      isTaskEditLock: true,
      isTaskEditing: false,
      columnBlacklist: ["id", "tactic_id", "order", "updated_at","created_at","attachment_url","attachment_name"],
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
      colorTarget: "",
      usersSearchName: null,
      showSearchModal: false,
      usersSearchResult: [],
      selectedUsersTemp: []

    },
    mounted: function() {
      initDatePicker();
      if ($("#tactics-flow-container").length > 0) {
        this.tacticFlowchart = setFlowchart();
        this.tacticFlowchart.addDiagramListener("ChangedSelection", this.changeCurrentTask);
        this.tacticFlowchart.addDiagramListener("ChangedSelection", this.updateFlowchartStyle);
        this.tacticFlowchart.addDiagramListener("SelectionDeleted", this.deleteTaskOnNodeDeleted);
      }
      var outer = this;
      $.ajax({
        url: "/tactics/" + this.tacticId() + "/get_tactic_tasks",
        method: "get"
      }).done(function(response) {
        var data = response["data"];
        if (data) {
          outer.tasks = (data["tasks"] || []).map(function(x){x._modify_="none";return new Task(x);});
          outer.taskHeaders = data["headers"] || [];
        }
      });
    },
    methods: {
      tacticId: function() { //查找战法id
        return $("#tactic-app").data("tacticId");
      },
      //根据标识符查找data数组中的任务对象，已存在的任务通过传入id查找，新创建的任务由于还没有保存到服务器
      //因此还不具有id,但会被分配一个临时的guid，以便对这个任务进行标识，通过传入guid进行查找
      findTaskByIdOrTempGuid: function(taskIdOrTempGuid) {
        if (taskIdOrTempGuid) {
          var result = this.tasks.filter(function(x) {
            return (x.id == taskIdOrTempGuid || x.temp_guid == taskIdOrTempGuid);
          });
          if (result.length == 1) {
            return result[0];
          } else {
            return null;
          }
        }
        return null;
      },
      isSelectedOneNode: function() { //是否选择了一个节点
        var sels = this.tacticFlowchart.selection;
        return (sels.count === 1 && sels.first() instanceof go.Node);
      },
      getFirstSelected: function() { //获得选取的第一个节点
        return this.tacticFlowchart.selection.first();
      },
      changeCurrentTask: function() { // 改变当前任务(节点选择改变时触发)
        if(this.isSelectedOneNode()){ //选择一个节点
          var sel = this.getFirstSelected();
          if(sel.category === '' && sel.findObject("NODEFILLSHAPE").figure !== "Diamond"){ //该节点是任务节点
            var targetId = sel.data['task_id'];
            if(targetId){//该节点已经绑定任务
              var target = this.findTaskByIdOrTempGuid(targetId);
              this.currentTask = (target ? target : new Task());
            }else{
              this.currentTask = new Task();
            }
            this.isTaskEditLock = false; //允许编辑
          }else{
            this.currentTask = new Task();
            this.isTaskEditLock = true; //非任务节点，禁止编辑编辑
          }
        }else { //选择0个或多个节点
          this.currentTask = new Task();
          this.isTaskEditLock = true; //禁止编辑
        }
        this.isTaskEditing = false;  //重置编辑按钮状态
        this.selectedUsersTemp = (this.currentTask.user && this.currentTask.user.slice(0)) || [];
      },
      //创建任务后,使用临时生成的guid将节点与任务进行绑定
      //target是目标节点对象
      createTaskIdentifyOfNodeData: function(guid, target) {
        if (target instanceof go.Node) { //创建任务后
          this.tacticFlowchart.model.setDataProperty(target.data, "task_id", guid);
        }
      },
      //删除任务后，删除节点内部的关联任务标识符，解除绑定
      //identify有可能是是任务id(已持久化的任务)，也有可能是临时分配的guid(未持久化的任务)
      deleteTaskIdentifyOfNodeData: function(identify){
        var targetNode;
        this.tacticFlowchart.nodes.each(function(node) {
          if (node.data.task_id == identify) {
            targetNode = node;
            return;
          }
        });
        targetNode && this.tacticFlowchart.model.setDataProperty(targetNode.data, "task_id", null);
      },
      saveOrUpdate: function() {
        if (this.isTaskEditing) { //编辑状态下
          if (this.currentTask.id) { //该任务是经过持久化的，标识为更新
            this.currentTask._modify_ = "updated";
          }else if(this.currentTask.temp_guid){ //该任务是已创建但未经过持久化的，标识为创建
            this.currentTask._modify_ = "created";
          }else { //该任务还未被创建，执行创建
            this.currentTask._modify_ = "created";
            this.currentTask.tactic_id = this.tacticId();
            this.currentTask.status = "未完成";
            this.currentTask.temp_guid = guid();
            this.tasks.push(this.currentTask);
            // 更新节点内部数据
            this.createTaskIdentifyOfNodeData(this.currentTask.temp_guid, this.getFirstSelected());
          }
          this.isTaskEditing = !this.isTaskEditing;
        } else {
          this.isTaskEditing = !this.isTaskEditing; // 进入编辑状态
        } //end if
      }, //end function
      deleteTask: function(task,noConf) {
        if ((!noConf && confirm("确定删除这个任务吗？") && task) || (noConf && task)) {
          if(task._modify_ == "created"){//要删除的任务没有经过持久化
            this.tasks.splice(this.tasks.indexOf(task),1);
            task.temp_guid && this.currentTask.temp_guid == task.temp_guid && (this.currentTask = new Task());
          }else{//要删除的任务是经过持久化的
            task._modify_ = "deleted";
            task.id && this.currentTask.id == task.id && (this.currentTask = new Task());
          }
          this.deleteTaskIdentifyOfNodeData(task.id || task.temp_guid);
        }
      },
      //为了保证一致性，当节点删除时，同时删除关联的任务，节点删除可以撤销，但任务不可以
      deleteTaskOnNodeDeleted: function(diagramEvent){
        var deleted = diagramEvent.subject;
        var outer = this;
        deleted.each(function(x){
          if(x instanceof go.Node && x.data["task_id"]){
            var task = outer.findTaskByIdOrTempGuid(x.data["task_id"]); //查找任务
            outer.deleteTask(task,true); //删除任务
            x.data["task_id"] = null; //删除绑定的任务
          }
        });
      },
      //持久化任务变更以及保存流程图更改。
      //分两步，首先保存任务变更，其次保存流程图数据
      //因为对于新创建的任务，还未持久化，无法知道该任务在数据库中的id，
      //所以是使用一个临时的guid来将流程图节点与任务库进行绑定，
      //等到任务变更保存了，读取到服务器返回的新创建的任务的id时，
      //更新流程图节点与任务的绑定(将guid换为id),最后才保存流程图数据到文件服务器
      persistChanges: function(){
        // 获取变更过的任务
        var changes = this.tasks.filter(function(x){return x._modify_  && x._modify_ != "none"});
        var outer = this;
        $.ajax({
          url: "/tactics/"+this.tacticId()+"/persist_tasks",
          method: "POST",
          dataType: "JSON",
          data: {tactic_tasks: changes}
        }).done(function(response){
          // 获取返回状态以及数据
          if(response["success"] && response["data"]){
            //createdIds是服务器返回的[{guid:,id:}..]数组
            //指明了之前新创建的临时分配guid的任务对象在数据库中生最终成的id是什么
            //然后根据这个最终持久化的id去替换流程图中节点数据的task_id,建立真正的绑定
            //最后再保存流程图数据
            var createdIds = response["data"]["created_ids"];
            var tasks = response["data"]["tasks"];
            if(createdIds && tasks){ //数据非空检验
              var guid_id_map = new go.Map(); //对于新创建的任务，用来存储(guid,id)键值对
              createdIds.forEach(function(x){guid_id_map.add(x.guid,x.id);});
              outer.tacticFlowchart.nodes.each(function(node){
                var task_id = node.data["task_id"];
                if(guid_id_map.getValue(task_id)){
                  //更新绑定值
                  outer.tacticFlowchart.model.setDataProperty(node.data, "task_id", guid_id_map.getValue(task_id));
                }
              });
              //更新任务列表
              outer.tasks = tasks.map(function(x){x._modify_ = "none";return new Task(x);});
              $("#finished_task_span").text(response["data"]["finished_task_count"]);
              $("#unfinished_task_span").text(response["data"]["unfinished_task_count"]);
            }
            //更新当前任务状态，重置编辑表单
            outer.changeCurrentTask();
            outer.saveFlowchart();
          }else{
            alert("服务器错误，保存失败！");
          }
        }).error(function(){alert("未知错误，保存失败！")});
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
      },
      searchUser: function(){
        if(this.usersSearchName){
          var outer = this;
          $.ajax({
            url: "/users/search",
            method: "POST",
            data: {name: this.usersSearchName},
            dataType: "JSON"
          }).done(function(response){
            if(response["data"]){
              outer.usersSearchResult = response["data"];
            }
          })
        }
      },
      addUser: function(user){
        var isSelected = this.selectedUsersTemp.filter(function(x){return x.id == user.id;}).length == 1;
        if(!isSelected){
          this.selectedUsersTemp.push(user);
        }
      },
      removeUser: function(user){
        var index = -1;
        for(var i=0;i<this.selectedUsersTemp.length;i++){
          if(this.selectedUsersTemp[i].id == user.id){
            index = i;
          }
        }
        if(index > -1){
          this.selectedUsersTemp.splice(index,1)
        }
      },
      confirmSelectUsers: function(){
        this.showSearchModal=false;
        this.usersSearchResult = [];
        this.currentTask.user = this.selectedUsersTemp.slice(0);
      },
      cancleSelectUsers: function(){
        this.showSearchModal=false;
        this.selectedUsersTemp = (this.currentTask.user && this.currentTask.user.slice(0)) || []
        this.usersSearchResult = [];
      },
      makeTacticClassic: function(){
        var outer = this;
        var id = this.tacticId();
        $.ajax({
          url: "/tactics/" + this.tacticId(),
          method: "PATCH",
          data: {tactic: {classic: 1},id: this.tacticId()},
          dataType: "JSON"
        }).done(function(){alert("操作成功！")}).error(function(){alert("操作失败！")});
      }
    },
    filters:{
      usersToNameStr: function(obj){
        if(obj instanceof Array){
          return obj.map(function(x){return x.name ? x.name : '';}).join(",");
        }else{
          return obj;
        }
      }
    }
  });
}

function setFlowchart() {
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
              text: "任务节点"
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
    dataUrl && fetch(dataUrl, {
        method: 'GET',
        mode: "cors"
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        tacticFlowchart.model = go.Model.fromJson(json);
      });
      tacticFlowchart.model.linkFromPortIdProperty = "fromPort";
      tacticFlowchart.model.linkToPortIdProperty = "toPort";
  }
  // add an SVG rendering of the diagram at the end of this page
  return tacticFlowchart;
}
