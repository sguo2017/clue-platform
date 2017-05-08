GoTools.prototype.makeLinkTemplateMap = function(){
  var $$ = go.GraphObject.make;
  
  this.linkTemplateMap.add("circuit",
      $$(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 3,
          relinkableFrom: true, relinkableTo: true,
          selectionAdorned: false, // Links are not adorned when selected so that their color remains visible.
          shadowOffset: new go.Point(0, 0), shadowBlur: 5, shadowColor: "blue",
        },
        new go.Binding("isShadowed", "isSelected").ofObject(),
        $$(go.Shape,
          { name: "SHAPE", strokeWidth: 2, stroke: "orangered" })));

  this.linkTemplateMap.add("flowchart",
    $$(go.Link,  // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5, toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        mouseEnter: function(e, link) { 
          var obj = link.findObject("HIGHLIGHT");
          if(obj) obj.stroke = "rgba(30,144,255,0.2)"; 
        },
        mouseLeave: function(e, link) { 
          var obj = link.findObject("HIGHLIGHT");
          if(obj) obj.stroke = "transparent"; 
        }
      },
      new go.Binding("points").makeTwoWay(),
      $$(go.Shape,  // the highlight shape, normally transparent
        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
      $$(go.Shape,  // the link path shape
        { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
      $$(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null, fill: "gray"}),
      $$(go.Panel, "Auto",  // the link label, normally not visible
        { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
        new go.Binding("visible", "visible").makeTwoWay(),
        $$(go.Shape, "RoundedRectangle",  // the label shape
          { fill: "#F8F8F8", stroke: null }),
        $$(go.TextBlock, "Yes",  // the label
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#333333",
            editable: true
          },
          new go.Binding("text").makeTwoWay())
      )
    ));

  this.linkTemplateMap.add("class_hierarchy",
    $$(go.Link,
      {
        curve: go.Link.Bezier,
        toEndSegmentLength: 30, fromEndSegmentLength: 30
      },
      $$(go.Shape, { strokeWidth: 1.5 }) // the link shape, with the default black stroke
    ));

  this.linkTemplateMap.add("dom",
    $$(go.Link,
      { selectable: false },
      $$(go.Shape)));


  this.linkTemplateMap.add("entity_relationship",
    $$(go.Link,  // the whole link panel
      {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      },
      $$(go.Shape,  // the link shape
        { stroke: "#303B45", strokeWidth: 2.5 }),
      $$(go.TextBlock,  // the "from" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: 0,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "text")),
      $$(go.TextBlock,  // the "to" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: -1,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "toText"))
    ));

  this.linkTemplateMap.add("gantt",
    $$(go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 3, toShortLength: 2,
        selectable: false
      },
      $$(go.Shape,
        { strokeWidth: 2 }),
      $$(go.Shape,
        { toArrow: "OpenTriangle" })
    ));

  this.linkTemplateMap.add("uml",
    $$(go.Link,
      { routing: go.Link.Orthogonal },
      new go.Binding("isLayoutPositioned", "relationship", function(r) {
        return r === "generalization";
      }),
      $$(go.Shape),
      $$(go.Shape, { scale: 1.3, fill: "white" },
        new go.Binding("fromArrow", "relationship", function(r) {
          switch (r) {
            case "generalization": return "";
            default: return "";
          }
        })),
      $$(go.Shape, { scale: 1.3, fill: "white" },
        new go.Binding("toArrow", "relationship", function(r) {
          switch (r) {
            case "generalization": return "Triangle";
            case "aggregation": return "StretchedDiamond";
            default: return "";
          }
        }))
    ));

  this.linkTemplateMap.add("process_flow",
    $$(go.Link,
      { routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true, toShortLength: 7 },
      new go.Binding("points").makeTwoWay(),
      // mark each Shape to get the link geometry with isPanelMain: true
      $$(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 5 }),
      $$(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 3 }),
      $$(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 1, name: "PIPE", strokeDashArray: [10, 10] }),
      $$(go.Shape, { toArrow: "Triangle", fill: "black", stroke: null })
    ));

  this.linkTemplateMap.add("state_chart",
    $$(go.Link,  // the whole link panel
      {
        curve: go.Link.Bezier, adjusting: go.Link.Stretch,
        reshapable: true, relinkableFrom: true, relinkableTo: true,
        toShortLength: 3
      },
      new go.Binding("points").makeTwoWay(),
      new go.Binding("curviness"),
      $$(go.Shape,  // the link shape
        { strokeWidth: 1.5 }),
      $$(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null }),
      $$(go.Panel, "Auto",
        $$(go.Shape,  // the label background, which becomes transparent around the edges
          {
            fill: $$(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
            stroke: null
          }),
        $$(go.TextBlock, "transition",  // the label text
          {
            textAlign: "center",
            font: "9pt helvetica, arial, sans-serif",
            margin: 4,
            editable: true  // enable in-place editing
          },
          // editing the text automatically updates the model data
          new go.Binding("text").makeTwoWay())
      )
    ));


  // no visual representation of any link data
  this.linkTemplateMap.add("pipe", $$(go.Link, { visible: false }));

  // support optional links from comment nodes to pipe nodes
  this.linkTemplateMap.add("pipe_comment",
    $$(go.Link,
      { curve: go.Link.Bezier },
      $$(go.Shape, { stroke: "brown", strokeWidth: 2 }),
      $$(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
    ));

  this.linkTemplateMap.add("sankey", 
    $$(go.Link, go.Link.Bezier,
      {
        selectionAdornmentTemplate: $$(go.Adornment, "Link",
          $$(go.Shape,
            { isPanelMain: true, fill: null, stroke: "rgba(0, 0, 255, 0.3)", strokeWidth: 0 })  // use selection object's strokeWidth
        ),
        layerName: "Background",
        fromEndSegmentLength: 150, toEndSegmentLength: 150,
        adjusting: go.Link.End
      },
      $$(go.Shape, { strokeWidth: 4, stroke: "rgba(173, 173, 173, 0.25)" },
       new go.Binding("stroke", "", function(data) {
          var nodedata = goTools.model.findNodeDataForKey(data.from);
          var hex = nodedata.color;
          if (hex.charAt(0) == '#') {
            var rgb = parseInt(hex.substr(1, 6), 16);
            var r = rgb >> 16;
            var g = rgb >> 8 & 0xFF;
            var b = rgb & 0xFF;
            var alpha = 0.4;
            if (data.width <= 2) alpha = 1;
            var rgba = "rgba(" + r + "," + g + "," + b + ", " + alpha + ")";
            return rgba;
          }
          return "rgba(173, 173, 173, 0.25)";
        }),
       new go.Binding("strokeWidth", "width"))
    ));

  function linkColorConverter(linkdata, elt) {
        var link = elt.part;
        if (!link) return blue;
        var f = link.fromNode;
        if (!f || !f.data || !f.data.critical) return blue;
        var t = link.toNode;
        if (!t || !t.data || !t.data.critical) return blue;
        return pink;  // when both Link.fromNode.data.critical and Link.toNode.data.critical
      }

      // The color of a link (including its arrowhead) is red only when both
      // connected nodes have data that is ".critical"; otherwise it is blue.
      // This is computed by the binding converter function.
  this.linkTemplateMap.add("pert",
    $$(go.Link,
      { toShortLength: 6, toEndSegmentLength: 20 },
      $$(go.Shape,
        { strokeWidth: 4 },
        new go.Binding("stroke", "", function(linkdata, elt) {
          var link = elt.part;
          if (!link) return "#0288D1";
          var f = link.fromNode;
          if (!f || !f.data || !f.data.critical) return "#0288D1";
          var t = link.toNode;
          if (!t || !t.data || !t.data.critical) return "#0288D1";
          return "#B71C1C";  // when both Link.fromNode.data.critical and Link.toNode.data.critical
        })),
      $$(go.Shape,  // arrowhead
        { toArrow: "Triangle", stroke: null, scale: 1.5 },
        new go.Binding("fill", "", function(linkdata, elt) {
          var link = elt.part;
          if (!link) return "#0288D1";
          var f = link.fromNode;
          if (!f || !f.data || !f.data.critical) return "#0288D1";
          var t = link.toNode;
          if (!t || !t.data || !t.data.critical) return "#0288D1";
          return "#B71C1C";  // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }))
    ));

  this.linkTemplateMap.add("wheel",
    $$(go.Link,
        {
          routing: go.Link.Normal,
          curve: go.Link.Bezier,
          selectionAdorned: false,
          mouseEnter: function(e, link) {
            link.isHighlighted = true;
            link.fromNode.isHighlighted = true;
            link.toNode.isHighlighted = true;
          },
          mouseLeave: function(e, link) {
            link.isHighlighted = false;
            link.fromNode.isHighlighted = false;
            link.toNode.isHighlighted = false;
          }
        },
        $$(go.Shape,
          new go.Binding("stroke", "isHighlighted",
                         function(h, shape) { return h ? "red" : shape.part.data.color; })
                        .ofObject(),
          new go.Binding("strokeWidth", "isHighlighted",
                         function(h) { return h ? 2 : 1; })
                        .ofObject())
      ))

  this.linkTemplateMap.add("timeline",
    $$(BarLink,  // defined below
        { toShortLength: 2 , layerName: "Background" },
        $$(go.Shape, { stroke: "#E37933", strokeWidth: 2 })
      ))

  this.linkTemplateMap.add("sequence", 
    $$(MessageLink,  // defined below
        { selectionAdorned: true, curviness: 0 },
        $$(go.Shape, "Rectangle",
          { stroke: "black" }),
        $$(go.Shape,
          { toArrow: "OpenTriangle", stroke: "black" }),
        $$(go.TextBlock,
          {
            font: "400 9pt Source Sans Pro, sans-serif",
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            isMultiline: false,
            editable: true
          },
          new go.Binding("text", "text").makeTwoWay())
      ))

  this.linkTemplateMap.add("euler", 
    $$(go.Link,
      $$(go.Shape,
        new go.Binding("stroke", "color"),
        new go.Binding("strokeWidth", "width"),
        new go.Binding("strokeDashArray", "dash"))
    ))

  this.linkTemplateMap.add("Dimensioning", 
    $$(DimensioningLink,
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
      new go.Binding("toSpot", "toSpot", go.Spot.parse),
      new go.Binding("direction"),
      new go.Binding("extension"),
      new go.Binding("inset"),
      $$(go.Shape, { stroke: "gray" },
        new go.Binding("stroke", "color")),
      $$(go.Shape, { fromArrow: "BackwardOpenTriangle", segmentIndex: 2, stroke: "gray" },
        new go.Binding("stroke", "color")),
      $$(go.Shape, { toArrow: "OpenTriangle", segmentIndex: -3, stroke: "gray" },
        new go.Binding("stroke", "color")),
      $$(go.TextBlock,
        {
          segmentIndex: 2,
          segmentFraction: 0.5,
          segmentOrientation: go.Link.OrientUpright,
          alignmentFocus: go.Spot.Bottom,
          stroke: "gray",
          font: "8pt sans-serif"
        },
        new go.Binding("text", "", function(link) {
          var numpts = link.pointsCount;
          if (numpts < 2) return "";
          var p0 = link.getPoint(0);
          var pn = link.getPoint(numpts - 1);
          var ang = link.direction;
          if (isNaN(ang)) return Math.floor(Math.sqrt(p0.distanceSquaredPoint(pn))) + "";
          var rad = ang * Math.PI / 180;
          return Math.floor(Math.abs(Math.cos(rad) * (p0.x - pn.x)) +
                            Math.abs(Math.sin(rad) * (p0.y - pn.y))) + "";
        }).ofObject(),
        new go.Binding("stroke", "color"))
    ));

  this.linkTemplateMap.add("comment",
      // if the BalloonLink class has been loaded from the Extensions directory, use it
      $$((typeof BalloonLink === "function" ? BalloonLink : go.Link),
        $$(go.Shape,  // the Shape.geometry will be computed to surround the comment node and
                     // point all the way to the commented node
          { stroke: "brown", strokeWidth: 1, fill: "lightyellow" })
      ));
}