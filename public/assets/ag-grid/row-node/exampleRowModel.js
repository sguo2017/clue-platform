var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "分组", valueGetter: "data.country.charAt(0)", width: 120},
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
    enableFilter: true,
    enableSorting: true
};

function onBtForEachNode() {
    console.log('### api.forEachNode() ###');
    gridOptions.api.forEachNode(printNode);
}

function onBtForEachNodeAfterFilter() {
    console.log('### api.forEachNodeAfterFilter() ###');
    gridOptions.api.forEachNodeAfterFilter(printNode);
}

function onBtForEachNodeAfterFilterAndSort() {
    console.log('### api.forEachNodeAfterFilterAndSort() ###');
    gridOptions.api.forEachNodeAfterFilterAndSort(printNode);
}

function printNode(node, index) {
    if (node.data) {
        console.log(index + ' -> data: ' + node.data.country + ', ' + node.data.athlete);
    } else {
        console.log(index + ' -> group: ' + node.key);
    }
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