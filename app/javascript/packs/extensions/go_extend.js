go.Diagram.prototype.setFont = function(key, value) {
  var sels = this.selection;
  sels.each(function(sel) {
    var target = sel.findObject("TEXTOBJECT");
    if (target) {
      var fontObj = fontParser(target.font);
      var keyReg = /^font((Style)|(Variant)|(Weight)|(Size)|(Family))$/;
      if (key && keyReg.test(key) && value != null) {
        if (value.constructor == String) value = value.toLowerCase();
        fontObj[key] = value;
      }
      target.font = fontObj.toString();
    }
  });
};

go.Diagram.prototype.getFont = function() {
  var sels = this.selection;
  if (!sels || sels.count === 0) return new FontObj();
  var font = sels.first().findObject("TEXTOBJECT").font;
  var isAllSame = sels.toArray().allMatch(function(x) {
    return x.findObject("TEXTOBJECT").font === font
  });
  if (isAllSame) {
    return fontParser(font);
  } else {
    return new FontObj();
  }
}

function FontObj() {
  this.toString = function() {
    var attrs = [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily];
    return attrs.filter(function(x) {
      return x;
    }).join(" ");
  }
}

function fontParser(fontString) {
  if (!fontString) return new FontObj();
  var font = new FontObj();
  var fontArray = fontString.split(" ").map(function(x) {
    return x.trim()
  }).filter(function(x) {
    return x
  });
  var stylePattern = /(^normal$)|(^italic$)|(^oblique$)/;
  var variantPattern = /(^normal$)|(^small-caps$)|(^inherit$)/;
  var weightPattern = /(^normal$)|(^bold(er)*$)|(^lighter$)|(^inherit$)|(^[1-9]00$)/;
  var sizePattern = /(^x{1,2}-((small)|(large))$)|(^medium$)|(^((small)|(larg))er$)|(^length$)|(^inherit$)|(^\d+(%|(px)|(pt)|(em))$)/;
  var familyPattern = /^[a-z0-9, -_]+$/;
  fontArray.forEach(function(elem) {
    if (stylePattern.test(elem) && !font.fontStyle) {
      font.fontStyle = elem;
      return;
    }
    if (variantPattern.test(elem) && !font.fontVariant) {
      font.fontVariant = elem;
      return;
    }
    if (weightPattern.test(elem) && !font.fontWeight) {
      font.fontWeight = elem;
      return;
    }
    if (sizePattern.test(elem) && !font.fontSize) {
      font.fontSize = elem;
      return;
    }
    if (familyPattern.test(elem) && !font.fontFamily) {
      font.fontFamily = elem;
      return;
    }
  });
  return font;
}

