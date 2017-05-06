/*
* Copyright (C) 1998-2017 by Northwoods Software Corporation
* All Rights Reserved.
*
* FLOOR PLANN UI CLASS
* Handle GUI manipulation (showing/changing data, populating windows, etc) for GoToolsner.html  
*/

/*
* GoTools UI Constructor
* @param {GoTools} goTools A reference to a valid instance of GoTools
* @param {String} name The name of this GoToolsUI instance known to the DOM 
* @param {String} The name of this UI's goTools known to the DOM
* @param {Object} state A JSON object with string ids for UI HTML elements. Format is as follows:
	menuButtons: {
		selectionInfoWindowButtonId:
		palettesWindowButtonId:
		overviewWindowButtonId:
		optionsWindowButtonId:
		statisticsWindowButtonId:
	}
	windows: {
		diagramHelpDiv: {
			id:
		}
		selectionInfoWindow: {
			id:
			textDivId:
			handleId:
			colorPickerId:
			heightLabelId:
			heightInputId:
			widthInputId:
			nodeGroupInfoId:
			nameInputId:
			notesTextareaId:
		}
		palettesWindow:{
			id:
			furnitureSearchInputId:
			furniturePaletteId: 
		}
		overviewWindow: {
			id:
		}
		optionsWindow: {
			id:
			gridSizeInputId:
			unitsFormId:
			unitsFormName:
			checkboxes: {
				showGridCheckboxId:
				gridSnapCheckboxId:
				wallGuidelinesCheckboxId:
				wallLengthsCheckboxId:
				wallAnglesCheckboxId:
				smallWallAnglesCheckboxId:
			}
		}
		statisticsWindow: {
			id:
			textDivId:
			numsTableId:
			totalsTableId:
		}
	}
	scaleDisplayId:
	setBehaviorClass:
	wallWidthInputId:
	wallWidthBoxId:
	unitsBoxId:
	unitsInputId:
*/
function GoToolsUI(goTools, name, goToolsName, state) {
	this._goTools = goTools;
	this._name = name;
	this._goToolsName = goToolsName;
	this._state = state;
	this._furnitureNodeData = null; // used for searchFurniture function. set only once
}

// Get GoTools associated with this UI
Object.defineProperty(GoToolsUI.prototype, "goTools", {
	get: function () { return this._goTools; }
});

// Get state object containing many ids of various UI elements
Object.defineProperty(GoToolsUI.prototype, "state", {
	get: function () { return this._state; }
});

// Get name of this GoToolsUI instance known to the DOM
Object.defineProperty(GoToolsUI.prototype, "name", {
	get: function () { return this._name; }
});

// Get name of the GoTools associated with this GoToolsUI instance known to the DOM
Object.defineProperty(GoToolsUI.prototype, "goToolsName", {
	get: function () { return this._goToolsName; }
});

Object.defineProperty(GoToolsUI.prototype, "furnitureData", {
	get: function () { return this._furnitureData; },
	set: function (val) { this._furnitureData = val; }
});

/*
* UI manipulation:
* Open Element, Close Element, Hide/Show Element, Adjust Scale, ChangeGridSize, 
* Search Furniture, Checkbox Changed, Change Units, Set Behavior, Update UI
*/

/* 
* Open a specifed window element (used with Open / Remove windows)
* @param {String} id The ID of the window to open
* @param {String} listid The ID of the listview element in the window
*/
GoToolsUI.prototype.openElement = function(id, listId) {
	var panel = document.getElementById(id);
	if (panel.style.visibility === "hidden") {
		updateFileList(listId);
		panel.style.visibility = "visible";
	}
}

