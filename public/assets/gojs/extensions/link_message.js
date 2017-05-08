

// some parameters
var LinePrefix = 20;  // vertical starting point in document for all Messages and Activations
var LineSuffix = 30;  // vertical length beyond the last message time
var MessageSpacing = 20;  // vertical distance between Messages at different steps
var ActivityWidth = 10;  // width of each vertical activity bar
var ActivityStart = 5;  // height before start message time
var ActivityEnd = 5;  // height beyond end message time
// time is just an abstract small non-negative integer
// here we map between an abstract time and a vertical position
function convertTimeToY(t) {
  return t * MessageSpacing + LinePrefix;
}
function convertYToTime(y) {
  return (y - LinePrefix) / MessageSpacing;
}

// a custom routed Link
function MessageLink() {
  go.Link.call(this);
  this.time = 0;  // use this "time" value when this is the temporaryLink
}
go.Diagram.inherit(MessageLink, go.Link);

/** @override */
MessageLink.prototype.getLinkPoint = function(node, port, spot, from, ortho, othernode, otherport) {
  var p = port.getDocumentPoint(go.Spot.Center);
  var r = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
                      port.getDocumentPoint(go.Spot.BottomRight));
  var op = otherport.getDocumentPoint(go.Spot.Center);

  var data = this.data;
  var time = data !== null ? data.time : this.time;  // if not bound, assume this has its own "time" property

  var aw = this.findActivityWidth(node, time);
  var x = (op.x > p.x ? p.x + aw / 2 : p.x - aw / 2);
  var y = convertTimeToY(time);
  return new go.Point(x, y);
};

MessageLink.prototype.findActivityWidth = function(node, time) {
  var aw = ActivityWidth;
  if (node instanceof go.Group) {
    // see if there is an Activity Node at this point -- if not, connect the link directly with the Group's lifeline
    if (!node.memberParts.any(function(mem) {
            var act = mem.data;
            return (act !== null && act.start <= time && time <= act.start + act.duration);
    })) {
      aw = 0;
    }
  }
  return aw;
};

/** @override */
MessageLink.prototype.getLinkDirection = function(node, port, linkpoint, spot, from, ortho, othernode, otherport) {
  var p = port.getDocumentPoint(go.Spot.Center);
  var op = otherport.getDocumentPoint(go.Spot.Center);
  var right = op.x > p.x;
  return right ? 0 : 180;
};

/** @override */
MessageLink.prototype.computePoints = function() {
  if (this.fromNode === this.toNode) {  // also handle a reflexive link as a simple orthogonal loop
    var data = this.data;
    var time = data !== null ? data.time : this.time;  // if not bound, assume this has its own "time" property
    var p = this.fromNode.port.getDocumentPoint(go.Spot.Center);
    var aw = this.findActivityWidth(this.fromNode, time);

    var x = p.x + aw / 2;
    var y = convertTimeToY(time);
    this.clearPoints();
    this.addPoint(new go.Point(x, y));
    this.addPoint(new go.Point(x + 50, y));
    this.addPoint(new go.Point(x + 50, y + 5));
    this.addPoint(new go.Point(x, y + 5));
    return true;
  } else {
    return go.Link.prototype.computePoints.call(this);
  }
}

// end MessageLink


function ensureLifelineHeights(e) {
  // iterate over all Activities (ignore Groups)
  var arr = myDiagram.model.nodeDataArray;
  var max = -1;
  for (var i = 0; i < arr.length; i++) {
    var act = arr[i];
    if (act.isGroup) continue;
    max = Math.max(max, act.start + act.duration);
  }
  if (max > 0) {
    // now iterate over only Groups
    for (var i = 0; i < arr.length; i++) {
      var gr = arr[i];
      if (!gr.isGroup) continue;
      if (max > gr.duration) {  // this only extends, never shrinks
        myDiagram.model.setDataProperty(gr, "duration", max);
      }
    }
  }
}

// a custom LinkingTool that fixes the "time" (i.e. the Y coordinate)
// for both the temporaryLink and the actual newly created Link
function MessagingTool() {
  go.LinkingTool.call(this);
  var $ = go.GraphObject.make;
  this.temporaryLink =
    $(MessageLink,
      $(go.Shape, "Rectangle",
        { stroke: "magenta", strokeWidth: 2 }),
      $(go.Shape,
        { toArrow: "OpenTriangle", stroke: "magenta" }));
};
go.Diagram.inherit(MessagingTool, go.LinkingTool);

/** @override */
MessagingTool.prototype.doActivate = function() {
  go.LinkingTool.prototype.doActivate.call(this);
  var time = convertYToTime(this.diagram.firstInput.documentPoint.y);
  this.temporaryLink.time = Math.ceil(time);  // round up to an integer value
};

/** @override */
MessagingTool.prototype.insertLink = function(fromnode, fromport, tonode, toport) {
  var newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
  if (newlink !== null) {
    var model = this.diagram.model;
    // specify the time of the message
    var start = this.temporaryLink.time;
    var duration = 1;
    newlink.data.time = start;
    model.setDataProperty(newlink.data, "text", "msg");
    // and create a new Activity node data in the "to" group data
    var newact = {
      group: newlink.data.to,
      start: start,
      duration: duration
    };
    model.addNodeData(newact);
    // now make sure all Lifelines are long enough
    ensureLifelineHeights();
  }
  return newlink;
};
// end MessagingTool