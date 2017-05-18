'use strict';

console.log('sc is working');
if (!window.WebSocket) {
    alert('our browser does not support WebSocket.');
}

import table from './services/createTable';

table.createTable($('#table-bids'));
table.createTable($('#table-ask'));

var pathname = window.location.pathname;
console.log(pathname);

// create connection
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        table.updateTable($('#table-ask'), msg);
    });
    
    socket.on('bids', function (msg) {
        table.updateTable($('#table-bids'), msg);
    });
    
    document.querySelector('#buy_button').onclick = function () {
        socket.emit('room', 'EUR-NLG');
    };
});




//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);