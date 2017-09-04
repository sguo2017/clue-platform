function DiagramTemplatesManager() {
  var $$ = go.GraphObject.make;
  return {
    calllist: {
      nodeTemplate: $$(
        go.Node,
        "Auto", // Node或者Panel的第二个参数可以是Node的类型或者是Panel的类型
        { /* 在这里设置节点属性 */
          // background: "#44CCFF"
        },
        // 绑定
        new go.Binding("key", "key"),
        new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
        new go.Binding("visible", "visible_attr", function(v) {
          return v.can_show && !v.hidden_by_feq && !v.hidden_by_hlight && !v.hidden_by_sel;
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
          new go.Binding("stroke", "isHighlighted", function(h) {
            return h ? "red" : "#7B7B7B";
          }).ofObject(),
          new go.Binding("strokeWidth", "isHighlighted", function(h) {
            return h ? 10 : 4;
          }).ofObject()
        ),

        $$(
          go.TextBlock,
          "default text", // 初始化时的文本属性，可以通过字符串参数直接设置
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
      linkTemplate: $$(
        go.Link, {
          layerName: "Background",
          selectable: false
        },
        new go.Binding("visible_attr", "visible_attr").makeTwoWay(),
        new go.Binding("visible", "visible_attr", function(v) {
          return v.can_show && !v.hidden_by_feq && !v.hidden_by_hlight && !v.hidden_by_sel;
        }),
        $$(
          go.Shape, {
            name: "OBJSHAPE",
            strokeWidth: 4,
            stroke: "#7B7B7B"
          },
          new go.Binding("stroke", "isHighlighted", function(h) {
            return h ? "red" : "#7B7B7B";
          }).ofObject(),
          new go.Binding("strokeWidth", "isHighlighted", function(h) {
            return h ? 10 : 4;
          }).ofObject()
        ),
        $$(
          go.TextBlock, {
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
    } // end calllist templates
  }
}
