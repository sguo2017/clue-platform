// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var calllist = {};

calllist.force_directed = function(){
      let url = '/calllists/export';
      $.get(url).done((response) =>{
				goTools.layout = $$(go.ForceDirectedLayout);
			  goTools.startTransaction("generateTree");
				var data = response;
				var nodeArray = data.nodes.map(function(x){
            return {category: 'force_directed',key: x,text: x,fill: go.Brush.randomColor()};
				});
				goTools.model.nodeDataArray = nodeArray;
				var linkArray = data.links.map(function(x){
					  return { category: 'force_directed', from: x.from_num, to: x.to_num };
				});
				goTools.model.linkDataArray = linkArray;
				goTools.commitTransaction("generateTree");
      });
}
