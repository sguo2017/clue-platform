var students = [
    {
        first_name: 'Bob', last_name: 'Harrison', gender: 'Male',
        address: '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
        mood: "Happy", country: 'Ireland'
    }, {
        first_name: 'Mary', last_name: 'Wilson', gender: 'Female',
        age: 11, address: '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
        mood: "Sad", country: 'Ireland'
    }, {
        first_name: 'Sadiq', last_name: 'Khan', gender: 'Male', age: 12,
        address: '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
        mood: "Happy", country: 'Ireland'
    }, {
        first_name: 'Jerry', last_name: 'Mane', gender: 'Male', age: 12,
        address: '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
        mood: "Happy", country: 'Ireland'
    }
];

// double the array twice, make more data!
students.forEach(function (item) {
    students.push(item);
});
students.forEach(function (item) {
    students.push(item);
});
students.forEach(function (item) {
    students.push(item);
});

var columnDefs = [
    {headerName: "姓氏", field: "first_name", width: 100, editable: true},
    {headerName: "名字", field: "last_name", width: 100, editable: true},
    {
        headerName: "性别",
        field: "gender",
        width: 90,
        editable: true
    },
    {
        headerName: "年龄",
        field: "age",
        width: 70,
        editable: true
    },
    {
        headerName: "心情",
        field: "mood",
        width: 70,
        editable: true
    },
    {
        headerName: "国籍",
        field: "country",
        width: 100,
        editable: true
    },
    {
        headerName: "地址",
        field: "address",
        width: 502,
        editable: true,
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: students,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    onRowEditingStarted: function (event) {
        console.log('never called - not doing row editing');
    },
    onRowEditingStopped: function (event) {
        console.log('never called - not doing row editing');
    },
    onCellEditingStarted: function (event) {
        console.log('cellEditingStarted');
    },
    onCellEditingStopped: function (event) {
        console.log('cellEditingStopped');
    }
};

function onBtStopEditing() {
    gridOptions.api.stopEditing();
}

function onBtStartEditing(key, char) {
    gridOptions.api.setFocusedCell(0, 'last_name');

    gridOptions.api.startEditingCell({
        rowIndex: 0,
        colKey: 'last_name',
        keyPress: key,
        charPress: char
    });
}

function getCharCodeFromEvent(event) {
    event = event || window.event;
    return (typeof event.which == "undefined") ? event.keyCode : event.which;
}

function isCharNumeric(charStr) {
    return !!/\d/.test(charStr);
}

function isKeyPressedNumeric(event) {
    var charCode = getCharCodeFromEvent(event);
    var charStr = String.fromCharCode(charCode);
    return isCharNumeric(charStr);
}

function onBtNextCell() {
    gridOptions.api.tabToNextCell();
}

function onBtPreviousCell() {
    gridOptions.api.tabToPreviousCell();
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    console.log(gridOptions)
    new agGrid.Grid(gridDiv, gridOptions);
    console.log(gridOptions)
});
