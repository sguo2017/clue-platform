var columnDefs = [
    // this row just shows the row index, doesn't use any data from the row
    {
        headerName: "#",
        width: 70,
        cellRenderer: function(params) {
            return Number(params.node.id) + 1;
        },
        checkboxSelection: true,
        headerCheckboxSelection: true,
        suppressMenu: true,
        suppressFilter:true
    },
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
    floatingFilter:true,
    // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
    enableSorting: true,
    enableFilter: true,
    suppressRowClickSelection: true,
    debug: true,
    rowSelection: 'multiple',
    enableColResize: true,
    paginationPageSize: 500,
    columnDefs: columnDefs,
    rowModelType: 'pagination'
};

function onPageSizeChanged(newPageSize) {
    this.gridOptions.paginationPageSize = new Number(newPageSize);
    createNewDatasource();
}

// when json gets loaded, it's put here, and  the datasource reads in from here.
// in a real application, the page will be got from the server.
var allOfTheData;

function createNewDatasource() {
    if (!allOfTheData) {
        // in case user selected 'onPageSizeChanged()' before the json was loaded
        return;
    }

    var dataSource = {
        //rowCount: ???, - not setting the row count, infinite paging will be used
        getRows: function (params) {
            // this code should contact the server for rows. however for the purposes of the demo,
            // the data is generated locally, a timer is used to give the experience of
            // an asynchronous call
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            setTimeout( function() {
                // take a chunk of the array, matching the start and finish times
                var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                // see if we have come to the last page. if we have, set lastRow to
                // the very last row of the last page. if you are getting data from
                // a server, lastRow could be returned separately if the lastRow
                // is not in the current page.
                var lastRow = -1;
                if (allOfTheData.length <= params.endRow) {
                    lastRow = allOfTheData.length;
                }
                params.successCallback(rowsThisPage, lastRow);
            }, 500);
        }
    };

    gridOptions.api.setDatasource(dataSource);
}

function setRowData(rowData) {
    allOfTheData = rowData;
    createNewDatasource();
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
            setRowData(httpResponse);
        }
    };
});
