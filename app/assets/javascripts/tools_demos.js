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