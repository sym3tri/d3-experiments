var svg = d3.select('#stage'),
    RADIUS = 16,
    TOTAL = 100,
    HEIGHT = 600,
    WIDTH = 800;

function enterEndTransition() {
  d3.select(this)
    .transition()
      .duration(200)
      .ease('fadeout')
      .attr('r', RADIUS);
}

function transformFunction(d, i) {
  var x = Math.max(RADIUS, i * RADIUS),
      y = Math.max(d, RADIUS * 2);
  return 'translate(' + [x, y] + ')';
}

function doStuff() {
  var data = d3.range(100).map(d3.random.normal(100, 60)),
      exitGroups,
      allGroups,
      newGroups,
      label;

  allGroups = svg.selectAll('g')
    .data(data, function (d, i) { return i; });

  exitGroups = allGroups.exit();

  newGroups = allGroups.enter()
    .append('g')
    .attr('transform', transformFunction);

  // TODO: scale group instead of animating radius to get text to scale too
  newGroups.append('circle')
    .attr({
      r: 0,
      cx: 0,
      cy: 0
    })
    .transition()
      .duration(function (d, i) {
        return HEIGHT - d.value;
      })
      .delay(function (d, i) {
         return i/TOTAL * 400;
      })
      .ease('in')
      .attr('r', RADIUS * 1.5)
      .each('end', enterEndTransition);

  newGroups.append('text')
    .text(function (d) { return Math.ceil(d); })
    .attr({
      stroke: 'none',
      fill: '#fff',
      x: 0,
      y: 0,
      'alignment-baseline': 'middle',
      'text-anchor': 'middle'
    });

  allGroups
    .transition()
      .duration(1500)
      .ease('elastic')
      .attr('transform', transformFunction);

  exitGroups.remove();
}

doStuff();
