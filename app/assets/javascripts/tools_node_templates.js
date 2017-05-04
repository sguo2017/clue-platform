tools.node_templates["color_box"] = 
    $$(go.Node, "Auto",
      $$(go.Shape, "Rectangle",
        { fill: "white" },
        new go.Binding("fill", "color")),
      $$(go.TextBlock, { margin: 5 },
        new go.Binding("text", "key"))
    )

tools.node_templates["floor"] = $$(go.Node, "Spot",
	{
	  locationObjectName: "SHAPE",
	  locationSpot: go.Spot.Center,
	  toolTip: $$(go.Adornment, go.Panel.Auto,
		$$(go.Shape, "RoundedRectangle",
		  { fill: "whitesmoke", stroke: "gray" }),
		$$(go.TextBlock,
		  { margin: 3, editable: true },
		  // converts data about the part into a string
		  new go.Binding("text", "", function(data) {
			  if (data.item != undefined) return data.item;
			  return "(unnamed item)";
			}))
	  ),
	  selectionAdorned: false
	},
	new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
	new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
	{ resizable: true, resizeObjectName: "SHAPE" },
	{ rotatable: true, rotateObjectName: "SHAPE" },
	$$(go.Shape,{
		name: "SHAPE",
		geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
		fill: "rgb(130, 130, 256)"
	  },
	  new go.Binding("geometryString", "geo"),
	  new go.Binding("fill", "color"),
	  new go.Binding("stroke", "isSelected", function(s) { return s ? "dodgerblue" : "black"; }).ofObject(),
	  new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
	  new go.Binding("angle", "angle").makeTwoWay()
	)
  );

var circuit_nodeStyle = function(){
    return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("isShadowed", "isSelected").ofObject(),
            {
              selectionAdorned: false,
              shadowOffset: new go.Point(0, 0),
              shadowBlur: 15,
              shadowColor: "blue"
            }];
}
var circuit_shapeStyle = function(){
    return {
      name: "NODESHAPE",
      fill: "lightgray",
      stroke: "darkslategray",
      desiredSize: new go.Size(40, 40),
      strokeWidth: 2
    };
}
var circuit_portStyle = function(input){
    return {
      desiredSize: new go.Size(6, 6),
      fill: "black",
      fromSpot: go.Spot.Right,
      fromLinkable: !input,
      toSpot: go.Spot.Left,
      toLinkable: input,
      toMaxLinks: 1,
      cursor: "pointer"
    };
}

tools.node_templates["circuit.input"] =
    $$(go.Node, "Spot", circuit_nodeStyle(),
      $$(go.Shape, "Circle", circuit_shapeStyle(),
        { fill: "orangered" }),  // override the default fill (from shapeStyle()) to be red
      $$(go.Shape, "Rectangle", circuit_portStyle(false),  // the only port
        { portId: "", alignment: new go.Spot(1, 0.5) }),
      { // if double-clicked, an input node will change its value, represented by the color.
        doubleClick: function (e, obj) {
            e.diagram.startTransaction("Toggle Input");
            var shp = obj.findObject("NODESHAPE");
            shp.fill = (shp.fill === "forestgreen") ? "orangered" : "forestgreen";
            updateStates();
            e.diagram.commitTransaction("Toggle Input");
          }
      }
    );

tools.node_templates["circuit.output"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "Rectangle", circuit_shapeStyle(),
	    { fill: "forestgreen" }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "", alignment: new go.Spot(0, 0.5) })
	);

tools.node_templates["circuit.and"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "AndGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.or"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "OrGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.xor"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "XorGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.nor"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "NorGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.xnor"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "XnorGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.nand"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "NandGate", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

tools.node_templates["circuit.not"] =
	$$(go.Node, "Spot", circuit_nodeStyle(),
	  $$(go.Shape, "Inverter", circuit_shapeStyle()),
	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
	    { portId: "in", alignment: new go.Spot(0, 0.5) }),
	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
	    { portId: "out", alignment: new go.Spot(1, 0.5) })
	);

function flowchart_showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = (show ? "white" : null);
      });
  }

function flowchart_nodeStyle() {
  return [
    // The Node.location comes from the "loc" property of the node data,
    // converted by the Point.parse static method.
    // If the Node.location is changed, it updates the "loc" property of the node data,
    // converting back using the Point.stringify static method.
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    {
      // the Node.location is at the center of each node
      locationSpot: go.Spot.Center,
      //isShadowed: true,
      //shadowColor: "#888",
      // handle mouse enter/leave events to show/hide the ports
      mouseEnter: function (e, obj) { flowchart_showPorts(obj.part, true); },
      mouseLeave: function (e, obj) { flowchart_showPorts(obj.part, false); }
    }
  ];
}

function flowchart_makePort(name, spot, output, input) {
  // the port is basically just a small circle that has a white stroke when it is made visible
  return $$(go.Shape, "Circle",
           {
              fill: "transparent",
              stroke: null,  // this is changed to "white" in the showPorts function
              desiredSize: new go.Size(8, 8),
              alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
              portId: name,  // declare this object to be a "port"
              fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
              fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
              cursor: "pointer"  // show a different cursor to indicate potential link point
           });
}

