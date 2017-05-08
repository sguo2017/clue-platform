var columnDefs = [
    // this row just shows the row index, doesn't use any data from the row
    {headerName: "#", width: 50, cellRenderer: function(params) {
        return params.node.id + 1;
    } },
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100},
    {headerName: "银牌", field: "silver", width: 100},
    {headerName: "铜牌", field: "bronze", width: 100},
    {headerName: "总计", field: "total", width: 100}
];

var gridOptions = {
    enableSorting: true,
    enableFilter: true,
    debug: true,
    rowSelection: 'multiple',
    enableColResize: true,
    paginationPageSize: 500,
    columnDefs: columnDefs,
    pagination: true,
    suppressPaginationPanel: true,
    onPaginationChanged: onPaginationPageLoaded
};


function setText(selector, text) {
    document.querySelector(selector).innerHTML = text;
}

function onPaginationPageLoaded() {
    console.log('onPaginationPageLoaded');

    setText('#lbLastPageFound', gridOptions.api.paginationIsLastPageFound());
    setText('#lbPageSize', gridOptions.api.paginationGetPageSize());
    // we +1 to current page, as pages are zero based
    setText('#lbCurrentPage', gridOptions.api.paginationGetCurrentPage() + 1);
    setText('#lbTotalPages', gridOptions.api.paginationGetTotalPages());

    setLastButtonDisabled(!gridOptions.api.paginationIsLastPageFound());
}

function setLastButtonDisabled(disabled) {
    document.querySelector('#btLast').disabled = disabled;
}


function setRowData(rowData) {
    allOfTheData = rowData;
    createNewDatasource();
}

function onBtFirst() {
    gridOptions.api.paginationGoToFirstPage();
}

function onBtLast() {
    gridOptions.api.paginationGoToLastPage();
}

function onBtNext() {
    gridOptions.api.paginationGoToNextPage();
}

function onBtPrevious() {
    gridOptions.api.paginationGoToPreviousPage();
}

function onBtPageFive() {
    // we say page 4, as the first page is zero
    gridOptions.api.paginationGoToPage(4);
}

function onBtPageFifty() {
    // we say page 49, as the first page is zero
    gridOptions.api.paginationGoToPage(49);
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
            var httpResponse = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResponse);
        }
    };
});
