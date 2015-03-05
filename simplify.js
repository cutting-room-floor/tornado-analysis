var fs = require('fs'),
    d3 = require('d3'),
    leftpad = require('leftpad');

var input = require('./tornadoes.json');
var counties = require('./counties.json');

var albers = d3.geo.albersUsa();

var height = 550;

function center(xy) {
    return [
        ~~((xy[0][0] + xy[1][0]) / 2), ~~((xy[0][1] + xy[1][1]) / 2)
    ];
}

var simple = input.features.map(function(f) {
    return [albers(f.geometry.coordinates[0]), albers(f.geometry.coordinates[1])];
}).filter(function(f) { return f[0]; });

var Canvas = require('canvas')
  , canvas = new Canvas(900, height)
  , ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 900, height);
var scale = simple.length;

var color = d3.scale.linear()
    .range(["steelblue", "magenta"])
    .domain([0, simple.length])
    .interpolate(d3.interpolateHcl);

var path = d3.geo.path()
   .projection(albers)
   .context(ctx);

ctx.lineWidth = 1;
ctx.strokeStyle = '#333';
path(counties);
ctx.stroke();

ctx.lineWidth = 1;
simple.forEach(function(s, i) {
    ctx.strokeStyle = color(i);
    ctx.beginPath();
    ctx.moveTo.apply(ctx, s[0]);
    ctx.lineTo.apply(ctx, s[1]);
    ctx.stroke();
    if (i % 500 === 0) {
        fs.writeFileSync('./out/' + leftpad(i, 10) + '.png', canvas.toBuffer());
    }
});

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 720, height);

for (var i = 0; i < 100; i++) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 720, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#222';
    path(counties);
    ctx.stroke();
    simple.forEach(function(s, j) {
        if (i > (j / simple.length * 100)) {
            var c = center(s);
            ctx.fillStyle = 'magenta';
            ctx.beginPath();
            ctx.fillRect(c[0], c[1], 1, 1);
        } else {
            ctx.strokeStyle = color(j);
            ctx.beginPath();
            ctx.moveTo.apply(ctx, s[0]);
            ctx.lineTo.apply(ctx, s[1]);
            ctx.stroke();
        }
    });
    fs.writeFileSync('./out2/' + leftpad(i, 10) + '.png', canvas.toBuffer());
}
