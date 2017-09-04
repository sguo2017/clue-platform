function CalllistDataReader() {
  this.rawRows = [];
  this.fromColumn = "from_num";
  this.toColumn = "to_num";
  this.linksArray = null;
  this.nodesArray = null;
  this.filters = {};

  //读取并设置数据过滤选项
  (function() {
    var noteFilters = sessionStorage.getItem("ca_note_filters") || '';
    var dateFilters = sessionStorage.getItem("ca_date_filters") || '';
    var batchFilters = sessionStorage.getItem("ca_batch_filters") || '';
    var filters = {
      note_filters: noteFilters,
      date_filters: dateFilters,
      batch_filters: batchFilters
    };
    this.filters = filters;
  }).call(this);

  this.getDataFromServer = function() {
    var url = '/calllists/export';
    var outer = this;
    $.ajax({
      url: url,
      async: false,
      data: this.filters
    }).done(function(response) {
      outer.rawRows = response['data'];
      outer.fromColumn = "from_num";
      outer.toColumn = "to_num";
      if (!outer.rawRows) {
        outer.rawRows = [];
      }
    }).error(function(e) {
      alert("数据获取失败");
      console.log(e);
    });
  };

  this.getDataFromLocal = function() {
    this.rawRows = JSON.parse(sessionStorage.getItem('call_list_raw_rows'));
    this.fromColumn = sessionStorage.getItem('call_list_from_column');
    this.toColumn = sessionStorage.getItem('call_list_to_column');
    if (!this.rawRows) {
      this.rawRows = [];
    }
  };

  this.formatData = function() {
    var linksMap = {};
    var nodesMap = {};
    var outer = this;

    function renderLinks(from_num, to_num) {
      return {
        from: from_num,
        to: to_num,
        feq: 1
      };
    }

    function renderNodes(num) {
      return {
        key: num,
        fill: go.Brush.randomColor()
      };
    }

    this.rawRows.forEach(function(row) {
      var f = row[outer.fromColumn];
      var t = row[outer.toColumn];
      if (f > t) {
        var tmp = f;
        f = t;
        t = tmp;
      }
      if (!nodesMap[f]) {
        nodesMap[f] = renderNodes(f);
      }
      if (!nodesMap[t]) {
        nodesMap[t] = renderNodes(t);
      }
      var key = f + '' + t;
      if (linksMap[key]) {
        linksMap[key].feq++;
      } else {
        linksMap[key] = renderLinks(f, t);
      }
    });
    this.linksArray = [];
    this.nodesArray = [];
    for (var keyLink in linksMap) {
      if (linksMap[keyLink]) {
        this.linksArray.push(linksMap[keyLink]);
      }
    }
    for (var keyNode in nodesMap) {
      if (nodesMap[keyNode]) {
        this.nodesArray.push(nodesMap[keyNode])
      }
    }
  };
}
