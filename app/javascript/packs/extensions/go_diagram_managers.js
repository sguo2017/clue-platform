/*
 * 后面各种Manager类的父类
 * 使用寄生组合的方式进行继承
 */
function Manager(diagram) {
  this.diagram = diagram;
  //图表在数据库中的id，绑定在diagram对象的divs上，更新数据时会用到
  this.diagramId = $(this.diagram.div).data("diagram-id");

  /*
   *这个方法用来增加触发执行特点操作的dom元素和事件；
   *operation（必须），字符串，要执行的函数的名称（可为null）；
   *args（可选）是一个数组或者回调函数，存放operation函数参数，当args时一个函数时，
   *被用来生成参数，执行时会传入事件DOM元素作为参数，期望返回一个数组；
   *hooks（可选）是钩子函数的包裹对象，用于在执行操作前后进行一些处理，执行时会传入事件DOM元素作为参数；
   *当传入参数为4个时，程序会按照类型判断最后一个参数是args还是hooks；
   */
  this.addDOMTrigger = function(domElement, domEvent, operation, args, hooks) {
    var outer = this;
    switch (arguments.length) {
      case 3:
        args = [];
        hooks = {};
        break;
      case 4:
        var unknow = arguments[3];
        if (unknow && (unknow.constructor === Array || unknow.constructor === Function)) {
          args = unknow;
          hooks = {};
        } else if (unknow && unknow.constructor === Object) {
          args = [];
          hooks = unknow;
        } else {
          args = [];
          hooks = {};
        }
        break;
      default:
        break;
    }
    $(domElement).on(domEvent, function() {
      if (hooks.doBefore instanceof Function) {
        hooks.doBefore.call(outer, this);
      }
      var targetFunction = outer[operation];
      if (targetFunction instanceof Function) {
        if (args instanceof Function) {
          targetFunction.apply(outer, args(this));
        } else {
          targetFunction.apply(outer, args);
        }
      }
      if (hooks.doAfter instanceof Function) {
        hooks.doAfter.call(outer, this);
      }
    });
  };

  //增加触发特点操作的Diagram事件
  this.addDiagramTrigger = function(diagramEvent, operation, args, hooks) {
    var outer = this;
    switch (arguments.length) {
      case 2:
        args = [];
        hooks = {};
        break;
      case 3:
        var unknow = arguments[2];
        if (unknow && unknow.constructor === Array) {
          args = unknow;
          hooks = {};
        } else if (unknow && unknow.constructor === Object) {
          args = [];
          hooks = unknow;
        } else {
          args = [];
          hooks = {};
        }
        break;
      default:
        break;
    }
    this.diagram.addDiagramListener(diagramEvent, function() {
      if (hooks.doBefore instanceof Function) {
        hooks.doBefore.call(outer);
      }
      var targetFunction = outer[operation];
      if (targetFunction instanceof Function) {
        targetFunction.apply(outer, args);
      }
      if (hooks.doAfter instanceof Function) {
        hooks.doAfter.call(outer);
      }
    });
  };
}
//实现寄生组合继承的关键步骤之一
(function() {
  var Super = function() {};
  Super.prototype = Manager.prototype;
  var newSuper = new Super();
  DiagramDataManager.prototype = newSuper;
  DiagramHighlightManager.prototype = newSuper;
  DiagramVisibleMnager.prototype = newSuper;
  FrequencyScreenManager.prototype = newSuper;
  DiagramLayoutManager.prototype = newSuper;
})();


