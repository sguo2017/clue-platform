
var columnDefs = [
    {headerName: "运动员", field: "athlete",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true},
    {headerName: "年龄", field: "age"},
    {headerName: "国籍", field: "country"},
    {headerName: "年份", field: "year"},
    {headerName: "日期", field: "date"},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"},
    {headerName: "总计", field: "total"}
];

var gridOptions = {
    defaultColDef: {
        width: 100
    },
    enableColResize: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    columnDefs: columnDefs
};

function onQuickFilterChanged(text) {
    gridOptions.api.setQuickFilter(text);
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
