export default d3.reusable(function(me, data) {
  var twoPi = Math.PI * 2;

  // outside arc used for line bends and labels
  var outerArc = d3.svg.arc();

  // the arc for the solid line container
  var outlineArc = d3.svg.arc();

  // every feature gets its own arc with start and end
  var featureArcs = {};

  // number of length labels
  var numOfTicks = 16;

  // x scale converts the start and end to rads
  var x = d3.scale.linear()
    .domain([0, Math.max.apply(null, data.map(function(d) { return d.end; }))])
    .range([0, twoPi]);

  // creating tick objects to data bind against
  var ticks = [];
  for (var i = 1; i <= numOfTicks; i++) {
    ticks.push(Math.round(x.invert(twoPi / numOfTicks * i)));
  }

  // set up container svg. create a new svg object
  // so other instances don't collide
  var svg = d3.select(this)
    .append('svg');
  var g = svg.append('g');

  // sort data to be sequential and match the list
  data.sort(function(a, b) {
    return a.start - b.start;
  });

  // this is where inner arcs are created
  // featureLevels is a lookup that keeps track of overlapping
  var featureLevels = {};
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    featureArcs[d.dnafeatureId] = d3.svg.arc();
    featureLevels[d.dnafeatureId] = 0;

    var previous = data[i - 1];
    if (!previous) {
      continue;
    }

    // if at the same level and overlapping, decend into the next level
    if (featureLevels[d.dnafeatureId] === featureLevels[previous.dnafeatureId] && d.start < previous.end) {
      featureLevels[d.dnafeatureId]++;
    }
  }

  // this is the animation function for features
  function arcTween(d) {
    var start = x(d.start);
    var i = d3.interpolate(start, x(d.end));
    var arc = featureArcs[d.dnafeatureId];
    return function(t) {
      return arc
        .startAngle(start)
        .endAngle(i(t))();
    };
  }

  // create the outline
  var outline = g.append('path')
    .style('fill', 'black');

  // create the feature paths
  var features = g.selectAll('.features')
    .data(data);
  var featuresEnter = features.enter()
    .append('path')
    .attr('name', function(d) {
      return d.dnafeature.id;
    })
    .attr('class', function(d) {
      return 'features ' + (d.strand > 0 ? 'forward' : 'backward');
    })
    .on('click', function(d) {
      // call the sendClick action
      me.options('sendClick')(d.dnafeature.id);
    });

  // create the length tick axis lines and labels
  var axisLine = g.selectAll('axis-line')
    .data(ticks);
  var axisText = g.selectAll('axis-text')
    .data(ticks);

  axisLine.enter()
    .append('polyline')
    .attr('class', 'axis-line');
  axisText.enter()
    .append('text')
    .attr('class', 'axis-text')
    .text(function(d) { return d; });

  // create the feature labels and lines
  var labelLine = g.selectAll('.label-line')
    .data(data);
  var labelText = g.selectAll('.label-text')
    .data(data);

  labelLine.enter()
    .append('polyline')
    .attr('class', 'label-line');
  labelText.enter()
    .append('text')
    .attr('class', 'label-text')
    .attr('dy', '.35em')
    .text(function(d) {
      return d.dnafeature.name;
    });

  function getTranslateY(transform) {
    return +transform.substring(transform.indexOf(',') + 1, transform.indexOf(')'));
  }

  // animation duration
  var duration = 1000;

  // move this much in pixels each iteration
  var alpha = 0.5;

  // collision box in pixels
  var spacing = 12;

  function relax() {
    var isRelaxed = true;
    labelText.each(function(d, i) {
      if (!isRelaxed) {
        return;
      }

      var a = this;
      var da = d3.select(a);
      var transformA = da.attr('transform');

      // first round this is empty
      if (!transformA) {
        return;
      }

      var y1 = getTranslateY(transformA);
      labelText.each(function() {
        if (!isRelaxed) {
          return;
        }

        var b = this;
        // a & b are the same element and don't collide.
        if (a === b) {
          return;
        }

        var db = d3.select(b);
        // a & b are on opposite sides of the chart and
        // don't collide
        if (da.attr('text-anchor') != db.attr('text-anchor')) {
          return;
        }

        // Now let's calculate the distance between
        // these elements. 
        var transformB = db.attr('transform');
        if (!transformB) {
          return;
        }

        var y2 = getTranslateY(transformB);
        var deltaY = y1 - y2;

        // Our spacing is greater than our specified spacing,
        // so they don't collide.
        if (Math.abs(deltaY) > spacing) {
          return;
        }

        if (y1 < 0 && deltaY > 0 || y1 > 0 && deltaY < 0) {
          return;
        }

        // If the labels collide, we'll push each 
        // of the two labels up and down a little bit.
        isRelaxed = false;
        var sign = y1 > 0 ? 1 : -1;
        var adjust = sign * alpha;
        da.attr('transform', transformA.substring(0, transformA.indexOf(',') + 1) + (y1 + adjust) + ')');
        // console.log(d.dnafeature.name + ',' + transformA.substring(0, transformA.indexOf(',') + 1) + (y1 + adjust) + ')');
        //db.attr('transform', transformB.substring(0, transformB.indexOf(',') + 1) + (y2 - adjust) + ')');

        var poly = d3.select(labelLine[0][i]);
        var points = poly.attr('points').split(',');
        points[3] = points[5] = y1;
        poly.attr('points', points.join(','));
      });
    });
    // Adjust our line leaders here
    // so that they follow the labels. 
    if (!isRelaxed) {
      var labelElements = labelText[0];
      relax();
    }
  }

  return function() {
    var width = me.width(),
      height = me.height(),
      radius = (height / 2) * 0.8;

    outerArc
      .outerRadius(radius)
      .innerRadius(radius);

    var outerRadius = radius * 0.95,
      innerRadius = outerRadius - 1;

    outlineArc
      .startAngle(0)
      .endAngle(twoPi)
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    outline.attr('d', outlineArc);

    for (var i in featureArcs) {
      var level = featureLevels[i];
      var size = height / 8;
      var oRadius = innerRadius - size * level;
      var iRadius = outerRadius - size * (level + 1);
      featureArcs[i]
        .outerRadius(oRadius)
        .innerRadius(iRadius);
    }

    g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    featuresEnter.data(data);

    svg
      .attr('width', width)
      .attr('height', height);

    axisLine.attr('points', function(d, i) {
      var rads = twoPi / numOfTicks * (i + 1);
      var outlinePos = outlineArc
        .startAngle(rads)
        .endAngle(rads)
        .centroid();
      var outerPos = outerArc
        .startAngle(rads)
        .endAngle(rads)
        .centroid();

      var angle = rads * 180 / Math.PI;
      var reverse = angle > 90 && angle < 270;
      d3.select(axisText[0][i])
        .attr('transform', 'translate(' + outerPos + ') rotate(' + (angle + (reverse ? 180 : 0)) + ')');

      var midPos = [(outlinePos[0] + outerPos[0]) / 2, (outlinePos[1] + outerPos[1]) / 2];

      return [outlinePos, midPos];
    });

    featuresEnter.transition().duration(duration).attrTween('d', arcTween);

    var lastT = 0;
    labelText.transition().duration(duration)
      .attrTween('transform', function(d, i) {
        var start = x(d.start);
        var interpolate = d3.interpolate(start, x(d.end));
        var arc = featureArcs[d.dnafeatureId];
        var poly = d3.select(labelLine[0][i]);
        var el = d3.select(this);
        return function(t) {
          var end = interpolate(t);
          var pos = outerArc
            .startAngle(start)
            .endAngle(end)
            .centroid();

          pos[0] = outerArc.outerRadius()() * 1.1 * ((start + end) / 2 < Math.PI ? 1 : -1);
          poly.attr('points', [arc.centroid(), outerArc.centroid(), pos]);

          pos[0] *= 1.05;
          var translate = 'translate('+ pos +')';

          el.attr('transform', translate);
          //if (i === data.length - 1) {
            relax();
          //}

          return el.attr('transform');
        };
      })
      .attrTween('text-anchor', function(d) {
        var start = x(d.start);
        var interpolate = d3.interpolate(start, x(d.end));
        return function(t) {
          var end = interpolate(t);
          return (start + end) / 2 < Math.PI ? 'start' : 'end';
        };
      })
      .each('end', function(d, i) {
        if (i === data.length - 1) {
          //setTimeout(relax, 0);
          // console.log('end');
          relax();
        }
      });

    duration = 0;
  };
});
