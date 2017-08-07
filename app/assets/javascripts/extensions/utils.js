function getQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

String.prototype.compareTo= function (another,_method_){
  var thisInt=parseInt(this);
  var anotherInt=parseInt(another);
  switch (_method_.toString()) {
    case "gt":
      return thisInt>anotherInt;
    case "gte":
      return thisInt>=anotherInt;
    case "lt":
      return thisInt<anotherInt;
    case "lte":
      return thisInt<=anotherInt;
    case "eq":
      return thisInt==anotherInt;
    case "neq":
      return thisInt!=anotherInt;
    default:
      return false;
  }
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function copy(obj){
    var newobj = {};
    for ( var attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
}
