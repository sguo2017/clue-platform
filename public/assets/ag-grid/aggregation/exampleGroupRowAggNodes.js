var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 200,
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group'
    },
    {headerName: "金牌", field: "gold", width: 100},
    {headerName: "银牌", field: "silver", width: 100},
    {headerName: "铜牌", field: "bronze", width: 100},
    {headerName: "金牌*pi", field: "goldPie", width: 100},
    {headerName: "银牌*pi", field: "silverPie", width: 100},
    {headerName: "铜牌*pi", field: "bronzePie", width: 100},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0, hide: true},
    {headerName: "年份", field: "year", width: 90, rowGroupIndex: 1, hide: true}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupUseEntireRow: false,
    enableSorting: true,
    groupRowAggNodes: groupRowAggNodes,
    groupSuppressAutoColumn: true
};

function groupRowAggNodes(nodes) {
    var result = {
        gold: 0,
        silver: 0,
        bronze: 0,
        goldPie: 0,
        silverPie: 0,
        bronzePie: 0
    };
    nodes.forEach( function(node) {
        var data = node.data;
        if (typeof data.gold === 'number') {
            result.gold += data.gold;
            result.goldPie += data.gold * Math.PI;
        }
        if (typeof data.silver === 'number') {
            result.silver += data.silver;
            result.silverPie += data.silver * Math.PI;
        }
        if (typeof data.bronze === 'number') {
            result.bronze += data.bronze;
            result.bronzePie += data.bronze * Math.PI;
        }
    });
    return result;
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
