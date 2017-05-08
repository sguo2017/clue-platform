(function() {

    var columnDefs = [
        // this col shows the row index, doesn't use any data from the row
        {
            headerName: "#", width: 50, cellRenderer: function (params) {
            return params.rowIndex;
        }
        },
        {headerName: "编码", field: "code", width: 70},
        {headerName: "姓名", field: "name", width: 300},
        {
            headerName: "Bid", field: "bid", width: 100,
            cellClass: 'cell-number',
            cellFormatter: numberFormatter,
            cellRenderer: 'animateShowChange'
        },
        {
            headerName: "Mid", field: "mid", width: 100,
            cellClass: 'cell-number',
            cellFormatter: numberFormatter,
            cellRenderer: 'animateShowChange'
        },
        {
            headerName: "Ask", field: "ask", width: 100,
            cellClass: 'cell-number',
            cellFormatter: numberFormatter,
            cellRenderer: 'animateShowChange'
        },
        {
            headerName: "Volume", field: "volume", width: 80,
            cellClass: 'cell-number',
            cellRenderer: 'animateSlide'
        }
    ];

    var gridOptions = {
        enableRangeSelection: true,
        enableColResize: true,
        debug: true,
        columnDefs: columnDefs,
        rowSelection: 'multiple',
        rowModelType: 'viewport',
        // implement this so that we can do selection
        getRowNodeId: function (data) {
            // the code is unique, so perfect for the id
            return data.code;
        }
    };

    function numberFormatter(params) {
        if (typeof params.value === 'number') {
            return params.value.toFixed(2);
        } else {
            return params.value;
        }
    }

    function setRowData(rowData) {
        // set up a mock server - real code will not do this, it will contact your
        // real server to get what it needs
        var mockServer = new MockServer();
        mockServer.init(rowData);

        var viewportDatasource = new ViewportDatasource(mockServer);
        gridOptions.api.setViewportDatasource(viewportDatasource);
        // put the 'size cols to fit' into a timeout, so that the scroll is taken into consideration
        setTimeout(function () {
            gridOptions.api.sizeColumnsToFit();
        }, 100);
    }

    // setup the grid after the page has finished loading
    document.addEventListener('DOMContentLoaded', function () {
        var gridDiv = document.querySelector('#liveStreamExample');
        new agGrid.Grid(gridDiv, gridOptions);

        // do http request to get our sample data - not using any framework to keep the example self contained.
        // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', '../assets/api/stocks.json');
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var httpResponse = JSON.parse(httpRequest.responseText);
                setRowData(httpResponse);
            }
        };
    });

})();