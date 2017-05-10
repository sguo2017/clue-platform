jsPlumb.bind("jsPlumbDemoLoaded", function(instance) {
    var renderer = jsPlumbToolkit.Support.ingest({
        jsPlumb:instance
    });

    instance.bind("jsPlumbDemoNodeAdded", function(el) {       
        renderer.ingest(el);  
    });
});
function hideAllJsplumbDemos(){
    $(".jtk-surface").each(function(index, item){
        $(item).hide();
    })
}
var jsPlumb_demo = {};
jsPlumb_demo.flowchart = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_flowchart").show();
    if($("#jsplumb_flowchart").attr("rendered")) return;
    $("#jsplumb_flowchart").attr("rendered", true);

    var instance = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { alert("hey"); }
                }
            }]
        ],
        Container: "jsplumb_flowchart"
    });

    instance.registerConnectionType("basic", {
        connector: "StateMachine",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
            "Arrow"
        ]
    });

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint("flowchart" + toId, {
                //sourceEndpoint
                endpoint: "Dot",
                paintStyle: {
                    stroke: "#7AB02C",
                    fill: "transparent",
                    radius: 7,
                    strokeWidth: 1
                },
                isSource: true,
                connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
                connectorStyle: {
                    strokeWidth: 2,
                    stroke: "#61B7CF",
                    joinstyle: "round",
                    outlineStroke: "white",
                    outlineWidth: 2
                },
                hoverPaintStyle: {
                    fill: "#216477",
                    stroke: "#216477"
                },
                connectorHoverStyle: {
                    strokeWidth: 3,
                    stroke: "#216477",
                    outlineWidth: 5,
                    outlineStroke: "white"
                },
                dragOptions: {},
                overlays: [
                    [ "Label", {
                        location: [0.5, 1.5],
                        label: "Drag",
                        cssClass: "endpointSourceLabel",
                        visible:false
                    } ]
                ]
            }, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint("flowchart" + toId, {
                //targetEndpoint
                endpoint: "Dot",
                paintStyle: { fill: "#7AB02C", radius: 7 },
                hoverPaintStyle: {
                    fill: "#216477",
                    stroke: "#216477"
                },
                maxConnections: -1,
                dropOptions: { hoverClass: "hover", activeClass: "active" },
                isTarget: true,
                overlays: [
                    [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
                ]
            }, { anchor: targetAnchors[j], uuid: targetUUID });
        }
    };

    // suspend drawing and initialise.
    instance.batch(function () {

        _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
        _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
        _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
        _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            connInfo.connection.getOverlay("label").setLabel(connInfo.connection.sourceId.substring(15) + "-" + connInfo.connection.targetId.substring(15));
        });

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector("#jsplumb_flowchart .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

        // connect a few up
        instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
        instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
        instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
        instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
        instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
        instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
           // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   instance.detach(conn);
            conn.toggleType("basic");
        });

        instance.bind("connectionDrag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

jsPlumb_demo.statemachine = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_statemachine").show();
    if($("#jsplumb_statemachine").attr("rendered")) return;
    $("#jsplumb_statemachine").attr("rendered", true);
    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"StateMachine",
        HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
        ],
        Container: "jsplumb_statemachine"
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        instance.deleteConnection(c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(info.connection.id);
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    jsPlumb.on(document.getElementById("jsplumb_statemachine"), "dblclick", function(e) {
        var d = document.createElement("div");
        var id = jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
        d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
        d.style.left = e.offsetX + "px";
        d.style.top = e.offsetY + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    });

    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        // initialise draggable elements.
        instance.draggable(el);

        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 2,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        var windows = jsPlumb.getSelector("#jsplumb_statemachine .w");
        for (var i = 0; i < windows.length; i++) {
            initNode(windows[i], true);
        }
        // and finally, make a few connections
        instance.connect({ source: "opened", target: "phone1", type:"basic" });
        instance.connect({ source: "phone1", target: "phone1", type:"basic" });
        instance.connect({ source: "phone1", target: "inperson", type:"basic" });

        instance.connect({
            source:"phone2",
            target:"rejected",
            type:"basic"
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

jsPlumb_demo.draggable_connectors = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_draggable_connectors").show();
    if($("#jsplumb_draggable_connectors").attr("rendered")) return;
    $("#jsplumb_draggable_connectors").attr("rendered", true);

    var connections = [],
    updateConnections = function (conn, remove) {
        if (!remove) connections.push(conn);
        else {
            var idx = -1;
            for (var i = 0; i < connections.length; i++) {
                if (connections[i] == conn) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) connections.splice(idx, 1);
        }
        if (connections.length > 0) {
            var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
            for (var j = 0; j < connections.length; j++) {
                s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
            }
            var listDiv = document.getElementById("list")
            listDiv.innerHTML = s;
            listDiv.style.display = "block";
        } else {
            var listDiv = document.getElementById("list")
            listDiv.style.display = "none";
        }
    };


    var instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: { stroke: '#666' },
        EndpointHoverStyle: { fill: "orange" },
        HoverPaintStyle: { stroke: "orange" },
        EndpointStyle: { width: 20, height: 16, stroke: '#666' },
        Endpoint: "Rectangle",
        Anchors: ["TopCenter", "TopCenter"],
        Container: "jsplumb_draggable_connectors"
    });

    // suspend drawing and initialise.
    instance.batch(function () {

        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind("connection", function (info, originalEvent) {
            updateConnections(info.connection);
        });
        instance.bind("connectionDetached", function (info, originalEvent) {
            updateConnections(info.connection, true);
        });

        instance.bind("connectionMoved", function (info, originalEvent) {
            //  only remove here, because a 'connection' event is also fired.
            // in a future release of jsplumb this extra connection event will not
            // be fired.
            updateConnections(info.connection, true);
        });

        instance.bind("click", function (component, originalEvent) {
            alert("click!")
        });

        

        //
        // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
        // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
        // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
        // that declares 'exampleEndpoint' as its drop scope, and also that
        // only 'exampleConnection' types can be dropped here.
        //
        // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
        // 5 pixels, and a gradient.
        //
        // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
        // or not to allow a particular connection to be established.
        //
        var exampleColor = "#00f";
        var exampleEndpoint = {
            endpoint: "Rectangle",
            paintStyle: { width: 25, height: 21, fill: exampleColor },
            isSource: true,
            reattach: true,
            scope: "blue",
            connectorStyle: {
                gradient: {stops: [
                    [0, exampleColor],
                    [0.5, "#09098e"],
                    [1, exampleColor]
                ]},
                strokeWidth: 5,
                stroke: exampleColor,
                dashstyle: "2 2"
            },
            isTarget: true,
            beforeDrop: function (params) {
                return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
            },
            dropOptions: {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            }
        };

        //
        // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
        // and has scope 'exampleConnection2'.
        //
        var color2 = "#316b31";
        var exampleEndpoint2 = {
            endpoint: ["Dot", { radius: 11 }],
            paintStyle: { fill: color2 },
            isSource: true,
            scope: "green",
            connectorStyle: { stroke: color2, strokeWidth: 6 },
            connector: ["Bezier", { curviness: 63 } ],
            maxConnections: 3,
            isTarget: true,
            dropOptions: {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            }
        };

        //
        // the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
        // 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
        // overriden, so it appears in the same place on every element.
        //
        // this example also demonstrates the beforeDetach interceptor, which allows you to intercept
        // a connection detach and decide whether or not you wish to allow it to proceed.
        //
        var example3Color = "rgba(229,219,61,0.5)";
        var exampleEndpoint3 = {
            endpoint: ["Dot", {radius: 17} ],
            anchor: "BottomLeft",
            paintStyle: { fill: example3Color, opacity: 0.5 },
            isSource: true,
            scope: 'yellow',
            connectorStyle: {
                stroke: example3Color,
                strokeWidth: 4
            },
            connector: "Straight",
            isTarget: true,
            dropOptions: {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            },
            beforeDetach: function (conn) {
                return confirm("Detach connection?");
            },
            onMaxConnections: function (info) {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            }
        };

        // setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
        // of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
        var e1 = instance.addEndpoint('dragDropWindow1', { anchor: [0.5, 1, 0, 1] }, exampleEndpoint2);

        // setup some DynamicAnchors for use with the blue endpoints
        // and a function to set as the maxConnections callback.
        var maxConnectionsCallback = function (info) {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            };

        var e1 = instance.addEndpoint("dragDropWindow1", { anchor: [
                [1, 0.2, 1, 0],
                [0.8, 1, 0, 1],
                [0, 0.8, -1, 0],
                [0.2, 0, 0, -1]
            ] }, exampleEndpoint);
        // you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
        e1.bind("maxConnections", maxConnectionsCallback);

        var e2 = instance.addEndpoint('dragDropWindow2', { anchor: [0.5, 1, 0, 1] }, exampleEndpoint);
        // again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
        e2.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint('dragDropWindow2', { anchor: "RightMiddle" }, exampleEndpoint2);

        var e3 = instance.addEndpoint("dragDropWindow3", { anchor: [0.25, 0, 0, -1] }, exampleEndpoint);
        e3.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint("dragDropWindow3", { anchor: [0.75, 0, 0, -1] }, exampleEndpoint2);

        var e4 = instance.addEndpoint("dragDropWindow4", { anchor: [1, 0.5, 1, 0] }, exampleEndpoint);
        e4.bind("maxConnections", maxConnectionsCallback);
        instance.addEndpoint("dragDropWindow4", { anchor: [0.25, 0, 0, -1] }, exampleEndpoint2);

        // make .window divs draggable
        instance.draggable(jsPlumb.getSelector("#jsplumb_draggable_connectors .window"));

        // add endpoint of type 3 using a selector.
        instance.addEndpoint(jsPlumb.getSelector("#jsplumb_draggable_connectors .window"), exampleEndpoint3);

        instance.on(jsPlumb.getSelector("#jsplumb_draggable_connectors .hide"), "click", function (e) {
            instance.toggleVisible(this.getAttribute("rel"));
            jsPlumbUtil.consume(e);
        });

        instance.on(jsPlumb.getSelector("#jsplumb_draggable_connectors .drag"), "click", function (e) {
            var s = instance.toggleDraggable(this.getAttribute("rel"));
            this.innerHTML = (s ? 'disable dragging' : 'enable dragging');
            jsPlumbUtil.consume(e);
        });

        instance.on(jsPlumb.getSelector("#jsplumb_draggable_connectors .detach"), "click", function (e) {
            instance.detachAllConnections(this.getAttribute("rel"));
            jsPlumbUtil.consume(e);
        });

        instance.on(document.getElementById("clear"), "click", function (e) {
            instance.detachEveryConnection();
            var listDiv = document.getElementById("list")
            listDiv.innerHTML = "";
            listDiv.style.display = "block";
            jsPlumbUtil.consume(e);
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);    
}

jsPlumb_demo.perimeter_anchors = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_perimeter_anchors").show();
    if($("#jsplumb_perimeter_anchors").attr("rendered")) return;
    $("#jsplumb_perimeter_anchors").attr("rendered", true);

    var instance = jsPlumb.getInstance({
        Connector: "StateMachine",
        PaintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        Endpoint: [ "Dot", { radius: 5 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "jsplumb_perimeter_anchors"
    });

    var shapes = jsPlumb.getSelector(".shape");
    // make everything draggable
    instance.draggable(shapes);

    // suspend drawing and initialise.
    instance.batch(function () {

        // loop through them and connect each one to each other one.
        for (var i = 0; i < shapes.length; i++) {
            for (var j = i + 1; j < shapes.length; j++) {
                instance.connect({
                    source: shapes[i],  // just pass in the current node in the selector for source
                    target: shapes[j],
                    // here we supply a different anchor for source and for target, and we get the element's "data-shape"
                    // attribute to tell us what shape we should use, as well as, optionally, a rotation value.
                    anchors: [
                        [ "Perimeter", { shape: shapes[i].getAttribute("data-shape"), rotation: shapes[i].getAttribute("data-rotation") }],
                        [ "Perimeter", { shape: shapes[j].getAttribute("data-shape"), rotation: shapes[j].getAttribute("data-rotation") }]
                    ]
                });
            }
        }
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

jsPlumb_demo.hierarchical_chart = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_hierachical_chart").show();
    if($("#jsplumb_hierachical_chart").attr("rendered")) return;
    $("#jsplumb_hierachical_chart").attr("rendered", true);

    var color = "gray";

    var instance = jsPlumb.getInstance({
        // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
        // than the curves on the first demo, which use the default curviness value.
        Connector: [ "Bezier", { curviness: 50 } ],
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        PaintStyle: { stroke: color, strokeWidth: 2 },
        EndpointStyle: { radius: 9, fill: color },
        HoverPaintStyle: {stroke: "#ec9f2e" },
        EndpointHoverStyle: {fill: "#ec9f2e" },
        Container: "jsplumb_hierachical_chart"
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        // declare some common values:
        var overlays = [
                [ "Arrow", { location: 0.7 }, { foldback: 0.7, fill: color, width: 14 } ],
                [ "Arrow", { location: 0.3, direction: -1 }, { foldback: 0.7, fill: color, width: 14 } ]
            ];

        // add endpoints, giving them a UUID.
        // you DO NOT NEED to use this method. You can use your library's selector method.
        // the jsPlumb demos use it so that the code can be shared between all three libraries.
        var windows = jsPlumb.getSelector("#jsplumb_hierachical_chart .window");
        for (var i = 0; i < windows.length; i++) {
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-bottom",
                anchor: "Bottom",
                maxConnections: -1
            });
            instance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-top",
                anchor: "Top",
                maxConnections: -1
            });
        }

        instance.connect({uuids: ["chartWindow3-bottom", "chartWindow6-top" ], overlays: overlays, detachable: true, reattach: true});
        instance.connect({uuids: ["chartWindow1-bottom", "chartWindow2-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow1-bottom", "chartWindow3-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow2-bottom", "chartWindow4-top" ], overlays: overlays});
        instance.connect({uuids: ["chartWindow2-bottom", "chartWindow5-top" ], overlays: overlays});

        instance.draggable(windows);

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

jsPlumb_demo.sources_targets = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_sources_targets").show();
    if($("#jsplumb_sources_targets").attr("rendered")) return;
    $("#jsplumb_sources_targets").attr("rendered", true);

    var instance = jsPlumb.getInstance({
        // drag options
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        // default to a gradient stroke from blue to green.
        PaintStyle: {
            gradient: { stops: [
                [ 0, "#0d78bc" ],
                [ 1, "#558822" ]
            ] },
            stroke: "#558822",
            strokeWidth: 10
        },
        Container: "jsplumb_sources_targets"
    });

    // click listener for the enable/disable link in the source box (the blue one).
    jsPlumb.on(document.getElementById("enableDisableSource"), "click", function (e) {
        var sourceDiv = (e.target|| e.srcElement).parentNode;
        var state = instance.toggleSourceEnabled(sourceDiv);
        this.innerHTML = (state ? "disable" : "enable");
        jsPlumb[state ? "removeClass" : "addClass"](sourceDiv, "element-disabled");
        jsPlumbUtil.consume(e);
    });

    // click listener for enable/disable in the small green boxes
    jsPlumb.on(document.getElementById("jsplumb_sources_targets"), "click", ".enableDisableTarget", function (e) {
        var targetDiv = (e.target || e.srcElement).parentNode;
        var state = instance.toggleTargetEnabled(targetDiv);
        this.innerHTML = (state ? "disable" : "enable");
        jsPlumb[state ? "removeClass" : "addClass"](targetDiv, "element-disabled");
        jsPlumbUtil.consume(e);
    });

    // bind to a connection event, just for the purposes of pointing out that it can be done.
    instance.bind("connection", function (i, c) {
        if (typeof console !== "undefined")
            console.log("connection", i.connection);
    });

    // make them draggable
    instance.draggable(jsPlumb.getSelector(".smallWindow"), {
        filter:".enableDisableTarget"
    });

    // suspend drawing and initialise.
    instance.batch(function () {

        // make 'window1' a connection source. notice the filter and filterExclude parameters: they tell jsPlumb to ignore drags
        // that started on the 'enable/disable' link on the blue window.
        instance.makeSource("sourceWindow1", {
            filter:"a",
            filterExclude:true,
            maxConnections: -1,
            endpoint:[ "Dot", { radius: 7, cssClass:"small-blue" } ],
            anchor:[
                [ 0, 1, 0, 1 ],
                [ 0.25, 1, 0, 1 ],
                [ 0.5, 1, 0, 1 ],
                [ 0.75, 1, 0, 1 ],
                [ 1, 1, 0, 1 ]
            ]
        });

        // configure the .smallWindows as targets.
        instance.makeTarget(jsPlumb.getSelector(".smallWindow"), {
            dropOptions: { hoverClass: "hover" },
            anchor:"Top",
            endpoint:[ "Dot", { radius: 11, cssClass:"large-green" } ]
        });

        // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.           
        instance.connect({ source: "sourceWindow1", target: "targetWindow5" });
        instance.connect({ source: "sourceWindow1", target: "targetWindow2" });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}

jsPlumb_demo.dynamic_anchors = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_dynamic_anchors").show();
    if($("#jsplumb_dynamic_anchors").attr("rendered")) return;
    $("#jsplumb_dynamic_anchors").attr("rendered", true);

    var anEndpoint = {
        endpoint: ["Dot", { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" } ],
        paintStyle: { fill: '#00f' },
        hoverPaintStyle: { fill: "#449999" },
        isSource: true,
        isTarget: true,
        maxConnections: -1,
        connector: [ "Bezier", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],
        connectorStyle: {
            gradient: {stops: [
                [0, '#00f'],
                [0.5, '#09098e'],
                [1, '#00f']
            ]},
            strokeWidth: 5,
            stroke: '#00f'
        },
        connectorHoverStyle: {
            stroke: "#449999"
        },
        connectorOverlays: [
            ["Diamond", { fill: "#09098e", width: 15, length: 15 } ]
        ]
    };

    var instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        Container: "jsplumb_dynamic_anchors"
    });

    // suspend drawing and initialise.
    instance.batch(function () {

        var connections = {
                "dynamicWindow1": ["dynamicWindow4"],
                "dynamicWindow3": ["dynamicWindow1"],
                "dynamicWindow5": ["dynamicWindow3"],
                "dynamicWindow6": ["dynamicWindow5"],
                "dynamicWindow2": ["dynamicWindow6"],
                "dynamicWindow4": ["dynamicWindow2"]

            },
            endpoints = {},
        // ask jsPlumb for a selector for the window class
            divsWithWindowClass = jsPlumb.getSelector("#jsplumb_dynamic_anchors .window");

        // add endpoints to all of these - one for source, and one for target, configured so they don't sit
        // on top of each other.
        for (var i = 0; i < divsWithWindowClass.length; i++) {
            var id = instance.getId(divsWithWindowClass[i]);
            endpoints[id] = [
                // note the three-arg version of addEndpoint; lets you re-use some common settings easily.
                instance.addEndpoint(id, anEndpoint, {anchor: [
                    [0.2, 0, 0, -1, 0, 0, "foo"],
                    [1, 0.2, 1, 0, 0, 0, "bar"],
                    [0.8, 1, 0, 1, 0, 0, "baz"],
                    [0, 0.8, -1, 0, 0, 0, "qux"]
                ]}),
                instance.addEndpoint(id, anEndpoint, {anchor: [
                    [0.6, 0, 0, -1],
                    [1, 0.6, 1, 0],
                    [0.4, 1, 0, 1],
                    [0, 0.4, -1, 0]
                ]})
            ];
        }
        // then connect everything using the connections map declared above.
        for (var e in endpoints) {
            if (connections[e]) {
                for (var j = 0; j < connections[e].length; j++) {
                    instance.connect({
                        source: endpoints[e][0],
                        target: endpoints[connections[e][j]][1]
                    });
                }
            }
        }

        // bind click listener; delete connections on click
        instance.bind("click", function (conn) {
            instance.detach(conn);
        });

        // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
        // will be prompted to confirm deletion.
        instance.bind("beforeDetach", function (conn) {
            return confirm("Delete connection?");
        });

        //
        // configure ".window" to be draggable. 'getSelector' is a jsPlumb convenience method that allows you to
        // write library-agnostic selectors; you could use your library's selector instead, eg.
        //
        // $(".window")         jquery
        // $$(".window")        mootools
        // Y.all(".window")     yui3
        //
        instance.draggable(divsWithWindowClass);

        jsPlumb.fire("jsPlumbDemoLoaded", instance);
    });
}

jsPlumb_demo.animation = function(){
    hideAllJsplumbDemos();
    $("#jsplumb_animation").show();
    if($("#jsplumb_animation").attr("rendered")) return;
    $("#jsplumb_animation").attr("rendered", true);

    var instance,
        discs = [],

        prepare = function (elId) {
            var el = document.getElementById(elId);

            instance.on(el, 'click', function (e, ui) {
                if (el.className.indexOf("jsPlumb_dragged") > -1) {
                    jsPlumb.removeClass(elId, "jsPlumb_dragged");
                    return;
                }
                var o = instance.getOffset(el, true),
                    o2 = instance.getOffset(el),
                    s = jsPlumb.getSize(el),
                    pxy = [e.pageX || e.clientX, e.pageY || e.clientY],
                    c = [pxy[0] - (o.left + (s[0] / 2)), pxy[1] - (o.top + (s[1] / 2))],
                    oo = [c[0] / s[0], c[1] / s[1]],
                    DIST = 350,
                    l = o2.left + (oo[0] * DIST),
                    t = o2.top + (oo[1] * DIST);

                var id = el.getAttribute("id");
                instance.animate(el, {left: l, top: t}, { duration: 350, easing: 'easeOutBack' });
            });

            return instance.addEndpoint(elId, {
                anchor: [0.5, 0.5, 0, -1],
                connectorStyle: { strokeWidth: 7, stroke: "rgba(198,89,30,0.7)" },
                endpointsOnTop: true,
                isSource: true,
                maxConnections: 10,
                isTarget: true,
                dropOptions: { tolerance: "touch", hoverClass: "dropHover" }
            });
        };

    // get a jsPlumb instance, setting some appropriate defaults and a Container.
    instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'wait', zIndex: 20 },
        Endpoint: [ "Image", { url: "/assets/jsplumb/littledot.png" } ],
        Connector: [ "Bezier", { curviness: 90 } ],
        Container: "jsplumb_animation"
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        var e1 = prepare("bd1"),
            e2 = prepare("bd2"),
            e3 = prepare("bd3"),
            e4 = prepare("bd4"),
            clearBtn = jsPlumb.getSelector("#anim-clear"),
            addBtn = jsPlumb.getSelector("#add");

        instance.on(clearBtn, "click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            instance.detachEveryConnection();
        });

        instance.connect({ source: e1, target: e2 });
        instance.connect({ source: e1, target: e3 });
        instance.connect({ source: e1, target: e4 });

        instance.on(addBtn, 'click', function (evt) {
            var d = document.createElement("div");
            d.className = "bigdot";
            document.getElementById("jsplumb_animation").appendChild(d);
            var id = '' + ((new Date().getTime()));
            d.setAttribute("id", id);
            var w = screen.width - 162, h = screen.height - 162;
            var x = (0.2 * w) + Math.floor(Math.random() * (0.5 * w));
            var y = (0.2 * h) + Math.floor(Math.random() * (0.6 * h));
            d.style.top = y + 'px';
            d.style.left = x + 'px';
            var info = {d: d, id: id};

            var e = prepare(info.id);
            instance.draggable(info.id);
            discs.push(info.id);
            evt.stopPropagation();
            evt.preventDefault();
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
}