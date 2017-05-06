GoTools.prototype.makeGroupTemplateMap = function(){
	var $$ = go.GraphObject.make;
    /*
    * Group Templates
    * Add Default Group, Wall Group to Group Template Map
    * Template functions defined in FloorPlanner-Templates-* js files
    */

    this.groupTemplateMap.add("FloorPlannerDefault", 
    	$$(go.Group, "Vertical",
	        {
	            contextMenu: makeContextMenu(),
	            doubleClick: function (e) {
	                if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow");
	            },
	            toolTip: $$(go.Adornment, "Auto",
	                $$(go.Shape, { fill: "#FFFFCC" }),
	                $$(go.TextBlock, { margin: 4 },
	                new go.Binding("text", "", function (text, obj) {
	                    var data = obj.part.adornedObject.data;
	                    var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
	                    return "Name: " + name + "\nNotes: " + data.notes + '\nMembers: ' + obj.part.adornedObject.memberParts.count;
	                }).ofObject())
	            )
	        },
	        new go.Binding("location", "loc"),
	          $$(go.Panel, "Auto",
	            $$(go.Shape, "RoundedRectangle", { fill: "rgba(128,128,128,0.15)", stroke: 'rgba(128, 128, 128, .05)', name: 'SHAPE', strokeCap: 'square' },
	              new go.Binding("fill", "isSelected", function (s, obj) {
	                  return s ? "rgba(128, 128, 128, .15)" : "rgba(128, 128, 128, 0.10)";
	              }).ofObject()
	              ),
	            $$(go.Placeholder, { padding: 5 })  // extra padding around group members
	          )
	        )); // Default Group

    function findClosestLocOnWall(wall, part) {
	    var orderedConstrainingPts = []; // wall endpoints and wallPart endpoints
	    var startpoint = wall.data.startpoint.copy();
	    var endpoint = wall.data.endpoint.copy();
	    // store all possible constraining endpoints (wall endpoints and wallPart endpoints) in the order in which they appear (left/top to right/bottom)
	    var firstWallPt = ((startpoint.x + startpoint.y) <= (endpoint.x + endpoint.y)) ? startpoint : endpoint;
	    var lastWallPt = ((startpoint.x + startpoint.y) > (endpoint.x + endpoint.y)) ? startpoint : endpoint;
	    var wallPartEndpoints = [];
	    wall.memberParts.iterator.each(function (wallPart) {
	        var endpoints = getWallPartEndpoints(wallPart);
	        wallPartEndpoints.push(endpoints[0]);
	        wallPartEndpoints.push(endpoints[1]);
	    });
	    // sort all wallPartEndpoints by x coordinate left to right
	    wallPartEndpoints.sort(function (a, b) {
	        if ((a.x + a.y) > (b.x + b.y)) return 1;
	        if ((a.x + a.y) < (b.x + b.y)) return -1;
	        else return 0;
	    });
	    orderedConstrainingPts.push(firstWallPt);
	    orderedConstrainingPts = orderedConstrainingPts.concat(wallPartEndpoints);
	    orderedConstrainingPts.push(lastWallPt);

	    // go through all constraining points; if there's a free stretch along the wall "part" could fit in, remember it
	    var possibleStretches = [];
	    for (var i = 0; i < orderedConstrainingPts.length; i += 2) {
	        var point1 = orderedConstrainingPts[i];
	        var point2 = orderedConstrainingPts[i + 1];
	        var distanceBetween = Math.sqrt(point1.distanceSquaredPoint(point2));
	        if (distanceBetween >= part.data.width) possibleStretches.push({ pt1: point1, pt2: point2 });
	    }

	    // go through all possible stretches along the wall the part *could* fit in; find the one closest to the part's current location
	    var closestDist = Number.MAX_VALUE; var closestStretch = null;
	    for (var i = 0; i < possibleStretches.length; i++) {
	        var testStretch = possibleStretches[i];
	        var testPoint1 = testStretch.pt1;
	        var testPoint2 = testStretch.pt2;
	        var testDistance1 = Math.sqrt(testPoint1.distanceSquaredPoint(part.location));
	        var testDistance2 = Math.sqrt(testPoint2.distanceSquaredPoint(part.location));
	        if (testDistance1 < closestDist) {
	            closestDist = testDistance1;
	            closestStretch = testStretch;
	        }
	        if (testDistance2 < closestDist) {
	            closestDist = testDistance2;
	            closestStretch = testStretch;
	        }
	    }

	    // Edge Case: If there's no space for the wallPart, return null
	    if (closestStretch === null) return null;

	    // using the closest free stretch along the wall, calculate endpoints that make the stretch's line segment, then project part.location onto the segment
	    var closestStretchLength = Math.sqrt(closestStretch.pt1.distanceSquaredPoint(closestStretch.pt2));
	    var offset = part.data.width / 2;
	    var point1 = new go.Point(closestStretch.pt1.x + ((offset / closestStretchLength) * (closestStretch.pt2.x - closestStretch.pt1.x)),
	        closestStretch.pt1.y + ((offset / closestStretchLength) * (closestStretch.pt2.y - closestStretch.pt1.y)));
	    var point2 = new go.Point(closestStretch.pt2.x + ((offset / closestStretchLength) * (closestStretch.pt1.x - closestStretch.pt2.x)),
	    closestStretch.pt2.y + ((offset / closestStretchLength) * (closestStretch.pt1.y - closestStretch.pt2.y)));
	    var newLoc = part.location.copy().projectOntoLineSegmentPoint(point1, point2);
	    return newLoc;
	}
	
    this.groupTemplateMap.add("WallGroup", $$(go.Group, "Spot",{
            contextMenu: makeContextMenu(),
            toolTip: $$(go.Adornment, "Auto",
                $$(go.Shape, { fill: "#FFFFCC" }),
                $$(go.TextBlock, { margin: 4 },
                new go.Binding("text", "", function (text, obj) {
                    var data = obj.part.adornedObject.data;
                    var name = (obj.part.adornedObject.category === "MultiPurposeNode") ? data.text : data.caption;
                    return "Name: " + name + "\nNotes: " + data.notes + '\nMembers: ' + obj.part.adornedObject.memberParts.count;
                }).ofObject())
            ),
            selectionObjectName: "SHAPE",
            rotateObjectName: "SHAPE",
            locationSpot: go.Spot.Center,
            reshapable: true,
            minSize: new go.Size(1, 1),
            dragComputation: function (part, pt, gridPt) {
			    var floorplan = part.diagram;
			    floorplan.updateWallDimensions();
			    floorplan.updateWallAngles();
			    var grid = part.diagram.grid;
			    var sPt = part.data.startpoint.copy();
			    var ePt = part.data.endpoint.copy();
			    var dx = pt.x - part.location.x;
			    var dy = pt.y - part.location.y;
			    var newSpt = sPt.offset(dx, dy);
			    var newEpt = ePt.offset(dx, dy);
			    if (floorplan.toolManager.draggingTool.isGridSnapEnabled) {
			        newSpt = newSpt.snapToGridPoint(grid.gridOrigin, grid.gridCellSize);
			        newEpt = newEpt.snapToGridPoint(grid.gridOrigin, grid.gridCellSize);
			    }
			    floorplan.model.setDataProperty(part.data, "startpoint", newSpt);
			    floorplan.model.setDataProperty(part.data, "endpoint", newEpt);
			    return new go.Point((newSpt.x + newEpt.x) / 2, (newSpt.y + newEpt.y) / 2);
			},
            selectionAdorned: false,
            mouseDrop: function (e, wall) {
			    var floorplan = e.diagram;
			    var wallPart = floorplan.selection.first();
			    if ((wallPart && (wallPart.category === "WindowNode" || wallPart.category === "DoorNode") && wallPart.containingGroup === null)) {
			        var newLoc = findClosestLocOnWall(wall, wallPart);
			        if (newLoc !== null) {
			            wall.findObject("SHAPE").stroke = "black";
			            floorplan.model.setDataProperty(wallPart.data, "group", wall.data.key);
			            wallPart.location = newLoc.projectOntoLineSegmentPoint(wall.data.startpoint, wall.data.endpoint);
			            wallPart.angle = wall.rotateObject.angle;
			            if (wallPart.category === "WindowNode") floorplan.model.setDataProperty(wallPart.data, "height", wall.data.strokeWidth);
			            if (wallPart.category === "DoorNode") floorplan.model.setDataProperty(wallPart.data, "doorOpeningHeight", wall.data.strokeWidth);
			        } else {
			            floorplan.remove(wallPart);
			            alert("There's not enough room on the wall!");
			            return;
			        }
			    }
			    if (floorplan.floorplanUI) floorplan.floorplanUI.setSelectionInfo(floorplan.selection.first(), floorplan);
			    floorplan.updateWallDimensions();
			},
            mouseDragEnter: function (e, wall) {
			    var floorplan = e.diagram;
			    var parts = floorplan.toolManager.draggingTool.draggingParts;
			    parts.iterator.each(function (part) {
			        if ((part.category === "WindowNode" || part.category === "DoorNode") && part.containingGroup === null) {
			            wall.findObject("SHAPE").stroke = "lightblue";
			            part.angle = wall.rotateObject.angle;
			        }
			    });
			},
            mouseDragLeave: function(e, wall) {
			    var floorplan = e.diagram;
			    wall.findObject("SHAPE").stroke = "black";
			    var parts = floorplan.toolManager.draggingTool.draggingParts;
			    parts.iterator.each(function (part) {
			        if ((part.category === "WindowNode" || part.category === "DoorNode") && part.containingGroup === null) part.angle = 0
			    });
			},
            doubleClick: function (e) { if (e.diagram.floorplanUI) e.diagram.floorplanUI.hideShow("selectionInfoWindow"); }
        },
        $$(go.Shape,
        {
            strokeWidth: 1,
            name: "SHAPE",
            fill: "black",
            stroke: "red",
            geometry: new go.Geometry(go.Geometry.Line),
            isGeometryPositioned: true
        },
        new go.Binding("strokeWidth", "strokeWidth"),
        new go.Binding("stroke", "isSelected", function (s, obj) {
            if (obj.part.containingGroup != null) {
                var group = obj.part.containingGroup;
                if (s) { group.data.isSelected = true; }
            }
            return s ? "dodgerblue" : "black";
        }).ofObject()
      ))); // Wall Group
}