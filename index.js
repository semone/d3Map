var $ = require('jquery');
var d3 = require('d3')
var topojson = require('topojson');


var width = $('#content').width();
var height = $('#content').height();

var states = statesIdArray();



// console.log(width);
// console.log(height);


var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width/2, height/2]);
    

// console.log("projection: " + projection);

var path = d3.geo.path()
            .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);                        

d3.json("/topoJson/usstates.json", function(error, us) {
    var states = topojson.feature(us, us.objects.usstates);

    var stateName; 

    svg.selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "states")
        .attr("id", function(d){
            { return  "path" + d.properties.STATE ;}
        })
        .on('mouseover', function(d){
            //setClass  do not work for SVG, this is the solution
            $(this).attr("class", "states mouseover");
            // $('#title').empty().append(d.properties.NAME);
            // $('#title').append(d.properties.STATE);

        })
        .on('mouseout', function() {
            //removeClass  do not work for SVG, this is the solution
            $(this).attr("class", "states");

        });

    //init the game
    init(states.features);

});

function init(data){
    //Don't show the start button until the map i sloaded. 
    $('#start').removeClass('hide'); 

    $('#start').on('click', function(){
        console.log('start');
       
        newStateCheck(data);
 
    });
};

/*
Gets a random state and checks if the player is done!
*/
function newStateCheck(data){
    //Remove the event handler. 
    $('.states').off('click');

    //Empty the text where the state to click is shown.
    $('#stateToClick').empty();

    //Get a random stateNumber
    var stateNumber = getRandomState();

    //console.log("stateNumber" + stateNumber);
    //console.log(data);
    
    //Check if there are any states left in the array
    if (stateNumber === 0){
        console.log('Done, no more states left');
        $('#stateToClick').append("You are done!");
        //Show play again button or something.
        //Present some kind of result. 

    } else {
        $.each(data, function(i, v) {
            if (v.properties.STATE == stateNumber) {    
                console.log(v.properties.NAME);
                d3.select('#stateToClick')
                     .text(v.properties.NAME);
                //A little cheat for me. 
                //d3.select('#path' + stateNumber)
                //    .attr('class', 'states mouseover');  
                //}
             });
            //Check which state the user clicks 
            checkStateClick(stateNumber, data);
        }

}

/*
This function checks if the user clicks the correct state
-stateNumber -> the random number generated, the wanted state-
-data -> the data from the map so we can get the name. 
*/

function checkStateClick(stateNumber, data){
    //On click of the map
    $('.states').on('click', function(event){
        event.preventDefault();
        //State id is the id of the path. 
        var stateId = $(this).attr('id');
        //console.log(stateId);
        //The state that should be clicked
        var wantedState  = "path" + stateNumber;
        //Did the user click the correct state
        if (stateId === wantedState) {
            console.log("Correct!!");
            //Color the correct state green or something
            //Get new random state to click.   
            newStateCheck(data);
        }else{
            console.log("Wrong");
            // Just continue to click till correct state clicked. 
            // return false;
        }
    });

}

/*
Create an array with all the state ids
(Should probably remove District of Colombia because it
is too small to be clickable.)
*/
function statesIdArray(){
    var pool = [];
    //43 and 07 and 03 and 52
    for (var i = 1; i < 57; i++) {
        if(i !== 43 && i !== 7 && i !== 3 && i !== 52 && i !== 14){
            pool.push(i);
        }
    };
    return pool;
}
/*
Get a random state from the stateIdArray 
When a state has ben picked it is removed from the
array.
*/

function getRandomState(){

    console.log(states);

    if (states.length === 0) {
        console.log('No states left');
        return 0;
    };
    var index = Math.floor(Math.random()*states.length);
    var pickedState = states.splice(index,1);

    console.log("index" + index);
    console.log("pickedState" + pickedState);

    if (pickedState.toString().length < 2) {
            pickedState = "0" +pickedState;
        };

    return pickedState;
};


$(document).ready(function(){
    console.log('Document ready');
    //Hide the startbutton when it is clicked.
    $('#start').on('click', function(){
        $(this).addClass('hide');
    });

});