/*
* Hide the window elements when the "X" button is pressed
* @param {String} id The ID of the window to close
*/
GoToolsUI.prototype.closeElement = function(id) {
	var windows = this.state.windows;
	var menuButtons = this.state.menuButtons;
	var panel = document.getElementById(id);
	if (id === windows.selectionInfoWindow.id) document.getElementById(menuButtons.selectionInfoWindowButtonId).innerHTML = "Show Node Info Help <p class='shortcut'> (Ctrl + I)</p>";
	if (id === windows.palettesWindow.id) document.getElementById(menuButtons.palettesWindowButtonId).innerHTML = "Show Palettes <p class='shortcut'> (Ctrl + P)</p>";
	if (id === windows.overviewWindow.id) document.getElementById(menuButtons.overviewWindowButtonId).innerHTML = "Show Overview <p class='shortcut'> (Ctrl + E)</p>";
	if (id === windows.optionsWindow.id) document.getElementById(menuButtons.optionsWindowButtonId).innerHTML = "Show Options <p class='shortcut'> (Ctrl + B)</p>";
	if (id === windows.statisticsWindow.id) document.getElementById(menuButtons.statisticsWindowButtonId).innerHTML = "Show Statistics <p class='shortcut'> (Ctrl + G)</p>";
	panel.style.visibility = "hidden";
}

/*
* Hide or show specific help/windows (used mainly with hotkeys)
* @param {String} id The ID of the window to show / hide
*/
GoToolsUI.prototype.hideShow = function(id) {
	var element = document.getElementById(id); var str;
	var windows = this.state.windows;
	switch (id) {
		case windows.selectionInfoWindow.id: str = 'Selection Help'; char = 'I'; break;
		case windows.overviewWindow.id: str = 'Overview'; char = 'E'; break;
		case windows.optionsWindow.id: str = 'Options'; char = 'B'; break;
		case windows.statisticsWindow.id: str = 'Statistics'; char = 'G'; break;
		case windows.palettesWindow.id: str = 'Palettes'; char = 'P'; {
			furniturePalette.layoutDiagram(true);
			wallPartsPalette.layoutDiagram(true);
			break;
		}
	}
	if (element.style.visibility === "visible") {
		element.style.visibility = "hidden";
		document.getElementById(id + 'Button').innerHTML = "Show " + str + "<p class='shortcut'> (Ctrl + " + char + " )</p>";
	} else {
		element.style.visibility = "visible";
		document.getElementById(id + 'Button').innerHTML = "Hide " + str + "<p class='shortcut'> (Ctrl + " + char + " )</p>";
	}
}

/*
* Increase / decrease diagram scale to the nearest 10%
* @param {String} sign Accepted values are "+" and "-"
*/
GoToolsUI.prototype.adjustScale = function(sign) {
	var goTools = this.goTools;
	var el = document.getElementById(this.state.scaleDisplayId);
	goTools.startTransaction('Change Scale');
	switch (sign) {
		case '-': goTools.scale -= .1; break;
		case '+': goTools.scale += .1; break;
	}
	goTools.scale = parseFloat((Math.round(goTools.scale / .1) * .1).toFixed(2));
	var scale = (goTools.scale * 100).toFixed(2);
	el.innerHTML = 'Scale: ' + scale + '%';
	goTools.commitTransaction('Change Scale');
}

// Change edge length of the grid based on input
GoToolsUI.prototype.changeGridSize = function () {
	var goTools = this.goTools;
	goTools.skipsUndoManager = true;
	goTools.startTransaction("change grid size");
	var el = document.getElementById(this.state.windows.optionsWindow.gridSizeInputId); var input;
	if (!isNaN(el.value) && el.value != null && el.value != '' && el.value != undefined) input = parseFloat(el.value);
	else {
		el.value = goTools.convertPixelsToUnits(10); // if bad input given, revert to 20cm (10px) or unit equivalent
		input = parseFloat(el.value);
	}
	input = goTools.convertUnitsToPixels(input);
	goTools.grid.gridCellSize = new go.Size(input, input);
	goTools.toolManager.draggingTool.gridCellSize = new go.Size(input, input);
	goTools.model.setDataProperty(goTools.model.modelData, "gridSize", input);
	goTools.commitTransaction("change grid size");
	goTools.skipsUndoManager = false;
}

