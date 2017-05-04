function diagram_ruler(){
// Keep references to the scales and indicators to easily update them
  var gradScaleHoriz = 
    $$(go.Node, "Graduated",
      { 
        graduatedTickUnit: 10, pickable: false, layerName: "Foreground",
        isInDocumentBounds: false, isAnimated: false
      },
      $$(go.Shape, { geometryString: "M0 0 H400" }),
      $$(go.Shape, { geometryString: "M0 0 V3", interval: 1 }),
      $$(go.Shape, { geometryString: "M0 0 V15", interval: 5 }),
      $$(go.TextBlock, 
        { 
          font: "10px sans-serif",
          interval: 5,
          alignmentFocus: go.Spot.TopLeft,
          segmentOffset: new go.Point(0, 7)
        }
      )
    );
  
  var gradScaleVert = 
    $$(go.Node, "Graduated",
      { 
        graduatedTickUnit: 10, pickable: false, layerName: "Foreground",
        isInDocumentBounds: false, isAnimated: false
      },
      $$(go.Shape, { geometryString: "M0 0 V400" }),
      $$(go.Shape, { geometryString: "M0 0 V3", interval: 1, alignmentFocus: go.Spot.Bottom }),
      $$(go.Shape, { geometryString: "M0 0 V15", interval: 5, alignmentFocus: go.Spot.Bottom }),
      $$(go.TextBlock, 
        { 
          font: "10px sans-serif",
          segmentOrientation: go.Link.OrientOpposite,
          interval: 5,
          alignmentFocus: go.Spot.BottomLeft,
          segmentOffset: new go.Point(0, -7)
        }
      )
    );

  // These indicators are globally defined so they can be accessed by the div's mouseevents
  var gradIndicatorHoriz = 
    $$(go.Node,
      { 
        pickable: false, layerName: "Foreground", visible: false,
        isInDocumentBounds: false, isAnimated: false,
        locationSpot: go.Spot.Top
      },
      $$(go.Shape, { geometryString: "M0 0 V15", strokeWidth: 2, stroke: "red" })
    );

  var gradIndicatorVert = 
    $$(go.Node,
      { 
        pickable: false, layerName: "Foreground", visible: false,
        isInDocumentBounds: false, isAnimated: false,
        locationSpot: go.Spot.Left
      },
      $$(go.Shape, { geometryString: "M0 0 H15", strokeWidth: 2, stroke: "red" })
    );

  // Add listeners to keep the scales/indicators in sync with the viewport
  tools.diagram.addDiagramListener("InitialLayoutCompleted", setupScalesAndIndicators);
  tools.diagram.addDiagramListener("ViewportBoundsChanged", updateScales);
  tools.diagram.addDiagramListener("ViewportBoundsChanged", updateIndicators);
  // Override mousemove Tools such that doMouseMove will keep indicators in sync
  tools.diagram.toolManager.doMouseMove = function() {
    go.ToolManager.prototype.doMouseMove.call(this);
    updateIndicators();
  }
  tools.diagram.toolManager.linkingTool.doMouseMove = function() {
    go.LinkingTool.prototype.doMouseMove.call(this);
    updateIndicators();
  }
  tools.diagram.toolManager.draggingTool.doMouseMove = function() {
    go.DraggingTool.prototype.doMouseMove.call(this);
    updateIndicators();
  }
  tools.diagram.toolManager.dragSelectingTool.doMouseMove = function() {
    go.DragSelectingTool.prototype.doMouseMove.call(this);
    updateIndicators();
  }
  // No need to override PanningTool since the ViewportBoundsChanged listener will fire

  function setupScalesAndIndicators() {
    var vb = tools.diagram.viewportBounds;
    tools.diagram.startTransaction("add scales");
    updateScales();
    // Add each node to the diagram
    tools.diagram.add(gradScaleHoriz);
    tools.diagram.add(gradScaleVert);
    tools.diagram.add(gradIndicatorHoriz);
    tools.diagram.add(gradIndicatorVert);
    tools.diagram.commitTransaction("add scales");
  }

  function updateScales() {
    var vb = tools.diagram.viewportBounds;
    tools.diagram.startTransaction("update scales");
    // Update properties of horizontal scale to reflect viewport
    gradScaleHoriz.location = new go.Point(vb.x, vb.y);
    gradScaleHoriz.graduatedMin = vb.x;
    gradScaleHoriz.graduatedMax = vb.x + vb.width;
    gradScaleHoriz.elt(0).width = vb.width;
    // Update properties of vertical scale to reflect viewport
    gradScaleVert.location = new go.Point(vb.x, vb.y);
    gradScaleVert.graduatedMin = vb.y;
    gradScaleVert.graduatedMax = vb.y + vb.height;
    gradScaleVert.elt(0).height = vb.height;
    tools.diagram.commitTransaction("update scales");
  }

  function updateIndicators() {
    var vb = tools.diagram.viewportBounds;
    var mouseCoords = tools.diagram.lastInput.documentPoint;
    tools.diagram.startTransaction("update indicators");
    // Keep the indicators in line with the mouse as viewport changes or mouse moves
    gradIndicatorHoriz.location = new go.Point(Math.max(mouseCoords.x, vb.x), vb.y);
    gradIndicatorVert.location = new go.Point(vb.x, Math.max(mouseCoords.y, vb.y));
    tools.diagram.commitTransaction("update indicators");
    
  }

  // Show indicators on mouseover of the diagram div
  $("#tools_main_diagram").unbind("mouseover").bind("mouseover", function() {
    tools.diagram.startTransaction("show indicators");
    gradIndicatorHoriz.visible = true;
    gradIndicatorVert.visible = true;
    tools.diagram.commitTransaction("show indicators");
  })

  // Hide indicators on mouseout of the diagram div
  $("#tools_main_diagram").unbind("mouseout").bind("mouseout", function() {
    tools.diagram.startTransaction("hide indicators");
    gradIndicatorHoriz.visible = false;
    gradIndicatorVert.visible = false;
    tools.diagram.commitTransaction("hide indicators");
  });
}