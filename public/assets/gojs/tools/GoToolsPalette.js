/*
* Copyright (C) 1998-2017 by Northwoods Software Corporation
* All Rights Reserved.
*
* GoTools Palette Class
* A Palette linked to a specified GoTools
*/

/* 
* GoTools Palette Constructor
* @param {HTMLDivElement|string} div A reference to a div or its ID as a string.
* @param {GoTools} goTools A valid instance of GoTools
* @param {Array} nodeDataArray An array for the Palette's model's node data
*/
function GoToolsPalette(div, goTools, nodeDataArray) {
    go.Palette.call(this, div);

    var $ = go.GraphObject.make;
    this.paletteMap = new go.Map();
    this.contentAlignment = go.Spot.Center;
    this.nodeTemplateMap = goTools.nodeTemplateMap;
    this.toolManager.contextMenuTool.isEnabled = false;
    this.initial();
    this.changePalette("floor_planner");

    goTools.palettes.push(this);
} 

go.Diagram.inherit(GoToolsPalette, go.Palette);


GoToolsPalette.prototype.initial = function(){
	this.paletteMap.add("floor_planner", [
	  {
		  category: "MultiPurposeNode",
		  key: "MultiPurposeNode",
		  caption: "Multi Purpose Node",
		  color: "#ffffff",
		  stroke: '#000000',
		  name: "Writable Node",
		  type: "Writable Node",
		  shape: "Rectangle",
		  text: "Write here",
		  width: 60,
		  height: 60,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "roundTable",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Round Table",
		  type: "Round Table",
		  shape: "Ellipse",
		  width: 61,
		  height: 61,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "armChair",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Arm Chair",
		  type: "Arm Chair",
		  geo: "F1 M0 0 L40 0 40 40 0 40 0 0 M10 30 L10 10 M0 0 Q8 0 10 10 M0 40 Q20 15 40 40 M30 10 Q32 0 40 0 M30 10 L30 30",
		  width: 45,
		  height: 45,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "sofaMedium",
		  color: "#ffffff",
		  stroke: "#000000",
		  caption: "Sofa",
		  type: "Sofa",
		  geo: "F1 M0 0 L80 0 80 40 0 40 0 0 M10 35 L10 10 M0 0 Q8 0 10 10 M0 40 Q40 15 80 40 M70 10 Q72 0 80 0 M70 10 L70 35",
		  height: 45,
		  width: 90,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "sink",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Sink",
		  type: "Sink",
		  geo: "F1 M0 0 L40 0 40 40 0 40 0 0z M5 7.5 L18.5 7.5 M 21.5 7.5 L35 7.5 35 35 5 35 5 7.5 M 15 21.25 A 5 5 180 1 0 15 21.24 M23 3.75 A 3 3 180 1 1 23 3.74 M21.5 6.25 L 21.5 12.5 18.5 12.5 18.5 6.25 M15 3.75 A 1 1 180 1 1 15 3.74 M 10 4.25 L 10 3.25 13 3.25 M 13 4.25 L 10 4.25 M27 3.75 A 1 1 180 1 1 27 3.74 M 26.85 3.25 L 30 3.25 30 4.25 M 26.85 4.25 L 30 4.25",
		  width: 27,
		  height: 27,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "doubleSink",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Double Sink",
		  type: "Double Sink",
		  geo: "F1 M0 0 L75 0 75 40 0 40 0 0 M5 7.5 L35 7.5 35 35 5 35 5 7.5 M44 7.5 L70 7.5 70 35 40 35 40 9 M15 21.25 A5 5 180 1 0 15 21.24 M50 21.25 A 5 5 180 1 0 50 21.24 M40.5 3.75 A3 3 180 1 1 40.5 3.74 M40.5 3.75 L50.5 13.75 47.5 16.5 37.5 6.75 M32.5 3.75 A 1 1 180 1 1 32.5 3.74 M 27.5 4.25 L 27.5 3.25 30.5 3.25 M 30.5 4.25 L 27.5 4.25 M44.5 3.75 A 1 1 180 1 1 44.5 3.74 M 44.35 3.25 L 47.5 3.25 47.5 4.25 M 44.35 4.25 L 47.5 4.25",
		  height: 27,
		  width: 52,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "toilet",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Toilet",
		  type: "Toilet",
		  geo: "F1 M0 0 L25 0 25 10 0 10 0 0 M20 10 L20 15 5 15 5 10 20 10 M5 15 Q0 15 0 25 Q0 40 12.5 40 Q25 40 25 25 Q25 15 20 15",
		  width: 25,
		  height: 35,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "shower",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Shower/Tub",
		  type: "Shower/Tub",
		  geo: "F1 M0 0 L40 0 40 60 0 60 0 0 M35 15 L35 55 5 55 5 15 Q5 5 20 5 Q35 5 35 15 M22.5 20 A2.5 2.5 180 1 1 22.5 19.99",
		  width: 45,
		  height: 75,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "bed",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Bed",
		  type: "Bed",
		  geo: "F1 M0 0 L40 0 40 60 0 60 0 0 M 7.5 2.5 L32.5 2.5 32.5 17.5 7.5 17.5 7.5 2.5 M0 20 L40 20 M0 25 L40 25",
		  width: 76.2,
		  height: 101.6,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "staircase",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Staircase",
		  type: "Staircase",
		  geo: "F1 M0 0 L 0 100 250 100 250 0 0 0 M25 100 L 25 0 M 50 100 L 50 0 M 75 100 L 75 0 M 100 100 L 100 0 M 125 100 L 125 0 M 150 100 L 150 0 M 175 100 L 175 0 M 200 100 L 200 0 M 225 100 L 225 0",
		  width: 125,
		  height: 50,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "stove",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Stove",
		  type: "Stove",
		  geo: "F1 M 0 0 L 0 100 100 100 100 0 0 0 M 30 15 A 15 15 180 1 0 30.01 15 M 70 15 A 15 15 180 1 0 70.01 15"
		  + "M 30 55 A 15 15 180 1 0 30.01 55 M 70 55 A 15 15 180 1 0 70.01 55",
		  width: 75,
		  height: 75,
		  notes: ""
	  },
	  {
	  	  category: "FurnitureNode",
		  key: "diningTable",
		  color: "#ffffff",
		  stroke: '#000000',
		  caption: "Dining Table",
		  type: "Dining Table",
		  geo: "F1 M 0 0 L 0 100 200 100 200 0 0 0 M 25 0 L 25 -10 75 -10 75 0 M 125 0 L 125 -10 175 -10 175 0 M 200 25 L 210 25 210 75 200 75 M 125 100 L 125 110 L 175 110 L 175 100 M 25 100 L 25 110 75 110 75 100 M 0 75 -10 75 -10 25 0 25",
		  width: 125,
		  height: 62.5,
		  notes: ""
	    },
		{
			category: "PaletteWallNode",
			key: "wall",
			caption: "Wall",
			type: "Wall",
			color: "#000000",
			shape: "Rectangle",
			height: 10,
			width: 60,
			notes: "",
		},
		{
			category: "WindowNode",
			key: "window",
			color: "white",
			caption: "Window",
			type: "Window",
			shape: "Rectangle",
			height: 10,
			width: 60,
			notes: ""
		},
		{
			key: "door",
			category: "DoorNode",
			color: "rgba(0, 0, 0, 0)",
			caption: "Door",
			type: "Door",
			width: 40,
			doorOpeningHeight: 5,
			swing: "left",
			notes: ""
		}
	]);
	this.paletteMap.add("circuit", [
		{ category: "circuit.input" },
		{ category: "circuit.output" },
		{ category: "circuit.and" },
		{ category: "circuit.or" },
		{ category: "circuit.xor" },
		{ category: "circuit.not" },
		{ category: "circuit.nand" },
		{ category: "circuit.nor" },
		{ category: "circuit.xnor" }
	]);
	this.paletteMap.add("floor", [
		{
			key: 1,
			geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M0,0 a40,40 0 0,0 -40,40 ",
			item: "left door",
			color: goTools.brushes.wall,
			category: 'floor'
		},
		{
			key: 2,
			geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M5,0 a40,40 0 0,1 40,40 ",
			item: "right door",
			color: goTools.brushes.wall,
			category: 'floor'
		},
		{
			key: 3, angle: 90,
			geo: "F1 M0,0 L0,100 12,100 12,0 0,0z",
			item: "wall",
			color: goTools.brushes.wall,
			category: 'floor'
		},
		{
			key: 4, angle: 90,
			geo: "F1 M0,0 L0,50 10,50 10,0 0,0 x M5,0 L5,50z",
			item: "window",
			color: "whitesmoke",
			category: 'floor'
		},
		{
			key: 5,
			geo: "F1 M0,0 L50,0 50,12 12,12 12,50 0,50 0,0 z",
			item: "corner",
			color: goTools.brushes.wall,
			category: 'floor'
		},
		{
			key: 6,
			geo: "F1 M0 0 L40 0 40 40 0 40 0 0 x M0 10 L40 10 x M 8 10 8 40 x M 32 10 32 40 z",
			item: "arm chair",
			color: goTools.brushes.blue,
			category: 'floor'
		},
		{
			key: 7,
			geo: "F1 M0 0 L80,0 80,40 0,40 0 0 x M0,10 L80,10 x M 7,10 7,40 x M 73,10 73,40 z",
			item: "couch",
			color: goTools.brushes.blue,
			category: 'floor'
		},
		{
			key: 8,
			geo: "F1 M0 0 L30 0 30 30 0 30 z",
			item: "Side Table",
			color: goTools.brushes.wood,
			category: 'floor'
		},
		{
			key: 9,
			geo: "F1 M0 0 L80,0 80,90 0,90 0,0 x M0,7 L80,7 x M 0,30 80,30 z",
			item: "queen bed",
			color: goTools.brushes.green,
			category: 'floor'
		},
		{
			key: 10,
			geo: "F1 M5 5 L30,5 35,30 0,30 5,5 x F M0 0 L 35,0 35,5 0,5 0,0 z",
			item: "chair",
			color: goTools.brushes.wood,
			category: 'floor'
		},
		{
			key: 11,
			geo: "F1 M0 0 L50,0 50,90 0,90 0,0 x M0,7 L50,7 x M 0,30 50,30 z",
			item: "twin bed",
			color: goTools.brushes.green,
			category: 'floor'
		},
		{
			key: 12,
			geo: "F1 M0 0 L0 60 80 60 80 0z",
			item: "kitchen table",
			color: goTools.brushes.wood,
			category: 'floor'
		},
		{
			key: 13,
			geo: "F1 M 0,0 a35,35 0 1,0 1,-1 z",
			item: "round table",
			color: goTools.brushes.wood,
			category: 'floor'
		},
		{
			key: 14,
			geo: "F1 M 0,0 L35,0 35,30 0,30 0,0 x M 5,5 L 30, 5 30,25 5,25 5,5 x M 17,2 L 17,10 19,10 19,2 17,2 z",
			item: "kitchen sink",
			color: goTools.brushes.metal,
			category: 'floor'
		},
		{
			key: 15,
			geo: "F1 M0,0 L55,0, 55,50, 0,50 0,0 x M 40,7 a 7,7 0 1 0 0.00001 0z x M 40,10 a 4,4 0 1 0 0.00001 0z x M 38,27 a 7,7 0 1 0 0.00001 0z x M 38,30 a 4,4 0 1 0 0.00001 0z x M 16,27 a 7,7 0 1 0 0.00001 0z xM 16,30 a 4,4 0 1 0 0.00001 0z x M 14,7 a 7,7 0 1 0 0.00001 0z x M 14,10 a 4,4 0 1 0 0.00001 0z",
			item: "stove",
			color: goTools.brushes.metal,
			category: 'floor'
		},
		{
			key: 16,
			geo: "F1 M0,0 L55,0, 55,50, 0,50 0,0 x F1 M0,51 L55,51 55,60 0,60 0,51 x F1 M5,60 L10,60 10,63 5,63z",
			item: "refrigerator",
			color: goTools.brushes.metal,
			category: 'floor'
		},
		{
			key: 17,
			geo: "F1 M0,0 100,0 100,40 0,40z",
			item: "bookcase",
			color: goTools.brushes.wood,
			category: 'floor'
		},
		{
			key: 18,
			geo: "F1 M0,0 70,0 70,50 0,50 0,0 x F1 M15,58 55,58 55,62 15,62 x F1 M17,58 16,50 54,50 53,58z",
			item: "desk",
			color: goTools.brushes.wood,
			category: 'floor'
		}
	]);
	this.paletteMap.add("flowchart", [
		{ category: "flowchart.start", text: "Start" },
	    { category: "flowchart.normal", text: "Step" },
	    { category: "flowchart.normal", text: "???", figure: "Diamond" },
	    { category: "flowchart.end", text: "End" },
	    { category: "flowchart.comment", text: "Comment" }
	]);
	this.paletteMap.add("pipe", [
		{
		  category: 'pipe',
	      key: 1,
	      geo: "F1 M0 0 L20 0 20 20 0 20z",
	      ports: [
	        { id: "U6", spot: "0.5 0 0 0.5" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 3, angle: 90,
	      geo: "F1 M0 0 L20 0 20 20 0 20z",
	      ports: [
	        { id: "U6", spot: "0.5 0 0 0.5" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 5,
	      geo: "F1 M0 0 L20 0 20 60 0 60z",
	      ports: [
	        { id: "U6", spot: "0.5 0 0 0.5" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 7, angle: 90,
	      geo: "F1 M0 0 L20 0 20 60 0 60z",
	      ports: [
	        { id: "U6", spot: "0.5 0 0 0.5" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 11,
	      geo: "F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U2", spot: "0.25 1 0.25 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 12, angle: 90,
	      geo: "F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U2", spot: "0.25 1 0.25 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 13, angle: 180,
	      geo: "F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U2", spot: "0.25 1 0.25 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 14, angle: 270,
	      geo: "F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U2", spot: "0.25 1 0.25 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 21,
	      geo: "F1 M0 0 L60 0 60 20 50 20 Q40 20 40 30 L40 40 20 40 20 30 Q20 20 10 20 L0 20z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U4", spot: "0 0.25 0.5 0.25" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 22, angle: 90,
	      geo: "F1 M0 0 L60 0 60 20 50 20 Q40 20 40 30 L40 40 20 40 20 30 Q20 20 10 20 L0 20z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U4", spot: "0 0.25 0.5 0.25" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 23, angle: 180,
	      geo: "F1 M0 0 L60 0 60 20 50 20 Q40 20 40 30 L40 40 20 40 20 30 Q20 20 10 20 L0 20z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U4", spot: "0 0.25 0.5 0.25" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 24, angle: 270,
	      geo: "F1 M0 0 L60 0 60 20 50 20 Q40 20 40 30 L40 40 20 40 20 30 Q20 20 10 20 L0 20z",
	      ports: [
	        { id: "U0", spot: "1 0.25 -0.5 0.25" },
	        { id: "U4", spot: "0 0.25 0.5 0.25" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 31,
	      geo: "F1 M0 0 L20 0 20 10 Q20 14.142 22.929 17.071 L30 24.142 15.858 38.284 8.787 31.213 Q0 22.426 0 10z",
	      ports: [
	        { id: "U6", spot: "0 0 10.5 0.5" },
	        { id: "U1", spot: "1 1 -7.571 -7.571", angle: 45 }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 32, angle: 90,
	      geo: "F1 M0 0 L20 0 20 10 Q20 14.142 22.929 17.071 L30 24.142 15.858 38.284 8.787 31.213 Q0 22.426 0 10z",
	      ports: [
	        { id: "U6", spot: "0 0 10.5 0.5" },
	        { id: "U1", spot: "1 1 -7.571 -7.571", angle: 45 }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 33, angle: 180,
	      geo: "F1 M0 0 L20 0 20 10 Q20 14.142 22.929 17.071 L30 24.142 15.858 38.284 8.787 31.213 Q0 22.426 0 10z",
	      ports: [
	        { id: "U6", spot: "0 0 10.5 0.5" },
	        { id: "U1", spot: "1 1 -7.571 -7.571", angle: 45 }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 34, angle: 270,
	      geo: "F1 M0 0 L20 0 20 10 Q20 14.142 22.929 17.071 L30 24.142 15.858 38.284 8.787 31.213 Q0 22.426 0 10z",
	      ports: [
	        { id: "U6", spot: "0 0 10.5 0.5" },
	        { id: "U1", spot: "1 1 -7.571 -7.571", angle: 45 }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 41,
	      geo: "F1 M14.142 0 L28.284 14.142 14.142 28.284 0 14.142z",
	      ports: [
	        { id: "U1", spot: "1 1 -7.321 -7.321" },
	        { id: "U3", spot: "0 1 7.321 -7.321" },
	        { id: "U5", spot: "0 0 7.321 7.321" },
	        { id: "U7", spot: "1 0 -7.321 7.321" }
	      ]
	    },

	    // Example M-F connector pipes
	    /*
	    {
	      category: 'pipe',
	      key: 107, //angle: 90,
	      geo: "F1 M0 0 L5 0, 5 10, 15 10, 15 0, 20 0, 20 40, 0 40z",
	      ports: [
	        { id: "F6", spot: "0.5 0 0 10.5" },
	        { id: "U2", spot: "0.5 1 0 -0.5" }
	      ]
	    },
	    {
	      category: 'pipe',
	      key: 108, //angle: 90,
	      geo: "F1 M0 0, 20 0, 20 30, 15 30, 15 40, 5 40, 5 30, 0 30z",
	      ports: [
	        { id: "U6", spot: "0.5 0 0 10.5" },
	        { id: "M2", spot: "0.5 1 0 -0.5" }
	      ]
	    }
	    */
	]);

	this.paletteMap.add("seating", [
      { category: 'seating_person', key: "Tyrion Lannister" },
      { category: 'seating_person', key: "Daenerys Targaryen", plus: 3 },  // dragons, of course
      { category: 'seating_person', key: "Jon Snow" },
      { category: 'seating_person', key: "Stannis Baratheon" },
      { category: 'seating_person', key: "Arya Stark" },
      { category: 'seating_person', key: "Jorah Mormont" },
      { category: 'seating_person', key: "Sandor Clegane" },
      { category: 'seating_person', key: "Joffrey Baratheon" },
      { category: 'seating_person', key: "Brienne of Tarth" },
      { category: 'seating_person', key: "Hodor" }
    ])

	var shapes = go.Shape.getFigureGenerators().toArray();;
	for(var i=0; i<shapes.length; i++){
		shapes[i]["category"] = "shape";
	}
	this.paletteMap.add("shape", shapes);

	var icons_nodes = [];
	for(var k in icons){
		icons_nodes.push({geo: k, color: "#00B5CB", category: "icon"});
	}
	this.paletteMap.add("icon", icons_nodes);

	this.paletteMap.add("font-awesome", getFontAwesomeList());
	this.paletteMap.add("glyphicons", getGlyphiconsList());
}

GoToolsPalette.prototype.getPaletteNodeData = function(type){
	var nodeDataArray = [];
	if(!type){
		var iterator = this.paletteMap.iterator;
		while(iterator.next()){
			nodeDataArray = nodeDataArray.concat(iterator.value);
		}
	}else{
		nodeDataArray = this.paletteMap.getValue(type);
	}
	return nodeDataArray;
}
GoToolsPalette.prototype.changePalette = function(type){
	if(!$('#tab_palette').hasClass("active")){
		$("#tab_link_palette").tab('show');
	}
	this.model.nodeDataArray = this.getPaletteNodeData(type);
}