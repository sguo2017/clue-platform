var columnDefs = [
    {headerName: "运动员", field: "athlete"},
    {headerName: "年龄", field: "age"},
    {headerName: "国籍", field: "country", rowGroupIndex: 0},
    {headerName: "年份", field: "year"},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"}
];

var gridOptions = {
    defaultColDef: {
        width: 100,
        suppressFilter: true
    },
    columnDefs: columnDefs,
    enableColResize: true,
    rowModelType: 'enterprise',
    rowGroupPanelShow: 'never',
    functionsReadOnly: true,
    animateRows: true,
    debug: true
};

function EnterpriseDatasource(fakeServer) {
    this.fakeServer = fakeServer;
}

EnterpriseDatasource.prototype.getRows = function(params) {
    console.log('EnterpriseDatasource.getRows: params = ', params);

    var request = params.request;
    // if we are on the top level, then group keys will be [],
    // if we are on the second level, then group keys will be like ['United States']
    var groupKeys = request && request.groupKeys || [];
    var doingTopLevel = groupKeys.length === 0;

    if (doingTopLevel) {
        this.fakeServer.getTopLevelCountryList(successCallback);
    } else {
        var country = request.groupKeys[0];
        this.fakeServer.getCountryDetails(country, successCallback);
    }

    function successCallback(resultForGrid) {
        params.successCallback(resultForGrid);
    }
};

function FakeServer(allData) {
    this.initData(allData);
}

FakeServer.prototype.initData = function(allData) {
    var topLevelCountryGroups = [];
    var bottomLevelCountryDetails = {}; // will be a map of [country name => records]

    allData.forEach( function(dataItem) {
        // get country this item is for
        var country = dataItem.country;

        // get the top level group for this country
        var childrenThisCountry = bottomLevelCountryDetails[country];
        var groupThisCountry = _.find(topLevelCountryGroups, {country: country});
        if (!childrenThisCountry) {
            // no group exists yet, so create it
            childrenThisCountry = [];
            bottomLevelCountryDetails[country] = childrenThisCountry;

            // add a group to the top level
            groupThisCountry = {country: country, gold: 0, silver: 0, bronze: 0};
            topLevelCountryGroups.push(groupThisCountry);
        }

        // add this record to the county group
        childrenThisCountry.push(dataItem);

        // increment the group sums
        groupThisCountry.gold += dataItem.gold;
        groupThisCountry.silver += dataItem.silver;
        groupThisCountry.bronze += dataItem.bronze;
    });

    this.topLevelCountryGroups = topLevelCountryGroups;
    this.bottomLevelCountryDetails = bottomLevelCountryDetails;
};

// when looking for the top list, always return back the full list of countries
FakeServer.prototype.getTopLevelCountryList = function(callback) {

    var result = this.topLevelCountryGroups;

    // put the response into a timeout, so it looks like an async call from a server
    setTimeout( function() {
        callback(result);
    }, 1000);
};

FakeServer.prototype.getCountryDetails = function(country, callback) {

    var result = this.bottomLevelCountryDetails[country];

    // put the response into a timeout, so it looks like an async call from a server
    setTimeout( function() {
        callback(result);
    }, 1000);

};

FakeServer.prototype.getData = function(request, callback) {
    // the row group cols, ie teh cols that the user has dragged into the
    // 'group by' zone, eg 'Country' and 'Year'
    var rowGroupCols = request.rowGroupCols;
    // the keys we are looking at. will be empty if looking at top level (either
    // no groups, or looking at top level groups). eg ['United States','2002']
    var groupKeys = request.groupKeys;
    // if going aggregation, contains the value columns, eg ['gold','silver','bronze']
    var valueCols = request.valueCols;

    // we are not doing sorting and filtering in this example, but if you did
    // want to sort or filter using your implementation, you would do it here.
    var filterModel = request.filterModel;
    var sortModel = request.sortModel;

    var result;

    // if not grouping, just return the full set
    if (rowGroupCols.length===0) {
        result = this.allData;
    } else {
        // otherwise if grouping, a few steps...

        // first, if not the top level, take out everything that is not under the group
        // we are looking at.
        var filteredData = this.filterOutOtherGroups(this.allData, groupKeys, rowGroupCols);

        // if grouping, return the group
        var showingGroups = rowGroupCols.length > groupKeys.length;

        if (showingGroups) {
            result = this.buildGroupsFromData(filteredData, rowGroupCols, groupKeys, valueCols);
        } else {
            // show all remaining leaf level rows
            result = filteredData;
        }
    }

    // so that the example behaves like a server side call, we put
    // it in a timeout to a) give a delay and b) make it asynchronous
    setTimeout( function() {
        callback(result);
    }, 1000);
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    agGrid.simpleHttpRequest({url: '../assets/api/olympicWinners.json'})
        .then( function(rows) {
            var fakeServer = new FakeServer(rows);
            var datasource = new EnterpriseDatasource(fakeServer);
            gridOptions.api.setEnterpriseDatasource(datasource);
        }
    );
});
