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



// Define a simple template consisting of the icon surrounded by a filled circle
tools.node_templates["icon"] = 
  $$(go.Node, "Auto",
    $$(go.Shape, "Circle",
        { fill: "lightcoral", strokeWidth: 4, stroke: "#888", width: 40, height: 40 },
        new go.Binding("fill", "color")),
    $$(go.Shape,
      { margin: 3, fill: "#F5F5F5", strokeWidth: 0 },
      new go.Binding("geometry", "geo", function(geoname) {
        var geo = icons[geoname];
        if (geo === undefined) geo = "heart";  // use this for an unknown icon name
        if (typeof geo === "string") {
          geo = icons[geoname] = go.Geometry.parse(geo, true).scale(0.6, 0.6);  // fill each geometry
        }
        return geo;
      })),
    // Each node has a tooltip that reveals the name of its icon
    { toolTip:
        $$(go.Adornment, "Auto",
          $$(go.Shape, { fill: "LightYellow", stroke: "#888", strokeWidth: 2 }),
          $$(go.TextBlock, { margin: 8, stroke: "#888", font: "bold 16px sans-serif" },
            new go.Binding("text", "geo")))
    }
  );

// define the Node template, representing an entity
tools.node_templates["entity_relationship"] = 
  $$(go.Node, "Auto",  // the whole node panel
    { selectionAdorned: true,
      resizable: true,
      layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
      isShadowed: true,
      shadowColor: "#C5C1AA" },
    new go.Binding("location", "location").makeTwoWay(),
    // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
    // clear out any desiredSize set by the ResizingTool.
    new go.Binding("desiredSize", "visible", function(v) { return new go.Size(NaN, NaN); }).ofObject("LIST"),
    // define the node's outer shape, which will surround the Table
    $$(go.Shape, "Rectangle",
      { fill: tools.brushes.lightgrad, stroke: "#756875", strokeWidth: 3 }),
    $$(go.Panel, "Table",
      { margin: 8, stretch: go.GraphObject.Fill },
      $$(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
      // the table header
      $$(go.TextBlock,
        {
          row: 0, alignment: go.Spot.Center,
          margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
          font: "bold 16px sans-serif"
        },
        new go.Binding("text", "key")),
      // the collapse/expand button
      $$("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
        { row: 0, alignment: go.Spot.TopRight }),
      // the list of Panels, each showing an attribute
      $$(go.Panel, "Vertical",
        {
          name: "LIST",
          row: 1,
          padding: 3,
          alignment: go.Spot.TopLeft,
          defaultAlignment: go.Spot.Left,
          stretch: go.GraphObject.Horizontal,
          itemTemplate: $$(go.Panel, "Horizontal",
            $$(go.Shape,
              { desiredSize: new go.Size(10, 10) },
              new go.Binding("figure", "figure"),
              new go.Binding("fill", "color")),
            $$(go.TextBlock,
              { stroke: "#333333",
                font: "bold 14px sans-serif" },
              new go.Binding("text", "name"))
          )
        },
        new go.Binding("itemArray", "items"))
    )  // end Table Panel
  );  // end Node

// create the template for the standard nodes
tools.node_templates["gantt"] = 
  $$(go.Node, "Auto",
    // links come from the right and go to the left side of the top of the node
    { fromSpot: go.Spot.Right, toSpot: new go.Spot(0.001, 0, 11, 0) },
    $$(go.Shape, "Rectangle",
      { height: 15 },
      new go.Binding("fill", "color"),
      new go.Binding("width", "width", function (w) { return w; })),
    $$(go.TextBlock,
      { margin: 2, alignment: go.Spot.Left },
      new go.Binding("text", "key")),
    // using a function in the Binding allows the value to
    // change when Diagram.updateAllTargetBindings is called
    new go.Binding("location", "loc",
                   function (l) { return new go.Point(l.x, l.y); })
  );

// create the template for the start node
tools.node_templates["gantt_start"] = 
  $$(go.Node,
    { fromSpot: go.Spot.Right, toSpot: go.Spot.Top, selectable: false },
    $$(go.Shape, "Diamond",
      { height: 15, width: 15 }),
    // make the location of the start node is not scalable
    new go.Binding("location", "loc")
  );

// create the template for the end node
tools.node_templates["gantt_end"] = 
  $$(go.Node,
    { fromSpot: go.Spot.Right, toSpot: go.Spot.Top, selectable: false },
    $$(go.Shape, "Diamond",
      { height: 15, width: 15 }),
    // make the location of the end node (with location.x < 0) scalable
    new go.Binding("location", "loc",
                   function(l) {
                     if (l.x >= 0) return new go.Point(l.x, l.y);
                     else return l;
                   })
  );

// create the template for the nodes displaying dates
// no shape, only a TextBlock
tools.node_templates["gantt_date"] = 
  $$(go.Part,
    { selectable: false },
    new go.Binding("location", "loc",
                   function (l) { return new go.Point(l.x, l.y); }),
    $$(go.TextBlock,
      new go.Binding("text", "key"))
  );

tools.node_templates["uml"] = 
  // this simple template does not have any buttons to permit adding or
  // removing properties or methods, but it could!
  $$(go.Node, "Auto",
    {
      locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides
    },
    $$(go.Shape, { fill: "lightyellow" }),
    $$(go.Panel, "Table",
      { defaultRowSeparatorStroke: "black" },
      // header
      $$(go.TextBlock,
        {
          row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
          font: "bold 12pt sans-serif",
          isMultiline: false, editable: true
        },
        new go.Binding("text", "name").makeTwoWay()),
      // properties
      $$(go.TextBlock, "Properties",
        { row: 1, font: "italic 10pt sans-serif" },
        new go.Binding("visible", "visible", function(v) { return !v; }).ofObject("PROPERTIES")),


      $$(go.Panel, "Vertical", { name: "PROPERTIES" },
        new go.Binding("itemArray", "properties"),
        {
          row: 1, margin: 3, stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left, background: "lightyellow",
          itemTemplate: $$(go.Panel, "Horizontal",
            // property visibility/access
            $$(go.TextBlock,
              { isMultiline: false, editable: false, width: 12 },
              new go.Binding("text", "visibility", function convertVisibility(v) {
                switch (v) {
                  case "public": return "+";
                  case "private": return "-";
                  case "protected": return "#";
                  case "package": return "~";
                  default: return v;
                }
              })),
            // property name, underlined if scope=="class" to indicate static property
            $$(go.TextBlock,
              { isMultiline: false, editable: true },
              new go.Binding("text", "name").makeTwoWay(),
              new go.Binding("isUnderline", "scope", function(s) { return s[0] === 'c' })),
            // property type, if known
            $$(go.TextBlock, "",
              new go.Binding("text", "type", function(t) { return (t ? ": " : ""); })),
            $$(go.TextBlock,
              { isMultiline: false, editable: true },
              new go.Binding("text", "type").makeTwoWay()),
            // property default value, if any
            $$(go.TextBlock,
              { isMultiline: false, editable: false },
              new go.Binding("text", "default", function(s) { return s ? " = " + s : ""; }))
          )
        }
      ),
      $$("PanelExpanderButton", "PROPERTIES",
        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "properties", function(arr) { return arr.length > 0; })),
      // methods
      $$(go.TextBlock, "Methods",
        { row: 2, font: "italic 10pt sans-serif" },
        new go.Binding("visible", "visible", function(v) { return !v; }).ofObject("METHODS")),


      $$(go.Panel, "Vertical", { name: "METHODS" },
        new go.Binding("itemArray", "methods"),
        {
          row: 2, margin: 3, stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left, background: "lightyellow",
          itemTemplate: $$(go.Panel, "Horizontal",
            // method visibility/access
            $$(go.TextBlock,
              { isMultiline: false, editable: false, width: 12 },
              new go.Binding("text", "visibility", function(v) {
                switch (v) {
                  case "public": return "+";
                  case "private": return "-";
                  case "protected": return "#";
                  case "package": return "~";
                  default: return v;
                }
              })),
            // method name, underlined if scope=="class" to indicate static method
            $$(go.TextBlock,
              { isMultiline: false, editable: true },
              new go.Binding("text", "name").makeTwoWay(),
              new go.Binding("isUnderline", "scope", function(s) { return s[0] === 'c' })),
            // method parameters
            $$(go.TextBlock, "()",
              // this does not permit adding/editing/removing of parameters via inplace edits
              new go.Binding("text", "parameters", function(parr) {
                  var s = "(";
                  for (var i = 0; i < parr.length; i++) {
                    var param = parr[i];
                    if (i > 0) s += ", ";
                    s += param.name + ": " + param.type;
                  }
                  return s + ")";
              })),
            // method return type, if any
            $$(go.TextBlock, "",
              new go.Binding("text", "type", function(t) { return (t ? ": " : ""); })),
            $$(go.TextBlock,
              { isMultiline: false, editable: true },
              new go.Binding("text", "type").makeTwoWay())
          )
        }
      ),
      $$("PanelExpanderButton", "METHODS",
        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "methods", function(arr) { return arr.length > 0; }))
    )
  );

