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

//Each one of tables contain the object with data and control buttons
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;


//when our page are loaded, we need to get the init data
$.ajax({
    url: "http://localhost:7777/get_init_data",
    data: {
        'room': room //send the name of the room where the user is
    },
    type: "post",
    dataType: "json"
})
        .done(function (json) {
            //if we got the response 
            //create the user object
            user = new User(json['user']);  //store the user data

            //change the available currency
            $('#availableFirst').html(json['firstCurrency']);
            $('#availableSecond').html(json['secondCurrency']);

            //Create the objects of the tables and show their
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

            //Create the socket connection
            var service = new ClientSockets({
                'bids': bidsTable,
                'asks': asksTable,
                'marketHistory': marketHistoryTable,
                'openOrders': openOrdersTable,
                'orderHistory': orderHistoryTable
            }, user);
            service();
        })
        .fail(function (xhr, status, errorThrown) {
            console.error("Error: " + errorThrown);
        })
        .always(function (xhr, status) {
            //console.log("The request is complete!");
        });