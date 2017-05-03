# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

tools = {}
tools.diagram = null;
tools.palette = null;
tools.overview = null;

$ ->
	if $("#tools_main_diagram").length>0
		$$ = go.GraphObject.make
		diagram = $$(go.Diagram, "tools_main_diagram", {
			initialContentAlignment: go.Spot.Center,
			allowDrop: true
		})

		diagram.nodeTemplate =
		    $$(go.Node, "Auto",
		      $$(go.Shape, "Rectangle",
		        { fill: "white" },
		        new go.Binding("fill", "color")),
		      $$(go.TextBlock, { margin: 5 },
		        new go.Binding("text", "key"))
		    )
		red = "orangered"

		green = "forestgreen"

		nodeStyle = ->
	        return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
	                new go.Binding("isShadowed", "isSelected").ofObject(),
	                {
	                  selectionAdorned: false,
	                  shadowOffset: new go.Point(0, 0),
	                  shadowBlur: 15,
	                  shadowColor: "blue"
	                  
	                }];
      	
      	shapeStyle = ->
	        return {
	          name: "NODESHAPE",
	          fill: "lightgray",
	          stroke: "darkslategray",
	          desiredSize: new go.Size(40, 40),
	          strokeWidth: 2
	        };
	      

	    portStyle = (input) ->
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

		outputTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "Rectangle", shapeStyle(),
		    { fill: green }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "", alignment: new go.Spot(0, 0.5) })
		);

		andTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "AndGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		orTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "OrGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		xorTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "XorGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		norTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "NorGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		xnorTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "XnorGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		nandTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "NandGate", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		notTemplate =
		$$(go.Node, "Spot", nodeStyle(),
		  $$(go.Shape, "Inverter", shapeStyle()),
		  $$(go.Shape, "Rectangle", portStyle(true),
		    { portId: "in", alignment: new go.Spot(0, 0.5) }),
		  $$(go.Shape, "Rectangle", portStyle(false),
		    { portId: "out", alignment: new go.Spot(1, 0.5) })
		);

		diagram.nodeTemplateMap.add("output", outputTemplate);
		diagram.nodeTemplateMap.add("and", andTemplate);
		diagram.nodeTemplateMap.add("or", orTemplate);
		diagram.nodeTemplateMap.add("xor", xorTemplate);
		diagram.nodeTemplateMap.add("not", notTemplate);
		diagram.nodeTemplateMap.add("nand", nandTemplate);
		diagram.nodeTemplateMap.add("nor", norTemplate);
		diagram.nodeTemplateMap.add("xnor", xnorTemplate);

		palette = new go.Palette("tools_main_palette"); 
		palette.nodeTemplateMap = diagram.nodeTemplateMap;

		palette.model.nodeDataArray = [
			
			{ category: "output" },
			{ category: "and" },
			{ category: "or" },
			{ category: "xor" },
			{ category: "not" },
			{ category: "nand" },
			{ category: "nor" },
			{ category: "xnor" }
		];


		nodeDataArray = []
		for i in [0..1000]
		    nodeDataArray.push({ color: go.Brush.randomColor() })
		  
		diagram.model.nodeDataArray = nodeDataArray
		
		overview = $$(go.Overview, "tools_main_overview", {observed: diagram, contentAlignment: go.Spot.Center, maxScale: 0.5})

		tools.diagram = diagram;
		tools.overview = overview;
		tools.palette = palette;

		$(window).onresize = ->
			alert(1)
			return
		
		return true;