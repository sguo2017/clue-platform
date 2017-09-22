$(document).on('turbolinks:load',function(){
  $('.add-analysis-tool .add-analysis-item').click(function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
    }else{
      $(this).addClass('active');
    }
  });
  if($("#vue-excel-app").length > 0){
    initAddManualVueApp();
  }

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

function initAddManualVueApp(){
  var TABLE = {
  	props: ["sheet","sheetIndex","selectedColumns","checkedItems","checkAllStatus"],
  	template:"\
  	<table class='table table-hover thead-bg block-mt'>\
  	<thead>\
  	<tr>\
  	<th>\
  	<div>\
  	<input type='checkbox' v-model='checkAllStatus[sheetIndex]' v-on:change='changeAllChecks'/>\
  	</div>\
  	</th>\
  	<th \
  	v-for='(header,hIndex) in sheet.headers'\
  	v-bind:key='header'>\
  	{{header}}\
  	</th>\
  	</tr>\
  	</thead>\
  	<tbody>\
  	<tr v-for='(row,rIndex) in sheet.rows' v-bind:key='row.toString()' @dblclick='dbclick(rIndex)'>\
  	<td>\
  	<div>\
  	<input type='checkbox' v-model='checkedItems[sheetIndex][rIndex]'/>\
  	</div>\
  	</td>\
  	<td v-for='(col,cIndex) in row' v-bind:key='col' v-bind:class='classObject(cIndex)'>{{col}}</td>\
  	</tr>\
  	</tbody>\
  	</table>\
  	",
  	methods: {
  		classObject: function (cIndex) {
  			var outer = this;
  			var a = {
  				'text-label': outer.selectedColumns.from[outer.sheetIndex]!==cIndex && outer.selectedColumns.to[outer.sheetIndex]!==cIndex,
  				'text-warning': outer.selectedColumns.from[outer.sheetIndex]===cIndex,
  				'text-primary': outer.selectedColumns.to[outer.sheetIndex]===cIndex
  			};
  			return a;
  		},
  		changeAllChecks: function(){
  			var status = this.checkAllStatus[this.sheetIndex];
  			var target = this.checkedItems[this.sheetIndex];
  			for(var i=0;i<target.length;i++){
  				Vue.set(target,i,status);
  			}
  		},
  		dbclick: function(rowIndex){
  			Vue.set(this.checkedItems[this.sheetIndex],rowIndex,!this.checkedItems[this.sheetIndex][rowIndex]);
  		}
  	}
  }
  var workbook=new Workbook();
  new Vue({
  	el: "#vue-excel-app",
  	components: {
  		"my-table":TABLE
  	},
  	data: {
  		workbook: workbook,
  		activeTable: 0,
  		selectedColumns: {from:[],to:[]},
  		includeHeaders: [],
  		includeCheked: [],
  		checkedItems:[],
  		checkAllStatus:[],
  		saveToDb: false,
  		dataNote: ''

  	},

  	created: function(){
  		$(':input').labelauty();
  	},

  	watch: {
  		'workbook.id': function(){
  			var len = workbook.sheets.length;
  			this.selectedColumns={from: [],to: []};
  			for(var i=0;i<len;i++){
  				this.selectedColumns.from.push('');
  				this.selectedColumns.to.push('');
  				this.includeHeaders.push(true);
  				this.includeCheked.push('include');
  				var checked=[];
  				for(var j=0;j<this.workbook.sheets[i].rows.length;j++){
  					checked.push(true);
  				}
  				this.checkedItems.push(checked);
  				this.checkAllStatus.push(true);
  			}
  		}
  	},
  	methods: {
      showFileDialog: function(){
        $('#upload_excel_field').click();
      },
  		switchSheet: function(sheetIndex){
  			this.activeTable=sheetIndex;
  		},
  		isHidden: function(targetIndex){
  			return this.activeTable!==targetIndex;
  		},
  		isDisabled: function(){
  			return !this.saveToDb?'disabled':'' ;
  		},
  		changeHeader: function(sIndex){
  			var origin = this.workbook.sheets[sIndex].includeHeaders;
  			this.workbook.sheets[sIndex].includeHeaders = !origin;
  			this.workbook.sheets[sIndex].setHeaders();
  			this.workbook.sheets[sIndex].setRows();
  		},
  		submit: function(event){
  			var from = this.selectedColumns.from[this.activeTable];
  			var to = this.selectedColumns.to[this.activeTable];
  			if(from !== '' && to !== '' && from !== to){
  				this.saveDataToServer();
  				this.passData();
  			}else{
  				alert("请选择正确的主叫号码与被叫号码！");
  				event.preventDefault();
  			}
  		},
  		reload: function(){
  			Turbolinks.visit(location);
  		},
  		changeDataNoteStatus: function(){
  			if(!this.saveToDb){
  				$("#data-note").attr('disabled','disabled');
  			}else{
  				$("#data-note").removeAttr('disabled');
  			}
  		},
  		passData: function(){
  			var fromColumnIndex=this.selectedColumns.from[this.activeTable];
  			var toColumnIndex=this.selectedColumns.to[this.activeTable];
  			var selected = this.checkedItems[this.activeTable];
  			var isIncludeCheked = this.includeCheked[this.activeTable]==='include';
  			var callData=this.workbook.sheets[this.activeTable].rows
  			.filter(function(row,index){
  				if(isIncludeCheked){
  			    return selected[index];
  			  }else{
  			    return !selected[index];
  			  }
  			})
  			.map(function(row){return {'from_num':row[fromColumnIndex],'to_num':row[toColumnIndex]}});
  			sessionStorage.setItem('call_list_raw_rows',JSON.stringify(callData))
  			sessionStorage.setItem('call_list_from_column','from_num')
  			sessionStorage.setItem('call_list_to_column','to_num')
  		},
  		saveDataToServer: function(){
  			var fromColumnIndex=this.selectedColumns.from[this.activeTable];
  			var toColumnIndex=this.selectedColumns.to[this.activeTable];
  			var selected = this.checkedItems[this.activeTable];
  			var isIncludeCheked = this.includeCheked[this.activeTable]==='include';
  			var callData=this.workbook.sheets[this.activeTable].rows
  			.filter(function(row,index){
  				if(isIncludeCheked){
  			    return selected[index];
  			  }else{
  			    return !selected[index];
  			  }
  			})
  			.map(function(row){return {'from_num':row[fromColumnIndex],'to_num':row[toColumnIndex]}});
  			$.ajax({
  				url: '/calllists/save_from_json',
  				data: {'data':callData,note: this.dataNote},
  				method: 'post'
  			});
  		}
  	}
  });
}
