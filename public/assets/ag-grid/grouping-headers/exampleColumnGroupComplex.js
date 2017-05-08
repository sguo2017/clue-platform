var columnDefs = [
    {
        headerName: "分组 A",
        groupId: "GroupA",
        children: [
            {headerName: "运动员 1", field: "athlete", width: 150, filter: 'text'},
            {
                headerName: "分组 B",
                groupId: "GroupB",
                children: [
                    {headerName: "年龄 2", field: "age", width: 90, filter: 'number'},
                    {
                        headerName: "分组 C",
                        groupId: "GroupC",
                        children: [
                            {headerName: "国籍 1", field: "country", width: 120},
                            {
                                headerName: "分组 D",
                                groupId: "GroupD",
                                children: [
                                    {headerName: "体育项目 1", field: "sport", width: 110},
                                    {
                                        headerName: "分组 E",
                                        groupId: "GroupE",
                                        children: [
                                            {headerName: "奖牌数 1", field: "total", width: 100, filter: 'number'},
                                            {
                                                headerName: "分组 F",
                                                groupId: "GroupF",
                                                openByDefault: true,
                                                children: [
                                                    {headerName: "金牌 1", field: "gold", width: 100, filter: 'number'},
                                                    {
                                                        headerName: "分组 G",
                                                        groupId: "GroupG",
                                                        openByDefault: true,
                                                        children: [
                                                            {headerName: "银牌 1", field: "silver", width: 100, filter: 'number'},
                                                            {
                                                                headerName: "分组 H",
                                                                groupId: "GroupH",
                                                                children: [
                                                                    {headerName: "铜牌", field: "bronze", width: 100, filter: 'number'}
                                                                ]
                                                            },
                                                            {headerName: "银牌 2", columnGroupShow: 'open', field: "silver", width: 100, filter: 'number'}
                                                        ]
                                                    },
                                                    {headerName: "金牌 2", columnGroupShow: 'open', field: "gold", width: 100, filter: 'number'}
                                                ]
                                            },
                                            {headerName: "奖牌数 2", columnGroupShow: 'open', field: "total", width: 100, filter: 'number'}
                                        ]
                                    },
                                    {headerName: "体育项目 2", columnGroupShow: 'open', field: "sport", width: 110}
                                ]
                            },
                            {headerName: "国籍 2", columnGroupShow: 'open', field: "country", width: 120}
                        ]
                    },
                    {headerName: "年龄 2", columnGroupShow: 'open', field: "age", width: 90, filter: 'number'}
                ]
            },
            {headerName: "运动员 2", columnGroupShow: 'open', field: "athlete", width: 150, filter: 'text'}
        ]
    }
];

var gridOptions = {
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    defaultColGroupDef: {headerClass: headerClassFunc},
    defaultColDef: {headerClass: headerClassFunc},
    icons: {
        columnGroupOpened: '<i class="fa fa-plus-square-o"/>',
        columnGroupClosed: '<i class="fa fa-minus-square-o"/>'
    }
};

function headerClassFunc(params) {
    var foundC = false;
    var foundG = false;

    // for the bottom row of headers, column is present,
    // otherwise columnGroup is present. we are guaranteed
    // at least one is always present.
    var item = params.column ? params.column : params.columnGroup;

    // walk up the tree, see if we are in C or F groups
    while (item) {
        // if method getColGroupDef exists, then this is a group
        // console.log(item.getUniqueId());
        if (item.getDefinition().groupId==='GroupC') {
            foundC = true;
        } else if (item.getDefinition().groupId==='GroupG') {
            foundG = true;
        }
        item = item.getParent();
    }

    if (foundG) {
        return 'column-group-g';
    } else if (foundC) {
        return 'column-group-c';
    } else {
        return null;
    }
}

function expandAll(expand) {
    var columnApi = gridOptions.columnApi;
    var groupNames = ['GroupA','GroupB','GroupC','GroupD','GroupE','GroupF','GroupG'];

    groupNames.forEach( function(groupId) {
        columnApi.setColumnGroupOpened(groupId, expand);
    });
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
