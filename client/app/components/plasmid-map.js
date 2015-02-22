import Ember from 'ember';

var PlasmidGraph = d3.reusable(function(me, data) {
  var outerArc = d3.svg.arc();
  var outlineArc = d3.svg.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2);
  var cdsArcs = {};

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
    cdsArcs[d.dnafeatureId] = d3.svg.arc();
    dataLevels[d.dnafeatureId] = 0;

    var previous = data[i - 1];
    if (!previous) {
      continue;
    }

    if (dataLevels[d.dnafeatureId] === dataLevels[previous.dnafeatureId] && d.start < previous.end) {
      dataLevels[d.dnafeatureId]++;
    }
  }

  function arcTween(d) {
    var start = x(d.start);
    var i = d3.interpolate(start, x(d.end));
    var arc = cdsArcs[d.dnafeatureId];
    return function(t) {
      return arc
        .startAngle(start)
        .endAngle(i(t))();
    };
  }

  var outline = g.append('path')
    .style('fill', 'black');

  var cds = g.selectAll('.cds')
    .data(data);
  var cdsEnter = cds.enter()
    .append('path')
    .attr('class', function(d) {
      return 'cds ' + (d.strand > 0 ? 'forward' : 'backward');
    });

  var text = g.selectAll('text')
    .data(data);

  text.enter()
    .append('text')
    .attr('dy', '.35em')
    .text(function(d) {
      return d.dnafeature.name;
    });

  text.exit()
    .remove();

  var polyline = g.selectAll('polyline')
    .data(data);

  polyline.enter()
    .append('polyline');

  polyline.exit()
    .remove();

  function getTranslateY(transform) {
    return +transform.substring(transform.indexOf(',') + 1, transform.indexOf(')'));
  }

  var duration = 1000;

  var alpha = 0.5;
  var spacing = 12;

  function relax() {
      var again = false;
      text.each(function (d, i) {
          var a = this;
          var da = d3.select(a);
          var transformA = da.attr('transform');
          var y1 = getTranslateY(transformA);
          text.each(function (d, j) {
              var b = this;
              // a & b are the same element and don't collide.
              if (a == b) return;
              var db = d3.select(b);
              // a & b are on opposite sides of the chart and
              // don't collide
              if (da.attr('text-anchor') != db.attr('text-anchor')) return;
              // Now let's calculate the distance between
              // these elements. 
              var transformB = db.attr('transform');
              var y2 = getTranslateY(transformB);
              var deltaY = y1 - y2;

              // Our spacing is greater than our specified spacing,
              // so they don't collide.
              if (Math.abs(deltaY) > spacing) return;

              if (deltaY >= 0) return;

              // If the labels collide, we'll push each 
              // of the two labels up and down a little bit.
              again = true;
              var sign = y1 > 0 ? 1 : -1;
              var adjust = sign * alpha;
              da.attr('transform', transformA.substring(0, transformA.indexOf(',') + 1) + (y1 - alpha) + ')');
              //db.attr('transform', transformB.substring(0, transformB.indexOf(',') + 1) + (y2 - adjust) + ')');
          });
      });
      // Adjust our line leaders here
      // so that they follow the labels. 
      if(again) {
          var labelElements = text[0];
          // textLines.attr('y2',function(d,i) {
          //     labelForLine = d3.select(labelElements[i]);
          //     return labelForLine.attr('y');
          // });
          //setTimeout(relax,0);
          relax();
      }
  }

  return function() {
    var width = me.width(),
      height = me.height(),
      radius = Math.min(width, height) / 4;

    var isRelaxed = false;

    outerArc
      .outerRadius(radius)
      .innerRadius(radius);

    var outerRadius = radius * 0.95,
      innerRadius = outerRadius - 1;

    outlineArc
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    outline.attr('d', outlineArc);

    for (var i in cdsArcs) {
      var level = dataLevels[i];
      var size = height / 16;
      var oRadius = innerRadius - size * level;
      var iRadius = outerRadius - size * (level + 1);
      cdsArcs[i]
        .outerRadius(oRadius)
        .innerRadius(iRadius);
    }

    g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    cdsEnter.data(data);

    svg
      .attr('width', width)
      .attr('height', height);

    cdsEnter.transition().duration(duration).attrTween('d', arcTween);

    text.transition().duration(duration)
      .attrTween('transform', function(d) {
        var start = x(d.start);
        var i = d3.interpolate(start, x(d.end));
        return function(t) {
          var end = i(t);
          var pos = outerArc
            .startAngle(start)
            .endAngle(end)
            .centroid();
          pos[0] = outerArc.outerRadius()() * ((start + end) / 2 < Math.PI ? 1 : -1);
          return 'translate('+ pos +')';
        };
      })
      .attrTween('text-anchor', function(d) {
        var start = x(d.start);
        var i = d3.interpolate(start, x(d.end));
        return function(t) {
          var end = i(t);
          return (start + end) / 2 < Math.PI ? 'start' : 'end';
        };
      });

    polyline.transition().duration(duration)
      .attrTween('points', function(d, i) {
        var start = x(d.start);
        var i = d3.interpolate(start, x(d.end));
        var arc = cdsArcs[d.dnafeatureId];
        var lastT = 0;
        return function(t) {
          if (t !== lastT) {
            relax();
            lastT = t;
          }
          var end = i(t);
          var pos = outerArc
            .startAngle(start)
            .endAngle(end)
            .centroid();
          pos[0] = outerArc.outerRadius()() * 0.95 * ((start + end) / 2 < Math.PI ? 1 : -1);
          return [arc.centroid(), outerArc.centroid(), pos];
        };
      })
      .each('end', function() {
        if (!isRelaxed) {
          //setTimeout(relax, 0);
          relax();
          isRelaxed = true;
        }
      });

    duration = 0;
  };
});

export default Ember.Component.extend({
  classNames: ['plasmid-map'],
  didInsertElement: function() {
    var graph = new PlasmidGraph();

    var $this = $('#' + this.elementId);

    function updateSize() {
      var size = $this.parent().width() - 20;
      graph.options({
        width: size,
        height: size
      });
      $this.width(size);
      $this.height(size);
    }
    updateSize();
    $(window).resize(updateSize);

    d3.select($this[0])
      .datum(this.model.dnafeatures)
      .call(graph);
  }
});
