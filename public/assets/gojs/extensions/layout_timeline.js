// This custom Layout locates the timeline bar at (0,0)
// and alternates the event Nodes above and below the bar at
// the X-coordinate locations determined by their data.date values.
function TimelineLayout() {
  go.Layout.call(this);
};
go.Diagram.inherit(TimelineLayout, go.Layout);

TimelineLayout.prototype.doLayout = function(coll) {
  var diagram = this.diagram;
  if (diagram === null) return;
  coll = this.collectParts(coll);
  diagram.startTransaction("TimelineLayout");

  var line = null;
  var parts = [];
  var it = coll.iterator;
  while (it.next()) {
    var part = it.value;
    if (part instanceof go.Link) continue;
    if (part.category === "timeline_line") { line = part; continue; }
    parts.push(part);
    var x = part.data.date;
    if (x === undefined) { x = new Date(); part.data.date = x; }
  }
  if (!line) throw Error("No node of category 'timeline_line' for TimelineLayout");

  line.location = new go.Point(0, 0);

  // lay out the events above the timeline
  if (parts.length > 0) {
    // determine the offset from the main shape to the timeline's boundaries
    var main = line.findMainElement();
    var sw = main.strokeWidth;
    var mainOffX = main.actualBounds.x;
    var mainOffY = main.actualBounds.y;
    // spacing is between the Line and the closest Nodes, defaults to 30
    var spacing = line.data.lineSpacing;
    if (!spacing) spacing = 30;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var bnds = part.actualBounds;
      var dt = part.data.date;

      var timeline = diagram.model.findNodeDataForKey("timeline");
      var startDate = timeline.start;
      var startDateMs = startDate.getTime() + startDate.getTimezoneOffset() * 60000;
      var dateInMs = dt.getTime() + dt.getTimezoneOffset() * 60000;
      var msSinceStart = dateInMs - startDateMs;
      var msPerDay = 24 * 60 * 60 * 1000;
      var val = msSinceStart / msPerDay;

      var pt = line.graduatedPointForValue(val);
      var tempLoc = new go.Point(pt.x, pt.y - bnds.height / 2 - spacing);
      // check if this node will overlap with previously placed events, and offset if needed
      for (var j = 0; j < i; j++) {
        var partRect = new go.Rect(tempLoc.x, tempLoc.y, bnds.width, bnds.height);
        var otherLoc = parts[j].location;
        var otherBnds = parts[j].actualBounds;
        var otherRect = new go.Rect(otherLoc.x, otherLoc.y, otherBnds.width, otherBnds.height);
        if (partRect.intersectsRect(otherRect)) {
          tempLoc.offset(0, -otherBnds.height - 10);
          j = 0; // now that we have a new location, we need to recheck in case we overlap with an event we didn't overlap before
        }
      }
      part.location = tempLoc;
    }
  }

  diagram.commitTransaction("TimelineLayout");
};
// end TimelineLayout class