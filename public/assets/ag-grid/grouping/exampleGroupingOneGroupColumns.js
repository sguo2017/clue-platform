var columnDefs = [

    // one column for showing the groups
    {headerName: "分组", cellRenderer: 'group'},

    // the first group column
    {headerName: "国籍", field: "country", rowGroupIndex: 0, hide: true},
    {headerName: "年份", field: "year", rowGroupIndex: 1, hide: true},

    {headerName: "运动员", field: "athlete"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    // we are defining the group columns, so tell the grid we don't
    // want it to auto-generate group columns for us
    groupSuppressAutoColumn: true,
    onGridReady: function(params) {
        params.api.sizeColumnsToFit();
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    agGrid.simpleHttpRequest({url: '../assets/api/olympicWinners.json'})
        .then( function(rows) {
            gridOptions.api.setRowData(rows);
        });
});