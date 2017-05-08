var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100, hide: true},
    {headerName: "银牌", field: "silver", width: 100, hide: true},
    {headerName: "铜牌", field: "bronze", width: 100, hide: true},
    {headerName: "总计", field: "total", width: 100}
];

var gridOptions = {
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    enableColResize: true,
    onGridReady: function() {
        gridOptions.api.addGlobalListener(function(type, event) {
            if (type.indexOf('column') >= 0) {
                console.log('Got column event: ' + event);
            }
        });
    }
};


var savedState;

function printState() {
    var state = gridOptions.columnApi.getColumnState();
    console.log(state);
}

function saveState() {
    savedState = gridOptions.columnApi.getColumnState();
    console.log('column state saved');
}

function restoreState() {
    gridOptions.columnApi.setColumnState(savedState);
    console.log('column state restored');
}

function resetState() {
    gridOptions.columnApi.resetColumnState();
}

function showAthlete(show) {
    gridOptions.columnApi.setColumnVisible('athlete', show);
}

function showMedals(show) {
    gridOptions.columnApi.setColumnsVisible(['gold','silver','bronze'], show);
}

function pinAthlete(pin) {
    gridOptions.columnApi.setColumnPinned('athlete', pin);
}

function pinAge(pin) {
    gridOptions.columnApi.setColumnPinned('age', pin);
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
