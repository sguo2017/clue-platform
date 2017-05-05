tools.link_templates["circuit"] =
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
        { name: "SHAPE", strokeWidth: 2, stroke: "orangered" }));

tools.link_templates["flowchart"] =
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
      mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
      mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
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
  );

tools.link_templates["class_hierarchy"] =
  $$(go.Link,
    {
      curve: go.Link.Bezier,
      toEndSegmentLength: 30, fromEndSegmentLength: 30
    },
    $$(go.Shape, { strokeWidth: 1.5 }) // the link shape, with the default black stroke
  );

tools.link_templates["dom"] =
  $$(go.Link,
    { selectable: false },
    $$(go.Shape));


tools.link_templates["entity_relationship"] =
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
  );

tools.link_templates["gantt"] =
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
  );

tools.link_templates["uml"] =
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
  );

tools.link_templates["process_flow"] =
  $$(go.Link,
    { routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true, toShortLength: 7 },
    new go.Binding("points").makeTwoWay(),
    // mark each Shape to get the link geometry with isPanelMain: true
    $$(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 5 }),
    $$(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 3 }),
    $$(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 1, name: "PIPE", strokeDashArray: [10, 10] }),
    $$(go.Shape, { toArrow: "Triangle", fill: "black", stroke: null })
  );

tools.link_templates["state_chart"] =
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
  );


// no visual representation of any link data
tools.link_templates["pipe"] = $$(go.Link, { visible: false });

// support optional links from comment nodes to pipe nodes
tools.link_templates["pipe_comment"] =
  $$(go.Link,
    { curve: go.Link.Bezier },
    $$(go.Shape, { stroke: "brown", strokeWidth: 2 }),
    $$(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
  );