function DiagramDataManager(diagram, highlightManager) {
  Manager.call(this,diagram);
  this.highlightManager = highlightManager;
  this.saveLocation = "server-new";
  this.saveTitle = "";
  this.file = null;

  // 设置保存标题
  this.setSaveTitle = function(title) {
    this.title = title;
  }

  // 设置数据保存位置
  this.setSaveLocation = function(where) {
    (where === "local" || where === "server-new" || where ==="server-update") && (this.saveLocation = where);
  }

  // 设置文件对象
  this.setFile = function(file) {
    this.file = file;
  }

  //导出图片
  this.exportImage = function() {
    var img = this.diagram.makeImageData({
      maxSize: new go.Size(Infinity, Infinity), //去掉默认最大2000*2000的限制
      background: "white",
      scale: 1 //显示整个图片而非可见部分
    });
    sessionStorage.setItem("image-view-page-src", img);
    window.open("/image_views");
  };

  //保存数据
  this.saveData = function() {
    switch (this.saveLocation) {
      case "local":
        this.saveDataToFile();
        break;
      case "server-new": case"server-update":
        this.saveDataToServer();
        break;
      default:
    }
  }

  //保存到本地
  this.saveDataToFile = function() {
    var data = this.diagram.model.toJson();
    var link = document.createElement("a");
    link.download = "save.json";
    link.href = "data:text/txt;charset=utf-8," + data;
    link.click();
  };

  //保存数据到服务器（文件数据保存到FastDFS,数据库字段通过Rails后台保存）
  this.saveDataToServer = function() {

    function updateAnalyseResult(diagramId, dataUrl, imageUrl) {
      $.ajax({
        url: "/call_analyse_savers/"+diagramId,
        method: "PATCH",
        data: {
          call_analyse_saver: {
            data_url: dataUrl,
            image_url: imageUrl
          }
        }
      }).done(function() {
        alert("成功更新数据！");
      }).fail(function() {
        alert("保存失败");
      });
    }

    function saveAnalyseResult(dataUrl, imageUrl, title) {
      $.ajax({
        url: "/call_analyse_savers",
        method: "POST",
        data: {
          call_analyse_saver: {
            data_url: dataUrl,
            image_url: imageUrl,
            title: title
          }
        }
      }).done(function() {
        alert("成功保存数据到服务器！");
      }).fail(function() {
        alert("保存失败");
      });
    }

    var outer = this;
    var formData = new FormData();
    var url = 'http://123.56.157.233:9090/FastDFSWeb/servlet/imageUploadServlet';
    var data = new Blob([this.diagram.model.toJson()], {
      type: 'text/plain'
    });
    var imageDataUrl = this.diagram.makeImageData({
      background: "white",
      size: new go.Size(160, 120)
    });
    var image = imageDataUrl.toBlob();
    formData.append('data', data, 'data.json');
    formData.append('image', image, 'image.png');
    fetch(url, {
        method: 'POST',
        mode: "cors",
        body: formData
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        var dataUrl = json["data"];
        var imageUrl = json["image"];
        if(outer.saveLocation === "server-new" || (outer.saveLocation === "server-update" && !outer.diagramId)){
          saveAnalyseResult(dataUrl, imageUrl, outer.title);
        }else if(outer.saveLocation === "server-update" && outer.diagramId){
          updateAnalyseResult(outer.diagramId, dataUrl, imageUrl);
        }
      }).catch(function() {
        alert("服务器连接失败，请重试！");
      });
  };

  this.importFromFile = function() {
    var file = this.file;
    if (!file instanceof File) {
      return;
    } else if (file instanceof $) { //传入JQuery选择器
      file = file.get(0).files[0];
    }
    var reader = new FileReader();
    reader.readAsText(file, "utf-8");
    var outer = this;
    var $$ = go.GraphObject.make;
    reader.onload = function(e) {
      try {
        outer.diagram.layout = $$(go.ForceDirectedLayout);
        outer.diagram.startTransaction("importData");
        go.Model.fromJson(this.result, outer.diagram.model);
        outer.diagram.commitTransaction("importData");
        outer.diagram.layout = $$(go.Layout);
        outer.highlightManager.flush();
      } catch (err) {
        alert("文件内容错误！");
        outer.diagram.rollbackTransaction();
        outer.diagram.layout = $$(go.Layout);
      }
    };
  };
}

