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

var rowData = [
    {"athlete":"Michael Phelps","age":23,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":8,"silver":0,"bronze":0,"total":8},
    {"athlete":"Michael Phelps","age":19,"country":"United States","year":2004,"date":"29/08/2004","sport":"Swimming","gold":6,"silver":0,"bronze":2,"total":8},
    {"athlete":"Michael Phelps","age":27,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":2,"bronze":0,"total":6},
    {"athlete":"Natalie Coughlin","age":25,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":2,"bronze":3,"total":6},
    {"athlete":"Aleksey Nemov","age":24,"country":"Russia","year":2000,"date":"01/10/2000","sport":"Gymnastics","gold":2,"silver":1,"bronze":3,"total":6},
    {"athlete":"Alicia Coutts","age":24,"country":"Australia","year":2012,"date":"12/08/2012","sport":"Swimming","gold":1,"silver":3,"bronze":1,"total":5},
    {"athlete":"Missy Franklin","age":17,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":0,"bronze":1,"total":5},
    {"athlete":"Ryan Lochte","age":27,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":2,"silver":2,"bronze":1,"total":5},
];


var minRowHeight = 25;
var currentRowHeight = minRowHeight;

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    onGridReady: function () {
        gridOptions.api.sizeColumnsToFit()
    },
    onGridSizeChanged: function () {
        spanRowsToFitGridHeight();
    },
    getRowHeight: function () {
        return currentRowHeight;
    }
};

function spanRowsToFitGridHeight() {
    // get the height of the grid body - this excludes the height of the headers
    var gridHeight = document.getElementsByClassName('ag-body')[0].offsetHeight;

    // get the rendered rows
    var renderedRows = gridOptions.api.getRenderedNodes();

    // if the rendered rows * min height is greater than available height, just just set the height
    // to the min and let the scrollbar do its thing
    if(renderedRows.length * minRowHeight >= gridHeight) {
        if(currentRowHeight !== minRowHeight) {
            currentRowHeight = minRowHeight;
            gridOptions.api.resetRowHeights();
        }
    } else {
        // set the height of the row to the grid height / number of rows available
        currentRowHeight = Math.floor(gridHeight / renderedRows.length);
        gridOptions.api.resetRowHeights();
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
