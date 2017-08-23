$(document).on("turbolinks:load", function() {
  if ($("#tactic-hidden-flowchart").length > 0) {
    setHiddenFlowchart();
  }
});

function setHiddenFlowchart() {
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
      tacticFlowchart.model = go.Model.fromJson(model_data);
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
        scale: 1 //显示整个图片而非可见部分
      });
      $("#flowchart-image").attr("src", imageDataURL);
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