tools.node_templates["process_flow"] = 
  $$(go.Node, "Auto",
    { locationSpot: new go.Spot(0.5, 0.5), locationObjectName: "SHAPE",
      resizable: true, resizeObjectName: "SHAPE" },
    new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
    $$(go.Shape, "Cylinder1",
      { name: "SHAPE",
        strokeWidth: 2,
        fill: $$(go.Brush, "Linear",
                { start: go.Spot.Left, end: go.Spot.Right,
                  0: "gray", 0.5: "white", 1: "gray" }),
        minSize: new go.Size(50, 50),
        portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
      },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
    $$(go.TextBlock,
      { alignment: go.Spot.Center, textAlign: "center", margin: 5,
        editable: true },
      new go.Binding("text").makeTwoWay())
  );

tools.node_templates["process_flow_value"] = 
  $$(go.Node, "Vertical",
    { locationSpot: new go.Spot(0.5, 1, 0, -21), locationObjectName: "SHAPE",
      selectionObjectName: "SHAPE", rotatable: true },
    new go.Binding("angle").makeTwoWay(),
    new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
    $$(go.TextBlock,
      { alignment: go.Spot.Center, textAlign: "center", margin: 5, editable: true },
      new go.Binding("text").makeTwoWay(),
      // keep the text upright, even when the whole node has been rotated upside down
      new go.Binding("angle", "angle", function(a) { return a === 180 ? 180 : 0; }).ofObject()),
    $$(go.Shape,
      { name: "SHAPE",
        geometryString: "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
        strokeWidth: 2,
        fill: $$(go.Brush, "Linear", { 0: "gray", 0.35: "white", 0.7: "gray" }),
        portId: "", fromSpot: new go.Spot(1, 0.35), toSpot: new go.Spot(0, 0.35) })
  );

tools.node_templates["state_chart"] = 
// define the Node template
  $$(go.Node, "Auto",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    // define the node's outer shape, which will surround the TextBlock
    $$(go.Shape, "RoundedRectangle",
      {
        parameter1: 20,  // the corner has a large radius
        fill: $$(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
        stroke: null,
        portId: "",  // this Shape is the Node's port, not the whole Node
        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
        cursor: "pointer"
      }),
    $$(go.TextBlock,
      {
        font: "bold 11pt helvetica, bold arial, sans-serif",
        editable: true  // editing the text automatically updates the model data
      },
      new go.Binding("text").makeTwoWay()),
    {
      selectionAdornmentTemplate: 
        $$(go.Adornment, "Spot",
          $$(go.Panel, "Auto",
            $$(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
            $$(go.Placeholder)  // a Placeholder sizes itself to the selected Node
          ),
          // the button to create a "next" node, at the top-right corner
          $$("Button",
            {
              alignment: go.Spot.TopRight,
              click: function(e, obj) {
                var adornment = obj.part;
                var diagram = e.diagram;
                diagram.startTransaction("Add State");

                // get the node data for which the user clicked the button
                var fromNode = adornment.adornedPart;
                var fromData = fromNode.data;
                // create a new "State" data object, positioned off to the right of the adorned Node
                var toData = { category: "state_chart", text: "new" };
                var p = fromNode.location.copy();
                p.x += 200;
                toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
                // add the new node data to the model
                var model = diagram.model;
                model.addNodeData(toData);

                // create a link data from the old node data to the new node data
                var linkdata = {
                  from: model.getKeyForNodeData(fromData),  // or just: fromData.id
                  to: model.getKeyForNodeData(toData),
                  text: "transition",
                  category: "state_chart"
                };
                // and add the link data to the model
                model.addLinkData(linkdata);

                // select the new Node
                var newnode = diagram.findNodeForData(toData);
                diagram.select(newnode);

                diagram.commitTransaction("Add State");

                // if the new node is off-screen, scroll the diagram to show the new node
                diagram.scrollToRect(newnode.actualBounds);
              }  // this function is defined below
            },
            $$(go.Shape, "PlusLine", { width: 6, height: 6 })
          ) // end button
        )
    }
  );

tools.node_templates["pipe_comment"] = 
  $$(go.Node,
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $$(go.TextBlock,
      { stroke: "brown", font: "9pt sans-serif" },
      new go.Binding("text"))
  );


// Change the angle of the parts connected with the given node
function pipe_rotate(node, angle) {
  var tool = node.diagram.toolManager.draggingTool;  // should be a SnappingTool
  node.diagram.startTransaction("rotate " + angle.toString());
  var sel = new go.Set(go.Node);
  sel.add(node);
  var coll = tool.computeEffectiveCollection(sel).toKeySet();
  var bounds = node.diagram.computePartsBounds(coll);
  var center = bounds.center;
  coll.each(function(n) {
    n.angle += angle;
    n.location = n.location.copy().subtract(center).rotate(angle).add(center);
  });
  node.diagram.commitTransaction("rotate " + angle.toString());
}
tools.node_templates["pipe"] = 
  $$(go.Node, "Spot",
    {
      locationObjectName: "SHAPE",
      locationSpot: go.Spot.Center,
      selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
      itemTemplate:
        // each port is an "X" shape whose alignment spot and port ID are given by the item data
        $$(go.Panel,
          new go.Binding("portId", "id"),
          new go.Binding("alignment", "spot", go.Spot.parse),
          $$(go.Shape, "XLine",
            { width: 6, height: 6, background: "transparent", fill: null, stroke: "gray" },
            new go.Binding("figure", "id", function(pid) {
              if (pid === null || pid === "") return "XLine";
              if (pid[0] === 'F') return "CircleLine";
              if (pid[0] === 'M') return "PlusLine";
              return "XLine";  // including when the first character is 'U'
            }),  // portFigure converter is defined below
            new go.Binding("angle", "angle"))
        ),
      // hide a port when it is connected
      linkConnected: function(node, link, port) {
        if (link.category === "") port.visible = false;
      },
      linkDisconnected: function(node, link, port) {
        if (link.category === "") port.visible = true;
      }
    },
    // this creates the variable number of ports for this Spot Panel, based on the data
    new go.Binding("itemArray", "ports"),
    // remember the location of this Node
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    // remember the angle of this Node
    new go.Binding("angle", "angle").makeTwoWay(),
    // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
    new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
    $$(go.Shape,
      {
        name: "SHAPE",
        // the following are default values;
        // actual values may come from the node data object via data binding
        geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
        fill: "rgba(128, 128, 128, 0.5)"
      },
      // this determines the actual shape of the Shape
      new go.Binding("geometryString", "geo"),
      // selection causes the stroke to be blue instead of black
      new go.Binding("stroke", "isSelected", function(s) { return s ? "dodgerblue" : "black"; }).ofObject()),



      {
        contextMenu:
          $$(go.Adornment, "Vertical",
            $$("ContextMenuButton",
              $$(go.TextBlock, "Rotate +45"),
              { click: function(e, obj) { pipe_rotate(obj.part.adornedPart, 45); } }),
            $$("ContextMenuButton",
              $$(go.TextBlock, "Rotate -45"),
              { click: function(e, obj) { pipe_rotate(obj.part.adornedPart, -45); } }),
            $$("ContextMenuButton",
              $$(go.TextBlock, "Rotate 180"),
              { click: function(e, obj) { pipe_rotate(obj.part.adornedPart, 180); } }),
            $$("ContextMenuButton",
              $$(go.TextBlock, "Detach"),
              { click: function(e, obj) { 
                  obj.diagram.startTransaction("detach");
                  var coll = new go.Set(go.Link);
                  obj.diagram.selection.each(function(node) {
                    if (!(node instanceof go.Node)) return;
                    node.linksConnected.each(function(link) {
                      if (link.category !== "") return;  // ignore comments
                      // ignore links to other selected nodes
                      if (link.getOtherNode(node).isSelected) return;
                      // disconnect this link
                      coll.add(link);
                    });
                  });
                  obj.diagram.removeParts(coll, false);
                  obj.diagram.commitTransaction("detach");
              } }),
            $$("ContextMenuButton",
              $$(go.TextBlock, "Delete"),
              { click: function(e, obj) { e.diagram.commandHandler.deleteSelection(); } })
          )
      }
  );

tools.node_templates["FreehandDrawing"] =
  $$(go.Part,
    { locationSpot: go.Spot.Center, isLayoutPositioned: false },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    {
      selectionAdorned: true, selectionObjectName: "SHAPE",
      selectionAdornmentTemplate:  // custom selection adornment: a blue rectangle
        $$(go.Adornment, "Auto",
          $$(go.Shape, { stroke: "dodgerblue", fill: null }),
          $$(go.Placeholder, { margin: -1 }))
    },
    { resizable: true, resizeObjectName: "SHAPE" },
    { rotatable: true, rotateObjectName: "SHAPE" },
    { reshapable: true },  // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
    $$(go.Shape,
      { name: "SHAPE", fill: null, strokeWidth: 1.5 },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      new go.Binding("angle").makeTwoWay(),
      new go.Binding("geometryString", "geo").makeTwoWay(),
      new go.Binding("fill"),
      new go.Binding("stroke"),
      new go.Binding("strokeWidth"))
  );

tools.node_templates["sankey"] = 
    $$(go.Node, go.Panel.Horizontal,
      {
        locationObjectName: "SHAPE",
        locationSpot: go.Spot.MiddleLeft,
        portSpreading: go.Node.SpreadingPacked  // rather than the default go.Node.SpreadingEvenly
      },
      $$(go.TextBlock, { font: "bold 12pt Segoe UI, sans-serif", stroke: "black", margin: 5 },
        { name: "LTEXT" },
        new go.Binding("text", "ltext")),
      $$(go.Shape,
        {
          name: "SHAPE",
          figure: "Rectangle",
          fill: "#2E8DEF",  // default fill color
          stroke: null,
          strokeWidth: 0,
          portId: "",
          fromSpot: go.Spot.RightSide,
          toSpot: go.Spot.LeftSide,
          height: 50,
          width: 20
        },
        new go.Binding("fill", "color")),
      $$(go.TextBlock, { font: "bold 12pt Segoe UI, sans-serif", stroke: "black", margin: 5 },
        { name: "TEXT" },
        new go.Binding("text"))
    );

tools.node_templates["pert"] = 
  $$(go.Node, "Auto",
    $$(go.Shape, "Rectangle",  // the border
      { fill: "white", strokeWidth: 2 },
      new go.Binding("fill", "critical", function (b) { return (b ? "#F8BBD0" : "#B3E5FC" ); }),
      new go.Binding("stroke", "critical", function (b) { return (b ? "#B71C1C" :  "#0288D1"); })),
    $$(go.Panel, "Table",
      { padding: 0.5 },
      $$(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
      $$(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
      $$(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: "white", coversSeparators: true }),
      $$(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
      $$(go.TextBlock, // earlyStart
        new go.Binding("text", "earlyStart"),
        { row: 0, column: 0, margin: 5, textAlign: "center" }),
      $$(go.TextBlock,
        new go.Binding("text", "length"),
        { row: 0, column: 1, margin: 5, textAlign: "center" }),
      $$(go.TextBlock,  // earlyFinish
        new go.Binding("text", "",
                       function(d) { return (d.earlyStart + d.length).toFixed(2); }),
        { row: 0, column: 2, margin: 5, textAlign: "center" }),

      $$(go.TextBlock,
        new go.Binding("text", "text"),
        { row: 1, column: 0, columnSpan: 3, margin: 5,
          textAlign: "center", font: "bold 14px sans-serif" }),

      $$(go.TextBlock,  // lateStart
        new go.Binding("text", "",
                       function(d) { return (d.lateFinish - d.length).toFixed(2); }),
        { row: 2, column: 0, margin: 5, textAlign: "center" }),
      $$(go.TextBlock,  // slack
        new go.Binding("text", "",
                       function(d) { return (d.lateFinish - (d.earlyStart + d.length)).toFixed(2); }),
        { row: 2, column: 1, margin: 5, textAlign: "center" }),
      $$(go.TextBlock, // lateFinish
        new go.Binding("text", "lateFinish"),
        { row: 2, column: 2, margin: 5, textAlign: "center" })
    )  // end Table Panel
  );  // end Node