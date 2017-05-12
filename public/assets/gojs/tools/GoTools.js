/*
* Copyright (C) 1998-2017 by Northwoods Software Corporation
* All Rights Reserved.
*
* GoTools Class
* A GoTools is a Diagram with special rules
* Dependencies: GoToolsner-Templates-General.js, GoToolsner-Templates-Furniture.js, GoToolsner-Templates-Walls.js
*/

/*
* GoTools Constructor
* @param {HTMLDivElement|string} div A reference to a div or its ID as a string
*/
function GoTools(div) {

    /* 
    * Floor Plan Setup:
    * Initialize Floor Plan, Floor Plan Listeners, Floor Plan Overview
    */

    go.Diagram.call(this, div);
    // By default there is no filesystem / UI control for a goTools, though they can be added 
    this._goToolsFilesSystem = null;
    this._goToolsUI = null;
    
    // When a GoToolsPalette instance is made, it is automatically added to a GoTools's "palettes" field
    this._palettes = [];

    // Point Nodes, Dimension Links, Angle Nodes on the GoTools (never in model data)
    this._pointNodes = new go.Set(go.Node);
    this._dimensionLinks = new go.Set(go.Link);
    this._angleNodes = new go.Set(go.Node);

    var $$ = go.GraphObject.make;

    this.initialContentAlignment = go.Spot.Center;
    this.initialAutoScale = go.Diagram.UniformToFill;
    this.initialDocumentSpot = go.Spot.TopCenter;
    this.initialViewportSpot = go.Spot.TopCenter;
    this.allowDrop = true;
    this.allowLink = true;
    this.allowSelect = true;
    this.undoManager.isEnabled = true;
    this.layout.isOngoing = false;
    this.model = $$(go.GraphLinksModel, {
        modelData: {
            "units": "centimeters",
            "unitsAbbreviation": "cm",
            "gridSize": 10,
            "wallWidth": 5,
            "preferences": {
                showWallGuidelines: true,
                showWallLengths: true,
                showWallAngles: true,
                showOnlySmallWallAngles: true,
                showGrid: true,
                gridSnap: true
            }
        }
    });
    this.isReadOnly = false;
    this.scrollMode = go.Diagram.DocumentScroll;//go.Diagram.InfiniteScroll;
    this.resizingTool = new go.ResizingTool();
    this.resizingTool.isGridSnapEnabled = true;
    this.draggingTool = new go.DraggingTool();
    this.draggingTool.isGridSnapEnabled = true;
    this.draggingTool.gridSnapCellSpot = go.Spot.TopLeft;
    this.draggingTool.gridCellSize = this.model.modelData.gridSize;
    this.draggingTool.dragsTree = true;

    this.rotatingTool = new go.RotatingTool();
    this.rotatingTool.snapAngleEpsilon = 10;
    this.grid = $$(go.Panel, "Grid",
            { gridCellSize: new go.Size(this.model.modelData.gridSize, this.model.modelData.gridSize), visible: true },
            $$(go.Shape, "LineH", { stroke: "lightgray" }),
            $$(go.Shape, "LineV", { stroke: "lightgray" }));
    this.contextMenu = makeContextMenu(); 
    this.commandHandler.canGroupSelection = true;
    this.commandHandler.canUngroupSelection = true;
    this.commandHandler.archetypeGroupData = { isGroup: true };

    this.commandHandler.copiesTree = true;
    this.commandHandler.deletesTree = true;
 
    // When goTools model is changed, update stats in Statistics Window TODO
    this.addModelChangedListener(function (evt) {
        if (evt.isTransactionFinished) {
            // find goTools changed
            var goTools = null;
            var txn = evt.object;  // a Transaction
            if (txn !== null) {
                txn.changes.each(function (e) {
                    if (e.modelChange == "nodeDataArray") {
                        // record node insertions and removals
                      if (e.change === go.ChangedEvent.Insert) {
                        console.log(evt.propertyName + " 添加了主键为: " + e.newValue.key + " 的节点");
                      } else if (e.change === go.ChangedEvent.Remove) {
                        console.log(evt.propertyName + " 删除了主键为: " + e.oldValue.key + " 的节点");
                      }
                    }else if(e.modelChange == "linkDataArray"){
                      if (e.change === go.ChangedEvent.Insert) {
                        console.log(evt.propertyName + " 添加了连线: " + e.newValue);
                      } else if (e.change === go.ChangedEvent.Remove) {
                        console.log(evt.propertyName + " 删除了连线: " + e.oldValue);
                      }
                    }else if(e.modelChange == "linkFromKey"){
                      if (e.change === go.ChangedEvent.Property) {
                        console.log(evt.propertyName + " 修改了连线: " + e.object + " 的起点，从: " + e.oldValue.key + " 到: "+ e.newValue.key);
                      }
                    }else if(e.modelChange == "linkToKey"){
                      if (e.change === go.ChangedEvent.Property) {
                        console.log(evt.propertyName + " 修改了连线: " + e.object + " 的末端，从: " + e.oldValue.key + " 到: "+ e.newValue.key);
                      }
                    }

                    if (e.diagram instanceof GoTools) goTools = e.diagram;
                });
            }            
            if (goTools) {
                if (goTools.goToolsUI) goTools.goToolsUI.updateStatistics();
            }
        } 
    });
    
    // When goTools is modified, change document title to include a *
    this.addDiagramListener("Modified", function (e) {
        var goTools = e.diagram;
        if (goTools.goToolsFilesSystem) {
            var currentFile = document.getElementById(goTools.goToolsFilesSystem.state.currentFileId);
            if(currentFile){
                var idx = currentFile.textContent.indexOf("（未保存）");
                if (goTools.isModified) {
                    if (idx < 0) currentFile.textContent = currentFile.textContent + "（未保存）";
                }
                else {
                    if (idx >= 0) currentFile.textContent = currentFile.textContent.substr(0, idx);
                }
            }
        }
    });

    this.addDiagramListener("InitialLayoutCompleted", function(e){
        console.log("GoTools 初始化完毕");
        // pick a random node data
        var nodeDataArray = e.diagram.model.nodeDataArray;
        if(nodeDataArray.length>0){
            var data = nodeDataArray[Math.floor(Math.random()*nodeDataArray.length)];
            // find the corresponding Node
            var node = e.diagram.findNodeForData(data);
            // and center it and select it
            //e.diagram.centerRect(node.actualBounds);
            //e.diagram.select(node);
        }
    })

    // If a node has been dropped onto the GoTools from a Palette...
    this.addDiagramListener("ExternalObjectsDropped", function (e) {
        var node = e.diagram.selection.first();
        // Event 1: handle a drag / drop of a wall node from the Palette (as opposed to wall construction via WallBuildingTool)
        if (node.category === "PaletteWallNode") {
            var paletteWallNode = e.diagram.selection.first();
            var endpoints = getWallPartEndpoints(paletteWallNode);
            var data = { key: "wall", category: "WallGroup", caption: "Wall", startpoint: endpoints[0], endpoint: endpoints[1], strokeWidth: parseFloat(e.diagram.model.modelData.wallWidth), isGroup: true, notes: "" };
            e.diagram.model.addNodeData(data);
            var wall = e.diagram.findPartForKey(data.key);
            e.diagram.updateWall(wall);
            e.diagram.remove(paletteWallNode);
        }
        if (e.diagram.goToolsUI) {
            var goToolsUI = e.diagram.goToolsUI;
            // Event 3: If the select tool is not active, make it active
            if (e.diagram.toolManager.mouseDownTools.elt(0).isEnabled) goToolsUI.setBehavior('dragging', e.diagram);
        }
    });

    // When a wall is copied / pasted, update the wall geometry, angle, etc
    this.addDiagramListener("ClipboardPasted", function (e) {
        e.diagram.selection.iterator.each(function (node) { if (node.category === "WallGroup") e.diagram.updateWall(node); });
    });

    // Display different help depending on selection context
    this.addDiagramListener("ChangedSelection", function (e) {
        var goTools = e.diagram;
        goTools.skipsUndoManager = true;
        goTools.startTransaction("remove dimension links and angle nodes");
        goTools.pointNodes.iterator.each(function (node) { e.diagram.remove(node) });
        goTools.dimensionLinks.iterator.each(function (link) { e.diagram.remove(link) });

        var missedDimensionLinks = []; // used only in undo situations
        goTools.links.iterator.each(function (link) { 
            if (link.data && link.data.category == "DimensionLink") 
                missedDimensionLinks.push(link); 
        });
        for (var i = 0; i < missedDimensionLinks.length; i++) {
            e.diagram.remove(missedDimensionLinks[i]);
        }

        goTools.pointNodes.clear();
        goTools.dimensionLinks.clear();
        goTools.angleNodes.iterator.each(function (node) { e.diagram.remove(node); });
        goTools.angleNodes.clear();
        
        goTools.commitTransaction("remove dimension links and angle nodes");
        goTools.skipsUndoManager = false;
        goTools.updateWallDimensions();
        goTools.updateWallAngles();
        if (goTools.goToolsUI) {
            var goToolsUI = goTools.goToolsUI;
            var selection = goTools.selection;
            var node = goTools.selection.first(); // only used if selection.count === 1

            if (selection.count > 1) {
                var ungroupable = false;
                selection.iterator.each(function (node) { if (node.category === "WindowNode" || node.category === "DoorNode" || node.category === "WallGroup") ungroupable = true; });
            }

        }
    });

    this.addDiagramListener("SelectionMoved", function(e) {
      var node = e.diagram.findNodeForKey(0);
      if(!node) return;
      var rootX = node.location.x;
      e.diagram.selection.each(function(node) {
          //if (node.data.parent !== 0) return; // Only consider nodes connected to the root
          if(node.category=="mindmap"){
              var nodeX = node.location.x;
              console.log("1")
              if (rootX < nodeX && node.data.dir !== "right") {
                updateMindmapDirection(node, "right");
              } else if (rootX > nodeX && node.data.dir !== "left") {
                updateMindmapDirection(node, "left");
              }
              layoutMindMap(node);
            }
        });
    });

    this.brushes = {
        wood: $$(go.Brush, "Linear", { 0: "#964514", 1: "#5E2605" }),
        wall: $$(go.Brush, "Linear", { 0: "#A8A8A8", 1: "#545454" }),
        blue: $$(go.Brush, "Linear", { 0: "#42C0FB", 1: "#009ACD" }),
        metal: $$(go.Brush, "Linear", { 0: "#A8A8A8", 1: "#474747" }),
        green: $$(go.Brush, "Linear", { 0: "#9CCB19", 1: "#698B22" }),
        
        bluegrad: $$(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" }),
        greengrad: $$(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" }),
        redgrad: $$(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" }),
        yellowgrad: $$(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" }),
        lightgrad: $$(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" })
    };
    this.makeNodeTemplateMap();
    this.makeGroupTemplateMap();
    this.makeLinkTemplateMap();

    if (jQuery("#dataInspector").length>0) {
        this.dataInspector = new Inspector("dataInspector", this,{
            properties: {
              "key": { readOnly: true },
              "comments": {}
            }
        })
    }
    if (jQuery("#debugInspector").length>0) {
        this.debugInspector = new DebugInspector('debugInspector', this, {
            acceptButton: true,
            resetButton: true,
            /*
            // example predicate, only show data objects:
            inspectPredicate: function(value) {
              return !(value instanceof go.GraphObject)
            }
            */
        });
     }


    // This is the actual HTML context menu:
    this.cxElement = document.getElementById("contextMenu");

    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    var self = this;
    this.cxcommand = function(event, val) {
      if (val === undefined) val = event.currentTarget.id;
      switch (val) {
        case "cut": self.commandHandler.cutSelection(); break;
        case "copy": self.commandHandler.copySelection(); break;
        case "paste": self.commandHandler.pasteSelection(self.lastInput.documentPoint); break;
        case "delete": self.commandHandler.deleteSelection(); break;
        case "color": {
            var color = window.getComputedStyle(document.elementFromPoint(event.clientX, event.clientY).parentElement)['background-color'];
            changeColor(self, color); break;
        }
      }
      self.currentTool.stopTool();
    }
    this.cxElement.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    }, false);

    this.contextMenu = $$(go.HTMLInfo, {
        show: function(obj, diagram, tool) {
            // Show only the relevant buttons given the current state.
            var cmd = diagram.commandHandler;
            // document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
            // document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
            // document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
            // document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";
            // document.getElementById("color").style.display = (obj !== null ? "block" : "none");

            // Now show the whole context menu element
            diagram.cxElement.style.display = "block";
            // we don't bother overriding positionContextMenu, we just do it here:
            var mousePt = diagram.lastInput.viewPoint;
            diagram.cxElement.style.left = mousePt.x + "px";
            diagram.cxElement.style.top = mousePt.y + 38 + "px";
          },
        mainElement: this.cxElement
    });

    //search draggerable

    $(".tools_search").draggable({ handle: "#pushpin" });//.resizable();
    

    //diagram_ruler();

    /*
    * Install Custom Tools
    * Wall Building Tool, Wall Reshaping Tool
    * Tools are defined in their own FloorPlanner-<Tool>.js files
    */

    var wallBuildingTool = new WallBuildingTool();
    this.toolManager.mouseDownTools.insertAt(0, wallBuildingTool);

    var wallReshapingTool = new WallReshapingTool();
    this.toolManager.mouseDownTools.insertAt(3, wallReshapingTool);

    /*
    * Tool Overrides
    */

    // If a wall was dragged to intersect another wall, update angle displays
    this.toolManager.draggingTool.doMouseUp = function () {
        go.DraggingTool.prototype.doMouseUp.call(this);
        this.diagram.updateWallAngles();
        if(this.diagram.model.modelData.preferences)
            this.isGridSnapEnabled = this.diagram.model.modelData.preferences.gridSnap;
    }

    // If user holds SHIFT while dragging, do not use grid snap
    this.toolManager.draggingTool.doMouseMove = function () {
        if (this.diagram.lastInput.shift) {
            this.isGridSnapEnabled = false;
        } else {
            if(this.diagram.model.modelData.preferences)
                this.isGridSnapEnabled = this.diagram.model.modelData.preferences.gridSnap;
        }
        go.DraggingTool.prototype.doMouseMove.call(this);

        if (this.isActive) { 
            //if(this.diagram.layout instanceof go.ForceDirectedLayout)
            //    this.diagram.layout.invalidateLayout(); 
        }
    }

    // When resizing, constantly update the node info box with updated size info; constantly update Dimension Links
    this.toolManager.resizingTool.doMouseMove = function () {
        var node = this.adornedObject;
        // if node is the only thing selected, display its info as its resized
        this.diagram.updateWallDimensions();
        go.ResizingTool.prototype.doMouseMove.call(this);
    }

    // When resizing a wallPart, do not allow it to be resized past the nearest wallPart / wall endpoints
    this.toolManager.resizingTool.computeMaxSize = function () {
        var tool = this;
        var obj = tool.adornedObject.part;
        var wall = this.diagram.findPartForKey(obj.data.group);
        if ((obj.category === 'DoorNode' || obj.category === 'WindowNode') && wall !== null) {
            var stationaryPt; var movingPt;
            var resizeAdornment = null;
            obj.adornments.iterator.each(function (adorn) { if (adorn.name === "WallPartResizeAdornment") resizeAdornment = adorn; });
            resizeAdornment.elements.iterator.each(function (el) {
                if (el instanceof go.Shape && el.alignment === tool.handle.alignment) movingPt = el.getDocumentPoint(go.Spot.Center);
                if (el instanceof go.Shape && el.alignment !== tool.handle.alignment) stationaryPt = el.getDocumentPoint(go.Spot.Center);
            });
            // find the constrainingPt; that is, the endpoint (wallPart endpoint or wall endpoint) that is the one closest to movingPt but still farther from stationaryPt than movingPt
            // this loop checks all other wallPart endpoints of the wall that the resizing wallPart is a part of
            var constrainingPt; var closestDist = Number.MAX_VALUE;
            wall.memberParts.iterator.each(function (part) {
                if (part.data.key !== obj.data.key) {
                    var endpoints = getWallPartEndpoints(part);
                    for (var i = 0; i < endpoints.length; i++) {
                        var point = endpoints[i];
                        var distanceToMovingPt = Math.sqrt(point.distanceSquaredPoint(movingPt));
                        if (distanceToMovingPt < closestDist) {
                            var distanceToStationaryPt = Math.sqrt(point.distanceSquaredPoint(stationaryPt));
                            if (distanceToStationaryPt > distanceToMovingPt) {
                                closestDist = distanceToMovingPt;
                                constrainingPt = point;
                            }
                        }
                    }
                }
            });
            // if we're not constrained by a wallPart endpoint, the constraint will come from a wall endpoint; figure out which one
            if (constrainingPt === undefined || constrainingPt === null) {
                if (wall.data.startpoint.distanceSquaredPoint(movingPt) > wall.data.startpoint.distanceSquaredPoint(stationaryPt)) constrainingPt = wall.data.endpoint;
                else constrainingPt = wall.data.startpoint;
            }
            // set the new max size of the wallPart according to the constrainingPt
            var maxLength = Math.sqrt(stationaryPt.distanceSquaredPoint(constrainingPt));
            return new go.Size(maxLength, wall.data.strokeWidth);
        }
        return go.ResizingTool.prototype.computeMaxSize.call(tool);
    }

    this.toolManager.draggingTool.isGridSnapEnabled = true;

    //滚动或者缩放
    //this.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
    this.toolManager.clickCreatingTool.archetypeNodeData =  { text: "new node" };
} 

go.Diagram.inherit(GoTools, go.Diagram);

// Get/set the GoTools Filesystem instance associated with this GoTools
Object.defineProperty(GoTools.prototype, "goToolsFilesSystem", {
    get: function () { return this._goToolsFilesSystem; },
    set: function (val) {
        val instanceof GoToolsFilesSystem ? this._goToolsFilesSystem = val : this._goToolsFilesSystem = null;
    }
});

// Get/set the GoToolsUI instance associated with this GoTools
Object.defineProperty(GoTools.prototype, "goToolsUI", {
    get: function () { return this._goToolsUI; },
    set: function (val) {
        val instanceof GoToolsUI ? this._goToolsUI = val : this._goToolsUI = null;
    }
});

// Get array of all GoToolsPalettes associated with this GoTools
Object.defineProperty(GoTools.prototype, "palettes", {
    get: function () { return this._palettes; }
});

// Get / set Set of all Point Nodes in the GoTools
Object.defineProperty(GoTools.prototype, "pointNodes", {
    get: function () { return this._pointNodes; },
    set: function (val) { this._pointNodes = val; }
});

// Get / set Set of all Dimension Links in the GoTools
Object.defineProperty(GoTools.prototype, "dimensionLinks", {
    get: function () { return this._dimensionLinks; },
    set: function () { this._dimensionLinks = val; }
});

// Get / set Set of all Angle Nodes in the GoTools
Object.defineProperty(GoTools.prototype, "angleNodes", {
    get: function () { return this._angleNodes; },
    set: function () { this._angleNodes = val; }
});


// Check what units are being used, convert to cm then multiply by 2, (1px = 2cm, change this if you want to use a different paradigm)
GoTools.prototype.convertPixelsToUnits = function (num) {
    var units = this.model.modelData.units;
    if (units === 'meters') return (num / 100) * 2;
    if (units === 'feet') return (num / 30.48) * 2;
    if (units === 'inches') return (num / 2.54) * 2;
    return num * 2;
}

// Take a number of units, convert to cm, then divide by 2, (1px = 2cm, change this if you want to use a different paradigm)
GoTools.prototype.convertUnitsToPixels = function (num) {
    var units = this.model.modelData.units;
    if (units === 'meters') return (num * 100) / 2;
    if (units === 'feet') return (num * 30.48) / 2;
    if (units === 'inches') return (num * 2.54) / 2;
    return num / 2;
}

/* 
* Update the geometry, angle, and location of a given wall
* @param {Wall} wall A reference to a valid Wall Group (defined in Templates-Walls)
*/
GoTools.prototype.updateWall = function (wall) {
    var shape = wall.findObject("SHAPE");
    var geo = new go.Geometry(go.Geometry.Line);
    var sPt = wall.data.startpoint;
    var ePt = wall.data.endpoint;
    var mPt = new go.Point((sPt.x + ePt.x) / 2, (sPt.y + ePt.y) / 2);
    // define a wall's geometry as a simple horizontal line, then rotate it
    geo.startX = 0;
    geo.startY = 0;
    geo.endX = Math.sqrt(sPt.distanceSquaredPoint(ePt));
    geo.endY = 0;
    shape.geometry = geo;
    wall.location = mPt; // a wall's location is the midpoint between it's startpoint and endpoint
    var angle = sPt.directionPoint(ePt);
    wall.rotateObject.angle = angle;
    this.updateWallDimensions();
}

/* 
* Helper function for Build Dimension Link: get a to/from point for a Dimension Link
* @param {Wall} wall The Wall Group being given a Dimension Link
* @param {Number} angle The angle of "wall"
* @param {Number} wallOffset The distance the Dimension Link will be from wall (in pixels)
*/
function getAdjustedPoint(point, wall, angle, wallOffset) {
    var oldPoint = point.copy();
    point.offset(0, -(wall.data.strokeWidth * .5) - wallOffset);
    point.offset(-oldPoint.x, -oldPoint.y).rotate(angle).offset(oldPoint.x, oldPoint.y);
    return point;
}

/* 
* Helper function for Update Wall Dimensions; used to build Dimension Links
* @param {Wall} wall The wall the Link runs along (either describing the wall itself or some wallPart on "wall")
* @param {Number} index A number appended to PointNode keys; used for finding PointNodes of Dimension Links later 
* @param {Point} point1 The first point of the wallPart being described by the Link
* @param {Point} point2 The second point of the wallPart being described by the Link
* @param {Number} angle The angle of the wallPart
* @param {Number} wallOffset How far from the wall (in px) the Link should be
* @param {Boolean} soloWallFlag If this Link is the only Dimension Link for "wall" (no other wallParts on "wall" selected) this is true; else, false
* @param {GoTools} goTools A reference to a valid GoTools 
*/
function buildDimensionLink(wall, index, point1, point2, angle, wallOffset, soloWallFlag, goTools) {
    var $ = go.GraphObject.make
    
    point1 = getAdjustedPoint(point1, wall, angle, wallOffset);
    point2 = getAdjustedPoint(point2, wall, angle, wallOffset);
    var data1 = { key: wall.data.key + "PointNode" + index, category: "PointNode", loc: go.Point.stringify(point1) };
    var data2 = { key: wall.data.key + "PointNode" + (index + 1), category: "PointNode", loc: go.Point.stringify(point2) };
    var data3 = { key: wall.data.key + "DimensionLink", category: 'DimensionLink', from: data1.key, to: data2.key, stroke: 'gray', angle: angle, wall: wall.data.key, soloWallFlag: soloWallFlag };
    var pointNode1 = $$(go.Node, "Position", new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));
    var pointNode2 = $$(go.Node, "Position", new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));
    var link = $$(go.Link,
        { locationSpot: go.Spot.TopLeft },
        // link itself
        $$(go.Shape,
        { stroke: "gray", strokeWidth: 2, name: 'SHAPE' }),
        // to arrow shape
        $$(go.Shape,
        { toArrow: "OpenTriangle", stroke: "gray", strokeWidth: 2 }),
        $$(go.Shape,
        // from arrow shape
        { fromArrow: "BackwardOpenTriangle", stroke: "gray", strokeWidth: 2 }),
        // dimension link text 
        $$(go.TextBlock,
        { text: 'sometext', segmentOffset: new go.Point(0, -10), font: "13px sans-serif" },
        new go.Binding("text", "", function (link) {
            var floorplan = link.diagram;
            if (floorplan) {
                var fromPtNode = null; var toPtNode = null;
                floorplan.pointNodes.iterator.each(function (node) {
                    if (node.data.key === link.data.from) fromPtNode = node;
                    if (node.data.key === link.data.to) toPtNode = node;
                });
                if (fromPtNode !== null) {
                    var fromPt = fromPtNode.location;
                    var toPt = toPtNode.location;
                    return floorplan.convertPixelsToUnits(Math.sqrt(fromPt.distanceSquaredPoint(toPt))).toFixed(2) + floorplan.model.modelData.unitsAbbreviation;
                } return null;
            } return null;
        }).ofObject(),
        // bind angle of textblock to angle of link -- always make text rightside up and readable
        new go.Binding("angle", "angle", function (angle, link) {
            if (angle > 90 && angle < 270) return (angle + 180) % 360;
            return angle;
        }),
        // default poisiton text above / below dimension link based on angle
        new go.Binding("segmentOffset", "angle", function (angle, textblock) {
            var floorplan = textblock.part.diagram;
            if (floorplan) {
                var wall = floorplan.findPartForKey(textblock.part.data.wall);
                if (wall.rotateObject.angle > 135 && wall.rotateObject.angle < 315) return new go.Point(0, 10);
                return new go.Point(0, -10);
            } return new go.Point(0,0);
        }).ofObject(),
        // scale font size according to the length of the link
        new go.Binding("font", "", function (link) {
            var floorplan = link.diagram;
            var fromPtNode = null; var toPtNode = null;
            floorplan.pointNodes.iterator.each(function (node) {
                if (node.data.key === link.data.from) fromPtNode = node;
                if (node.data.key === link.data.to) toPtNode = node;
            });
            if (fromPtNode !== null) {
                var fromPt = fromPtNode.location;
                var toPt = toPtNode.location;
                var distance = Math.sqrt(fromPt.distanceSquaredPoint(toPt));
                if (distance > 40) return "13px sans-serif";
                if (distance <= 40 && distance >= 20) return "11px sans-serif";
                else return "9px sans-serif";
            } return "13px sans-serif";
        }).ofObject()
        )
    );

    goTools.pointNodes.add(pointNode1);
    goTools.pointNodes.add(pointNode2);
    goTools.dimensionLinks.add(link);
    goTools.add(pointNode1);
    goTools.add(pointNode2);
    goTools.add(link);

    pointNode1.data = data1;
    pointNode2.data = data2;
    link.data = data3;
    link.fromNode = pointNode1;
    link.toNode = pointNode2;
}

/* 
* Update Dimension Links shown along a wall, based on which wallParts are selected
*/
GoTools.prototype.updateWallDimensions = function () {
    var goTools = this;
    goTools.skipsUndoManager = true;
    goTools.startTransaction("update wall dimensions");
    // if showWallLengths === false, remove all pointNodes (used to build wall dimensions)
    if (goTools.model.modelData.preferences && !goTools.model.modelData.preferences.showWallLengths) {
        goTools.pointNodes.iterator.each(function (node) { goTools.remove(node); });
        goTools.dimensionLinks.iterator.each(function (link) { goTools.remove(link); });
        goTools.pointNodes.clear();
        goTools.dimensionLinks.clear();
        goTools.commitTransaction("update wall dimensions");
        goTools.skipsUndoManager = false;
        return;
    }
    // make visible all dimension links (zero-length dimension links are set to invisible at the end of the function) 
    goTools.dimensionLinks.iterator.each(function (link) { link.visible = true; });

    var selection = goTools.selection;
    // gather all selected walls, including walls of selected DoorNodes and WindowNodes
    var walls = new go.Set(go.Group);
    selection.iterator.each(function (part) {
        if ((part.category === 'WindowNode' || part.category === 'DoorNode') && part.containingGroup !== null) walls.add(part.containingGroup);
        if (part.category === 'WallGroup' && part.data !== null) {
            var soloWallLink = null;
            goTools.dimensionLinks.iterator.each(function (link) { if (link.data.soloWallFlag && link.data.wall === part.data.key) soloWallLink = link; });
            // if there's 1 Dimension Link for this wall (link has soloWallFlag), adjust to/from pointNodes of link, rather than deleting / redrawing
            if (soloWallLink !== null) {
                // since this is the only Dimension Link for this wall, keys of its pointNodes will be (wall.data.key) + 1 / (wall.data.key) + 2
                var linkPoint1 = null; var linkPoint2 = null;
                goTools.pointNodes.iterator.each(function (node) {
                    if (node.data.key === part.data.key + "PointNode1") linkPoint1 = node;
                    if (node.data.key === part.data.key + "PointNode2") linkPoint2 = node;
                });

                var startpoint = part.data.startpoint; var endpoint = part.data.endpoint;
                // adjust  left/top-most / right/bottom-most wall endpoints so link angle is correct (else text appears on wrong side of Link)
                var firstWallPt = ((startpoint.x + startpoint.y) <= (endpoint.x + endpoint.y)) ? startpoint : endpoint;
                var lastWallPt = ((startpoint.x + startpoint.y) > (endpoint.x + endpoint.y)) ? startpoint : endpoint;
                var newLoc1 = getAdjustedPoint(firstWallPt.copy(), part, part.rotateObject.angle, 10);
                var newLoc2 = getAdjustedPoint(lastWallPt.copy(), part, part.rotateObject.angle, 10);
                linkPoint1.data.loc = go.Point.stringify(newLoc1);
                linkPoint2.data.loc = go.Point.stringify(newLoc2);
                soloWallLink.data.angle = part.rotateObject.angle;
                linkPoint1.updateTargetBindings();
                linkPoint2.updateTargetBindings();
                soloWallLink.updateTargetBindings();
            }
                // else build a Dimension Link for this wall; this is removed / replaced if Dimension Links for wallParts this wall are built
            else {
                var startpoint = part.data.startpoint;
                var endpoint = part.data.endpoint;
                var firstWallPt = ((startpoint.x + startpoint.y) <= (endpoint.x + endpoint.y)) ? startpoint : endpoint;
                var lastWallPt = ((startpoint.x + startpoint.y) > (endpoint.x + endpoint.y)) ? startpoint : endpoint;
                buildDimensionLink(part, 1, firstWallPt.copy(), lastWallPt.copy(), part.rotateObject.angle, 10, true, goTools);
            }
        }
    });
    // create array of selected wall endpoints and selected wallPart endpoints along the wall that represent measured stretches
    walls.iterator.each(function (wall) {
        var startpoint = wall.data.startpoint;
        var endpoint = wall.data.endpoint;
        var firstWallPt = ((startpoint.x + startpoint.y) <= (endpoint.x + endpoint.y)) ? startpoint : endpoint;
        var lastWallPt = ((startpoint.x + startpoint.y) > (endpoint.x + endpoint.y)) ? startpoint : endpoint;

        // store all endpoints along with the part they correspond to (used later to either create DimensionLinks or simply adjust them)
        var wallPartEndpoints = [];
        wall.memberParts.iterator.each(function (wallPart) {
            if (wallPart.isSelected) {
                var endpoints = getWallPartEndpoints(wallPart);
                wallPartEndpoints.push(endpoints[0]);
                wallPartEndpoints.push(endpoints[1]);
            }
        });
        // sort all wallPartEndpoints by x coordinate left to right/ up to down
        wallPartEndpoints.sort(function (a, b) {
            if ((a.x + a.y) > (b.x + b.y)) return 1;
            if ((a.x + a.y) < (b.x + b.y)) return -1;
            else return 0;
        });
        wallPartEndpoints.unshift(firstWallPt);
        wallPartEndpoints.push(lastWallPt);

        var angle = wall.rotateObject.angle;
        var k = 1; // k is a counter for the indices of PointNodes
        // build / edit dimension links for each stretch, defined by pairs of points in wallPartEndpoints
        for (var j = 0; j < wallPartEndpoints.length - 1; j++) {
            var linkPoint1 = null; linkPoint2 = null;
            goTools.pointNodes.iterator.each(function (node) {
                if (node.data.key === wall.data.key + "PointNode" + k) linkPoint1 = node;
                if (node.data.key === wall.data.key + "PointNode" + (k + 1)) linkPoint2 = node;
            });
            if (linkPoint1 !== null) {
                var newLoc1 = getAdjustedPoint(wallPartEndpoints[j].copy(), wall, angle, 5);
                var newLoc2 = getAdjustedPoint(wallPartEndpoints[j + 1].copy(), wall, angle, 5);
                linkPoint1.data.loc = go.Point.stringify(newLoc1);
                linkPoint2.data.loc = go.Point.stringify(newLoc2);
                linkPoint1.updateTargetBindings();
                linkPoint2.updateTargetBindings();
            }
                // only build new links if needed -- normally simply change pointNode locations
            else buildDimensionLink(wall, k, wallPartEndpoints[j].copy(), wallPartEndpoints[j + 1].copy(), angle, 5, false, goTools);
            k += 2;
        }
        // total wall Dimension Link would be constructed of a kth and k+1st pointNode
        var totalWallDimensionLink = null;
        goTools.dimensionLinks.iterator.each(function (link) {
            if ((link.fromNode.data.key === wall.data.key + "PointNode" + k) &&
                (link.toNode.data.key === wall.data.key + "PointNode" + (k + 1))) totalWallDimensionLink = link;
        });
        // if a total wall Dimension Link already exists, adjust its constituent point nodes
        if (totalWallDimensionLink !== null) {
            var linkPoint1 = null; var linkPoint2 = null;
            goTools.pointNodes.iterator.each(function (node) {
                if (node.data.key === wall.data.key + "PointNode" + k) linkPoint1 = node;
                if (node.data.key === wall.data.key + "PointNode" + (k + 1)) linkPoint2 = node;
            });
            var newLoc1 = getAdjustedPoint(wallPartEndpoints[0].copy(), wall, angle, 25);
            var newLoc2 = getAdjustedPoint(wallPartEndpoints[wallPartEndpoints.length - 1].copy(), wall, angle, 25);
            linkPoint1.data.loc = go.Point.stringify(newLoc1);
            linkPoint2.data.loc = go.Point.stringify(newLoc2);
            linkPoint1.updateTargetBindings();
            linkPoint2.updateTargetBindings();
        }
            // only build total wall Dimension Link (far out from wall to accomodate wallPart Dimension Links) if one does not already exist
        else buildDimensionLink(wall, k, wallPartEndpoints[0].copy(), wallPartEndpoints[wallPartEndpoints.length - 1].copy(), angle, 25, false, goTools);
    });

    // Cleanup: hide zero-length Dimension Links, DimensionLInks with null wall points
    goTools.dimensionLinks.iterator.each(function (link) {     
        var canStay = false;
        goTools.pointNodes.iterator.each(function (node) {
            if (node.data.key == link.data.to) canStay = true;
        });
        if (!canStay) goTools.remove(link);
        else {
            var length = Math.sqrt(link.toNode.location.distanceSquaredPoint(link.fromNode.location));
            if (length < 1 && !link.data.soloWallFlag) link.visible = false;
        }
    });

    goTools.commitTransaction("update wall dimensions");
    goTools.skipsUndoManager = false;
}

/*
* Helper function for updateWallAngles(); returns the Point where two walls intersect; if they do not intersect, return null
* @param {Wall} wall1 
* @param {Wall} wall2
*/
var getWallsIntersection = function (wall1, wall2) {
    if (wall1 === null || wall2 === null) return null;
    // treat walls as lines; get lines in formula of ax + by = c
    var a1 = wall1.data.endpoint.y - wall1.data.startpoint.y;
    var b1 = wall1.data.startpoint.x - wall1.data.endpoint.x;
    var c1 = (a1 * wall1.data.startpoint.x) + (b1 * wall1.data.startpoint.y);
    var a2 = wall2.data.endpoint.y - wall2.data.startpoint.y;
    var b2 = wall2.data.startpoint.x - wall2.data.endpoint.x;
    var c2 = (a2 * wall2.data.startpoint.x) + (b2 * wall2.data.startpoint.y);
    // Solve the system of equations, finding where the lines (not segments) would intersect
    /** Algebra Explanation:
        Line 1: a1x + b1y = c1
        Line 2: a2x + b2y = c2

        Multiply Line1 equation by b2, Line2 equation by b1, get:
        a1b1x + b1b2y = b2c1
        a2b1x + b1b2y = b1c2

        Subtract bottom from top:
        a1b2x - a2b1x = b2c1 - b1c2

        Divide both sides by a1b2 - a2b1, get equation for x. Equation for y is analogous
    **/
    var det = a1 * b2 - a2 * b1;
    var x = null; var y = null;
    // Edge Case: Lines are paralell
    if (det === 0) {
        // Edge Case: wall1 and wall2 have an endpoint to endpoint intersection (the only instance in which paralell walls could intersect at a specific point)
        if (wall1.data.startpoint.equals(wall2.data.startpoint) || wall1.data.startpoint.equals(wall2.data.endpoint)) return wall1.data.startpoint;
        if (wall1.data.endpoint.equals(wall2.data.startpoint) || wall1.data.endpoint.equals(wall2.data.endpoint)) return wall1.data.endpoint;
        return null;
    }
    else {
        x = (b2 * c1 - b1 * c2) / det;
        y = (a1 * c2 - a2 * c1) / det;
    }
    // ensure proposed intersection is contained in both line segments (walls)
    var inWall1 = ((Math.min(wall1.data.startpoint.x, wall1.data.endpoint.x) <= x) && (Math.max(wall1.data.startpoint.x, wall1.data.endpoint.x) >= x)
        && (Math.min(wall1.data.startpoint.y, wall1.data.endpoint.y) <= y) && (Math.max(wall1.data.startpoint.y, wall1.data.endpoint.y) >= y));
    var inWall2 = ((Math.min(wall2.data.startpoint.x, wall2.data.endpoint.x) <= x) && (Math.max(wall2.data.startpoint.x, wall2.data.endpoint.x) >= x)
        && (Math.min(wall2.data.startpoint.y, wall2.data.endpoint.y) <= y) && (Math.max(wall2.data.startpoint.y, wall2.data.endpoint.y) >= y));
    if (inWall1 && inWall2) return new go.Point(x, y);
    else return null;
}

/* 
* Update Angle Nodes shown along a wall, based on which wall(s) is/are selected
*/
GoTools.prototype.updateWallAngles = function () {
    var goTools = this;
    goTools.skipsUndoManager = true; // do not store displaying angles as a transaction
    goTools.startTransaction("display angles");
    if (goTools.model.modelData.preferences && goTools.model.modelData.preferences.showWallAngles) {
        goTools.angleNodes.iterator.each(function (node) { node.visible = true; });
        var selectedWalls = [];
        goTools.selection.iterator.each(function (part) { if (part.category === "WallGroup") selectedWalls.push(part); });
        for (var i = 0; i < selectedWalls.length; i++) {
            var seen = new go.Set("string"); // Set of all walls "seen" thus far for "wall"
            var wall = selectedWalls[i];
            var possibleWalls = goTools.findNodesByExample({ category: "WallGroup" });

            // go through all other walls; if the other wall intersects this wall, make angles
            possibleWalls.iterator.each(function (otherWall) {
                if (otherWall.data === null || wall.data === null || seen.contains(otherWall.data.key)) return;
                if ((otherWall.data.key !== wall.data.key) && (getWallsIntersection(wall, otherWall) !== null) && (!seen.contains(otherWall.data.key))) {

                    seen.add(otherWall.data.key);
                    // "otherWall" intersects "wall"; make or update angle nodes
                    var intersectionPoint = getWallsIntersection(wall, otherWall);
                    var wallsInvolved = goTools.findObjectsNear(intersectionPoint,
                        1,
                        function (x) { if (x.part !== null) return x.part; },
                        function (p) { return p.category === "WallGroup"; },
                        false);

                    var endpoints = []; // store endpoints and their corresponding walls here
                    // gather endpoints of each wall in wallsInvolved; discard endpoints within a tolerance distance of intersectionPoint
                    wallsInvolved.iterator.each(function (w) {
                        var tolerance = (goTools.model.modelData.gridSize >= 10) ? goTools.model.modelData.gridSize : 10;
                        if (Math.sqrt(w.data.startpoint.distanceSquaredPoint(intersectionPoint)) > tolerance) endpoints.push({ point: w.data.startpoint, wall: w.data.key });
                        if (Math.sqrt(w.data.endpoint.distanceSquaredPoint(intersectionPoint)) > tolerance) endpoints.push({ point: w.data.endpoint, wall: w.data.key });
                    });

                    // find maxRadius (shortest distance from an involved wall's endpoint to intersectionPoint or 30, whichever is smaller)
                    var maxRadius = 30;
                    for (var i = 0; i < endpoints.length; i++) {
                        var distance = Math.sqrt(endpoints[i].point.distanceSquaredPoint(intersectionPoint));
                        if (distance < maxRadius) maxRadius = distance;
                    }

                    // sort endpoints in a clockwise fashion around the intersectionPoint
                    endpoints.sort(function (a, b) {
                        a = a.point; b = b.point;
                        if (a.x - intersectionPoint.x >= 0 && b.x - intersectionPoint.x < 0) return true;
                        if (a.x - intersectionPoint.x < 0 && b.x - intersectionPoint.x >= 0) return false;
                        if (a.x - intersectionPoint.x == 0 && b.x - intersectionPoint.x == 0) {
                            if (a.y - intersectionPoint.y >= 0 || b.y - intersectionPoint.y >= 0) return a.y > b.y;
                            return b.y > a.y;
                        }

                        // compute the cross product of vectors (center -> a) x (center -> b)
                        var det = (a.x - intersectionPoint.x) * (b.y - intersectionPoint.y) - (b.x - intersectionPoint.x) * (a.y - intersectionPoint.y);
                        if (det < 0) return true;
                        if (det > 0) return false;

                        // points a and b are on the same line from the center; check which point is closer to the center
                        var d1 = (a.x - intersectionPoint.x) * (a.x - intersectionPoint.x) + (a.y - intersectionPoint.y) * (a.y - intersectionPoint.y);
                        var d2 = (b.x - intersectionPoint.x) * (b.x - intersectionPoint.x) + (b.y - intersectionPoint.y) * (b.y - intersectionPoint.y);
                        return d1 > d2;
                    }); // end endpoints sort

                    // for each pair of endpoints, construct or modify an angleNode 
                    for (var i = 0; i < endpoints.length; i++) {
                        var p1 = endpoints[i];
                        if (endpoints[i + 1] != null) var p2 = endpoints[i + 1];
                        else var p2 = endpoints[0];
                        var a1 = intersectionPoint.directionPoint(p1.point);
                        var a2 = intersectionPoint.directionPoint(p2.point);
                        var sweep = Math.abs(a2 - a1 + 360) % 360;
                        var angle = a1;

                        /*
                            construct proper key for angleNode
                            proper angleNode key syntax is "wallWwallX...wallYangleNodeZ" such that W < Y < Y; angleNodes are sorted clockwise around the intersectionPoint by Z
                        */
                        var keyArray = []; // used to construct proper key
                        wallsInvolved.iterator.each(function (wall) { keyArray.push(wall); });
                        keyArray.sort(function (a, b) {
                            var aIndex = a.data.key.match(/\d+/g);
                            var bIndex = b.data.key.match(/\d+/g);
                            if (isNaN(aIndex)) return true;
                            if (isNaN(bIndex)) return false;
                            else return aIndex > bIndex;
                        });

                        var key = "";
                        for (var j = 0; j < keyArray.length; j++) key += keyArray[j].data.key;
                        key += "angle" + i;

                        // check if this angleNode already exists -- if it does, adjust data (instead of deleting/redrawing)
                        var angleNode = null;
                        goTools.angleNodes.iterator.each(function (aNode) { if (aNode.data.key === key) angleNode = aNode; });
                        if (angleNode !== null) {
                            angleNode.data.angle = angle;
                            angleNode.data.sweep = sweep;
                            angleNode.data.loc = go.Point.stringify(intersectionPoint);
                            angleNode.data.maxRadius = maxRadius;
                            angleNode.updateTargetBindings();
                        }
                            // if this angleNode does not already exist, create it and add it to the diagram 
                        else {
                            var data = { key: key, category: "AngleNode", loc: go.Point.stringify(intersectionPoint), stroke: "dodgerblue", angle: angle, sweep: sweep, maxRadius: maxRadius };
                            var newAngleNode = $$(go.Node, "Spot",
                                { locationSpot: go.Spot.Center, locationObjectName: "SHAPE", selectionAdorned: false },
                                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                    $$(go.Shape, "Circle", // placed where walls intersect, is invisible
                                    { name: "SHAPE", fill: "red", height: 0, width: 0 }),
                                    $$(go.Shape, // arc
                                    { stroke: "green", strokeWidth: 1.5, fill: null }, 
                                    new go.Binding("geometry", "", function(node) {
                                        var ang = node.data.angle;
                                        var sweep = node.data.sweep;
                                        var rad = Math.min(30, node.data.maxRadius);
                                        if (typeof sweep === "number" && sweep > 0) {
                                            var start = new go.Point(rad, 0).rotate(ang);
                                            // this is much more efficient than calling go.GraphObject.make:
                                            return new go.Geometry()
                                                  .add(new go.PathFigure(start.x + rad, start.y + rad)  // start point
                                                       .add(new go.PathSegment(go.PathSegment.Arc,
                                                                               ang, sweep,  // angles
                                                                               rad, rad,  // center
                                                                               rad, rad)  // radius
                                                            ))
                                                  .add(new go.PathFigure(0, 0))
                                                  .add(new go.PathFigure(2 * rad, 2 * rad));
                                        } else {  // make sure this arc always occupies the same circular area of RAD radius
                                            return new go.Geometry()
                                                  .add(new go.PathFigure(0, 0))
                                                  .add(new go.PathFigure(2 * rad, 2 * rad));
                                        }
                                    }).ofObject(),
                                    new go.Binding("stroke", "sweep", function (sweep) {
                                        return (sweep % 45 < 1 || sweep % 45 > 44) ? "dodgerblue" : "lightblue";
                                    })),
                                    // Arc label panel
                                    $$(go.Panel, "Auto",
                                    { name: "ARCLABEL" },
                                    // position the label in the center of the arc
                                    new go.Binding("alignment", "sweep", function (sweep, panel) {
                                        var rad = Math.min(30, panel.part.data.maxRadius);
                                        var angle = panel.part.data.angle;
                                        var cntr = new go.Point(rad, 0).rotate(angle + sweep / 2);
                                        return new go.Spot(0.5, 0.5, cntr.x, cntr.y);
                                    }),
                                        // rectangle containing angle text
                                        $$(go.Shape,
                                        { stroke: "black", fill: "white" },
                                        new go.Binding("stroke", "sweep", function (sweep) {
                                            return (sweep % 45 < 1 || sweep % 45 > 44) ? "dodgerblue" : "lightblue";
                                        })),
                                        // angle text
                                        $$(go.TextBlock,
                                        { font: "7pt sans-serif", margin: new go.Margin(2, 2, 2, 2) },
                                        new go.Binding("text", "sweep", function (sweep) {
                                            return sweep.toFixed(2) + String.fromCharCode(176);
                                        }),
                                        new go.Binding("stroke", "color"))
                                    )
                                );
                            newAngleNode.data = data;
                            goTools.add(newAngleNode);
                            newAngleNode.updateTargetBindings();
                            goTools.angleNodes.add(newAngleNode);
                        }
                    }
                }
            });
        }
        // garbage collection (angleNodes that should not exist any more)
        var garbage = [];
        goTools.angleNodes.iterator.each(function (node) {
            var keyNums = node.data.key.match(/\d+/g); // values X for all wall keys involved, given key "wallX"
            var numWalls = (node.data.key.match(/wall/g) || []).length; // # of walls involved in in "node"'s construction
            var wallsInvolved = [];
            // add all walls involved in angleNode's construction to wallsInvolved
            for (var i = 0; i < keyNums.length - 1; i++) wallsInvolved.push("wall" + keyNums[i]);
            // edge case: if the numWalls != keyNums.length, that means the wall with key "wall" (no number in key) is involved
            if (numWalls !== keyNums.length - 1) wallsInvolved.push("wall");

            // Case 1: if any wall pairs involved in this angleNode are no longer intersecting, add this angleNode to "garbage"
            for (var i = 0; i < wallsInvolved.length - 1; i++) {
                var wall1 = goTools.findPartForKey(wallsInvolved[i]);
                var wall2 = goTools.findPartForKey(wallsInvolved[i + 1]);
                var intersectionPoint = getWallsIntersection(wall1, wall2);
                if (intersectionPoint === null) garbage.push(node);
            }
            // Case 2: if there are angleNode clusters with the same walls in their keys as "node" but different locations, destroy and rebuild
            // collect all angleNodes with same walls in their construction as "node"
            var possibleAngleNodes = new go.Set(go.Node);
            var allWalls = node.data.key.slice(0, node.data.key.indexOf("angle"));
            goTools.angleNodes.iterator.each(function (other) { if (other.data.key.includes(allWalls)) possibleAngleNodes.add(other); });
            possibleAngleNodes.iterator.each(function (pNode) {
                if (pNode.data.loc !== node.data.loc) {
                    garbage.push(pNode);
                }
            });

            // Case 3: put any angleNodes with sweep === 0 in garbage
            if (node.data.sweep === 0) garbage.push(node);
        });

        for (var i = 0; i < garbage.length; i++) {
            goTools.remove(garbage[i]); // remove garbage
            goTools.angleNodes.remove(garbage[i]);
        }
    }
    // hide all angles > 180 if show only small angles == true in preferences
    if (goTools.model.modelData.preferences && goTools.model.modelData.preferences.showOnlySmallWallAngles) {
        goTools.angleNodes.iterator.each(function (node) { if (node.data.sweep >= 180) node.visible = false; });
    }
    // hide all angles if show wall angles == false in preferences
    if (goTools.model.modelData.preferences && !goTools.model.modelData.preferences.showWallAngles) {
        goTools.angleNodes.iterator.each(function (node) { node.visible = false; });
    }
    goTools.commitTransaction("display angles");
    goTools.skipsUndoManager = false;
}