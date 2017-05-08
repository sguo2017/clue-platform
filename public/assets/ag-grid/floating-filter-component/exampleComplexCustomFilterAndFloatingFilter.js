
var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150, filter: 'text'},
    {headerName: "年龄", field: "age", width: 90, filter: 'number'},
    {headerName: "国籍", field: "country", width: 120},
    {headerName: "年份", field: "year", width: 90},
    {headerName: "日期", field: "date", width: 130, filter:'date', filterParams:{
        comparator:function (filterLocalDateAtMidnight, cellValue){
            var dateAsString = cellValue;
            var dateParts  = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                return 0
            }

            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }

            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        }
    }, floatingFilterComponentParams:{
        suppressFilterButton:true
    }},
    {headerName: "体育项目", field: "sport", width: 110},
    {headerName: "金牌", field: "gold", width: 100, filter: 'number', floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            maxValue:7,
            suppressFilterButton:true
        }, filter: NumberFilter
    },
    {headerName: "银牌", field: "silver", width: 100, filter: 'number', floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            maxValue:3,
            suppressFilterButton:true
        }, filter: NumberFilter},
    {headerName: "铜牌", field: "bronze", width: 100, filter: 'number', floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            maxValue:2,
            suppressFilterButton:true
        }, filter: NumberFilter},
    {headerName: "总计", field: "total", width: 100, filter: 'number', floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            maxValue:5,
            suppressFilterButton:true
        }, filter: NumberFilter}
];

var gridOptions = {
    floatingFilter:true,
    columnDefs: columnDefs,
    rowData: null,
    enableFilter: true
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function NumberFilter() {
}

NumberFilter.prototype.init = function (params) {
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.params = params;
    this.setupGui();
};

// not called by ag-Grid, just for us to help setup
NumberFilter.prototype.setupGui = function () {
    this.gui = document.createElement('div');
    this.gui.innerHTML =
        '<div style="padding: 4px;">' +
        '<div style="font-weight: bold;">Greater than: </div>' +
        '<div><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="Number of medals..."/></div>' +
        '</div>';

    var that = this;
    this.onFilterChanged = function() {
        that.extractFilterText();
        that.params.filterChangedCallback();
    };

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener("input", this.onFilterChanged);
};

NumberFilter.prototype.extractFilterText = function () {
    this.filterText = this.eFilterText.value;
};

NumberFilter.prototype.getGui = function () {
    return this.gui;
};

NumberFilter.prototype.doesFilterPass = function (params) {
    var valueGetter = this.valueGetter;
    var value = valueGetter(params);
    var filterValue = this.filterText;

    if (this.isFilterActive()){
        if (!value) return false;
        return Number(value) > Number(filterValue)
    }
};

NumberFilter.prototype.isFilterActive = function () {
    return  this.filterText !== null &&
        this.filterText !== undefined &&
        this.filterText !== '' &&
        isNumeric(this.filterText);
};

NumberFilter.prototype.getModel = function () {
    return this.isFilterActive() ? Number(this.eFilterText.value) : null;
};

NumberFilter.prototype.setModel = function (model) {
    this.eFilterText.value = model;
    this.extractFilterText();
};


NumberFilter.prototype.destroy = function () {
    this.eFilterText.removeEventListener("input", this.onFilterChanged);
};



function NumberFloatingFilter() {
}

NumberFloatingFilter.prototype.init = function (params) {
    this.onFloatingFilterChanged = params.onFloatingFilterChanged;
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '<div style="width:75%; margin-left:10px" class="slider"></div>'
    this.eSlider = $(this.eGui.querySelector('div'));
    this.currentValue = 0;
    var that = this;
    this.eSlider.slider({
        min:0,
        max:params.maxValue,
        change: function(e, ui) {
            //Every time the value of the slider changes
            if (!e.originalEvent) {
                //If this event its triggered from outside. ie setModel() on the parent Filter we
                //would be in this area of the code and we need to prevent an infinite loop:
                //onParentModelChanged => onFloatingFilterChanged => onParentModelChanged => onFloatingFilterChanged ...
                return;
            }
            that.currentValue = ui.value;
            that.onFloatingFilterChanged(that.buildModel())
        }
    });


};

NumberFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
    // When the filter is empty we will receive a null message her
    if (!parentModel) {
        //If there is no filtering set to the minimun
        this.eSlider.slider( "option", "value", 0 );
        this.currentValue = null;
    } else {
        if (parentModel.filter !== this.currentValue){
            this.eSlider.slider( "option", "value", parentModel );
        }
        this.currentValue = parentModel;
    }
    //Print a summary on the slider button
    this.eSlider.children(".ui-slider-handle").html(this.currentValue ? '>' + this.currentValue : '');
};

NumberFloatingFilter.prototype.getGui = function () {
    return this.eGui;
};

NumberFloatingFilter.prototype.buildModel = function () {
    if (this.currentValue === 0) return null;
    return this.currentValue;
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

