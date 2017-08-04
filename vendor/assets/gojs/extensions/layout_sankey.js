  function SankeyLayout() {
    go.LayeredDigraphLayout.call(this);
  }
  go.Diagram.inherit(SankeyLayout, go.LayeredDigraphLayout);

  // Before creating the LayeredDigraphNetwork of vertexes and edges,
  // determine the desired height of each node (Shape).
  /** @override */
  SankeyLayout.prototype.createNetwork = function() {
    this.diagram.nodes.each(function(node) {
      var height = getAutoHeightForNode(node);
      var font = "bold " + Math.max(12, Math.round(height / 8)) + "pt Segoe UI, sans-serif"
      var shape = node.findObject("SHAPE");
      var text = node.findObject("TEXT");
      var ltext = node.findObject("LTEXT");
      if (shape) shape.height = height;
      if (text) text.font = font;
      if (ltext) ltext.font = font;
    });
    return go.LayeredDigraphLayout.prototype.createNetwork.call(this);
  };

  function getAutoHeightForNode(node) {
    var heightIn = 0;
    var it = node.findLinksInto()
    while (it.next()) {
      var link = it.value;
      heightIn += link.computeThickness();
    }
    var heightOut = 0;
    var it = node.findLinksOutOf()
    while (it.next()) {
      var link = it.value;
      heightOut += link.computeThickness();
    }
    var h = Math.max(heightIn, heightOut);
    if (h < 10) h = 10;
    return h;
  };

  // treat dummy vertexes as having the thickness of the link that they are in
  /** @override */
  SankeyLayout.prototype.nodeMinColumnSpace = function(v, topleft) {
    if (v.node === null) {
      if (v.edgesCount >= 1) {
        var max = 1;
        var it = v.edges;
        while (it.next()) {
          var edge = it.value;
          if (edge.link != null) {
            var t = edge.link.computeThickness();
            if (t > max) max = t;
            break;
          }
        }
        return Math.ceil(max/this.columnSpacing);
      }
      return 1;
    }
    return go.LayeredDigraphLayout.prototype.nodeMinColumnSpace.call(this, v, topleft);
  }

  /** @override */
  SankeyLayout.prototype.assignLayers = function() {
    go.LayeredDigraphLayout.prototype.assignLayers.call(this);
    var maxlayer = this.maxLayer;
    // now make sure every vertex with no outputs is maxlayer
    for (var it = this.network.vertexes.iterator; it.next() ;) {
      var v = it.value;
      var node = v.node;
      var key = node.key;
      if (v.destinationVertexes.count == 0) {
        v.layer = 0;
      }
      if (v.sourceVertexes.count == 0) {
        v.layer = maxlayer;
      }
    }
    // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
    // (other than the ones that are the widest or tallest in their respective layer).
  };

  /** @override */
  SankeyLayout.prototype.commitLayout = function() {
    go.LayeredDigraphLayout.prototype.commitLayout.call(this);
    for (var it = this.network.edges.iterator; it.next();) {
      var link = it.value.link;
      if (link && link.curve === go.Link.Bezier) {
        // depend on Link.adjusting === go.Link.End to fix up the end points of the links
        // without losing the intermediate points of the route as determined by LayeredDigraphLayout
        link.invalidateRoute();
      }
    }
  };
  // end of SankeyLayout