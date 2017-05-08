var columnDefs = [
    {headerName: "运动员", field: "athlete" },
    {headerName: "年龄", field: "age" },
    {headerName: "国籍", field: "country" },
    {headerName: "年份", field: "year"},
    {headerName: "日期", field: "date", editable: true, cellEditor: Datepicker},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"},
    {headerName: "总计", field: "total"}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null
};

// function to act as a class
function Datepicker () {}

// gets called once before the renderer is used
Datepicker.prototype.init = function(params) {
    // create the cell
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;

    // https://jqueryui.com/datepicker/
    $(this.eInput).datepicker({
        dateFormat: "dd/mm/yy"
    });
};

// gets called once when grid ready to insert the element
Datepicker.prototype.getGui = function() {
    return this.eInput;
};

// focus and select can be done after the gui is attached
Datepicker.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
};

// returns the new value after editing
Datepicker.prototype.getValue = function() {
    return this.eInput.value;
};

// any cleanup we need to be done here
Datepicker.prototype.destroy = function() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
Datepicker.prototype.isPopup = function() {
    // and we could leave this method out also, false is the default
    return false;
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