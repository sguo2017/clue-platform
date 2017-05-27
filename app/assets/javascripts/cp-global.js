function submitFormWithImage(fileFieldId) {
  var formObj = $("form");
  var input_file = document.getElementById(fileFieldId);
  if (input_file.files.length != 1) {
    formObj.submit();
    return;
  } else {
      let formData = new FormData();
      let url = '/calllists/import';
      formData.append("image", input_file.files[0]);
      fetch(url, {
        method: 'POST',
        //mode: "cors",
        body: formData
      }).then((response) =>response.text()).then((responseData) =>{
        console.log('responseData', responseData);
      }).catch((error) =>{
        alert("服务器连接失败，请重试！");
        console.error('error', error);
      });
  }
}


