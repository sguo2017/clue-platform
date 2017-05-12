var doc = {};
doc.account_report = function(){
	new agGrid.Grid(document.querySelector('#ag-grid-div'), {
        columnDefs: [
            {
                field: "category", rowGroupIndex: 0, hide: true
            },
            {
                headerName: '第一周',
                children: [
                    {headerName: "销量", field: "amount1", width: 70, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }},
                    {headerName: "收入", field: "gbp1", width: 120, cellRenderer: function(params) {
                        if (params.value) {
                            return '￥' + params.value.toLocaleString();
                        } else {
                            return null;
                        }
                    }, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }}
                ]
            },
            {
                headerName: '第二周',
                children: [
                    {headerName: "销量", field: "amount2", width: 70, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }},
                    {headerName: "收入", field: "gbp2", width: 120, cellRenderer: function(params) {
                        if (params.value) {
                            return '￥' + params.value.toLocaleString();
                        } else {
                            return null;
                        }
                    }, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }}
                ]
            },
            {
                headerName: '第三周',
                children: [
                    {headerName: "销量", field: "amount3", width: 70, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }},
                    {headerName: "收入", field: "gbp3", width: 120, cellRenderer: function(params) {
                        if (params.value) {
                            return '￥' + params.value.toLocaleString();
                        } else {
                            return null;
                        }
                    }, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }}
                ]
            },
            {
                headerName: '总计',
                children: [
                    {headerName: "销量", field: "amountTotal", width: 70, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }},
                    {headerName: "收入", field: "gbpTotal", width: 120, cellRenderer: function(params) {
                        if (params.value) {
                            return '￥' + params.value.toLocaleString();
                        } else {
                            return null;
                        }
                    }, aggFunc: 'sum', cellStyle: {
                        'text-align': 'right'
                    }}
                ]
            }
        ],
        rowData: function() {
            var rows = [];
            ['麦芽酒','Larger','苹果酒','葡萄酒','烈性酒'].forEach( function (item) {
                rows.push({category: '酒精类饮品', item: item});
            });

            ['矿泉水','果汁','汽水','牛奶'].forEach( function (item) {
                rows.push({category: '非酒精类饮品', item: item});
            });

            rows.forEach( function(row) {

                row.amount1 = Math.round(Math.random() * 100);
                row.amount2 = Math.round(Math.random() * 100);
                row.amount3 = Math.round(Math.random() * 100);
                row.amountTotal = row.amount1 + row.amount2 + row.amount3;

                row.gbp1 = row.amount1 * 22;
                row.gbp2 = row.amount2 * 22;
                row.gbp3 = row.amount3 * 22;
                row.gbpTotal = row.amountTotal * 22;
            });
            console.log(rows)

            return rows;
        }(),
        rowSelection: 'single',
        suppressAggFuncInHeader: true,
        groupDefaultExpanded: -1,
        groupIncludeFooter: true,
        enableColResize: true,
        enableSorting: false,
        forPrint: true,
        groupColumnDef: {
            headerName: "饮料",
            width: 200,
            field: 'item',
            comparator: agGrid.defaultGroupComparator,
            cellRenderer: "group"
        },
        suppressMenuColumnPanel: true,
        suppressMenuFilterPanel: true,
        suppressMenuMainPanel: true,
        getRowHeight: function(params) {
            if (params.node.footer) {
                return 40;
            } else {
                return 25;
            }
        },
        icons: {
            groupExpanded: '<i class="fa fa-minus-square-o"></i>',
            groupContracted: '<i class="fa fa-plus-square-o"></i>'
        },
        enableFilter: false
    });
}