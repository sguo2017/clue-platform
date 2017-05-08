var columnDefs = [

    // the first group column
    {headerName: "国籍", cellRenderer: 'group', field: "country", rowGroupIndex: 0,
        cellRendererParams: {
            restrictToOneGroup: true
        }
    },

    // and second group column
    {headerName: "年份", cellRenderer: 'group', field: "year", rowGroupIndex: 1, width: 130,
        cellRendererParams: {
            restrictToOneGroup: true
        }
    },

    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "金牌", field: "gold", aggFunc: 'sum', width: 100},
    {headerName: "银牌", field: "silver", aggFunc: 'sum', width: 100},
    {headerName: "铜牌", field: "bronze", aggFunc: 'sum', width: 100},
    {headerName: "总计", field: "total", aggFunc: 'sum', width: 100}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupSuppressAutoColumn: true,
    groupHideOpenParents: true,
    animateRows: true,
    onGridReady: function(params) {
        // params.api.sizeColumnsToFit();
    }
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
