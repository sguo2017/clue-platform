var columnDefs = [
    {headerName: "运动员", field: "athlete"},
    {headerName: "年龄", field: "age"},
    {headerName: "国籍", field: "country"},
    {headerName: "年份", field: "year"},
    {headerName: "日期", field: "date"},
    {headerName: "体育项目", field: "sport"},
    {headerName: "金牌", field: "gold"},
    {headerName: "银牌", field: "silver"},
    {headerName: "铜牌", field: "bronze"},
    {headerName: "总计", field: "total"}
];

var topGridOptions = {
    // this is a handy way to set defaults onto the columns
    defaultColDef: {editable: true},
    columnDefs: columnDefs,
    // set the top grid to single click editing
    singleClickEdit: true
};

var bottomGridOptions = {
    // this is a handy way to set defaults onto the columns
    defaultColDef: {
        editable: true,
        // we use a cell renderer to include a button, so when the button
        // gets clicked, the editing starts.
        cellRenderer: BottomGridCellRenderer
    },
    columnDefs: columnDefs,
    // set the bottom grid to no click editing
    suppressClickEdit: true
};

function BottomGridCellRenderer() {}

BottomGridCellRenderer.prototype.createGui = function() {
    var template = '<span><button id="theButton">#</button><span id="theValue" style="padding-left: 4px;"></span></span>';
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    this.eGui = tempDiv.firstElementChild;
};

BottomGridCellRenderer.prototype.init = function(params) {
    // create the gui
    this.createGui();

    // keep params, we use it in onButtonClicked
    this.params = params;

    // attach the value to the value span
    var eValue = this.eGui.querySelector('#theValue');
    eValue.innerHTML = params.value;

    // setup the button, first get reference to it
    this.eButton = this.eGui.querySelector('#theButton');
    // bind the listener so 'this' is preserved, also keep reference to it for removal
    this.buttonClickListener = this.onButtonClicked.bind(this);
    // add the listener
    this.eButton.addEventListener('click', this.buttonClickListener);
};

BottomGridCellRenderer.prototype.onButtonClicked = function() {
    // start editing this cell. see the docs on the params that this method takes
    var startEditingParams = {
        rowIndex: this.params.rowIndex,
        colKey: this.params.column.getId()
    };
    this.params.api.startEditingCell(startEditingParams);
};

BottomGridCellRenderer.prototype.getGui = function() {
    // returns our gui to the grid for this cell
    return this.eGui;
};

BottomGridCellRenderer.prototype.destroy = function() {
    // be good, clean up the listener
    this.eButton.removeEventListener('click', this.buttonClickListener);
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var topGridDiv = document.querySelector('#topGrid');
    new agGrid.Grid(topGridDiv, topGridOptions);

    var bottomGridDiv = document.querySelector('#bottomGrid');
    new agGrid.Grid(bottomGridDiv, bottomGridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '../assets/api/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            topGridOptions.api.setRowData(httpResult);
            bottomGridOptions.api.setRowData(httpResult);
        }
    };
});