// Search through all elements in the furniture palette (useful for a palette with many furniture nodes)
GoToolsUI.prototype.searchFurniture = function () {
	var ui = this;
	var goTools = this.goTools;
	var furniturePaletteId = ui.state.windows.palettesWindow.furniturePaletteId;
	var str = document.getElementById(ui.state.windows.palettesWindow.furnitureSearchInputId).value;
	var furniturePalette = null;
	for (var i = 0; i < goTools.palettes.length; i++) {
		var palette = goTools.palettes[i];
		if (palette.div.id == furniturePaletteId) {
			furniturePalette = goTools.palettes[i];
		}
	}
	if (ui.furnitureData == null) ui.furnitureData = furniturePalette.model.nodeDataArray;
	var items = furniturePalette.model.nodeDataArray.slice();
	if (str !== null && str !== undefined && str !== "") {
		for (var i = 0; i < items.length; i += 0) {
			var item = items[i];
			if (!item.type.toLowerCase().includes(str.toLowerCase())) {
				items.splice(i, 1);
			}
			else i++;
		}
		furniturePalette.model.nodeDataArray = items;
	}
	else furniturePalette.model.nodeDataArray = ui.furnitureData;
	furniturePalette.updateAllRelationshipsFromData();
}

/*
* Change the "checked" value of checkboxes in the Options Menu, and to have those changes reflected in app behavior / model data
* @param {String} id The ID of the changed checkbox
*/
GoToolsUI.prototype.checkboxChanged = function (id) {
	var goTools = this.goTools;
	var checkboxes = this.state.windows.optionsWindow.checkboxes;
	goTools.skipsUndoManager = true;
	goTools.startTransaction("change preference");
	var element = document.getElementById(id);
	switch (id) {
		case checkboxes.showGridCheckboxId: {
			goTools.grid.visible = element.checked;
			goTools.model.modelData.preferences.showGrid = element.checked;
			break;
		}
		case checkboxes.gridSnapCheckboxId: {
			goTools.toolManager.draggingTool.isGridSnapEnabled = element.checked;
			goTools.model.modelData.preferences.gridSnap = element.checked;
			break;
		}
		case checkboxes.wallGuidelinesCheckboxId: goTools.model.modelData.preferences.showWallGuidelines = element.checked; break;
		case checkboxes.wallLengthsCheckboxId: goTools.model.modelData.preferences.showWallLengths = element.checked; goTools.updateWallDimensions(); break;
		case checkboxes.wallAnglesCheckboxId: goTools.model.modelData.preferences.showWallAngles = element.checked; goTools.updateWallAngles(); break;
		case checkboxes.smallWallAnglesCheckboxId: goTools.model.modelData.preferences.showOnlySmallWallAngles = element.checked; goTools.updateWallAngles(); break;
	}
	goTools.commitTransaction("change preference");
	goTools.skipsUndoManager = false;
}

