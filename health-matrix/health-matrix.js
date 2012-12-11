var data,
    states = ['ok', 'warning', 'critical'],
    colors = ['#00A96D', '#FF9D00', '#C40022'],
    svgWidth = 200,
    totalNodes,
    onSliderChange,
    rowCount,
    colCount,
    rectWidth,
    svg,
    stateRects,
    intervalId;

function generateData (total) {
  var i, rand = d3.random.normal(0, 1);
  data = [];
  for (i = 1; i <= total; i += 1) {
    data.push({
      label: 'entity ' + i,
      state: states[Math.abs(Math.floor(rand(i))) % 3]
    });
  }
  return data;
}

function getRowIndex(d, i) {
  return Math.floor(i/rowCount);
}

function getColIndex(d, i) {
  return i % colCount;
}

function calculateDimensions(val) {
  totalNodes = val;
  document.getElementById('total').innerText = totalNodes;
  rowCount = Math.ceil(Math.sqrt(totalNodes));
  colCount = rowCount;
  rectWidth = Math.floor(svgWidth / rowCount);
}

function clear() {
  svg.selectAll('rect').remove();
}

function render() {
  // insert
  svg.selectAll('rect')
    .data(data, function (d) {
      return d.label;
    })
    .enter()
    .append('rect')
    .attr({
      width: rectWidth,
      height: rectWidth,
      'opacity': 0.8,
      'stroke': '#fff',
      'stroke-width': 1,
      'shape-rendering': 'crispEdges',
      fill: function (d) { return colors[states.indexOf(d.state)]; },
      x: function (d, i) { return getColIndex(d, i) * rectWidth; },
      y: function (d, i) { return getRowIndex(d, i) * rectWidth; }
    });
}

function reRender() {
  // update
  svg.selectAll('rect')
    .data(data, function (d) {
      return d.label;
    })
    .transition()
      .duration(900)
      .ease('linear')
    .attr('stroke', function () {
      return this.attributes.fill.value;
    })
    .attr('fill', function (d) {
      return colors[states.indexOf(d.state)];
    });
}

function update (val) {
  totalNodes = val;
  clear();
  generateData(val);
  calculateDimensions(val);
  render();
}

svg = d3.select('#container').append('svg')
  .attr({
    width: svgWidth,
    height: svgWidth
  });

onSliderChange = _.debounce(update, 200);
document.getElementById('slider').addEventListener('change', function (e) {
  onSliderChange(e.target.value);
});

function startPoll() {
  intervalId = setInterval(function () {
    generateData(totalNodes);
    reRender();
  }, 4000);
}

function stopPoll() {
  clearInterval(intervalId);
}

update(16);
