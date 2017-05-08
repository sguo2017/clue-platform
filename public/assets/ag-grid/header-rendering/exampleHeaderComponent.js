var columnDefs = [
    {headerName: "运动员", field: "athlete", suppressMenu: true},
    {headerName: "年龄", field: "age", suppressSorting: true, headerComponentParams : { menuIcon: 'fa-external-link'}},
    {headerName: "国籍", field: "country", suppressMenu: true},
    {headerName: "年份", field: "year", suppressSorting: true},
    {headerName: "日期", field: "date", suppressMenu: true},
    {headerName: "体育项目", field: "sport", suppressSorting: true},
    {headerName: "金牌", field: "gold", headerComponentParams : { menuIcon: 'fa-cog'}},
    {headerName: "银牌", field: "silver", suppressSorting: true},
    {headerName: "铜牌", field: "bronze", suppressMenu: true},
    {headerName: "总计", field: "total", suppressSorting: true}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    enableFilter: true,
    enableSorting: true,
    enableColResize: true,
    suppressMenuHide: true,
    defaultColDef : {
        width: 100,
        headerComponent : MyHeaderComponent,
        headerComponentParams : {
            menuIcon: 'fa-bars'
        }
    }
};

function MyHeaderComponent() {
}

MyHeaderComponent.prototype.init = function (agParams){
    this.agParams = agParams;
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = ''+
        '<div class="customHeaderMenuButton"><i class="fa ' + this.agParams.menuIcon + '"></i></div>' +
        '<div class="customHeaderLabel">' + this.agParams.displayName + '</div>' +
        '<div class="customSortDownLabel inactive"><i class="fa fa-long-arrow-down"></i></div>' +
        '<div class="customSortUpLabel inactive"><i class="fa fa-long-arrow-up"></i></div>' +
        '<div class="customSortRemoveLabel inactive"><i class="fa fa-times"></i></div>';

    this.eMenuButton = this.eGui.querySelector(".customHeaderMenuButton");
    this.eSortDownButton = this.eGui.querySelector(".customSortDownLabel");
    this.eSortUpButton = this.eGui.querySelector(".customSortUpLabel");
    this.eSortRemoveButton = this.eGui.querySelector(".customSortRemoveLabel");


    if (this.agParams.enableMenu){
        this.onMenuClickListener = this.onMenuClick.bind(this);
        this.eMenuButton.addEventListener('click', this.onMenuClickListener);
    }else{
        this.eGui.removeChild(this.eMenuButton);
    }

    if (this.agParams.enableSorting){
        this.onSortAscRequestedListener = this.onSortRequested.bind(this, 'asc');
        this.eSortDownButton.addEventListener('click', this.onSortAscRequestedListener);
        this.onSortDescRequestedListener = this.onSortRequested.bind(this, 'desc');
        this.eSortUpButton.addEventListener('click', this.onSortDescRequestedListener);
        this.onRemoveSortListener = this.onSortRequested.bind(this, '');
        this.eSortRemoveButton.addEventListener('click', this.onRemoveSortListener);


        this.onSortChangedListener = this.onSortChanged.bind(this);
        this.agParams.column.addEventListener('sortChanged', this.onSortChangedListener);
        this.onSortChanged();
    } else {
        this.eGui.removeChild(this.eSortDownButton);
        this.eGui.removeChild(this.eSortUpButton);
        this.eGui.removeChild(this.eSortRemoveButton);
    }
};

MyHeaderComponent.prototype.onSortChanged = function (){
    function deactivate (toDeactivateItems){
        toDeactivateItems.forEach(function (toDeactivate){toDeactivate.className = toDeactivate.className.split(' ')[0]});
    }

    function activate (toActivate){
        toActivate.className = toActivate.className + " active";
    }

    if (this.agParams.column.isSortAscending()){
        deactivate([this.eSortUpButton, this.eSortRemoveButton]);
        activate (this.eSortDownButton)
    } else if (this.agParams.column.isSortDescending()){
        deactivate([this.eSortDownButton, this.eSortRemoveButton]);
        activate (this.eSortUpButton)
    } else {
        deactivate([this.eSortUpButton, this.eSortDownButton]);
        activate (this.eSortRemoveButton)
    }
};

MyHeaderComponent.prototype.getGui = function (){
    return this.eGui;
};

MyHeaderComponent.prototype.onMenuClick = function () {
    this.agParams.showColumnMenu (this.eMenuButton);
};

MyHeaderComponent.prototype.onSortRequested = function (order, event) {
    this.agParams.setSort (order, event.shiftKey);
};

MyHeaderComponent.prototype.destroy = function () {
    if (this.onMenuClickListener){
        this.eMenuButton.removeEventListener('click', this.onMenuClickListener)
    }
    this.eSortDownButton.removeEventListener('click', this.onSortRequestedListener);
    this.eSortUpButton.removeEventListener('click', this.onSortRequestedListener);
    this.eSortRemoveButton.removeEventListener('click', this.onSortRequestedListener);
    this.agParams.column.removeEventListener('sortChanged', this.onSortChangedListener);
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
