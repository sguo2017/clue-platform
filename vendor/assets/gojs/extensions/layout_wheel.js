  function WheelLayout() {
    go.CircularLayout.call(this);
  }
  go.Diagram.inherit(WheelLayout, go.CircularLayout);

  // override makeNetwork to set the diameter of each node and ignore the TextBlock label
  /** @override */
  WheelLayout.prototype.makeNetwork = function(coll) {
    var net = go.CircularLayout.prototype.makeNetwork.call(this, coll);
    net.vertexes.each(function(cv) {
      cv.diameter = 20;  // because our desiredSize for nodes is (20, 20)
    });
    return net;
  }

  // override commitNodes to rotate nodes so the text goes away from the center,
  // and flip text if it would be upside-down
  /** @override */
  WheelLayout.prototype.commitNodes = function() {
    go.CircularLayout.prototype.commitNodes.call(this);
    this.network.vertexes.each(function(v) {
      var node = v.node;
      if (node === null) return;
      // get the angle of the node towards the center, and rotate it accordingly
      var a = v.actualAngle;
      if (a > 90 && a < 270) {  // make sure the text isn't upside down
        var textBlock = node.findObject("TEXTBLOCK");
        textBlock.angle = 180;
      }
      node.angle = a;
    });
  };
  // end WheelLayout class