var columnDefs = [{
    headerName: 'Group1',
    children: [
        {headerName: "运动员", field: "athlete", width: 150},
        {headerName: "年龄", field: "age", width: 90, cellClass:'twoDecimalPlaces', cellClassRules:{
            greenBackground: function(params) { return params.value < 23},
            redFont: function(params) { return params.value < 20}
        }},
        {headerName: "国籍", field: "country", width: 120, cellClassRules: {
            redFont: function(params) { return params.value === 'United States' }
        }},
        {headerName: "分组", valueGetter: "data.country.charAt(0)", width: 75, cellClassRules:{
                boldBorders: function(params) { return params.value === 'U'}
            },
            cellClass:['redFont', 'greenBackground']
        },
        {headerName: "年份", field: "year", width: 75, cellClassRules:{
            notInExcel: function(params) { return true}
        }}
    ]
}, {
    headerName: 'Group2',
    children: [
        {headerName: "日期", field: "date", width: 110},
        {headerName: "体育项目", field: "sport", width: 110},
        {headerName: "金牌", field: "gold", width: 100, cellClassRules:{
            boldBorders: function(params) { return params.value > 2}
        }},
        {headerName: "银牌", field: "silver", width: 100},
        {headerName: "铜牌", field: "bronze", width: 100},
        {headerName: "总计", field: "total", width: 100}
    ]
}];

var floatingTopRow = { athlete: 'Floating Top Athlete', age: 999, country: 'Floating Top Country', year: 2020,
    date: '01-08-2020', sport: 'Floating Top Sport', gold: 22, silver: 33, bronze: 44, total: 55};

var floatingBottomRow = { athlete: 'Floating Bottom Athlete', age: 888, country: 'Floating Bottom Country', year: 2030,
    date: '01-08-2030', sport: 'Floating Bottom Sport', gold: 222, silver: 233, bronze: 244, total: 255};

var gridOptions = {
    columnDefs: columnDefs,
    groupHeaders: true,
    enableFilter: true,
    enableSorting: true,
    rowSelection: 'multiple',
    floatingTopRowData: [floatingTopRow],
    floatingBottomRowData: [floatingBottomRow],
    defaultColDef: {
        cellClassRules: {
            darkGreyBackground: function(params) { return params.rowIndex % 2 == 0 }
        }
    },
    excelStyles: [
        {
            id: "greenBackground",
            interior: {
                color: "#90ee90", pattern: 'Solid'
            }
        },
        {
            id: "redFont",
            font: {
                underline: "Single",
                italic: true,
                color: "#ff0000"
            }
        },{
            id: 'darkGreyBackground',
            interior: {
                color: "#888888", pattern: 'Solid'
            }
        },{
            id:'boldBorders',
            borders: {
                borderBottom: {
                    color: "#000000", lineStyle: 'Continuous', weight: 3
                },
                borderLeft: {
                    color: "#000000", lineStyle: 'Continuous', weight: 3
                },
                borderRight: {
                    color: "#000000", lineStyle: 'Continuous', weight: 3
                },
                borderTop: {
                    color: "#000000", lineStyle: 'Continuous', weight: 3
                }
            }
        },{
            id:'header',
            interior: {
                color: "#CCCCCC", pattern: 'Solid'
            }
        },{
            id:'twoDecimalPlaces',
            numberFormat:{
                format: '#,##0.00'
            }
        }

    ]
};

function getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
}

function onBtExport() {
    var params = {
        skipHeader: getBooleanValue('#skipHeader'),
        columnGroups: getBooleanValue('#columnGroups'),
        skipFooters: getBooleanValue('#skipFooters'),
        skipGroups: getBooleanValue('#skipGroups'),
        skipFloatingTop: getBooleanValue('#skipFloatingTop'),
        skipFloatingBottom: getBooleanValue('#skipFloatingBottom'),
        allColumns: getBooleanValue('#allColumns'),
        onlySelected: getBooleanValue('#onlySelected'),
        fileName: document.querySelector('#fileName').value
    };

    if (getBooleanValue('#useCellCallback')) {
        params.processCellCallback = function(params) {
            if (params.value && params.value.toUpperCase) {
                return params.value.toUpperCase();
            } else {
                return params.value;
            }
        };
    }

    if (getBooleanValue('#useSpecificColumns')) {
        params.columnKeys = ['country','bronze'];
    }

    if (getBooleanValue('#processHeaders')) {
        params.processHeaderCallback  = function(params) {
            return params.column.getColDef().headerName.toUpperCase();
        };
    }


    gridOptions.api.exportDataAsExcel(params);
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