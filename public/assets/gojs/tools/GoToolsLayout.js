GoTools.prototype.changeLayout = function(type){
  var $$ = go.GraphObject.make;
  $("#tab_layout_link").tab("show");
  switch(type){
    case "grid":
      this.layout = $$(go.GridLayout);
      $("#tab_layout_grid_link").tab("show");
      break;
    case "tree":
      this.layout = $$(go.TreeLayout);
      $("#tab_layout_tree_link").tab("show");
      break;
    case "circular":
      this.layout = $$(go.CircularLayout);
      $("#tab_layout_circular_link").tab("show");
      break;
    case "layeredDigraph":
      this.layout = $$(go.LayeredDigraphLayout);
      $("#tab_layout_layeredDigraph_link").tab("show");
      break;
    case "forceDirected":
      this.layout = $$(go.ForceDirectedLayout);
      $("#tab_layout_forceDirected_link").tab("show");
      break;
    case "default":
      this.layout = $$(go.Layout);
      break;
  }
}

function getRadioValue(name) {
  var radio = document.getElementsByName(name);
  for (var i = 0; i < radio.length; i++) {
    if (radio[i].checked) return radio[i].value;
  }
}

GoTools.prototype.triggerGridLayout = function(){

  this.startTransaction("change grid Layout");
  var lay = this.layout;

  var wrappingColumn = document.getElementById("layout_grid_wrappingColumn").value;
  lay.wrappingColumn = parseFloat(wrappingColumn, 10);

  var wrappingWidth = document.getElementById("layout_grid_wrappingWidth").value;
  lay.wrappingWidth = parseFloat(wrappingWidth, 10);

  var cellSize = document.getElementById("layout_grid_cellSize").value;
  lay.cellSize = go.Size.parse(cellSize);

  var spacing = document.getElementById("layout_grid_spacing").value;
  lay.spacing = go.Size.parse(spacing);

  var alignment = getRadioValue("layout_grid_alignment");
  if (alignment === "Position") {
    lay.alignment = go.GridLayout.Position;
  } else {
    lay.alignment = go.GridLayout.Location;
  }

  var arrangement = getRadioValue("layout_grid_arrangement");
  if (arrangement === "LeftToRight") {
    lay.arrangement = go.GridLayout.LeftToRight;
  } else {
    lay.arrangement = go.GridLayout.RightToLeft;
  }

  var sorting = document.getElementById("layout_grid_sorting").value;
  switch (sorting) {
    default:
    case "Forward": lay.sorting = go.GridLayout.Forward; break;
    case "Reverse": lay.sorting = go.GridLayout.Reverse; break;
    case "Ascending": lay.sorting = go.GridLayout.Ascending; break;
    case "Descending": lay.sorting = go.GridLayout.Descending; break;
  }

  this.commitTransaction("change grid Layout");
}

