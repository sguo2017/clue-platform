var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "金牌", field: "gold", width: 100, aggFunc: 'sum'},
    {headerName: "银牌", field: "silver", width: 100, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, aggFunc: 'sum'}
];

var rowData = [
    { athlete: 'Niall Crosby', country: 'Ireland', year: '2016', gold: 10, silver: 10, bronze: 10 },
    { athlete: 'Jillian Crosby', country: 'Ireland', year: '2016', gold: 5, silver: 5, bronze: 5 },
    { athlete: 'John Masterson', country: 'Ireland', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Lucy Somebody', country: 'UK', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Sean Landsman', country: 'South Africa', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Jack Elephant', country: 'South Africa', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Tiger Woods', country: 'South Africa', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Jack Steel', country: 'Germany', year: '2016', gold: 2, silver: 2, bronze: 2 },
    { athlete: 'Mike NoMagic', country: 'Sweden', year: '2016', gold: 2, silver: 2, bronze: 2 }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    groupColumnDef: {
        headerName: '国籍',
        cellRenderer: 'group',
        field: 'country'
    },
    groupRemoveSingleChildren: true,
    animateRows: true,
    groupDefaultExpanded: 1,
    suppressAggFuncInHeader: true
};

function setupGrid() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();
}

function toggleGrid() {
    // destroy old grid if it is there
    if (gridOptions.api) {
        gridOptions.api.destroy();
    }
    gridOptions.groupRemoveSingleChildren = !gridOptions.groupRemoveSingleChildren;
    setupGrid();
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    setupGrid();
});
