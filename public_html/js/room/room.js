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


var ClientSockets = require('./socket.io/socket');
var service;

var User = require('./sevices/user');
//The object that contains the user data
var user;
var dataInfoElem = $('#data-info');

var Table = require('./sevices/table');

//Each one of tables contain the object with data and control buttons
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;


//when our page are loaded, we need to get the init data
$.ajax({
    url: base_url + "markets/get_init_data/" + room + "/" + $("div[data-suid]").attr('data-suid'),
    type: "get",
    dataType: "json"
})
        .done(function (json) {
            //if we got the response 
            //create the user object
            user = new User(json['user'], dataInfoElem);  //store the user data

            //change the available currency
            //            {
//                firstCurrency: ... ,
//                secondCurrency: ...
//            }
            user.setCurrencies(json['user']);
            

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
            service.start();
        })
        .fail(function (xhr, status, errorThrown) {
            console.error("Error: " + errorThrown);
        })
        .always(function (xhr, status) {
            //console.log("The request is complete!");
        });