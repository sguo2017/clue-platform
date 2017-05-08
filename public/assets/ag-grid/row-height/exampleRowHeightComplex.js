var latinText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

var columnDefs = [
    {headerName: "描述信息", field: "latinText", width: 350,
        cellStyle: {
            'white-space': 'normal'
        }
    },
    {headerName: "运动员", field: "athlete", width: 180},
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
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    // call back function, to tell the grid what height
    // each row should be
    getRowHeight: function(params) {
        // assuming 50 characters per line, working how how many lines we need
        return 18 * (Math.floor(params.data.latinText.length / 45) + 1);
    }
};

function setDataIntoGrid(data) {
    data.forEach(function (dataItem) {
        var start = Math.floor(Math.random() * (latinText.length / 2));
        var end = Math.floor(Math.random() * (latinText.length / 2) + latinText.length / 2);
        dataItem.latinText = latinText.substring(start, end);
    });

    // now set the height into the grid
    gridOptions.api.setRowData(data);
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
            setDataIntoGrid(httpResult);
        }
    };
});