

// Context Menu -- referenced by Node, Diagram and Group Templates
function makeContextMenu() {
    var $ = go.GraphObject.make
    return $$(go.Adornment, "Vertical",
        // Make Selection Group Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Make Group"),
            { click: function (e, obj) { 
                var floorplan = obj.part.diagram
                floorplan.startTransaction("group selection");
                // ungroup all selected nodes; then group them; if one of the selected nodes is a group, ungroup all its nodes
                var sel = floorplan.selection; var nodes = [];
                sel.iterator.each(function (n) {
                    if (n instanceof go.Group) n.memberParts.iterator.each(function (part) { nodes.push(part); })
                    else nodes.push(n);
                });
                for (var i = 0; i < nodes.length; i++) nodes[i].isSelected = true;
                
                floorplan.startTransaction('ungroup selection');
                // helper function to ungroup nodes
                function ungroupNode(node) {
                    var group = node.containingGroup;
                    node.containingGroup = null;
                    if (group != null) {
                        if (group.memberParts.count === 0) floorplan.remove(group);
                        else if (group.memberParts.count === 1) group.memberParts.first().containingGroup = null;
                    }
                }
                // ungroup any selected nodes; remember groups that are selected
                var sel = floorplan.selection; var groups = [];
                sel.iterator.each(function (n) {
                    if (!(n instanceof go.Group)) ungroupNode(n);
                    else groups.push(n);
                });
                // go through selected groups, and ungroup their memberparts too
                var nodes = [];
                for (var i = 0; i < groups.length; i++) groups[i].memberParts.iterator.each(function (n) { nodes.push(n); });
                for (var i = 0; i < nodes.length; i++) ungroupNode(nodes[i]);

                var nodes = floorplan.nodes; var arr = [];
                nodes.iterator.each(function (node) { if (node instanceof go.Group && node.memberParts.count === 0 && node.category !== "WallGroup") { arr.push(node); } });
                for (i = 0; i < arr.length; i++) { floorplan.remove(arr[i]); }

                floorplan.commitTransaction('ungroup selection');

                floorplan.commandHandler.groupSelection();
                var group = floorplan.selection.first(); // after grouping, the new group will be the only thing selected
                floorplan.model.setDataProperty(group.data, "caption", "Group");
                floorplan.model.setDataProperty(group.data, "notes", "");
                
                var nodes = floorplan.nodes; var arr = [];
                nodes.iterator.each(function (node) { if (node instanceof go.Group && node.memberParts.count === 0 && node.category !== "WallGroup") { arr.push(node); } });
                for (i = 0; i < arr.length; i++) { floorplan.remove(arr[i]); }

                // unselect / reselect group so data appears properly in Selection Info Window
                floorplan.clearSelection();
                floorplan.select(group);
                floorplan.commitTransaction("group selection");
            } },
            new go.Binding("visible", "visible", function (v, obj) {
                var floorplan = obj.part.diagram;
                if (floorplan.selection.count <= 1) return false;
                var flag = true;
                floorplan.selection.iterator.each(function (node) {
                    if (node.category === "WallGroup" || node.category === "WindowNode" || node.category === "DoorNode") flag = false;
                });
                return flag;
            }).ofObject()
        ),
        // Ungroup Selection Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Ungroup"),
            { click: function (e, obj) { 
                var floorplan = obj.part.diagram;
                floorplan.startTransaction('ungroup selection');
                // helper function to ungroup nodes
                function ungroupNode(node) {
                    var group = node.containingGroup;
                    node.containingGroup = null;
                    if (group != null) {
                        if (group.memberParts.count === 0) floorplan.remove(group);
                        else if (group.memberParts.count === 1) group.memberParts.first().containingGroup = null;
                    }
                }
                // ungroup any selected nodes; remember groups that are selected
                var sel = floorplan.selection; var groups = [];
                sel.iterator.each(function (n) {
                    if (!(n instanceof go.Group)) ungroupNode(n);
                    else groups.push(n);
                });
                // go through selected groups, and ungroup their memberparts too
                var nodes = [];
                for (var i = 0; i < groups.length; i++) groups[i].memberParts.iterator.each(function (n) { nodes.push(n); });
                for (var i = 0; i < nodes.length; i++) ungroupNode(nodes[i]);
                
                var nodes = floorplan.nodes; var arr = [];
                nodes.iterator.each(function (node) { if (node instanceof go.Group && node.memberParts.count === 0 && node.category !== "WallGroup") { arr.push(node); } });
                for (i = 0; i < arr.length; i++) { floorplan.remove(arr[i]); }

                floorplan.commitTransaction('ungroup selection');
            } },
            new go.Binding("visible", "", function (v, obj) {
                var floorplan = obj.part.diagram;
                if (floorplan !== null) {
                    var node = floorplan.selection.first();
                    return ((node instanceof go.Node && node.containingGroup != null && node.containingGroup.category != 'WallGroup') ||
                        (node instanceof go.Group && node.category === ''));
                } return false;
            }).ofObject()
        ),
        // Copy Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Copy"),
            { click: function (e, obj) { obj.part.diagram.commandHandler.copySelection() } },
            new go.Binding("visible", "", function (v, obj) {
                if (obj.part.diagram !== null) {
                    return obj.part.diagram.selection.count > 0;
                } return false;
            }).ofObject()
        ),
        // Cut Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Cut"),
            { click: function (e, obj) { obj.part.diagram.commandHandler.cutSelection() } },
            new go.Binding("visible", "", function (v, obj) {
                if (obj.part.diagram !== null) {
                    return obj.part.diagram.selection.count > 0;
                } return false;
            }).ofObject()
        ),
        // Delete Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Delete"),
            { click: function (e, obj) { obj.part.diagram.commandHandler.deleteSelection() } },
            new go.Binding("visible", "", function (v, obj) {
                if (obj.part.diagram !== null) {
                    return obj.part.diagram.selection.count > 0;
                } return false;
            }).ofObject()
        ),
        // Paste Button
        $$("ContextMenuButton",
            $$(go.TextBlock, "Paste"),
            { click: function (e, obj) { obj.part.diagram.commandHandler.pasteSelection(obj.part.diagram.lastInput.documentPoint) } }
        ),
        // Show Selection Info Button (only available when selection count > 0)
        $$("ContextMenuButton",
            $$(go.TextBlock, "Show Selection Info"),
            {
                click: function (e, obj) {
                    if (e.diagram.floorplanUI) {
                        var selectionInfoWindow = document.getElementById(e.diagram.floorplanUI.state.windows.selectionInfoWindow.id);
                        if (selectionInfoWindow.style.visibility !== 'visible') e.diagram.floorplanUI.hideShow('selectionInfoWindow');
                    }
                }
            },
            new go.Binding("visible", "", function (v, obj) {
                if (obj.part.diagram !== null) {
                    return obj.part.diagram.selection.count > 0;
                } return false;
            }).ofObject()
        ),
        // Flip Dimension Side Button (only available when selection contains Wall Group(s))
        $$("ContextMenuButton",
            $$(go.TextBlock, "Flip Dimension Side"),
            {
                click: function (e, obj) {
                    var floorplan = obj.part.diagram;
                    if (floorplan !== null) {
                        floorplan.startTransaction("flip dimension link side");
                        var walls = [];
                        floorplan.selection.iterator.each(function (part) {
                            if (part.category === "WallGroup") walls.push(part);
                        });
                        for (var i = 0; i < walls.length; i++) {
                            var wall = walls[i];
                            var sPt = wall.data.startpoint.copy();
                            var ePt = wall.data.endpoint.copy();
                            floorplan.model.setDataProperty(wall.data, "startpoint", ePt);
                            floorplan.model.setDataProperty(wall.data, "endpoint", sPt);
                            floorplan.updateWall(wall);
                        }
                        floorplan.commitTransaction("flip dimension link side");
                    }
                }
            },
            new go.Binding("visible", "", function (v, obj) {
                if (obj.part.diagram !== null) {
                    var sel = obj.part.diagram.selection;
                    if (sel.count === 0) return false;
                    var flag = false;
                    sel.iterator.each(function (part) {
                        if (part.category === "WallGroup") flag = true;
                    });
                    return flag;
                } return false;
            }).ofObject()
        )
   );
}

