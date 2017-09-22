$(document).on("turbolinks:load", function() {
  $("#btn-update-tactic-task").click(function() {
    updateTacticTask();
  });
});

function updateTacticTask() {
  var file = $("#tactic-task-attachment")[0].files[0];
  if (!file) {
    $("#edit-tactic-task-form input[name='tactic_task[attachment_url]']").removeAttr("name");
    $("#edit-tactic-task-form input[name='tactic_task[attachment_name]']").removeAttr("name");
    $("#edit-tactic-task-form").submit();
  } else {
    var fileName = file.name;
    var formData = new FormData();
    formData.append("file", file);
    var url = 'http://123.56.157.233:9090/FastDFSWeb/servlet/imageUploadServlet';
    fetch(url, {
      method: 'POST',
      mode: "cors",
      body: formData
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      var fileUrl = json["file"];
      if (fileUrl) {
        $("#edit-tactic-task-form input[name='tactic_task[attachment_url]']").val(fileUrl);
        $("#edit-tactic-task-form input[name='tactic_task[attachment_name]']").val(fileName);
        $("#edit-tactic-task-form").submit();
      } else {
        alert("文件上传失败,请重试！");
      }
    }).catch(function() {
      alert("文件服务器连接失败，请重试！");
    });
  }
}
