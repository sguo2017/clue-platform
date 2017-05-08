var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date"},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"},
    {headerName: "总计", field: "total"}
];

var swimmingHeight = 50;
var groupHeight = 25;

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    animateRows: true,
    getRowHeight: function(params) {
        if (params.node.group) {
            return groupHeight;
        } else if (params.data && params.data.sport==='Swimming') {
            return swimmingHeight;
        } else {
            return 25;
        }
    }
};

function setSwimmingHeight(height) {
    swimmingHeight = height;
    gridOptions.api.resetRowHeights();
}

function setGroupHeight(height) {
    groupHeight = height;
    gridOptions.api.resetRowHeights();
}

function setZimbabweHeight(height) {
    gridOptions.api.forEachNode( function(rowNode) {
        if (rowNode.data && rowNode.data.country === 'Zimbabwe') {
            rowNode.setRowHeight(height);
        }
    });
    gridOptions.api.onRowHeightChanged();
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