// Adjust units based on the selected radio button in the Options Menu
GoToolsUI.prototype.changeUnits = function() {
	return;
	var goTools = this.goTools;
	goTools.startTransaction("set units");
	var prevUnits = goTools.model.modelData.units;
	var radios = document.forms[this.state.windows.optionsWindow.unitsFormId].elements[this.state.windows.optionsWindow.unitsFormName];
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			goTools.model.setDataProperty(goTools.model.modelData, "units", radios[i].id);
		}
	}
	var units = goTools.model.modelData.units;
	switch (units) {
		case 'centimeters': goTools.model.setDataProperty(goTools.model.modelData, "unitsAbbreviation", 'cm'); break;
		case 'meters': goTools.model.setDataProperty(goTools.model.modelData, "unitsAbbreviation", 'm'); break;
		case 'feet': goTools.model.setDataProperty(goTools.model.modelData, "unitsAbbreviation", 'ft'); break;
		case 'inches': goTools.model.setDataProperty(goTools.model.modelData, "unitsAbbreviation", 'in'); break;
	}
	var unitsAbbreviation = goTools.model.modelData.unitsAbbreviation;
	// update all units boxes with new units
	var unitAbbrevInputs = document.getElementsByClassName(this.state.unitsBoxClass);
	for (var i = 0; i < unitAbbrevInputs.length; i++) {
		unitAbbrevInputs[i].value = unitsAbbreviation;
	}
	var unitInputs = document.getElementsByClassName(this.state.unitsInputClass);
	for (var i = 0; i < unitInputs.length; i++) {
		var input = unitInputs[i];
		goTools.model.setDataProperty(goTools.model.modelData, "units", prevUnits);
		var value = goTools.convertUnitsToPixels(input.value);
		goTools.model.setDataProperty(goTools.model.modelData, "units", units)
		value = goTools.convertPixelsToUnits(value);
		input.value = value;
	}
	if (goTools.selection.count === 1) this.setSelectionInfo(goTools.selection.first()); // reload node info measurements according to new units
	goTools.commitTransaction("set units");
}

/*
* Set current tool (selecting/dragging or wallbuilding/reshaping)
* @param {String} string Informs what behavior to switch to. Accepted values: "dragging", "wallbuilding"
*/
GoToolsUI.prototype.setBehavior = function (string) {
	var goTools = this.goTools;
	var ui = this;
	var wallBuildingTool = goTools.toolManager.mouseDownTools.elt(0);
	var wallReshapingTool = goTools.toolManager.mouseDownTools.elt(3);
	// style the current tool HTML button accordingly

	if (string === 'wallBuilding') {
		wallBuildingTool.isEnabled = true;
		wallReshapingTool.isEnabled = false;

		goTools.skipsUndoManager = true;
		goTools.startTransaction("change wallWidth");
		// create walls with wallWidth in input box
		goTools.model.setDataProperty(goTools.model.modelData, 'wallWidth', parseFloat(document.getElementById('wallWidthInput').value));
		var wallWidth = goTools.model.modelData.wallWidth;
		if (isNaN(wallWidth)) goTools.model.setDataProperty(goTools.model.modelData, 'wallWidth', 5);
		else {
			var width = goTools.convertUnitsToPixels(wallWidth);
			goTools.model.setDataProperty(goTools.model.modelData, 'wallWidth', width);
		}
		goTools.commitTransaction("change wallWidth");
		goTools.skipsUndoManager = false;
	}
	if (string === 'dragging') {
		wallBuildingTool.isEnabled = false;
		wallReshapingTool.isEnabled = true;
	}
	// clear resize adornments on walls/windows, if there are any
	goTools.nodes.iterator.each(function (n) { n.clearAdornments(); })
	goTools.clearSelection();
}

/* 
* Populating UI Windows from GoTools data:
* Update UI, Update Statistics, Fill Rows With Nodes, Set Selection Info, Set Color, Set Height, Set Width, Apply Selection Changes
*/

// Update the UI properly in accordance with model.modelData (called only when a new goTools is loaded or created)
GoToolsUI.prototype.updateUI = function () {
	return;
	var goTools = this.goTools;
	var modelData = goTools.model.modelData;
	var checkboxes = this.state.windows.optionsWindow.checkboxes;
	if (goTools.goToolsUI) goTools.goToolsUI.changeUnits();
	// update options GUI based on goTools.model.modelData.preferences
	var preferences = modelData.preferences;
	document.getElementById(checkboxes.showGridCheckboxId).checked = preferences.showGrid;
	document.getElementById(checkboxes.gridSnapCheckboxId).checked = preferences.gridSnap;
	document.getElementById(checkboxes.wallGuidelinesCheckboxId).checked = preferences.showWallGuidelines;
	document.getElementById(checkboxes.wallLengthsCheckboxId).checked = preferences.showWallLengths;
	document.getElementById(checkboxes.wallAnglesCheckboxId).checked = preferences.showWallAngles;
	document.getElementById(checkboxes.smallWallAnglesCheckboxId).checked = preferences.showOnlySmallWallAngles;
}