GoTools.prototype.triggerTreeLayout = function(){
  this.startTransaction("change tree Layout");
  var lay = this.layout;

  var style = document.getElementById("layout_tree_style").value;
  if (style === "Layered") lay.treeStyle = go.TreeLayout.StyleLayered;
  else if (style === "Alternating") lay.treeStyle = go.TreeLayout.StyleAlternating;
  else if (style === "LastParents") lay.treeStyle = go.TreeLayout.StyleLastParents;
  else if (style === "RootOnly") lay.treeStyle = go.TreeLayout.StyleRootOnly;

  var layerStyle = document.getElementById("layout_tree_layerStyle").value;
  if (layerStyle === "Individual") lay.layerStyle = go.TreeLayout.LayerIndividual;
  else if (layerStyle === "Siblings") lay.layerStyle = go.TreeLayout.LayerSiblings;
  else if (layerStyle === "Uniform") lay.layerStyle = go.TreeLayout.LayerUniform;

  var angle = getRadioValue("layout_tree_angle");
  angle = parseFloat(angle, 10);
  lay.angle = angle;

  var align = document.getElementById("layout_tree_align").value;
  if (align === "CenterChildren") lay.alignment = go.TreeLayout.AlignmentCenterChildren;
  else if (align === "CenterSubtrees") lay.alignment = go.TreeLayout.AlignmentCenterSubtrees;
  else if (align === "Start") lay.alignment = go.TreeLayout.AlignmentStart;
  else if (align === "End") lay.alignment = go.TreeLayout.AlignmentEnd;
  else if (align === "Bus") lay.alignment = go.TreeLayout.AlignmentBus;
  else if (align === "BusBranching") lay.alignment = go.TreeLayout.AlignmentBusBranching;
  else if (align === "TopLeftBus") lay.alignment = go.TreeLayout.AlignmentTopLeftBus;
  else if (align === "BottomRightBus") lay.alignment = go.TreeLayout.AlignmentBottomRightBus;

  var nodeSpacing = document.getElementById("layout_tree_nodeSpacing").value;
  nodeSpacing = parseFloat(nodeSpacing, 10);
  lay.nodeSpacing = nodeSpacing;

  var nodeIndent = document.getElementById("layout_tree_nodeIndent").value;
  nodeIndent = parseFloat(nodeIndent, 10);
  lay.nodeIndent = nodeIndent;

  var nodeIndentPastParent = document.getElementById("layout_tree_nodeIndentPastParent").value;
  nodeIndentPastParent = parseFloat(nodeIndentPastParent, 10);
  lay.nodeIndentPastParent = nodeIndentPastParent;

  var layerSpacing = document.getElementById("layout_tree_layerSpacing").value;
  layerSpacing = parseFloat(layerSpacing, 10);
  lay.layerSpacing = layerSpacing;

  var layerSpacingParentOverlap = document.getElementById("layout_tree_layerSpacingParentOverlap").value;
  layerSpacingParentOverlap = parseFloat(layerSpacingParentOverlap, 10);
  lay.layerSpacingParentOverlap = layerSpacingParentOverlap;

  var sorting = document.getElementById("layout_tree_sorting").value;
  if (sorting === "Forwards") lay.sorting = go.TreeLayout.SortingForwards;
  else if (sorting === "Reverse") lay.sorting = go.TreeLayout.SortingReverse;
  else if (sorting === "Ascending") lay.sorting = go.TreeLayout.SortingAscending;
  else if (sorting === "Descending") lay.sorting = go.TreeLayout.SortingDescending;

  var compaction = getRadioValue("layout_tree_compaction");
  if (compaction === "Block") lay.compaction = go.TreeLayout.CompactionBlock;
  else if (compaction === "None") lay.compaction = go.TreeLayout.CompactionNone;

  var breadthLimit = document.getElementById("layout_tree_breadthLimit").value;
  breadthLimit = parseFloat(breadthLimit, 10);
  lay.breadthLimit = breadthLimit;

  var rowSpacing = document.getElementById("layout_tree_rowSpacing").value;
  rowSpacing = parseFloat(rowSpacing, 10);
  lay.rowSpacing = rowSpacing;

  var rowIndent = document.getElementById("layout_tree_rowIndent").value;
  rowIndent = parseFloat(rowIndent, 10);
  lay.rowIndent = rowIndent;

  var setsPortSpot = document.getElementById("layout_tree_setsPortSpot").checked;
  lay.setsPortSpot = setsPortSpot;

  var setsChildPortSpot = document.getElementById("layout_tree_setsChildPortSpot").checked;
  lay.setsChildPortSpot = setsChildPortSpot;

  if (style !== "Layered") {
    var altAngle = getRadioValue("layout_tree_altAngle");
    altAngle = parseFloat(altAngle, 10);
    lay.alternateAngle = altAngle;

    var altAlign = document.getElementById("layout_tree_altAlign").value;
    if (altAlign === "CenterChildren") lay.alternateAlignment = go.TreeLayout.AlignmentCenterChildren;
    else if (altAlign === "CenterSubtrees") lay.alternateAlignment = go.TreeLayout.AlignmentCenterSubtrees;
    else if (altAlign === "Start") lay.alternateAlignment = go.TreeLayout.AlignmentStart;
    else if (altAlign === "End") lay.alternateAlignment = go.TreeLayout.AlignmentEnd;
    else if (altAlign === "Bus") lay.alternateAlignment = go.TreeLayout.AlignmentBus;
    else if (altAlign === "BusBranching") lay.alternateAlignment = go.TreeLayout.AlignmentBusBranching;
    else if (altAlign === "TopLeftBus") lay.alternateAlignment = go.TreeLayout.AlignmentTopLeftBus;
    else if (altAlign === "BottomRightBus") lay.alternateAlignment = go.TreeLayout.AlignmentBottomRightBus;

    var altNodeSpacing = document.getElementById("layout_tree_altNodeSpacing").value;
    altNodeSpacing = parseFloat(altNodeSpacing, 10);
    lay.alternateNodeSpacing = altNodeSpacing;

    var altNodeIndent = document.getElementById("layout_tree_altNodeIndent").value;
    altNodeIndent = parseFloat(altNodeIndent, 10);
    lay.alternateNodeIndent = altNodeIndent;

    var altNodeIndentPastParent = document.getElementById("layout_tree_altNodeIndentPastParent").value;
    altNodeIndentPastParent = parseFloat(altNodeIndentPastParent, 10);
    lay.alternateNodeIndentPastParent = altNodeIndentPastParent;

    var altLayerSpacing = document.getElementById("layout_tree_altLayerSpacing").value;
    altLayerSpacing = parseFloat(altLayerSpacing, 10);
    lay.alternateLayerSpacing = altLayerSpacing;

    var altLayerSpacingParentOverlap = document.getElementById("layout_tree_altLayerSpacingParentOverlap").value;
    altLayerSpacingParentOverlap = parseFloat(altLayerSpacingParentOverlap, 10);
    lay.alternateLayerSpacingParentOverlap = altLayerSpacingParentOverlap;

    var altSorting = document.getElementById("layout_tree_altSorting").value;
    if (altSorting === "Forwards") lay.alternateSorting = go.TreeLayout.SortingForwards;
    else if (altSorting === "Reverse") lay.alternateSorting = go.TreeLayout.SortingReverse;
    else if (altSorting === "Ascending") lay.alternateSorting = go.TreeLayout.SortingAscending;
    else if (altSorting === "Descending") lay.alternateSorting = go.TreeLayout.SortingDescending;

    var altCompaction = getRadioValue("layout_tree_altCompaction");
    if (altCompaction === "Block") lay.alternateCompaction = go.TreeLayout.CompactionBlock;
    else if (altCompaction === "None") lay.alternateCompaction = go.TreeLayout.CompactionNone;

    var altBreadthLimit = document.getElementById("layout_tree_altBreadthLimit").value;
    altBreadthLimit = parseFloat(altBreadthLimit, 10);
    lay.alternateBreadthLimit = altBreadthLimit;

    var altRowSpacing = document.getElementById("layout_tree_altRowSpacing").value;
    altRowSpacing = parseFloat(altRowSpacing, 10);
    lay.alternateRowSpacing = altRowSpacing;

    var altRowIndent = document.getElementById("layout_tree_altRowIndent").value;
    altRowIndent = parseFloat(altRowIndent, 10);
    lay.alternateRowIndent = altRowIndent;

    var altSetsPortSpot = document.getElementById("layout_tree_altSetsPortSpot").checked;
    lay.alternateSetsPortSpot = altSetsPortSpot;

    var altSetsChildPortSpot = document.getElementById("layout_tree_altSetsChildPortSpot").checked;
    lay.alternateSetsChildPortSpot = altSetsChildPortSpot;
  }

  this.commitTransaction("change tree Layout");
}

