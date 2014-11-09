var $ = require('jquery');
var d3 = require('d3')
var topojson = require('topojson');


var width = $('#content').width();
var height = $('#content').height();

console.log(width);
console.log(height);


var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width/2, height/2]);


console.log("projection: " + projection);

var path = d3.geo.path()
            .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);    
     

d3.json("/topoJson/usstates.json", function(error, us) {
    var states = topojson.feature(us, us.objects.usstates);

    svg.selectAll("path")
    .data(states.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states")
    .on('mouseover', function(d){
        $(this).attr("class", "states mouseover");
        $('#title').empty().append(d.properties.NAME);
    })
    .on('mouseout', function() {
        $(this).attr("class", "states");

    })
    .append("svg:title")
    .text(function(d) { return d.properties.NAME; });

});


