String.prototype.getQueryString = function(name) {
  var reg = new RegExp("(\\?|\\&)" + name + "=([^\\&]+)");
  if (this.indexOf("?") < 0) {
    return null;
  } else {
    var found = reg.exec(this.substr(this.indexOf("?")));
    return found == null ? null : unescape(found[2]);
  }
}

String.prototype.compareTo = function(another, _method_) {
  var thisInt = parseInt(this);
  var anotherInt = parseInt(another);
  switch (_method_.toString()) {
    case "gt":
      return thisInt > anotherInt;
    case "gte":
      return thisInt >= anotherInt;
    case "lt":
      return thisInt < anotherInt;
    case "lte":
      return thisInt <= anotherInt;
    case "eq":
      return thisInt == anotherInt;
    case "neq":
      return thisInt != anotherInt;
    default:
      return false;
  }
}

 window.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

 window.shallowCopy = function(obj) {
  var newobj = {};
  for (var attr in obj) {
    newobj[attr] = obj[attr];
  }
  return newobj;
}

 window.shallowMerge = function(obj1, obj2) {
  var newobj = {};
  for (var attr1 in obj1) {
    newobj[attr1] = obj1[attr1];
  }
  for (var attr2 in obj2) {
    newobj[attr2] = obj2[attr2];
  }
  return newobj;
}

 window.shallowAbsorb = function(reciver, supplier) {
  for (var attr in supplier) {
    reciver[attr] = supplier[attr];
  }
  return reciver;
}

String.prototype.toBlob = function() {
  var dataUrlPattern = /^data:((text)|(image))\/[a-z]*;base64,/;
  if (dataUrlPattern.test(this)) {
    var arr = this.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  } else {
    return new Blob([this]);
  }

}

Array.prototype.allMatch = function(condition) {
  var matches = this.filter(condition);
  return matches.length === this.length;

}

Array.prototype.allSame = function(cmp) {
  if (!(cmp instanceof Function)) {
    cmp = function(x) {
      return x;
    }
  }
  if (this.length <= 0) {
    return [false, null];
  } else {
    var first = cmp(this[0]);
    var same = this.filter(function(x) {
      return cmp(x) === first;
    }).length == this.length;
    return [same, first];
  }
}
