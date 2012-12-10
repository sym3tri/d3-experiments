var svg,
    spinner,
    twoPi = 2 * Math.PI,
    progress = 0,
    width = 600,
    height = 200,
    bgColor = '#ccc',
    fgColor = '#3288BD',
    outerRadius = 16,
    intervalId,

    group1,
    spinner1,
    arc1,

    group2,
    spinner2,
    arc2;

svg = d3.select('#container').append('svg')
  .attr({
    'width': width,
    'height': height
  });

arc1 = d3.svg.arc()
  .startAngle(0)
  .innerRadius(0)
  .outerRadius(outerRadius);

group1 = svg.append('g')
  .attr('transform', 'translate(50,' + height / 2 + ')');

group1.append('path')
  .attr({
    'd': arc1.endAngle(twoPi),
    'fill': bgColor
  });

spinner1 = group1.append('path')
  .attr({
    'fill': fgColor
  });


// hollow spinner
arc2 = d3.svg.arc()
  .startAngle(0)
  .innerRadius(outerRadius * 0.6)
  .outerRadius(outerRadius);

group2 = svg.append('g')
  .attr('transform', 'translate(100,' + height / 2 + ')');

group2.append('path')
  .attr({
    'd': arc2.endAngle(twoPi),
    'fill': bgColor
  });

spinner2 = group2.append('path')
  .attr({
    'fill': fgColor
  });

// line meter
var lineGroup = svg.append('g')
  .attr('transform', 'translate(150,' + height / 2 + ')');

var lineAttrs = {
  'x1': 0,
  'y1': 0,
  'y2': 0,
  'fill': 'none',
  'stroke-width': 8,
  'stroke-linecap': 'round',
  'opacity': 1
};

var lineBg = lineGroup.append('line')
  .attr(lineAttrs)
  .attr({
    'x2': 100,
    'stroke': bgColor
  });

var line = lineGroup.append('line')
  .attr(lineAttrs)
  .attr({
    'x2': 0,
    'stroke': fgColor
  });



function advance(val) {
  var radianProgress = twoPi * val;

  console.log(val);
  spinner1.attr('d', arc1.endAngle(radianProgress));
  spinner2.attr('d', arc2.endAngle(radianProgress));
  line.attr('x2', val * 100);
}

function fadeOut() {
  svg.selectAll('path')
    .transition().delay(200).attr('transform', 'scale(0)');

  svg.selectAll('line')
    .transition().delay(200).attr('opacity', 0);
}

function updateProgress() {
  progress = Math.min(progress += 0.1, 1);
  advance(progress);
  if (progress === 1) {
    clearInterval(intervalId);
    fadeOut();
  }
}

intervalId = setInterval(updateProgress, 300);







  //d3.transition().tween("progress", function() {
    //return function(t) {
      //progress = i(t);
      //foreground.attr("d", arc.endAngle(twoPi * progress));
    //};
  //});

