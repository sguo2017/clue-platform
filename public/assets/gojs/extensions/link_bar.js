// This custom Link class was adapted from several of the samples
function BarLink() {
  go.Link.call(this);
}
go.Diagram.inherit(BarLink, go.Link);

BarLink.prototype.getLinkPoint = function(node, port, spot, from, ortho, othernode, otherport) {
  var r = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
                      port.getDocumentPoint(go.Spot.BottomRight));
  var op = otherport.getDocumentPoint(go.Spot.Center);
  var main = node.category === "timeline_line" ? node.findMainElement(): othernode.findMainElement();
  var mainOffY = main.actualBounds.y;
  var y = r.top;
  if (node.category === "timeline_line") {
    y += mainOffY;
    if (op.x < r.left) return new go.Point(r.left, y);
    if (op.x > r.right) return new go.Point(r.right, y);
    return new go.Point(op.x, y);
  } else {
    return new go.Point(r.centerX, r.bottom);
  }
};

BarLink.prototype.getLinkDirection = function(node, port, linkpoint, spot, from, ortho, othernode, otherport) {
  return 270;
};
// end BarLink class