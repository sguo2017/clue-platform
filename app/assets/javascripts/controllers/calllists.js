// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var calllistDataPreparing = {
  rawRows: [],
  fromColumn: "from_num",
  toColumn: "to_num",
  linksArray: null,
  nodesArray: null,
  getDataFromServer: function(){
    var url = '/calllists/export';
    var outer = this;
    $.ajax({url: url,async: false}).done(function(response){
      outer.rawRows = response['data'];
      outer.fromColumn = "from_num";
      outer.toColumn = "to_num";
      if(!outer.rawRows){
        outer.rawRows = [];
      }
    });
  },
  getDataFromLocal: function(){
    this.rawRows = JSON.parse(sessionStorage.getItem('call_list_raw_rows'));
    this.fromColumn = sessionStorage.getItem('call_list_from_column');
    this.toColumn = sessionStorage.getItem('call_list_to_column');
    if(!this.rawRows){
      this.rawRows = [];
    }
  },
  formatData: function(){
    var linksMap = {};
    var nodesMap = {};
    var outer = this;
    this.rawRows.forEach(function(row){
      var f=row[outer.fromColumn];
      var t=row[outer.toColumn];
      if(f>t){
        var tmp=f;
        f=t;
        t=tmp;
      }
      if(!nodesMap[f]){
        nodesMap[f]=outer.renderNodes(f);
      }
      if(!nodesMap[t]){
        nodesMap[t]=outer.renderNodes(t);
      }
      var key=f+''+t;
      if(linksMap[key]){
        linksMap[key].feq++;
      }else{
        linksMap[key]=outer.renderLinks(f,t);
      }
    });
    this.linksArray=[];
    this.nodesArray=[];
    for(var keyLink in linksMap){
      if(linksMap[keyLink]){
        this.linksArray.push(linksMap[keyLink]);
      }
    }
    for(var keyNode in nodesMap){
      if(nodesMap[keyNode]){
        this.nodesArray.push(nodesMap[keyNode])
      }
    }
  },
  renderLinks: function(from_num,to_num){
    return {from: from_num, to: to_num, feq: 1 };
  },
  renderNodes: function(num){
    return {key: num, fill: go.Brush.randomColor()};
  }
};
