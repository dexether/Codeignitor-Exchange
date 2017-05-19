'use strict';

function ClientSockets() {

    var Config = require('../config');
    var Table = require('./services/createTablesOrderBook');

    var room,
            ask,
            bids,
            trade,
            orderOpen,
            orderHistory;

    function selectRoom() {
        //Get a list of the rooms and current URL
        var rooms = Config['rooms'];
        var pathname = window.location.pathname;
        //Select room (if URL contains the name of the room)
        rooms.forEach(function (element) {
            if (pathname.indexOf(element) >= 0) {
                room = element;
                console.log('You`re jioned to the room ' + room);
            }
            ;
        });
    }
    ;

    function createTables() {
        //Create the objects of the tables
        bids = new Table();
        ask = new Table();

        //Set the count of the row in this table
        bids.setCount(Config['count_row_bids']);
        ask.setCount(Config['count_row_ask']);

        //Create the views of the tables
        bids.createTable($('#table-bids'));
        ask.createTable($('#table-ask'));

        //Market history
        trade = new TableStatistics();
        trade.setKeys(Config['keys_trade_history']);
        trade.setCount(Config['count_trade_history']);
        trade.createTable($('#market-history'));


        orderOpen = new TableStatistics();
        orderOpen.setKeys(Config['keys_order_open']);
        orderOpen.setCount(Config['count_order_open']);
        orderOpen.createTable($('#table-open'));


        orderHistory = new TableStatistics();
        orderHistory.setKeys(Config['keys_order_history']);
        orderHistory.setCount(Config['count_order_history']);
        orderHistory.createTable($('#order-history'));
    }



    var TableStatistics = require('./services/createTablesStatistics');

    //trade.setKeys(Config['keys_trade_history']);


    return function () {
        if (!window.WebSocket) {
            alert('Your browser does not support WebSocket.');
        }
        ;

        // create connection
        var socket = io.connect('http://localhost:8080');

        socket.on('connect', function () {

            selectRoom();
            createTables();

            //Connection to the room
            socket.emit('room', room);

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
    };
}
;

var service = new ClientSockets();
service();

