function getQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

String.prototype.compareTo= function (another,_method_){
  another=another.toString();
  switch (_method_.toString()) {
    case "gt":
    return this>another;
    break;
    case "gte":
    return this>=another;
    break;
    case "lt":
    return this<another;
    break;
    case "lte":
    return this<=another;
    break;
    case "eq":
    return this===another;
    break;
    case "neq":
    return this!=another;
    break;
    default:
    return false;
  }
}
