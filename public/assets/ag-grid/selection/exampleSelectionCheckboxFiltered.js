var columnDefs = [
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "年龄", field: "age", width: 90, aggFunc: 'sum'},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "金牌", field: "gold", width: 100, aggFunc: 'sum'},
    {headerName: "银牌", field: "silver", width: 100, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, aggFunc: 'sum'},
    {headerName: "总计", field: "total", width: 100, aggFunc: 'sum'}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    rowSelection: 'multiple',
    groupSelectsChildren: true,
    groupSelectsFiltered: true,
    suppressAggFuncInHeader: true,
    suppressRowClickSelection: true,
     groupColumnDef: {headerName: "运动员", field: "athlete", width: 200,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    }
};

function filterSwimming() {
    gridOptions.api.setFilterModel({sport: ['Swimming']});
}

function clearFilter() {
    gridOptions.api.setFilterModel(null);
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