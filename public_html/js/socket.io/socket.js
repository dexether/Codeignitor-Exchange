'use strict';

function ClientSockets(objectOfTables, user) {
    
    //Fetch the libs
    var io = require('./vendor/socket.io.min');

    //Get the name of the room
    var room = user.room;

    var ask = objectOfTables['asks'],
            bids = objectOfTables['bids'],
            trade = objectOfTables['marketHistory'],
            orderOpen = objectOfTables['openOrders'],
            orderHistory = objectOfTables['orderHistory'];

    return function () {
        
        if (!window.WebSocket) {
            alert('Your browser does not support WebSocket.');
        } else {
            // create connection
            var socket = io.connect('http://localhost:8080');
            
               var ch = require('./chart');

            socket.on('connect', function () {
                
               var chart = new ch;

                //Connection to the room
                socket.emit('room', room);

                socket.emit('data_to_chart', '');
                
                
                
                socket.on('data_to_chart', function (msg) {
                   // chart = require('./chart')(msg);
                  //  chart.loadData(msg);
                });
                socket.on('chart_stream', function (msg) {
                    console.log('received');
                    chart.stream(msg['array']);
                });

                //Listen the sockets to change the tables
                socket.on('ask', function (msg) {
                    ask.updateValue(msg);
                });

                socket.on('bids', function (msg) {
                    bids.updateValue(msg);
                });

                socket.on('trade_history', function (msg) {
                    trade.updateValue(msg);
                });

                socket.on('order_open', function (msg) {
                    orderOpen.updateValue(msg);
                });

                socket.on('order_history', function (msg) {
                    orderHistory.updateValue(msg);
                });



                //Development
                socket.on('message', function (msg) {
                    console.log(msg);
                });
            });
        }
        ;
    };
}
;

module.exports = ClientSockets;

