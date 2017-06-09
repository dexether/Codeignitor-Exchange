var roomservice =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public_html/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var config = {
    'website': 'http://exchange-dev',
    'count_row_bids': 5,
    'key_bids': ['sum', 'total', 'size(ngl)', 'bid(btc)'],
    'key_asks': ['sum', 'total', 'size(ngl)', 'bid(btc)'],
    'count_row_ask': 5,
    'count_trade_history': 10,
    'keys_market_history': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
    'count_order_open': 5,
    'keys_order_open': ['date', 'buy/sell', 'gts', 'total units', 'total cost', 'something'],
    'count_order_history': 5,
    'keys_order_history': ['date', 'buy/sell', 'gts', 'total units', 'total cost', 'something'],
    'rooms': ['EUR-GTS', 'EUR-NLG', 'EUR-ETH', 'EUR-ZEC']
};

module.exports = config;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Table = function (element, object, userInfo) {
    var k = 10; //count of the records in the tables

    //Init the object
    var user = userInfo; //the user object from the room.js 
    var tableID = $(element).attr('id'); //hold the ID of the table of this object
    var table = $(element).find('tbody'); //the DOM element of the table
    var keys = object['keys']; //The name of columns from thead in the order
    var tableValue = object['first'] || []; //The array of the records of this table
    //   var firstPageInTable = 1;               //The number of first page of the records that is saving
    var tableLength = object['count']; //MAX count of the records in this table /on the server

    var countOfRows = tableValue.length < k ? tableValue.length : k;
    //MAX count of the records in the tables    
    var pageNumber = 1; //Page of the table that is showing on the site
    var pageCount = Math.round(object['count'] / 10);
    //Calc the count of the pages 

    //Update the count of the pages
    function setNewPageCount() {
        pageCount = Math.round(tableLength / countOfRows);
        //        if (pageNumber > pageCount)
        //            pageNumber = pageCount;
    }
    ;

    //Download the records of the table via AJAX
    //  'fromNumber' - from which number the records are requested,
    //  'button'     - which function is calling this request 
    function downloadNext(fromNumber, button) {
        //for 'first', 'last' or 'update' we're going to update the all table
        //for the rest only 200 records

        var countForLoaded;
        if (button === 'update') {
            countForLoaded = tableValue.length;
        } else {
            if (button === 'last') {
                countForLoaded = tableLength;
            } else countForLoaded = 200;
        }
        ;
        if (countForLoaded) $.ajax({
            url: "http://localhost:7777/get_next_records",
            data: {
                'fromNumber': fromNumber, //from which number the records are requested
                'count': countForLoaded, //how many records are requested
                'room': user['room'], //this is the room where a user is logging,
                'table': tableID, //the ID of the table whose records are requested,
                'data-market': user.market,
                'data-suid': user.suid
            },
            type: "post",
            dataType: "json"
        })
        //if AJAX POST request  is successful
        .done(function (json) {
            if (button === 'next') {
                tableValue.push.apply(tableValue, json['value']); // add new from the response
                pageNumber++;
                changePageView();
            } else {
                if (button === 'last' || button === 'update') {
                    tableValue = json['value']; //update the tableValue
                }
            }
            ;
            changePageView(); //update the view the table, show new records
        }).fail(function (xhr, status, errorThrown) {
            console.error("Error: " + errorThrown);
        }).always(function (xhr, status) {
            //console.log("The request is complete!");
        });
    }
    ;

    function getNumberInTableById(id) {
        alert(id);
        for (var i = 0; i < tableValue.length; i++) {
            if (tableValue[i]['Id'] === id) {
                return i;
            }
        }
        return undefined;
    }
    ;

    function addAtTopOfTable(record) {
        var lengthOfTableAtTheMomment = tableValue.length;
        tableValue.unshift(record);
        if (lengthOfTableAtTheMomment < tableValue.length) {
            tableValue.splice(lengthOfTableAtTheMomment, 1);
        }
    }
    ;

    function deleteRecordFromTable(numberInTable, newValue) {
        tableValue.splice(numberInTable, 1); //remove the record
        if (newValue) {
            tableValue.push(newValue); //add the new one instead the removed record
        } else {
            tableLength -= 1;
            setNewPageCount();
        }
        updateTable();
    }
    ;

    function deleteRecord(user, mooidForRemove, length) {
        var numberForRemove = getNumberInTableById(mooidForRemove);

        if (numberForRemove >= 0) $.ajax({
            url: base_url + '/trades/delete_mooid',
            data: {
                'user': user.userId, //user's ID
                'action': 'delete', //action
                'mooid': mooidForRemove, //data-mooid of this record
                'tableLenght': length, //how many records are in the table
                'data-market': user.market,
                'data-suid': user.suid,
                'csrf_gt': $('input[name=csrf_gt]').val()
            },
            type: "post",
            dataType: "json"
        }).done(function (json) {
            if (json['status'] === 'success') {
                deleteRecordFromTable(numberForRemove, json['value']);
                $('input[name=csrf_gt]').val(json['csrf']);
            }
        }).fail(function (xhr, status, errorThrown) {
            console.error("Error: " + errorThrown);
        }).always(function (xhr, status) {
            //console.log("The request is complete!");
        });
    }
    ;
    //Create the pagination for this table
    function createPagination() {
        //Add the HTML structure
        $('#' + tableID).append("<div class='paginnation'>\n\
                                <button class='paginnation__control first'>First</button>\n\
                                <button class='paginnation__control previous'>previous</button>\n\
                                <span class='paginnation__page-number page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='paginnation__control next'>Next</button>\n\
                                <button class='paginnation__control last'>Last</button>\n\
                            </div>");
        setNewPageCount();
        changePageView();

        //Add the EventListeners for the control buttons
        $('#' + tableID).find('.first').on('click', function () {
            pageNumber = 1;
            changePageView();
        });

        $('#' + tableID).find('.next').on('click', function () {
            if (pageNumber < pageCount) {
                if (pageNumber % 20 === 0 && pageNumber * k < tableLength) {
                    downloadNext(k * pageNumber + 1, 'next'); //load the records
                } else {
                    pageNumber++;
                    changePageView();
                }
            }
        });

        $('#' + tableID).find('.previous').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                changePageView();
            }
        });

        $('#' + tableID).find('.last').on('click', function () {
            if (tableValue.length + 9 >= k * pageCount) {
                pageNumber = pageCount;
                changePageView();
            } else {
                pageNumber = pageCount;
                downloadNext(1, 'last'); //load the records
            }
        });
    }
    ;

    //Delete the pagination
    function deletePagination() {
        $('#' + tableID).find('.paginnation').remove();
    }
    ;

    //Recount the numbers of the pagination
    function changePageView() {
        //Replace the numbers
        setNewPageCount();
        $('#' + tableID).find('.page-number').text(pageNumber + " / " + pageCount);
        updateTable();
    }
    ;

    //update the values in the table which are shown 
    function updateTable() {
        var tableOpen = tableID === 'table-open';
        var row = ''; //the new row <tr> of the table
        for (var i = 0; i < countOfRows; i++) {
            //for all rows of the table
            //Get the current row
            var rowOfTable = $(table).find('tr:eq( ' + i + ')');
            row = '<tr>';
            //if necessary record exist in the table
            if (tableValue[i + k * (pageNumber - 1)]) {
                //the loop by keys
                for (var key in keys) {
                    //add column with data
                    var templ = parseFloat(tableValue[i + k * (pageNumber - 1)][keys[key]]);
                    if (templ) {
                        if (keys[key] !== 'Date' && keys[key] !== 'Id') row += '<td>' + templ.toFixed(8) + '</td>';else if (keys[key] === 'Date') {
                            row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';
                        }
                    } else {
                        row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';
                    }
                }

                if (tableOpen) {
                    row += '<td class="delete" data-mooid="' + tableValue[i]['Id'] + '"><img src="/images/cross.png" style="width: 20px;"></td>';
                }
                row += '</tr>';
                //if the current row in the table is not existing
                if (rowOfTable.length === 0) {
                    //but we need more then rows are
                    if (countOfRows > $(table).find('tr').length)
                        //add row
                        $(table).append(row);
                } else {
                    //if just update
                    if (countOfRows >= $(table).find('tr').length) {
                        $(rowOfTable).replaceWith(row);
                    } else {
                        //if table is too small
                        $(rowOfTable).remove();
                    }
                }
            } else {
                if (rowOfTable.length > 0) {
                    row = '<tr>';
                    for (var key in keys) {
                        row += '<td></td>';
                    }
                    ;
                    row += '</tr>';
                    $(rowOfTable).replaceWith(row);
                }
            }
            ;
        }
        ;
    }
    ;

    return {
        //create a new table, add the records
        createTable: function () {
            var tableOpen = tableID === 'table-open';
            setNewPageCount();
            var row = ''; // the row of the table
            var rowTemplate = ''; // the body of the table
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    if (keys[key] !== 'Id') {
                        var templ = parseFloat(tableValue[i][keys[key]]);
                        if (templ) {
                            if (keys[key] !== 'Date' && keys[key] !== 'Id') row += '<td>' + templ.toFixed(8) + '</td>';else if (keys[key] === 'Date') {
                                row += '<td>' + tableValue[i][keys[key]] + '</td>';
                            }
                        } else {
                            row += '<td>' + tableValue[i][keys[key]] + '</td>';
                        }
                    } else {
                        row += '<td class="delete" data-mooid="' + tableValue[i]['Id'] + '"><img src="/images/cross.png"></td>';
                    }
                }
                row += '</tr>';
                rowTemplate += row;
            }
            //Add HTML template to page
            $(table).html('').append(rowTemplate);

            if (10 < tableLength) {
                createPagination();
            }
            ;

            $("#table-open tr").on('click', 'td[data-mooid]', function (e) {
                e.stopPropagation();
                //var button = e.target;
                var mooidForRemove = $(this).attr('data-mooid');
                // console.log(mooid);
                deleteRecord(user, mooidForRemove, tableValue.length);
            });
        },

        //Update the values of tableValue and change the records which are shown
        updateValue: function (object) {
            if (pageCount <= 20) {
                var value = object['first'];
                tableLength = object['count'];
                setNewPageCount();

                tableValue = value;

                if (countOfRows < tableLength) {
                    if ($('#' + tableID).find('.paginnation').length === 0) createPagination();
                    countOfRows = k;
                } else {
                    deletePagination();
                }
                ;
                changePageView();
            } else {
                downloadNext(1, 'update');
                setNewPageCount();
                changePageView();
            }
        },

        removeRecord: function (id, newValue) {
            var numberForRemove = getNumberInTableById(id);
            if (numberForRemove) deleteRecordFromTable(numberForRemove, newValue);
        },

        addRecordAtTheTop(record) {
            addAtTopOfTable(record);
        }
    };
};

