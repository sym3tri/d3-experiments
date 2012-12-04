var n = 40,
    random = d3.random.normal(5, 2),
    data = d3.range(n).map(random),
    width = 960,
    height = 500;

var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 10])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var path = svg.append("g")
  .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line);

//tick();

function tick() {

  // push a new data point onto the back
  data.push(random());

  // redraw the line, and slide it to the left
  path
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(500)
      .ease("linear")
      .attr("transform", "translate(" + x(-1) + ")")
      .each("end", tick);

  // pop the old data point off the front
  data.shift();

}
