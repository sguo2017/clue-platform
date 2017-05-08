var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, filterParams:{newRowsAction: 'keep'},
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelection: function (params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
    },
    {headerName: "年龄", field: "age", width: 90, filterParams:{newRowsAction: 'keep'}},
    {headerName: "国籍", field: "country", width: 120, filterParams:{newRowsAction: 'keep'}},
    {headerName: "年份", field: "year", width: 90, filterParams:{newRowsAction: 'keep'}},
    {headerName: "日期", field: "date", width: 110, filterParams:{newRowsAction: 'keep'}},
    {headerName: "体育项目", field: "sport", width: 110, filterParams:{newRowsAction: 'keep'}},
    {headerName: "金牌", field: "gold", width: 100, filterParams:{newRowsAction: 'keep'}},
    {headerName: "银牌", field: "silver", width: 100, filterParams:{newRowsAction: 'keep'}},
    {headerName: "铜牌", field: "bronze", width: 100, filterParams:{newRowsAction: 'keep'}},
    {headerName: "总计", field: "total", width: 100, filterParams:{newRowsAction: 'keep'}}
];

var groupColumn = {
    headerName: "分组",
    width: 200,
    field: 'athlete',
    valueGetter: function(params) {
        if (params.node.group) {
            return params.node.key;
        } else {
            return params.data[params.colDef.field];
        }
    },
    headerCheckboxSelection: true,
    // headerCheckboxSelectionFilteredOnly: true,
    comparator: agGrid.defaultGroupComparator,
    cellRenderer: 'group',
    cellRendererParams: {
        checkbox: true
    }
};

var gridOptions = {
    enableSorting: true,
    enableFilter: true,
    suppressRowClickSelection: true,
    groupSelectsChildren: true,
    debug: true,
    rowSelection: 'multiple',
    enableColResize: true,
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    enableRangeSelection: true,
    columnDefs: columnDefs,
    paginationAutoPageSize:true,
    pagination: true,
    groupColumnDef: groupColumn,
    defaultColDef:{
        editable: true,
        enableRowGroup:true,
        enablePivot:true,
        enableValue:true
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
