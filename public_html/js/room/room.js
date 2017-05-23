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
            user = new User(json['user']);  //store the user data
    
          $('#availableFirst').html(json['firstCurrency']);
          $('#availableSecond').html(json['secondCurrency']);

            bidsTable = new Table('#table-bids', json['tables']['table-bids'], user);
            bidsTable.createTable();

            asksTable = new Table('#table-ask', json['tables']['table-ask'], user);
            asksTable.createTable();

            marketHistoryTable = new Table('#market-history', json['tables']['market-history'], user);
            marketHistoryTable.createTable();

            openOrdersTable = new Table('#table-open', json['tables']['table-open'], user);
            openOrdersTable.createTable();

            orderHistoryTable = new Table('#order-history', json['tables']['order-history'], user);
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