GoTools.prototype.triggerCircularLayout = function(){
  this.startTransaction("change circular Layout");
  var lay = this.layout;

  var radius = document.getElementById("layout_circular_radius").value;
  if (radius !== "NaN") radius = parseFloat(radius, 10);
  else radius = NaN;
  lay.radius = radius;

  var aspectRatio = document.getElementById("layout_circular_aspectRatio").value;
  aspectRatio = parseFloat(aspectRatio, 10);
  lay.aspectRatio = aspectRatio;

  var startAngle = document.getElementById("layout_circular_startAngle").value;
  startAngle = parseFloat(startAngle, 10);
  lay.startAngle = startAngle;

  var sweepAngle = document.getElementById("layout_circular_sweepAngle").value;
  sweepAngle = parseFloat(sweepAngle, 10);
  lay.sweepAngle = sweepAngle;

  var spacing = document.getElementById("layout_circular_spacing").value;
  spacing = parseFloat(spacing, 10);
  lay.spacing = spacing;

  var arrangement = document.getElementById("layout_circular_arrangement").value;
  if (arrangement === "ConstantDistance") lay.arrangement = go.CircularLayout.ConstantDistance;
  else if (arrangement === "ConstantAngle") lay.arrangement = go.CircularLayout.ConstantAngle;
  else if (arrangement === "ConstantSpacing") lay.arrangement = go.CircularLayout.ConstantSpacing;
  else if (arrangement === "Packed") lay.arrangement = go.CircularLayout.Packed;

  var diamFormula = getRadioValue("layout_circular_diamFormula");
  if (diamFormula === "Pythagorean") lay.nodeDiameterFormula = go.CircularLayout.Pythagorean;
  else if (diamFormula === "Circular") lay.nodeDiameterFormula = go.CircularLayout.Circular;

  var direction = document.getElementById("layout_circular_direction").value;
  if (direction === "Clockwise") lay.direction = go.CircularLayout.Clockwise;
  else if (direction === "Counterclockwise") lay.direction = go.CircularLayout.Counterclockwise;
  else if (direction === "BidirectionalLeft") lay.direction = go.CircularLayout.BidirectionalLeft;
  else if (direction === "BidirectionalRight") lay.direction = go.CircularLayout.BidirectionalRight;

  var sorting = document.getElementById("layout_circular_sorting").value;
  if (sorting === "Forwards") lay.sorting = go.CircularLayout.Forwards;
  else if (sorting === "Reverse") lay.sorting = go.CircularLayout.Reverse;
  else if (sorting === "Ascending") lay.sorting = go.CircularLayout.Ascending;
  else if (sorting === "Descending") lay.sorting = go.CircularLayout.Descending;
  else if (sorting === "Optimized") lay.sorting = go.CircularLayout.Optimized;

  this.commitTransaction("change circular Layout");
}