/*
* Wall Part Node Dependencies:
* Get Wall Part Endpoints, Get Wall Part Stretch,
* Drag Wall Parts (Drag Comp. Function), Wall Part Resize Adornment, Door Selection Adornment (Door Nodes only)
*/

// Find and return an array of the endpoints of a given wallpart (window or door)
function getWallPartEndpoints(wallPart) {
    var loc = wallPart.location;
    var partLength = wallPart.data.width;
    if (wallPart.containingGroup !== null) var angle = wallPart.containingGroup.rotateObject.angle;
    else var angle = 180;
    var point1 = new go.Point((loc.x + (partLength / 2)), loc.y);
    var point2 = new go.Point((loc.x - (partLength / 2)), loc.y);
    point1.offset(-loc.x, -loc.y).rotate(angle).offset(loc.x, loc.y);
    point2.offset(-loc.x, -loc.y).rotate(angle).offset(loc.x, loc.y);
    var arr = []; arr.push(point1); arr.push(point2);
    return arr;
}

// Returns a "stretch" (2 Points) that constrains a wallPart (door or window)
// This stretch is comprised of either "part"'s containing wall endpoints or other wallPart endpoints
function getWallPartStretch(part) {
    var wall = part.containingGroup;
    var startpoint = wall.data.startpoint.copy();
    var endpoint = wall.data.endpoint.copy();

    // sort all possible endpoints into either left/above or right/below
    var leftOrAbove = new go.Set(go.Point); var rightOrBelow = new go.Set(go.Point);
    wall.memberParts.iterator.each(function (wallPart) {
        if (wallPart.data.key !== part.data.key) {
            var endpoints = getWallPartEndpoints(wallPart);
            for (var i = 0; i < endpoints.length; i++) {
                if (endpoints[i].x < part.location.x || (endpoints[i].y > part.location.y && endpoints[i].x === part.location.x)) leftOrAbove.add(endpoints[i]);
                else rightOrBelow.add(endpoints[i]);
            }
        }
    });

    // do the same with the startpoint and endpoint of the dragging part's wall
    if (parseFloat(startpoint.x.toFixed(2)) < parseFloat(part.location.x.toFixed(2)) || (startpoint.y > part.location.y && parseFloat(startpoint.x.toFixed(2)) === parseFloat(part.location.x.toFixed(2)))) leftOrAbove.add(startpoint);
    else rightOrBelow.add(startpoint);
    if (parseFloat(endpoint.x.toFixed(2)) < parseFloat(part.location.x.toFixed(2)) || (endpoint.y > part.location.y && parseFloat(endpoint.x.toFixed(2)) === parseFloat(part.location.x.toFixed(2)))) leftOrAbove.add(endpoint);
    else rightOrBelow.add(endpoint);

    // of each set, find the closest point to the dragging part
    var leftOrAbovePt; var closestDistLeftOrAbove = Number.MAX_VALUE;
    leftOrAbove.iterator.each(function (point) {
        var distance = Math.sqrt(point.distanceSquaredPoint(part.location));
        if (distance < closestDistLeftOrAbove) {
            closestDistLeftOrAbove = distance;
            leftOrAbovePt = point;
        }
    });
    var rightOrBelowPt; var closestDistRightOrBelow = Number.MAX_VALUE;
    rightOrBelow.iterator.each(function (point) {
        var distance = Math.sqrt(point.distanceSquaredPoint(part.location));
        if (distance < closestDistRightOrBelow) {
            closestDistRightOrBelow = distance;
            rightOrBelowPt = point;
        }
    });

    var stretch = { point1: leftOrAbovePt, point2: rightOrBelowPt };
    return stretch;
}


