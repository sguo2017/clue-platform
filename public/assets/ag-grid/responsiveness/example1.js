var columnDefs = [
    {headerName: "运动员", field: "athlete", minWidth: 150},
    {headerName: "年龄", field: "age", minWidth: 50},
    {headerName: "国籍", field: "country", minWidth: 120},
    {headerName: "年份", field: "year", minWidth: 90},
    {headerName: "日期", field: "date", minWidth: 110},
    {headerName: "体育项目", field: "sport", minWidth: 110},
    {headerName: "金牌", field: "gold", minWidth: 100},
    {headerName: "银牌", field: "silver", minWidth: 100},
    {headerName: "铜牌", field: "bronze", minWidth: 100},
    {headerName: "总计", field: "total", minWidth: 100}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    onGridSizeChanged: function () {
        hideColumnsThatDontFit();
    }
};

function hideColumnsThatDontFit() {
    // get the current grids width
    var gridWidth = document.getElementById('myGrid').offsetWidth;

    // keep track of which columns to hide/show
    var columnsToShow = [];
    var columnsToHide = [];

    // iterate over all columns (visible or not) and work out
    // now many columns can fit (based on their minWidth)
    var totalColsWidth = 0;
    var allColumns = gridOptions.columnApi.getAllColumns();
    for (var i = 0; i < allColumns.length; i++) {
        let column = allColumns[i];
        totalColsWidth += column.getMinWidth();
        if(totalColsWidth > gridWidth) {
            columnsToHide.push(column.colId);
        } else {
            columnsToShow.push(column.colId);
        }
    }

    // show/hide columns based on current grid width
    gridOptions.columnApi.setColumnsVisible(columnsToShow, true);
    gridOptions.columnApi.setColumnsVisible(columnsToHide, false);

    // fill out any available space to ensure there are no gaps
    gridOptions.api.sizeColumnsToFit();
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
