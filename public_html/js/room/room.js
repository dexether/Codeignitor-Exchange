var Config = require('../config');
var room;
var rooms = Config['rooms'];
var pathname = window.location.pathname;

//Select room (if URL contains the name of the room)
rooms.forEach(function (element) {
    if (pathname.indexOf(element) >= 0) {
        room = element;
    }
    ;
});

var ClientSockets = require('../socket.io/socket');
var service;

var User = require('../sevices/user');
//The object that contains the user data
var user;

var Table = require('../sevices/table');

//Each tables contain the object with data
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;

var initData = require('./services/init_page');
var init;

$.ajax({
    url: "http://localhost:7777/get_init_data",
    data: {
        'room': room
    },
    type: "post",
    dataType: "json"
})
        .done(function (json) {
            user = new User(json);  //store the user data
          //  console.log();
          $('#availableFirst').html(json['firstCurrency']);
          $('#availableSecond').html(json['secondCurrency']);

            bidsTable = new Table('#table-bids', json['keys']['bids_keys'], json['order_books']['bids']);
            bidsTable.createTable();

            asksTable = new Table('#table-ask', json['keys']['asks_keys'], json['order_books']['asks']);
            asksTable.createTable();

            marketHistoryTable = new Table('#market-history', json['keys']['market_history_keys'], json['market_history']);
            marketHistoryTable.createTable();
            console.log(json['market_history']);

            openOrdersTable = new Table('#table-open', json['keys']['order_open_keys'], json['order_open']);
            openOrdersTable.createTable();

            orderHistoryTable = new Table('#order-history', json['keys']['order_history_keys'], json['order-history']);
            orderHistoryTable.createTable();

            var service = new ClientSockets({
                'bids': bidsTable,
                'asks': asksTable,
                'marketHistory': marketHistoryTable,
                'openOrders': openOrdersTable,
                'orderHistory': orderHistoryTable
            }, user);
            service();

            //init = new initData(json);
            // init();
        })
        .fail(function (xhr, status, errorThrown) {
            console.error("Error: " + errorThrown);
        })
        .always(function (xhr, status) {
            //console.log("The request is complete!");
        });