go.Diagram.prototype.getDiagramElemStyle = function() {
  var result = {};
  var sels = this.selection;
  // var selArr = sels.toArray();
  var selsTextObjArr = sels.toArray().map(function(x) {
    return x.findObject("TEXTOBJECT")
  });

  var isAllFontStyleSame = selsTextObjArr.allSame(function(x) {
    return (x && fontParser(x.font).fontStyle) || ""
  });
  var isAllFontVariantSame = selsTextObjArr.allSame(function(x) {
    return (x && fontParser(x.font).fontVariant) || ""
  });
  var isAllFontWeightSame = selsTextObjArr.allSame(function(x) {
    return (x && fontParser(x.font).fontWeight) || ""
  });
  var isAllFontSizeSame = selsTextObjArr.allSame(function(x) {
    return (x && fontParser(x.font).fontSize) || ""
  });
  var isAllFontFamilySame = selsTextObjArr.allSame(function(x) {
    return (x && fontParser(x.font).fontFamily) || ""
  });
  var isAllUnderlineSame = selsTextObjArr.allSame(function(x) {
    return (x && x.isUnderline) || false
  });
  var isAllTextAlignSame = selsTextObjArr.allSame(function(x) {
    return (x && x.textAlign) || ""
  });
  // var isAllTextColorSame = selsTextObjArr.allSame(function(x) {return x.stroke || ""});
  // var isAllNodeFillSame = selArr.allSame(function(x) {return x.fill || ""});
  // var isAllNodeOutlineColorSame = selArr.allSame(function(x) {return x.stroke || ""});
  // var isAllNodeOutlineWidthSame = selArr.allSame(function(x) {return x.strokeWidth || ""});
  // var isAllLineWidthSame = selArr.allSame(function(x) {return x.strokeWidth || ""});
  // var isAllLineColor = selArr.allSame(function(x) {return x.stroke || ""});
  // var isAllArrowStyle = selArr.allSame(function(x) {return x.arrowStyle || ""});

  result.fontStyle = isAllFontStyleSame[0] ? isAllFontStyleSame[1] : "";
  result.fontVariant = isAllFontVariantSame[0] ? isAllFontVariantSame[1] : "";
  result.fontWeight = isAllFontWeightSame[0] ? isAllFontWeightSame[1] : "";
  result.fontSize = isAllFontSizeSame[0] ? isAllFontSizeSame[1] : "";
  result.fontFamily = isAllFontFamilySame[0] ? isAllFontFamilySame[1] : "";
  result.isUnderline = isAllUnderlineSame[0] ? isAllUnderlineSame[1] : false;
  result.textAlign = isAllTextAlignSame[0] ? isAllTextAlignSame[1] : "";
  // result.textColor = isAllTextColorSame[0] ? isAllTextColorSame[1] : "";
  // result.nodeFill = isAllNodeFillSame[0] ? isAllNodeFillSame[1] : "";
  // result.nodeOutlineColor = isAllNodeOutlineColorSame[0] ? isAllNodeOutlineColorSame[1] : "";
  // result.nodeOutlineWidth = isAllNodeOutlineWidthSame[0] ? isAllNodeOutlineWidthSame[1] : "";
  // result.lineWidth = isAllLineWidthSame[0] ? isAllLineWidthSame[1] : "";
  // result.lineColor = isAllLineColor[0] ? isAllLineColor[1] : "";
  // result.arrowStyle = isAllArrowStyle[0] ? isAllArrowStyle[1] : "";

  return result;

}

go.Diagram.prototype.setDiagramElemStyle = function(key, value, doneCallBack) {
  if (this.selection.size == 0) return;
  var outer = this;

  function setSelTextBlocksAttr(k, v) {
    outer.selection.each(function(x) {
      if (x.findObject("TEXTOBJECT") && k && v != null) {
        x.findObject("TEXTOBJECT")[k] = v;
      }
    });
  }

  function setSelNodesAttr(k, v) {
    outer.selection.each(function(x) {
      if (x instanceof go.Node && x.findObject("NODEFILLSHAPE") && k && v != null) {
        x.findObject("NODEFILLSHAPE")[k] = v;
      }
    });
  }

  var style = this.getDiagramElemStyle();
  switch (key) {
    case "fontStyle":
      if (!value) value = style.fontStyle == "italic" ? "" : "italic";
      this.setFont("fontStyle", value);
      break;
    case "fontVariant":
      if (!value) value = style.fontVariant == "small-caps" ? "" : "small-caps";
      this.setFont("fontVariant", value);
      break;
    case "fontWeight":
      if (!value) value = style.fontWeight == "bold" ? "" : "bold";
      this.setFont("fontWeight", value);
      break;
    case "fontSize":
      this.setFont("fontSize", value);
      break;
    case "fontFamily":
      this.setFont("fontFamily", value);
      break;
    case "isUnderline":
      if (!value) value = !style.isUnderline;
      setSelTextBlocksAttr("isUnderline", value);
      break;
    case "textAlign":
      setSelTextBlocksAttr("textAlign", value);
      break;
    case "textColor":
      setSelTextBlocksAttr("stroke", value);
      break;
    case "nodeFill":
      setSelNodesAttr("fill", value);
      break;
    case "nodeOutlineColor":
      setSelNodesAttr("stroke", value);
      break;
    case "nodeOutlineWidth":
      value = parseInt(value.replace("px", ""));
      setSelNodesAttr("strokeWidth", value);
      break;
    case "lineWidth":
      value = parseInt(value.replace("px", ""));
      this.selection.each(function(x) {
        if (x instanceof go.Link && value) {
          x.findObject("LINKSHAPE") && (x.findObject("LINKSHAPE")["strokeWidth"] = value);
          x.findObject("HIGHLIGHTSHAPE") && (x.findObject("HIGHLIGHTSHAPE")["strokeWidth"] = value + 5);
          x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE")["strokeWidth"] = value);
          x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE")["strokeWidth"] = value);
        }
      });
      break;
    case "lineColor":
      this.selection.each(function(x) {
        if (x instanceof go.Link && value) {
          x.findObject("LINKSHAPE") && (x.findObject("LINKSHAPE")["stroke"] = value);
          x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE")["stroke"] = value);
          x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE")["stroke"] = value);
        }
      });
      break;
    case "arrowStyle":
      outer.selection.each(function(x) {
        if (x instanceof go.Link && value) {
          switch (value) {
            case "forward":
              x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE").visible = true);
              x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE").visible = false);
              break;
            case "none":
              x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE").visible = false);
              x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE").visible = false);
              break;
            case "double":
              x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE").visible = true);
              x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE").visible = true);
              break;
            case "backward":
              x.findObject("TOARROWSHAPE") && (x.findObject("TOARROWSHAPE").visible = false);
              x.findObject("FROMARROWSHAPE") && (x.findObject("FROMARROWSHAPE").visible = true);
              break;
            default:
          }
        }
      });
      break;
    default:
      this.selection.each(function(x) {
        x[key] = value;
      });
  }
  if (doneCallBack instanceof Function) {
    doneCallBack(value);
  }
}

