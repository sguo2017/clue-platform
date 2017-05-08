var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
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
    getMainMenuItems: getMainMenuItems
};

function getMainMenuItems(params) {
    // you don't need to switch, we switch below to just demonstrate some different options
    // you have on how to build up the menu to return
    switch (params.column.getId()) {

        // return the defaults, put add some extra items at the end
        case 'athlete':
            var athleteMenuItems = params.defaultItems.slice(0);
            athleteMenuItems.push({
                name: 'ag-Grid Is Great', action: function() {console.log('ag-Grid is great was selected');}
            });
            athleteMenuItems.push({
                name: 'Casio Watch', action: function() {console.log('People who wear casio watches are cool');}
            });
            athleteMenuItems.push({
                name: 'Custom Sub Menu',
                subMenu: [
                    {name: 'Black', action: function() {console.log('Black was pressed');} },
                    {name: 'White', action: function() {console.log('White was pressed');} },
                    {name: 'Grey', action: function() {console.log('Grey was pressed');} }
                ]
            });
            return athleteMenuItems;

        // return some dummy items
        case 'age':
            return [
                { // our own item with an icon
                    name: 'Joe Abercrombie',
                    action: function() {console.log('He wrote a book');},
                    icon: '<img src="../images/lab.png" style="width: 14px;"/>'
                },
                { // our own icon with a check box
                    name: 'Larsson',
                    action: function() {console.log('He also wrote a book');},
                    checked: true
                },
                'resetColumns' // a built in item
            ];

        // return all the default items, but remove app seperators and the two sub menus
        case 'country':
            var countryMenuItems = [];
            var itemsToExclude = ['separator','pinSubMenu','valueAggSubMenu'];
            params.defaultItems.forEach( function(item) {
                if (itemsToExclude.indexOf(item)<0) {
                    countryMenuItems.push(item);
                }
            });
            return countryMenuItems;

        default:
            // make no changes, just accept the defaults
            return params.defaultItems;
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