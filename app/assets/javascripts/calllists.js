// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var calllistDataPreparing = {
  rawRows: null,
  fromColumn: null,
  toColumn: null,
  linksArray: null,
  nodesArray: null,
  getDataFromServer: function(){
    let url = '/calllists/export';
    $.ajax({url: url,async: false}).done((response) =>{
      this.rawRows = response['data'];
      this.fromColumn = "from_num";
      this.toColumn = "to_num";
    });
  },
  formatData: function(){
    var linksMap = {};
    var nodesMap = {};
    var outer = this;
    this.rawRows.forEach(function(row){
      var f=row[outer.fromColumn];
      var t=row[outer.toColumn];
      if(f>t){
        var tmp=a;
        a=b;
        b=tmp;
      }
      if(!nodesMap[f]){
        nodesMap[f]=outer.renderNodes(f);
      }
      if(!nodesMap[t]){
        nodesMap[t]=outer.renderNodes(t);
      }
      var key=f+''+t;
      if(linksMap[key]){
        linksMap[key].text++;
      }else{
        linksMap[key]=outer.renderLinks(f,t);
      }
    });
    this.linksArray=[];
    this.nodesArray=[];
    for(var key in linksMap){
      if(linksMap[key]){
        this.linksArray.push(linksMap[key]);
      }
    }
    for(var key in nodesMap){
      if(nodesMap[key]){
        this.nodesArray.push(nodesMap[key])
      }
    }
  },
  renderLinks: function(from_num,to_num){
    return {from: from_num, to: to_num, text: 1 };
  },
  renderNodes: function(num){
    return {key: num, fill: go.Brush.randomColor()};
  }
};
