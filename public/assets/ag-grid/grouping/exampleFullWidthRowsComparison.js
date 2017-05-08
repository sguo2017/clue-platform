var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, pinned: 'left'},
    {headerName: "年份", field: "year", width: 90, pinned: 'left'},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0},
    {headerName: "年龄", field: "age", width: 90, pinned: 'right'},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100},
    {headerName: "银牌", field: "silver", width: 100},
    {headerName: "铜牌", field: "bronze", width: 100},
    {headerName: "总计", field: "total", width: 100}
];

var gridOptions1 = {
    columnDefs: columnDefs,
    enableColResize: true,
    groupUseEntireRow: true
};

var gridOptions2 = {
    columnDefs: columnDefs,
    enableColResize: true,
    groupUseEntireRow: true,
    embedFullWidthRows: true
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv1 = document.querySelector('#myGrid1');
    new agGrid.Grid(gridDiv1, gridOptions1);

    var gridDiv2 = document.querySelector('#myGrid2');
    new agGrid.Grid(gridDiv2, gridOptions2);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '../assets/api/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions1.api.setRowData(httpResult);
            gridOptions2.api.setRowData(httpResult);
        }
    };
});
