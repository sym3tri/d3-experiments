
var Popover = function () {
  this.el = d3.select('body').append('div')
    .attr('class', 'popover');
};
Popover.prototype.show = function (x, y, txt) {
  this.el
    .style('display', 'block')
    .style('top', y + 'px')
    .style('left', x + 'px')
    .text(txt);
};
Popover.prototype.hide = function () {
  this.el
    .style('display', 'none');
};

var popover = new Popover();

function drawChart() {
  var data, chart, scale, svg, width = 180, height = 32,
    w = 4, h = 16, space = 2, maxBars, nextCnt, id;

  maxBars = Math.floor(width / (space + w));
  nextCnt = 0;
  id = 0;

  function next() {
    var val;
    if (nextCnt % 2 === 0) {
      nextCnt = 1;
      val = 0;
    } else {
      val = Math.round(Math.random() * 2);
      nextCnt += 1;
    }
    id += 1;
    return { 'id': id, 'val': val };
  }
  function getBarY(d) {
    return d.val * h / 2;
  }
  function getBarX(d, i) {
    var offset = space + w,
      diff = maxBars - data.length;
    return i * offset + (diff * offset);
  }
  function getBarClass(d) {
    if (d.val === 0) {
      return 'ok';
    }
    if (d.val === 1) {
      return 'warning';
    }
    return 'critical';
  }
  function redraw() {
    var rect = chart.selectAll('rect')
      .data(data, function (d, i) { return d; });
    // Enter
    rect.enter()
      .append('rect')
        .attr('x', getBarX)
        .attr('y', getBarY)
        .attr('width', w)
        .attr('height', h)
        .attr('class', getBarClass);
    // Exit
    rect.exit()
      .remove();
    // Update
    rect.attr('x', getBarX);
    rect.on('mouseover', function (d, i) {
      var txt = getBarClass(d) + ' - ' + d.id;
      popover.show(d3.event.pageX, d3.event.pageY, txt);
    });
    rect.on('mouseout', function (d, i) {
      //setTimeout(popover.hide.call(popover), 500);
      //popover.hide();
    });
  }
  function tick() {
    if (data.length === maxBars) {
      data.shift();
    }
    data.push(next());
    //console.log(data);
    redraw();
  }

  // make fake data
  data = d3.range(20).map(next);

  // add the chart
  chart = d3.select('body').append('svg')
    .attr('class', 'chart')
    .style('width', width)
    .style('height', height);

  // draw initial data
  redraw();
  // update periodically
  setInterval(tick, 1500);
}

(function () {
  var i;
  for (i = 0; i < 20; i += 1) {
    drawChart();
  }
}());

