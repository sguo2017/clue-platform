var columnDefs = [
    {headerName: "运动员", field: "athlete", width: 150},
    {headerName: "年龄", field: "age", width: 90},
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
    enableRangeSelection: true,
    getContextMenuItems: getContextMenuItems,
    allowContextMenuWithControlKey: true
};

function creatFlagImg(flag) {
    return '<img border="0" width="15" height="10" src="../images/flags/' + flag + '.png"/>';
}

function getContextMenuItems(params) {
    var result = [
        { // custom item
            name: 'Alert ' + params.value,
            action: function () {window.alert('Alerting about ' + params.value); }
        },
        { // custom item
            name: 'Always Disabled',
            disabled: true
        },
        {
            name: 'Country',
            subMenu: [
                {name: 'Ireland', action: function() {console.log('Ireland was pressed');}, icon: creatFlagImg('ie') },
                {name: 'UK', action: function() {console.log('UK was pressed');}, icon: creatFlagImg('gb')  },
                {name: 'France', action: function() {console.log('France was pressed');}, icon: creatFlagImg('fr')  }
            ]
        },
        {
            name: 'Person',
            subMenu: [
                {name: 'Niall', action: function() {console.log('Niall was pressed');} },
                {name: 'Sean', action: function() {console.log('Sean was pressed');} },
                {name: 'John', action: function() {console.log('John was pressed');} },
                {name: 'Alberto', action: function() {console.log('Alberto was pressed');} },
                {name: 'Tony', action: function() {console.log('Tony was pressed');} },
                {name: 'Andrew', action: function() {console.log('Andrew was pressed');} },
                {name: 'Kev', action: function() {console.log('Kev was pressed');} },
                {name: 'Will', action: function() {console.log('Will was pressed');} },
                {name: 'Armaan', action: function() {console.log('Armaan was pressed');} }
            ]
        }, // built in separator
        'separator',
        { // custom item
            name: 'Windows',
            shortcut: 'Alt + W',
            action: function() { console.log('Windows Item Selected'); },
            icon: '<img src="../images/skills/windows.png"/>'
        },
        { // custom item
            name: 'Mac',
            shortcut: 'Alt + M',
            action: function() { console.log('Mac Item Selected'); },
            icon: '<img src="../images/skills/mac.png"/>'
        }, // built in separator
        'separator',
        { // custom item
            name: 'Checked',
            checked: true,
            action: function() { console.log('Checked Selected'); },
            icon: '<img src="../images/skills/mac.png"/>'
        }, // built in copy item
        'copy'
    ];

    return result;
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