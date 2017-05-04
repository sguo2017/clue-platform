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