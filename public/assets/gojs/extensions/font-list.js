function getFontAwesomeList(){
  var start = parseInt("f000", 16);
  var end = parseInt("f2e0", 16);
  var list = [];
  var excludes = [
    parseInt("f00f", 16),
    parseInt("f01f", 16),
    parseInt("f03f", 16),
    parseInt("f04f", 16),
    parseInt("f05f", 16),
    parseInt("f06f", 16),
    parseInt("f07f", 16),
    parseInt("f08f", 16),
    parseInt("f09f", 16),
    parseInt("f0af", 16),
    parseInt("f0bf", 16),
    parseInt("f0cf", 16),
    parseInt("f0df", 16),
    parseInt("f0ef", 16),
    parseInt("f0ff", 16),
    parseInt("f10f", 16),
    parseInt("f11f", 16),
    parseInt("f12f", 16),
    parseInt("f13f", 16),
    parseInt("f14f", 16),
    parseInt("f15f", 16),
    parseInt("f16f", 16),
    parseInt("f17f", 16),
    parseInt("f18f", 16),
    parseInt("f19f", 16),
    parseInt("f1af", 16),
    parseInt("f1bf", 16),
    parseInt("f1cf", 16),
    parseInt("f1df", 16),
    parseInt("f1ef", 16),
    parseInt("f1ff", 16),
    parseInt("f20f", 16),
    parseInt("f21f", 16),
    parseInt("f22f", 16),
    parseInt("f23f", 16),
    parseInt("f24f", 16),
    parseInt("f25f", 16),
    parseInt("f26f", 16),
    parseInt("f27f", 16),
    parseInt("f28f", 16),
    parseInt("f29f", 16),
    parseInt("f2af", 16),
    parseInt("f2bf", 16),
    parseInt("f2cf", 16),
    parseInt("f2df", 16),

    parseInt("f116", 16),
    parseInt("f117", 16),

    parseInt("f020", 16),
    parseInt("f220", 16),
    parseInt("f22e", 16),

    parseInt("f0b3", 16),
    parseInt("f0b4", 16),
    parseInt("f0b5", 16),
    parseInt("f0b6", 16),
    parseInt("f0b7", 16),
    parseInt("f0b8", 16),
    parseInt("f0b9", 16),
    parseInt("f0ba", 16),
    parseInt("f0bb", 16),
    parseInt("f0bc", 16),
    parseInt("f0bd", 16),
    parseInt("f0be", 16)
  ]

  for(var i=start; i<=end; i++){
    if(excludes.indexOf(i)>-1) continue;
    var jsonstr = '{"ustr": "'+ "\\u" + i.toString(16) +'"}'; //'{"ustr": "\u4e2d"}'
    // 使用JSON工具转换
    var obj = JSON.parse(jsonstr); // Object {ustr: "中"}
    list.push({text: obj.ustr, category: 'font-awesome'});
  }
  return list;
}

function foo(str){
    str ='000'+str;
    return str.substring(str.length-3,str.length);
}

function getGlyphiconsList(){
  var start = parseInt("001", 10);
  var end = parseInt("260", 10);
  var list = [
    {text: "\u002a", category: 'glyphicons'},
    {text: "\u002b", category: 'glyphicons'},
    {text: "\u20ac", category: 'glyphicons'},
    {text: "\u2212", category: 'glyphicons'},
    {text: "\u2601", category: 'glyphicons'},
    {text: "\u2709", category: 'glyphicons'},
    {text: "\u270f", category: 'glyphicons'},
    {text: "\u00a5", category: 'glyphicons'},
    {text: "\u20bd", category: 'glyphicons'},
    {text: "\u231b", category: 'glyphicons'},
    {text: "\u26fa", category: 'glyphicons'},
    {text: "\uf8ff", category: 'glyphicons'}
  ];
  for(var i=start; i<=end; i++){
    var index = i-start+1;
    if(index==4 || index==61 || index==98 || index==99 || index==100 || index==147 || index==196
    || index==207 || index==208 || index==217 || index==220 || index==222 || index==228 || index==229) continue;
    var jsonstr = '{"ustr": "'+ "\\u" + "e" + foo(i) +'"}'; //'{"ustr": "\u4e2d"}'
    // 使用JSON工具转换
    var obj = JSON.parse(jsonstr); // Object {ustr: "中"}
    list.push({text: obj.ustr, category: 'glyphicons'});
  }
  return list;
}