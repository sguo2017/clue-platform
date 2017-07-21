$(document).on('turbolinks:load',function(){
  $('.add-analysis-tool .add-analysis-item').click(function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
    }else{
      $(this).addClass('active');
    }
  });
  $('#btn-to-draw-excel').click(function(){
    excelUtils.checkSelectedColumns();
    excelUtils.saveDataToServer();
  });
});
var excelUtils = {

  rows: null,
  columns: null,
  fromColumn: null,
  toColumn: null,
  bacth: null,
  init: function(){
    if($('#upload_excel_field').length==0 && $('#upload_excel_field')[0].files.length==0) return;
    var file = $('#upload_excel_field')[0].files[0];
    if(!file) return;
    $('#file_name_wrap').val(file.name);
    var form = new FormData();
    form.append('file',file);
    $.ajax({
      url:"/calllists/read_from_excel",
      type:"post",
      data:form,
      processData:false, //important
      contentType:false  //important
    }).done(responseData => {
      this.rows = responseData['data'];
      this.buildTableHeader();
      this.buildSelectOptions();
      this.buildTableRows();
    });
  },
  getColumns: function (){
    if(!this.rows && this.row.length<=0){
      this.columns=[];
      return this.columns;
    }else if(this.columns){
      return this.columns;
    }else{
      var row=this.rows[0];
      this.columns=[];
      for(var key in row){
        this.columns.push(key);
      }
      return this.columns;
    }
  },
  buildTableHeader: function (){
    this.getColumns();
    if(this.rows.length>0){
      var th=[];
      this.columns.forEach(function(c){
        th.push('<th>'+c+'</th>');
      });
      var header='\
      <tr>\
        <th>\
          <div class="checkbox-ui">\
            <span class="aliconfont icon-checkbox active" onclick="excelUtils.changeAllSelectStatus()"></span>\
          </div>\
        </th>'+
        th.join('\n')+
      '</tr>\
      ';
      $('#calllist_table > thead').empty().prepend(header);
    }
  },
  buildSelectOptions: function (){
    var selections=["<option value=''></option>"];
    this.columns.forEach(function(c){
      selections.push('<option value='+c+'>'+c+'</option>');
    });
    var options=selections.join('\n');
    $('#from_selector').empty().append(options);
    $('#to_selector').empty().append(options);
    if(this.columns.indexOf(this.fromColumn)>=0){
      $("#from_selector").find("option").attr("selected",true);
      this.renderSelectedCloumns(this.columns.indexOf(this.fromColumn),'text-primary');
    }
    if(this.columns.indexOf(this.toColumn)>=0){
      $("#to_selector").find("option[value='"+this.toColumn+"']").attr("selected",true);
      this.renderSelectedCloumns(this.columns.indexOf(this.toColumn),'text-warning');
    }
    $('#from_selector').change(function(){excelUtils.onTargetSelectionChange('#from_selector','text-primary','from');});
    $('#to_selector').change(function(){excelUtils.onTargetSelectionChange('#to_selector','text-warning','to');});
  },
  buildTableRows: function (){
    var tr=[];
    this.rows.forEach(function(r){
      var td=[];
      for(var key in r){
          td.push('<td class="text-label">'+r[key]+'</td>');
      }
      tr.push('\
      <tr>\
        <td>\
          <div class="checkbox-ui">\
            <span class="aliconfont icon-checkbox active"></span>\
            <input type="checkbox">\
          </div>\
        </td>'+
        td.join('\n')+
        '</tr>\
      ');
    });
    $('#calllist_table > tbody').empty().append(tr.join('\n'));
  },
  changeAllSelectStatus: function(){
    var rows=$('table .icon-checkbox');
    for(var i=0;i<rows.length;i++){
      if($(rows[i]).hasClass('active')){
        $(rows[i]).removeClass('active');
      }else{
        $(rows[i]).addClass('active');
      }
    }
  },
  onTargetSelectionChange: function(selector,colorClass,type){
    $('.'+colorClass).removeClass().addClass('text-label');
    var selected=$(selector).find("option:selected").text();
    var index=this.columns.indexOf(selected);
    this.renderSelectedCloumns(index+2,colorClass);
    switch (type) {
      case 'from':
        this.fromColumn=selected;
        break;
      case 'to':
        this.toColumn=selected;
        break;
      default:
        true;
    }

  },
  renderSelectedCloumns: function(columnIndex,colorClass){
    $("#calllist_table thead tr th:nth-child("+(columnIndex)+")").removeClass().addClass(colorClass);
    $("#calllist_table tbody tr td:nth-child("+(columnIndex)+")").removeClass().addClass(colorClass);
  },
  checkSelectedColumns: function(){
    if(this.fromColumn==null || this.toColumn==null || this.fromColumn==this.toColumn){
      alert('请正确选择主叫号码与被叫号码!');
      return false;
    }else{
      return true;
    }
  },
  saveDataToServer: function(){
    var fromColumn=this.fromColumn;
    var toColumn=this.toColumn;
    var callData=this.rows.map(function(row){return {'from_num':row[fromColumn],'to_num':row[toColumn]}});
    var outer=this;
    $.ajax({
      url: '/calllists/save_from_json',
      data: {'data':callData},
      method: 'post',
    }).done(function(response){
      if(response['success']){
        outer.batch=response['batch'];
      }
    });
  }
};