var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 200},
    {headerName: "金牌", field: "gold", width: 100},
    {headerName: "银牌", field: "silver", width: 100},
    {headerName: "铜牌", field: "bronze", width: 100},
    {headerName: "总计", field: "total", width: 100},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0, hide: true, keyCreator: countryKeyCreator},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null
};

function countryKeyCreator(params) {
    var countryObject = params.value;
    var key = countryObject.name;
    return key;
}

function setDataIntoGrid(data) {
    // hack the data, replace each country with an object of country name and code
    data.forEach( function(row) {
        var countryName = row.country;
        var countryCode = countryName.substring(0,2).toUpperCase();
        row.country = {
            name: countryName,
            code: countryCode
        };
    });
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
