var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, enableRowGroup: true, enablePivot: true},
    {headerName: "年龄", field: "age", width: 90, enableValue: true},
    {headerName: "国籍", field: "country", width: 120, enableRowGroup: true, enablePivot: true, rowGroupIndex: 1},
    {headerName: "年份", field: "year", width: 90, enableRowGroup: true, enablePivot: true, pivotIndex: 1},
    {headerName: "日期", field: "date", width: 110, enableRowGroup: true, enablePivot: true},
    {headerName: "体育项目", field: "sport", width: 110, enableRowGroup: true, enablePivot: true, rowGroupIndex: 2},
    {headerName: "金牌", field: "gold", width: 100, hide: true, enableValue: true},
    {headerName: "银牌", field: "silver", width: 100, hide: true, enableValue: true, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, hide: true, enableValue: true, aggFunc: 'sum'},
    {headerName: "总计", field: "totalAgg", valueGetter: "node.group ? data.totalAgg : data.gold + data.silver + data.bronze", width: 100}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    pivotMode: true,
    enableSorting: true,
    showToolPanel: true,
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    functionsReadOnly: true
};

function setReadOnly(value) {
    gridOptions.api.setFunctionsReadOnly(value);
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