function DiagramHighlightManager(diagram, options = {}) {
  Manager.call(this,diagram);
  this.displayMax = options.displayMax || false;
  this.displayCon = options.displayCon || true;
  this.displayBtw = options.displayBtw || true;

  //高亮更新函数
  this.flush = function() {
    this.diagram.clearHighlighteds();
    var selections = this.diagram.selection;
    if (this.displayMax && selections.count === 0) {
      this.flushFeqMax();
    } else if (this.displayCon && selections.count === 1) {
      this.flushAllConnected(selections.first());
    } else if (this.displayBtw && selections.count === 2) {
      var sa = selections.toArray();
      this.flushAllPathsBetween(sa[0], sa[1]);
    }
  };

  //高亮频率最大的连线以及节点
  this.flushFeqMax = function() {
    var maxLinks = {
      targets: [],
      value: -999
    };
    this.diagram.links.each(function(link) {
      if (link.visible) {
        var feq = parseInt(link.findObject("TEXTBLOCK").text);
        if (feq > maxLinks["value"]) {
          maxLinks["targets"] = [link];
          maxLinks["value"] = feq;
        } else if (feq == maxLinks["value"]) {
          maxLinks["targets"].push(link);
        }
      }
    });
    var targets = maxLinks["targets"];
    var outer = this;
    targets.forEach(function(t) {
      outer.lightIt(t);
      outer.lightIt(t.fromNode);
      outer.lightIt(t.toNode);
    });
  };

  //高亮相连的节点和连线
  this.flushAllConnected = function(target) {
    var sel = target;
    if (sel instanceof go.Node) {
      this.lightIt(sel);
      var outer = this;
      sel.linksConnected.each(function(link) {
        if (link.visible) {
          outer.lightIt(link);
        }
      });
      sel.findNodesConnected().each(function(node) {
        var isLinksAllVisible = false;
        sel.findLinksBetween(node).each(function(l) {
          if (l.visible) {
            isLinksAllVisible = true;
            return;
          }
        });
        if (isLinksAllVisible && node.visible) {
          outer.lightIt(node);
        }
      });
    }
  };

  //高亮两点之间所有节点和连线
  this.flushAllPathsBetween = function(begin, end) {

    function isInterrupt(path) {
      var interupt = false;
      for (var i = 0; i < path.count - 1; i++) {
        var links = path.elt(i).findLinksBetween(path.elt(i + 1));
        var hasVisibleLinks = false;
        links.each(function(link) {
          if (link.visible) {
            hasVisibleLinks = true;
            return;
          }
        });
        if (!hasVisibleLinks) {
          interupt = true;
          break;
        }
      }
      return interupt;
    }

    var paths = this.findAllPathsBetween(begin, end);
    var outer = this;
    paths.each(function(path) {
      if (!isInterrupt(path)) {
        for (var i = 0; i < path.count - 1; i++) {
          outer.lightIt(path.elt(i));
          var links = path.elt(i).findLinksBetween(path.elt(i + 1));
          links.each(function(link) {
            if (link.visible) {
              outer.lightIt(link);
            }
          });
        }
        outer.lightIt(path.elt(path.count - 1));
      }
    });
  };

  //找到给定节点之间的所有路径，返回值类似[[begin,nodex,...,end],[begin,nodey,...,end],...]
  this.findAllPathsBetween = function(begin, end) {
    var stack = new go.List(go.Node);
    var coll = new go.List(go.List);

    function find(source, end) {
      source.findNodesOutOf().each(function(n) {
        if (n === source) return; // ignore reflexive links
        if (n === end) { // success
          var path = stack.copy();
          path.add(end); // finish the path at the end node
          coll.add(path); // remember the whole path
        } else if (!stack.contains(n)) { // inefficient way to check having visited
          stack.add(n); // remember that we've been here for this path (but not forever)
          find(n, end);
          stack.removeAt(stack.count - 1);
        } // else might be a cycle
      });
    }

    stack.add(begin); // start the path at the begin node
    find(begin, end);
    return coll;
  };

  //实际的高亮操作
  this.lightIt = function(obj) {
    obj.isHighlighted = true;
  };

  //高亮更新
  this.flush();
}

function FrequencyScreenManager(diagram, highlighManager) {
  Manager.call(this,diagram);
  this.highlighManager = highlighManager;
  this.feq = 1;
  this.type = "renew";
  this.method = "gte";

  this.doFilter = function() {
    var outer = this;

    function setFeqHide(link, value) {
      var model = outer.diagram.model;
      var data = link.data;
      var new_visible_attr = shallowCopy(data.visible_attr);
      new_visible_attr.hidden_by_feq = value;
      model.setDataProperty(data, "visible_attr", new_visible_attr);
    }

    var feq = this.feq.toString();
    switch (this.type) {
      case "continuous": //连续筛选
        if (!feq) {
          this.resetFilter();
          return;
        }
        this.diagram.links.each(function(link) {
          if (link.visible_attr.can_show) {
            var text = link.findObject("TEXTBLOCK").text;
            setFeqHide(link, !text.compareTo(feq, outer.method));
          }
        });
        break;
      case "renew": //重新筛选
        this.resetFilter();
        this.diagram.links.each(function(link) {
          if (link.visible_attr.can_show) {
            var text = link.findObject("TEXTBLOCK").text;
            setFeqHide(link, !text.compareTo(feq, outer.method));
          }
        });
        break;
      default:
        true;
    }
    this.diagram.nodes.each(function(node) {
      var lonely = true;
      node.linksConnected.each(function(link) {
        if (link.visible) {
          lonely = false;
          return;
        }
      });
      if (lonely) {
        var model = outer.diagram.model;
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_feq = true;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
      }
    });
    this.highlighManager.flush();
  };

  this.resetFilter = function() {
    var outer = this;
    this.diagram.nodes.each(function(node) {
      if (node.visible_attr.can_show) {
        var model = outer.diagram.model;
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_feq = false;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
      }
    });
    this.diagram.links.each(function(link) {
      if (link.visible_attr.can_show) {
        var model = outer.diagram.model;
        var data = link.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_feq = false;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
      }
    });
    this.highlighManager.flush();
  };

}

