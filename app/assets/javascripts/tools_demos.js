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