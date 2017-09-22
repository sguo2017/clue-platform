import {DiagramTemplatesManager} from "./go_templates_manager";
function DiagramCreator() {
  /*
   *options{
   * el: String
   * nodeTemplate: Object
   * linkTemplate: Object
   * settings: Object
   * model: Object
   * beforeCreate: Function
   * created: Function
   *}
   *
   */
  this.createCalllistDiagram = function(options = {}) {
    if (options["beforeCreate"] instanceof Function) {
      options["beforeCreate"].call(this);
    }

    var settings = options.settings;
    if (!settings) {
      settings = {
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

      };
    }
    var $$ = go.GraphObject.make;
    var diagram = $$(go.Diagram, options["el"], settings);
    var tmpm = new DiagramTemplatesManager();
    diagram.nodeTemplate = options.nodeTemplate || tmpm.calllist.nodeTemplate;
    diagram.linkTemplate = options.linkTemplate || tmpm.calllist.linkTemplate;

    try {
      diagram.layout = $$(go.ForceDirectedLayout);
      diagram.startTransaction("数据导入");
      go.Model.fromJson(options["model"], diagram.model);
      diagram.commitTransaction("数据导入");
    } catch (e) {
      diagram.rollbackTransaction();
      alert("内容错误，绘制失败！");
      console.log(e);
    } finally {
      diagram.layout = $$(go.Layout);
    }

    if (options["created"] instanceof Function) {
      options["created"].call(this, diagram);
    }
    return diagram;
  }
}
export {DiagramCreator};
