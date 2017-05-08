var columnDefs = [
    {
        headerName: "运动员详情",
        children: [
            {headerName: "运动员", field: "athlete", width: 150, filter: 'text'},
            {headerName: "年龄", field: "age", width: 90, filter: 'number'},
            {headerName: "国籍", field: "country", width: 120}
        ]
    },
    {
        headerName: "项目详情",
        children: [
            {headerName: "体育项目", field: "sport", width: 110},
            {headerName: "总计", columnGroupShow: 'closed', field: "total", width: 100, filter: 'number'},
            {headerName: "金牌", columnGroupShow: 'open', field: "gold", width: 100, filter: 'number'},
            {headerName: "银牌", columnGroupShow: 'open', field: "silver", width: 100, filter: 'number'},
            {headerName: "铜牌", columnGroupShow: 'open', field: "bronze", width: 100, filter: 'number'}
        ]
    }
];

var gridOptions = {
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    enableFilter: true,
    enableColResize: true
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