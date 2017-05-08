var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150,
        headerCellTemplate: function() {
            var eCell = document.createElement('span');
            eCell.innerHTML =
                '<div style="text-align: left;">' +
                '  <div id="agResizeBar" style="width: 4px; height: 100%; float: right; cursor: col-resize;"></div>' +
                '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                '    <span id="myMenuButton" style="border: 1px solid lightcyan;">##</span>' +
                // everything inside agHeaderCellLabel gets actioned when the user clicks
                '    <span id="agHeaderCellLabel">' +
                '      <span id="agText"></span>' +
                '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                '      <span id="agNoSort"></span>' +
                '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                '    </span>' +
                '  </div>' +
                '</div>';

            // because the menu is not with agMenu id, it means grid is not going to tie logic to it
            var eMenuButton = eCell.querySelector('#myMenuButton');
            eMenuButton.addEventListener('click', function() {
                gridOptions.api.showColumnMenuAfterButtonClick('athlete', eMenuButton);
            });

            // put logic in to catch context menu click
            eCell.addEventListener('contextmenu', function(event) {
                gridOptions.api.showColumnMenuAfterMouseClick('athlete', event);
                event.preventDefault();
            });

            return eCell;
        }
    },
    {headerName: "年龄", field: "age", width: 90,
        headerCellTemplate: function() {
            var eCell = document.createElement('span');
            eCell.innerHTML =
                '<div style="text-align: left;">' +
                '  <div id="agResizeBar" style="width: 4px; height: 100%; float: right; cursor: col-resize;"></div>' +
                '  <div style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
                '    <span id="agMenu"><i class="fa fa-bars"></i></span>' +
                    // everything inside agHeaderCellLabel gets actioned when the user clicks
                '    <span id="agHeaderCellLabel">' +
                '      <span id="agText"></span>' +
                '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                '      <span id="agNoSort"></span>' +
                '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                '    </span>' +
                '    <span id="myCalendarIcon"><i class="fa fa-calendar"></i></span>' +
                '  </div>' +
                '</div>';

            // put a button in to show calendar popup
            var eCalendar = eCell.querySelector('#myCalendarIcon');
            eCalendar.addEventListener('click', function() {
                alert('Calendar was Clicked');
            });

            return eCell;
        }},
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
    rowData: null,
    enableFilter: true,
    enableSorting: true,
    enableColResize: true,
    suppressMenuHide: true,
    headerCellTemplate:
        '<div style="text-align: left;">' +
        '  <div id="agResizeBar" style="width: 4px; height: 100%; float: right; cursor: col-resize;"></div>' +
        '  <div id="agMenu" style="float: left; padding: 2px; margin-top: 4px; margin-left: 2px;"><i class="fa fa-bars"></i></div>' +
        '  <div id="agHeaderCellLabel" style="padding: 4px; overflow: hidden; text-overflow: ellipsis;">' +
        '    <span id="agText"></span>' +
        '    <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
        '    <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
        '    <span id="agNoSort"></span>' +
        '    <span id="agFilter"><i class="fa fa-filter"></i></span>' +
        '  </div>' +
        '</div>'
};

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