GoTools.prototype.makeNodeTemplateMap = function(){
  var $$ = go.GraphObject.make;
  /* 
  * Node Templates
  * Add Default Node, Multi-Purpose Node, Window Node, Palette Wall Node, and Door Node to the Node Template Map
  * Template functions defined in FloorPlanner-Templates-* js files
  */


  // Return inverted color (in hex) of a given hex code color; used to determine furniture node stroke color
  function invertColor(hexnum) {
      if (hexnum.includes('#')) hexnum = hexnum.substring(1);
      if (hexnum.length != 6) {
          console.error("Hex color must be six hex numbers in length.");
          return false;
      }

      hexnum = hexnum.toUpperCase();
      var splitnum = hexnum.split("");
      var resultnum = "";
      var simplenum = "FEDCBA9876".split("");
      var complexnum = new Array();
      complexnum.A = "5";
      complexnum.B = "4";
      complexnum.C = "3";
      complexnum.D = "2";
      complexnum.E = "1";
      complexnum.F = "0";

      for (i = 0; i < 6; i++) {
          if (!isNaN(splitnum[i])) {
              resultnum += simplenum[splitnum[i]];
          } else if (complexnum[splitnum[i]]) {
              resultnum += complexnum[splitnum[i]];
          } else {
              console.error("Hex colors must only include hex numbers 0-9, and A-F");
              return false;
          }
      }
      return '#' + resultnum;
  }

  // Drag computation function for WindowNodes and DoorNodes; ensure wall parts stay in walls when dragged
  var dragWallParts = function (part, pt, gridPt) {
    if (part.containingGroup !== null && part.containingGroup.category === 'WallGroup') {
        var floorplan = part.diagram;
        // Edge Case: if part is not on its wall (due to incorrect load) snap part.loc onto its wall immediately; ideally this is never called
        var wall = part.containingGroup;
        var wStart = wall.data.startpoint;
        var wEnd = wall.data.endpoint;
        var dist1 = Math.sqrt(wStart.distanceSquaredPoint(part.location));
        var dist2 = Math.sqrt(part.location.distanceSquaredPoint(wEnd));
        var totalDist = Math.sqrt(wStart.distanceSquaredPoint(wEnd));
        if (dist1 + dist2 !== totalDist) part.location = part.location.copy().projectOntoLineSegmentPoint(wStart, wEnd);

        // main behavior
        var stretch = getWallPartStretch(part);
        var leftOrAbovePt = stretch.point1;
        var rightOrBelowPt = stretch.point2;

        // calc points along line created by the endpoints that are half the width of the moving window/door
        var totalLength = Math.sqrt(leftOrAbovePt.distanceSquaredPoint(rightOrBelowPt));
        var distance = (part.data.width / 2);
        var point1 = new go.Point(leftOrAbovePt.x + ((distance / totalLength) * (rightOrBelowPt.x - leftOrAbovePt.x)),
        leftOrAbovePt.y + ((distance / totalLength) * (rightOrBelowPt.y - leftOrAbovePt.y)));
        var point2 = new go.Point(rightOrBelowPt.x + ((distance / totalLength) * (leftOrAbovePt.x - rightOrBelowPt.x)),
        rightOrBelowPt.y + ((distance / totalLength) * (leftOrAbovePt.y - rightOrBelowPt.y)));

        // calc distance from pt to line (part's wall) - use point to 2pt line segment distance formula
        var distFromWall = Math.abs(((wEnd.y - wStart.y) * pt.x) - ((wEnd.x - wStart.x) * pt.y) + (wEnd.x * wStart.y) - (wEnd.y * wStart.x)) /
            Math.sqrt(Math.pow((wEnd.y - wStart.y), 2) + Math.pow((wEnd.x - wStart.x), 2));
        var tolerance = (20 * wall.data.strokeWidth < 100) ? (20 * wall.data.strokeWidth) : 100;

        // if distance from pt to line > some tolerance, detach the wallPart from the wall
        if (distFromWall > tolerance) {
            part.containingGroup = null;
            part.angle = 0;
            allPointNodes.iterator.each(function (node) { floorplan.remove(node) });
            allDimensionLinks.iterator.each(function (link) { floorplan.remove(link) });
            allPointNodes.clear();
            allDimensionLinks.clear();
            floorplan.updateWallDimensions();
        }

        // project the proposed location onto the line segment created by the new points (ensures wall parts are constrained properly when dragged)
        pt = pt.copy().projectOntoLineSegmentPoint(point1, point2);
        floorplan.skipsUndoManager = true;
        floorplan.startTransaction("set loc");
        floorplan.model.setDataProperty(part.data, "loc", go.Point.stringify(pt));
        floorplan.commitTransaction("set loc");
        floorplan.skipsUndoManager = false;

        floorplan.updateWallDimensions(); // update the dimension links created by having this wall part selected
    } return pt;
}

  /*
  * Furniture Node Templates:
  * Default Node, MultiPurpose Node
  */

  this.nodeTemplateMap.add("FurnitureNode", 
    $$(go.Node, "Spot",
      {
          resizable: true,
          rotatable: true,
          toolTip: function() {
              var $$ = go.GraphObject.make;
              return $$(go.Adornment, "Auto",
                      $$(go.Shape, { fill: "#FFFFCC" }),
                      $$(go.TextBlock, { margin: 4 },
                      new go.Binding("text", "", function (text, obj) {
                          var data = obj.part.adornedObject.data;
                          var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
                          return "Name: " + name + "\nNotes: " + data.notes;
                      }).ofObject())
                  )
          }(),
          resizeAdornmentTemplate: function() {
              var $$ = go.GraphObject.make;
              function makeHandle(alignment, cursor) {
                  return $$(go.Shape, { alignment: alignment, cursor: cursor, figure: "Rectangle", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" },
                      new go.Binding("fill", "color"),
                      new go.Binding("stroke", "stroke"));
              }

              return $$(go.Adornment, "Spot", { locationSpot: go.Spot.Center },
                $$(go.Placeholder),
                makeHandle(go.Spot.Top, "n-resize"),
                makeHandle(go.Spot.TopRight, "n-resize"),
                makeHandle(go.Spot.BottomRight, "se-resize"),
                makeHandle(go.Spot.Right, "e-resize"),
                makeHandle(go.Spot.Bottom, "s-resize"),
                makeHandle(go.Spot.BottomLeft, "sw-resize"),
                makeHandle(go.Spot.Left, "w-resize"),
                makeHandle(go.Spot.TopLeft, "nw-resize")
              );
          }(),
          rotateAdornmentTemplate: function() {
              var $$ = go.GraphObject.make;
              return $$(go.Adornment, { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
                  $$(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" },
                  new go.Binding("fill", "", function (obj) { return (obj.adornedPart === null) ? "#ffffff" : obj.adornedPart.data.color; }).ofObject(),
                  new go.Binding("stroke", "", function (obj) { return (obj.adornedPart === null) ? "#000000" : obj.adornedPart.data.stroke; }).ofObject())
                  );
          }(),
          contextMenu: makeContextMenu(),
          locationObjectName: "SHAPE",
          resizeObjectName: "SHAPE",
          rotateObjectName: "SHAPE",
          minSize: new go.Size(5, 5),
          locationSpot: go.Spot.Center,
          selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
          doubleClick: function (e) {
              if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow")
          }
      },
      // remember Node location
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // move selected Node to Foreground layer so it's not obscuerd by non-selected Parts
      new go.Binding("layerName", "isSelected", function (s) {
          return s ? "Foreground" : "";
      }).ofObject(),
      $$(go.Shape,
      {
          strokeWidth: 1,
          name: "SHAPE",
          stroke: "#000000",
          geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
          fill: "rgba(128, 128, 128, 0.5)"
      },
      new go.Binding("geometryString", "geo"),
      new go.Binding("width", "width").makeTwoWay(),
      new go.Binding("height", "height").makeTwoWay(),
      new go.Binding("angle", "angle").makeTwoWay(),
      new go.Binding("figure", "shape").makeTwoWay(),
      new go.Binding("stroke", "isSelected", function (s, obj) {
          return s ? go.Brush.lightenBy(obj.stroke, .5) : invertColor(obj.part.data.color);
      }).ofObject(),
      new go.Binding("fill", "color"))
    )); // Default Node (furniture)
  this.nodeTemplateMap.add("MultiPurposeNode", 
    $$(go.Node, "Spot",
        {
            contextMenu: makeContextMenu(),
            toolTip: function() {
                var $$ = go.GraphObject.make;
                return $$(go.Adornment, "Auto",
                        $$(go.Shape, { fill: "#FFFFCC" }),
                        $$(go.TextBlock, { margin: 4 },
                        new go.Binding("text", "", function (text, obj) {
                            var data = obj.part.adornedObject.data;
                            var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
                            return "Name: " + name + "\nNotes: " + data.notes;
                        }).ofObject())
                    )
            }(),
            locationSpot: go.Spot.Center,
            resizeAdornmentTemplate: function() {
              var $$ = go.GraphObject.make;
              function makeHandle(alignment, cursor) {
                  return $$(go.Shape, { alignment: alignment, cursor: cursor, figure: "Rectangle", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" },
                      new go.Binding("fill", "color"),
                      new go.Binding("stroke", "stroke"));
              }

              return $$(go.Adornment, "Spot", { locationSpot: go.Spot.Center },
                $$(go.Placeholder),
                makeHandle(go.Spot.Top, "n-resize"),
                makeHandle(go.Spot.TopRight, "n-resize"),
                makeHandle(go.Spot.BottomRight, "se-resize"),
                makeHandle(go.Spot.Right, "e-resize"),
                makeHandle(go.Spot.Bottom, "s-resize"),
                makeHandle(go.Spot.BottomLeft, "sw-resize"),
                makeHandle(go.Spot.Left, "w-resize"),
                makeHandle(go.Spot.TopLeft, "nw-resize")
              );
          }(),
            rotateAdornmentTemplate: function() {
                var $$ = go.GraphObject.make;
                return $$(go.Adornment, { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
                    $$(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" },
                    new go.Binding("fill", "", function (obj) { return (obj.adornedPart === null) ? "#ffffff" : obj.adornedPart.data.color; }).ofObject(),
                    new go.Binding("stroke", "", function (obj) { return (obj.adornedPart === null) ? "#000000" : obj.adornedPart.data.stroke; }).ofObject())
                    );
            }(),
            locationObjectName: "SHAPE",
            resizable: true,
            rotatable: true,
            resizeObjectName: "SHAPE",
            rotateObjectName: "SHAPE",
            minSize: new go.Size(5, 5),
            selectionAdorned: false,
            doubleClick: function (e) {
                if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow")
            }
        },
        // remember location, angle, height, and width of the node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // move a selected part into the Foreground layer so it's not obscuerd by non-selected Parts
        new go.Binding("layerName", "isSelected", function (s) { return s ? "Foreground" : ""; }).ofObject(),
        $$(go.Shape,
        { strokeWidth: 1, name: "SHAPE", fill: "rgba(128, 128, 128, 0.5)", },
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
        new go.Binding("stroke", "isSelected", function (s, obj) {
            return s ? go.Brush.lightenBy(obj.stroke, .5) : invertColor(obj.part.data.color);
        }).ofObject(),
        new go.Binding("fill", "color")),
        $$(go.TextBlock,
        {
            margin: 5,
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            isMultiline: false,
            stroke: '#454545',
            font: "10pt sans-serif"
        },
        new go.Binding("text").makeTwoWay(),
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("font", "height", function (height) {
            if (height > 25) return "10pt sans-serif";
            if (height < 25 && height > 15) return "8pt sans-serif";
            else return "6pt sans-serif";
        }),
        new go.Binding("stroke", "color", function (color) { return invertColor(color); })
        )
      )); // Multi-Purpose Node 
  this.nodeTemplateMap.add("WindowNode", 
    $$(go.Node, "Spot",
        {
            contextMenu: makeContextMenu(),
            selectionObjectName: "SHAPE",
            selectionAdorned: false,
            locationSpot: go.Spot.Center,
            name: "NODE",
            toolTip: function() {
                var $$ = go.GraphObject.make;
                return $$(go.Adornment, "Auto",
                        $$(go.Shape, { fill: "#FFFFCC" }),
                        $$(go.TextBlock, { margin: 4 },
                        new go.Binding("text", "", function (text, obj) {
                            var data = obj.part.adornedObject.data;
                            var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
                            return "Name: " + name + "\nNotes: " + data.notes;
                        }).ofObject())
                    )
            }(),
            minSize: new go.Size(5, 5),
            resizable: true,
            resizeAdornmentTemplate: 
              $$(go.Adornment, "Spot",
                { name: "WallPartResizeAdornment", locationSpot: go.Spot.Center },
                $$(go.Placeholder),
                $$(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", figure: "Diamond", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" }),
                $$(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", figure: "Diamond", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" })
              ),
            resizeObjectName: "SHAPE",
            rotatable: false,
            doubleClick: function (e) { if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow"); },
            dragComputation: dragWallParts,
            layerName: 'Foreground' // make sure windows are always in front of walls
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("angle", "angle").makeTwoWay(),
        $$(go.Shape,
        { name: "SHAPE", fill: "white", strokeWidth: 0 },
        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
        new go.Binding("stroke", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject(),
        new go.Binding("fill", "isSelected", function (s, obj) { return s ? "lightgray" : "white"; }).ofObject()
        ),
        $$(go.Shape,
        { name: "LINESHAPE", fill: "darkgray", strokeWidth: 0, height: 10 },
        new go.Binding("width", "width", function (width, obj) { return width - 10; }), // 5px padding each side
        new go.Binding("height", "height", function (height, obj) { return (height / 5); }),
        new go.Binding("stroke", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject()
        )
      )); // Window Node
  this.nodeTemplateMap.add("PaletteWallNode", 
    $$(go.Node, "Spot",
        { selectionAdorned: false, locationSpot: go.Spot.Center },
        $$(go.Shape,
        { name: "SHAPE", fill: "black", strokeWidth: 0, height: 10, figure: "Rectangle" },
        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
        new go.Binding("fill", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject(),
        new go.Binding("stroke", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject())
    )); // Palette Wall Node
  this.nodeTemplateMap.add("DoorNode", 
    $$(go.Node, "Spot",
        {
            contextMenu: makeContextMenu(),
            selectionObjectName: "SHAPE",
            selectionAdornmentTemplate: 
              $$(go.Adornment, "Vertical",
                { name: "DoorSelectionAdornment" },
                $$(go.Panel, "Auto",
                $$(go.Shape, { fill: null, stroke: null }),
                $$(go.Placeholder)),
                $$(go.Panel, "Horizontal", { defaultStretch: go.GraphObject.Vertical },
                    $$("Button",
                        $$(go.Picture, { source: "/assets/gojs/tools/icons/flipDoorOpeningLeft.png", column: 0, desiredSize: new go.Size(12, 12) },
                            new go.Binding("source", "", function (obj) {
                                if (obj.adornedPart === null) return "/assets/gojs/tools/icons/flipDoorOpeningRight.png";
                                else if (obj.adornedPart.data.swing === "left") return "/assets/gojs/tools/icons/flipDoorOpeningRight.png";
                                else return "icons/flipDoorOpeningLeft.png";
                            }).ofObject()
                        ),
                        {
                            click: function (e, obj) {
                                var floorplan = obj.part.diagram;
                                floorplan.startTransaction("flip door");
                                var door = obj.part.adornedPart;
                                if (door.data.swing === "left") floorplan.model.setDataProperty(door.data, "swing", "right");
                                else floorplan.model.setDataProperty(door.data, "swing", "left");
                                floorplan.commitTransaction("flip door");
                            },
                            toolTip: $$(go.Adornment, "Auto",
                                $$(go.Shape, { fill: "#FFFFCC" }),
                                $$(go.TextBlock, { margin: 4, text: "Flip Door Opening" }
                            ))
                        },
                        new go.Binding("visible", "", function (obj) { return (obj.adornedPart === null) ? false : (obj.adornedPart.containingGroup !== null); }).ofObject()
                     ),
                     $$("Button",
                        $$(go.Picture, { source: "/assets/gojs/tools/icons/flipDoorSide.png", column: 0, desiredSize: new go.Size(12, 12) }),
                        {
                            click: function (e, obj) {
                                var floorplan = obj.part.diagram;
                                floorplan.startTransaction("rotate door");
                                var door = obj.part.adornedPart;
                                door.angle = (door.angle + 180) % 360;
                                floorplan.commitTransaction("rotate door");
                            },
                            toolTip: $$(go.Adornment, "Auto",
                                $$(go.Shape, { fill: "#FFFFCC" }),
                                $$(go.TextBlock, { margin: 4, text: "Flip Door Side" }
                            ))
                        }
                     ),
                     new go.Binding("visible", "", function (obj) { return (obj.adornedPart === null) ? false : (obj.adornedPart.containingGroup !== null); }).ofObject()
                )
              ),
            locationSpot: go.Spot.BottomCenter,
            resizable: true,
            resizeObjectName: "OPENING_SHAPE",
            rotatable: false,
            toolTip: function() {
                var $$ = go.GraphObject.make;
                return $$(go.Adornment, "Auto",
                        $$(go.Shape, { fill: "#FFFFCC" }),
                        $$(go.TextBlock, { margin: 4 },
                        new go.Binding("text", "", function (text, obj) {
                            var data = obj.part.adornedObject.data;
                            var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
                            return "Name: " + name + "\nNotes: " + data.notes;
                        }).ofObject())
                    )
            }(),
            minSize: new go.Size(10, 10),
            doubleClick: function (e) { if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow"); },
            dragComputation: dragWallParts,
            resizeAdornmentTemplate: 
              $$(go.Adornment, "Spot",
                { name: "WallPartResizeAdornment", locationSpot: go.Spot.Center },
                $$(go.Placeholder),
                $$(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", figure: "Diamond", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" }),
                $$(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", figure: "Diamond", desiredSize: new go.Size(7, 7), fill: "#ffffff", stroke: "#808080" })
              ),
            layerName: 'Foreground' // make sure windows are always in front of walls
        },
        // remember location of the Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("angle", "angle").makeTwoWay(),
        // the door's locationSpot is affected by it's openingHeight, which is affected by the thickness of its containing wall
        new go.Binding("locationSpot", "doorOpeningHeight", function (doh, obj) { return new go.Spot(0.5, 1, 0, -(doh / 2)); }),
        // this is the shape that reprents the door itself and its swing
        $$(go.Shape,
        { name: "SHAPE", strokeWidth: 1 },
        new go.Binding("width", "width"),
        new go.Binding("height", "width").makeTwoWay(),
        new go.Binding("stroke", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject(),
        new go.Binding("fill", "color"),
        new go.Binding("geometryString", "swing", function (swing) {
            if (swing === "left") return "F1 M0,0 v-150 a150,150 0 0,1 150,150 ";
            else return "F1 M275,175 v-150 a150,150 0 0,0 -150,150 ";
        })
        ),
        // door opening shape
        $$(go.Shape,
        {
            name: "OPENING_SHAPE", fill: "white",
            strokeWidth: 0, height: 5, width: 40,
            alignment: go.Spot.BottomCenter, alignmentFocus: go.Spot.Center
        },
        new go.Binding("height", "doorOpeningHeight").makeTwoWay(),
        new go.Binding("stroke", "isSelected", function (s, obj) { return s ? "dodgerblue" : "black"; }).ofObject(),
        new go.Binding("fill", "isSelected", function (s, obj) { return s ? "lightgray" : "white"; }).ofObject(),
        new go.Binding("width", "width").makeTwoWay()
        )
      )); // Door Node

  this.nodeTemplateMap.add("color_box",
      $$(go.Node, "Auto",
        $$(go.Shape, "Rectangle",
          { fill: "white" },
          new go.Binding("fill", "color")),
        $$(go.TextBlock, { margin: 5 },
          new go.Binding("text", "key"))
      ));

  this.nodeTemplateMap.add("floor", $$(go.Node, "Spot",
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
    ));

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

  this.nodeTemplateMap.add("circuit.input", 
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
      ));

  this.nodeTemplateMap.add("circuit.output", 
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "Rectangle", circuit_shapeStyle(),
  	    { fill: "forestgreen" }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "", alignment: new go.Spot(0, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.and", 
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "AndGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.or", 
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "OrGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.xor", 
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "XorGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.nor", 
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "NorGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.xnor",
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "XnorGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.nand",
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "NandGate", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in1", alignment: new go.Spot(0, 0.3) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in2", alignment: new go.Spot(0, 0.7) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

  this.nodeTemplateMap.add("circuit.not",
  	$$(go.Node, "Spot", circuit_nodeStyle(),
  	  $$(go.Shape, "Inverter", circuit_shapeStyle()),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(true),
  	    { portId: "in", alignment: new go.Spot(0, 0.5) }),
  	  $$(go.Shape, "Rectangle", circuit_portStyle(false),
  	    { portId: "out", alignment: new go.Spot(1, 0.5) })
  	));

    

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
        mouseEnter: function (e, obj) { 
          var diagram = obj.part.diagram;
          if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
          obj.part.ports.each(function(port) {
              port.stroke = "white";
            });
        },
        mouseLeave: function (e, obj) { 
          var diagram = obj.part.diagram;
          if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
          obj.part.ports.each(function(port) {
              port.stroke = null;
            });
        }
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

  this.nodeTemplateMap.add("flowchart.normal",
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
    ));

  this.nodeTemplateMap.add("flowchart.start",
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
    ));

  this.nodeTemplateMap.add("flowchart.end",
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
    ));

  this.nodeTemplateMap.add("flowchart.comment",
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
    ));	

  this.nodeTemplateMap.add("class_hierarchy", 
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
    ));

  this.nodeTemplateMap.add("dom", 
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
    ));

  this.nodeTemplateMap.add("shape", 
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
    ));



  // Define a simple template consisting of the icon surrounded by a filled circle
  this.nodeTemplateMap.add("icon", 
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
    ));

  // define the Node template, representing an entity
  this.nodeTemplateMap.add("entity_relationship", 
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
        { fill: this.brushes.lightgrad, stroke: "#756875", strokeWidth: 3 }),
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
    ));  // end Node

  // create the template for the standard nodes
  this.nodeTemplateMap.add("gantt", 
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
    ));

  // create the template for the start node
  this.nodeTemplateMap.add("gantt_start", 
    $$(go.Node,
      { fromSpot: go.Spot.Right, toSpot: go.Spot.Top, selectable: false },
      $$(go.Shape, "Diamond",
        { height: 15, width: 15 }),
      // make the location of the start node is not scalable
      new go.Binding("location", "loc")
    ));

  // create the template for the end node
  this.nodeTemplateMap.add("gantt_end", 
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
    ));

  // create the template for the nodes displaying dates
  // no shape, only a TextBlock
  this.nodeTemplateMap.add("gantt_date", 
    $$(go.Part,
      { selectable: false },
      new go.Binding("location", "loc",
                     function (l) { return new go.Point(l.x, l.y); }),
      $$(go.TextBlock,
        new go.Binding("text", "key"))
    ));

  this.nodeTemplateMap.add("uml", 
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
    ));

  this.nodeTemplateMap.add("process_flow", 
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
    ));

  this.nodeTemplateMap.add("process_flow_value", 
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
    ));

  this.nodeTemplateMap.add("state_chart", 
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
    ));

  this.nodeTemplateMap.add("pipe_comment", 
    $$(go.Node,
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $$(go.TextBlock,
        { stroke: "brown", font: "9pt sans-serif" },
        new go.Binding("text"))
    ));


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
  this.nodeTemplateMap.add("pipe", 
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
    ));

  this.nodeTemplateMap.add("FreehandDrawing",
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
    ));

  this.nodeTemplateMap.add("sankey", 
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
      ));

  this.nodeTemplateMap.add("pert", 
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
    ));  // end Node

  this.nodeTemplateMap.add("wheel", 
      $$(go.Node, "Horizontal",
        {
          selectionAdorned: false,
          locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
          locationObjectName: "SHAPE",
          mouseEnter: function(e, node) {
            node.diagram.clearHighlighteds();
            node.linksConnected.each(function(link) { 
                link.isHighlighted = true;
                link.fromNode.isHighlighted = true;
                link.toNode.isHighlighted = true;
            });
            node.isHighlighted = true;
            var tb = node.findObject("TEXTBLOCK");
            if (tb !== null) tb.stroke = "red";
          },
          mouseLeave: function(e, node) {
            node.diagram.clearHighlighteds();
            var tb = node.findObject("TEXTBLOCK");
            if (tb !== null) tb.stroke = "black";
          }
        },
        new go.Binding("text", "text"),  // for sorting the nodes
        $$(go.Shape, "Ellipse",
          {
            name: "SHAPE",
            fill: "lightgray",  // default value, but also data-bound
            stroke: "transparent",  // modified by highlighting
            strokeWidth: 2,
            desiredSize: new go.Size(20, 20),
            portId: ""
          },  // so links will go to the shape, not the whole node
          new go.Binding("fill", "color"),
          new go.Binding("stroke", "isHighlighted",
                         function(h) { return h ? "red" : "transparent"; })
                        .ofObject()),
        $$(go.TextBlock,
          { name: "TEXTBLOCK" },  // for search
          new go.Binding("text", "text"))
      ));

  this.nodeTemplateMap.add("seating_person", 
    $$(go.Node, "Auto",
        { background: "transparent" },  // in front of all Tables
        // when selected is in foreground layer
        new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("text", "key"),
        { // what to do when a drag-over or a drag-drop occurs on a Node representing a table
          mouseDragEnter: function(e, node, prev) { highlightSeats(node, node.diagram.selection, true); },
          mouseDragLeave: function(e, node, next) { highlightSeats(node, node.diagram.selection, false); },
          mouseDrop: function(e, node) { assignPeopleToSeats(node, node.diagram.selection, e.documentPoint); }
        },
        $$(go.Shape, "Rectangle", { fill: "blanchedalmond", stroke: null }),
        $$(go.Panel, "Viewbox",
          { desiredSize: new go.Size(50, 38) },
          $$(go.TextBlock,{ margin: 2, desiredSize: new go.Size(55, NaN), font: "8pt Verdana, sans-serif", textAlign: "center", stroke: "darkblue" },
            new go.Binding("text", "", function(data) {
                var s = data.key;
                if (data.plus) s += " +" + data.plus.toString();
                return s;
              }))
        )
      ));
    // Create a seat element at a particular alignment relative to the table.
    function Seat(number, align, focus) {
      if (typeof align === 'string') align = go.Spot.parse(align);
      if (!align || !align.isSpot()) align = go.Spot.Right;
      if (typeof focus === 'string') focus = go.Spot.parse(focus);
      if (!focus || !focus.isSpot()) focus = align.opposite();
      return $$(go.Panel, "Spot",
               { name: number.toString(), alignment: align, alignmentFocus: focus },
               $$(go.Shape, "Circle",
                 { name: "SEATSHAPE", desiredSize: new go.Size(40, 40), fill: "burlywood", stroke: "white", strokeWidth: 2 },
                 new go.Binding("fill")),
               $$(go.TextBlock, number.toString(),
                 { font: "10pt Verdana, sans-serif" },
                 new go.Binding("angle", "angle", function(n) { return -n; }))
             );
    }

    function tableStyle() {
      return [
        { background: "transparent" },
        { layerName: "Background" },  // behind all Persons
        { locationSpot: go.Spot.Center, locationObjectName: "TABLESHAPE" },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { rotatable: true },
        new go.Binding("angle").makeTwoWay(),
          { // what to do when a drag-over or a drag-drop occurs on a Node representing a table
            mouseDragEnter: function(e, node, prev) { 
                //highlightSeats(node, node.diagram.selection, true); 
            },
            mouseDragLeave: function(e, node, next) { 
                //highlightSeats(node, node.diagram.selection, false); 
            },
            mouseDrop: function(e, node) { 
                //assignPeopleToSeats(node, node.diagram.selection, e.documentPoint); 
            }
          }
        ];
    }

    // various kinds of tables:

    this.nodeTemplateMap.add("TableR8",  // rectangular with 8 seats
      $$(go.Node, "Spot", tableStyle(),
        $$(go.Panel, "Spot",
          $$(go.Shape, "Rectangle",
            { name: "TABLESHAPE", desiredSize: new go.Size(160, 80), fill: "burlywood", stroke: null },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("fill")),
          $$(go.TextBlock, { editable: true, font: "bold 11pt Verdana, sans-serif" },
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("angle", "angle", function(n) { return -n; }))
        ),
        Seat(1, "0.2 0", "0.5 1"),
        Seat(2, "0.5 0", "0.5 1"),
        Seat(3, "0.8 0", "0.5 1"),
        Seat(4, "1 0.5", "0 0.5"),
        Seat(5, "0.8 1", "0.5 0"),
        Seat(6, "0.5 1", "0.5 0"),
        Seat(7, "0.2 1", "0.5 0"),
        Seat(8, "0 0.5", "1 0.5")
      ));

    this.nodeTemplateMap.add("TableR3",  // rectangular with 3 seats in a line
      $$(go.Node, "Spot", tableStyle(),
        $$(go.Panel, "Spot",
          $$(go.Shape, "Rectangle",
            { name: "TABLESHAPE", desiredSize: new go.Size(160, 60), fill: "burlywood", stroke: null },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("fill")),
          $$(go.TextBlock, { editable: true, font: "bold 11pt Verdana, sans-serif" },
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("angle", "angle", function(n) { return -n; }))
        ),
        Seat(1, "0.2 0", "0.5 1"),
        Seat(2, "0.5 0", "0.5 1"),
        Seat(3, "0.8 0", "0.5 1")
      ));

    this.nodeTemplateMap.add("TableC8",  // circular with 8 seats
      $$(go.Node, "Spot", tableStyle(),
        $$(go.Panel, "Spot",
          $$(go.Shape, "Circle",
            { name: "TABLESHAPE", desiredSize: new go.Size(120, 120), fill: "burlywood", stroke: null },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("fill")),
          $$(go.TextBlock, { editable: true, font: "bold 11pt Verdana, sans-serif" },
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("angle", "angle", function(n) { return -n; }))
        ),
        Seat(1, "0.50 0", "0.5 1"),
        Seat(2, "0.85 0.15", "0.15 0.85"),
        Seat(3, "1 0.5", "0 0.5"),
        Seat(4, "0.85 0.85", "0.15 0.15"),
        Seat(5, "0.50 1", "0.5 0"),
        Seat(6, "0.15 0.85", "0.85 0.15"),
        Seat(7, "0 0.5", "1 0.5"),
        Seat(8, "0.15 0.15", "0.85 0.85")
      ));
}