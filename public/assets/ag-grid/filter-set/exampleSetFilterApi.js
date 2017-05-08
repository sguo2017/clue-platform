var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, filter: 'set',
        filterParams: { cellHeight: 20} },
    {headerName: "年龄", field: "age", width: 90, filter: 'number'},
    {headerName: "国籍", field: "country", width: 140,
        cellRenderer: countryCellRenderer, keyCreator: countryKeyCreator},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100, filter: 'number'},
    {headerName: "银牌", field: "silver", width: 100, filter: 'number'},
    {headerName: "铜牌", field: "bronze", width: 100, filter: 'number'},
    {headerName: "总计", field: "total", width: 100, filter: 'number'}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    enableFilter: true,
    enableColResize: true
};

function countryCellRenderer(params) {
    return params.value.name + ' (' + params.value.code + ')';
}

function countryKeyCreator(params) {
    var countryObject = params.value;
    var key = countryObject.name;
    return key;
}

function onFilterChanged(value) {
    gridOptions.api.setQuickFilter(value);
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

function selectJohnAndKenny(){
    var athleteFilterComponent = gridOptions.api.getFilterInstance('athlete');
    athleteFilterComponent.selectNothing ();
    athleteFilterComponent.selectValue ('John Joe Nevin');
    athleteFilterComponent.selectValue ('Kenny Egan');
    gridOptions.api.onFilterChanged();
}

function selectEverything(){
    var athleteFilterComponent = gridOptions.api.getFilterInstance('athlete');
    athleteFilterComponent.selectEverything ();
    gridOptions.api.onFilterChanged();
}

function selectNothing(){
    var athleteFilterComponent = gridOptions.api.getFilterInstance('athlete');
    athleteFilterComponent.selectNothing ();
    gridOptions.api.onFilterChanged();
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