go.Diagram.prototype.changeLayout = function(layout) {
  var $$ = go.GraphObject.make;
  switch (layout) {
    case "grid":
      this.layout = $$(go.GridLayout);
      break;
    case "tree":
      this.layout = $$(go.TreeLayout);
      break;
    case "circular":
      this.layout = $$(go.CircularLayout);
      break;
    case "layeredDigraph":
      this.layout = $$(go.LayeredDigraphLayout);
      break;
    case "forceDirected":
      this.layout = $$(go.ForceDirectedLayout);
      break;
    case "default":
      this.layout = $$(go.Layout);
      break;
  }
}

go.Diagram.prototype.changeWheelBehavior = function(wheelBehavior) {
  switch (wheelBehavior) {
    case "scroll":
      this.toolManager.mouseWheelBehavior = go.ToolManager.WheelScroll;
      break;
    case "zoom":
      this.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
      break;
    default:
      break;
  }
}

//缩放控制，传入参数为"+"或"-"，每次放大或者缩小10%
go.Diagram.prototype.adjustScale = function(sign) {
  this.startTransaction('Change Scale');
  switch (sign) {
    case '-':
      this.scale *= 0.9;
      break;
    case '+':
      this.scale *= 1.1;
      break;
  }
  this.commitTransaction('Change Scale');
}

go.Diagram.prototype.createOverview = function(div, options) {
  var $$ = go.GraphObject.make;
  var overview = $$(go.Overview, div, {
    observed: this,
    contentAlignment: go.Spot.Center,
    maxScale: 0.5
  });
  for (var key in options) {
    overview[key] = options[key];
  }
}

go.Diagram.prototype.changeModel = function(model, options) {
  if (model) {
    options || (options = {});
    if (options.layoutBefore) {
      this.changeLayout(options.layoutBefore);
    }
    try {
      this.startTransaction("导入数据");
      go.Model.fromJson(model, this.model);
      this.commitTransaction("导入数据");
    } catch (err) {
      alert("导入失败！");
      console.log(e);
      this.rollbackTransaction();
    } finally {
      if (options.layoutAfter) {
        this.changeLayout(options.layoutAfter)
      }
    }
  }
}