// Update all statistics in Statistics Window - called when a GoTools's model is changed
GoToolsUI.prototype.updateStatistics = function () {
	return;
	var goTools = this.goTools;
	var statsWindow = this.state.windows.statisticsWindow;
	var element = document.getElementById(statsWindow.textDivId);
	element.innerHTML = "<div class='row'><div class='col-2' style='height: 165px; overflow: auto;'> Item Types <table id='"+ statsWindow.numsTableId +"'></table></div><div class='col-2'> Totals <table id='totalsTable'></table></div></div>";
	// fill Item Types table with node type/count of all nodes in diagram
	var numsTable = document.getElementById(statsWindow.numsTableId);

	// get all palette nodes associated with this GoTools
	var palettes = goTools.palettes;
	var allPaletteNodes = [];
	for (var i = 0; i < palettes.length; i++) {
		allPaletteNodes = allPaletteNodes.concat(palettes[i].model.nodeDataArray);
	}

	for (var i = 0; i < allPaletteNodes.length; i++) {
		var type = allPaletteNodes[i].type;
		var num = goTools.findNodesByExample({ type: type }).count;
		if (num > 0) // only display data for nodes that exist on the diagram
			numsTable.innerHTML += "<tr class='data'> <td style='float: left;'>" + type + "</td> <td style='float: right;'> " + num + "</td></tr>";
	}
	// fill Totals table with lengths of all walls
	totalsTable = document.getElementById('totalsTable');
	var walls = goTools.findNodesByExample({ category: "WallGroup" });
	var totalLength = 0;
	walls.iterator.each(function (wall) {
		var wallLength = Math.sqrt(wall.data.startpoint.distanceSquaredPoint(wall.data.endpoint));
		totalLength += wallLength;
	});
	totalLength = goTools.convertPixelsToUnits(totalLength).toFixed(2);
	var unitsAbbreviation = goTools.model.modelData.unitsAbbreviation;
	totalsTable.innerHTML += "<tr class='data'><td style='float: left;'>Wall Lengths</td><td style='float: right;'>" + totalLength + unitsAbbreviation + "</td></tr>";
}

/* Helper function for setSelectionInfo(); displays all nodes in a given set in a given 1 or 2 rows in a given HTML element
* @param {Iterable | Array} iterator A iterable collection of nodes to display in rows
* @param {String} element The ID of the HTML element to fill with this data
* @param {String} selectedKey The key of the currently selected node -- this node's name will be styled differently in the rows
*/
// TODO some repetitive code here
GoToolsUI.prototype.fillRowsWithNodes = function(iterator, element, selectedKey) {
	var goTools = this.goTools;
	var ui = this;
	var arr = [];
	if (iterator.constructor !== Array) iterator.each(function (p) { arr.push(p); });
	else arr = iterator;

	// helper
	function makeOnClick(key) {
		return ui.name + '.setSelectionInfo(' + ui.goToolsName + '.findPartForKey(' + "'" + key + "'" + '))';
	}

	for (var i = 0; i < arr.length; i += 2) {
		if (arr[i].data === null) { this.setSelectionInfo('Nothing selected'); return; }
		var key1 = arr[i].data.key; // keys used to locate the node if clicked on...
		var name1 = (arr[i].data.caption !== "MultiPurposeNode") ? arr[i].data.caption : arr[i].data.text; // ... names are editable, so users can distinguish between nodes
		// if there are two nodes for this row...
		if (arr[i + 1] != undefined && arr[i + 1] != null) {
			var key2 = arr[i + 1].data.key;
			var name2 = (arr[i + 1].data.caption !== "MultiPurposeNode") ? arr[i + 1].data.caption : arr[i + 1].data.text;
			// if there's a non-null selectedKey, highlight the selected node in the list
			if (key1 === selectedKey) element.innerHTML += '<div class="row"><div class="col-2"><p class="data clickable selectedKey" onclick="' + makeOnClick(key1) + '">' + name1 +
				'</p></div><div class="col-2"><p class="data clickable" onclick="' + makeOnClick(key2) + '">' + name2 + '</p></div></div>';

			else if (key2 === selectedKey) element.innerHTML += '<div class="row"><div class="col-2"><p class="data clickable" onclick="' + makeOnClick(key1) + '">' + name1 +
				'</p></div><div class="col-2"><p class="data clickable selectedKey" onclick="' + makeOnClick(key2) + '">' + name2 + '</p></div></div>';

			else element.innerHTML += '<div class="row"><div class="col-2"><p class="data clickable"' + 'onclick="' + makeOnClick(key1) + '">' + name1 +
				'</p></div><div class="col-2"><p class="data clickable"' + 'onclick="' + makeOnClick(key2) + '">' + name2 + '</p></div></div>';
		}
		// if there's only one node for this row...
		else {
			if (key1 === selectedKey) element.innerHTML += '<div class="row"><div class="col-2"><p class="data clickable selectedKey" onclick="' + makeOnClick(key1) + '">' + name1 + '</p></div></div>';
			else element.innerHTML += '<div class="row"><div class="col-2"><p class="data clickable" onclick="' + makeOnClick(key1) + '">' + name1 + '</p></div></div>';
		}
	}
}