tools.node_templates["flowchart.normal"] =
  $$(go.Node, "Spot", flowchart_nodeStyle(),
    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
    $$(go.Panel, "Auto",
      $$(go.Shape, "Rectangle",
        { fill: "#00A9C9", stroke: null },
        new go.Binding("figure", "figure")),
      $$(go.TextBlock,
        {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: 'whitesmoke',
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    // four named ports, one on each side:
    flowchart_makePort("T", go.Spot.Top, false, true),
    flowchart_makePort("L", go.Spot.Left, true, true),
    flowchart_makePort("R", go.Spot.Right, true, true),
    flowchart_makePort("B", go.Spot.Bottom, true, false)
  );

tools.node_templates["flowchart.start"] =
  $$(go.Node, "Spot", flowchart_nodeStyle(),
    $$(go.Panel, "Auto",
      $$(go.Shape, "Circle",
        { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
      $$(go.TextBlock, "Start",
        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: 'whitesmoke' },
        new go.Binding("text"))
    ),
    // three named ports, one on each side except the top, all output only:
    flowchart_makePort("L", go.Spot.Left, true, false),
    flowchart_makePort("R", go.Spot.Right, true, false),
    flowchart_makePort("B", go.Spot.Bottom, true, false)
  );

tools.node_templates["flowchart.end"] =
  $$(go.Node, "Spot", flowchart_nodeStyle(),
    $$(go.Panel, "Auto",
      $$(go.Shape, "Circle",
        { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
      $$(go.TextBlock, "End",
        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: 'whitesmoke' },
        new go.Binding("text"))
    ),
    // three named ports, one on each side except the bottom, all input only:
    flowchart_makePort("T", go.Spot.Top, false, true),
    flowchart_makePort("L", go.Spot.Left, false, true),
    flowchart_makePort("R", go.Spot.Right, false, true)
  );

tools.node_templates["flowchart.comment"] =
  $$(go.Node, "Auto", flowchart_nodeStyle(),
    $$(go.Shape, "File",
      { fill: "#EFFAB4", stroke: null }),
    $$(go.TextBlock,
      {
        margin: 5,
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
        editable: true,
        font: "bold 12pt Helvetica, Arial, sans-serif",
        stroke: '#454545'
      },
      new go.Binding("text").makeTwoWay())
    // no ports, because no links are allowed to connect with a comment
  );	

tools.node_templates["class_hierarchy"] = 
  $$(go.Node,
    $$("HyperlinkText",
      // compute the URL to open for the documentation
      function(node) { return "../api/symbols/" + node.data.key + ".html"; },
      // define the visuals for the hyperlink, basically the whole node:
      $$(go.Panel, "Auto",
        $$(go.Shape, { fill: "#1F4963", stroke: null }),
        $$(go.TextBlock,
          {
            font: "bold 13px Helvetica, bold Arial, sans-serif",
            stroke: "white", margin: 3
          },
          new go.Binding("text", "key"))
      )
    )
  );

tools.node_templates["dom"] = 
  $$(go.Node, "Horizontal",
    { selectionChanged: function(node) {
	    if (node.isSelected) {
	      window.dom_names[node.data.name].style.backgroundColor = "lightblue";
	    } else {
	      window.dom_names[node.data.name].style.backgroundColor = "";
	    }
	  } },  // this event handler is defined below
    $$(go.Panel, "Auto",
      $$(go.Shape, { fill: "#1F4963", stroke: null }),
      $$(go.TextBlock,
        { font: "bold 13px Helvetica, bold Arial, sans-serif",
          stroke: "white", margin: 3 },
        new go.Binding("text", "key"))
    ),
    $$("TreeExpanderButton")
  );

tools.node_templates["shape"] = 
  $$(go.Node, "Vertical",
    {
      locationSpot: go.Spot.Center,  // the location is the center of the Shape
      locationObjectName: "SHAPE",
      selectionAdorned: false,  // no selection handle when selected
      resizable: true, resizeObjectName: "SHAPE",  // user can resize the Shape
      rotatable: true, rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
      // don't re-layout when node changes size
      layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
    },
    new go.Binding("layerName", "isHighlighted", function(h) { return h ? "Foreground" : ""; }).ofObject(),
    $$(go.Shape,
      {
        name: "SHAPE",  // named so that the above properties can refer to this GraphObject
        width: 40, height: 40,
        stroke: "#C2185B",
        fill: "#F48FB1",
        strokeWidth: 3
      },
      // bind the Shape.figure to the figure name, which automatically gives the Shape a Geometry
      new go.Binding("figure", "key")),
    $$(go.TextBlock,  // the label
      {
        margin: 4,
        font: "bold 18px sans-serif",
        background: 'white'
      },
      new go.Binding("visible", "isHighlighted").ofObject(),
      new go.Binding("text", "key"))
  );