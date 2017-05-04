
tools.palettes = {
	"circuit": [
		{ category: "circuit.input" },
		{ category: "circuit.output" },
		{ category: "circuit.and" },
		{ category: "circuit.or" },
		{ category: "circuit.xor" },
		{ category: "circuit.not" },
		{ category: "circuit.nand" },
		{ category: "circuit.nor" },
		{ category: "circuit.xnor" }
	],
	"floor": [
		{
			key: 1,
			geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M0,0 a40,40 0 0,0 -40,40 ",
			item: "left door",
			color: tools.brushes.wall,
			category: 'floor'
		},
		{
			key: 2,
			geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M5,0 a40,40 0 0,1 40,40 ",
			item: "right door",
			color: tools.brushes.wall,
			category: 'floor'
		},
		{
			key: 3, angle: 90,
			geo: "F1 M0,0 L0,100 12,100 12,0 0,0z",
			item: "wall",
			color: tools.brushes.wall,
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
			color: tools.brushes.wall,
			category: 'floor'
		},
		{
			key: 6,
			geo: "F1 M0 0 L40 0 40 40 0 40 0 0 x M0 10 L40 10 x M 8 10 8 40 x M 32 10 32 40 z",
			item: "arm chair",
			color: tools.brushes.blue,
			category: 'floor'
		},
		{
			key: 7,
			geo: "F1 M0 0 L80,0 80,40 0,40 0 0 x M0,10 L80,10 x M 7,10 7,40 x M 73,10 73,40 z",
			item: "couch",
			color: tools.brushes.blue,
			category: 'floor'
		},
		{
			key: 8,
			geo: "F1 M0 0 L30 0 30 30 0 30 z",
			item: "Side Table",
			color: tools.brushes.wood,
			category: 'floor'
		},
		{
			key: 9,
			geo: "F1 M0 0 L80,0 80,90 0,90 0,0 x M0,7 L80,7 x M 0,30 80,30 z",
			item: "queen bed",
			color: tools.brushes.green,
			category: 'floor'
		},
		{
			key: 10,
			geo: "F1 M5 5 L30,5 35,30 0,30 5,5 x F M0 0 L 35,0 35,5 0,5 0,0 z",
			item: "chair",
			color: tools.brushes.wood,
			category: 'floor'
		},
		{
			key: 11,
			geo: "F1 M0 0 L50,0 50,90 0,90 0,0 x M0,7 L50,7 x M 0,30 50,30 z",
			item: "twin bed",
			color: tools.brushes.green,
			category: 'floor'
		},
		{
			key: 12,
			geo: "F1 M0 0 L0 60 80 60 80 0z",
			item: "kitchen table",
			color: tools.brushes.wood,
			category: 'floor'
		},
		{
			key: 13,
			geo: "F1 M 0,0 a35,35 0 1,0 1,-1 z",
			item: "round table",
			color: tools.brushes.wood,
			category: 'floor'
		},
		{
			key: 14,
			geo: "F1 M 0,0 L35,0 35,30 0,30 0,0 x M 5,5 L 30, 5 30,25 5,25 5,5 x M 17,2 L 17,10 19,10 19,2 17,2 z",
			item: "kitchen sink",
			color: tools.brushes.metal,
			category: 'floor'
		},
		{
			key: 15,
			geo: "F1 M0,0 L55,0, 55,50, 0,50 0,0 x M 40,7 a 7,7 0 1 0 0.00001 0z x M 40,10 a 4,4 0 1 0 0.00001 0z x M 38,27 a 7,7 0 1 0 0.00001 0z x M 38,30 a 4,4 0 1 0 0.00001 0z x M 16,27 a 7,7 0 1 0 0.00001 0z xM 16,30 a 4,4 0 1 0 0.00001 0z x M 14,7 a 7,7 0 1 0 0.00001 0z x M 14,10 a 4,4 0 1 0 0.00001 0z",
			item: "stove",
			color: tools.brushes.metal,
			category: 'floor'
		},
		{
			key: 16,
			geo: "F1 M0,0 L55,0, 55,50, 0,50 0,0 x F1 M0,51 L55,51 55,60 0,60 0,51 x F1 M5,60 L10,60 10,63 5,63z",
			item: "refrigerator",
			color: tools.brushes.metal,
			category: 'floor'
		},
		{
			key: 17,
			geo: "F1 M0,0 100,0 100,40 0,40z",
			item: "bookcase",
			color: tools.brushes.wood,
			category: 'floor'
		},
		{
			key: 18,
			geo: "F1 M0,0 70,0 70,50 0,50 0,0 x F1 M15,58 55,58 55,62 15,62 x F1 M17,58 16,50 54,50 53,58z",
			item: "desk",
			color: tools.brushes.wood,
			category: 'floor'
		}
	],
	"flowchart": [
		{ category: "flowchart.start", text: "Start" },
        { category: "flowchart.normal", text: "Step" },
        { category: "flowchart.normal", text: "???", figure: "Diamond" },
        { category: "flowchart.end", text: "End" },
        { category: "flowchart.comment", text: "Comment" }
    ]
}
var shapes = go.Shape.getFigureGenerators().toArray();;
for(var i=0; i<shapes.length; i++){
	shapes[i]["category"] = "shape";
}
tools.palettes["shape"] = shapes;

function getPaletteNodeData(type){
	var nodeDataArray = [];
	if(!type){
		for(var key in tools.node_templates){
			nodeDataArray = nodeDataArray.concat(tools.palettes[key])
		}
	}else{
		nodeDataArray = tools.palettes[type];
	}
	return nodeDataArray;
}
function changePalette(type){
	tools.palette.model.nodeDataArray = getPaletteNodeData(type);
}