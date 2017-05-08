var columnDefs = [
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 1},
    {headerName: "年份", field: "year", width: 90, pivotIndex: 1, pivotComparator: MyYearPivotComparator},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100, aggFunc: 'sum'},
    {headerName: "银牌", field: "silver", width: 100, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, aggFunc: 'sum'}
];

var gridOptions = {
    // set rowData to null or undefined to show loading panel by default
    pivotMode: true,
    enableColResize: true,
    columnDefs: columnDefs,
    // we don't want the grid putting in 'sum' in the headers for us
    suppressAggFuncInHeader: true,
    defaultColDef: {
        // NEW PIECE - add headerValueGetter
        headerValueGetter: function() { return 'bar'; }
    },

    // this is a callback that gets called on each column definition
    processSecondaryColDef: function(colDef) {
        // make all the columns upper case
        colDef.headerName = colDef.headerName.toUpperCase();

        // the pivot keys are the keys use for the pivot
        // don't change these, but you can use them for your information
        console.log('Pivot Keys:');
        console.log(colDef.pivotKeys);
        // the value column is the value we are aggregating on
        console.log('Pivot Value Keys:');
        console.log(colDef.pivotValueColumn);
    },

    // this is a callback that gets called on each group definition
    processSecondaryColGroupDef: function(colGroupDef) {
        // for fun, add a css class for 2002
        if (colGroupDef.pivotKeys[0] === '2002') {
            colGroupDef.headerClass = 'color-background';
        }
        // put 'year' in front of each group
        colGroupDef.headerName = 'Year ' + colGroupDef.headerName;
    }
};

function MyYearPivotComparator(a, b) {
    var requiredOrder = ['2012', '2010', '2008', '2006', '2004', '2002', '2000'];
    return requiredOrder.indexOf(a) - requiredOrder.indexOf(b);
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