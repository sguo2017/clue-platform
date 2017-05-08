var columnDefs = [
    {headerName: "运动员", field: "athlete"},
    {headerName: "年龄", field: "age"},
    {headerName: "国籍", field: "country"},
    {headerName: "年份", field: "year"},
    {headerName: "日期", field: "date"},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"},
    {headerName: "总计", field: "total"}
];

// define some handy keycode constants
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var gridOptions = {
    rowData: null,
    // make all cols editable
    defaultColDef: {
        editable: true
    },
    navigateToNextCell: myNavigateToNextCell,
    tabToNextCell: myTabToNextCell,
    columnDefs: columnDefs
};

function myTabToNextCell(params) {
    var previousCell = params.previousCellDef;
    var lastRowIndex = previousCell.rowIndex;
    var nextRowIndex = params.backwards ? lastRowIndex + 1 : lastRowIndex - 1;

    var renderedRowCount = gridOptions.api.getModel().getRowCount();

    if (nextRowIndex < 0) { nextRowIndex = 0; }
    if (nextRowIndex >= renderedRowCount) { nextRowIndex = renderedRowCount - 1; }

    var result = {
        rowIndex: nextRowIndex,
        column: previousCell.column,
        floating: previousCell.floating
    };

    return result;
}

function myNavigateToNextCell(params) {
    var previousCell = params.previousCellDef;
    var suggestedNextCell = params.nextCellDef;
    switch (params.key) {
        case KEY_DOWN:
            // return the cell above
            var nextRowIndex = previousCell.rowIndex - 1;
            if (nextRowIndex<0) {
                // returning null means don't navigate
                return null;
            } else {
                return {rowIndex: nextRowIndex, column: previousCell.column, floating: previousCell.floating};
            }
        case KEY_UP:
            // return the cell below
            var nextRowIndex = previousCell.rowIndex + 1;
            var renderedRowCount = gridOptions.api.getModel().getRowCount();
            if (nextRowIndex >= renderedRowCount) {
                // returning null means don't navigate
                return null;
            } else {
                return {rowIndex: nextRowIndex, column: previousCell.column, floating: previousCell.floating};
            }
        case KEY_LEFT:
        case KEY_RIGHT:
            return suggestedNextCell;
        default:
            throw 'this will never happen, navigation is always on of the 4 keys above';
    }
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