function convertTimeToY(t){return t*MessageSpacing+LinePrefix}function convertYToTime(t){return(t-LinePrefix)/MessageSpacing}function MessageLink(){go.Link.call(this),this.time=0}function ensureLifelineHeights(){for(var t=myDiagram.model.nodeDataArray,i=-1,o=0;o<t.length;o++){var e=t[o];e.isGroup||(i=Math.max(i,e.start+e.duration))}if(i>0)for(var o=0;o<t.length;o++){var n=t[o];n.isGroup&&(i>n.duration&&myDiagram.model.setDataProperty(n,"duration",i))}}function MessagingTool(){go.LinkingTool.call(this);var t=go.GraphObject.make;this.temporaryLink=t(MessageLink,t(go.Shape,"Rectangle",{stroke:"magenta",strokeWidth:2}),t(go.Shape,{toArrow:"OpenTriangle",stroke:"magenta"}))}var LinePrefix=20,LineSuffix=30,MessageSpacing=20,ActivityWidth=10,ActivityStart=5,ActivityEnd=5;go.Diagram.inherit(MessageLink,go.Link),MessageLink.prototype.getLinkPoint=function(t,i,o,e,n,r,a){var s=i.getDocumentPoint(go.Spot.Center),g=(new go.Rect(i.getDocumentPoint(go.Spot.TopLeft),i.getDocumentPoint(go.Spot.BottomRight)),a.getDocumentPoint(go.Spot.Center)),c=this.data,m=null!==c?c.time:this.time,u=this.findActivityWidth(t,m),p=g.x>s.x?s.x+u/2:s.x-u/2,d=convertTimeToY(m);return new go.Point(p,d)},MessageLink.prototype.findActivityWidth=function(t,i){var o=ActivityWidth;return t instanceof go.Group&&(t.memberParts.any(function(t){var o=t.data;return null!==o&&o.start<=i&&i<=o.start+o.duration})||(o=0)),o},MessageLink.prototype.getLinkDirection=function(t,i,o,e,n,r,a,s){var g=i.getDocumentPoint(go.Spot.Center);return s.getDocumentPoint(go.Spot.Center).x>g.x?0:180},MessageLink.prototype.computePoints=function(){if(this.fromNode===this.toNode){var t=this.data,i=null!==t?t.time:this.time,o=this.fromNode.port.getDocumentPoint(go.Spot.Center),e=this.findActivityWidth(this.fromNode,i),n=o.x+e/2,r=convertTimeToY(i);return this.clearPoints(),this.addPoint(new go.Point(n,r)),this.addPoint(new go.Point(n+50,r)),this.addPoint(new go.Point(n+50,r+5)),this.addPoint(new go.Point(n,r+5)),!0}return go.Link.prototype.computePoints.call(this)},go.Diagram.inherit(MessagingTool,go.LinkingTool),MessagingTool.prototype.doActivate=function(){go.LinkingTool.prototype.doActivate.call(this);var t=convertYToTime(this.diagram.firstInput.documentPoint.y);this.temporaryLink.time=Math.ceil(t)},MessagingTool.prototype.insertLink=function(t,i,o,e){var n=go.LinkingTool.prototype.insertLink.call(this,t,i,o,e);if(null!==n){var r=this.diagram.model,a=this.temporaryLink.time,s=1;n.data.time=a,r.setDataProperty(n.data,"text","msg");var g={group:n.data.to,start:a,duration:s};r.addNodeData(g),ensureLifelineHeights()}return n};