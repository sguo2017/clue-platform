function submitFormWithImage(fileFieldId) {
  var formObj = $("form");
  var input_file = document.getElementById(fileFieldId);
  if (input_file.files.length != 1) {
    formObj.submit();
    return;
  } else {
      let formData = new FormData();
      let url = '/calllists/import';
      formData.append("file", input_file.files[0]);
      /* 改为ajax方式
      fetch(url, {
        method: 'POST',
        //mode: "cors",
        headers: { 
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
        body: formData
              }).then((response) =>response.text()).then((responseData) =>{
        console.log('responseData', responseData);
      }).catch((error) =>{
        alert("服务器连接失败，请重试！");
        console.error('error', error);
      });*/
    $.ajax({
      url:  url,
      type: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      cache: false,
      data: formData,
      processData: false,
      contentType: false
    }).done(function(responseData) {console.log('responseData', responseData)}).fail(function(error) {
      alert("服务器连接失败，请重试！");
      console.error('error', error)
    }); 
  }
}


