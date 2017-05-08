var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, enableRowGroup: true, enablePivot: true},
    {headerName: "年龄", field: "age", width: 90, enableValue: true},
    {headerName: "国籍", field: "country", width: 120, enableRowGroup: true, enablePivot: true, pivotIndex: 1},
    {headerName: "年份", field: "year", width: 90, enableRowGroup: true, enablePivot: true},
    {headerName: "日期", field: "date", width: 110, enableRowGroup: true, enablePivot: true},
    {headerName: "体育项目", field: "sport", width: 110, enableRowGroup: true, enableGroup: true, groupIndex: 1},
    {headerName: "金牌", field: "gold", width: 100, hide: true, enableValue: true},
    {headerName: "银牌", field: "silver", width: 100, hide: true, enableValue: true, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, hide: true, enableValue: true, aggFunc: 'sum'},
    {headerName: "总计", field: "totalAgg", valueGetter: "node.group ? data.totalAgg : data.gold + data.silver + data.bronze", width: 100}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    showToolPanel: true,
    functionsPassive: true,
    pivotMode: true,
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    onColumnRowGroupAddRequest: function(event) {
        console.log('onColumnRowGroupAddRequest columns = ' + mapColumns(event.columns));
    },
    onColumnRowGroupRemoveRequest: function(event) {
        console.log('onColumnRowGroupRemoveRequest columns = ' + mapColumns(event.columns));
    },
    onColumnPivotAddRequest: function(event) {
        console.log('onColumnPivotAddRequest columns = ' + mapColumns(event.columns));
    },
    onColumnPivotRemoveRequest: function(event) {
        console.log('onColumnPivotRemoveRequest columns = ' + mapColumns(event.columns));
    },
    onColumnValueAddRequest: function(event) {
        console.log('onColumnValueAddRequest columns = ' + mapColumns(event.columns));
    },
    onColumnValueRemoveRequest: function(event) {
        console.log('onColumnValueRemoveRequest columns = ' + mapColumns(event.columns));
    },
    onColumnAggFuncChangeRequest: function(event) {
        console.log('onColumnAggFuncChangeRequest columns = ' + mapColumns(event.columns) + ', aggFunc = ' + event.aggFunc);
    }
};

function mapColumns(columns) {
    return columns.map( function(column) { return column.getId() } ).join(', ');
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '../assets/api/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});