module.exports = Table;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var User = function (data, dataInfoElem) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var firstCurrency = data['firstCurrency'] || 0;
    var secondCurrency = data['secondCurrency'] || 0;
    var market = $(dataInfoElem).attr('data-market');
    var suid = $(dataInfoElem).attr('data-suid');
    var hash = $(dataInfoElem).attr('data-suid');

    function updateValueOfCurrences() {
        $('#availableFirst').html(firstCurrency);
        $('#availableSecond').html(secondCurrency);
    };

    return {
        userId: user_id,
        room: activeRoom,
        market: market,
        suid: suid,
        firstCurrency: firstCurrency,
        secondCurrency: secondCurrency,
        hash: hash,

        setCurrencies: function (currencies) {
            if (currencies[firstCurrency]) {
                firstCurrency = currencies[firstCurrency];
            }
            ;
            if (currencies[secondCurrency]) {
                secondCurrency = currencies[secondCurrency];
            }
            updateValueOfCurrences();
        }
    };
};

module.exports = User;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function ClientSockets(objectOfTables, user) {

    //Fetch the libs
    //  var io = require('./vendor/socket.io.min');

    //Get the name of the room
    var room = user.room;

    var ask = objectOfTables['asks'],
        bids = objectOfTables['bids'],
        trade = objectOfTables['marketHistory'],
        orderOpen = objectOfTables['openOrders'],
        orderHistory = objectOfTables['orderHistory'];

    return {
        start: function () {

            if (!window.WebSocket) {
                alert('Your browser does not support WebSocket.');
            } else {
                // create connection
                //   var socket = io.connect('http://node.guldentrader.com');
                var socket = io.connect('http://localhost:8080', { transports: ['websocket'] });

                var ch = __webpack_require__(5);

                var chart = new ch();
                chart.init(user);
                chart.createChart();

                //Connection to the room
                socket.emit('market', { 'room': room, 'userId': user.userId, 'user_hash': user.hash });

                socket.on('market', function (msg) {
                    console.log(msg);

                    switch (msg['table']) {
                        case 'table-bids':
                            {
                                bids.updateValue(msg['data']);
                                break;
                            }

                        case 'table-ask':
                            {
                                ask.updateValue(msg['data']);
                                break;
                            }

                        case 'chart':
                            {
                                //console.log(msg['data']);
                                chart.stream(msg['data']);
                                break;
                            }

                        default:
                            {
                                console.log(msg);
                                break;
                            }
                    }
                });
            }
            ;
        }
    };
}
;

module.exports = ClientSockets;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Config = __webpack_require__(0);
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

var ClientSockets = __webpack_require__(3);
var service;

var User = __webpack_require__(2);
//The object that contains the user data
var user;
var dataInfoElem = $('#data-info');

var Table = __webpack_require__(1);

//Each one of tables contain the object with data and control buttons
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;

