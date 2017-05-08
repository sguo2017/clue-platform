var columnDefs = [
    // this row just shows the row index, doesn't use any data from the row
    {headerName: "#", width: 50, cellRenderer: function(params) {
        return params.node.id + 1;
    } },
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "年份", field: "year", width: 90, filter: 'number'},
    {headerName: "日期", field: "date", width: 110},
    {headerName: "体育项目", field: "sport", width: 110, filter: 'text'},
    {headerName: "金牌", field: "gold", width: 100},
    {headerName: "银牌", field: "silver", width: 100},
    {headerName: "铜牌", field: "bronze", width: 100},
    {headerName: "总计", field: "total", width: 100}
];

var gridOptions = {
    // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    columnDefs: columnDefs,
    showToolPanel: true,
    rowModelType: 'pagination',
    rowGroupPanelShow: 'always',
    enableStatusBar: true,
    paginationPageSize: 500,
    enableRangeSelection: true,
    localeText: {
        // for filter panel
        page: '页',
        more: '更多',
        to: '到',
        of: '的',
        next: '下一页',
        last: '末页',
        first: '首页',
        previous: '上一页',
        loadingOoo: '加载中...',
        // for set filter
        selectAll: '全选',
        searchOoo: '搜索关键字...',
        blanks: '空白',
        // for number filter and text filter
        filterOoo: '搜索关键字...',
        applyFilter: '应用过滤...',
        // for number filter
        equals: '等于',
        lessThan: '小于',
        greaterThan: '大于',
        // for text filter
        contains: '包含',
        startsWith: '开头',
        endsWith: '结尾',
        // the header of the default group column
        group: '分组',
        // tool panel
        columns: '列',
        rowGroupColumns: '数据透视列',
        rowGroupColumnsEmptyMessage: '可拖拽列到分组中',
        valueColumns: '值的列',
        pivotMode: '数据透视图',
        groups: '组',
        values: '值',
        pivots: '数据透视',
        valueColumnsEmptyMessage: '拖拽列进行汇总',
        pivotColumnsEmptyMessage: '拖到到这里进行数据透视',
        // other
        noRowsToShow: '没有可见行',
        // enterprise menu
        pinColumn: '冻结列',
        valueAggregation: '平均值',
        autosizeThiscolumn: '列自动宽度',
        autosizeAllColumns: '全部列自动宽度',
        groupBy: '分组',
        ungroupBy: '取消分组',
        resetColumns: '重置列',
        expandAll: '展开全部',
        collapseAll: '收起全部',
        toolPanel: '工具面板',
        // enterprise menu pinning
        pinLeft: '往左冻结 <<',
        pinRight: '往右冻结 >>',
        noPin: '取消冻结 <>',
        // enterprise menu aggregation and status panel
        sum: '和',
        min: '最小',
        max: '最大',
        first: '第一个',
        last: '最后一个',
        none: '无',
        count: '个数',
        average: '平均',
        // standard menu
        copy: '拷贝',
        ctrlC: 'ctrl C',
        paste: '粘贴',
        ctrlV: 'ctrl V'
    }
};

function setDataSource(allOfTheData) {
    var dataSource = {
        //rowCount: ???, - not setting the row count, infinite paging will be used
        getRows: function (params) {
            // this code should contact the server for rows. however for the purposes of the demo,
            // the data is generated locally, and a timer is used to give the expereince of
            // an asynchronous call
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            setTimeout( function() {
                // take a chunk of the array, matching the start and finish times
                var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                var lastRow = -1;
                // see if we have come to the last page, and if so, return it
                if (allOfTheData.length <= params.endRow) {
                    lastRow = allOfTheData.length;
                }
                params.successCallback(rowsThisPage, lastRow);
            }, 500);
        }
    };
    gridOptions.api.setDatasource(dataSource);
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
            setDataSource(httpResult);
        }
    };
});