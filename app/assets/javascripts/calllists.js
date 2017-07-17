// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var calllistDrawing = {
  rawNodesArray: null,
  rawLinksArray: null,
  nodesArray: null,
  linksArray: null,
  getDataFromServer: function(){
    let url = '/calllists/export';
    $.ajax({url: url,async: false}).done((response) =>{
      var data = response;
      this.rawNodesArray=this.nodesArray = data.nodes.map(function(x){
          return {category: 'force_directed',key: x,text: x,fill: go.Brush.randomColor()};
      });
      this.rawLinksArray=this.linksArray = data.links.map(function(x){
          return { category: 'force_directed', from: x.from_num, to: x.to_num };
      });
    });
  },
  formatData: function(){
    this.nodesArray = this.rawNodesArray.map(function(x){
        return {category: 'force_directed',key: x,text: x,fill: go.Brush.randomColor()};
    });
    this.linksArray = this.rawLinksArray.map(function(x){
        return { category: 'force_directed', from: x.from_num, to: x.to_num };
    });
  },
  force_directed: function(){
    goTools.layout = $$(go.ForceDirectedLayout);
    goTools.startTransaction("generateTree");
    goTools.model.nodeDataArray = this.nodesArray;
    goTools.model.linkDataArray = this.linksArray;
    goTools.commitTransaction("generateTree");
  }
};

// document.addEventListener('turbolinks:load',function(){
//   draw();
// });
function draw(){
  var type=getQueryString('type');
  var sources=getQueryString('sources');
  if(!type || !sources)return;
  switch(type){
    case 'calllist':
      drawCalllist(sources);
      break;
    default:
      true;
  }
}

function drawCalllist(sources){
    switch (sources) {
    case 'excel':
      calllistDrawing.rawNodesArray=excelUtils.nodesForGoJs;
      calllistDrawing.rawLinksArray=excelUtils.linksForGoJs;
      calllistDrawing.formatData();
      calllistDrawing.force_directed();
      break;
    case 'db':
      calllistDrawing.getDataFromServer();
      calllistDrawing.force_directed();
      break;
    default:
      calllistDrawing.force_directed();
  }

}