//when our page are loaded, we need to get the init data
$.ajax({
    url: base_url + "markets/get_init_data/" + room + "/" + $("div[data-suid]").attr('data-suid'),
    type: "get",
    dataType: "json"
}).done(function (json) {
    //if we got the response 
    //create the user object
    user = new User(json['user'], dataInfoElem); //store the user data

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
}).fail(function (xhr, status, errorThrown) {
    console.error("Error: " + errorThrown);
}).always(function (xhr, status) {
    //console.log("The request is complete!");
});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function ChartMarket() {
    var user;
    var dataTable;

    return {
        init: function (userObject) {
            user = userObject;
        },
        createChart() {
            anychart.onDocumentReady(function () {

                // create a data set
                //  /chart/candle/NLG/30minutes
                dataTable = anychart.data.table(0);
                $.ajax({
                    url: "/chart/candle/" + user.room + "/30minutes",
                    type: "get",
                    dataType: "json"
                }).done(function (json) {
                    console.log(json);
                    dataTable.addData(json['data']);
                    console.log(dataTable);
                }).fail(function (xhr, status, errorThrown) {
                    console.error("Error: " + errorThrown);
                }).always(function (xhr, status) {
                    console.log("The request is complete!");
                });
                //data = anychart.data.set([[Date.UTC(2007, 8, 7), 22.75, 23.7, 22.69, 23.44], [Date.UTC(2007, 8, 6), 23.03, 23.15, 22.44, 22.97], [Date.UTC(2007, 8, 3), 23.2, 23.39, 22.87, 22.92], [Date.UTC(2007, 8, 2), 22.65, 23.7, 22.65, 23.36], [Date.UTC(2007, 8, 1), 23.17, 23.4, 22.85, 23.25], [Date.UTC(2007, 7, 31), 23.88, 23.93, 23.24, 23.25], [Date.UTC(2007, 7, 30), 23.55, 23.88, 23.38, 23.62], [Date.UTC(2007, 7, 27), 23.98, 24.49, 23.47, 23.49], [Date.UTC(2007, 7, 26), 23.2, 23.39, 22.87, 22.92], [Date.UTC(2007, 7, 25), 22.75, 23.7, 22.69, 23.44], [Date.UTC(2007, 7, 24), 22.65, 23.7, 22.65, 23.36], [Date.UTC(2007, 7, 23), 23.55, 23.88, 23.38, 23.62]]);

                // create a chart
                chart = anychart.stock();

                // create first plot on the chart
                var plot = chart.plot();

                plot.grid().enabled(true);
                plot.grid(1).enabled(true).layout('vertical');
                plot.minorGrid().enabled(true);
                plot.minorGrid(1).enabled(true).layout('vertical');

                chart.scroller().area(dataTable.mapAs({
                    'value': 4
                }));

                // set chart selected date/time range
                chart.selectRange('2007-05-03', '2007-05-20');

                // map the data
                var seriesData = dataTable.mapAs({
                    'open': 1,
                    'high': 2,
                    'low': 3,
                    'close': 4,
                    'value': { column: 4, type: 'close' }
                });

                var series = plot.candlestick(seriesData).name('Timeline');
                series.legendItem().iconType('risingfalling');
                chart.container("container_chart").draw();
            });
        },

        stream: function (newData) {
            var array = [];
            array.push(newData);
            dataTable.addData(array);
        }
    };
}

