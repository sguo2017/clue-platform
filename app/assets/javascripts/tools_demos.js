var demo = {}

demo.color_box = function(){
	var nodeDataArray = []
	for(var i=0; i<1000; i++){
	    nodeDataArray.push({ color: go.Brush.randomColor(), category: 'color_box' })
	}
	tools.diagram.model = new go.Model(nodeDataArray);
	tools.diagram.layout = $$(go.Layout);
}

demo.circuit = function(){
	    // update the diagram every 250 milliseconds
    var loop = function() {
      setTimeout(function() { updateStates(); loop(); }, 250);
    }

    // update the value and appearance of each node according to its type and input values
    var updateStates = function() {
      var oldskip = tools.diagram.skipsUndoManager;
      tools.diagram.skipsUndoManager = true;
      // do all "input" nodes first
      tools.diagram.nodes.each(function(node) {
          if (node.category === "input") {
            doInput(node);
          }
        });
      // now we can do all other kinds of nodes
      tools.diagram.nodes.each(function(node) {
          switch (node.category) {
            case "circuit.and":       doAnd(node); break;
            case "circuit.or":         doOr(node); break;
            case "circuit.xor":       doXor(node); break;
            case "circuit.not":       doNot(node); break;
            case "circuit.nand":     doNand(node); break;
            case "circuit.nor":       doNor(node); break;
            case "circuit.xnor":     doXnor(node); break;
            case "circuit.output": doOutput(node); break;
            case "circuit.input": break;  // doInput already called, above
          }
        });
      tools.diagram.skipsUndoManager = oldskip;
    }

    // helper predicate
    var linkIsTrue = function(link) {  // assume the given Link has a Shape named "SHAPE"
      return link.findObject("SHAPE").stroke === "forestgreen";
    }

    // helper function for propagating results
    var setOutputLinks = function(node, color) {
      node.findLinksOutOf().each(function(link) { link.findObject("SHAPE").stroke = color; });
    }

    // update nodes by the specific function for its type
    // determine the color of links coming out of this node based on those coming in and node type

    var doInput = function(node) {
      // the output is just the node's Shape.fill
      setOutputLinks(node, node.findObject("NODESHAPE").fill);
    }

    var doAnd = function(node) {
      var color = node.findLinksInto().all(linkIsTrue) ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }
    var doNand = function(node) {
      var color = !node.findLinksInto().all(linkIsTrue) ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }
    var doNot = function(node) {
      var color = !node.findLinksInto().all(linkIsTrue) ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }

    var doOr = function(node) {
      var color = node.findLinksInto().any(linkIsTrue) ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }
    var doNor = function(node) {
      var color = !node.findLinksInto().any(linkIsTrue) ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }

    var doXor = function(node) {
      var truecount = 0;
      node.findLinksInto().each(function(link) { if (linkIsTrue(link)) truecount++; });
      var color = truecount % 2 === 0 ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }
    var doXnor = function(node) {
      var truecount = 0;
      node.findLinksInto().each(function(link) { if (linkIsTrue(link)) truecount++; });
      var color = truecount % 2 !== 0 ? "forestgreen" : "orangered";
      setOutputLinks(node, color);
    }

    var doOutput = function(node) {
      // assume there is just one input link
      // we just need to update the node's Shape.fill
      node.linksConnected.each(function(link) { node.findObject("NODESHAPE").fill = link.findObject("SHAPE").stroke; });
    }

    tools.diagram.model = go.Model.fromJson({ 
    	"class": "go.GraphLinksModel",
		  "linkFromPortIdProperty": "fromPort",
		  "linkToPortIdProperty": "toPort",
		  "nodeDataArray": [
		{"category":"circuit.input", "key":"input1", "loc":"-150 -80" },
		{"category":"circuit.or", "key":"or1", "loc":"-70 0" },
		{"category":"circuit.not", "key":"not1", "loc":"10 0" },
		{"category":"circuit.xor", "key":"xor1", "loc":"100 0" },
		{"category":"circuit.or", "key":"or2", "loc":"200 0" },
		{"category":"circuit.output", "key":"output1", "loc":"200 -100" }
		 ],
		  "linkDataArray": [
		{"from":"input1", "fromPort":"out", "to":"or1", "toPort":"in1", "category": "circuit"},
		{"from":"or1", "fromPort":"out", "to":"not1", "toPort":"in", "category": "circuit"},
		{"from":"not1", "fromPort":"out", "to":"or1", "toPort":"in2", "category": "circuit"},
		{"from":"not1", "fromPort":"out", "to":"xor1", "toPort":"in1", "category": "circuit"},
		{"from":"xor1", "fromPort":"out", "to":"or2", "toPort":"in1", "category": "circuit"},
		{"from":"or2", "fromPort":"out", "to":"xor1", "toPort":"in2", "category": "circuit"},
		{"from":"xor1", "fromPort":"out", "to":"output1", "toPort":"", "category": "circuit"}
		 ]});

    tools.diagram.linkTemplate = tools.link_templates["circuit"];
   	tools.diagram.layout = $$(go.Layout);

   	loop();

}
demo.flowchart = function(){
	tools.diagram.model = go.Model.fromJson({ 
	  "class": "go.GraphLinksModel",
	  "linkFromPortIdProperty": "fromPort",
	  "linkToPortIdProperty": "toPort",
	  "nodeDataArray": [
		{"category":"flowchart.comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
		{"key":-1, "category":"flowchart.start", "loc":"175 0", "text":"Start"},
		{"key":0, "category":"flowchart.normal", "loc":"0 77", "text":"Preheat oven to 375 F"},
		{"key":1, "category":"flowchart.normal", "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
		{"key":2, "category":"flowchart.normal", "loc":"175 190", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
		{"key":3, "category":"flowchart.normal", "loc":"175 270", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
		{"key":4, "category":"flowchart.normal", "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan"},
		{"key":5, "category":"flowchart.normal", "loc":"352 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
		{"key":6, "category":"flowchart.normal", "loc":"175 440", "text":"Sprinkle nuts on top"},
		{"key":7, "category":"flowchart.normal", "loc":"175 500", "text":"Bake for 25 minutes and let cool"},
		{"key":8, "category":"flowchart.normal", "loc":"175 570", "text":"Cut into rectangular grid"},
		{"key":-2, "category":"flowchart.end", "loc":"175 640", "text":"Enjoy!"}
		 ],
	  "linkDataArray": [
		{"from":1, "to":2, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":2, "to":3, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":3, "to":4, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":4, "to":6, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":6, "to":7, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":7, "to":8, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":8, "to":-2, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":-1, "to":0, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":-1, "to":1, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":-1, "to":5, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":5, "to":4, "category": 'flowchart', "fromPort":"B", "toPort":"T"},
		{"from":0, "to":4, "category": 'flowchart', "fromPort":"B", "toPort":"T"}
	 ]})
	tools.diagram.layout = $$(go.Layout);
}

demo.class_hierarchy = function(){
	// Collect all of the data for the model of the class hierarchy
    var nodeDataArray = [];

    // Iterate over all of the classes in "go"
    for (k in go) {
      var cls = go[k];
      if (!cls) continue;
      var proto = cls.prototype;
      if (!proto) continue;
      proto.constructor.className = k;  // remember name
      // find base class constructor
      var base = Object.getPrototypeOf(proto).constructor;
      if (base === Object) {  // "root" node?
        nodeDataArray.push({ key: k, category: 'class_hierarchy' });
      } else {
        // add a node for this class and a tree-parent reference to the base class name
        nodeDataArray.push({ key: k, category: 'class_hierarchy', parent: base.className });
      }
    }

    // Create the model for the hierarchy diagram
    tools.diagram.model = new go.TreeModel(nodeDataArray);

    // Now collect all node data that are singletons
    var singlesArray = [];  // for classes that don't inherit from another class
    tools.diagram.nodes.each(function(node) {
        if (node.linksConnected.count === 0) {
          singlesArray.push(node.data);
        }
      });

    // Remove the unconnected class nodes from the main Diagram
    tools.diagram.model.removeNodeDataCollection(singlesArray);

    tools.diagram.linkTemplate = tools.link_templates["class_hierarchy"];
	tools.diagram.layout = $$(go.TreeLayout, { nodeSpacing: 3 });
}

demo.dom_tree = function(){
	window.dom_names = {};

	function traverseDom(node, parentName, dataArray) {
    if (parentName === undefined) parentName = null;
    if (dataArray === undefined) dataArray = [];
    // skip everything but HTML Elements
    if (!(node instanceof Element)) return;
    // Ignore the navigation menus
    if (node.id === "navindex" || node.id === "navtop") return;
    // add this node to the nodeDataArray
    var name = getName(node);
    var data = { key: name, name: name, category: 'dom' };
    dataArray.push(data);
    // add a link to its parent
    if (parentName !== null) {
      data.parent = parentName;
    }
    // find all children
    var l = node.childNodes.length;
    for (var i = 0; i < l; i++) {
      traverseDom(node.childNodes[i], name, dataArray);
    }
    return dataArray;
  }

  // Give every node a unique name
  function getName(node) {
    var n = node.nodeName;
    if (node.id) n = n + " (" + node.id + ")";
    var namenum = n;  // make sure the name is unique
    var i = 1;
    while (window.dom_names[namenum] !== undefined) {
      namenum = n + i;
      i++;
    }
    window.dom_names[namenum] = node;
    return namenum;
  }

  tools.diagram.model = $$(go.TreeModel, {
  	isReadOnly: true,
  	nodeDataArray: traverseDom(document.activeElement)
  })

  tools.diagram.layout = $$(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 })
}

demo.icon = function(){
  tools.diagram.model = new go.GraphLinksModel(
    [
      { key: 1, category: 'icon', geo: "file"          , color: "#00B5CB"   },
      { key: 2, category: 'icon', geo: "alarm"         , color: "#F47321" },
      { key: 3, category: 'icon', geo: "lab"           , color: "#00B5CB"   },
      { key: 4, category: 'icon', geo: "earth"         , color: "#00B5CB"  },
      { key: 5, category: 'icon', geo: "heart"         , color: "#C8DA2B"  },
      { key: 6, category: 'icon', geo: "arrow-up-right", color: "#00B5CB"   },
      { key: 7, category: 'icon', geo: "html5"         , color: "#F47321" },
      { key: 8, category: 'icon', geo: "twitter"       , color: "#F47321" }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 3, to: 7 },
      { from: 3, to: 8 }
    ]);
  tools.diagram.layout = $$(go.TreeLayout);
}

demo.entity_relationship = function(){
  var nodeDataArray = [
    { key: "Products", category: 'entity_relationship',
      items: [ { name: "ProductID", iskey: true, figure: "Decision", color: tools.brushes.yellowgrad },
               { name: "ProductName", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad },
               { name: "SupplierID", iskey: false, figure: "Decision", color: "purple" },
               { name: "CategoryID", iskey: false, figure: "Decision", color: "purple" } ] },
    { key: "Suppliers", category: 'entity_relationship',
      items: [ { name: "SupplierID", iskey: true, figure: "Decision", color: tools.brushes.yellowgrad },
               { name: "CompanyName", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad },
               { name: "ContactName", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad },
               { name: "Address", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad } ] },
    { key: "Categories", category: 'entity_relationship',
      items: [ { name: "CategoryID", iskey: true, figure: "Decision", color: tools.brushes.yellowgrad },
               { name: "CategoryName", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad },
               { name: "Description", iskey: false, figure: "Cube1", color: tools.brushes.bluegrad },
               { name: "Picture", iskey: false, figure: "TriangleUp", color: tools.brushes.redgrad } ] },
    { key: "Order Details", category: 'entity_relationship',
      items: [ { name: "OrderID", iskey: true, figure: "Decision", color: tools.brushes.yellowgrad },
               { name: "ProductID", iskey: true, figure: "Decision", color: tools.brushes.yellowgrad },
               { name: "UnitPrice", iskey: false, figure: "MagneticData", color: tools.brushes.greengrad },
               { name: "Quantity", iskey: false, figure: "MagneticData", color: tools.brushes.greengrad },
               { name: "Discount", iskey: false, figure: "MagneticData", color: tools.brushes.greengrad } ] },
  ];
  var linkDataArray = [
    { category: 'entity_relationship', from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
    { category: 'entity_relationship', from: "Products", to: "Categories", text: "0..N", toText: "1" },
    { category: 'entity_relationship', from: "Order Details", to: "Products", text: "0..N", toText: "1" }
  ];
  tools.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  tools.diagram.layout = $$(go.ForceDirectedLayout);
}

demo.gantt = function(){
  tools.diagram.model = new go.GraphLinksModel(
    [ // node data
      { key: "a", category: "gantt", color: "coral", width: 120, loc: new go.Point((0), 40) },
      { key: "b", category: "gantt", color: "turquoise", width: 160, loc: new go.Point((0), 60) },
      { key: "c", category: "gantt", color: "coral", width: 150, loc: new go.Point((120), 80) },
      { key: "d", category: "gantt", color: "turquoise", width: 190, loc: new go.Point((120), 100) },
      { key: "e", category: "gantt", color: "coral", width: 150, loc: new go.Point((270), 120) },
      { key: "f", category: "gantt", color: "turquoise", width: 130, loc: new go.Point((310), 140) },
      { key: "g", category: "gantt", color: "coral", width: 155, loc: new go.Point((420), 160) },
      { key: "begin", category: "gantt_start", loc: new go.Point(-15,20) },
      { key: "end", category: "gantt_end", loc: new go.Point((575), 180) },
      { key: "23Jul", category: "gantt_date", loc: new go.Point((0), 0) },
      { key: "30Jul", category: "gantt_date", loc: new go.Point((150), 0) },
      { key: "6Aug", category: "gantt_date", loc: new go.Point((300), 0) },
      { key: "13Aug", category: "gantt_date", loc: new go.Point((450), 0) }
    ],
    [ // link data
      { category: "gantt", from: "begin", to: "a" },
      { category: "gantt", from: "begin", to: "b" },
      { category: "gantt", from: "a", to: "c" },
      { category: "gantt", from: "a", to: "d" },
      { category: "gantt", from: "b", to: "e" },
      { category: "gantt", from: "c", to: "e" },
      { category: "gantt", from: "d", to: "f" },
      { category: "gantt", from: "e", to: "g" },
      { category: "gantt", from: "f", to: "end" },
      { category: "gantt", from: "g", to: "end" }
    ]);

  tools.diagram.layout = $$(go.Layout);
}

demo.uml = function(){
  // setup a few example class nodes and relationships
    var nodedata = [
      {
        key: 1,
        category: "uml",
        name: "BankAccount",
        properties: [
          { name: "owner", type: "String", visibility: "public" },
          { name: "balance", type: "Currency", visibility: "public", default: "0" }
        ],
        methods: [
          { name: "deposit", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" },
          { name: "withdraw", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" }
        ]
      },
      {
        key: 11,
        category: "uml",
        name: "Person",
        properties: [
          { name: "name", type: "String", visibility: "public" },
          { name: "birth", type: "Date", visibility: "protected" }
        ],
        methods: [
          { name: "getCurrentAge", type: "int", visibility: "public" }
        ]
      },
      {
        key: 12,
        category: "uml",
        name: "Student",
        properties: [
          { name: "classes", type: "List", visibility: "public" }
        ],
        methods: [
          { name: "attend", parameters: [{ name: "class", type: "Course" }], visibility: "private" },
          { name: "sleep", visibility: "private" }
        ]
      },
      {
        key: 13,
        category: "uml",
        name: "Professor",
        properties: [
          { name: "classes", type: "List", visibility: "public" }
        ],
        methods: [
          { name: "teach", parameters: [{ name: "class", type: "Course" }], visibility: "private" }
        ]
      },
      {
        key: 14,
        category: "uml",
        name: "Course",
        properties: [
          { name: "name", type: "String", visibility: "public" },
          { name: "description", type: "String", visibility: "public" },
          { name: "professor", type: "Professor", visibility: "public" },
          { name: "location", type: "String", visibility: "public" },
          { name: "times", type: "List", visibility: "public" },
          { name: "prerequisites", type: "List", visibility: "public" },
          { name: "students", type: "List", visibility: "public" }
        ]
      }
    ];
  var linkdata = [
    { category: "uml", from: 12, to: 11, relationship: "generalization" },
    { category: "uml", from: 13, to: 11, relationship: "generalization" },
    { category: "uml", from: 14, to: 13, relationship: "aggregation" }
  ];
  tools.diagram.model = $$(go.GraphLinksModel,
    {
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: nodedata,
      linkDataArray: linkdata
    });
  tools.diagram.layout = $$(go.TreeLayout, { // this only lays out in trees nodes connected by "generalization" links
      angle: 90,
      path: go.TreeLayout.PathSource,  // links go from child to parent
      setsPortSpot: false,  // keep Spot.AllSides for link connection spot
      setsChildPortSpot: false,  // keep Spot.AllSides
      // nodes not connected by "generalization" links are laid out horizontally
      arrangement: go.TreeLayout.ArrangementHorizontal
    })
}

demo.process_flow = function(){
  tools.diagram.model = go.Model.fromJson({ "class": "go.GraphLinksModel",
    "nodeDataArray": [
  {"key":"P1", "category":"process_flow", "pos":"150 120", "text":"Process"},
  {"key":"P2", "category":"process_flow", "pos":"330 320", "text":"Tank"},
  {"key":"V1", "category":"process_flow_value", "pos":"270 120", "text":"V1"},
  {"key":"P3", "category":"process_flow", "pos":"150 420", "text":"Pump"},
  {"key":"V2", "category":"process_flow_value", "pos":"150 280", "text":"VM", "angle":270},
  {"key":"V3", "category":"process_flow_value", "pos":"270 420", "text":"V2", "angle":180},
  {"key":"P4", "category":"process_flow", "pos":"450 140", "text":"Reserve Tank"},
  {"key":"V4", "category":"process_flow_value", "pos":"390 60", "text":"VA"},
  {"key":"V5", "category":"process_flow_value", "pos":"450 260", "text":"VB", "angle":90}
   ],
    "linkDataArray": [
  {"category":"process_flow", "from":"P1", "to":"V1"},
  {"category":"process_flow", "from":"P3", "to":"V2"},
  {"category":"process_flow", "from":"V2", "to":"P1"},
  {"category":"process_flow", "from":"P2", "to":"V3"},
  {"category":"process_flow", "from":"V3", "to":"P3"},
  {"category":"process_flow", "from":"V1", "to":"V4"},
  {"category":"process_flow", "from":"V4", "to":"P4"},
  {"category":"process_flow", "from":"V1", "to":"P2"},
  {"category":"process_flow", "from":"P4", "to":"V5"},
  {"category":"process_flow", "from":"V5", "to":"P2"}
   ]});
  tools.diagram.layout = $$(go.Layout);

  function loop() {
    setTimeout(function() {
      var oldskips = tools.diagram.skipsUndoManager;
      tools.diagram.skipsUndoManager = true;
      tools.diagram.links.each(function(link) {
          var shape = link.findObject("PIPE");
          var off = shape.strokeDashOffset - 2;
          shape.strokeDashOffset = (off <= 0) ? 20 : off;
        });
      tools.diagram.skipsUndoManager = oldskips;
      loop();
    }, 100);
  }

  loop();
}

demo.state_chart = function(){
  tools.diagram.model = go.Model.fromJson({ "nodeKeyProperty": "id",
    "nodeDataArray": [
      { "category": "state_chart", "id": 0, "loc": "120 120", "text": "Initial" },
      { "category": "state_chart", "id": 1, "loc": "330 120", "text": "First down" },
      { "category": "state_chart", "id": 2, "loc": "226 376", "text": "First up" },
      { "category": "state_chart", "id": 3, "loc": "60 276", "text": "Second down" },
      { "category": "state_chart", "id": 4, "loc": "226 226", "text": "Wait" }
    ],
    "linkDataArray": [
      { "category": "state_chart", "from": 0, "to": 0, "text": "up or timer", "curviness": -20 },
      { "category": "state_chart", "from": 0, "to": 1, "text": "down", "curviness": 20 },
      { "category": "state_chart", "from": 1, "to": 0, "text": "up (moved)\nPOST", "curviness": 20 },
      { "category": "state_chart", "from": 1, "to": 1, "text": "down", "curviness": -20 },
      { "category": "state_chart", "from": 1, "to": 2, "text": "up (no move)" },
      { "category": "state_chart", "from": 1, "to": 4, "text": "timer" },
      { "category": "state_chart", "from": 2, "to": 0, "text": "timer\nPOST" },
      { "category": "state_chart", "from": 2, "to": 3, "text": "down" },
      { "category": "state_chart", "from": 3, "to": 0, "text": "up\nPOST\n(dblclick\nif no move)" },
      { "category": "state_chart", "from": 3, "to": 3, "text": "down or timer", "curviness": 20 },
      { "category": "state_chart", "from": 4, "to": 0, "text": "up\nPOST" },
      { "category": "state_chart", "from": 4, "to": 4, "text": "down" }
    ]
  });
  tools.diagram.layout = $$(go.Layout);
}

demo.freehand_drawing = function(){
  tools.diagram.model = go.Model.fromJson({ 
    "class": "go.GraphLinksModel",
    "nodeDataArray": [ {"loc":"301 143", "category":"FreehandDrawing", "geo":"M0 70 L1 70 L2 70 L3 70 L5 70 L7 70 L8 70 L11 70 L13 70 L18 69 L21 69 L25 68 L29 67 L34 67 L38 67 L42 67 L47 66 L50 66 L53 66 L55 66 L57 66 L60 66 L63 66 L64 66 L66 66 L68 66 L70 66 L72 66 L74 66 L76 66 L78 65 L81 65 L83 65 L85 65 L88 65 L90 65 L92 65 L95 65 L98 65 L100 65 L102 65 L104 65 L106 65 L109 65 L110 65 L111 65 L112 65 L113 65 L114 65 L115 65 L116 65 L118 65 L119 65 L120 65 L121 65 L122 65 L123 65 L124 65 L125 65 L126 65 L127 65 L128 65 L129 65 L131 65 L131 64 L132 64 L133 64 L134 64 L135 64 L137 64 L138 64 L139 64 L140 64 L141 64 L140 64 L139 64 L138 64 L137 64 L135 65 L134 65 L132 66 L130 67 L129 67 L126 68 L123 70 L121 71 L119 72 L116 73 L114 74 L111 76 L109 77 L106 78 L104 79 L99 81 L96 84 L94 84 L90 87 L89 87 L87 88 L86 89 L84 89 L83 90 L81 91 L80 92 L79 92 L77 93 L76 94 L74 94 L74 95 L73 96 L71 96 L70 97 L68 98 L67 98 L66 99 L64 99 L64 100 L62 100 L61 101 L60 102 L59 102 L58 103 L57 103 L57 104 L56 104 L56 105 L54 105 L54 107 L53 107 L52 108 L51 108 L51 109 L49 110 L48 111 L47 112 L47 113 L46 113 L45 114 L44 114 L44 115 L44 116 L43 116 L43 117 L42 117 L42 119 L41 119 L41 120 L40 120 L40 121 L39 122 L39 123 L38 124 L37 125 L36 126 L36 127 L35 128 L34 128 L34 129 L33 130 L33 131 L32 131 L32 130 L32 129 L33 128 L34 125 L35 122 L37 119 L39 115 L41 111 L41 106 L43 103 L45 98 L47 93 L48 90 L49 86 L51 83 L52 81 L54 78 L55 74 L55 71 L56 68 L57 65 L58 62 L58 59 L58 55 L58 53 L58 51 L58 49 L58 48 L59 45 L60 44 L60 42 L61 40 L61 38 L62 36 L64 32 L64 30 L65 29 L66 27 L66 26 L66 25 L66 24 L67 23 L67 22 L67 21 L67 20 L67 19 L68 19 L68 18 L68 17 L69 16 L69 15 L69 14 L69 12 L69 11 L69 10 L70 9 L70 8 L70 7 L70 6 L71 5 L71 4 L71 3 L71 2 L71 1 L71 0 L71 1 L71 2 L71 5 L71 6 L71 8 L71 9 L71 12 L71 14 L72 16 L72 18 L73 20 L73 23 L74 25 L74 27 L75 29 L76 32 L77 34 L78 35 L79 38 L79 39 L81 42 L81 43 L82 45 L83 46 L83 47 L83 49 L85 50 L86 52 L86 55 L86 58 L88 60 L89 62 L89 64 L90 66 L91 67 L91 69 L92 70 L92 71 L93 72 L94 73 L94 74 L94 75 L95 76 L96 77 L96 79 L97 81 L98 82 L98 83 L98 84 L99 85 L99 86 L100 87 L100 90 L101 91 L102 92 L102 93 L103 95 L103 96 L103 97 L104 98 L104 100 L104 101 L105 102 L106 103 L106 104 L107 106 L108 108 L109 110 L110 111 L111 113 L112 114 L113 115 L113 117 L115 119 L116 121 L116 123 L118 124 L119 126 L120 127 L121 129 L121 130 L122 131 L123 131 L123 132 L124 132 L124 133 L125 134 L125 135 L126 135 L127 136 L128 137 L129 138 L130 139 L131 140 L130 139 L129 138 L128 138 L126 136 L124 136 L123 134 L121 133 L118 131 L116 130 L114 128 L111 127 L107 123 L105 122 L102 120 L100 119 L98 117 L95 116 L93 114 L90 113 L88 111 L85 110 L83 108 L81 106 L78 105 L77 104 L75 103 L72 102 L71 101 L70 100 L68 99 L67 98 L65 98 L64 97 L62 96 L60 96 L58 95 L57 94 L54 93 L53 93 L51 92 L49 91 L48 91 L47 91 L45 90 L44 90 L43 89 L42 89 L41 89 L40 88 L39 87 L37 87 L36 86 L35 85 L33 85 L32 84 L31 84 L30 83 L29 83 L28 82 L26 81 L25 81 L24 80 L22 80 L21 79 L21 78 L20 78 L19 78 L18 77 L17 77 L16 76 L15 76 L15 75 L14 75 L13 75 L12 74 L11 74 L10 74 L9 74 L7 73 L5 72 L4 72 L3 72 L2 71", "key":-1} ],
    "linkDataArray": [  ]
  });
  tools.diagram.layout = $$(go.Layout);
}

demo.sankey = function(){
  tools.diagram.model = go.Model.fromJson({ 
    "class": "go.GraphLinksModel",
    "nodeDataArray": [
      {"category":"sankey", "key":"Coal reserves", "text":"Coal reserves", "color":"#9d75c2"},
      {"category":"sankey", "key":"Coal imports", "text":"Coal imports", "color":"#9d75c2"},
      {"category":"sankey", "key":"Oil reserves", "text":"Oil\nreserves", "color":"#9d75c2"},
      {"category":"sankey", "key":"Oil imports", "text":"Oil imports", "color":"#9d75c2"},
      {"category":"sankey", "key":"Gas reserves", "text":"Gas reserves", "color":"#a1e194"},
      {"category":"sankey", "key":"Gas imports", "text":"Gas imports", "color":"#a1e194"},
      {"category":"sankey", "key":"UK land based bioenergy", "text":"UK land based bioenergy", "color":"#f6bcd5"},
      {"category":"sankey", "key":"Marine algae", "text":"Marine algae", "color":"#681313"},
      {"category":"sankey", "key":"Agricultural 'waste'", "text":"Agricultural 'waste'", "color":"#3483ba"},
      {"category":"sankey", "key":"Other waste", "text":"Other waste", "color":"#c9b7d8"},
      {"category":"sankey", "key":"Biomass imports", "text":"Biomass imports", "color":"#fea19f"},
      {"category":"sankey", "key":"Biofuel imports", "text":"Biofuel imports", "color":"#d93c3c"},
      {"category":"sankey", "key":"Coal", "text":"Coal", "color":"#9d75c2"},
      {"category":"sankey", "key":"Oil", "text":"Oil", "color":"#9d75c2"},
      {"category":"sankey", "key":"Natural gas", "text":"Natural\ngas", "color":"#a6dce6"},
      {"category":"sankey", "key":"Solar", "text":"Solar", "color":"#c9a59d"},
      {"category":"sankey", "key":"Solar PV", "text":"Solar PV", "color":"#c9a59d"},
      {"category":"sankey", "key":"Bio-conversion", "text":"Bio-conversion", "color":"#b5cbe9"},
      {"category":"sankey", "key":"Solid", "text":"Solid", "color":"#40a840"},
      {"category":"sankey", "key":"Liquid", "text":"Liquid", "color":"#fe8b25"},
      {"category":"sankey", "key":"Gas", "text":"Gas", "color":"#a1e194"},
      {"category":"sankey", "key":"Nuclear", "text":"Nuclear", "color":"#fea19f"},
      {"category":"sankey", "key":"Thermal generation", "text":"Thermal\ngeneration", "color":"#3483ba"},
      {"category":"sankey", "key":"CHP", "text":"CHP", "color":"yellow"},
      {"category":"sankey", "key":"Electricity imports", "text":"Electricity imports", "color":"yellow"},
      {"category":"sankey", "key":"Wind", "text":"Wind", "color":"#cbcbcb"},
      {"category":"sankey", "key":"Tidal", "text":"Tidal", "color":"#6f3a5f"},
      {"category":"sankey", "key":"Wave", "text":"Wave", "color":"#8b8b8b"},
      {"category":"sankey", "key":"Geothermal", "text":"Geothermal", "color":"#556171"},
      {"category":"sankey", "key":"Hydro", "text":"Hydro", "color":"#7c3e06"},
      {"category":"sankey", "key":"Electricity grid", "text":"Electricity grid", "color":"#e483c7"},
      {"category":"sankey", "key":"H2 conversion", "text":"H2 conversion", "color":"#868686"},
      {"category":"sankey", "key":"Solar Thermal", "text":"Solar Thermal", "color":"#c9a59d"},
      {"category":"sankey", "key":"H2", "text":"H2", "color":"#868686"},
      {"category":"sankey", "key":"Pumped heat", "text":"Pumped heat", "color":"#96665c"},
      {"category":"sankey", "key":"District heating", "text":"District heating", "color":"#c9b7d8"},
      {"category":"sankey", "key":"Losses", "ltext":"Losses", "color":"#fec184"},
      {"category":"sankey", "key":"Over generation / exports", "ltext":"Over generation / exports", "color":"#f6bcd5"},
      {"category":"sankey", "key":"Heating and cooling - homes", "ltext":"Heating and cooling - homes", "color":"#c7a39b"},
      {"category":"sankey", "key":"Road transport", "ltext":"Road transport", "color":"#cbcbcb"},
      {"category":"sankey", "key":"Heating and cooling - commercial", "ltext":"Heating and cooling - commercial", "color":"#c9a59d"},
      {"category":"sankey", "key":"Industry", "ltext":"Industry", "color":"#96665c"},
      {"category":"sankey", "key":"Lighting & appliances - homes", "ltext":"Lighting & appliances - homes", "color":"#2dc3d2"},
      {"category":"sankey", "key":"Lighting & appliances - commercial", "ltext":"Lighting & appliances - commercial", "color":"#2dc3d2"},
      {"category":"sankey", "key":"Agriculture", "ltext":"Agriculture", "color":"#5c5c10"},
      {"category":"sankey", "key":"Rail transport", "ltext":"Rail transport", "color":"#6b6b45"},
      {"category":"sankey", "key":"Domestic aviation", "ltext":"Domestic aviation", "color":"#40a840"},
      {"category":"sankey", "key":"National navigation", "ltext":"National navigation", "color":"#a1e194"},
      {"category":"sankey", "key":"International aviation", "ltext":"International aviation", "color":"#fec184"},
      {"category":"sankey", "key":"International shipping", "ltext":"International shipping", "color":"#fec184"},
      {"category":"sankey", "key":"Geosequestration", "ltext":"Geosequestration", "color":"#fec184"}
    ], 
    "linkDataArray": [
      {"category":"sankey", "from":"Coal reserves", "to":"Coal", "width":31},
      {"category":"sankey", "from":"Coal imports", "to":"Coal", "width":86},
      {"category":"sankey", "from":"Oil reserves", "to":"Oil", "width":244},
      {"category":"sankey", "from":"Oil imports", "to":"Oil", "width":1},
      {"category":"sankey", "from":"Gas reserves", "to":"Natural gas", "width":182},
      {"category":"sankey", "from":"Gas imports", "to":"Natural gas", "width":61},
      {"category":"sankey", "from":"UK land based bioenergy", "to":"Bio-conversion", "width":1},
      {"category":"sankey", "from":"Marine algae", "to":"Bio-conversion", "width":1},
      {"category":"sankey", "from":"Agricultural 'waste'", "to":"Bio-conversion", "width":1},
      {"category":"sankey", "from":"Other waste", "to":"Bio-conversion", "width":8},
      {"category":"sankey", "from":"Other waste", "to":"Solid", "width":1},
      {"category":"sankey", "from":"Biomass imports", "to":"Solid", "width":1},
      {"category":"sankey", "from":"Biofuel imports", "to":"Liquid", "width":1},
      {"category":"sankey", "from":"Coal", "to":"Solid", "width":117},
      {"category":"sankey", "from":"Oil", "to":"Liquid", "width":244},
      {"category":"sankey", "from":"Natural gas", "to":"Gas", "width":244},
      {"category":"sankey", "from":"Solar", "to":"Solar PV", "width":1},
      {"category":"sankey", "from":"Solar PV", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Solar", "to":"Solar Thermal", "width":1},
      {"category":"sankey", "from":"Bio-conversion", "to":"Solid", "width":3},
      {"category":"sankey", "from":"Bio-conversion", "to":"Liquid", "width":1},
      {"category":"sankey", "from":"Bio-conversion", "to":"Gas", "width":5},
      {"category":"sankey", "from":"Bio-conversion", "to":"Losses", "width":1},
      {"category":"sankey", "from":"Solid", "to":"Over generation / exports", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"Over generation / exports", "width":18},
      {"category":"sankey", "from":"Gas", "to":"Over generation / exports", "width":1},
      {"category":"sankey", "from":"Solid", "to":"Thermal generation", "width":106},
      {"category":"sankey", "from":"Liquid", "to":"Thermal generation", "width":2},
      {"category":"sankey", "from":"Gas", "to":"Thermal generation", "width":87},
      {"category":"sankey", "from":"Nuclear", "to":"Thermal generation", "width":41},
      {"category":"sankey", "from":"Thermal generation", "to":"District heating", "width":2},
      {"category":"sankey", "from":"Thermal generation", "to":"Electricity grid", "width":92},
      {"category":"sankey", "from":"Thermal generation", "to":"Losses", "width":142},
      {"category":"sankey", "from":"Solid", "to":"CHP", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"CHP", "width":1},
      {"category":"sankey", "from":"Gas", "to":"CHP", "width":1},
      {"category":"sankey", "from":"CHP", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"CHP", "to":"Losses", "width":1},
      {"category":"sankey", "from":"Electricity imports", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Wind", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Tidal", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Wave", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Geothermal", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Hydro", "to":"Electricity grid", "width":1},
      {"category":"sankey", "from":"Electricity grid", "to":"H2 conversion", "width":1},
      {"category":"sankey", "from":"Electricity grid", "to":"Over generation / exports", "width":1},
      {"category":"sankey", "from":"Electricity grid", "to":"Losses", "width":6},
      {"category":"sankey", "from":"Gas", "to":"H2 conversion", "width":1},
      {"category":"sankey", "from":"H2 conversion", "to":"H2", "width":1},
      {"category":"sankey", "from":"H2 conversion", "to":"Losses", "width":1},
      {"category":"sankey", "from":"Solar Thermal", "to":"Heating and cooling - homes", "width":1},
      {"category":"sankey", "from":"H2", "to":"Road transport", "width":1},
      {"category":"sankey", "from":"Pumped heat", "to":"Heating and cooling - homes", "width":1},
      {"category":"sankey", "from":"Pumped heat", "to":"Heating and cooling - commercial", "width":1},
      {"category":"sankey", "from":"CHP", "to":"Heating and cooling - homes", "width":1},
      {"category":"sankey", "from":"CHP", "to":"Heating and cooling - commercial", "width":1},
      {"category":"sankey", "from":"District heating", "to":"Heating and cooling - homes", "width":1},
      {"category":"sankey", "from":"District heating", "to":"Heating and cooling - commercial", "width":1},
      {"category":"sankey", "from":"District heating", "to":"Industry", "width":2},
      {"category":"sankey", "from":"Electricity grid", "to":"Heating and cooling - homes", "width":7},
      {"category":"sankey", "from":"Solid", "to":"Heating and cooling - homes", "width":3},
      {"category":"sankey", "from":"Liquid", "to":"Heating and cooling - homes", "width":3},
      {"category":"sankey", "from":"Gas", "to":"Heating and cooling - homes", "width":81},
      {"category":"sankey", "from":"Electricity grid", "to":"Heating and cooling - commercial", "width":7},
      {"category":"sankey", "from":"Solid", "to":"Heating and cooling - commercial", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"Heating and cooling - commercial", "width":2},
      {"category":"sankey", "from":"Gas", "to":"Heating and cooling - commercial", "width":19},
      {"category":"sankey", "from":"Electricity grid", "to":"Lighting & appliances - homes", "width":21},
      {"category":"sankey", "from":"Gas", "to":"Lighting & appliances - homes", "width":2},
      {"category":"sankey", "from":"Electricity grid", "to":"Lighting & appliances - commercial", "width":18},
      {"category":"sankey", "from":"Gas", "to":"Lighting & appliances - commercial", "width":2},
      {"category":"sankey", "from":"Electricity grid", "to":"Industry", "width":30},
      {"category":"sankey", "from":"Solid", "to":"Industry", "width":13},
      {"category":"sankey", "from":"Liquid", "to":"Industry", "width":34},
      {"category":"sankey", "from":"Gas", "to":"Industry", "width":54},
      {"category":"sankey", "from":"Electricity grid", "to":"Agriculture", "width":1},
      {"category":"sankey", "from":"Solid", "to":"Agriculture", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"Agriculture", "width":1},
      {"category":"sankey", "from":"Gas", "to":"Agriculture", "width":1},
      {"category":"sankey", "from":"Electricity grid", "to":"Road transport", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"Road transport", "width":122},
      {"category":"sankey", "from":"Electricity grid", "to":"Rail transport", "width":2},
      {"category":"sankey", "from":"Liquid", "to":"Rail transport", "width":1},
      {"category":"sankey", "from":"Liquid", "to":"Domestic aviation", "width":2},
      {"category":"sankey", "from":"Liquid", "to":"National navigation", "width":4},
      {"category":"sankey", "from":"Liquid", "to":"International aviation", "width":38},
      {"category":"sankey", "from":"Liquid", "to":"International shipping", "width":13},
      {"category":"sankey", "from":"Electricity grid", "to":"Geosequestration", "width":1},
      {"category":"sankey", "from":"Gas", "to":"Losses", "width":2}
     ]})
  tools.diagram.layout = $$(SankeyLayout,{
        setsPortSpots: false,  // to allow the "Side" spots on the nodes to take effect
        direction: 0,  // rightwards
        layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
        packOption: go.LayeredDigraphLayout.PackStraighten || go.LayeredDigraphLayout.PackMedian,
        layerSpacing: 150,  // lots of space between layers, for nicer thick links
        columnSpacing: 1
      })
}

demo.pert = function(){
      // here's the data defining the graph
  var nodeDataArray = [
    { category: "pert", key: 1, text: "Start", length: 0, earlyStart: 0, lateFinish: 0, critical: true },
    { category: "pert", key: 2, text: "a", length: 4, earlyStart: 0, lateFinish: 4, critical: true },
    { category: "pert", key: 3, text: "b", length: 5.33, earlyStart: 0, lateFinish: 9.17, critical: false },
    { category: "pert", key: 4, text: "c", length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: true },
    { category: "pert", key: 5, text: "d", length: 6.33, earlyStart: 4, lateFinish: 15.01, critical: false },
    { category: "pert", key: 6, text: "e", length: 5.17, earlyStart: 9.17, lateFinish: 14.34, critical: true },
    { category: "pert", key: 7, text: "f", length: 4.5, earlyStart: 10.33, lateFinish: 19.51, critical: false },
    { category: "pert", key: 8, text: "g", length: 5.17, earlyStart: 14.34, lateFinish: 19.51, critical: true },
    { category: "pert", key: 9, text: "Finish", length: 0, earlyStart: 19.51, lateFinish: 19.51, critical: true }
  ];
  var linkDataArray = [
    { category: "pert", from: 1, to: 2 },
    { category: "pert", from: 1, to: 3 },
    { category: "pert", from: 2, to: 4 },
    { category: "pert", from: 2, to: 5 },
    { category: "pert", from: 3, to: 6 },
    { category: "pert", from: 4, to: 6 },
    { category: "pert", from: 5, to: 7 },
    { category: "pert", from: 6, to: 8 },
    { category: "pert", from: 7, to: 9 },
    { category: "pert", from: 8, to: 9 }
  ];
  tools.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  tools.diagram.layout = $$(go.LayeredDigraphLayout);

  // create an unbound Part that acts as a "legend" for the diagram
  tools.diagram.add(
    $$(go.Node, "Auto",
      $$(go.Shape, "Rectangle",  // the border
        { fill: "#B3E5FC" } ),
      $$(go.Panel, "Table",
        $$(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
        $$(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
        $$(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: "#B3E5FC", coversSeparators: true }),
        $$(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
        $$(go.TextBlock, "Early Start",
          { row: 0, column: 0, margin: 5, textAlign: "center" }),
        $$(go.TextBlock, "Length",
          { row: 0, column: 1, margin: 5, textAlign: "center" }),
        $$(go.TextBlock, "Early Finish",
          { row: 0, column: 2, margin: 5, textAlign: "center" }),

        $$(go.TextBlock, "Activity Name",
          { row: 1, column: 0, columnSpan: 3, margin: 5,
            textAlign: "center", font: "bold 14px sans-serif" }),

        $$(go.TextBlock, "Late Start",
          { row: 2, column: 0, margin: 5, textAlign: "center" }),
        $$(go.TextBlock, "Slack",
          { row: 2, column: 1, margin: 5, textAlign: "center" }),
        $$(go.TextBlock, "Late Finish",
          { row: 2, column: 2, margin: 5, textAlign: "center" })
      )  // end Table Panel
    ));
}