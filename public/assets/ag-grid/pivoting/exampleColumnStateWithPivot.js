var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, enableRowGroup: true, enablePivot: true},
    {headerName: "年龄", field: "age", width: 90, enableValue: true},
    {headerName: "国籍", field: "country", width: 120, enableRowGroup: true, enablePivot: true},
    {headerName: "年份", field: "year", width: 90, enableRowGroup: true, enablePivot: true},
    {headerName: "日期", field: "date", width: 110, enableRowGroup: true, enablePivot: true},
    {headerName: "体育项目", field: "sport", width: 110, enableRowGroup: true, enablePivot: true, pivotIndex: 1},
    {headerName: "金牌", field: "gold", width: 100, enableValue: true},
    {headerName: "银牌", field: "silver", width: 100, enableValue: true},
    {headerName: "铜牌", field: "bronze", width: 100, enableValue: true},
    {headerName: "总计", field: "total", width: 100, enableValue: true}
];

var gridOptions = {
    // set rowData to null or undefined to show loading panel by default
    showToolPanel: true,
    enableColResize: true,
    columnDefs: columnDefs
};

var savedState;
var savedPivotMode;

function printState() {
    var state = gridOptions.columnApi.getColumnState();
    console.log(state);
}

function saveState() {
    savedState = gridOptions.columnApi.getColumnState();
    savedPivotMode = gridOptions.columnApi.isPivotMode();
    console.log('column state saved');
}

function restoreState() {
    gridOptions.columnApi.setColumnState(savedState);
    gridOptions.columnApi.setPivotMode(savedPivotMode);
    console.log('column state restored');
}

function togglePivotMode() {
    var pivotMode = gridOptions.columnApi.isPivotMode();
    gridOptions.columnApi.setPivotMode(!pivotMode);
}

function resetState() {
    gridOptions.columnApi.resetColumnState();
    gridOptions.columnApi.setPivotMode(false);
    console.log('column state reset');
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