module.exports = ChartMarket;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTRiZmQ3MDk5ODU5MTNhMDdkZDciLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9zZXZpY2VzL3RhYmxlLmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9yb29tL3NldmljZXMvdXNlci5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9zb2NrZXQuaW8vc29ja2V0LmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9yb29tL3Jvb20uanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3Jvb20vc2V2aWNlcy9jaGFydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWNfaHRtbC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxNGJmZDcwOTk4NTkxM2EwN2RkNyIsInZhciBjb25maWcgPSB7XG4gICAgJ3dlYnNpdGUnOidodHRwOi8vZXhjaGFuZ2UtZGV2JyxcbiAgICAnY291bnRfcm93X2JpZHMnOiA1LFxuICAgICdrZXlfYmlkcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdrZXlfYXNrcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdjb3VudF9yb3dfYXNrJzogNSxcbiAgICAnY291bnRfdHJhZGVfaGlzdG9yeSc6IDEwLFxuICAgICdrZXlzX21hcmtldF9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0J10sXG4gICAgJ2NvdW50X29yZGVyX29wZW4nOiA1LFxuICAgICdrZXlzX29yZGVyX29wZW4nOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ2NvdW50X29yZGVyX2hpc3RvcnknOiA1LFxuICAgICdrZXlzX29yZGVyX2hpc3RvcnknOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ3Jvb21zJzogW1xuICAgICAgICAnRVVSLUdUUycsXG4gICAgICAgICdFVVItTkxHJyxcbiAgICAgICAgJ0VVUi1FVEgnLFxuICAgICAgICAnRVVSLVpFQydcbiAgICBdXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvY29uZmlnLmpzIiwidmFyIFRhYmxlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9iamVjdCwgdXNlckluZm8pIHtcbiAgICB2YXIgayA9IDEwOyAvL2NvdW50IG9mIHRoZSByZWNvcmRzIGluIHRoZSB0YWJsZXNcblxuICAgIC8vSW5pdCB0aGUgb2JqZWN0XG4gICAgdmFyIHVzZXIgPSB1c2VySW5mbzsgICAgICAgICAgICAgICAgICAgIC8vdGhlIHVzZXIgb2JqZWN0IGZyb20gdGhlIHJvb20uanMgXG4gICAgdmFyIHRhYmxlSUQgPSAkKGVsZW1lbnQpLmF0dHIoJ2lkJyk7ICAgIC8vaG9sZCB0aGUgSUQgb2YgdGhlIHRhYmxlIG9mIHRoaXMgb2JqZWN0XG4gICAgdmFyIHRhYmxlID0gJChlbGVtZW50KS5maW5kKCd0Ym9keScpOyAgIC8vdGhlIERPTSBlbGVtZW50IG9mIHRoZSB0YWJsZVxuICAgIHZhciBrZXlzID0gb2JqZWN0WydrZXlzJ107ICAgICAgICAgICAgICAvL1RoZSBuYW1lIG9mIGNvbHVtbnMgZnJvbSB0aGVhZCBpbiB0aGUgb3JkZXJcbiAgICB2YXIgdGFibGVWYWx1ZSA9IG9iamVjdFsnZmlyc3QnXSB8fCBbXTsgLy9UaGUgYXJyYXkgb2YgdGhlIHJlY29yZHMgb2YgdGhpcyB0YWJsZVxuICAgIC8vICAgdmFyIGZpcnN0UGFnZUluVGFibGUgPSAxOyAgICAgICAgICAgICAgIC8vVGhlIG51bWJlciBvZiBmaXJzdCBwYWdlIG9mIHRoZSByZWNvcmRzIHRoYXQgaXMgc2F2aW5nXG4gICAgdmFyIHRhYmxlTGVuZ3RoID0gb2JqZWN0Wydjb3VudCddOyAgICAgIC8vTUFYIGNvdW50IG9mIHRoZSByZWNvcmRzIGluIHRoaXMgdGFibGUgL29uIHRoZSBzZXJ2ZXJcblxuICAgIHZhciBjb3VudE9mUm93cyA9ICh0YWJsZVZhbHVlLmxlbmd0aCA8IGspID8gdGFibGVWYWx1ZS5sZW5ndGggOiBrO1xuICAgIC8vTUFYIGNvdW50IG9mIHRoZSByZWNvcmRzIGluIHRoZSB0YWJsZXMgICAgXG4gICAgdmFyIHBhZ2VOdW1iZXIgPSAxOyAgICAgICAgICAgICAgICAgICAgIC8vUGFnZSBvZiB0aGUgdGFibGUgdGhhdCBpcyBzaG93aW5nIG9uIHRoZSBzaXRlXG4gICAgdmFyIHBhZ2VDb3VudCA9IE1hdGgucm91bmQob2JqZWN0Wydjb3VudCddIC8gMTApO1xuICAgIC8vQ2FsYyB0aGUgY291bnQgb2YgdGhlIHBhZ2VzIFxuXG4gICAgLy9VcGRhdGUgdGhlIGNvdW50IG9mIHRoZSBwYWdlc1xuICAgIGZ1bmN0aW9uIHNldE5ld1BhZ2VDb3VudCgpIHtcbiAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh0YWJsZUxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbi8vICAgICAgICBpZiAocGFnZU51bWJlciA+IHBhZ2VDb3VudClcbi8vICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9Eb3dubG9hZCB0aGUgcmVjb3JkcyBvZiB0aGUgdGFibGUgdmlhIEFKQVhcbiAgICAvLyAgJ2Zyb21OdW1iZXInIC0gZnJvbSB3aGljaCBudW1iZXIgdGhlIHJlY29yZHMgYXJlIHJlcXVlc3RlZCxcbiAgICAvLyAgJ2J1dHRvbicgICAgIC0gd2hpY2ggZnVuY3Rpb24gaXMgY2FsbGluZyB0aGlzIHJlcXVlc3QgXG4gICAgZnVuY3Rpb24gZG93bmxvYWROZXh0KGZyb21OdW1iZXIsIGJ1dHRvbikge1xuICAgICAgICAvL2ZvciAnZmlyc3QnLCAnbGFzdCcgb3IgJ3VwZGF0ZScgd2UncmUgZ29pbmcgdG8gdXBkYXRlIHRoZSBhbGwgdGFibGVcbiAgICAgICAgLy9mb3IgdGhlIHJlc3Qgb25seSAyMDAgcmVjb3Jkc1xuXG4gICAgICAgIHZhciBjb3VudEZvckxvYWRlZDtcbiAgICAgICAgaWYgKGJ1dHRvbiA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgICAgIGNvdW50Rm9yTG9hZGVkID0gdGFibGVWYWx1ZS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYnV0dG9uID09PSAnbGFzdCcpIHtcbiAgICAgICAgICAgICAgICBjb3VudEZvckxvYWRlZCA9IHRhYmxlTGVuZ3RoO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgY291bnRGb3JMb2FkZWQgPSAyMDA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBpZiAoY291bnRGb3JMb2FkZWQpXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vbG9jYWxob3N0Ojc3NzcvZ2V0X25leHRfcmVjb3Jkc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2Zyb21OdW1iZXInOiBmcm9tTnVtYmVyLCAvL2Zyb20gd2hpY2ggbnVtYmVyIHRoZSByZWNvcmRzIGFyZSByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgJ2NvdW50JzogY291bnRGb3JMb2FkZWQsIC8vaG93IG1hbnkgcmVjb3JkcyBhcmUgcmVxdWVzdGVkXG4gICAgICAgICAgICAgICAgICAgICdyb29tJzogdXNlclsncm9vbSddLCAvL3RoaXMgaXMgdGhlIHJvb20gd2hlcmUgYSB1c2VyIGlzIGxvZ2dpbmcsXG4gICAgICAgICAgICAgICAgICAgICd0YWJsZSc6IHRhYmxlSUQsIC8vdGhlIElEIG9mIHRoZSB0YWJsZSB3aG9zZSByZWNvcmRzIGFyZSByZXF1ZXN0ZWQsXG4gICAgICAgICAgICAgICAgICAgICdkYXRhLW1hcmtldCc6IHVzZXIubWFya2V0LFxuICAgICAgICAgICAgICAgICAgICAnZGF0YS1zdWlkJzogdXNlci5zdWlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgQUpBWCBQT1NUIHJlcXVlc3QgIGlzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09ICduZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUucHVzaC5hcHBseSh0YWJsZVZhbHVlLCBqc29uWyd2YWx1ZSddKTsgLy8gYWRkIG5ldyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYnV0dG9uID09PSAnbGFzdCcpIHx8IChidXR0b24gPT09ICd1cGRhdGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVZhbHVlID0ganNvblsndmFsdWUnXTsgIC8vdXBkYXRlIHRoZSB0YWJsZVZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTsgIC8vdXBkYXRlIHRoZSB2aWV3IHRoZSB0YWJsZSwgc2hvdyBuZXcgcmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIGdldE51bWJlckluVGFibGVCeUlkKGlkKSB7XG4gICAgICAgIGFsZXJ0KGlkKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZVZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGFibGVWYWx1ZVtpXVsnSWQnXSA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICA7XG5cbiAgICBmdW5jdGlvbiBhZGRBdFRvcE9mVGFibGUocmVjb3JkKSB7XG4gICAgICAgIHZhciBsZW5ndGhPZlRhYmxlQXRUaGVNb21tZW50ID0gdGFibGVWYWx1ZS5sZW5ndGg7XG4gICAgICAgIHRhYmxlVmFsdWUudW5zaGlmdChyZWNvcmQpO1xuICAgICAgICBpZiAobGVuZ3RoT2ZUYWJsZUF0VGhlTW9tbWVudCA8IHRhYmxlVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlLnNwbGljZShsZW5ndGhPZlRhYmxlQXRUaGVNb21tZW50LCAxKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZVJlY29yZEZyb21UYWJsZShudW1iZXJJblRhYmxlLCBuZXdWYWx1ZSkge1xuICAgICAgICB0YWJsZVZhbHVlLnNwbGljZShudW1iZXJJblRhYmxlLCAxKTsgLy9yZW1vdmUgdGhlIHJlY29yZFxuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWUucHVzaChuZXdWYWx1ZSk7IC8vYWRkIHRoZSBuZXcgb25lIGluc3RlYWQgdGhlIHJlbW92ZWQgcmVjb3JkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUxlbmd0aCAtPSAxO1xuICAgICAgICAgICAgc2V0TmV3UGFnZUNvdW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICB9XG4gICAgO1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlUmVjb3JkKHVzZXIsIG1vb2lkRm9yUmVtb3ZlLCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIG51bWJlckZvclJlbW92ZSA9IGdldE51bWJlckluVGFibGVCeUlkKG1vb2lkRm9yUmVtb3ZlKTtcblxuICAgICAgICBpZiAobnVtYmVyRm9yUmVtb3ZlID49IDApXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYmFzZV91cmwrJy90cmFkZXMvZGVsZXRlX21vb2lkJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICd1c2VyJzogdXNlci51c2VySWQsIC8vdXNlcidzIElEXG4gICAgICAgICAgICAgICAgICAgICdhY3Rpb24nOiAnZGVsZXRlJywgLy9hY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgJ21vb2lkJzogbW9vaWRGb3JSZW1vdmUsIC8vZGF0YS1tb29pZCBvZiB0aGlzIHJlY29yZFxuICAgICAgICAgICAgICAgICAgICAndGFibGVMZW5naHQnOiBsZW5ndGgsIC8vaG93IG1hbnkgcmVjb3JkcyBhcmUgaW4gdGhlIHRhYmxlXG4gICAgICAgICAgICAgICAgICAgICdkYXRhLW1hcmtldCc6IHVzZXIubWFya2V0LFxuICAgICAgICAgICAgICAgICAgICAnZGF0YS1zdWlkJzogdXNlci5zdWlkLFxuICAgICAgICAgICAgICAgICAgICAnY3NyZl9ndCc6ICQoJ2lucHV0W25hbWU9Y3NyZl9ndF0nKS52YWwoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25bJ3N0YXR1cyddID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVSZWNvcmRGcm9tVGFibGUobnVtYmVyRm9yUmVtb3ZlLCBqc29uWyd2YWx1ZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPWNzcmZfZ3RdJykudmFsKGpzb25bJ2NzcmYnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBlcnJvclRocm93bik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24gKHhociwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVGhlIHJlcXVlc3QgaXMgY29tcGxldGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgO1xuLy9DcmVhdGUgdGhlIHBhZ2luYXRpb24gZm9yIHRoaXMgdGFibGVcbiAgICBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAvL0FkZCB0aGUgSFRNTCBzdHJ1Y3R1cmVcbiAgICAgICAgJCgnIycgKyB0YWJsZUlEKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdwYWdpbm5hdGlvbic+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncGFnaW5uYXRpb25fX2NvbnRyb2wgZmlyc3QnPkZpcnN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncGFnaW5uYXRpb25fX2NvbnRyb2wgcHJldmlvdXMnPnByZXZpb3VzPC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3BhZ2lubmF0aW9uX19wYWdlLW51bWJlciBwYWdlLW51bWJlcic+XCIgKyBwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCArIFwiPC9zcGFuPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J3BhZ2lubmF0aW9uX19jb250cm9sIG5leHQnPk5leHQ8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdwYWdpbm5hdGlvbl9fY29udHJvbCBsYXN0Jz5MYXN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAgIHNldE5ld1BhZ2VDb3VudCgpO1xuICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuXG4gICAgICAgIC8vQWRkIHRoZSBFdmVudExpc3RlbmVycyBmb3IgdGhlIGNvbnRyb2wgYnV0dG9uc1xuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5maXJzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSAxO1xuICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnIycgKyB0YWJsZUlEKS5maW5kKCcubmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwYWdlTnVtYmVyIDwgcGFnZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyICUgMjAgPT09IDApICYmIChwYWdlTnVtYmVyICogayA8IHRhYmxlTGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChwYWdlTnVtYmVyKSArIDEsICduZXh0Jyk7Ly9sb2FkIHRoZSByZWNvcmRzXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcisrO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnIycgKyB0YWJsZUlEKS5maW5kKCcucHJldmlvdXMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFnZU51bWJlciA+IDEpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyLS07XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5sYXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRhYmxlVmFsdWUubGVuZ3RoICsgOSA+PSBrICogcGFnZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50O1xuICAgICAgICAgICAgICAgIGRvd25sb2FkTmV4dCgxLCAnbGFzdCcpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIDtcblxuLy9EZWxldGUgdGhlIHBhZ2luYXRpb25cbiAgICBmdW5jdGlvbiBkZWxldGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5wYWdpbm5hdGlvbicpLnJlbW92ZSgpO1xuICAgIH1cbiAgICA7XG5cbi8vUmVjb3VudCB0aGUgbnVtYmVycyBvZiB0aGUgcGFnaW5hdGlvblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhZ2VWaWV3KCkge1xuICAgICAgICAvL1JlcGxhY2UgdGhlIG51bWJlcnNcbiAgICAgICAgc2V0TmV3UGFnZUNvdW50KCk7XG4gICAgICAgICQoJyMnICsgdGFibGVJRCkuZmluZCgnLnBhZ2UtbnVtYmVyJykudGV4dChwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCk7XG4gICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgfVxuICAgIDtcblxuLy91cGRhdGUgdGhlIHZhbHVlcyBpbiB0aGUgdGFibGUgd2hpY2ggYXJlIHNob3duIFxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICB2YXIgdGFibGVPcGVuID0gKHRhYmxlSUQgPT09ICd0YWJsZS1vcGVuJyk7XG4gICAgICAgIHZhciByb3cgPSAnJzsgLy90aGUgbmV3IHJvdyA8dHI+IG9mIHRoZSB0YWJsZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHsgLy9mb3IgYWxsIHJvd3Mgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICAvL0dldCB0aGUgY3VycmVudCByb3dcbiAgICAgICAgICAgIHZhciByb3dPZlRhYmxlID0gJCh0YWJsZSkuZmluZCgndHI6ZXEoICcgKyBpICsgJyknKTtcbiAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgIC8vaWYgbmVjZXNzYXJ5IHJlY29yZCBleGlzdCBpbiB0aGUgdGFibGVcbiAgICAgICAgICAgIGlmICh0YWJsZVZhbHVlW2kgKyBrICogKHBhZ2VOdW1iZXIgLSAxKV0pIHtcbiAgICAgICAgICAgICAgICAvL3RoZSBsb29wIGJ5IGtleXNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAvL2FkZCBjb2x1bW4gd2l0aCBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbCA9IHBhcnNlRmxvYXQodGFibGVWYWx1ZVtpICsgayAqIChwYWdlTnVtYmVyIC0gMSldW2tleXNba2V5XV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoa2V5c1trZXldICE9PSAnRGF0ZScpICYmIChrZXlzW2tleV0gIT09ICdJZCcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0ZW1wbC50b0ZpeGVkKDgpICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlzW2tleV0gPT09ICdEYXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0YWJsZVZhbHVlW2kgKyBrICogKHBhZ2VOdW1iZXIgLSAxKV1ba2V5c1trZXldXSArICc8L3RkPic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGFibGVWYWx1ZVtpICsgayAqIChwYWdlTnVtYmVyIC0gMSldW2tleXNba2V5XV0gKyAnPC90ZD4nO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGFibGVPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkIGNsYXNzPVwiZGVsZXRlXCIgZGF0YS1tb29pZD1cIicgKyB0YWJsZVZhbHVlW2ldWydJZCddICsgJ1wiPjxpbWcgc3JjPVwiL2ltYWdlcy9jcm9zcy5wbmdcIiBzdHlsZT1cIndpZHRoOiAyMHB4O1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgY3VycmVudCByb3cgaW4gdGhlIHRhYmxlIGlzIG5vdCBleGlzdGluZ1xuICAgICAgICAgICAgICAgIGlmIChyb3dPZlRhYmxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL2J1dCB3ZSBuZWVkIG1vcmUgdGhlbiByb3dzIGFyZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPiAkKHRhYmxlKS5maW5kKCd0cicpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWRkIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YWJsZSkuYXBwZW5kKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBqdXN0IHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPj0gJCh0YWJsZSkuZmluZCgndHInKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgdGFibGUgaXMgdG9vIHNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHJvd09mVGFibGUpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocm93T2ZUYWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgICAgICAkKHJvd09mVGFibGUpLnJlcGxhY2VXaXRoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG4gICAgO1xuXG4gICAgcmV0dXJuIHtcbi8vY3JlYXRlIGEgbmV3IHRhYmxlLCBhZGQgdGhlIHJlY29yZHNcbiAgICAgICAgY3JlYXRlVGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0YWJsZU9wZW4gPSAodGFibGVJRCA9PT0gJ3RhYmxlLW9wZW4nKTtcbiAgICAgICAgICAgIHNldE5ld1BhZ2VDb3VudCgpO1xuICAgICAgICAgICAgdmFyIHJvdyA9ICcnOyAgICAgICAgIC8vIHRoZSByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICB2YXIgcm93VGVtcGxhdGUgPSAnJzsgLy8gdGhlIGJvZHkgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgPSAnPHRyPic7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNba2V5XSAhPT0gJ0lkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsID0gcGFyc2VGbG9hdCh0YWJsZVZhbHVlW2ldW2tleXNba2V5XV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChrZXlzW2tleV0gIT09ICdEYXRlJykgJiYgKGtleXNba2V5XSAhPT0gJ0lkJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0ZW1wbC50b0ZpeGVkKDgpICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNba2V5XSA9PT0gJ0RhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0YWJsZVZhbHVlW2ldW2tleXNba2V5XV0gKyAnPC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+JyArIHRhYmxlVmFsdWVbaV1ba2V5c1trZXldXSArICc8L3RkPic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkIGNsYXNzPVwiZGVsZXRlXCIgZGF0YS1tb29pZD1cIicgKyB0YWJsZVZhbHVlW2ldWydJZCddICsgJ1wiPjxpbWcgc3JjPVwiL2ltYWdlcy9jcm9zcy5wbmdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgcm93VGVtcGxhdGUgKz0gcm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9BZGQgSFRNTCB0ZW1wbGF0ZSB0byBwYWdlXG4gICAgICAgICAgICAkKHRhYmxlKVxuICAgICAgICAgICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChyb3dUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIGlmICgxMCA8IHRhYmxlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgJChcIiN0YWJsZS1vcGVuIHRyXCIpLm9uKCdjbGljaycsICd0ZFtkYXRhLW1vb2lkXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAvL3ZhciBidXR0b24gPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgbW9vaWRGb3JSZW1vdmUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbW9vaWQnKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtb29pZCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlUmVjb3JkKHVzZXIsIG1vb2lkRm9yUmVtb3ZlLCB0YWJsZVZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAsXG5cbiAgICAgICAgLy9VcGRhdGUgdGhlIHZhbHVlcyBvZiB0YWJsZVZhbHVlIGFuZCBjaGFuZ2UgdGhlIHJlY29yZHMgd2hpY2ggYXJlIHNob3duXG4gICAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAocGFnZUNvdW50IDw9IDIwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gb2JqZWN0WydmaXJzdCddO1xuICAgICAgICAgICAgICAgIHRhYmxlTGVuZ3RoID0gb2JqZWN0Wydjb3VudCddO1xuICAgICAgICAgICAgICAgIHNldE5ld1BhZ2VDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgdGFibGVWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50T2ZSb3dzIDwgdGFibGVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyMnICsgdGFibGVJRCkuZmluZCgnLnBhZ2lubmF0aW9uJykubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudE9mUm93cyA9IGs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG93bmxvYWROZXh0KDEsICd1cGRhdGUnKTtcbiAgICAgICAgICAgICAgICBzZXROZXdQYWdlQ291bnQoKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZVJlY29yZDogZnVuY3Rpb24gKGlkLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG51bWJlckZvclJlbW92ZSA9IGdldE51bWJlckluVGFibGVCeUlkKGlkKTtcbiAgICAgICAgICAgIGlmIChudW1iZXJGb3JSZW1vdmUpXG4gICAgICAgICAgICAgICAgZGVsZXRlUmVjb3JkRnJvbVRhYmxlKG51bWJlckZvclJlbW92ZSwgbmV3VmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZFJlY29yZEF0VGhlVG9wKHJlY29yZCkge1xuICAgICAgICAgICAgYWRkQXRUb3BPZlRhYmxlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xufVxuO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3Jvb20vc2V2aWNlcy90YWJsZS5qcyIsInZhciBVc2VyID0gZnVuY3Rpb24gKGRhdGEsIGRhdGFJbmZvRWxlbSkge1xuICAgIHZhciB1c2VyX2lkID0gZGF0YVsndXNlcl9pZCddIHx8ICcnO1xuICAgIGFjdGl2ZVJvb20gPSBkYXRhWydyb29tJ107XG4gICAgdmFyIGZpcnN0Q3VycmVuY3kgPSBkYXRhWydmaXJzdEN1cnJlbmN5J10gfHwgMDtcbiAgICB2YXIgc2Vjb25kQ3VycmVuY3kgPSAoZGF0YVsnc2Vjb25kQ3VycmVuY3knXSkgfHwgMDtcbiAgICB2YXIgbWFya2V0ID0gJChkYXRhSW5mb0VsZW0pLmF0dHIoJ2RhdGEtbWFya2V0Jyk7XG4gICAgdmFyIHN1aWQgPSAkKGRhdGFJbmZvRWxlbSkuYXR0cignZGF0YS1zdWlkJyk7XG4gICAgdmFyIGhhc2ggPSAkKGRhdGFJbmZvRWxlbSkuYXR0cignZGF0YS1zdWlkJyk7XG4gICAgXG4gICAgZnVuY3Rpb24gdXBkYXRlVmFsdWVPZkN1cnJlbmNlcyAoKXtcbiAgICAgICAgICAgICAgICAkKCcjYXZhaWxhYmxlRmlyc3QnKS5odG1sKGZpcnN0Q3VycmVuY3kpO1xuICAgICAgICAgICAgICAgICQoJyNhdmFpbGFibGVTZWNvbmQnKS5odG1sKHNlY29uZEN1cnJlbmN5KTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiAge1xuICAgICAgICB1c2VySWQ6IHVzZXJfaWQsXG4gICAgICAgIHJvb206IGFjdGl2ZVJvb20sXG4gICAgICAgIG1hcmtldDogbWFya2V0LFxuICAgICAgICBzdWlkOiBzdWlkLFxuICAgICAgICBmaXJzdEN1cnJlbmN5OiBmaXJzdEN1cnJlbmN5LFxuICAgICAgICBzZWNvbmRDdXJyZW5jeTogc2Vjb25kQ3VycmVuY3ksXG4gICAgICAgIGhhc2g6IGhhc2gsXG5cbiAgICAgICAgc2V0Q3VycmVuY2llczogZnVuY3Rpb24gKGN1cnJlbmNpZXMpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW5jaWVzW2ZpcnN0Q3VycmVuY3ldKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RDdXJyZW5jeSA9IGN1cnJlbmNpZXNbZmlyc3RDdXJyZW5jeV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBpZiAoY3VycmVuY2llc1tzZWNvbmRDdXJyZW5jeV0pIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRDdXJyZW5jeSA9IGN1cnJlbmNpZXNbc2Vjb25kQ3VycmVuY3ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlVmFsdWVPZkN1cnJlbmNlcygpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9yb29tL3NldmljZXMvdXNlci5qcyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gQ2xpZW50U29ja2V0cyhvYmplY3RPZlRhYmxlcywgdXNlcikge1xuXG4gICAgLy9GZXRjaCB0aGUgbGlic1xuICAvLyAgdmFyIGlvID0gcmVxdWlyZSgnLi92ZW5kb3Ivc29ja2V0LmlvLm1pbicpO1xuXG4gICAgLy9HZXQgdGhlIG5hbWUgb2YgdGhlIHJvb21cbiAgICB2YXIgcm9vbSA9IHVzZXIucm9vbTtcblxuICAgIHZhciBhc2sgPSBvYmplY3RPZlRhYmxlc1snYXNrcyddLFxuICAgICAgICAgICAgYmlkcyA9IG9iamVjdE9mVGFibGVzWydiaWRzJ10sXG4gICAgICAgICAgICB0cmFkZSA9IG9iamVjdE9mVGFibGVzWydtYXJrZXRIaXN0b3J5J10sXG4gICAgICAgICAgICBvcmRlck9wZW4gPSBvYmplY3RPZlRhYmxlc1snb3Blbk9yZGVycyddLFxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5ID0gb2JqZWN0T2ZUYWJsZXNbJ29yZGVySGlzdG9yeSddO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuV2ViU29ja2V0KSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlNvY2tldC4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGNvbm5lY3Rpb25cbiAgICAgICAgICAgICAvLyAgIHZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbm9kZS5ndWxkZW50cmFkZXIuY29tJyk7XG4gICAgICAgICAgICAgICAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsIHt0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY2ggPSByZXF1aXJlKCcuLi9zZXZpY2VzL2NoYXJ0Jyk7XG5cblxuICAgICAgICAgICAgICAgIHZhciBjaGFydCA9IG5ldyBjaDtcbiAgICAgICAgICAgICAgICBjaGFydC5pbml0KHVzZXIpO1xuICAgICAgICAgICAgICAgIGNoYXJ0LmNyZWF0ZUNoYXJ0KCk7XG5cbiAgICAgICAgICAgICAgICAvL0Nvbm5lY3Rpb24gdG8gdGhlIHJvb21cbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbWFya2V0Jywgeydyb29tJzogcm9vbSwgJ3VzZXJJZCc6IHVzZXIudXNlcklkLCAndXNlcl9oYXNoJzogdXNlci5oYXNofSk7XG5cbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ21hcmtldCcsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1zZ1sndGFibGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFibGUtYmlkcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmlkcy51cGRhdGVWYWx1ZShtc2dbJ2RhdGEnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RhYmxlLWFzayc6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNrLnVwZGF0ZVZhbHVlKG1zZ1snZGF0YSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhcnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cobXNnWydkYXRhJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnN0cmVhbShtc2dbJ2RhdGEnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICB9O1xuXG59XG47XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50U29ja2V0cztcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3Jvb20vc29ja2V0LmlvL3NvY2tldC5qcyIsInZhciBDb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcbnZhciByb29tO1xudmFyIHJvb21zID0gQ29uZmlnWydyb29tcyddO1xudmFyIHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG4vL1NlbGVjdCByb29tIChpZiBVUkwgY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIHJvb20pXG5yb29tcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgaWYgKHBhdGhuYW1lLmluZGV4T2YoZWxlbWVudCkgPj0gMCkge1xuICAgICAgICByb29tID0gZWxlbWVudDtcbiAgICB9XG4gICAgO1xufSk7XG5cblxudmFyIENsaWVudFNvY2tldHMgPSByZXF1aXJlKCcuL3NvY2tldC5pby9zb2NrZXQnKTtcbnZhciBzZXJ2aWNlO1xuXG52YXIgVXNlciA9IHJlcXVpcmUoJy4vc2V2aWNlcy91c2VyJyk7XG4vL1RoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgdXNlciBkYXRhXG52YXIgdXNlcjtcbnZhciBkYXRhSW5mb0VsZW0gPSAkKCcjZGF0YS1pbmZvJyk7XG5cbnZhciBUYWJsZSA9IHJlcXVpcmUoJy4vc2V2aWNlcy90YWJsZScpO1xuXG4vL0VhY2ggb25lIG9mIHRhYmxlcyBjb250YWluIHRoZSBvYmplY3Qgd2l0aCBkYXRhIGFuZCBjb250cm9sIGJ1dHRvbnNcbnZhciBiaWRzVGFibGUsIGFza3NUYWJsZSwgbWFya2V0SGlzdG9yeVRhYmxlLCBvcGVuT3JkZXJzVGFibGUsIG9yZGVySGlzdG9yeVRhYmxlO1xuXG5cbi8vd2hlbiBvdXIgcGFnZSBhcmUgbG9hZGVkLCB3ZSBuZWVkIHRvIGdldCB0aGUgaW5pdCBkYXRhXG4kLmFqYXgoe1xuICAgIHVybDogYmFzZV91cmwgKyBcIm1hcmtldHMvZ2V0X2luaXRfZGF0YS9cIiArIHJvb20gKyBcIi9cIiArICQoXCJkaXZbZGF0YS1zdWlkXVwiKS5hdHRyKCdkYXRhLXN1aWQnKSxcbiAgICB0eXBlOiBcImdldFwiLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIlxufSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIC8vaWYgd2UgZ290IHRoZSByZXNwb25zZSBcbiAgICAgICAgICAgIC8vY3JlYXRlIHRoZSB1c2VyIG9iamVjdFxuICAgICAgICAgICAgdXNlciA9IG5ldyBVc2VyKGpzb25bJ3VzZXInXSwgZGF0YUluZm9FbGVtKTsgIC8vc3RvcmUgdGhlIHVzZXIgZGF0YVxuXG4gICAgICAgICAgICAvL2NoYW5nZSB0aGUgYXZhaWxhYmxlIGN1cnJlbmN5XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHtcbi8vICAgICAgICAgICAgICAgIGZpcnN0Q3VycmVuY3k6IC4uLiAsXG4vLyAgICAgICAgICAgICAgICBzZWNvbmRDdXJyZW5jeTogLi4uXG4vLyAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIuc2V0Q3VycmVuY2llcyhqc29uWyd1c2VyJ10pO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBvYmplY3RzIG9mIHRoZSB0YWJsZXMgYW5kIHNob3cgdGhlaXJcbiAgICAgICAgICAgIGJpZHNUYWJsZSA9IG5ldyBUYWJsZSgnI3RhYmxlLWJpZHMnLCBqc29uWyd0YWJsZXMnXVsndGFibGUtYmlkcyddLCB1c2VyKTtcbiAgICAgICAgICAgIGJpZHNUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBhc2tzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1hc2snLCBqc29uWyd0YWJsZXMnXVsndGFibGUtYXNrJ10sIHVzZXIpO1xuICAgICAgICAgICAgYXNrc1RhYmxlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAgICAgICAgIG1hcmtldEhpc3RvcnlUYWJsZSA9IG5ldyBUYWJsZSgnI21hcmtldC1oaXN0b3J5JywganNvblsndGFibGVzJ11bJ21hcmtldC1oaXN0b3J5J10sIHVzZXIpO1xuICAgICAgICAgICAgbWFya2V0SGlzdG9yeVRhYmxlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAgICAgICAgIG9wZW5PcmRlcnNUYWJsZSA9IG5ldyBUYWJsZSgnI3RhYmxlLW9wZW4nLCBqc29uWyd0YWJsZXMnXVsndGFibGUtb3BlbiddLCB1c2VyKTtcbiAgICAgICAgICAgIG9wZW5PcmRlcnNUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBvcmRlckhpc3RvcnlUYWJsZSA9IG5ldyBUYWJsZSgnI29yZGVyLWhpc3RvcnknLCBqc29uWyd0YWJsZXMnXVsnb3JkZXItaGlzdG9yeSddLCB1c2VyKTtcbiAgICAgICAgICAgIG9yZGVySGlzdG9yeVRhYmxlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBzb2NrZXQgY29ubmVjdGlvblxuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50U29ja2V0cyh7XG4gICAgICAgICAgICAgICAgJ2JpZHMnOiBiaWRzVGFibGUsXG4gICAgICAgICAgICAgICAgJ2Fza3MnOiBhc2tzVGFibGUsXG4gICAgICAgICAgICAgICAgJ21hcmtldEhpc3RvcnknOiBtYXJrZXRIaXN0b3J5VGFibGUsXG4gICAgICAgICAgICAgICAgJ29wZW5PcmRlcnMnOiBvcGVuT3JkZXJzVGFibGUsXG4gICAgICAgICAgICAgICAgJ29yZGVySGlzdG9yeSc6IG9yZGVySGlzdG9yeVRhYmxlXG4gICAgICAgICAgICB9LCB1c2VyKTtcbiAgICAgICAgICAgIHNlcnZpY2Uuc3RhcnQoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiArIGVycm9yVGhyb3duKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoeGhyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUaGUgcmVxdWVzdCBpcyBjb21wbGV0ZSFcIik7XG4gICAgICAgIH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9yb29tL3Jvb20uanMiLCJmdW5jdGlvbiBDaGFydE1hcmtldCgpIHtcbiAgICB2YXIgdXNlcjtcbiAgICB2YXIgZGF0YVRhYmxlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHVzZXJPYmplY3QpIHtcbiAgICAgICAgICAgIHVzZXIgPSB1c2VyT2JqZWN0O1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVDaGFydCgpIHtcbiAgICAgICAgICAgIGFueWNoYXJ0Lm9uRG9jdW1lbnRSZWFkeShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYSBkYXRhIHNldFxuICAgICAgICAgICAgICAgIC8vICAvY2hhcnQvY2FuZGxlL05MRy8zMG1pbnV0ZXNcbiAgICAgICAgICAgICAgICBkYXRhVGFibGUgPSBhbnljaGFydC5kYXRhLnRhYmxlKDApO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY2hhcnQvY2FuZGxlL1wiICsgdXNlci5yb29tICsgXCIvMzBtaW51dGVzXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUYWJsZS5hZGREYXRhKGpzb25bJ2RhdGEnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YVRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiArIGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHJlcXVlc3QgaXMgY29tcGxldGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy9kYXRhID0gYW55Y2hhcnQuZGF0YS5zZXQoW1tEYXRlLlVUQygyMDA3LCA4LCA3KSwgMjIuNzUsIDIzLjcsIDIyLjY5LCAyMy40NF0sIFtEYXRlLlVUQygyMDA3LCA4LCA2KSwgMjMuMDMsIDIzLjE1LCAyMi40NCwgMjIuOTddLCBbRGF0ZS5VVEMoMjAwNywgOCwgMyksIDIzLjIsIDIzLjM5LCAyMi44NywgMjIuOTJdLCBbRGF0ZS5VVEMoMjAwNywgOCwgMiksIDIyLjY1LCAyMy43LCAyMi42NSwgMjMuMzZdLCBbRGF0ZS5VVEMoMjAwNywgOCwgMSksIDIzLjE3LCAyMy40LCAyMi44NSwgMjMuMjVdLCBbRGF0ZS5VVEMoMjAwNywgNywgMzEpLCAyMy44OCwgMjMuOTMsIDIzLjI0LCAyMy4yNV0sIFtEYXRlLlVUQygyMDA3LCA3LCAzMCksIDIzLjU1LCAyMy44OCwgMjMuMzgsIDIzLjYyXSwgW0RhdGUuVVRDKDIwMDcsIDcsIDI3KSwgMjMuOTgsIDI0LjQ5LCAyMy40NywgMjMuNDldLCBbRGF0ZS5VVEMoMjAwNywgNywgMjYpLCAyMy4yLCAyMy4zOSwgMjIuODcsIDIyLjkyXSwgW0RhdGUuVVRDKDIwMDcsIDcsIDI1KSwgMjIuNzUsIDIzLjcsIDIyLjY5LCAyMy40NF0sIFtEYXRlLlVUQygyMDA3LCA3LCAyNCksIDIyLjY1LCAyMy43LCAyMi42NSwgMjMuMzZdLCBbRGF0ZS5VVEMoMjAwNywgNywgMjMpLCAyMy41NSwgMjMuODgsIDIzLjM4LCAyMy42Ml1dKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhIGNoYXJ0XG4gICAgICAgICAgICAgICAgY2hhcnQgPSBhbnljaGFydC5zdG9jaygpO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZpcnN0IHBsb3Qgb24gdGhlIGNoYXJ0XG4gICAgICAgICAgICAgICAgdmFyIHBsb3QgPSBjaGFydC5wbG90KCk7XG5cbiAgICAgICAgICAgICAgICBwbG90LmdyaWQoKS5lbmFibGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIHBsb3QuZ3JpZCgxKS5lbmFibGVkKHRydWUpLmxheW91dCgndmVydGljYWwnKTtcbiAgICAgICAgICAgICAgICBwbG90Lm1pbm9yR3JpZCgpLmVuYWJsZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcGxvdC5taW5vckdyaWQoMSkuZW5hYmxlZCh0cnVlKS5sYXlvdXQoJ3ZlcnRpY2FsJyk7XG5cbiAgICAgICAgICAgICAgICBjaGFydC5zY3JvbGxlcigpLmFyZWEoZGF0YVRhYmxlLm1hcEFzKHtcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogNFxuICAgICAgICAgICAgICAgIH0pKTtcblxuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNoYXJ0IHNlbGVjdGVkIGRhdGUvdGltZSByYW5nZVxuICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdFJhbmdlKCcyMDA3LTA1LTAzJywgJzIwMDctMDUtMjAnKTtcblxuICAgICAgICAgICAgICAgIC8vIG1hcCB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIHZhciBzZXJpZXNEYXRhID0gZGF0YVRhYmxlLm1hcEFzKFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcGVuJzogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGlnaCc6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xvdyc6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Nsb3NlJzogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB7Y29sdW1uOiA0LCB0eXBlOiAnY2xvc2UnfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cblxuICAgICAgICAgICAgICAgIHZhciBzZXJpZXMgPSBwbG90LmNhbmRsZXN0aWNrKHNlcmllc0RhdGEpLm5hbWUoJ1RpbWVsaW5lJyk7XG4gICAgICAgICAgICAgICAgc2VyaWVzLmxlZ2VuZEl0ZW0oKS5pY29uVHlwZSgncmlzaW5nZmFsbGluZycpO1xuICAgICAgICAgICAgICAgIGNoYXJ0LmNvbnRhaW5lcihcImNvbnRhaW5lcl9jaGFydFwiKS5kcmF3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJlYW06IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgICAgIGFycmF5LnB1c2gobmV3RGF0YSk7XG4gICAgICAgICAgICBkYXRhVGFibGUuYWRkRGF0YShhcnJheSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0TWFya2V0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9yb29tL3NldmljZXMvY2hhcnQuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaQTtBQUNBO0FBbUJBOzs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBWEE7QUFhQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFaQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7OztBQUFBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkZBO0FBc0ZBO0FBQ0E7QUFHQTs7Ozs7O0FDNVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxCQTtBQW9CQTtBQUNBO0FBRUE7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeEJBO0FBMEJBO0FBRUE7QUFDQTtBQUNBO0FBckRBO0FBd0RBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7Ozs7OztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJFQTtBQXVFQTtBQUNBO0FBQ0E7OztBIiwic291cmNlUm9vdCI6IiJ9