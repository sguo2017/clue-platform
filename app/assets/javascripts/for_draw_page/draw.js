$(document).on("turbolinks:load", function(){
  GoTools.prototype.setTemplate = function(nodeTemplate,linkTemplate){
    if(nodeTemplate) this.nodeTemplate=nodeTemplate;
    if(linkTemplate) this.linkTemplate=linkTemplate;
  }
  draw(typeof(goTools)!=="undefined");
});

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
      // 绑定
      new go.Binding("key", "key"),
      new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
      new go.Binding("visible", "visible_attr",function(v){
        return v.can_show&&!v.hidden_by_feq&&!v.hidden_by_hlight&&!v.hidden_by_sel;
      }),
      // 节点包含的其他图形对象
      $$(
        go.Shape,
        "circle", // 预定义的形状通过字符串来标示
        { /* 设置Shape的属性 */
          name: "OBJSHAPE",
          strokeWidth: 4,
          stroke: "#7B7B7B"
        },
        // 绑定举例：
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
      ),
      $$(
        go.Link,
        {
          layerName: "Background",
          selectable: false
        },
        new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
        new go.Binding("visible", "visible_attr",function(v){
          return v.can_show&&!v.hidden_by_feq&&!v.hidden_by_hlight&&!v.hidden_by_sel;
        }),
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
            // segmentIndex: 0,
            // segmentFraction: 0.5,
            stroke: "black",
            font: "bold 12pt serif",
            background: "lightblue"
          },
          new go.Binding("text", "feq")
        )
      )
    );
    switch (sources) {
      case 'excel':
      calllistDataPreparing.getDataFromLocal();
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
    goTools.model.nodeDataArray = setExtraNodeAttr(calllistDataPreparing.nodesArray);
    goTools.model.linkDataArray = setExtraLinkAttr(calllistDataPreparing.linksArray);
    goTools.commitTransaction("generateTree");
    goTools.layout = $$(go.Layout);
    setTimeout(function(){
      if(calllistDataPreparing.nodesArray.length<=0 && calllistDataPreparing.linksArray.length<=0){
        alert('没有数据');
      }
    },0);
  }

  function setExtraNodeAttr(nodes){
    return nodes.map(function(node){
      var node = copy(node);
      node.visible_attr = {can_show:true,hidden_by_feq:false,hidden_by_hlight:false,hidden_by_sel:false};
      return node;
    });
  }

  function setExtraLinkAttr(links){
    var show= links.map(function(link){
      var result = copy(link);
      result.visible_attr = {can_show:true,hidden_by_feq:false,hidden_by_hlight:false,hidden_by_sel:false};
      return result;
    });

    var hide =links.map(function(link){
      var result = copy(link);
      var temp = result.from;
      result.from = result.to;
      result.to = temp;
      result.visible_attr = {can_show:false,hidden_by_feq:false,hidden_by_hlight:false,hidden_by_sel:false};
      return result;
    });
    return show.concat(hide);
  }