// Triggered by "Apply Changes"; set model data for fill color of the current selection
GoToolsUI.prototype.setColor = function () {
	var goTools = this.goTools;
	var node = goTools.selection.first();
	var colorPicker = document.getElementById(this.state.windows.selectionInfoWindow.colorPickerId);
	if (colorPicker !== null) {
		goTools.startTransaction("recolor node");
		goTools.model.setDataProperty(node.data, "color", colorPicker.value);
		goTools.model.setDataProperty(node.data, "stroke", invertColor(colorPicker.value))
		goTools.commitTransaction("recolor node");
	}
}

// Triggered by "Apply Changes"; set model data for height of the currently selected node (also handles door length for doors, wall length for walls)
GoToolsUI.prototype.setHeight = function () {
	var goTools = this.goTools;
	var node = goTools.selection.first();
	var heightInput = document.getElementById(this.state.windows.selectionInfoWindow.heightInputId);
	var value = parseFloat(goTools.convertUnitsToPixels(heightInput.value));
	if (isNaN(value)) {
		alert("Please enter a number in the height input");
		setSelectionInfo(node, goTools);
		return;
	}
	goTools.skipsUndoManager = true;
	goTools.startTransaction("resize node");
	if (!goTools.isReadOnly) {
		// Case: Standard / Multi-Purpose Nodes; basic height adjustment
		if (node.category !== 'WallGroup' && node.category !== "WindowNode" && node.category !== 'DoorNode') {
			goTools.model.setDataProperty(node.data, "height", value);
		}
		// Case: Door Nodes / Window Nodes; "Door Length" is node height and width
		else if (node.category === 'DoorNode' || node.category === "WindowNode") {
			var wall = goTools.findPartForKey(node.data.group);
			var loc = node.location.copy();
			if (wall !== null) {
				var wallLength = Math.sqrt(wall.data.startpoint.distanceSquaredPoint(wall.data.endpoint));
				if (wallLength < value) {
					value = wallLength;
					loc = new go.Point((wall.data.startpoint.x + wall.data.endpoint.x) / 2, (wall.data.startpoint.y + wall.data.endpoint.y) / 2);
				}
			}
			if (node.category === "DoorNode") goTools.model.setDataProperty(node.data, "width", value); // for door nodes, width dictates height as well
			node.location = loc;
			goTools.updateWallDimensions();
		}
		// Case: Wall Groups; wall length adjustment; do not allow walls to be shorter than the distance between their fathest apart wallParts
		else {
			var sPt = node.data.startpoint.copy();
			var ePt = node.data.endpoint.copy();
			var angle = sPt.directionPoint(ePt);

			var midPoint = new go.Point(((sPt.x + ePt.x) / 2), ((sPt.y + ePt.y) / 2));
			var newEpt = new go.Point((midPoint.x + (value / 2)), midPoint.y);
			var newSpt = new go.Point((midPoint.x - (value / 2)), midPoint.y);
			newEpt.offset(-midPoint.x, -midPoint.y).rotate(angle).offset(midPoint.x, midPoint.y);
			newSpt.offset(-midPoint.x, -midPoint.y).rotate(angle).offset(midPoint.x, midPoint.y);

			// Edge Case 1: The user has input a length shorter than the edge wallPart's endpoints allow
			// find the endpoints of the wallparts closest to the endpoints of the wall
			var closestPtToSpt = null; var farthestPtFromSpt;
			var closestDistToSpt = Number.MAX_VALUE; var farthestDistFromSpt = 0;
			node.memberParts.iterator.each(function (wallPart) {
				var endpoints = getWallPartEndpoints(wallPart);
				var endpoint1 = endpoints[0];
				var endpoint2 = endpoints[1];
				var distance1 = Math.sqrt(endpoint1.distanceSquaredPoint(sPt));
				var distance2 = Math.sqrt(endpoint2.distanceSquaredPoint(sPt));

				if (distance1 < closestDistToSpt) {
					closestDistToSpt = distance1;
					closestPtToSpt = endpoint1;
				} if (distance1 > farthestDistFromSpt) {
					farthestDistFromSpt = distance1;
					farthestPtFromSpt = endpoint1;
				} if (distance2 < closestDistToSpt) {
					closestDistToSpt = distance2;
					closestPtToSpt = endpoint2;
				} if (distance2 > farthestDistFromSpt) {
					farthestDistFromSpt = distance2;
					farthestPtFromSpt = endpoint2;
				}
			});

			if (closestPtToSpt !== null) {
				// if the proposed length is smaller than the minDistance, set wall length to minDistance
				var proposedDistance = Math.sqrt(newSpt.distanceSquaredPoint(newEpt));
				var minDistance = Math.sqrt(closestPtToSpt.distanceSquaredPoint(farthestPtFromSpt));
				if (proposedDistance < minDistance) {
					newSpt = closestPtToSpt;
					newEpt = farthestPtFromSpt;
				}
			}

			/*
			 * Edge Case 2: The new wall endpoints constructed based on user input do not generate a wall too short for the wall's edge wallPart's endpoints;
			 * however, there is/are a/some wallPart(s) that do not fit along the new wall endpoints (due to midpoint construction)
			 * if a wallPart endpoint is outside the line created by newSpt and newEpt, adjust the endpoints accordingly
			*/
			var farthestPtFromWallPt = null; var farthestFromWallPtDist = 0;
			node.memberParts.iterator.each(function (part) {
				var endpoints = getWallPartEndpoints(part);
				// check for endpoints of wallParts not along the line segment made by newSpt and newEpt
				for (var i = 0; i < endpoints.length; i++) {
					var point = endpoints[i];
					var distanceToStartPoint = parseFloat(Math.sqrt(point.distanceSquaredPoint(newSpt)).toFixed(2));
					var distanceToEndPoint = parseFloat(Math.sqrt(point.distanceSquaredPoint(newEpt)).toFixed(2));
					var wallLength = parseFloat(Math.sqrt(newSpt.distanceSquaredPoint(newEpt)).toFixed(2));
					if ((distanceToStartPoint + distanceToEndPoint).toFixed(2) !== wallLength.toFixed(2)) {
						var testDistance = Math.sqrt(point.distanceSquaredPoint(newSpt));
						if (testDistance > farthestFromWallPtDist) {
							farthestFromWallPtDist = testDistance;
							farthestPtFromWallPt = point;
						}
					}
				}
			});

			// if a wallPart endpoint is outside the wall, adjust the endpoints of the wall to accomodate it
			if (farthestPtFromWallPt !== null) {
				var distance = Math.sqrt(newSpt.distanceSquaredPoint(newEpt));
				if (farthestPtFromWallPt.distanceSquaredPoint(newSpt) < farthestPtFromWallPt.distanceSquaredPoint(newEpt)) {
					newSpt = farthestPtFromWallPt;
					var totalLength = Math.sqrt(newSpt.distanceSquaredPoint(newEpt));
					newEpt = new go.Point(newSpt.x + ((distance / totalLength) * (newEpt.x - newSpt.x)),
				newSpt.y + ((distance / totalLength) * (newEpt.y - newSpt.y)));
				} else {
					newEpt = farthestPtFromWallPt;
					var totalLength = Math.sqrt(newSpt.distanceSquaredPoint(newEpt));
					newSpt = new go.Point(newEpt.x + ((distance / totalLength) * (newSpt.x - newEpt.x)),
				newEpt.y + ((distance / totalLength) * (newSpt.y - newEpt.y)));
				}
			}

			goTools.model.setDataProperty(node.data, "startpoint", newSpt);
			goTools.model.setDataProperty(node.data, "endpoint", newEpt);
			goTools.updateWall(node);
		}
	}
	goTools.commitTransaction("resize node");
	goTools.updateWallDimensions(goTools);
	goTools.skipsUndoManager = false;
}

