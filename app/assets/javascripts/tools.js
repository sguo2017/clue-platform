
function import_calllist_from_excel(){
  if($('#upload_excel_field').length==0 && $('#upload_excel_field')[0].files.length==0) return;
  var file = $('#upload_excel_field')[0].files[0];
  if(!file) return;
  $('#file_name_wrap').val(file.name);
  var form = new FormData();
  form.append('excel_call_list',file);
  $.ajax({
    url:"/calllists/process_excel",
    type:"post",
    data:form,
    processData:false, //important
    contentType:false  //important
  }).done(responseData => {
    var links = responseData['links'];
    var rows=[],formOptions=[],toOptions=[];
    for(var i = 1;i<=links.length;i++){
      rows.push(buildListRow(i,links[i-1].from_num,links[i-1].to_num));
      formOptions.push(buildSelectOption(links[i-1].from_num,links[i-1].from_num));
      toOptions.push(buildSelectOption(links[i-1].to_num,links[i-1].to_num));
    }
    $('#calllist_table > tbody').append(rows.join('\n'));
    $('#from_selector').append(formOptions.join('\n'));
    $('#to_selector').append(toOptions.join('\n'));
  });
}

function buildListRow(label='',fromNum='',toNum=''){
  return '\
  <tr>\
    <td>\
      <div class="checkbox-ui">\
        <span class="aliconfont icon-checkbox active"></span>\
        <input type="checkbox">\
      </div>\
    </td>\
    <td class="list-label">'+label+'</td>\
    <td class="text-primary">'+fromNum+'</td>\
    <td class="text-warning">'+toNum+'</td>\
    <td>2017-12-12</td>\
    <td>通话记录</td>\
    </tr>\
  ';
}
function buildSelectOption(value='',name=''){
  return '<option value='+value+'>'+name+'</option>';
}

function changeAllSelectStatus(){
  var rows=$('table .icon-checkbox');
  for(var i=0;i<rows.length;i++){
    if($(rows[i]).hasClass('active')){
      $(rows[i]).removeClass('active');
    }else{
      $(rows[i]).addClass('active');
    }
  }
}

function filtrateRows(filtBy,filtValue){
  if(filtBy='from'){

  }else{
    
  }
}
