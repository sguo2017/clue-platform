var FLAG_CODES = {
    'Ireland': 'ie',
    'United States': 'us',
    'Russia': 'ru',
    'Australia': 'au',
    'Canada': 'ca',
    'Norway': 'no',
    'China': 'cn',
    'Zimbabwe': 'zw',
    'Netherlands': 'nl',
    'South Korea': 'kr',
    'Croatia': 'hr',
    'France': 'fr'
};

var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 200},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "金牌", field: "gold", width: 100, aggFunc: 'sum'},
    {headerName: "银牌", field: "silver", width: 100, aggFunc: 'sum'},
    {headerName: "铜牌", field: "bronze", width: 100, aggFunc: 'sum'},
    {headerName: "总计", field: "total", width: 100, aggFunc: 'sum'},
    {headerName: "国籍", field: "country", width: 120, rowGroupIndex: 0},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupUseEntireRow: true,
    groupRowInnerRenderer: groupRowInnerRendererFunc
};

function groupRowInnerRendererFunc(params) {
    var flagCode = FLAG_CODES[params.node.key];

    var html = '';
    if (flagCode) {
        html += '<img class="flag" border="0" width="20" height="15" src="../images/flags/'+flagCode+'.png">'
    }

    html += '<span class="groupTitle"> COUNTRY_NAME</span>'.replace('COUNTRY_NAME', params.node.key);
    html += '<span class="medal gold"> Gold: GOLD_COUNT</span>'.replace('GOLD_COUNT', params.data.gold);
    html += '<span class="medal silver"> Silver: SILVER_COUNT</span>'.replace('SILVER_COUNT', params.data.silver);
    html += '<span class="medal bronze"> Bronze: BRONZE_COUNT</span>'.replace('BRONZE_COUNT', params.data.bronze);

    return html;
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