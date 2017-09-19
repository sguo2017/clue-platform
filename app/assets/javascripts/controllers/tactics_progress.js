(function() {
  $(document).on("turbolinks:load", function() {
    if ($("#tactic-hidden-flowchart").length > 0) {
      initHiddenFlowchart();
    };
    if ($("#swiper-container-tactics-progress").length > 0) {
      initTacticProgressSwiper();
    };
    if ($("#task-pie-chart-canvas").length > 0) {
      initTacticTaskPieChart();
    };
    if ($(".member-popover-tactics-progress").length > 0) {
      initTacticProgressPopover();
    };
  });

  function initTacticProgressPopover() {
    $('.member-popover-tactics-progress').each(function() {
      $(this).data("content", $(this).nextAll(".for-popover").html());
    });
    $('.member-popover-tactics-progress').popover();
  }

  function initTacticProgressSwiper() {
    //初始化swiper
    var mySwiper = new Swiper('#swiper-container-tactics-progress', {
      direction: 'horizontal', //滑动方向vertical或horizontal(默认)
      loop: false, //boolean循环与否
      speed: 500, //触摸滑动到贴合所用ms时长
      slidesPerView: 5, //播放器放多少张图片
      // loopedSlides :6,
      // 如果需要前进后退按钮
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 20 //默认为0，单位为px;slide之间的边距
    });
  }

  function initTacticTaskPieChart() {
    var width = $("#task-pie-chart-canvas").width();
    var height = $("#task-pie-chart-canvas").height();
    var radius = width > height ? height / 2 : width / 2;
    $("#task-pie-chart-canvas").attr("width", width);
    $("#task-pie-chart-canvas").attr("height", height);
    var finshedTaskCount = $("#task-pie-chart-canvas").data("finished-task-count");
    var unfinshedTaskCount = $("#task-pie-chart-canvas").data("unfinished-task-count");
    var totalTaskCount = finshedTaskCount + unfinshedTaskCount;
    var data = [{
        name: "已完成",
        angle: Math.PI * 2 * finshedTaskCount / totalTaskCount,
        color: "#f8b115",
        count: finshedTaskCount
      },
      {
        name: "未完成",
        angle: Math.PI * 2 * unfinshedTaskCount / totalTaskCount,
        color: "#598fea",
        count: unfinshedTaskCount
      }
    ];
    var settings = {
      centerX: radius + 40,
      centerY: radius,
      strokeStyle: "white",
      lineWidth: 3,
      radius: radius,
      holeRadius: radius * 0.6,
      holeColor: "white",
      textUpStyle: "25px 微软雅黑",
      textUpColor: "black",
      textUpOffset: 0,
      textDownStyle: "10px 微软雅黑",
      textDownColor: "gray",
      textDownOffset: 10,
      descriptTextStyle: "10px 微软雅黑",
      descriptTextSize: 10
    };
    drawTaskPieChart("task-pie-chart-canvas", data, settings);
  }

  function drawTaskPieChart(id, array, settings) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var totalCount = array.map(function(x) {
      return x.count;
    }).reduce(function(a, b) {
      return a + b;
    });
    if (totalCount <= 0) {
      ctx.textAlign = "center";
      ctx.font = "45px 微软雅黑";
      ctx.fillStyle = "black";
      ctx.fillText("暂无任务", 180, 100);
      return;
    }
    ctx.strokeStyle = settings["strokeStyle"];
    // ctx.lineWidth = settings["lineWidth"];
    for (var i = 0, startAngle = -Math.PI / 6; i < array.length; i++) {
      var endAngle = startAngle + array[i].angle;
      ctx.beginPath();
      ctx.fillStyle = array[i].color;
      ctx.moveTo(settings["centerX"], settings["centerY"]);
      ctx.arc(settings["centerX"], settings["centerY"], settings["radius"], startAngle, endAngle);
      ctx.lineTo(settings["centerX"], settings["centerY"]);
      ctx.fill();
      ctx.stroke();
      startAngle = endAngle;
    }

    ctx.beginPath();
    ctx.fillStyle = settings["holeColor"];
    ctx.moveTo(settings["centerX"], settings["centerY"]);
    ctx.arc(settings["centerX"], settings["centerY"], settings["holeRadius"], 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.font = settings["textUpStyle"];
    ctx.fillStyle = settings["textUpColor"];
    ctx.fillText(totalCount, settings["centerX"], settings["centerY"] + settings["textUpOffset"]);

    ctx.font = settings["textDownStyle"];
    ctx.fillStyle = settings["textDownColor"];
    ctx.fillText("任务总数", settings["centerX"], settings["centerY"] + settings["textDownOffset"]);


    ctx.textAlign = "start";
    ctx.font = settings["descriptTextStyle"];
    var cap = 4;
    var offsetY = (settings["centerY"] * 2 - (array.length * settings["descriptTextSize"] + (array.length - 1) * cap)) / 2;
    offsetY += settings["descriptTextSize"];
    for (var i = 0; i < array.length; i++) {
      ctx.fillStyle = array[i]["color"];
      var text = array[i]["name"] + "：" + array[i]["count"] + "项（" + (100 * array[i]["count"] / totalCount).toFixed(2) + "%)";
      ctx.fillText(text, settings["centerX"] + settings["radius"] + 10, offsetY);
      offsetY += cap;
      offsetY += settings["descriptTextSize"];
    }
  }


  function initHiddenFlowchart() {
    var tacticFlowchart;

    function init() {
      var $$ = go.GraphObject.make;
      tacticFlowchart = $$(go.Diagram, "tactic-hidden-flowchart", {
        initialContentAlignment: go.Spot.Center
      });

      function nodeStyle() {
        return [
          new go.Binding("location", "location", go.Point.parse),
          new go.Binding("task_id", "task_id"),
          new go.Binding("width", "width"),
          new go.Binding("height", "height"),
          {
            zOrder: 0,
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE",
            resizeObjectName: "SHAPE"
          }
        ];
      }

      function makePort(name, spot, output, input) {
        return $$(go.Shape, "Circle", {
          fill: "transparent",
          stroke: null,
          desiredSize: new go.Size(12, 12),
          alignment: spot,
          alignmentFocus: spot,
          portId: name,
          fromSpot: spot,
          toSpot: spot,
          fromLinkable: output,
          toLinkable: input
        });
      }

      var lightText = 'whitesmoke';
      tacticFlowchart.nodeTemplateMap.add("",
        $$(go.Node, "Spot", nodeStyle(),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Rectangle", {
                name: "NODEFILLSHAPE",
                fill: "#00A9C9",
                stroke: null
              },
              new go.Binding("fill", "nodeColor"),
              new go.Binding("stroke", "nodeOutlineColor"),
              new go.Binding("strokeWidth", "nodeOutlineWidth"),
              new go.Binding("figure", "figure")
            ),

            $$(go.TextBlock, {
                name: "TEXTOBJECT",
                stroke: lightText,
                margin: 8,
                wrap: go.TextBlock.WrapFit,
                minSize: new go.Size(20, NaN)
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign")
            )
          ),
          makePort("T", go.Spot.Top, true, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, true)
        )
      );
      tacticFlowchart.nodeTemplateMap.add("Start",
        $$(go.Node, "Spot", nodeStyle(),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Circle", {
                name: "NODEFILLSHAPE",
                fill: "#79C900",
                stroke: null
              },
              new go.Binding("fill", "nodeColor"),
              new go.Binding("stroke", "nodeOutlineColor"),
              new go.Binding("strokeWidth", "nodeOutlineWidth"),
              new go.Binding("figure", "figure")
            ),
            $$(go.TextBlock, "Start", {
                name: "TEXTOBJECT",
                stroke: lightText,
                minSize: new go.Size(20, NaN)
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign")
            )
          ),
          makePort("T", go.Spot.Top, true, false),
          makePort("L", go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, true, false)
        )
      );
      tacticFlowchart.nodeTemplateMap.add("End",
        $$(go.Node, "Spot", nodeStyle(),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Circle", {
                name: "NODEFILLSHAPE",
                fill: "#DC3C00",
                stroke: null
              },
              new go.Binding("fill", "nodeColor"),
              new go.Binding("stroke", "nodeOutlineColor"),
              new go.Binding("strokeWidth", "nodeOutlineWidth"),
              new go.Binding("figure", "figure")
            ),
            $$(go.TextBlock, "End", {
                name: "TEXTOBJECT",
                stroke: lightText,
                minSize: new go.Size(20, NaN)
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign")
            )
          ),
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, false, true),
          makePort("B", go.Spot.Bottom, false, true)
        )
      );
      tacticFlowchart.nodeTemplateMap.add("Circle",
        $$(go.Node, "Spot", nodeStyle(),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Circle", {
                name: "NODEFILLSHAPE",
                fill: "#00A9C9",
                stroke: null
              },
              new go.Binding("fill", "nodeColor"),
              new go.Binding("stroke", "nodeOutlineColor"),
              new go.Binding("strokeWidth", "nodeOutlineWidth"),
              new go.Binding("figure", "figure")
            ),
            $$(go.TextBlock, {
                name: "TEXTOBJECT",
                stroke: lightText,
                minSize: new go.Size(20, NaN)
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign")
            )
          ),
          makePort("T", go.Spot.Top, true, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, true)
        )
      );
      tacticFlowchart.nodeTemplateMap.add("Comment",
        $$(go.Node, "Auto", nodeStyle(),
          $$(go.Shape, "File", {
              name: "NODEFILLSHAPE",
              fill: "#EFFAB4",
              stroke: null
            },
            new go.Binding("fill", "nodeColor"),
            new go.Binding("stroke", "nodeOutlineColor"),
            new go.Binding("strokeWidth", "nodeOutlineWidth"),
            new go.Binding("figure", "figure")
          ),
          $$(go.TextBlock, {
              name: "TEXTOBJECT",
              wrap: go.TextBlock.WrapFit,
              margin: 8,
              textAlign: "center",
              stroke: '#454545',
              minSize: new go.Size(20, NaN)
            },
            new go.Binding("font", "font"),
            new go.Binding("stroke", "textColor"),
            new go.Binding("text", "text"),
            new go.Binding("isUnderline", "isUnderline"),
            new go.Binding("textAlign", "textAlign")
          )
        )
      );
      tacticFlowchart.nodeTemplateMap.add("Outline",
        $$(go.Node, "Spot", nodeStyle(),
          new go.Binding("zOrder", "zOrder"),
          $$(go.Panel, "Auto",
            $$(go.Shape, "Rectangle", {
                name: "NODEFILLSHAPE",
                fill: "rgba(255,255,255,0)",
                stroke: "gray",
                strokeWidth: 2
              },
              new go.Binding("fill", "nodeColor"),
              new go.Binding("stroke", "nodeOutlineColor"),
              new go.Binding("strokeWidth", "nodeOutlineWidth")
            )
          )
        )
      );
      tacticFlowchart.nodeTemplateMap.add("Textbox",
        $$(go.Node, "Spot", nodeStyle(),
          $$(go.Panel, "Auto",
            $$(go.TextBlock, {
                name: "TEXTOBJECT",
                wrap: go.TextBlock.WrapFit,
                textAlign: "left",
                stroke: '#454545',
                minSize: new go.Size(20, NaN)
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign")
            )
          )
        )
      );

      tacticFlowchart.linkTemplate =
        $$(go.Link, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 15,
            toShortLength: 4
          },
          new go.Binding("points"),
          $$(go.Shape, {
              isPanelMain: true,
              strokeWidth: 8,
              stroke: "transparent",
              name: "HIGHLIGHTSHAPE"
            },
            new go.Binding("stroke", "highlightWidth")
          ),
          $$(go.Shape, {
              name: "LINKSHAPE",
              isPanelMain: true,
              stroke: "gray"
            },
            new go.Binding("stroke", "lineColor"),
            new go.Binding("strokeWidth", "lineWidth")
          ),
          $$(go.Shape, {
              name: "TOARROWSHAPE",
              toArrow: "Standard",
              stroke: "gray",
              fill: "gray",
              strokeWidth: 3
            },
            new go.Binding("fill", "toArrowColor"),
            new go.Binding("stroke", "toArrowOutlineColor"),
            new go.Binding("strokeWidth", "toArrowWidth"),
            new go.Binding("visible", "showToArrow")
          ),
          $$(go.Shape, {
              name: "FROMARROWSHAPE",
              fromArrow: "Backward",
              stroke: "gray",
              fill: "gray",
              strokeWidth: 3,
              visible: false
            },
            new go.Binding("fill", "fromArrowColor"),
            new go.Binding("stroke", "fromArrowOutlineColor"),
            new go.Binding("strokeWidth", "fromArrowWidth"),
            new go.Binding("visible", "showFromArrow")
          ),
          $$(go.Panel, "Auto", {
              visible: false,
              name: "LABEL",
              segmentIndex: 2,
              segmentFraction: 0.5
            },
            new go.Binding("visible", "visible"),
            $$(go.Shape, "RoundedRectangle", {
              fill: "#F8F8F8",
              stroke: null
            }),
            $$(go.TextBlock, "Yes", {
                textAlign: "center",
                name: "TEXTOBJECT",
                stroke: "#333333"
              },
              new go.Binding("font", "font"),
              new go.Binding("stroke", "textColor"),
              new go.Binding("text", "text"),
              new go.Binding("isUnderline", "isUnderline"),
              new go.Binding("textAlign", "textAlign"))
          )
        );

      tacticFlowchart.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      tacticFlowchart.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

      function load() {
        var model_data = JSON.parse($("#go-model-data").text());
        if (model_data) {
          tacticFlowchart.model = go.Model.fromJson(model_data);
        }
      }

      load();

      function customFocus() {
        var x = window.scrollX || window.pageXOffset;
        var y = window.scrollY || window.pageYOffset;
        go.Diagram.prototype.doFocus.call(this);
        window.scrollTo(x, y);
      }

      tacticFlowchart.doFocus = customFocus;
    } // end init

    init();

    function makeImage() {
      if ($("#flowchart-image-wrap").length > 0) {
        var imageDataURL = tacticFlowchart.makeImageData({
          maxSize: new go.Size(Infinity, Infinity), //去掉默认最大2000*2000的限制
          background: "white",
          scale: 1 //显示整个图片而非可见部分
        });
        if (imageDataURL === "data:,") {
          $("#flowchart-image").attr("alt", "暂无图片");
        } else {
          $("#flowchart-image").attr("src", imageDataURL);
        }
        $("#flowchart-image-wrap").zoom({
          onZoomIn: function() {
            $("#flowchart-image").css("opacity", "0");
          },
          onZoomOut: function() {
            $("#flowchart-image").css("opacity", "1");
          }
        });
      }
    }

    makeImage();

  }
})();