GoTools.prototype.triggerLayeredDigraphLayout = function(){

  this.startTransaction("change layeredDigraph Layout");
  var lay = this.layout;

  var direction = getRadioValue("layout_layeredDigraph_direction");
  direction = parseFloat(direction, 10);
  lay.direction = direction;

  var layerSpacing = document.getElementById("layout_layeredDigraph_layerSpacing").value;
  layerSpacing = parseFloat(layerSpacing, 10);
  lay.layerSpacing = layerSpacing;

  var columnSpacing = document.getElementById("layout_layeredDigraph_columnSpacing").value;
  columnSpacing = parseFloat(columnSpacing, 10);
  lay.columnSpacing = columnSpacing;

  var cycleRemove = getRadioValue("layout_layeredDigraph_cycleRemove");
  if (cycleRemove === "CycleDepthFirst") lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleDepthFirst;
  else if (cycleRemove === "CycleGreedy") lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleGreedy;

  var layering = getRadioValue("layout_layeredDigraph_layering");
  if (layering === "LayerOptimalLinkLength") lay.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
  else if (layering === "LayerLongestPathSource") lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
  else if (layering === "LayerLongestPathSink") lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;

  var initialize = getRadioValue("layout_layeredDigraph_initialize");
  if (initialize === "InitDepthFirstOut") lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstOut;
  else if (initialize === "InitDepthFirstIn") lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
  else if (initialize === "InitNaive") lay.initializeOption = go.LayeredDigraphLayout.InitNaive;

  var aggressive = getRadioValue("layout_layeredDigraph_aggressive");
  if (aggressive === "AggressiveLess") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveLess;
  else if (aggressive === "AggressiveNone") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveNone;
  else if (aggressive === "AggressiveMore") lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;

  //TODO implement pack option
  var pack = document.getElementsByName("layout_layeredDigraph_pack");
  var packing = 0;
  for (var i = 0; i < pack.length; i++) {
    if (pack[i].checked) packing = packing | parseInt(pack[i].value, 10);
  }
  lay.packOption = packing;

  var setsPortSpots = document.getElementById("layout_layeredDigraph_setsPortSpots");
  lay.setsPortSpots = setsPortSpots.checked;

  this.commitTransaction("change layeredDigraph Layout");

}

GoTools.prototype.triggerForceDirectedLayout = function(){
  this.startTransaction("changed forceDirected Layout");
  var lay = this.layout;

  var maxIter = document.getElementById("layout_forceDirected_maxIter").value;
  maxIter = parseInt(maxIter, 10);
  lay.maxIterations = maxIter;

  var epsilon = document.getElementById("layout_forceDirected_epsilon").value;
  epsilon = parseFloat(epsilon, 10);
  lay.epsilon = epsilon;

  var infinity = document.getElementById("layout_forceDirected_infinity").value;
  infinity = parseFloat(infinity, 10);
  lay.infinity = infinity;

  var arrangement = document.getElementById("layout_forceDirected_arrangement").value;
  var arrangementSpacing = new go.Size();
  arrangement = arrangement.split(" ", 2);
  arrangementSpacing.width = parseFloat(arrangement[0], 10);
  arrangementSpacing.height = parseFloat(arrangement[1], 10);
  lay.arrangementSpacing = arrangementSpacing;

  var charge = document.getElementById("layout_forceDirected_charge").value;
  charge = parseFloat(charge, 10);
  lay.defaultElectricalCharge = charge;

  var mass = document.getElementById("layout_forceDirected_mass").value;
  mass = parseFloat(mass, 10);
  lay.defaultGravitationalMass = mass;

  var stiffness = document.getElementById("layout_forceDirected_stiffness").value;
  stiffness = parseFloat(stiffness, 10);
  lay.defaultSpringStiffness = stiffness;

  var length = document.getElementById("layout_forceDirected_length").value;
  length = parseFloat(length, 10);
  lay.defaultSpringLength = length;

  this.commitTransaction("changed forceDirected Layout");

}
