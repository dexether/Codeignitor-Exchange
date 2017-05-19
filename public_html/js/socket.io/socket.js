'use strict';

console.log('sc is working');
if (!window.WebSocket) {
    alert('our browser does not support WebSocket.');
}

import Table from './services/createTable';

var bids = new Table();
var ask = new Table();

var pathname = window.location.pathname;
console.log(pathname);

bids.createTable($('#table-bids'));
ask.createTable($('#table-ask'));

// create connection
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        ask.updateValue(msg);
    });

    socket.on('bids', function (msg) {
       bids.updateValue(msg);
    });

    document.querySelector('#buy_button').onclick = function () {
        socket.emit('room', 'EUR-NLG');
    };
});




//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);