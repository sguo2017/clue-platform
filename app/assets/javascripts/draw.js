$(document).on("turbolinks:load", function(){
  GoTools.prototype.setTemplate = function(nodeTemplate,linkTemplate){
    if(nodeTemplate) this.nodeTemplate=nodeTemplate;
    if(linkTemplate) this.linkTemplate=linkTemplate;
  }
  draw(go_tools_init());
});

function go_tools_init() {
	if($("#tools_main_diagram").length==0) return false;
	var $$ = go.GraphObject.make;
	// GoTools
	goTools = new GoTools("tools_main_diagram");
	// Filesystem state object
	goTools.goToolsFilesSystem = new GoToolsFilesSystem(goTools, {
		openWindowId: "openDocument",
		removeWindowId: "removeDocument",
		currentFileId: "currentFile",
		filesToRemoveListId: "filesToRemove",
		filesToOpenListId: "filesToOpen"
	});
	// UI Interaction state object
	goTools.goToolsUI = new GoToolsUI(goTools, "ui", "goTools");
	goTools.goToolsUI.setBehavior("dragging");
	// Overview
	$$(go.Overview, "tools_main_overview", { observed: goTools, contentAlignment: go.Spot.Center, maxScale: 0.5 });
	// Palettes
	goTools.palette = new GoToolsPalette("tools_main_palette", goTools);
	return true;
}

function draw(status){
	if(!status) return;
  var type=getQueryString('type');
  var sources=getQueryString('sources');
  switch(type){
    case 'calllist':
      drawCalllist(sources);
      break;
    default:
      true;
  }
}

function drawCalllist(sources){
    var $$ = go.GraphObject.make;
    goTools.setTemplate(
      $$(
      go.Node,
      "Auto", // Node或者Panel的第二个参数可以是Node的类型或者是Panel的类型
      { /* 在这里设置节点属性 */
        // background: "#44CCFF"
      },
      // 绑定举例: 将节点的location属性绑定到数据的loc属性
      // new go.Binding("location", "loc"),

      // 节点包含的其他图形对象
      $$(
        go.Shape,
        "circle", // 预定义的形状通过字符串来标示
        { /* 设置Shape的属性 */
          strokeWidth: 2,
          stroke: "#7B7B7B"
        },
        // 绑定举例：
        new go.Binding("fill", "fill")
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
      ),
      $$(
        go.Link,
        $$(
           go.Shape,
           {
             strokeWidth: 4,
             stroke: "#7B7B7B"
           }
        ),
        $$(
          go.TextBlock,
          {
            segmentIndex: 0,
            segmentFraction: 0.8,
            stroke: "black",
            font: "bold 12pt serif",
            background: "lightblue"
          },
          new go.Binding("text", "text")
        )
      )
    );
    switch (sources) {
    case 'excel':
      calllistDataPreparing.rawRows=excelUtils.rows;
      calllistDataPreparing.fromColumn=excelUtils.fromColumn;
      calllistDataPreparing.toColumn=excelUtils.toColumn;
      calllistDataPreparing.formatData();
      force_directed();
      break;
    case 'db':
      calllistDataPreparing.getDataFromServer();
      calllistDataPreparing.formatData();
      force_directed();
      break;
    default:
      force_directed();
  }
}
function force_directed(){
  goTools.layout = $$(go.ForceDirectedLayout);
  goTools.startTransaction("generateTree");
  goTools.model.nodeDataArray = calllistDataPreparing.nodesArray;
  goTools.model.linkDataArray = calllistDataPreparing.linksArray;
  goTools.commitTransaction("generateTree");
}
