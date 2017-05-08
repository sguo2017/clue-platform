var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, filter: 'text'},
    {headerName: "年龄", field: "age", width: 90, filter: 'number'},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 145, filter:'date', filterParams:{
        comparator:function (filterLocalDateAtMidnight, cellValue){
            var dateAsString = cellValue;
            var dateParts  = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                return 0
            }

            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }

            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        }

    }},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100, filter: 'number'},
    {headerName: "银牌", field: "silver", width: 100, filter: 'number'},
    {headerName: "铜牌", field: "bronze", width: 100, filter: 'number'},
    {headerName: "总计", field: "total", width: 100, filter: 'number'}
];

// this gets set when you hit the button 'save filter'
var savedModel = null;

var hardcodedFilter = {
    country: ['Ireland', 'United States'],
    age: {type: 'lessThan', filter: '30'},
    athlete: {type: 'startsWith', filter: 'Mich'},
    date:{type: 'lessThan', dateFrom: '2010-01-01'}
};

var savedFilters = '[]';

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    enableFilter: true,
    enableSorting: true,

    // these hide enterprise features, so they are not confusing
    // you if using ag-Grid standard
    suppressContextMenu: true,
    suppressMenuMainPanel: true,
    suppressMenuColumnPanel: true
};

function clearFilters() {
    gridOptions.api.setFilterModel(null);
    gridOptions.api.onFilterChanged();
}

function saveFilterModel() {
    savedModel = gridOptions.api.getFilterModel();
    if (savedModel) {
        savedFilters = Object.keys(savedModel);
    } else {
        savedFilters = '-none-';
    }
    document.querySelector('#savedFilters').innerHTML = JSON.stringify(savedFilters);
}

function restoreFilterModel() {
    gridOptions.api.setFilterModel(savedModel);
    gridOptions.api.onFilterChanged();
}

function restoreFromHardCoded() {
    gridOptions.api.setFilterModel(hardcodedFilter);
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
            gridOptions.api.setRowData(httpResult);
        }
    };
});
