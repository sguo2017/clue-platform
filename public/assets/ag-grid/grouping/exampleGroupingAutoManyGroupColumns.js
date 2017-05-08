var columnDefs = [

    // group by these cols, and hide them, and let grid sort out the grouping columns
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
    // by default the grid will create auto columns, however the default
    // behaviour is one column, set this property to true to get column
    // per group
    groupMultiAutoColumn: true,
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