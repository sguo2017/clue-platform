var classRules = {
    // .parent because we target the 2nd group of 2
    'background-odd': function(params) { return params.node.parent.childIndex % 2 === 0; },
    'background-even': function(params) { return params.node.parent.childIndex % 2 !== 0; },
    // we target the last row of the 2nd group
    'border': function(params) { return params.node.parent.lastChild && params.node.lastChild; }
};

var columnDefs = [
    {headerName: "国籍", field: "country", width: 120, cellClassRules: classRules, rowGroupIndex: 0,
        cellStyle: function(params) {
        // color red for the first group
        if (params.node.parent.parent.firstChild) {
            return {color: "red"};
        }
    }},
    {headerName: "体育项目", field: "sport", width: 110, cellClassRules: classRules, rowGroupIndex: 1,
        cellStyle: function(params) {
        // color blue for the first in the current sub group
        if (params.node.firstChild) {
            return {color: "blue"};
        }
    }},
    {headerName: "运动员", field: "athlete", width: 150, cellClassRules: classRules},
    {headerName: "年龄", field: "age", width: 90, cellClassRules: classRules},
    {headerName: "年份", field: "year", width: 90, cellClassRules: classRules},
    {headerName: "日期", field: "date", width: 110, cellClassRules: classRules},
    {headerName: "金牌", field: "gold", width: 100, cellClassRules: classRules},
    {headerName: "银牌", field: "silver", width: 100, cellClassRules: classRules},
    {headerName: "铜牌", field: "bronze", width: 100, cellClassRules: classRules},
    {headerName: "总计", field: "total", width: 100, cellClassRules: classRules}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupSuppressRow: true,
    enableSorting: true
};

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