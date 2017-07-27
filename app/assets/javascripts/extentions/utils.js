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
      break;
    case "gte":
      return thisInt>=anotherInt;
      break;
    case "lt":
      return thisInt<anotherInt;
      break;
    case "lte":
      return thisInt<=anotherInt;
      break;
    case "eq":
      return thisInt==anotherInt;
      break;
    case "neq":
      return thisInt!=anotherInt;
      break;
    default:
      return false;
  }
}
