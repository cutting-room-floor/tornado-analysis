var fs = require('fs'),
    d3 = require('d3'),
    leftpad = require('leftpad');

var input = require('./tornadoes.json');

var height = 450;

function scale(xy) {
    return [
        ~~((xy[0] + 128) * (720 / (124-59))), ~~((52 - xy[1]) * (height / (52-21)))
    ];
}

function center(xy) {
    return [
        (xy[0][0] + xy[1][0]) / 2,
        (xy[0][1] + xy[1][1]) / 2
    ];
}

var simple = input.features.map(function(f) {
    return [scale(f.geometry.coordinates[0]), scale(f.geometry.coordinates[1])];
});

var Canvas = require('canvas')
  , canvas = new Canvas(720, height)
  , ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 720, height);
var scale = simple.length;

var color = d3.scale.linear()
    .range(["steelblue", "magenta"])
    .domain([0, simple.length])
    .interpolate(d3.interpolateHcl);

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

simple.forEach(function(s, i) {
    ctx.fillStyle = color(i);
    ctx.beginPath();
    var c = center(s);
    ctx.fillRect(c[0], c[1], 2, 2);
    if (i % 500 === 0) {
        fs.writeFileSync('./out2/' + leftpad(i, 10) + '.png', canvas.toBuffer());
    }
});
