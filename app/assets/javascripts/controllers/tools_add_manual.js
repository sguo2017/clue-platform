$(document).on('turbolinks:load',function(){
  $('.add-analysis-tool .add-analysis-item').click(function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
    }else{
      $(this).addClass('active');
    }
  });

});

function Workbook(){
  this.id = guid();
  this.sheets = [];
  this.sheetsCount;
  this.sheetsNames;
  this.hasInit=false;
  this.init = function(){
      if($('#upload_excel_field').length==0 && $('#upload_excel_field')[0].files.length==0) return;
      var file = $('#upload_excel_field')[0].files[0];
      if(!file) return;
      $('#file_name_wrap').val(file.name);
      var form = new FormData();
      form.append('file',file);
      var outer = this;
      $.ajax({
        url:"/calllists/read_from_excel",
        type:"post",
        data:form,
        processData:false, //important
        contentType:false  //important
      }).done(function(responseData){
        outer.sheets = responseData['data'].map(function(sheet){
          return new Sheet(sheet.name,sheet.rows);
        });
        outer.sheetsCount = responseData['data'].length;
        outer.sheetsNames = responseData['data'].map(function(sheet){
          return sheet.name;
        });
        outer.hasInit=true;
        outer.id=guid();
      });
    }

}

function Sheet(name,rowsArray){
  this.rowsArray=rowsArray;
  this.id = guid();
  this.name = name;
  this.includeHeaders = true;
  this.headers=[];
  this.rows=[];

  this.setHeaders = function(){
    if(this.rowsArray.length <= 0){
        this.headers = [];
    }else if(this.includeHeaders){
        this.headers = this.rowsArray.slice(0,1)[0];
    }else{
      var h=[];
      for(var i = 0;i<this.rowsArray[0].length;i++){
        h.push('#未命名列'+i.toString());
      }
        this.headers = h;
    }
  };
  this.setHeaders();

  this.setRows = function(){
    if(this.rowsArray.length <= 0){
      this.rows = [];
    }else if(this.includeHeaders){
      this.rows = this.rowsArray.slice(1);
    }else{
      this.rows = this.rowsArray.slice(0);
    }
  };
  this.setRows();
}