// Triggered by "Apply Changes"; set model data for width of the currently selected node
GoToolsUI.prototype.setWidth = function() {
	var goTools = this.goTools;
	var node = goTools.selection.first();
	var widthInput = document.getElementById(this.state.windows.selectionInfoWindow.widthInputId);
	if (widthInput === null) return;
	var value = parseFloat(goTools.convertUnitsToPixels(widthInput.value));
	if (isNaN(value)) {
		alert("Please enter a number in the width input");
		setSelectionInfo(node, goTools);
		return;
	}
	goTools.skipsUndoManager = true;
	goTools.startTransaction("resize node");
	if (!goTools.isReadOnly) {
		// Case: Window nodes, keeps windows within wall boundaries
		if (node.category === 'WindowNode') {
			var wall = goTools.findPartForKey(node.data.group);
			var loc = node.location.copy();
			// constrain max width "value" by the free stretch on the wall "node" is in
			if (wall !== null) {
				var containingStretch = getWallPartStretch(node);
				var stretchLength = Math.sqrt(containingStretch.point1.distanceSquaredPoint(containingStretch.point2));
				if (stretchLength < value) {
					value = stretchLength;
					loc = new go.Point((containingStretch.point1.x + containingStretch.point2.x) / 2,
						(containingStretch.point1.y + containingStretch.point2.y) / 2);
				}
			}
			goTools.model.setDataProperty(node.data, "width", value);
			node.location = loc;
			goTools.updateWallDimensions();
		}
			// Case: Wall Groups; set wall's data.strokeWidth
		else if (node.category === 'WallGroup') {
			goTools.model.setDataProperty(node.data, "strokeWidth", value);
			node.memberParts.iterator.each(function (part) {
				if (part.category === 'DoorNode') goTools.model.setDataProperty(part.data, "doorOpeningHeight", value);
				if (part.category === 'WindowNode') goTools.model.setDataProperty(part.data, "height", value);
			});
		}
			// Case: Standard / Multi-Purpose Nodes; basic width ajustment
		else goTools.model.setDataProperty(node.data, "width", value);
	}
	goTools.commitTransaction("resize node");
	goTools.skipsUndoManager = false;
}

// Set height, width, and color of the selection based on user input in the Selection Info Window
GoToolsUI.prototype.applySelectionChanges = function() {
	var goTools = this.goTools;
	this.setHeight();
	this.setWidth();
	this.setColor();
	goTools.goToolsUI.setSelectionInfo(goTools.selection.first(), goTools);
}