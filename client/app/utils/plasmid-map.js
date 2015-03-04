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
  for (var j = 0; j < data.length; j++) {
    var d = data[j];
    featureArcs[d.dnafeatureId] = d3.svg.arc();
    featureLevels[d.dnafeatureId] = 0;

    var previous = data[j - 1];
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
  var axisLines = g.selectAll('axis-line')
    .data(ticks);
  var axisTexts = g.selectAll('axis-text')
    .data(ticks);

  axisLines.enter()
    .append('polyline')
    .attr('class', 'axis-line');
  axisTexts.enter()
    .append('text')
    .attr('class', 'axis-text')
    .text(function(d) { return d; });

  // create the feature labels and lines
  var labelLines = g.selectAll('.label-line')
    .data(data);
  var labelTexts = g.selectAll('.label-text')
    .data(data);

  labelLines.enter()
    .append('polyline')
    .attr('class', 'label-line');
  labelTexts.enter()
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
    labelTexts.each(function(d, i) {
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
      labelTexts.each(function() {
        if (!isRelaxed) {
          return;
        }

        var b = this;

        // same label
        if (a === b) {
          return;
        }

        var db = d3.select(b);

        // ignore opposite sides of the graph
        if (da.attr('text-anchor') !== db.attr('text-anchor')) {
          return;
        }

        var transformB = db.attr('transform');

        // first round this is empty
        if (!transformB) {
          return;
        }

        var y2 = getTranslateY(transformB);
        var deltaY = y1 - y2;

        // far enough apart
        if (Math.abs(deltaY) > spacing) {
          return;
        }

        // this prevents two labels from continually crossing each other's path
        // it happens when deltaY is less than spacing
        if (y1 < 0 && deltaY > 0 || y1 > 0 && deltaY < 0) {
          return;
        }

        // we have a collision
        isRelaxed = false;

        // up or down
        var sign = y1 > 0 ? 1 : -1;

        // pixel change
        var adjust = sign * alpha;

        // new transform
        transformA = transformA.substring(0, transformA.indexOf(',') + 1) + (y1 + adjust) + ')';
        da.attr('transform', transformA);

        // move the label lie up as well
        var labelLine = d3.select(labelLines[0][i]);
        var points = labelLine.attr('points').split(',');
        points[3] = points[5] = y1;
        labelLine.attr('points', points.join(','));
      });
    });

    // recurse
    if (!isRelaxed) {
      relax();
    }
  }

  // this function runs everytime an option changes
  return function() {
    var width = me.width(),
      height = me.height();

    svg
      .attr('width', width)
      .attr('height', height);

    // translating the center to the new center
    g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var roomForLabels = 0.8,
      radius = (height / 2) * roomForLabels;

    outerArc
      .outerRadius(radius)
      .innerRadius(radius);

    var outlineAdjustment = 0.95,
      outlineWidth = 1,
      outerRadius = radius * outlineAdjustment,
      innerRadius = outerRadius - outlineWidth;

    outlineArc
      .startAngle(0)
      .endAngle(twoPi)
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    // draws the outline
    outline.attr('d', outlineArc);

    var numOfLevelsPossible = 8;

    // each feature has its own arc because
    // it could be on any level
    for (var i in featureArcs) {
      var level = featureLevels[i];
      var LevelSize = height / numOfLevelsPossible;
      var oRadius = innerRadius - LevelSize * level;
      var iRadius = outerRadius - LevelSize * (level + 1);
      featureArcs[i]
        .outerRadius(oRadius)
        .innerRadius(iRadius);
    }

    // data bind features
    featuresEnter.data(data);

    // draw the axis
    axisLines.attr('points', function(d, i) {
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

      // reverse the text on the bottom half
      var isReversed = angle > 90 && angle < 270;

      d3.select(axisTexts[0][i])
        .attr('transform', 'translate(' + outerPos + ') rotate(' + (angle + (isReversed ? 180 : 0)) + ')')
        .classed('reverse', isReversed);

      var midPos = [(outlinePos[0] + outerPos[0]) / 2, (outlinePos[1] + outerPos[1]) / 2];

      return [outlinePos, midPos];
    });

    // animated the features paths
    featuresEnter.transition().duration(duration).attrTween('d', arcTween);

    // draw the labels and animate to follow the paths
    labelTexts.transition().duration(duration)
      .attrTween('transform', function(d, i) {
        var start = x(d.start);
        var interpolate = d3.interpolate(start, x(d.end));
        var arc = featureArcs[d.dnafeatureId];
        var labelLine = d3.select(labelLines[0][i]);
        var el = d3.select(this);
        return function(t) {
          var end = interpolate(t);
          var pos = outerArc
            .startAngle(start)
            .endAngle(end)
            .centroid();

          // make the corner a little past the axis
          var outerRadius = outerArc.outerRadius()() * 1.1;

          // send the line to the edge of the graph
          var sign = (start + end) / 2 < Math.PI ? 1 : -1;
          pos[0] = outerRadius * sign;

          labelLine.attr('points', [arc.centroid(), outerArc.centroid(), pos]);

          // anchor the text a little further out
          pos[0] *= 1.05;
          var translate = 'translate('+ pos +')';

          // need to set the transform before relaxing
          el.attr('transform', translate);

          // start the relaxing function to prevent overlap
          relax();

          // return the new transform after relaxing
          return el.attr('transform');
        };
      })
      .attrTween('text-anchor', function(d) {
        var start = x(d.start);
        var interpolate = d3.interpolate(start, x(d.end));
        return function(t) {
          var end = interpolate(t);

          // text anchor can change as it crosses 180 degrees
          return (start + end) / 2 < Math.PI ? 'start' : 'end';
        };
      });

    // don't animate on subsequent options changes, like browser resizing
    duration = 0;
  };
});
