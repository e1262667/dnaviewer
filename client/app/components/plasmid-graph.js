import Ember from 'ember';

var duration = 1000;

var PlasmidGraph = d3.reusable(function(me, data) {
  var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2);
  var cdsArc = d3.svg.arc();
  var cdsArcs = [cdsArc];

  var x = d3.scale.linear()
    .domain([0, Math.max.apply(null, data.map(function(d) { return d.end; }))])
    .range([0, Math.PI * 2]);

  var svg = d3.select(this)
    .append('svg');
  var g = svg.append('g');

  data.sort(function(a, b) {
    return a.start - b.start;
  });
  var dataLevels = {};
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    dataLevels[d.dnafeatureId] = {
      d: d,
      level: 0
    };
  }
  for (var i = 0; i < data.length; i++) {
    var previous = data[i - 1];
    if (!previous) {
      continue;
    }
    var d = data[i];
    if (dataLevels[d.dnafeatureId].level === dataLevels[previous.dnafeatureId].level && d.start < previous.end) {
      var level = ++dataLevels[d.dnafeatureId].level;
      if (!cdsArcs[level]) {
        cdsArcs[level] = d3.svg.arc();
      }
    }
  }

  function arcTween(d) {
    var i = d3.interpolate(d.start, d.end);
    var level = dataLevels[d.dnafeatureId].level;
    var arc = cdsArcs[level];
    return function(t) {
      return arc
        .startAngle(x(d.start))
        .endAngle(x(i(t)))();
    };
  }

  var outline = g.append('path')
    .style('fill', 'black');

  var cds = g.selectAll('.cds')
    .data(data);
  var cdsEnter = cds.enter()
    .append('path')
    .attr('class', 'cds');

  return function() {
    var width = me.width(),
      height = me.height(),
      radius = Math.min(width, height) / 2,
      outerRadius = radius,
      innerRadius = outerRadius - 1;

    arc
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    outline.attr('d', arc);

  for (var i = 0; i < cdsArcs.length; i++) {
      outerRadius = innerRadius;
      innerRadius = outerRadius - height / 16;
      cdsArcs[i]
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
    }

    g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    cdsEnter.data(data);

    svg
      .attr('width', width)
      .attr('height', height);

    cdsEnter.transition().duration(duration).attrTween('d', arcTween);
  };
});

export default Ember.Component.extend({
  didInsertElement: function() {
    var graph = new PlasmidGraph();

    var $this = $('#' + this.elementId);

    function updateSize() {
      var width = $this.width();
      var height = width;
      graph.options({
        width: width,
        height: height
      });
    }
    updateSize();
    $(window).resize(updateSize);

    d3.select($this[0])
      .datum(this.model.dnafeatures)
      .call(graph);
  }
});
