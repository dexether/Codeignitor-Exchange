'use strict';

if (!window.WebSocket) {
    alert('Your browser does not support WebSocket.');
}



var pathname = window.location.pathname;
console.log(pathname);


import Config from '../config';
var rooms = Config['rooms'];
var room;
rooms.forEach(function(element) {
    if (pathname.indexOf(element) >= 0) {
        room = element;
        console.log('You`re jioned to the room '+ room);
    };
});

import Table from './services/createTable';

//Create the objects of the tables
var bids = new Table();
var ask = new Table();


//Set the count of the row in this table
bids.setCount(Config['count_row_bids']);
ask.setCount(Config['count_row_ask']);

//Create the views of the tables
bids.createTable($('#table-bids'));
ask.createTable($('#table-ask'));



// create connection
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.emit('room', room);
    
    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        ask.updateValue(msg);
    });

    socket.on('bids', function (msg) {
       bids.updateValue(msg);
    });
});




//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);