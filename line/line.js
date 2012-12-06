var margin = {top: 20, right: 0, bottom: 30, left: 50},
    now = Date.now(),
    pollInterval = 300000,
    axisColor = 'rgba(0, 0, 0, 0.5)',
    colorScale = d3.scale.category10(),
    xPropertyName = 'timestamp',
    yPropertyName = 'average',
    idPropertyName = 'metric',
    containerEl = document.querySelector('#container'),
    containerComputedStyle = window.getComputedStyle(containerEl),
    isYAxisRelative = false,
    width,
    height,
    drawHeight,
    drawWidth,
    xScale,
    yScale,
    xAxis,
    yAxis,
    svg,
    graph,
    axisAttrs,
    line,
    lineAttrs,
    datasets;

function imagify () {
  var img = document.createElement('img'),
      svg = containerEl.children[0],
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  //document.body.appendChild(canvas);
  canvg(canvas, containerEl.innerHTML);
  img.src = canvas.toDataURL();
  //document.body.appendChild(img);
  window.location.href = img.src;
}

function init() {
  width = parseInt(containerComputedStyle.width, 10);
  height = parseInt(window.getComputedStyle(containerEl).height, 10);

  drawWidth = width - margin.left - margin.right;
  drawHeight = height - margin.top - margin.bottom;

  // setup the main drawing area
  svg = d3.select('#container')
      .append('svg')
      .attr({
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': width, // + margin.left + margin.right,
        'height': height, // + margin.top + margin.bottom,
        'font-family': 'Helvetica, sans-serif',
        'font-size': 11
      });

  // main group
  graph = svg.append('g')
      .attr({
        'class': 'graph line-graph',
        'transform': 'translate(' + margin.left + ',' + margin.top + ')',
        'opacity': 0.8
      });

  // group to contian the lines
  graph.append('g')
      .attr({
        'class': 'path-group'
      });

  axisAttrs = {
    'shape-rendering': 'crispEdges',
    'stroke-width': 1,
    'stroke': axisColor
  };
  graph.append('g')
      .attr(axisAttrs)
      .attr({
        'class': 'x-axis',
        'transform': 'translate(0,' + drawHeight + ')'
      });
  graph.append('g')
      .attr(axisAttrs)
      .attr({
        'class': 'y-axis'
        //'transform': 'translate(' + drawWidth + ')'
      });

  lineAttrs = {
    'class': 'line',
    'stroke-width': 1.5,
    'fill': 'none'
  };
  line = d3.svg.line()
    .x(function(d) {
      return xScale(d[xPropertyName]);
    })
    .y(function(d) {
      return yScale(d[yPropertyName]);
    })
    .interpolate('cardinal');
}

function getMetricSets () {
  return datasets.map(function (dataset) {
    return dataset.data;
  });
}

function defineYScale () {
  var metrics = d3.merge(getMetricSets()),
      domain;

  if (isYAxisRelative) {
    domain = d3.extent(metrics, function (d) { return d[yPropertyName]; });
  } else {
    domain = [0, d3.max(metrics, function (d) { return d[yPropertyName]; })];
  }

  if (!yScale) {
    yScale = d3.scale.linear()
      .rangeRound([drawHeight, 0])
      .nice();
  }
  yScale.domain(domain);
}

function defineScales() {
  var metrics = d3.merge(getMetricSets());

  if (!xScale) {
    xScale = d3.time.scale()
        .rangeRound([0, drawWidth])
        .nice();
  }
  xScale.domain(d3.extent(metrics, function (d) { return d[xPropertyName]; }));
  defineYScale();
}

function renderAxis() {
  var xAxisGroup,
      yAxisGroup;

  if (!xAxis) {
    xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(d3.time.hours, 2)
        .orient('bottom');
  }
  xAxisGroup = graph.select('.x-axis')
      .call(xAxis);
  // remove boldness from default axis path
  xAxisGroup.selectAll('path')
      .attr({
        'fill': 'none'
      });
  // update fonts
  xAxisGroup.selectAll('text')
      .attr({
        'stroke': 'none',
        'fill': axisColor
      });

  if (!yAxis) {
    yAxis = d3.svg.axis()
        .scale(yScale)
        //.tickSize(drawWidth)
        //.tickPadding(10)
        .orient('left');
  }
  yAxisGroup = graph.select('.y-axis')
      .call(yAxis);
  // remove boldness from default axis path
  yAxisGroup.selectAll('path')
      .attr({
        'fill': 'none'
      });
  // update fonts
  yAxisGroup.selectAll('text')
      .attr({
        'stroke': 'none',
        'fill': axisColor
      });
}

function formatCssClass(str) {
  return str.replace('.', '').replace(' ', '');
}

function renderLines() {
  var pathGroup = graph.select('.path-group');

  datasets.forEach(function (dataset, idx) {
    pathGroup.append('path')
        .data([dataset.data])
        .attr(lineAttrs)
        .attr({
          'stroke': dataset.color || colorScale(idx),
          'class': formatCssClass(dataset[idPropertyName]),
          'd': line
        });
  });
}

function clear() {
  graph.select('.path-group')
    .selectAll('path').remove();
}

function render() {
  defineScales();
  renderAxis();
  renderLines();
}

function appendData() {
  var rand1 = d3.random.normal(50, 100),
      rand2 = d3.random.normal(40, 100);

  datasets.forEach(function (dataset, i) {
    var metrics = dataset.data,
        path = graph.select(
          '.path-group path.' + formatCssClass(dataset[idPropertyName])),
        lastOne = metrics[metrics.length - 1],
        rand = d3.random.normal(
          lastOne[yPropertyName], 200);

    metrics.push({
      timestamp: lastOne[xPropertyName] + pollInterval,
      average: rand()
    });

    metrics.shift();
  });

  // TODO: optimize by doing outside the loop 
  defineScales();
  renderAxis();
  graph.selectAll('.path-group path')
    .attr({
      'd': line
    });
}

function toggleYScale () {
  isYAxisRelative = !isYAxisRelative;
  defineYScale();
  renderAxis();
  clear();
  renderLines();
}

function adjustXScale (el) {
  xScale.rangeRound([0, Math.round(drawWidth * el.value/100)]);
  renderAxis();
  graph.selectAll('.path-group path')
    .attr({
      'd': line
    });
}

init();
render();
