var gData = [{
      'label': 'ping time',
      'color': 'rgba(255, 0, 0, 0.5)',
      'xUnit': 's',
      'yUnit': 'ms',
      'data': [
        [1, 100],
        [2, 120],
        [3, 108]
      ]
    }, {
      'label': 'http response time',
      'color': '#0f0',
      'xUnit': 's',
      'yUnit': 'ms',
      'data': [
        [1, 150],
        [2, 160],
        [3, 200]
      ]
    }];

var gConfig = {
  baseCssClass: 'my-class another-css-class',
  height: 200, // defaults to auto
  width: 300,  // defaults to auto
  yAxisDisplay: 'visible', // enum: visible, hidden, hover (defaults to visible)
  xAxisDisplay: 'visible',
  loadingType: 'spinner', // 'image', 'bar'
  errorText: 'error loading graph',
  maxDataPoints: 100, // defaults to inf
  strokeWidth: 2,
  hover: 'vertical', // 'crosshair', 'tooltip'
  smoothing: 0 // 0-1
  // renderer
  // background color
};

var G = {
  init: function (config) {
    // init with config
  },

  setData: function (data) {
    // set the initial data to be used
  },

  render: function (container) {
    // renders to an element or css selector
    var computedstyle = window.getComputedStyle(container),
        width = computedstyle.width,
        height = computedstyle.height;
  },

  setLoading: function (isLoading) {
    // show/hide loading state
  },

  setError: function (errorText) {
    // show/hide error state
  },

  appendData: function (data) {
    // append more data, keeping previous in tact
  },

  clear: function () {
    // clear out the graph
  },

  dispose: function () {
    // dispoe the graph and clean up all handlers, dom, etc
  }
};

var testData = [7, 2, 3, 4, 5, 4, 3, 2, 1, 2];

var data = testData,
    height,
    width,
    barWidth,
    xScale,
    yScale,
    xAxis,
    yAxis,
    svg,
    points,
    margin = 30,
    container = d3.select('#container'),
    containerEl = document.querySelector('#container');

svg = container.append('svg')
  .attr({
    height: '100%',
    width: '100%'});
points = svg.selectAll('rect');
height = parseInt(window.getComputedStyle(containerEl).height, 10) - margin;
width = parseInt(window.getComputedStyle(containerEl).width, 10) - margin;
barWidth = Math.floor(width / data.length);

yScale = d3.scale.linear()
  .domain([0, d3.max(data)])
  .rangeRound([0, height])
  .clamp(true);
xScale = d3.scale.linear()
  .domain([0, data.length])
  .rangeRound([margin, width + margin])
  .clamp(true);

xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom');
yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left');

points.data(data)
  .enter()
  .append('rect')
  .attr({
    width: barWidth,
    fill: 'blue',
    height: function (d) { return yScale(d); },
    y: function (d) { return height - yScale(d); },
    x: function (d, i) { return xScale(i); }
  });

svg.append('g')
  .attr({
    'class': 'axis',
    'fill': 'none',
    'stroke': '#888',
    'shape-rendering': 'crispEdges',
    'stroke-width': 1,
    'transform': 'translate(0,' + (height) + ')',
    'font-family': 'sans-serif',
    'font-size': '11'
  })
  .call(xAxis);

svg.append('g')
  .attr({
    'class': 'axis',
    'fill': 'none',
    'stroke': '#888',
    'shape-rendering': 'crispEdges',
    'stroke-width': 1,
    'font-family': 'sans-serif',
    'font-size': '11',
    'transform': 'translate(' + margin + ', 0)'
  })
  .call(yAxis);






