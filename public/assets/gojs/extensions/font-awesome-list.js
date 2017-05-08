function getFontAwesomeList(){
  var end = parseInt("f20C", 16);
  var start = parseInt("f001", 16);
  var list = [];
  for(var i=start; i<=end; i++){
    var jsonstr = '{"ustr": "'+ "\\u" + i.toString(16) +'"}'; //'{"ustr": "\u4e2d"}'
    // 使用JSON工具转换
    var obj = JSON.parse(jsonstr); // Object {ustr: "中"}
    list.push({text: obj.ustr, category: 'font-awesome'});
  }
  return list;
}