function DiagramVisibleMnager(diagram, highlighManager) {
  Manager.call(this,diagram);
  this.highlighManager = highlighManager;

  this.hideUnselected = function() {
    var model = this.diagram.model;
    this.diagram.nodes.each(function(node) {
      if (!node.isSelected && node.visible_attr.can_show) {
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_sel = true;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
        node.linksConnected.each(function(link) {
          if (link.visible) {
            var ldata = link.data;
            var lnew_visible_attr = shallowCopy(ldata.visible_attr);
            lnew_visible_attr.hidden_by_sel = true;
            model.setDataProperty(ldata, "visible_attr", lnew_visible_attr);
          }
        });
      }
    });
    this.highlighManager.flush();
  };

  this.showUnselected = function() {
    var model = this.diagram.model;
    this.diagram.nodes.each(function(node) {
      if (node.visible_attr.can_show) {
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_sel = false;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
      }
    });
    this.diagram.links.each(function(link) {
      if (link.visible_attr.can_show) {
        var ldata = link.data;
        var lnew_visible_attr = shallowCopy(ldata.visible_attr);
        lnew_visible_attr.hidden_by_sel = false;
        model.setDataProperty(ldata, "visible_attr", lnew_visible_attr);
      }
    });
    this.highlighManager.flush();
  };

  this.hideUnhighLighted = function() {
    var model = this.diagram.model;
    this.diagram.nodes.each(function(node) {
      if (!node.isHighlighted && node.visible_attr.can_show) {
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_hlight = true;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
        node.linksConnected.each(function(link) {
          if (link.visible) {
            var ldata = link.data;
            var lnew_visible_attr = shallowCopy(ldata.visible_attr);
            lnew_visible_attr.hidden_by_hlight = true;
            model.setDataProperty(ldata, "visible_attr", lnew_visible_attr);
          }
        });
      }
    });
    this.highlighManager.flush();
  };

  this.showUnhighLighted = function() {
    var model = this.diagram.model;
    this.diagram.nodes.each(function(node) {
      if (node.visible_attr.can_show) {
        var data = node.data;
        var new_visible_attr = shallowCopy(data.visible_attr);
        new_visible_attr.hidden_by_hlight = false;
        model.setDataProperty(data, "visible_attr", new_visible_attr);
      }
    });
    this.diagram.links.each(function(link) {
      if (link.visible_attr.can_show) {
        var ldata = link.data;
        var lnew_visible_attr = shallowCopy(ldata.visible_attr);
        lnew_visible_attr.hidden_by_hlight = false;
        model.setDataProperty(ldata, "visible_attr", lnew_visible_attr);
      }
    });
    this.highlighManager.flush();
  };

}

function DiagramLayoutManager(diagram) {
  Manager.call(this,diagram);
  this.layout = "forceDirected";
  this.wheelBehavior = "zoom";

  this.setWheelBehavior = function(wheelBehavior) {
    wheelBehavior && (this.wheelBehavior = wheelBehavior);
  }

  this.applyWheelBehavior = function() {
    this.diagram.changeWheelBehavior(this.wheelBehavior);
  }

  this.setLayout = function(layout) {
    layout && (this.layout = layout);
  }

  this.applyLayout = function() {
    this.diagram.changeLayout(this.layout);
  }


  this.adjustScale = function(scaleType) {
    this.diagram.adjustScale(scaleType);
  }

}

export {Manager, DiagramHighlightManager, DiagramDataManager, DiagramVisibleMnager, DiagramLayoutManager, FrequencyScreenManager}
