var monthValueGetter = '(ctx.month < colDef.month) ? data[colDef.field + "_bud"] : data[colDef.field + "_act"]';
var monthCellClassRules = {
    'cell-act': 'ctx.month < colDef.month',
    'cell-bud': 'ctx.month >= colDef.month',
    'cell-negative': 'x < 0'
};
var yearToDateValueGetter = 'var total = 0; ctx.months.forEach( function(monthName, monthIndex) { if (monthIndex<=ctx.month) { total += data[monthName + "_act"]; } }); return total; ';
var accountingCellRenderer = function(params) {
    if (params.value >= 0) {
        return params.value.toLocaleString();
    } else {
        return '(' + Math.abs(params.value).toLocaleString() + ')';
    }
};

var columnDefs = [
    {
        headerName: '每月数据',
        children: [
            {headerName : '一月', field: 'jan', month: 0, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : '二月', field: 'feb', month: 1, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : '三月', field: 'mar', month: 2, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : '四月', field: 'apr', month: 3, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : '五月', field: 'may', month: 4, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : '六月', field: 'jun', month: 5, cellRenderer: accountingCellRenderer,
                cellClass: 'cell-figure', valueGetter: monthValueGetter,
                cellClassRules: monthCellClassRules, aggFunc: 'sum'},

            {headerName : 'YTD', cellClass: 'cell-figure', cellRenderer: accountingCellRenderer,
                valueGetter: yearToDateValueGetter, cellStyle: {'font-weight': 'bold'}, aggFunc: 'sum'}
        ]
    },
    {
        field: 'country', rowGroupIndex: 0, hide: true
    }
];

var gridOptions = {
    groupColumnDef: {headerName : "地区", field: "city", width: 200,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    },
    columnDefs: columnDefs,
    colWidth: 100,
    rowSelection: 'multiple',
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    rowHeight: 22,
    onModelUpdated: modelUpdated,
    groupSelectsChildren: true,
    enableRangeSelection: true,
    context: {
        month: 0,
        months: ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    },
    onGridReady: function(event) {
        event.api.sizeColumnsToFit();
    },
    icons: {
        menu: '<i class="fa fa-bars"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
        groupExpanded: '<i class="fa fa-minus-square-o"/>',
        groupContracted: '<i class="fa fa-plus-square-o"/>',
        columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
        columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
    }
};

var monthNames = ['Budget Only', 'Year to Jan', 'Year to Feb', 'Year to Mar', 'Year to Apr', 'Year to May',
    'Year to Jun', 'Year to Jul', 'Year to Aug', 'Year to Sep', 'Year to Oct', 'Year to Nov', 'Full Year'];

onChangeMonth = function(i) {
    var newMonth = gridOptions.context.month += i;

    if (newMonth < -1) {
        newMonth = -1;
    }
    if (newMonth > 5) {
        newMonth = 5;
    }

    gridOptions.context.month = newMonth;
    document.querySelector('#monthName').innerHTML = monthNames[newMonth + 1];
    gridOptions.api.recomputeAggregates();
    gridOptions.api.refreshView();
};

function onQuickFilterChanged(value) {
    gridOptions.api.setQuickFilter(value);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '../assets/api/monthlySales.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
            gridOptions.api.sizeColumnsToFit();
        }
    };
});

function modelUpdated() {
    if (gridOptions.rowData) {
        var model = gridOptions.api.getModel();
        var totalRows = gridOptions.rowData.length;
        var processedRows = model.getVirtualRowCount();
        document.querySelector('#rowCount').innerHTML = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
}
