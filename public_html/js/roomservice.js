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
    var firstPageInTable = 1; //The number of first page of the records that is saving
    var tableLength = object['count']; //MAX count of the records in this table /on the server

    var countOfRows = tableValue.length < k ? tableValue.length : k;
    //MAX count of the records in the tables    
    var pageNumber = 1; //Page of the table that is showing on the site
    var pageCount = Math.round(tableLength / countOfRows);
    //Calc the count of the pages 

    //Update the count of the pages
    function setNewPageCount() {
        pageCount = Math.round(tableLength / countOfRows);
    }
    ;

    //Download the records of the table via AJAX
    //  'fromNumber' - from which number the records are requested,
    //  'button'     - which function is calling this request 
    function downloadNext(fromNumber, button) {
        //for 'first', 'last' or 'update' we're going to update the all table
        //for the rest only 20 records
        var countForLoaded = button === 'first' || button === 'last' || button === 'update' ? 50 : 2 * k;
        $.ajax({
            url: "http://localhost:7777/get_next_records",
            data: {
                'fromNumber': fromNumber, //from which number the records are requested
                'count': countForLoaded, //how many records are requested
                'room': user['room'], //this is the room where a user is logging,
                'table': tableID //the ID of the table whose records are requested,
            },
            type: "post",
            dataType: "json"
        })
        //if AJAX POST request  is successful
        .done(function (json) {
            if (button === 'next') {
                tableValue.splice(0, 2 * k); //remove the unnecessary records
                tableValue.push.apply(tableValue, json['value']); // add new from the response
            } else {
                if (button === 'previous') {
                    tableValue.splice(20, 3 * k); //remove the unnecessary records
                    var arr2 = json['value'].slice(); // add new from the response
                    arr2.push.apply(arr2, tableValue);
                    tableValue = arr2;

                    if (firstPageInTable > 2) //update the firstPageInTable
                        firstPageInTable = firstPageInTable - 2;
                } else {
                    if (button === 'first') {
                        firstPageInTable = 1; //update the firstPageInTable
                        tableValue = json['value']; //update the tableValue
                    } else {
                        if (button === 'last' || button === 'update') {
                            tableValue = json['value']; //update the tableValue
                        }
                    }
                }
                ;
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

    //Create the pagination for this table
    function createPagination() {
        //Add the HTML structure
        $('#' + tableID).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='previous'>previous</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        //Add the EventListeners for the control buttons
        $('#' + tableID).find('.first').on('click', function () {
            if (pageNumber >= 3 && tableLength > 50) {
                //if we need to update the tableValue
                pageNumber = 1;
                downloadNext(1, 'first'); //load the records
            } else {
                pageNumber = 1;
                changePageView();
            }
        });

        $('#' + tableID).find('.next').on('click', function () {
            if (pageNumber < pageCount - 1) {
                pageNumber++;
                if (pageNumber > 3 && tableLength > 50) {
                    //if we need to update the tableValue
                    if ((pageNumber - 2) % 2 === 0) {
                        firstPageInTable = firstPageInTable + 2;
                        downloadNext(k * (pageNumber + 1) + 1, 'next'); //load the records
                    } else {
                        changePageView();
                    }
                } else changePageView();
            } else {
                if (pageNumber === pageCount - 1) {
                    pageNumber++;
                    changePageView();
                }
            }
            ;
        });

        $('#' + tableID).find('.previous').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                if (pageNumber > 2 && pageNumber + 1 < pageCount && tableLength > 50) {
                    if ((pageNumber - 1) % 2 === 0) {
                        downloadNext(k * (pageNumber - 3) + 1, 'previous'); //load the records
                    } else changePageView();
                } else {
                    changePageView();
                }
                ;
            }
        });

        $('#' + tableID).find('.last').on('click', function () {
            if (pageNumber + 2 >= pageCount && tableLength > 50) {
                pageNumber = pageCount;
                changePageView();
            } else {
                pageNumber = pageCount;
                //Update the firstPageInTable
                if (pageNumber % 2 === 0) firstPageInTable = pageCount - 3;else firstPageInTable = pageNumber - 2;

                downloadNext(k * (firstPageInTable - 1) + 1, 'last'); //load the records
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
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
        updateTable();
    }
    ;

    //update the values in the table which are shown 
    function updateTable() {
        var row = ''; //the new row <tr> of the table
        for (var i = 0; i < countOfRows; i++) {
            //for all rows of the table
            //Get the current row
            var rowOfTable = $(table).find('tr:eq( ' + i + ')');
            row = '<tr>';
            //if necessary record exist in the table
            if (tableValue[i + k * (pageNumber - firstPageInTable)]) {
                //the loop by keys
                for (var key in keys) {
                    //add column with data
                    var templ = parseFloat(tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]]);
                    if (templ && keys[key] !== 'Date') row += '<td>' + templ.toFixed(8) + '</td>';else {
                        row += '<td>' + tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]] + '</td>';
                    }
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
            var row = ''; // the row of the table
            var rowTemplate = ''; // the body of the table
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    // console.log(tableValue[i][keys[key]]);
                    var templ = parseFloat(tableValue[i][keys[key]]);
                    if (templ && keys[key] !== 'Date') row += '<td>' + templ.toFixed(8) + '</td>';else {
                        row += '<td>' + tableValue[i][keys[key]] + '</td>';
                    }
                }
                row += '</tr>';
                rowTemplate += row;
            }
            //Add HTML template to page
            $(table).html('').append(rowTemplate);

            if (countOfRows < tableLength) {
                createPagination();
            }
        },

        //Update the values of tableValue and change the records which are shown
        updateValue: function (object) {
            //if updated data have came when we save the first 5 pages
            if (firstPageInTable === 1) {
                var value = object['first'];
                tableLength = object['count'];
                setNewPageCount();

                tableValue = value;

                if (countOfRows <= tableLength) {
                    if ($('#' + tableID).find('.paginnation').length === 0) createPagination();
                    countOfRows = k;
                } else {
                    deletePagination();
                }
                ;
                changePageView();
            } else {
                downloadNext(k * (firstPageInTable - 1) + 1, 'update');
                setNewPageCount();
                changePageView();
            }
        }
    };
};

module.exports = Table;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var User = function (data) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var firstCurrency = data['firstCurrency'] || 0;
    var secondCurrency = data['secondCurrency'] || 0;

    function updateValueOfCurrences() {
        $('#availableFirst').html(firstCurrency);
        $('#availableSecond').html(secondCurrency);
    };

    return {
        userId: user_id,
        room: activeRoom,
        firstCurrency: firstCurrency,
        secondCurrency: secondCurrency,

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
    var io = __webpack_require__(6);

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

            var ch = __webpack_require__(5);

            socket.on('connect', function () {

                var chart = new ch();

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
    user = new User(json['user']); //store the user data

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
    service();
}).fail(function (xhr, status, errorThrown) {
    console.error("Error: " + errorThrown);
}).always(function (xhr, status) {
    //console.log("The request is complete!");
});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function ChartMarket() {
    var dataTable;

    anychart.onDocumentReady(function () {

        // create a data set
        //  /chart/candle/NLG/30minutes
        dataTable = anychart.data.table();
        $.ajax({
            url: "/chart/candle/EUR-NLG/30minutes",
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

        chart.container("container_chart");
        chart.draw();
    });

    return {
        stream: function (newData) {
            console.log(newData);
            data.append(newData);
        }
    };
}

module.exports = ChartMarket;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

!function (t, e) {
   true ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e();
}(this, function () {
  return function (t) {
    function e(n) {
      if (r[n]) return r[n].exports;var o = r[n] = { exports: {}, id: n, loaded: !1 };return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
    }var r = {};return e.m = t, e.c = r, e.p = "", e(0);
  }([function (t, e, r) {
    "use strict";
    function n(t, e) {
      "object" === ("undefined" == typeof t ? "undefined" : i(t)) && (e = t, t = void 0), e = e || {};var r,
          n = s(t),
          a = n.source,
          p = n.id,
          f = n.path,
          l = h[p] && f in h[p].nsps,
          d = e.forceNew || e["force new connection"] || !1 === e.multiplex || l;return d ? (u("ignoring socket cache for %s", a), r = c(a, e)) : (h[p] || (u("new io instance for %s", a), h[p] = c(a, e)), r = h[p]), n.query && !e.query ? e.query = n.query : e && "object" === i(e.query) && (e.query = o(e.query)), r.socket(n.path, e);
    }function o(t) {
      var e = [];for (var r in t) t.hasOwnProperty(r) && e.push(encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));return e.join("&");
    }var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    },
        s = r(1),
        a = r(7),
        c = r(17),
        u = r(3)("socket.io-client");t.exports = e = n;var h = e.managers = {};e.protocol = a.protocol, e.connect = n, e.Manager = r(17), e.Socket = r(44);
  }, function (t, e, r) {
    (function (e) {
      "use strict";
      function n(t, r) {
        var n = t;r = r || e.location, null == t && (t = r.protocol + "//" + r.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? r.protocol + t : r.host + t), /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof r ? r.protocol + "//" + t : "https://" + t), i("parse %s", t), n = o(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";var s = n.host.indexOf(":") !== -1,
            a = s ? "[" + n.host + "]" : n.host;return n.id = n.protocol + "://" + a + ":" + n.port, n.href = n.protocol + "://" + a + (r && r.port === n.port ? "" : ":" + n.port), n;
      }var o = r(2),
          i = r(3)("socket.io-client:url");t.exports = n;
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {
    var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];t.exports = function (t) {
      var e = t,
          o = t.indexOf("["),
          i = t.indexOf("]");o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));for (var s = r.exec(t || ""), a = {}, c = 14; c--;) a[n[c]] = s[c] || "";return o != -1 && i != -1 && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a;
    };
  }, function (t, e, r) {
    (function (n) {
      function o() {
        return "undefined" != typeof document && "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
      }function i() {
        var t = arguments,
            r = this.useColors;if (t[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + t[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !r) return t;var n = "color: " + this.color;t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));var o = 0,
            i = 0;return t[0].replace(/%[a-z%]/g, function (t) {
          "%%" !== t && (o++, "%c" === t && (i = o));
        }), t.splice(i, 0, n), t;
      }function s() {
        return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
      }function a(t) {
        try {
          null == t ? e.storage.removeItem("debug") : e.storage.debug = t;
        } catch (t) {}
      }function c() {
        try {
          return e.storage.debug;
        } catch (t) {}if ("undefined" != typeof n && "env" in n) return n.env.DEBUG;
      }function u() {
        try {
          return window.localStorage;
        } catch (t) {}
      }e = t.exports = r(5), e.log = s, e.formatArgs = i, e.save = a, e.load = c, e.useColors = o, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : u(), e.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], e.formatters.j = function (t) {
        try {
          return JSON.stringify(t);
        } catch (t) {
          return "[UnexpectedJSONParseError]: " + t.message;
        }
      }, e.enable(c());
    }).call(e, r(4));
  }, function (t, e) {
    function r() {
      throw new Error("setTimeout has not been defined");
    }function n() {
      throw new Error("clearTimeout has not been defined");
    }function o(t) {
      if (h === setTimeout) return setTimeout(t, 0);if ((h === r || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);try {
        return h(t, 0);
      } catch (e) {
        try {
          return h.call(null, t, 0);
        } catch (e) {
          return h.call(this, t, 0);
        }
      }
    }function i(t) {
      if (p === clearTimeout) return clearTimeout(t);if ((p === n || !p) && clearTimeout) return p = clearTimeout, clearTimeout(t);try {
        return p(t);
      } catch (e) {
        try {
          return p.call(null, t);
        } catch (e) {
          return p.call(this, t);
        }
      }
    }function s() {
      y && l && (y = !1, l.length ? d = l.concat(d) : g = -1, d.length && a());
    }function a() {
      if (!y) {
        var t = o(s);y = !0;for (var e = d.length; e;) {
          for (l = d, d = []; ++g < e;) l && l[g].run();g = -1, e = d.length;
        }l = null, y = !1, i(t);
      }
    }function c(t, e) {
      this.fun = t, this.array = e;
    }function u() {}var h,
        p,
        f = t.exports = {};!function () {
      try {
        h = "function" == typeof setTimeout ? setTimeout : r;
      } catch (t) {
        h = r;
      }try {
        p = "function" == typeof clearTimeout ? clearTimeout : n;
      } catch (t) {
        p = n;
      }
    }();var l,
        d = [],
        y = !1,
        g = -1;f.nextTick = function (t) {
      var e = new Array(arguments.length - 1);if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];d.push(new c(t, e)), 1 !== d.length || y || o(a);
    }, c.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = u, f.addListener = u, f.once = u, f.off = u, f.removeListener = u, f.removeAllListeners = u, f.emit = u, f.binding = function (t) {
      throw new Error("process.binding is not supported");
    }, f.cwd = function () {
      return "/";
    }, f.chdir = function (t) {
      throw new Error("process.chdir is not supported");
    }, f.umask = function () {
      return 0;
    };
  }, function (t, e, r) {
    function n() {
      return e.colors[h++ % e.colors.length];
    }function o(t) {
      function r() {}function o() {
        var t = o,
            r = +new Date(),
            i = r - (u || r);t.diff = i, t.prev = u, t.curr = r, u = r, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = n());for (var s = new Array(arguments.length), a = 0; a < s.length; a++) s[a] = arguments[a];s[0] = e.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));var c = 0;s[0] = s[0].replace(/%([a-z%])/g, function (r, n) {
          if ("%%" === r) return r;c++;var o = e.formatters[n];if ("function" == typeof o) {
            var i = s[c];r = o.call(t, i), s.splice(c, 1), c--;
          }return r;
        }), s = e.formatArgs.apply(t, s);var h = o.log || e.log || console.log.bind(console);h.apply(t, s);
      }r.enabled = !1, o.enabled = !0;var i = e.enabled(t) ? o : r;return i.namespace = t, i;
    }function i(t) {
      e.save(t);for (var r = (t || "").split(/[\s,]+/), n = r.length, o = 0; o < n; o++) r[o] && (t = r[o].replace(/[\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")));
    }function s() {
      e.enable("");
    }function a(t) {
      var r, n;for (r = 0, n = e.skips.length; r < n; r++) if (e.skips[r].test(t)) return !1;for (r = 0, n = e.names.length; r < n; r++) if (e.names[r].test(t)) return !0;return !1;
    }function c(t) {
      return t instanceof Error ? t.stack || t.message : t;
    }e = t.exports = o.debug = o, e.coerce = c, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(6), e.names = [], e.skips = [], e.formatters = {};var u,
        h = 0;
  }, function (t, e) {
    function r(t) {
      if (t = String(t), !(t.length > 1e4)) {
        var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if (e) {
          var r = parseFloat(e[1]),
              n = (e[2] || "ms").toLowerCase();switch (n) {case "years":case "year":case "yrs":case "yr":case "y":
              return r * h;case "days":case "day":case "d":
              return r * u;case "hours":case "hour":case "hrs":case "hr":case "h":
              return r * c;case "minutes":case "minute":case "mins":case "min":case "m":
              return r * a;case "seconds":case "second":case "secs":case "sec":case "s":
              return r * s;case "milliseconds":case "millisecond":case "msecs":case "msec":case "ms":
              return r;default:
              return;}
        }
      }
    }function n(t) {
      return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms";
    }function o(t) {
      return i(t, u, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms";
    }function i(t, e, r) {
      if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s";
    }var s = 1e3,
        a = 60 * s,
        c = 60 * a,
        u = 24 * c,
        h = 365.25 * u;t.exports = function (t, e) {
      e = e || {};var i = typeof t;if ("string" === i && t.length > 0) return r(t);if ("number" === i && isNaN(t) === !1) return e.long ? o(t) : n(t);throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t));
    };
  }, function (t, e, r) {
    function n() {}function o(t) {
      var r = "",
          n = !1;return r += t.type, e.BINARY_EVENT != t.type && e.BINARY_ACK != t.type || (r += t.attachments, r += "-"), t.nsp && "/" != t.nsp && (n = !0, r += t.nsp), null != t.id && (n && (r += ",", n = !1), r += t.id), null != t.data && (n && (r += ","), r += f.stringify(t.data)), p("encoded %j as %s", t, r), r;
    }function i(t, e) {
      function r(t) {
        var r = d.deconstructPacket(t),
            n = o(r.packet),
            i = r.buffers;i.unshift(n), e(i);
      }d.removeBlobs(t, r);
    }function s() {
      this.reconstructor = null;
    }function a(t) {
      var r = {},
          n = 0;if (r.type = Number(t.charAt(0)), null == e.types[r.type]) return h();if (e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type) {
        for (var o = ""; "-" != t.charAt(++n) && (o += t.charAt(n), n != t.length););if (o != Number(o) || "-" != t.charAt(n)) throw new Error("Illegal attachments");r.attachments = Number(o);
      }if ("/" == t.charAt(n + 1)) for (r.nsp = ""; ++n;) {
        var i = t.charAt(n);if ("," == i) break;if (r.nsp += i, n == t.length) break;
      } else r.nsp = "/";var s = t.charAt(n + 1);if ("" !== s && Number(s) == s) {
        for (r.id = ""; ++n;) {
          var i = t.charAt(n);if (null == i || Number(i) != i) {
            --n;break;
          }if (r.id += t.charAt(n), n == t.length) break;
        }r.id = Number(r.id);
      }return t.charAt(++n) && (r = c(r, t.substr(n))), p("decoded %s as %j", t, r), r;
    }function c(t, e) {
      try {
        t.data = f.parse(e);
      } catch (t) {
        return h();
      }return t;
    }function u(t) {
      this.reconPack = t, this.buffers = [];
    }function h(t) {
      return { type: e.ERROR, data: "parser error" };
    }var p = r(8)("socket.io-parser"),
        f = r(11),
        l = r(13),
        d = r(14),
        y = r(16);e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = n, e.Decoder = s, n.prototype.encode = function (t, r) {
      if (p("encoding packet %j", t), e.BINARY_EVENT == t.type || e.BINARY_ACK == t.type) i(t, r);else {
        var n = o(t);r([n]);
      }
    }, l(s.prototype), s.prototype.add = function (t) {
      var r;if ("string" == typeof t) r = a(t), e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type ? (this.reconstructor = new u(r), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", r)) : this.emit("decoded", r);else {
        if (!y(t) && !t.base64) throw new Error("Unknown type: " + t);if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");r = this.reconstructor.takeBinaryData(t), r && (this.reconstructor = null, this.emit("decoded", r));
      }
    }, s.prototype.destroy = function () {
      this.reconstructor && this.reconstructor.finishedReconstruction();
    }, u.prototype.takeBinaryData = function (t) {
      if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
        var e = d.reconstructPacket(this.reconPack, this.buffers);return this.finishedReconstruction(), e;
      }return null;
    }, u.prototype.finishedReconstruction = function () {
      this.reconPack = null, this.buffers = [];
    };
  }, function (t, e, r) {
    function n() {
      return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
    }function o() {
      var t = arguments,
          r = this.useColors;if (t[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + t[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !r) return t;var n = "color: " + this.color;t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));var o = 0,
          i = 0;return t[0].replace(/%[a-z%]/g, function (t) {
        "%%" !== t && (o++, "%c" === t && (i = o));
      }), t.splice(i, 0, n), t;
    }function i() {
      return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }function s(t) {
      try {
        null == t ? e.storage.removeItem("debug") : e.storage.debug = t;
      } catch (t) {}
    }function a() {
      var t;try {
        t = e.storage.debug;
      } catch (t) {}return t;
    }function c() {
      try {
        return window.localStorage;
      } catch (t) {}
    }e = t.exports = r(9), e.log = i, e.formatArgs = o, e.save = s, e.load = a, e.useColors = n, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : c(), e.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], e.formatters.j = function (t) {
      return JSON.stringify(t);
    }, e.enable(a());
  }, function (t, e, r) {
    function n() {
      return e.colors[h++ % e.colors.length];
    }function o(t) {
      function r() {}function o() {
        var t = o,
            r = +new Date(),
            i = r - (u || r);t.diff = i, t.prev = u, t.curr = r, u = r, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = n());var s = Array.prototype.slice.call(arguments);s[0] = e.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));var a = 0;s[0] = s[0].replace(/%([a-z%])/g, function (r, n) {
          if ("%%" === r) return r;a++;var o = e.formatters[n];if ("function" == typeof o) {
            var i = s[a];r = o.call(t, i), s.splice(a, 1), a--;
          }return r;
        }), "function" == typeof e.formatArgs && (s = e.formatArgs.apply(t, s));var c = o.log || e.log || console.log.bind(console);c.apply(t, s);
      }r.enabled = !1, o.enabled = !0;var i = e.enabled(t) ? o : r;return i.namespace = t, i;
    }function i(t) {
      e.save(t);for (var r = (t || "").split(/[\s,]+/), n = r.length, o = 0; o < n; o++) r[o] && (t = r[o].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")));
    }function s() {
      e.enable("");
    }function a(t) {
      var r, n;for (r = 0, n = e.skips.length; r < n; r++) if (e.skips[r].test(t)) return !1;for (r = 0, n = e.names.length; r < n; r++) if (e.names[r].test(t)) return !0;return !1;
    }function c(t) {
      return t instanceof Error ? t.stack || t.message : t;
    }e = t.exports = o, e.coerce = c, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(10), e.names = [], e.skips = [], e.formatters = {};var u,
        h = 0;
  }, function (t, e) {
    function r(t) {
      if (t = "" + t, !(t.length > 1e4)) {
        var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if (e) {
          var r = parseFloat(e[1]),
              n = (e[2] || "ms").toLowerCase();switch (n) {case "years":case "year":case "yrs":case "yr":case "y":
              return r * h;case "days":case "day":case "d":
              return r * u;case "hours":case "hour":case "hrs":case "hr":case "h":
              return r * c;case "minutes":case "minute":case "mins":case "min":case "m":
              return r * a;case "seconds":case "second":case "secs":case "sec":case "s":
              return r * s;case "milliseconds":case "millisecond":case "msecs":case "msec":case "ms":
              return r;}
        }
      }
    }function n(t) {
      return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms";
    }function o(t) {
      return i(t, u, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms";
    }function i(t, e, r) {
      if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s";
    }var s = 1e3,
        a = 60 * s,
        c = 60 * a,
        u = 24 * c,
        h = 365.25 * u;t.exports = function (t, e) {
      return e = e || {}, "string" == typeof t ? r(t) : e.long ? o(t) : n(t);
    };
  }, function (t, e, r) {
    (function (t, r) {
      var n = !1;(function () {
        function o(t, e) {
          function r(t) {
            if (r[t] !== g) return r[t];var o;if ("bug-string-char-index" == t) o = "a" != "a"[0];else if ("json" == t) o = r("json-stringify") && r("json-parse");else {
              var s,
                  a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if ("json-stringify" == t) {
                var c = e.stringify,
                    h = "function" == typeof c && b;if (h) {
                  (s = function () {
                    return 1;
                  }).toJSON = s;try {
                    h = "0" === c(0) && "0" === c(new n()) && '""' == c(new i()) && c(v) === g && c(g) === g && c() === g && "1" === c(s) && "[1]" == c([s]) && "[null]" == c([g]) && "null" == c(null) && "[null,null,null]" == c([g, v, null]) && c({ a: [s, !0, !1, null, "\0\b\n\f\r\t"] }) == a && "1" === c(null, s) && "[\n 1,\n 2\n]" == c([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new u(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == c(new u(864e13)) && '"-000001-01-01T00:00:00.000Z"' == c(new u(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == c(new u(-1));
                  } catch (t) {
                    h = !1;
                  }
                }o = h;
              }if ("json-parse" == t) {
                var p = e.parse;if ("function" == typeof p) try {
                  if (0 === p("0") && !p(!1)) {
                    s = p(a);var f = 5 == s.a.length && 1 === s.a[0];if (f) {
                      try {
                        f = !p('"\t"');
                      } catch (t) {}if (f) try {
                        f = 1 !== p("01");
                      } catch (t) {}if (f) try {
                        f = 1 !== p("1.");
                      } catch (t) {}
                    }
                  }
                } catch (t) {
                  f = !1;
                }o = f;
              }
            }return r[t] = !!o;
          }t || (t = c.Object()), e || (e = c.Object());var n = t.Number || c.Number,
              i = t.String || c.String,
              a = t.Object || c.Object,
              u = t.Date || c.Date,
              h = t.SyntaxError || c.SyntaxError,
              p = t.TypeError || c.TypeError,
              f = t.Math || c.Math,
              l = t.JSON || c.JSON;"object" == typeof l && l && (e.stringify = l.stringify, e.parse = l.parse);var d,
              y,
              g,
              m = a.prototype,
              v = m.toString,
              b = new u(-0xc782b5b800cec);try {
            b = b.getUTCFullYear() == -109252 && 0 === b.getUTCMonth() && 1 === b.getUTCDate() && 10 == b.getUTCHours() && 37 == b.getUTCMinutes() && 6 == b.getUTCSeconds() && 708 == b.getUTCMilliseconds();
          } catch (t) {}if (!r("json")) {
            var w = "[object Function]",
                k = "[object Date]",
                x = "[object Number]",
                A = "[object String]",
                C = "[object Array]",
                B = "[object Boolean]",
                S = r("bug-string-char-index");if (!b) var T = f.floor,
                E = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                _ = function (t, e) {
              return E[e] + 365 * (t - 1970) + T((t - 1969 + (e = +(e > 1))) / 4) - T((t - 1901 + e) / 100) + T((t - 1601 + e) / 400);
            };if ((d = m.hasOwnProperty) || (d = function (t) {
              var e,
                  r = {};return (r.__proto__ = null, r.__proto__ = { toString: 1 }, r).toString != v ? d = function (t) {
                var e = this.__proto__,
                    r = t in (this.__proto__ = null, this);return this.__proto__ = e, r;
              } : (e = r.constructor, d = function (t) {
                var r = (this.constructor || e).prototype;return t in this && !(t in r && this[t] === r[t]);
              }), r = null, d.call(this, t);
            }), y = function (t, e) {
              var r,
                  n,
                  o,
                  i = 0;(r = function () {
                this.valueOf = 0;
              }).prototype.valueOf = 0, n = new r();for (o in n) d.call(n, o) && i++;return r = n = null, i ? y = 2 == i ? function (t, e) {
                var r,
                    n = {},
                    o = v.call(t) == w;for (r in t) o && "prototype" == r || d.call(n, r) || !(n[r] = 1) || !d.call(t, r) || e(r);
              } : function (t, e) {
                var r,
                    n,
                    o = v.call(t) == w;for (r in t) o && "prototype" == r || !d.call(t, r) || (n = "constructor" === r) || e(r);(n || d.call(t, r = "constructor")) && e(r);
              } : (n = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], y = function (t, e) {
                var r,
                    o,
                    i = v.call(t) == w,
                    a = !i && "function" != typeof t.constructor && s[typeof t.hasOwnProperty] && t.hasOwnProperty || d;for (r in t) i && "prototype" == r || !a.call(t, r) || e(r);for (o = n.length; r = n[--o]; a.call(t, r) && e(r));
              }), y(t, e);
            }, !r("json-stringify")) {
              var N = { 92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t" },
                  j = "000000",
                  O = function (t, e) {
                return (j + (e || 0)).slice(-t);
              },
                  P = "\\u00",
                  R = function (t) {
                for (var e = '"', r = 0, n = t.length, o = !S || n > 10, i = o && (S ? t.split("") : t); r < n; r++) {
                  var s = t.charCodeAt(r);switch (s) {case 8:case 9:case 10:case 12:case 13:case 34:case 92:
                      e += N[s];break;default:
                      if (s < 32) {
                        e += P + O(2, s.toString(16));break;
                      }e += o ? i[r] : t.charAt(r);}
                }return e + '"';
              },
                  D = function (t, e, r, n, o, i, s) {
                var a, c, u, h, f, l, m, b, w, S, E, N, j, P, q, U;try {
                  a = e[t];
                } catch (t) {}if ("object" == typeof a && a) if (c = v.call(a), c != k || d.call(a, "toJSON")) "function" == typeof a.toJSON && (c != x && c != A && c != C || d.call(a, "toJSON")) && (a = a.toJSON(t));else if (a > -1 / 0 && a < 1 / 0) {
                  if (_) {
                    for (f = T(a / 864e5), u = T(f / 365.2425) + 1970 - 1; _(u + 1, 0) <= f; u++);for (h = T((f - _(u, 0)) / 30.42); _(u, h + 1) <= f; h++);f = 1 + f - _(u, h), l = (a % 864e5 + 864e5) % 864e5, m = T(l / 36e5) % 24, b = T(l / 6e4) % 60, w = T(l / 1e3) % 60, S = l % 1e3;
                  } else u = a.getUTCFullYear(), h = a.getUTCMonth(), f = a.getUTCDate(), m = a.getUTCHours(), b = a.getUTCMinutes(), w = a.getUTCSeconds(), S = a.getUTCMilliseconds();a = (u <= 0 || u >= 1e4 ? (u < 0 ? "-" : "+") + O(6, u < 0 ? -u : u) : O(4, u)) + "-" + O(2, h + 1) + "-" + O(2, f) + "T" + O(2, m) + ":" + O(2, b) + ":" + O(2, w) + "." + O(3, S) + "Z";
                } else a = null;if (r && (a = r.call(e, t, a)), null === a) return "null";if (c = v.call(a), c == B) return "" + a;if (c == x) return a > -1 / 0 && a < 1 / 0 ? "" + a : "null";if (c == A) return R("" + a);if ("object" == typeof a) {
                  for (P = s.length; P--;) if (s[P] === a) throw p();if (s.push(a), E = [], q = i, i += o, c == C) {
                    for (j = 0, P = a.length; j < P; j++) N = D(j, a, r, n, o, i, s), E.push(N === g ? "null" : N);U = E.length ? o ? "[\n" + i + E.join(",\n" + i) + "\n" + q + "]" : "[" + E.join(",") + "]" : "[]";
                  } else y(n || a, function (t) {
                    var e = D(t, a, r, n, o, i, s);e !== g && E.push(R(t) + ":" + (o ? " " : "") + e);
                  }), U = E.length ? o ? "{\n" + i + E.join(",\n" + i) + "\n" + q + "}" : "{" + E.join(",") + "}" : "{}";return s.pop(), U;
                }
              };e.stringify = function (t, e, r) {
                var n, o, i, a;if (s[typeof e] && e) if ((a = v.call(e)) == w) o = e;else if (a == C) {
                  i = {};for (var c, u = 0, h = e.length; u < h; c = e[u++], a = v.call(c), (a == A || a == x) && (i[c] = 1));
                }if (r) if ((a = v.call(r)) == x) {
                  if ((r -= r % 1) > 0) for (n = "", r > 10 && (r = 10); n.length < r; n += " ");
                } else a == A && (n = r.length <= 10 ? r : r.slice(0, 10));return D("", (c = {}, c[""] = t, c), o, i, n, "", []);
              };
            }if (!r("json-parse")) {
              var q,
                  U,
                  M = i.fromCharCode,
                  L = { 92: "\\", 34: '"', 47: "/", 98: "\b", 116: "\t", 110: "\n", 102: "\f", 114: "\r" },
                  I = function () {
                throw q = U = null, h();
              },
                  H = function () {
                for (var t, e, r, n, o, i = U, s = i.length; q < s;) switch (o = i.charCodeAt(q)) {case 9:case 10:case 13:case 32:
                    q++;break;case 123:case 125:case 91:case 93:case 58:case 44:
                    return t = S ? i.charAt(q) : i[q], q++, t;case 34:
                    for (t = "@", q++; q < s;) if (o = i.charCodeAt(q), o < 32) I();else if (92 == o) switch (o = i.charCodeAt(++q)) {case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                        t += L[o], q++;break;case 117:
                        for (e = ++q, r = q + 4; q < r; q++) o = i.charCodeAt(q), o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || I();t += M("0x" + i.slice(e, q));break;default:
                        I();} else {
                      if (34 == o) break;for (o = i.charCodeAt(q), e = q; o >= 32 && 92 != o && 34 != o;) o = i.charCodeAt(++q);t += i.slice(e, q);
                    }if (34 == i.charCodeAt(q)) return q++, t;I();default:
                    if (e = q, 45 == o && (n = !0, o = i.charCodeAt(++q)), o >= 48 && o <= 57) {
                      for (48 == o && (o = i.charCodeAt(q + 1), o >= 48 && o <= 57) && I(), n = !1; q < s && (o = i.charCodeAt(q), o >= 48 && o <= 57); q++);if (46 == i.charCodeAt(q)) {
                        for (r = ++q; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++);r == q && I(), q = r;
                      }if (o = i.charCodeAt(q), 101 == o || 69 == o) {
                        for (o = i.charCodeAt(++q), 43 != o && 45 != o || q++, r = q; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++);r == q && I(), q = r;
                      }return +i.slice(e, q);
                    }if (n && I(), "true" == i.slice(q, q + 4)) return q += 4, !0;if ("false" == i.slice(q, q + 5)) return q += 5, !1;if ("null" == i.slice(q, q + 4)) return q += 4, null;I();}return "$";
              },
                  z = function (t) {
                var e, r;if ("$" == t && I(), "string" == typeof t) {
                  if ("@" == (S ? t.charAt(0) : t[0])) return t.slice(1);if ("[" == t) {
                    for (e = []; t = H(), "]" != t; r || (r = !0)) r && ("," == t ? (t = H(), "]" == t && I()) : I()), "," == t && I(), e.push(z(t));return e;
                  }if ("{" == t) {
                    for (e = {}; t = H(), "}" != t; r || (r = !0)) r && ("," == t ? (t = H(), "}" == t && I()) : I()), "," != t && "string" == typeof t && "@" == (S ? t.charAt(0) : t[0]) && ":" == H() || I(), e[t.slice(1)] = z(H());return e;
                  }I();
                }return t;
              },
                  J = function (t, e, r) {
                var n = X(t, e, r);n === g ? delete t[e] : t[e] = n;
              },
                  X = function (t, e, r) {
                var n,
                    o = t[e];if ("object" == typeof o && o) if (v.call(o) == C) for (n = o.length; n--;) J(o, n, r);else y(o, function (t) {
                  J(o, t, r);
                });return r.call(t, e, o);
              };e.parse = function (t, e) {
                var r, n;return q = 0, U = "" + t, r = z(H()), "$" != H() && I(), q = U = null, e && v.call(e) == w ? X((n = {}, n[""] = r, n), "", e) : r;
              };
            }
          }return e.runInContext = o, e;
        }var i = "function" == typeof n && n.amd,
            s = { function: !0, object: !0 },
            a = s[typeof e] && e && !e.nodeType && e,
            c = s[typeof window] && window || this,
            u = a && s[typeof t] && t && !t.nodeType && "object" == typeof r && r;if (!u || u.global !== u && u.window !== u && u.self !== u || (c = u), a && !i) o(c, a);else {
          var h = c.JSON,
              p = c.JSON3,
              f = !1,
              l = o(c, c.JSON3 = { noConflict: function () {
              return f || (f = !0, c.JSON = h, c.JSON3 = p, h = p = null), l;
            } });c.JSON = { parse: l.parse, stringify: l.stringify };
        }i && n(function () {
          return l;
        });
      }).call(this);
    }).call(e, r(12)(t), function () {
      return this;
    }());
  }, function (t, e) {
    t.exports = function (t) {
      return t.webpackPolyfill || (t.deprecate = function () {}, t.paths = [], t.children = [], t.webpackPolyfill = 1), t;
    };
  }, function (t, e) {
    function r(t) {
      if (t) return n(t);
    }function n(t) {
      for (var e in r.prototype) t[e] = r.prototype[e];return t;
    }t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
      return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this;
    }, r.prototype.once = function (t, e) {
      function r() {
        n.off(t, r), e.apply(this, arguments);
      }var n = this;return this._callbacks = this._callbacks || {}, r.fn = e, this.on(t, r), this;
    }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
      if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;var r = this._callbacks[t];if (!r) return this;if (1 == arguments.length) return delete this._callbacks[t], this;for (var n, o = 0; o < r.length; o++) if (n = r[o], n === e || n.fn === e) {
        r.splice(o, 1);break;
      }return this;
    }, r.prototype.emit = function (t) {
      this._callbacks = this._callbacks || {};var e = [].slice.call(arguments, 1),
          r = this._callbacks[t];if (r) {
        r = r.slice(0);for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e);
      }return this;
    }, r.prototype.listeners = function (t) {
      return this._callbacks = this._callbacks || {}, this._callbacks[t] || [];
    }, r.prototype.hasListeners = function (t) {
      return !!this.listeners(t).length;
    };
  }, function (t, e, r) {
    (function (t) {
      var n = r(15),
          o = r(16);e.deconstructPacket = function (t) {
        function e(t) {
          if (!t) return t;if (o(t)) {
            var i = { _placeholder: !0, num: r.length };return r.push(t), i;
          }if (n(t)) {
            for (var s = new Array(t.length), a = 0; a < t.length; a++) s[a] = e(t[a]);return s;
          }if ("object" == typeof t && !(t instanceof Date)) {
            var s = {};for (var c in t) s[c] = e(t[c]);return s;
          }return t;
        }var r = [],
            i = t.data,
            s = t;return s.data = e(i), s.attachments = r.length, { packet: s, buffers: r };
      }, e.reconstructPacket = function (t, e) {
        function r(t) {
          if (t && t._placeholder) {
            var o = e[t.num];return o;
          }if (n(t)) {
            for (var i = 0; i < t.length; i++) t[i] = r(t[i]);return t;
          }if (t && "object" == typeof t) {
            for (var s in t) t[s] = r(t[s]);return t;
          }return t;
        }return t.data = r(t.data), t.attachments = void 0, t;
      }, e.removeBlobs = function (e, r) {
        function i(e, c, u) {
          if (!e) return e;if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
            s++;var h = new FileReader();h.onload = function () {
              u ? u[c] = this.result : a = this.result, --s || r(a);
            }, h.readAsArrayBuffer(e);
          } else if (n(e)) for (var p = 0; p < e.length; p++) i(e[p], p, e);else if (e && "object" == typeof e && !o(e)) for (var f in e) i(e[f], f, e);
        }var s = 0,
            a = e;i(a), s || r(a);
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {
    t.exports = Array.isArray || function (t) {
      return "[object Array]" == Object.prototype.toString.call(t);
    };
  }, function (t, e) {
    (function (e) {
      function r(t) {
        return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer;
      }t.exports = r;
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    "use strict";
    function n(t, e) {
      return this instanceof n ? (t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new l({ min: this.reconnectionDelay(), max: this.reconnectionDelayMax(), jitter: this.randomizationFactor() }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new c.Encoder(), this.decoder = new c.Decoder(), this.autoConnect = e.autoConnect !== !1, void (this.autoConnect && this.open())) : new n(t, e);
    }var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    },
        i = r(18),
        s = r(44),
        a = r(35),
        c = r(7),
        u = r(46),
        h = r(47),
        p = r(3)("socket.io-client:manager"),
        f = r(42),
        l = r(48),
        d = Object.prototype.hasOwnProperty;t.exports = n, n.prototype.emitAll = function () {
      this.emit.apply(this, arguments);for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments);
    }, n.prototype.updateSocketIds = function () {
      for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.engine.id);
    }, a(n.prototype), n.prototype.reconnection = function (t) {
      return arguments.length ? (this._reconnection = !!t, this) : this._reconnection;
    }, n.prototype.reconnectionAttempts = function (t) {
      return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts;
    }, n.prototype.reconnectionDelay = function (t) {
      return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay;
    }, n.prototype.randomizationFactor = function (t) {
      return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor;
    }, n.prototype.reconnectionDelayMax = function (t) {
      return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax;
    }, n.prototype.timeout = function (t) {
      return arguments.length ? (this._timeout = t, this) : this._timeout;
    }, n.prototype.maybeReconnectOnOpen = function () {
      !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
    }, n.prototype.open = n.prototype.connect = function (t, e) {
      if (p("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;p("opening %s", this.uri), this.engine = i(this.uri, this.opts);var r = this.engine,
          n = this;this.readyState = "opening", this.skipReconnect = !1;var o = u(r, "open", function () {
        n.onopen(), t && t();
      }),
          s = u(r, "error", function (e) {
        if (p("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", e), t) {
          var r = new Error("Connection error");r.data = e, t(r);
        } else n.maybeReconnectOnOpen();
      });if (!1 !== this._timeout) {
        var a = this._timeout;p("connect attempt will timeout after %d", a);var c = setTimeout(function () {
          p("connect attempt timed out after %d", a), o.destroy(), r.close(), r.emit("error", "timeout"), n.emitAll("connect_timeout", a);
        }, a);this.subs.push({ destroy: function () {
            clearTimeout(c);
          } });
      }return this.subs.push(o), this.subs.push(s), this;
    }, n.prototype.onopen = function () {
      p("open"), this.cleanup(), this.readyState = "open", this.emit("open");var t = this.engine;this.subs.push(u(t, "data", h(this, "ondata"))), this.subs.push(u(t, "ping", h(this, "onping"))), this.subs.push(u(t, "pong", h(this, "onpong"))), this.subs.push(u(t, "error", h(this, "onerror"))), this.subs.push(u(t, "close", h(this, "onclose"))), this.subs.push(u(this.decoder, "decoded", h(this, "ondecoded")));
    }, n.prototype.onping = function () {
      this.lastPing = new Date(), this.emitAll("ping");
    }, n.prototype.onpong = function () {
      this.emitAll("pong", new Date() - this.lastPing);
    }, n.prototype.ondata = function (t) {
      this.decoder.add(t);
    }, n.prototype.ondecoded = function (t) {
      this.emit("packet", t);
    }, n.prototype.onerror = function (t) {
      p("error", t), this.emitAll("error", t);
    }, n.prototype.socket = function (t, e) {
      function r() {
        ~f(o.connecting, n) || o.connecting.push(n);
      }var n = this.nsps[t];if (!n) {
        n = new s(this, t, e), this.nsps[t] = n;var o = this;n.on("connecting", r), n.on("connect", function () {
          n.id = o.engine.id;
        }), this.autoConnect && r();
      }return n;
    }, n.prototype.destroy = function (t) {
      var e = f(this.connecting, t);~e && this.connecting.splice(e, 1), this.connecting.length || this.close();
    }, n.prototype.packet = function (t) {
      p("writing packet %j", t);var e = this;t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function (r) {
        for (var n = 0; n < r.length; n++) e.engine.write(r[n], t.options);e.encoding = !1, e.processPacketQueue();
      }));
    }, n.prototype.processPacketQueue = function () {
      if (this.packetBuffer.length > 0 && !this.encoding) {
        var t = this.packetBuffer.shift();this.packet(t);
      }
    }, n.prototype.cleanup = function () {
      p("cleanup");for (var t = this.subs.length, e = 0; e < t; e++) {
        var r = this.subs.shift();r.destroy();
      }this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy();
    }, n.prototype.close = n.prototype.disconnect = function () {
      p("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
    }, n.prototype.onclose = function (t) {
      p("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect();
    }, n.prototype.reconnect = function () {
      if (this.reconnecting || this.skipReconnect) return this;var t = this;if (this.backoff.attempts >= this._reconnectionAttempts) p("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;else {
        var e = this.backoff.duration();p("will wait %dms before reconnect attempt", e), this.reconnecting = !0;var r = setTimeout(function () {
          t.skipReconnect || (p("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function (e) {
            e ? (p("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (p("reconnect success"), t.onreconnect());
          }));
        }, e);this.subs.push({ destroy: function () {
            clearTimeout(r);
          } });
      }
    }, n.prototype.onreconnect = function () {
      var t = this.backoff.attempts;this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t);
    };
  }, function (t, e, r) {
    t.exports = r(19);
  }, function (t, e, r) {
    t.exports = r(20), t.exports.parser = r(27);
  }, function (t, e, r) {
    (function (e) {
      function n(t, r) {
        if (!(this instanceof n)) return new n(t, r);r = r || {}, t && "object" == typeof t && (r = t, t = null), t ? (t = h(t), r.hostname = t.host, r.secure = "https" === t.protocol || "wss" === t.protocol, r.port = t.port, t.query && (r.query = t.query)) : r.host && (r.hostname = h(r.host).host), this.secure = null != r.secure ? r.secure : e.location && "https:" === location.protocol, r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.agent = r.agent || !1, this.hostname = r.hostname || (e.location ? location.hostname : "localhost"), this.port = r.port || (e.location && location.port ? location.port : this.secure ? 443 : 80), this.query = r.query || {}, "string" == typeof this.query && (this.query = f.decode(this.query)), this.upgrade = !1 !== r.upgrade, this.path = (r.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!r.forceJSONP, this.jsonp = !1 !== r.jsonp, this.forceBase64 = !!r.forceBase64, this.enablesXDR = !!r.enablesXDR, this.timestampParam = r.timestampParam || "t", this.timestampRequests = r.timestampRequests, this.transports = r.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = r.policyPort || 843, this.rememberUpgrade = r.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = r.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== r.perMessageDeflate && (r.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = r.pfx || null, this.key = r.key || null, this.passphrase = r.passphrase || null, this.cert = r.cert || null, this.ca = r.ca || null, this.ciphers = r.ciphers || null, this.rejectUnauthorized = void 0 === r.rejectUnauthorized ? null : r.rejectUnauthorized, this.forceNode = !!r.forceNode;var o = "object" == typeof e && e;o.global === o && (r.extraHeaders && Object.keys(r.extraHeaders).length > 0 && (this.extraHeaders = r.extraHeaders), r.localAddress && (this.localAddress = r.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open();
      }function o(t) {
        var e = {};for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);return e;
      }var i = r(21),
          s = r(35),
          a = r(3)("engine.io-client:socket"),
          c = r(42),
          u = r(27),
          h = r(2),
          p = r(43),
          f = r(36);t.exports = n, n.priorWebsocketSuccess = !1, s(n.prototype), n.protocol = u.protocol, n.Socket = n, n.Transport = r(26), n.transports = r(21), n.parser = r(27), n.prototype.createTransport = function (t) {
        a('creating transport "%s"', t);var e = o(this.query);e.EIO = u.protocol, e.transport = t, this.id && (e.sid = this.id);var r = new i[t]({ agent: this.agent, hostname: this.hostname, port: this.port, secure: this.secure, path: this.path, query: e, forceJSONP: this.forceJSONP, jsonp: this.jsonp, forceBase64: this.forceBase64, enablesXDR: this.enablesXDR, timestampRequests: this.timestampRequests, timestampParam: this.timestampParam, policyPort: this.policyPort, socket: this, pfx: this.pfx, key: this.key, passphrase: this.passphrase, cert: this.cert, ca: this.ca, ciphers: this.ciphers, rejectUnauthorized: this.rejectUnauthorized, perMessageDeflate: this.perMessageDeflate, extraHeaders: this.extraHeaders, forceNode: this.forceNode, localAddress: this.localAddress });return r;
      }, n.prototype.open = function () {
        var t;if (this.rememberUpgrade && n.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) t = "websocket";else {
          if (0 === this.transports.length) {
            var e = this;return void setTimeout(function () {
              e.emit("error", "No transports available");
            }, 0);
          }t = this.transports[0];
        }this.readyState = "opening";try {
          t = this.createTransport(t);
        } catch (t) {
          return this.transports.shift(), void this.open();
        }t.open(), this.setTransport(t);
      }, n.prototype.setTransport = function (t) {
        a("setting transport %s", t.name);var e = this;this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function () {
          e.onDrain();
        }).on("packet", function (t) {
          e.onPacket(t);
        }).on("error", function (t) {
          e.onError(t);
        }).on("close", function () {
          e.onClose("transport close");
        });
      }, n.prototype.probe = function (t) {
        function e() {
          if (f.onlyBinaryUpgrades) {
            var e = !this.supportsBinary && f.transport.supportsBinary;p = p || e;
          }p || (a('probe transport "%s" opened', t), h.send([{ type: "ping", data: "probe" }]), h.once("packet", function (e) {
            if (!p) if ("pong" === e.type && "probe" === e.data) {
              if (a('probe transport "%s" pong', t), f.upgrading = !0, f.emit("upgrading", h), !h) return;n.priorWebsocketSuccess = "websocket" === h.name, a('pausing current transport "%s"', f.transport.name), f.transport.pause(function () {
                p || "closed" !== f.readyState && (a("changing transport and sending upgrade packet"), u(), f.setTransport(h), h.send([{ type: "upgrade" }]), f.emit("upgrade", h), h = null, f.upgrading = !1, f.flush());
              });
            } else {
              a('probe transport "%s" failed', t);var r = new Error("probe error");r.transport = h.name, f.emit("upgradeError", r);
            }
          }));
        }function r() {
          p || (p = !0, u(), h.close(), h = null);
        }function o(e) {
          var n = new Error("probe error: " + e);n.transport = h.name, r(), a('probe transport "%s" failed because of error: %s', t, e), f.emit("upgradeError", n);
        }function i() {
          o("transport closed");
        }function s() {
          o("socket closed");
        }function c(t) {
          h && t.name !== h.name && (a('"%s" works - aborting "%s"', t.name, h.name), r());
        }function u() {
          h.removeListener("open", e), h.removeListener("error", o), h.removeListener("close", i), f.removeListener("close", s), f.removeListener("upgrading", c);
        }a('probing transport "%s"', t);var h = this.createTransport(t, { probe: 1 }),
            p = !1,
            f = this;n.priorWebsocketSuccess = !1, h.once("open", e), h.once("error", o), h.once("close", i), this.once("close", s), this.once("upgrading", c), h.open();
      }, n.prototype.onOpen = function () {
        if (a("socket open"), this.readyState = "open", n.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
          a("starting upgrade probes");for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t]);
        }
      }, n.prototype.onPacket = function (t) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {case "open":
            this.onHandshake(p(t.data));break;case "pong":
            this.setPing(), this.emit("pong");break;case "error":
            var e = new Error("server error");e.code = t.data, this.onError(e);break;case "message":
            this.emit("data", t.data), this.emit("message", t.data);} else a('packet received with socket readyState "%s"', this.readyState);
      }, n.prototype.onHandshake = function (t) {
        this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat));
      }, n.prototype.onHeartbeat = function (t) {
        clearTimeout(this.pingTimeoutTimer);var e = this;e.pingTimeoutTimer = setTimeout(function () {
          "closed" !== e.readyState && e.onClose("ping timeout");
        }, t || e.pingInterval + e.pingTimeout);
      }, n.prototype.setPing = function () {
        var t = this;clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function () {
          a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout);
        }, t.pingInterval);
      }, n.prototype.ping = function () {
        var t = this;this.sendPacket("ping", function () {
          t.emit("ping");
        });
      }, n.prototype.onDrain = function () {
        this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
      }, n.prototype.flush = function () {
        "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"));
      }, n.prototype.write = n.prototype.send = function (t, e, r) {
        return this.sendPacket("message", t, e, r), this;
      }, n.prototype.sendPacket = function (t, e, r, n) {
        if ("function" == typeof e && (n = e, e = void 0), "function" == typeof r && (n = r, r = null), "closing" !== this.readyState && "closed" !== this.readyState) {
          r = r || {}, r.compress = !1 !== r.compress;var o = { type: t, data: e, options: r };this.emit("packetCreate", o), this.writeBuffer.push(o), n && this.once("flush", n), this.flush();
        }
      }, n.prototype.close = function () {
        function t() {
          n.onClose("forced close"), a("socket closing - telling transport to close"), n.transport.close();
        }function e() {
          n.removeListener("upgrade", e), n.removeListener("upgradeError", e), t();
        }function r() {
          n.once("upgrade", e), n.once("upgradeError", e);
        }if ("opening" === this.readyState || "open" === this.readyState) {
          this.readyState = "closing";var n = this;this.writeBuffer.length ? this.once("drain", function () {
            this.upgrading ? r() : t();
          }) : this.upgrading ? r() : t();
        }return this;
      }, n.prototype.onError = function (t) {
        a("socket error %j", t), n.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t);
      }, n.prototype.onClose = function (t, e) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          a('socket close with reason: "%s"', t);var r = this;clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), r.writeBuffer = [], r.prevBufferLen = 0;
        }
      }, n.prototype.filterUpgrades = function (t) {
        for (var e = [], r = 0, n = t.length; r < n; r++) ~c(this.transports, t[r]) && e.push(t[r]);return e;
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    (function (t) {
      function n(e) {
        var r,
            n = !1,
            a = !1,
            c = !1 !== e.jsonp;if (t.location) {
          var u = "https:" === location.protocol,
              h = location.port;h || (h = u ? 443 : 80), n = e.hostname !== location.hostname || h !== e.port, a = e.secure !== u;
        }if (e.xdomain = n, e.xscheme = a, r = new o(e), "open" in r && !e.forceJSONP) return new i(e);if (!c) throw new Error("JSONP disabled");return new s(e);
      }var o = r(22),
          i = r(24),
          s = r(39),
          a = r(40);e.polling = n, e.websocket = a;
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    (function (e) {
      var n = r(23);t.exports = function (t) {
        var r = t.xdomain,
            o = t.xscheme,
            i = t.enablesXDR;try {
          if ("undefined" != typeof XMLHttpRequest && (!r || n)) return new XMLHttpRequest();
        } catch (t) {}try {
          if ("undefined" != typeof XDomainRequest && !o && i) return new XDomainRequest();
        } catch (t) {}if (!r) try {
          return new e[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
        } catch (t) {}
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {
    try {
      t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
    } catch (e) {
      t.exports = !1;
    }
  }, function (t, e, r) {
    (function (e) {
      function n() {}function o(t) {
        if (c.call(this, t), this.requestTimeout = t.requestTimeout, e.location) {
          var r = "https:" === location.protocol,
              n = location.port;n || (n = r ? 443 : 80), this.xd = t.hostname !== e.location.hostname || n !== t.port, this.xs = t.secure !== r;
        } else this.extraHeaders = t.extraHeaders;
      }function i(t) {
        this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.requestTimeout = t.requestTimeout, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders, this.create();
      }function s() {
        for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort();
      }var a = r(22),
          c = r(25),
          u = r(35),
          h = r(37),
          p = r(3)("engine.io-client:polling-xhr");t.exports = o, t.exports.Request = i, h(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function (t) {
        return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.requestTimeout = this.requestTimeout, t.extraHeaders = this.extraHeaders, new i(t);
      }, o.prototype.doWrite = function (t, e) {
        var r = "string" != typeof t && void 0 !== t,
            n = this.request({ method: "POST", data: t, isBinary: r }),
            o = this;n.on("success", e), n.on("error", function (t) {
          o.onError("xhr post error", t);
        }), this.sendXhr = n;
      }, o.prototype.doPoll = function () {
        p("xhr poll");var t = this.request(),
            e = this;t.on("data", function (t) {
          e.onData(t);
        }), t.on("error", function (t) {
          e.onError("xhr poll error", t);
        }), this.pollXhr = t;
      }, u(i.prototype), i.prototype.create = function () {
        var t = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;var r = this.xhr = new a(t),
            n = this;try {
          p("xhr open %s: %s", this.method, this.uri), r.open(this.method, this.uri, this.async);try {
            if (this.extraHeaders) {
              r.setDisableHeaderCheck(!0);for (var o in this.extraHeaders) this.extraHeaders.hasOwnProperty(o) && r.setRequestHeader(o, this.extraHeaders[o]);
            }
          } catch (t) {}if (this.supportsBinary && (r.responseType = "arraybuffer"), "POST" === this.method) try {
            this.isBinary ? r.setRequestHeader("Content-type", "application/octet-stream") : r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
          } catch (t) {}try {
            r.setRequestHeader("Accept", "*/*");
          } catch (t) {}"withCredentials" in r && (r.withCredentials = !0), this.requestTimeout && (r.timeout = this.requestTimeout), this.hasXDR() ? (r.onload = function () {
            n.onLoad();
          }, r.onerror = function () {
            n.onError(r.responseText);
          }) : r.onreadystatechange = function () {
            4 === r.readyState && (200 === r.status || 1223 === r.status ? n.onLoad() : setTimeout(function () {
              n.onError(r.status);
            }, 0));
          }, p("xhr data %s", this.data), r.send(this.data);
        } catch (t) {
          return void setTimeout(function () {
            n.onError(t);
          }, 0);
        }e.document && (this.index = i.requestsCount++, i.requests[this.index] = this);
      }, i.prototype.onSuccess = function () {
        this.emit("success"), this.cleanup();
      }, i.prototype.onData = function (t) {
        this.emit("data", t), this.onSuccess();
      }, i.prototype.onError = function (t) {
        this.emit("error", t), this.cleanup(!0);
      }, i.prototype.cleanup = function (t) {
        if ("undefined" != typeof this.xhr && null !== this.xhr) {
          if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n, t) try {
            this.xhr.abort();
          } catch (t) {}e.document && delete i.requests[this.index], this.xhr = null;
        }
      }, i.prototype.onLoad = function () {
        var t;try {
          var e;try {
            e = this.xhr.getResponseHeader("Content-Type").split(";")[0];
          } catch (t) {}if ("application/octet-stream" === e) t = this.xhr.response || this.xhr.responseText;else if (this.supportsBinary) try {
            t = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
          } catch (e) {
            for (var r = new Uint8Array(this.xhr.response), n = [], o = 0, i = r.length; o < i; o++) n.push(r[o]);t = String.fromCharCode.apply(null, n);
          } else t = this.xhr.responseText;
        } catch (t) {
          this.onError(t);
        }null != t && this.onData(t);
      }, i.prototype.hasXDR = function () {
        return "undefined" != typeof e.XDomainRequest && !this.xs && this.enablesXDR;
      }, i.prototype.abort = function () {
        this.cleanup();
      }, i.requestsCount = 0, i.requests = {}, e.document && (e.attachEvent ? e.attachEvent("onunload", s) : e.addEventListener && e.addEventListener("beforeunload", s, !1));
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    function n(t) {
      var e = t && t.forceBase64;h && !e || (this.supportsBinary = !1), o.call(this, t);
    }var o = r(26),
        i = r(36),
        s = r(27),
        a = r(37),
        c = r(38),
        u = r(3)("engine.io-client:polling");t.exports = n;var h = function () {
      var t = r(22),
          e = new t({ xdomain: !1 });return null != e.responseType;
    }();a(n, o), n.prototype.name = "polling", n.prototype.doOpen = function () {
      this.poll();
    }, n.prototype.pause = function (t) {
      function e() {
        u("paused"), r.readyState = "paused", t();
      }var r = this;if (this.readyState = "pausing", this.polling || !this.writable) {
        var n = 0;this.polling && (u("we are currently polling - waiting to pause"), n++, this.once("pollComplete", function () {
          u("pre-pause polling complete"), --n || e();
        })), this.writable || (u("we are currently writing - waiting to pause"), n++, this.once("drain", function () {
          u("pre-pause writing complete"), --n || e();
        }));
      } else e();
    }, n.prototype.poll = function () {
      u("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
    }, n.prototype.onData = function (t) {
      var e = this;u("polling got data %s", t);var r = function (t, r, n) {
        return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), !1) : void e.onPacket(t);
      };s.decodePayload(t, this.socket.binaryType, r), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : u('ignoring poll - transport state "%s"', this.readyState));
    }, n.prototype.doClose = function () {
      function t() {
        u("writing close packet"), e.write([{ type: "close" }]);
      }var e = this;"open" === this.readyState ? (u("transport open - closing"), t()) : (u("transport not open - deferring close"), this.once("open", t));
    }, n.prototype.write = function (t) {
      var e = this;this.writable = !1;var r = function () {
        e.writable = !0, e.emit("drain");
      };s.encodePayload(t, this.supportsBinary, function (t) {
        e.doWrite(t, r);
      });
    }, n.prototype.uri = function () {
      var t = this.query || {},
          e = this.secure ? "https" : "http",
          r = "";!1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), t = i.encode(t), this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (r = ":" + this.port), t.length && (t = "?" + t);var n = this.hostname.indexOf(":") !== -1;return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t;
    };
  }, function (t, e, r) {
    function n(t) {
      this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.forceNode = t.forceNode, this.extraHeaders = t.extraHeaders, this.localAddress = t.localAddress;
    }var o = r(27),
        i = r(35);t.exports = n, i(n.prototype), n.prototype.onError = function (t, e) {
      var r = new Error(t);return r.type = "TransportError", r.description = e, this.emit("error", r), this;
    }, n.prototype.open = function () {
      return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this;
    }, n.prototype.close = function () {
      return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this;
    }, n.prototype.send = function (t) {
      if ("open" !== this.readyState) throw new Error("Transport not open");this.write(t);
    }, n.prototype.onOpen = function () {
      this.readyState = "open", this.writable = !0, this.emit("open");
    }, n.prototype.onData = function (t) {
      var e = o.decodePacket(t, this.socket.binaryType);this.onPacket(e);
    }, n.prototype.onPacket = function (t) {
      this.emit("packet", t);
    }, n.prototype.onClose = function () {
      this.readyState = "closed", this.emit("close");
    };
  }, function (t, e, r) {
    (function (t) {
      function n(t, r) {
        var n = "b" + e.packets[t.type] + t.data.data;return r(n);
      }function o(t, r, n) {
        if (!r) return e.encodeBase64Packet(t, n);var o = t.data,
            i = new Uint8Array(o),
            s = new Uint8Array(1 + o.byteLength);s[0] = v[t.type];for (var a = 0; a < i.length; a++) s[a + 1] = i[a];return n(s.buffer);
      }function i(t, r, n) {
        if (!r) return e.encodeBase64Packet(t, n);var o = new FileReader();return o.onload = function () {
          t.data = o.result, e.encodePacket(t, r, !0, n);
        }, o.readAsArrayBuffer(t.data);
      }function s(t, r, n) {
        if (!r) return e.encodeBase64Packet(t, n);if (m) return i(t, r, n);var o = new Uint8Array(1);o[0] = v[t.type];var s = new k([o.buffer, t.data]);return n(s);
      }function a(t) {
        try {
          t = d.decode(t);
        } catch (t) {
          return !1;
        }return t;
      }function c(t, e, r) {
        for (var n = new Array(t.length), o = l(t.length, r), i = function (t, r, o) {
          e(r, function (e, r) {
            n[t] = r, o(e, n);
          });
        }, s = 0; s < t.length; s++) i(s, t[s], o);
      }var u,
          h = r(28),
          p = r(29),
          f = r(30),
          l = r(31),
          d = r(32);t && t.ArrayBuffer && (u = r(33));var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
          g = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent),
          m = y || g;e.protocol = 3;var v = e.packets = { open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6 },
          b = h(v),
          w = { type: "error", data: "parser error" },
          k = r(34);e.encodePacket = function (e, r, i, a) {
        "function" == typeof r && (a = r, r = !1), "function" == typeof i && (a = i, i = null);var c = void 0 === e.data ? void 0 : e.data.buffer || e.data;if (t.ArrayBuffer && c instanceof ArrayBuffer) return o(e, r, a);if (k && c instanceof t.Blob) return s(e, r, a);if (c && c.base64) return n(e, a);var u = v[e.type];return void 0 !== e.data && (u += i ? d.encode(String(e.data)) : String(e.data)), a("" + u);
      }, e.encodeBase64Packet = function (r, n) {
        var o = "b" + e.packets[r.type];if (k && r.data instanceof t.Blob) {
          var i = new FileReader();return i.onload = function () {
            var t = i.result.split(",")[1];n(o + t);
          }, i.readAsDataURL(r.data);
        }var s;try {
          s = String.fromCharCode.apply(null, new Uint8Array(r.data));
        } catch (t) {
          for (var a = new Uint8Array(r.data), c = new Array(a.length), u = 0; u < a.length; u++) c[u] = a[u];s = String.fromCharCode.apply(null, c);
        }return o += t.btoa(s), n(o);
      }, e.decodePacket = function (t, r, n) {
        if (void 0 === t) return w;if ("string" == typeof t) {
          if ("b" == t.charAt(0)) return e.decodeBase64Packet(t.substr(1), r);if (n && (t = a(t), t === !1)) return w;var o = t.charAt(0);return Number(o) == o && b[o] ? t.length > 1 ? { type: b[o], data: t.substring(1) } : { type: b[o] } : w;
        }var i = new Uint8Array(t),
            o = i[0],
            s = f(t, 1);return k && "blob" === r && (s = new k([s])), { type: b[o], data: s };
      }, e.decodeBase64Packet = function (t, e) {
        var r = b[t.charAt(0)];if (!u) return { type: r, data: { base64: !0, data: t.substr(1) } };var n = u.decode(t.substr(1));return "blob" === e && k && (n = new k([n])), { type: r, data: n };
      }, e.encodePayload = function (t, r, n) {
        function o(t) {
          return t.length + ":" + t;
        }function i(t, n) {
          e.encodePacket(t, !!s && r, !0, function (t) {
            n(null, o(t));
          });
        }"function" == typeof r && (n = r, r = null);var s = p(t);return r && s ? k && !m ? e.encodePayloadAsBlob(t, n) : e.encodePayloadAsArrayBuffer(t, n) : t.length ? void c(t, i, function (t, e) {
          return n(e.join(""));
        }) : n("0:");
      }, e.decodePayload = function (t, r, n) {
        if ("string" != typeof t) return e.decodePayloadAsBinary(t, r, n);"function" == typeof r && (n = r, r = null);var o;if ("" == t) return n(w, 0, 1);for (var i, s, a = "", c = 0, u = t.length; c < u; c++) {
          var h = t.charAt(c);if (":" != h) a += h;else {
            if ("" == a || a != (i = Number(a))) return n(w, 0, 1);if (s = t.substr(c + 1, i), a != s.length) return n(w, 0, 1);if (s.length) {
              if (o = e.decodePacket(s, r, !0), w.type == o.type && w.data == o.data) return n(w, 0, 1);var p = n(o, c + i, u);if (!1 === p) return;
            }c += i, a = "";
          }
        }return "" != a ? n(w, 0, 1) : void 0;
      }, e.encodePayloadAsArrayBuffer = function (t, r) {
        function n(t, r) {
          e.encodePacket(t, !0, !0, function (t) {
            return r(null, t);
          });
        }return t.length ? void c(t, n, function (t, e) {
          var n = e.reduce(function (t, e) {
            var r;return r = "string" == typeof e ? e.length : e.byteLength, t + r.toString().length + r + 2;
          }, 0),
              o = new Uint8Array(n),
              i = 0;return e.forEach(function (t) {
            var e = "string" == typeof t,
                r = t;if (e) {
              for (var n = new Uint8Array(t.length), s = 0; s < t.length; s++) n[s] = t.charCodeAt(s);r = n.buffer;
            }e ? o[i++] = 0 : o[i++] = 1;for (var a = r.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);o[i++] = 255;for (var n = new Uint8Array(r), s = 0; s < n.length; s++) o[i++] = n[s];
          }), r(o.buffer);
        }) : r(new ArrayBuffer(0));
      }, e.encodePayloadAsBlob = function (t, r) {
        function n(t, r) {
          e.encodePacket(t, !0, !0, function (t) {
            var e = new Uint8Array(1);if (e[0] = 1, "string" == typeof t) {
              for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);t = n.buffer, e[0] = 0;
            }for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);if (a[s.length] = 255, k) {
              var c = new k([e.buffer, a.buffer, t]);r(null, c);
            }
          });
        }c(t, n, function (t, e) {
          return r(new k(e));
        });
      }, e.decodePayloadAsBinary = function (t, r, n) {
        "function" == typeof r && (n = r, r = null);for (var o = t, i = [], s = !1; o.byteLength > 0;) {
          for (var a = new Uint8Array(o), c = 0 === a[0], u = "", h = 1; 255 != a[h]; h++) {
            if (u.length > 310) {
              s = !0;break;
            }u += a[h];
          }if (s) return n(w, 0, 1);o = f(o, 2 + u.length), u = parseInt(u);var p = f(o, 0, u);if (c) try {
            p = String.fromCharCode.apply(null, new Uint8Array(p));
          } catch (t) {
            var l = new Uint8Array(p);p = "";for (var h = 0; h < l.length; h++) p += String.fromCharCode(l[h]);
          }i.push(p), o = f(o, u);
        }var d = i.length;i.forEach(function (t, o) {
          n(e.decodePacket(t, r, !0), o, d);
        });
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {
    t.exports = Object.keys || function (t) {
      var e = [],
          r = Object.prototype.hasOwnProperty;for (var n in t) r.call(t, n) && e.push(n);return e;
    };
  }, function (t, e, r) {
    (function (e) {
      function n(t) {
        function r(t) {
          if (!t) return !1;if (e.Buffer && e.Buffer.isBuffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer || e.Blob && t instanceof Blob || e.File && t instanceof File) return !0;if (o(t)) {
            for (var n = 0; n < t.length; n++) if (r(t[n])) return !0;
          } else if (t && "object" == typeof t) {
            t.toJSON && "function" == typeof t.toJSON && (t = t.toJSON());for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0;
          }return !1;
        }return r(t);
      }var o = r(15);t.exports = n;
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {
    t.exports = function (t, e, r) {
      var n = t.byteLength;if (e = e || 0, r = r || n, t.slice) return t.slice(e, r);if (e < 0 && (e += n), r < 0 && (r += n), r > n && (r = n), e >= n || e >= r || 0 === n) return new ArrayBuffer(0);for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++, a++) i[a] = o[s];return i.buffer;
    };
  }, function (t, e) {
    function r(t, e, r) {
      function o(t, n) {
        if (o.count <= 0) throw new Error("after called too many times");--o.count, t ? (i = !0, e(t), e = r) : 0 !== o.count || i || e(null, n);
      }var i = !1;return r = r || n, o.count = t, 0 === t ? e() : o;
    }function n() {}t.exports = r;
  }, function (t, e, r) {
    var n;(function (t, o) {
      !function (i) {
        function s(t) {
          for (var e, r, n = [], o = 0, i = t.length; o < i;) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < i ? (r = t.charCodeAt(o++), 56320 == (64512 & r) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e), o--)) : n.push(e);return n;
        }function a(t) {
          for (var e, r = t.length, n = -1, o = ""; ++n < r;) e = t[n], e > 65535 && (e -= 65536, o += b(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += b(e);return o;
        }function c(t, e) {
          return b(t >> e & 63 | 128);
        }function u(t) {
          if (0 == (4294967168 & t)) return b(t);var e = "";return 0 == (4294965248 & t) ? e = b(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (e = b(t >> 12 & 15 | 224), e += c(t, 6)) : 0 == (4292870144 & t) && (e = b(t >> 18 & 7 | 240), e += c(t, 12), e += c(t, 6)), e += b(63 & t | 128);
        }function h(t) {
          for (var e, r = s(t), n = r.length, o = -1, i = ""; ++o < n;) e = r[o], i += u(e);return i;
        }function p() {
          if (v >= m) throw Error("Invalid byte index");var t = 255 & g[v];if (v++, 128 == (192 & t)) return 63 & t;throw Error("Invalid continuation byte");
        }function f() {
          var t, e, r, n, o;if (v > m) throw Error("Invalid byte index");if (v == m) return !1;if (t = 255 & g[v], v++, 0 == (128 & t)) return t;if (192 == (224 & t)) {
            var e = p();if (o = (31 & t) << 6 | e, o >= 128) return o;throw Error("Invalid continuation byte");
          }if (224 == (240 & t)) {
            if (e = p(), r = p(), o = (15 & t) << 12 | e << 6 | r, o >= 2048) return o;throw Error("Invalid continuation byte");
          }if (240 == (248 & t) && (e = p(), r = p(), n = p(), o = (15 & t) << 18 | e << 12 | r << 6 | n, o >= 65536 && o <= 1114111)) return o;throw Error("Invalid WTF-8 detected");
        }function l(t) {
          g = s(t), m = g.length, v = 0;for (var e, r = []; (e = f()) !== !1;) r.push(e);return a(r);
        }var d = "object" == typeof e && e,
            y = ("object" == typeof t && t && t.exports == d && t, "object" == typeof o && o);y.global !== y && y.window !== y || (i = y);var g,
            m,
            v,
            b = String.fromCharCode,
            w = { version: "1.0.0", encode: h, decode: l };n = function () {
          return w;
        }.call(e, r, e, t), !(void 0 !== n && (t.exports = n));
      }(this);
    }).call(e, r(12)(t), function () {
      return this;
    }());
  }, function (t, e) {
    !function () {
      "use strict";
      for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = new Uint8Array(256), n = 0; n < t.length; n++) r[t.charCodeAt(n)] = n;e.encode = function (e) {
        var r,
            n = new Uint8Array(e),
            o = n.length,
            i = "";for (r = 0; r < o; r += 3) i += t[n[r] >> 2], i += t[(3 & n[r]) << 4 | n[r + 1] >> 4], i += t[(15 & n[r + 1]) << 2 | n[r + 2] >> 6], i += t[63 & n[r + 2]];return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), i;
      }, e.decode = function (t) {
        var e,
            n,
            o,
            i,
            s,
            a = .75 * t.length,
            c = t.length,
            u = 0;"=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);var h = new ArrayBuffer(a),
            p = new Uint8Array(h);for (e = 0; e < c; e += 4) n = r[t.charCodeAt(e)], o = r[t.charCodeAt(e + 1)], i = r[t.charCodeAt(e + 2)], s = r[t.charCodeAt(e + 3)], p[u++] = n << 2 | o >> 4, p[u++] = (15 & o) << 4 | i >> 2, p[u++] = (3 & i) << 6 | 63 & s;return h;
      };
    }();
  }, function (t, e) {
    (function (e) {
      function r(t) {
        for (var e = 0; e < t.length; e++) {
          var r = t[e];if (r.buffer instanceof ArrayBuffer) {
            var n = r.buffer;if (r.byteLength !== n.byteLength) {
              var o = new Uint8Array(r.byteLength);o.set(new Uint8Array(n, r.byteOffset, r.byteLength)), n = o.buffer;
            }t[e] = n;
          }
        }
      }function n(t, e) {
        e = e || {};var n = new i();r(t);for (var o = 0; o < t.length; o++) n.append(t[o]);return e.type ? n.getBlob(e.type) : n.getBlob();
      }function o(t, e) {
        return r(t), new Blob(t, e || {});
      }var i = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder,
          s = function () {
        try {
          var t = new Blob(["hi"]);return 2 === t.size;
        } catch (t) {
          return !1;
        }
      }(),
          a = s && function () {
        try {
          var t = new Blob([new Uint8Array([1, 2])]);return 2 === t.size;
        } catch (t) {
          return !1;
        }
      }(),
          c = i && i.prototype.append && i.prototype.getBlob;t.exports = function () {
        return s ? a ? e.Blob : o : c ? n : void 0;
      }();
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    function n(t) {
      if (t) return o(t);
    }function o(t) {
      for (var e in n.prototype) t[e] = n.prototype[e];return t;
    }t.exports = n, n.prototype.on = n.prototype.addEventListener = function (t, e) {
      return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
    }, n.prototype.once = function (t, e) {
      function r() {
        this.off(t, r), e.apply(this, arguments);
      }return r.fn = e, this.on(t, r), this;
    }, n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function (t, e) {
      if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;var r = this._callbacks["$" + t];if (!r) return this;if (1 == arguments.length) return delete this._callbacks["$" + t], this;for (var n, o = 0; o < r.length; o++) if (n = r[o], n === e || n.fn === e) {
        r.splice(o, 1);break;
      }return this;
    }, n.prototype.emit = function (t) {
      this._callbacks = this._callbacks || {};var e = [].slice.call(arguments, 1),
          r = this._callbacks["$" + t];if (r) {
        r = r.slice(0);for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e);
      }return this;
    }, n.prototype.listeners = function (t) {
      return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
    }, n.prototype.hasListeners = function (t) {
      return !!this.listeners(t).length;
    };
  }, function (t, e) {
    e.encode = function (t) {
      var e = "";for (var r in t) t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));return e;
    }, e.decode = function (t) {
      for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
        var i = r[n].split("=");e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
      }return e;
    };
  }, function (t, e) {
    t.exports = function (t, e) {
      var r = function () {};r.prototype = e.prototype, t.prototype = new r(), t.prototype.constructor = t;
    };
  }, function (t, e) {
    "use strict";
    function r(t) {
      var e = "";do e = s[t % a] + e, t = Math.floor(t / a); while (t > 0);return e;
    }function n(t) {
      var e = 0;for (h = 0; h < t.length; h++) e = e * a + c[t.charAt(h)];return e;
    }function o() {
      var t = r(+new Date());return t !== i ? (u = 0, i = t) : t + "." + r(u++);
    }for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, u = 0, h = 0; h < a; h++) c[s[h]] = h;o.encode = r, o.decode = n, t.exports = o;
  }, function (t, e, r) {
    (function (e) {
      function n() {}function o(t) {
        i.call(this, t), this.query = this.query || {}, a || (e.___eio || (e.___eio = []), a = e.___eio), this.index = a.length;var r = this;a.push(function (t) {
          r.onData(t);
        }), this.query.j = this.index, e.document && e.addEventListener && e.addEventListener("beforeunload", function () {
          r.script && (r.script.onerror = n);
        }, !1);
      }var i = r(25),
          s = r(37);t.exports = o;var a,
          c = /\n/g,
          u = /\\n/g;s(o, i), o.prototype.supportsBinary = !1, o.prototype.doClose = function () {
        this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this);
      }, o.prototype.doPoll = function () {
        var t = this,
            e = document.createElement("script");this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
          t.onError("jsonp poll error", e);
        };var r = document.getElementsByTagName("script")[0];r ? r.parentNode.insertBefore(e, r) : (document.head || document.body).appendChild(e), this.script = e;var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);n && setTimeout(function () {
          var t = document.createElement("iframe");document.body.appendChild(t), document.body.removeChild(t);
        }, 100);
      }, o.prototype.doWrite = function (t, e) {
        function r() {
          n(), e();
        }function n() {
          if (o.iframe) try {
            o.form.removeChild(o.iframe);
          } catch (t) {
            o.onError("jsonp polling iframe removal error", t);
          }try {
            var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';i = document.createElement(t);
          } catch (t) {
            i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0";
          }i.id = o.iframeId, o.form.appendChild(i), o.iframe = i;
        }var o = this;if (!this.form) {
          var i,
              s = document.createElement("form"),
              a = document.createElement("textarea"),
              h = this.iframeId = "eio_iframe_" + this.index;s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = h, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a;
        }this.form.action = this.uri(), n(), t = t.replace(u, "\\\n"), this.area.value = t.replace(c, "\\n");try {
          this.form.submit();
        } catch (t) {}this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
          "complete" === o.iframe.readyState && r();
        } : this.iframe.onload = r;
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    (function (e) {
      function n(t) {
        var e = t && t.forceBase64;e && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, this.usingBrowserWebSocket = p && !t.forceNode, this.usingBrowserWebSocket || (f = o), i.call(this, t);
      }var o,
          i = r(26),
          s = r(27),
          a = r(36),
          c = r(37),
          u = r(38),
          h = r(3)("engine.io-client:websocket"),
          p = e.WebSocket || e.MozWebSocket;if ("undefined" == typeof window) try {
        o = r(41);
      } catch (t) {}var f = p;f || "undefined" != typeof window || (f = o), t.exports = n, c(n, i), n.prototype.name = "websocket", n.prototype.supportsBinary = !0, n.prototype.doOpen = function () {
        if (this.check()) {
          var t = this.uri(),
              e = void 0,
              r = { agent: this.agent, perMessageDeflate: this.perMessageDeflate };r.pfx = this.pfx, r.key = this.key, r.passphrase = this.passphrase, r.cert = this.cert, r.ca = this.ca, r.ciphers = this.ciphers, r.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (r.headers = this.extraHeaders), this.localAddress && (r.localAddress = this.localAddress);try {
            this.ws = this.usingBrowserWebSocket ? new f(t) : new f(t, e, r);
          } catch (t) {
            return this.emit("error", t);
          }void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners();
        }
      }, n.prototype.addEventListeners = function () {
        var t = this;this.ws.onopen = function () {
          t.onOpen();
        }, this.ws.onclose = function () {
          t.onClose();
        }, this.ws.onmessage = function (e) {
          t.onData(e.data);
        }, this.ws.onerror = function (e) {
          t.onError("websocket error", e);
        };
      }, n.prototype.write = function (t) {
        function r() {
          n.emit("flush"), setTimeout(function () {
            n.writable = !0, n.emit("drain");
          }, 0);
        }var n = this;this.writable = !1;for (var o = t.length, i = 0, a = o; i < a; i++) !function (t) {
          s.encodePacket(t, n.supportsBinary, function (i) {
            if (!n.usingBrowserWebSocket) {
              var s = {};if (t.options && (s.compress = t.options.compress), n.perMessageDeflate) {
                var a = "string" == typeof i ? e.Buffer.byteLength(i) : i.length;a < n.perMessageDeflate.threshold && (s.compress = !1);
              }
            }try {
              n.usingBrowserWebSocket ? n.ws.send(i) : n.ws.send(i, s);
            } catch (t) {
              h("websocket closed before onclose event");
            }--o || r();
          });
        }(t[i]);
      }, n.prototype.onClose = function () {
        i.prototype.onClose.call(this);
      }, n.prototype.doClose = function () {
        "undefined" != typeof this.ws && this.ws.close();
      }, n.prototype.uri = function () {
        var t = this.query || {},
            e = this.secure ? "wss" : "ws",
            r = "";this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (r = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = u()), this.supportsBinary || (t.b64 = 1), t = a.encode(t), t.length && (t = "?" + t);var n = this.hostname.indexOf(":") !== -1;return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t;
      }, n.prototype.check = function () {
        return !(!f || "__initialize" in f && this.name === n.prototype.name);
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e) {}, function (t, e) {
    var r = [].indexOf;t.exports = function (t, e) {
      if (r) return t.indexOf(e);for (var n = 0; n < t.length; ++n) if (t[n] === e) return n;return -1;
    };
  }, function (t, e) {
    (function (e) {
      var r = /^[\],:{}\s]*$/,
          n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
          o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          i = /(?:^|:|,)(?:\s*\[)+/g,
          s = /^\s+/,
          a = /\s+$/;t.exports = function (t) {
        return "string" == typeof t && t ? (t = t.replace(s, "").replace(a, ""), e.JSON && JSON.parse ? JSON.parse(t) : r.test(t.replace(n, "@").replace(o, "]").replace(i, "")) ? new Function("return " + t)() : void 0) : null;
      };
    }).call(e, function () {
      return this;
    }());
  }, function (t, e, r) {
    "use strict";
    function n(t, e, r) {
      this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, r && r.query && (this.query = r.query), this.io.autoConnect && this.open();
    }var o = r(7),
        i = r(35),
        s = r(45),
        a = r(46),
        c = r(47),
        u = r(3)("socket.io-client:socket"),
        h = r(29);t.exports = e = n;var p = { connect: 1, connect_error: 1, connect_timeout: 1, connecting: 1, disconnect: 1, error: 1, reconnect: 1, reconnect_attempt: 1, reconnect_failed: 1, reconnect_error: 1, reconnecting: 1, ping: 1, pong: 1 },
        f = i.prototype.emit;i(n.prototype), n.prototype.subEvents = function () {
      if (!this.subs) {
        var t = this.io;this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))];
      }
    }, n.prototype.open = n.prototype.connect = function () {
      return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this);
    }, n.prototype.send = function () {
      var t = s(arguments);return t.unshift("message"), this.emit.apply(this, t), this;
    }, n.prototype.emit = function (t) {
      if (p.hasOwnProperty(t)) return f.apply(this, arguments), this;var e = s(arguments),
          r = o.EVENT;h(e) && (r = o.BINARY_EVENT);var n = { type: r, data: e };return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof e[e.length - 1] && (u("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), delete this.flags, this;
    }, n.prototype.packet = function (t) {
      t.nsp = this.nsp, this.io.packet(t);
    }, n.prototype.onopen = function () {
      u("transport is open - connecting"), "/" !== this.nsp && (this.query ? this.packet({ type: o.CONNECT, query: this.query }) : this.packet({ type: o.CONNECT }));
    }, n.prototype.onclose = function (t) {
      u("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t);
    }, n.prototype.onpacket = function (t) {
      if (t.nsp === this.nsp) switch (t.type) {case o.CONNECT:
          this.onconnect();break;case o.EVENT:
          this.onevent(t);break;case o.BINARY_EVENT:
          this.onevent(t);break;case o.ACK:
          this.onack(t);break;case o.BINARY_ACK:
          this.onack(t);break;case o.DISCONNECT:
          this.ondisconnect();break;case o.ERROR:
          this.emit("error", t.data);}
    }, n.prototype.onevent = function (t) {
      var e = t.data || [];u("emitting event %j", e), null != t.id && (u("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? f.apply(this, e) : this.receiveBuffer.push(e);
    }, n.prototype.ack = function (t) {
      var e = this,
          r = !1;return function () {
        if (!r) {
          r = !0;var n = s(arguments);u("sending ack %j", n);var i = h(n) ? o.BINARY_ACK : o.ACK;e.packet({ type: i, id: t, data: n });
        }
      };
    }, n.prototype.onack = function (t) {
      var e = this.acks[t.id];"function" == typeof e ? (u("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), delete this.acks[t.id]) : u("bad ack %s", t.id);
    }, n.prototype.onconnect = function () {
      this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
    }, n.prototype.emitBuffered = function () {
      var t;for (t = 0; t < this.receiveBuffer.length; t++) f.apply(this, this.receiveBuffer[t]);for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);this.sendBuffer = [];
    }, n.prototype.ondisconnect = function () {
      u("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect");
    }, n.prototype.destroy = function () {
      if (this.subs) {
        for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();this.subs = null;
      }this.io.destroy(this);
    }, n.prototype.close = n.prototype.disconnect = function () {
      return this.connected && (u("performing disconnect (%s)", this.nsp), this.packet({ type: o.DISCONNECT })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
    }, n.prototype.compress = function (t) {
      return this.flags = this.flags || {}, this.flags.compress = t, this;
    };
  }, function (t, e) {
    function r(t, e) {
      var r = [];e = e || 0;for (var n = e || 0; n < t.length; n++) r[n - e] = t[n];return r;
    }t.exports = r;
  }, function (t, e) {
    "use strict";
    function r(t, e, r) {
      return t.on(e, r), { destroy: function () {
          t.removeListener(e, r);
        } };
    }t.exports = r;
  }, function (t, e) {
    var r = [].slice;t.exports = function (t, e) {
      if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");var n = r.call(arguments, 2);return function () {
        return e.apply(t, n.concat(r.call(arguments)));
      };
    };
  }, function (t, e) {
    function r(t) {
      t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
    }t.exports = r, r.prototype.duration = function () {
      var t = this.ms * Math.pow(this.factor, this.attempts++);if (this.jitter) {
        var e = Math.random(),
            r = Math.floor(e * this.jitter * t);t = 0 == (1 & Math.floor(10 * e)) ? t - r : t + r;
      }return 0 | Math.min(t, this.max);
    }, r.prototype.reset = function () {
      this.attempts = 0;
    }, r.prototype.setMin = function (t) {
      this.ms = t;
    }, r.prototype.setMax = function (t) {
      this.max = t;
    }, r.prototype.setJitter = function (t) {
      this.jitter = t;
    };
  }]);
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTQ3YzBhZjI3ZDYzNTNlNGY5N2EiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc2V2aWNlcy90YWJsZS5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc2V2aWNlcy91c2VyLmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9yb29tL3Jvb20uanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9jaGFydC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3ZlbmRvci9zb2NrZXQuaW8ubWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE0N2MwYWYyN2Q2MzUzZTRmOTdhIiwidmFyIGNvbmZpZyA9IHtcbiAgICAnY291bnRfcm93X2JpZHMnOiA1LFxuICAgICdrZXlfYmlkcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdrZXlfYXNrcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdjb3VudF9yb3dfYXNrJzogNSxcbiAgICAnY291bnRfdHJhZGVfaGlzdG9yeSc6IDEwLFxuICAgICdrZXlzX21hcmtldF9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0J10sXG4gICAgJ2NvdW50X29yZGVyX29wZW4nOiA1LFxuICAgICdrZXlzX29yZGVyX29wZW4nOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ2NvdW50X29yZGVyX2hpc3RvcnknOiA1LFxuICAgICdrZXlzX29yZGVyX2hpc3RvcnknOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ3Jvb21zJzogW1xuICAgICAgICAnRVVSLUdUUycsXG4gICAgICAgICdFVVItTkxHJyxcbiAgICAgICAgJ0VVUi1FVEgnLFxuICAgICAgICAnRVVSLVpFQydcbiAgICBdXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvY29uZmlnLmpzIiwidmFyIFRhYmxlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9iamVjdCwgdXNlckluZm8pIHtcbiAgICB2YXIgayA9IDEwOyAvL2NvdW50IG9mIHRoZSByZWNvcmRzIGluIHRoZSB0YWJsZXNcblxuICAgIC8vSW5pdCB0aGUgb2JqZWN0XG4gICAgdmFyIHVzZXIgPSB1c2VySW5mbzsgICAgICAgICAgICAgICAgICAgIC8vdGhlIHVzZXIgb2JqZWN0IGZyb20gdGhlIHJvb20uanMgXG4gICAgdmFyIHRhYmxlSUQgPSAkKGVsZW1lbnQpLmF0dHIoJ2lkJyk7ICAgIC8vaG9sZCB0aGUgSUQgb2YgdGhlIHRhYmxlIG9mIHRoaXMgb2JqZWN0XG4gICAgdmFyIHRhYmxlID0gJChlbGVtZW50KS5maW5kKCd0Ym9keScpOyAgIC8vdGhlIERPTSBlbGVtZW50IG9mIHRoZSB0YWJsZVxuICAgIHZhciBrZXlzID0gb2JqZWN0WydrZXlzJ107ICAgICAgICAgICAgICAvL1RoZSBuYW1lIG9mIGNvbHVtbnMgZnJvbSB0aGVhZCBpbiB0aGUgb3JkZXJcbiAgICB2YXIgdGFibGVWYWx1ZSA9IG9iamVjdFsnZmlyc3QnXSB8fCBbXTsgLy9UaGUgYXJyYXkgb2YgdGhlIHJlY29yZHMgb2YgdGhpcyB0YWJsZVxuICAgIHZhciBmaXJzdFBhZ2VJblRhYmxlID0gMTsgICAgICAgICAgICAgICAvL1RoZSBudW1iZXIgb2YgZmlyc3QgcGFnZSBvZiB0aGUgcmVjb3JkcyB0aGF0IGlzIHNhdmluZ1xuICAgIHZhciB0YWJsZUxlbmd0aCA9IG9iamVjdFsnY291bnQnXTsgICAgICAvL01BWCBjb3VudCBvZiB0aGUgcmVjb3JkcyBpbiB0aGlzIHRhYmxlIC9vbiB0aGUgc2VydmVyXG5cbiAgICB2YXIgY291bnRPZlJvd3MgPSAodGFibGVWYWx1ZS5sZW5ndGggPCBrKSA/IHRhYmxlVmFsdWUubGVuZ3RoIDogaztcbiAgICAvL01BWCBjb3VudCBvZiB0aGUgcmVjb3JkcyBpbiB0aGUgdGFibGVzICAgIFxuICAgIHZhciBwYWdlTnVtYmVyID0gMTsgICAgICAgICAgICAgICAgICAgICAvL1BhZ2Ugb2YgdGhlIHRhYmxlIHRoYXQgaXMgc2hvd2luZyBvbiB0aGUgc2l0ZVxuICAgIHZhciBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKHRhYmxlTGVuZ3RoIC8gY291bnRPZlJvd3MpO1xuICAgIC8vQ2FsYyB0aGUgY291bnQgb2YgdGhlIHBhZ2VzIFxuXG4gICAgLy9VcGRhdGUgdGhlIGNvdW50IG9mIHRoZSBwYWdlc1xuICAgIGZ1bmN0aW9uIHNldE5ld1BhZ2VDb3VudCgpIHtcbiAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh0YWJsZUxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9Eb3dubG9hZCB0aGUgcmVjb3JkcyBvZiB0aGUgdGFibGUgdmlhIEFKQVhcbiAgICAvLyAgJ2Zyb21OdW1iZXInIC0gZnJvbSB3aGljaCBudW1iZXIgdGhlIHJlY29yZHMgYXJlIHJlcXVlc3RlZCxcbiAgICAvLyAgJ2J1dHRvbicgICAgIC0gd2hpY2ggZnVuY3Rpb24gaXMgY2FsbGluZyB0aGlzIHJlcXVlc3QgXG4gICAgZnVuY3Rpb24gZG93bmxvYWROZXh0KGZyb21OdW1iZXIsIGJ1dHRvbikge1xuICAgICAgICAvL2ZvciAnZmlyc3QnLCAnbGFzdCcgb3IgJ3VwZGF0ZScgd2UncmUgZ29pbmcgdG8gdXBkYXRlIHRoZSBhbGwgdGFibGVcbiAgICAgICAgLy9mb3IgdGhlIHJlc3Qgb25seSAyMCByZWNvcmRzXG4gICAgICAgIHZhciBjb3VudEZvckxvYWRlZCA9ICgoYnV0dG9uID09PSAnZmlyc3QnKSB8fCAoYnV0dG9uID09PSAnbGFzdCcpIHx8IChidXR0b24gPT09ICd1cGRhdGUnKSkgPyA1MCA6IDIgKiBrO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6Nzc3Ny9nZXRfbmV4dF9yZWNvcmRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ2Zyb21OdW1iZXInOiBmcm9tTnVtYmVyLCAvL2Zyb20gd2hpY2ggbnVtYmVyIHRoZSByZWNvcmRzIGFyZSByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAnY291bnQnOiBjb3VudEZvckxvYWRlZCwgLy9ob3cgbWFueSByZWNvcmRzIGFyZSByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAncm9vbSc6IHVzZXJbJ3Jvb20nXSwgLy90aGlzIGlzIHRoZSByb29tIHdoZXJlIGEgdXNlciBpcyBsb2dnaW5nLFxuICAgICAgICAgICAgICAgICd0YWJsZSc6IHRhYmxlSUQgICAgICAgICAgICAvL3RoZSBJRCBvZiB0aGUgdGFibGUgd2hvc2UgcmVjb3JkcyBhcmUgcmVxdWVzdGVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiXG4gICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLy9pZiBBSkFYIFBPU1QgcmVxdWVzdCAgaXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09ICduZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVWYWx1ZS5zcGxpY2UoMCwgMiAqIGspOyAvL3JlbW92ZSB0aGUgdW5uZWNlc3NhcnkgcmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVWYWx1ZS5wdXNoLmFwcGx5KHRhYmxlVmFsdWUsIGpzb25bJ3ZhbHVlJ10pOyAvLyBhZGQgbmV3IGZyb20gdGhlIHJlc3BvbnNlXG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09ICdwcmV2aW91cycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVZhbHVlLnNwbGljZSgyMCwgKDMgKiBrKSk7Ly9yZW1vdmUgdGhlIHVubmVjZXNzYXJ5IHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMiA9IGpzb25bJ3ZhbHVlJ10uc2xpY2UoKTsgLy8gYWRkIG5ldyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycjIucHVzaC5hcHBseShhcnIyLCB0YWJsZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVZhbHVlID0gYXJyMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdFBhZ2VJblRhYmxlID4gMikgLy91cGRhdGUgdGhlIGZpcnN0UGFnZUluVGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IGZpcnN0UGFnZUluVGFibGUgLSAyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09ICdmaXJzdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IDE7IC8vdXBkYXRlIHRoZSBmaXJzdFBhZ2VJblRhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUgPSBqc29uWyd2YWx1ZSddOyAvL3VwZGF0ZSB0aGUgdGFibGVWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYnV0dG9uID09PSAnbGFzdCcpIHx8IChidXR0b24gPT09ICd1cGRhdGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVWYWx1ZSA9IGpzb25bJ3ZhbHVlJ107ICAvL3VwZGF0ZSB0aGUgdGFibGVWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTsgIC8vdXBkYXRlIHRoZSB2aWV3IHRoZSB0YWJsZSwgc2hvdyBuZXcgcmVjb3Jkc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoeGhyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9DcmVhdGUgdGhlIHBhZ2luYXRpb24gZm9yIHRoaXMgdGFibGVcbiAgICBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAvL0FkZCB0aGUgSFRNTCBzdHJ1Y3R1cmVcbiAgICAgICAgJCgnIycgKyB0YWJsZUlEKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdwYWdpbm5hdGlvbic+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nZmlyc3QnPkZpcnN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldmlvdXMnPnByZXZpb3VzPC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3BhZ2UtbnVtYmVyJz5cIiArIHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50ICsgXCI8L3NwYW4+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dCc+TmV4dDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2xhc3QnPkxhc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgLy9BZGQgdGhlIEV2ZW50TGlzdGVuZXJzIGZvciB0aGUgY29udHJvbCBidXR0b25zXG4gICAgICAgICQoJyMnICsgdGFibGVJRCkuZmluZCgnLmZpcnN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyID49IDMpICYmICh0YWJsZUxlbmd0aCA+IDUwKSkgeyAvL2lmIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB0YWJsZVZhbHVlXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgZG93bmxvYWROZXh0KDEsICdmaXJzdCcpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgICQoJyMnICsgdGFibGVJRCkuZmluZCgnLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFnZU51bWJlciA8IHBhZ2VDb3VudCAtIDEpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyKys7XG4gICAgICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyID4gMykgJiYgKHRhYmxlTGVuZ3RoID4gNTApKSB7IC8vaWYgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHRhYmxlVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyIC0gMikgJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFBhZ2VJblRhYmxlID0gZmlyc3RQYWdlSW5UYWJsZSArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChwYWdlTnVtYmVyICsgMSkgKyAxLCAnbmV4dCcpOy8vbG9hZCB0aGUgcmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZU51bWJlciA9PT0gcGFnZUNvdW50IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyKys7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5wcmV2aW91cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwYWdlTnVtYmVyID4gMSkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXItLTtcbiAgICAgICAgICAgICAgICBpZiAoKHBhZ2VOdW1iZXIgPiAyKSAmJiAocGFnZU51bWJlciArIDEgPCBwYWdlQ291bnQpICYmICh0YWJsZUxlbmd0aCA+IDUwKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHBhZ2VOdW1iZXIgLSAxKSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvd25sb2FkTmV4dChrICogKHBhZ2VOdW1iZXIgLSAzKSArIDEsICdwcmV2aW91cycpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5sYXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyICsgMiA+PSBwYWdlQ291bnQpICYmICh0YWJsZUxlbmd0aCA+IDUwKSkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSBwYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICAgICAgICAgICAgICAvL1VwZGF0ZSB0aGUgZmlyc3RQYWdlSW5UYWJsZVxuICAgICAgICAgICAgICAgIGlmICgocGFnZU51bWJlciAlIDIpID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBmaXJzdFBhZ2VJblRhYmxlID0gcGFnZUNvdW50IC0gMztcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UGFnZUluVGFibGUgPSBwYWdlTnVtYmVyIC0gMjtcblxuICAgICAgICAgICAgICAgIGRvd25sb2FkTmV4dChrICogKGZpcnN0UGFnZUluVGFibGUgLSAxKSArIDEsICdsYXN0Jyk7IC8vbG9hZCB0aGUgcmVjb3Jkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9EZWxldGUgdGhlIHBhZ2luYXRpb25cbiAgICBmdW5jdGlvbiBkZWxldGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAkKCcjJyArIHRhYmxlSUQpLmZpbmQoJy5wYWdpbm5hdGlvbicpLnJlbW92ZSgpO1xuICAgIH1cbiAgICA7XG5cbiAgICAvL1JlY291bnQgdGhlIG51bWJlcnMgb2YgdGhlIHBhZ2luYXRpb25cbiAgICBmdW5jdGlvbiBjaGFuZ2VQYWdlVmlldygpIHtcbiAgICAgICAgLy9SZXBsYWNlIHRoZSBudW1iZXJzXG4gICAgICAgICQodGFibGUpLmZpbmQoJy5wYWdlLW51bWJlcicpLnRleHQocGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQpO1xuICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgIH1cbiAgICA7XG5cbiAgICAvL3VwZGF0ZSB0aGUgdmFsdWVzIGluIHRoZSB0YWJsZSB3aGljaCBhcmUgc2hvd24gXG4gICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgIHZhciByb3cgPSAnJzsgLy90aGUgbmV3IHJvdyA8dHI+IG9mIHRoZSB0YWJsZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHsgLy9mb3IgYWxsIHJvd3Mgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICAvL0dldCB0aGUgY3VycmVudCByb3dcbiAgICAgICAgICAgIHZhciByb3dPZlRhYmxlID0gJCh0YWJsZSkuZmluZCgndHI6ZXEoICcgKyBpICsgJyknKTtcbiAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgIC8vaWYgbmVjZXNzYXJ5IHJlY29yZCBleGlzdCBpbiB0aGUgdGFibGVcbiAgICAgICAgICAgIGlmICh0YWJsZVZhbHVlW2kgKyBrICogKHBhZ2VOdW1iZXIgLSBmaXJzdFBhZ2VJblRhYmxlKV0pIHtcbiAgICAgICAgICAgICAgICAvL3RoZSBsb29wIGJ5IGtleXNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAvL2FkZCBjb2x1bW4gd2l0aCBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbCA9IHBhcnNlRmxvYXQodGFibGVWYWx1ZVtpICsgayAqIChwYWdlTnVtYmVyIC0gZmlyc3RQYWdlSW5UYWJsZSldW2tleXNba2V5XV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGwmJihrZXlzW2tleV0gIT09ICdEYXRlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGVtcGwudG9GaXhlZCg4KSArICc8L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+JyArIHRhYmxlVmFsdWVbaSArIGsgKiAocGFnZU51bWJlciAtIGZpcnN0UGFnZUluVGFibGUpXVtrZXlzW2tleV1dICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3cgKz0gJzwvdHI+JztcbiAgICAgICAgICAgICAgICAvL2lmIHRoZSBjdXJyZW50IHJvdyBpbiB0aGUgdGFibGUgaXMgbm90IGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgaWYgKHJvd09mVGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYnV0IHdlIG5lZWQgbW9yZSB0aGVuIHJvd3MgYXJlXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudE9mUm93cyA+ICQodGFibGUpLmZpbmQoJ3RyJykubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hZGQgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRhYmxlKS5hcHBlbmQocm93KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2lmIGp1c3QgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudE9mUm93cyA+PSAkKHRhYmxlKS5maW5kKCd0cicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChyb3dPZlRhYmxlKS5yZXBsYWNlV2l0aChyb3cpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiB0YWJsZSBpcyB0b28gc21hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyb3dPZlRhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gJzx0cj4nO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH1cbiAgICA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvL2NyZWF0ZSBhIG5ldyB0YWJsZSwgYWRkIHRoZSByZWNvcmRzXG4gICAgICAgIGNyZWF0ZVRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gJyc7ICAgICAgICAgLy8gdGhlIHJvdyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIHZhciByb3dUZW1wbGF0ZSA9ICcnOyAvLyB0aGUgYm9keSBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YWJsZVZhbHVlW2ldW2tleXNba2V5XV0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGwgPSBwYXJzZUZsb2F0KHRhYmxlVmFsdWVbaV1ba2V5c1trZXldXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbCYmKGtleXNba2V5XSAhPT0gJ0RhdGUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0ZW1wbC50b0ZpeGVkKDgpICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGFibGVWYWx1ZVtpXVtrZXlzW2tleV1dICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3cgKz0gJzwvdHI+JztcbiAgICAgICAgICAgICAgICByb3dUZW1wbGF0ZSArPSByb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0FkZCBIVE1MIHRlbXBsYXRlIHRvIHBhZ2VcbiAgICAgICAgICAgICQodGFibGUpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKHJvd1RlbXBsYXRlKTtcblxuICAgICAgICAgICAgaWYgKGNvdW50T2ZSb3dzIDwgdGFibGVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9VcGRhdGUgdGhlIHZhbHVlcyBvZiB0YWJsZVZhbHVlIGFuZCBjaGFuZ2UgdGhlIHJlY29yZHMgd2hpY2ggYXJlIHNob3duXG4gICAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgICAgICAvL2lmIHVwZGF0ZWQgZGF0YSBoYXZlIGNhbWUgd2hlbiB3ZSBzYXZlIHRoZSBmaXJzdCA1IHBhZ2VzXG4gICAgICAgICAgICBpZiAoZmlyc3RQYWdlSW5UYWJsZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFsnZmlyc3QnXTtcbiAgICAgICAgICAgICAgICB0YWJsZUxlbmd0aCA9IG9iamVjdFsnY291bnQnXTtcbiAgICAgICAgICAgICAgICBzZXROZXdQYWdlQ291bnQoKTtcblxuICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChjb3VudE9mUm93cyA8PSB0YWJsZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnIycgKyB0YWJsZUlEKS5maW5kKCcucGFnaW5uYXRpb24nKS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50T2ZSb3dzID0gaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChmaXJzdFBhZ2VJblRhYmxlIC0gMSkgKyAxLCAndXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgc2V0TmV3UGFnZUNvdW50KCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NldmljZXMvdGFibGUuanMiLCJ2YXIgVXNlciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHVzZXJfaWQgPSBkYXRhWyd1c2VyX2lkJ10gfHwgJyc7XG4gICAgYWN0aXZlUm9vbSA9IGRhdGFbJ3Jvb20nXTtcbiAgICB2YXIgZmlyc3RDdXJyZW5jeSA9IGRhdGFbJ2ZpcnN0Q3VycmVuY3knXSB8fCAwO1xuICAgIHZhciBzZWNvbmRDdXJyZW5jeSA9IChkYXRhWydzZWNvbmRDdXJyZW5jeSddKSB8fCAwO1xuICAgIFxuICAgIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlT2ZDdXJyZW5jZXMgKCl7XG4gICAgICAgICAgICAgICAgJCgnI2F2YWlsYWJsZUZpcnN0JykuaHRtbChmaXJzdEN1cnJlbmN5KTtcbiAgICAgICAgICAgICAgICAkKCcjYXZhaWxhYmxlU2Vjb25kJykuaHRtbChzZWNvbmRDdXJyZW5jeSk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gIHtcbiAgICAgICAgdXNlcklkOiB1c2VyX2lkLFxuICAgICAgICByb29tOiBhY3RpdmVSb29tLFxuICAgICAgICBmaXJzdEN1cnJlbmN5OiBmaXJzdEN1cnJlbmN5LFxuICAgICAgICBzZWNvbmRDdXJyZW5jeTogc2Vjb25kQ3VycmVuY3ksXG5cbiAgICAgICAgc2V0Q3VycmVuY2llczogZnVuY3Rpb24gKGN1cnJlbmNpZXMpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW5jaWVzW2ZpcnN0Q3VycmVuY3ldKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RDdXJyZW5jeSA9IGN1cnJlbmNpZXNbZmlyc3RDdXJyZW5jeV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBpZiAoY3VycmVuY2llc1tzZWNvbmRDdXJyZW5jeV0pIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRDdXJyZW5jeSA9IGN1cnJlbmNpZXNbc2Vjb25kQ3VycmVuY3ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlVmFsdWVPZkN1cnJlbmNlcygpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zZXZpY2VzL3VzZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIENsaWVudFNvY2tldHMob2JqZWN0T2ZUYWJsZXMsIHVzZXIpIHtcbiAgICBcbiAgICAvL0ZldGNoIHRoZSBsaWJzXG4gICAgdmFyIGlvID0gcmVxdWlyZSgnLi92ZW5kb3Ivc29ja2V0LmlvLm1pbicpO1xuXG4gICAgLy9HZXQgdGhlIG5hbWUgb2YgdGhlIHJvb21cbiAgICB2YXIgcm9vbSA9IHVzZXIucm9vbTtcblxuICAgIHZhciBhc2sgPSBvYmplY3RPZlRhYmxlc1snYXNrcyddLFxuICAgICAgICAgICAgYmlkcyA9IG9iamVjdE9mVGFibGVzWydiaWRzJ10sXG4gICAgICAgICAgICB0cmFkZSA9IG9iamVjdE9mVGFibGVzWydtYXJrZXRIaXN0b3J5J10sXG4gICAgICAgICAgICBvcmRlck9wZW4gPSBvYmplY3RPZlRhYmxlc1snb3Blbk9yZGVycyddLFxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5ID0gb2JqZWN0T2ZUYWJsZXNbJ29yZGVySGlzdG9yeSddO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghd2luZG93LldlYlNvY2tldCkge1xuICAgICAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlNvY2tldC4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBjb25uZWN0aW9uXG4gICAgICAgICAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgIHZhciBjaCA9IHJlcXVpcmUoJy4vY2hhcnQnKTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gbmV3IGNoO1xuXG4gICAgICAgICAgICAgICAgLy9Db25uZWN0aW9uIHRvIHRoZSByb29tXG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ3Jvb20nLCByb29tKTtcblxuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdkYXRhX3RvX2NoYXJ0JywgJycpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignZGF0YV90b19jaGFydCcsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAvLyBjaGFydCA9IHJlcXVpcmUoJy4vY2hhcnQnKShtc2cpO1xuICAgICAgICAgICAgICAgICAgLy8gIGNoYXJ0LmxvYWREYXRhKG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdjaGFydF9zdHJlYW0nLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjaGFydC5zdHJlYW0obXNnWydhcnJheSddKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vTGlzdGVuIHRoZSBzb2NrZXRzIHRvIGNoYW5nZSB0aGUgdGFibGVzXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdhc2snLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzay51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdiaWRzJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBiaWRzLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ3RyYWRlX2hpc3RvcnknLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWRlLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ29yZGVyX29wZW4nLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyT3Blbi51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdvcmRlcl9oaXN0b3J5JywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlckhpc3RvcnkudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICAvL0RldmVsb3BtZW50XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH07XG59XG47XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50U29ja2V0cztcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuanMiLCJ2YXIgQ29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XG52YXIgcm9vbTtcbnZhciByb29tcyA9IENvbmZpZ1sncm9vbXMnXTtcbnZhciBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuLy9TZWxlY3Qgcm9vbSAoaWYgVVJMIGNvbnRhaW5zIHRoZSBuYW1lIG9mIHRoZSByb29tKVxucm9vbXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIGlmIChwYXRobmFtZS5pbmRleE9mKGVsZW1lbnQpID49IDApIHtcbiAgICAgICAgcm9vbSA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIDtcbn0pO1xuXG5cbnZhciBDbGllbnRTb2NrZXRzID0gcmVxdWlyZSgnLi4vc29ja2V0LmlvL3NvY2tldCcpO1xudmFyIHNlcnZpY2U7XG5cbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vc2V2aWNlcy91c2VyJyk7XG4vL1RoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgdXNlciBkYXRhXG52YXIgdXNlcjtcblxudmFyIFRhYmxlID0gcmVxdWlyZSgnLi4vc2V2aWNlcy90YWJsZScpO1xuXG4vL0VhY2ggb25lIG9mIHRhYmxlcyBjb250YWluIHRoZSBvYmplY3Qgd2l0aCBkYXRhIGFuZCBjb250cm9sIGJ1dHRvbnNcbnZhciBiaWRzVGFibGUsIGFza3NUYWJsZSwgbWFya2V0SGlzdG9yeVRhYmxlLCBvcGVuT3JkZXJzVGFibGUsIG9yZGVySGlzdG9yeVRhYmxlO1xuXG5cbi8vd2hlbiBvdXIgcGFnZSBhcmUgbG9hZGVkLCB3ZSBuZWVkIHRvIGdldCB0aGUgaW5pdCBkYXRhXG4kLmFqYXgoe1xuICAgIHVybDogYmFzZV91cmwgKyBcIm1hcmtldHMvZ2V0X2luaXRfZGF0YS9cIiArIHJvb20gKyBcIi9cIiArICQoXCJkaXZbZGF0YS1zdWlkXVwiKS5hdHRyKCdkYXRhLXN1aWQnKSxcbiAgICB0eXBlOiBcImdldFwiLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIlxufSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIC8vaWYgd2UgZ290IHRoZSByZXNwb25zZSBcbiAgICAgICAgICAgIC8vY3JlYXRlIHRoZSB1c2VyIG9iamVjdFxuICAgICAgICAgICAgdXNlciA9IG5ldyBVc2VyKGpzb25bJ3VzZXInXSk7ICAvL3N0b3JlIHRoZSB1c2VyIGRhdGFcblxuICAgICAgICAgICAgLy9jaGFuZ2UgdGhlIGF2YWlsYWJsZSBjdXJyZW5jeVxuICAgICAgICAgICAgLy8gICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICBmaXJzdEN1cnJlbmN5OiAuLi4gLFxuLy8gICAgICAgICAgICAgICAgc2Vjb25kQ3VycmVuY3k6IC4uLlxuLy8gICAgICAgICAgICB9XG4gICAgICAgICAgICB1c2VyLnNldEN1cnJlbmNpZXMoanNvblsndXNlciddKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgb2JqZWN0cyBvZiB0aGUgdGFibGVzIGFuZCBzaG93IHRoZWlyXG4gICAgICAgICAgICBiaWRzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1iaWRzJywganNvblsndGFibGVzJ11bJ3RhYmxlLWJpZHMnXSwgdXNlcik7XG4gICAgICAgICAgICBiaWRzVGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgYXNrc1RhYmxlID0gbmV3IFRhYmxlKCcjdGFibGUtYXNrJywganNvblsndGFibGVzJ11bJ3RhYmxlLWFzayddLCB1c2VyKTtcbiAgICAgICAgICAgIGFza3NUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBtYXJrZXRIaXN0b3J5VGFibGUgPSBuZXcgVGFibGUoJyNtYXJrZXQtaGlzdG9yeScsIGpzb25bJ3RhYmxlcyddWydtYXJrZXQtaGlzdG9yeSddLCB1c2VyKTtcbiAgICAgICAgICAgIG1hcmtldEhpc3RvcnlUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBvcGVuT3JkZXJzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1vcGVuJywganNvblsndGFibGVzJ11bJ3RhYmxlLW9wZW4nXSwgdXNlcik7XG4gICAgICAgICAgICBvcGVuT3JkZXJzVGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5VGFibGUgPSBuZXcgVGFibGUoJyNvcmRlci1oaXN0b3J5JywganNvblsndGFibGVzJ11bJ29yZGVyLWhpc3RvcnknXSwgdXNlcik7XG4gICAgICAgICAgICBvcmRlckhpc3RvcnlUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IENsaWVudFNvY2tldHMoe1xuICAgICAgICAgICAgICAgICdiaWRzJzogYmlkc1RhYmxlLFxuICAgICAgICAgICAgICAgICdhc2tzJzogYXNrc1RhYmxlLFxuICAgICAgICAgICAgICAgICdtYXJrZXRIaXN0b3J5JzogbWFya2V0SGlzdG9yeVRhYmxlLFxuICAgICAgICAgICAgICAgICdvcGVuT3JkZXJzJzogb3Blbk9yZGVyc1RhYmxlLFxuICAgICAgICAgICAgICAgICdvcmRlckhpc3RvcnknOiBvcmRlckhpc3RvcnlUYWJsZVxuICAgICAgICAgICAgfSwgdXNlcik7XG4gICAgICAgICAgICBzZXJ2aWNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBlcnJvclRocm93bik7XG4gICAgICAgIH0pXG4gICAgICAgIC5hbHdheXMoZnVuY3Rpb24gKHhociwgc3RhdHVzKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVGhlIHJlcXVlc3QgaXMgY29tcGxldGUhXCIpO1xuICAgICAgICB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvcm9vbS9yb29tLmpzIiwiZnVuY3Rpb24gQ2hhcnRNYXJrZXQoKSB7XG4gICAgdmFyIGRhdGFUYWJsZTtcblxuICAgIGFueWNoYXJ0Lm9uRG9jdW1lbnRSZWFkeShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgZGF0YSBzZXRcbiAgICAgICAgLy8gIC9jaGFydC9jYW5kbGUvTkxHLzMwbWludXRlc1xuICAgICAgICBkYXRhVGFibGUgPSBhbnljaGFydC5kYXRhLnRhYmxlKCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFwiL2NoYXJ0L2NhbmRsZS9FVVItTkxHLzMwbWludXRlc1wiLFxuICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICBkYXRhVGFibGUuYWRkRGF0YShqc29uWydkYXRhJ10pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhVGFibGUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoeGhyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgcmVxdWVzdCBpcyBjb21wbGV0ZSFcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vZGF0YSA9IGFueWNoYXJ0LmRhdGEuc2V0KFtbRGF0ZS5VVEMoMjAwNywgOCwgNyksIDIyLjc1LCAyMy43LCAyMi42OSwgMjMuNDRdLCBbRGF0ZS5VVEMoMjAwNywgOCwgNiksIDIzLjAzLCAyMy4xNSwgMjIuNDQsIDIyLjk3XSwgW0RhdGUuVVRDKDIwMDcsIDgsIDMpLCAyMy4yLCAyMy4zOSwgMjIuODcsIDIyLjkyXSwgW0RhdGUuVVRDKDIwMDcsIDgsIDIpLCAyMi42NSwgMjMuNywgMjIuNjUsIDIzLjM2XSwgW0RhdGUuVVRDKDIwMDcsIDgsIDEpLCAyMy4xNywgMjMuNCwgMjIuODUsIDIzLjI1XSwgW0RhdGUuVVRDKDIwMDcsIDcsIDMxKSwgMjMuODgsIDIzLjkzLCAyMy4yNCwgMjMuMjVdLCBbRGF0ZS5VVEMoMjAwNywgNywgMzApLCAyMy41NSwgMjMuODgsIDIzLjM4LCAyMy42Ml0sIFtEYXRlLlVUQygyMDA3LCA3LCAyNyksIDIzLjk4LCAyNC40OSwgMjMuNDcsIDIzLjQ5XSwgW0RhdGUuVVRDKDIwMDcsIDcsIDI2KSwgMjMuMiwgMjMuMzksIDIyLjg3LCAyMi45Ml0sIFtEYXRlLlVUQygyMDA3LCA3LCAyNSksIDIyLjc1LCAyMy43LCAyMi42OSwgMjMuNDRdLCBbRGF0ZS5VVEMoMjAwNywgNywgMjQpLCAyMi42NSwgMjMuNywgMjIuNjUsIDIzLjM2XSwgW0RhdGUuVVRDKDIwMDcsIDcsIDIzKSwgMjMuNTUsIDIzLjg4LCAyMy4zOCwgMjMuNjJdXSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgY2hhcnRcbiAgICAgICAgY2hhcnQgPSBhbnljaGFydC5zdG9jaygpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBmaXJzdCBwbG90IG9uIHRoZSBjaGFydFxuICAgICAgICB2YXIgcGxvdCA9IGNoYXJ0LnBsb3QoKTtcbiAgICAgICAgcGxvdC5ncmlkKCkuZW5hYmxlZCh0cnVlKTtcbiAgICAgICAgcGxvdC5ncmlkKDEpLmVuYWJsZWQodHJ1ZSkubGF5b3V0KCd2ZXJ0aWNhbCcpO1xuICAgICAgICBwbG90Lm1pbm9yR3JpZCgpLmVuYWJsZWQodHJ1ZSk7XG4gICAgICAgIHBsb3QubWlub3JHcmlkKDEpLmVuYWJsZWQodHJ1ZSkubGF5b3V0KCd2ZXJ0aWNhbCcpO1xuXG5cblxuICAgICAgICAvLyBtYXAgdGhlIGRhdGFcbiAgICAgICAgdmFyIHNlcmllc0RhdGEgPSBkYXRhVGFibGUubWFwQXMoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnb3Blbic6IDEsXG4gICAgICAgICAgICAgICAgICAgICdoaWdoJzogMixcbiAgICAgICAgICAgICAgICAgICAgJ2xvdyc6IDMsXG4gICAgICAgICAgICAgICAgICAgICdjbG9zZSc6IDQsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHtjb2x1bW46IDQsIHR5cGU6ICdjbG9zZSd9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBzZXJpZXMgPSBwbG90LmNhbmRsZXN0aWNrKHNlcmllc0RhdGEpLm5hbWUoJ1RpbWVsaW5lJyk7XG4gICAgICAgIHNlcmllcy5sZWdlbmRJdGVtKCkuaWNvblR5cGUoJ3Jpc2luZ2ZhbGxpbmcnKTtcblxuXG4gICAgICAgIGNoYXJ0LmNvbnRhaW5lcihcImNvbnRhaW5lcl9jaGFydFwiKTtcbiAgICAgICAgY2hhcnQuZHJhdygpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RyZWFtOiBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobmV3RGF0YSk7XG4gICAgICAgICAgICBkYXRhLmFwcGVuZChuZXdEYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRNYXJrZXQ7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9jaGFydC5qcyIsIiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuaW89ZSgpOnQuaW89ZSgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUobil7aWYocltuXSlyZXR1cm4gcltuXS5leHBvcnRzO3ZhciBvPXJbbl09e2V4cG9ydHM6e30saWQ6bixsb2FkZWQ6ITF9O3JldHVybiB0W25dLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLGUpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgcj17fTtyZXR1cm4gZS5tPXQsZS5jPXIsZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmkodCkpJiYoZT10LHQ9dm9pZCAwKSxlPWV8fHt9O3ZhciByLG49cyh0KSxhPW4uc291cmNlLHA9bi5pZCxmPW4ucGF0aCxsPWhbcF0mJmYgaW4gaFtwXS5uc3BzLGQ9ZS5mb3JjZU5ld3x8ZVtcImZvcmNlIG5ldyBjb25uZWN0aW9uXCJdfHwhMT09PWUubXVsdGlwbGV4fHxsO3JldHVybiBkPyh1KFwiaWdub3Jpbmcgc29ja2V0IGNhY2hlIGZvciAlc1wiLGEpLHI9YyhhLGUpKTooaFtwXXx8KHUoXCJuZXcgaW8gaW5zdGFuY2UgZm9yICVzXCIsYSksaFtwXT1jKGEsZSkpLHI9aFtwXSksbi5xdWVyeSYmIWUucXVlcnk/ZS5xdWVyeT1uLnF1ZXJ5OmUmJlwib2JqZWN0XCI9PT1pKGUucXVlcnkpJiYoZS5xdWVyeT1vKGUucXVlcnkpKSxyLnNvY2tldChuLnBhdGgsZSl9ZnVuY3Rpb24gbyh0KXt2YXIgZT1bXTtmb3IodmFyIHIgaW4gdCl0Lmhhc093blByb3BlcnR5KHIpJiZlLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHIpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudCh0W3JdKSk7cmV0dXJuIGUuam9pbihcIiZcIil9dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0scz1yKDEpLGE9cig3KSxjPXIoMTcpLHU9cigzKShcInNvY2tldC5pby1jbGllbnRcIik7dC5leHBvcnRzPWU9bjt2YXIgaD1lLm1hbmFnZXJzPXt9O2UucHJvdG9jb2w9YS5wcm90b2NvbCxlLmNvbm5lY3Q9bixlLk1hbmFnZXI9cigxNyksZS5Tb2NrZXQ9cig0NCl9LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LHIpe3ZhciBuPXQ7cj1yfHxlLmxvY2F0aW9uLG51bGw9PXQmJih0PXIucHJvdG9jb2wrXCIvL1wiK3IuaG9zdCksXCJzdHJpbmdcIj09dHlwZW9mIHQmJihcIi9cIj09PXQuY2hhckF0KDApJiYodD1cIi9cIj09PXQuY2hhckF0KDEpP3IucHJvdG9jb2wrdDpyLmhvc3QrdCksL14oaHR0cHM/fHdzcz8pOlxcL1xcLy8udGVzdCh0KXx8KGkoXCJwcm90b2NvbC1sZXNzIHVybCAlc1wiLHQpLHQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHI/ci5wcm90b2NvbCtcIi8vXCIrdDpcImh0dHBzOi8vXCIrdCksaShcInBhcnNlICVzXCIsdCksbj1vKHQpKSxuLnBvcnR8fCgvXihodHRwfHdzKSQvLnRlc3Qobi5wcm90b2NvbCk/bi5wb3J0PVwiODBcIjovXihodHRwfHdzKXMkLy50ZXN0KG4ucHJvdG9jb2wpJiYobi5wb3J0PVwiNDQzXCIpKSxuLnBhdGg9bi5wYXRofHxcIi9cIjt2YXIgcz1uLmhvc3QuaW5kZXhPZihcIjpcIikhPT0tMSxhPXM/XCJbXCIrbi5ob3N0K1wiXVwiOm4uaG9zdDtyZXR1cm4gbi5pZD1uLnByb3RvY29sK1wiOi8vXCIrYStcIjpcIituLnBvcnQsbi5ocmVmPW4ucHJvdG9jb2wrXCI6Ly9cIithKyhyJiZyLnBvcnQ9PT1uLnBvcnQ/XCJcIjpcIjpcIituLnBvcnQpLG59dmFyIG89cigyKSxpPXIoMykoXCJzb2NrZXQuaW8tY2xpZW50OnVybFwiKTt0LmV4cG9ydHM9bn0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt2YXIgcj0vXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShodHRwfGh0dHBzfHdzfHdzcyk6XFwvXFwvKT8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPygoPzpbYS1mMC05XXswLDR9Oil7Miw3fVthLWYwLTldezAsNH18W146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxuPVtcInNvdXJjZVwiLFwicHJvdG9jb2xcIixcImF1dGhvcml0eVwiLFwidXNlckluZm9cIixcInVzZXJcIixcInBhc3N3b3JkXCIsXCJob3N0XCIsXCJwb3J0XCIsXCJyZWxhdGl2ZVwiLFwicGF0aFwiLFwiZGlyZWN0b3J5XCIsXCJmaWxlXCIsXCJxdWVyeVwiLFwiYW5jaG9yXCJdO3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgZT10LG89dC5pbmRleE9mKFwiW1wiKSxpPXQuaW5kZXhPZihcIl1cIik7byE9LTEmJmkhPS0xJiYodD10LnN1YnN0cmluZygwLG8pK3Quc3Vic3RyaW5nKG8saSkucmVwbGFjZSgvOi9nLFwiO1wiKSt0LnN1YnN0cmluZyhpLHQubGVuZ3RoKSk7Zm9yKHZhciBzPXIuZXhlYyh0fHxcIlwiKSxhPXt9LGM9MTQ7Yy0tOylhW25bY11dPXNbY118fFwiXCI7cmV0dXJuIG8hPS0xJiZpIT0tMSYmKGEuc291cmNlPWUsYS5ob3N0PWEuaG9zdC5zdWJzdHJpbmcoMSxhLmhvc3QubGVuZ3RoLTEpLnJlcGxhY2UoLzsvZyxcIjpcIiksYS5hdXRob3JpdHk9YS5hdXRob3JpdHkucmVwbGFjZShcIltcIixcIlwiKS5yZXBsYWNlKFwiXVwiLFwiXCIpLnJlcGxhY2UoLzsvZyxcIjpcIiksYS5pcHY2dXJpPSEwKSxhfX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihuKXtmdW5jdGlvbiBvKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZcIldlYmtpdEFwcGVhcmFuY2VcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZXx8d2luZG93LmNvbnNvbGUmJihjb25zb2xlLmZpcmVidWd8fGNvbnNvbGUuZXhjZXB0aW9uJiZjb25zb2xlLnRhYmxlKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykmJnBhcnNlSW50KFJlZ0V4cC4kMSwxMCk+PTMxfWZ1bmN0aW9uIGkoKXt2YXIgdD1hcmd1bWVudHMscj10aGlzLnVzZUNvbG9ycztpZih0WzBdPShyP1wiJWNcIjpcIlwiKSt0aGlzLm5hbWVzcGFjZSsocj9cIiAlY1wiOlwiIFwiKSt0WzBdKyhyP1wiJWMgXCI6XCIgXCIpK1wiK1wiK2UuaHVtYW5pemUodGhpcy5kaWZmKSwhcilyZXR1cm4gdDt2YXIgbj1cImNvbG9yOiBcIit0aGlzLmNvbG9yO3Q9W3RbMF0sbixcImNvbG9yOiBpbmhlcml0XCJdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0LDEpKTt2YXIgbz0wLGk9MDtyZXR1cm4gdFswXS5yZXBsYWNlKC8lW2EteiVdL2csZnVuY3Rpb24odCl7XCIlJVwiIT09dCYmKG8rKyxcIiVjXCI9PT10JiYoaT1vKSl9KSx0LnNwbGljZShpLDAsbiksdH1mdW5jdGlvbiBzKCl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUubG9nJiZGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZyxjb25zb2xlLGFyZ3VtZW50cyl9ZnVuY3Rpb24gYSh0KXt0cnl7bnVsbD09dD9lLnN0b3JhZ2UucmVtb3ZlSXRlbShcImRlYnVnXCIpOmUuc3RvcmFnZS5kZWJ1Zz10fWNhdGNoKHQpe319ZnVuY3Rpb24gYygpe3RyeXtyZXR1cm4gZS5zdG9yYWdlLmRlYnVnfWNhdGNoKHQpe31pZihcInVuZGVmaW5lZFwiIT10eXBlb2YgbiYmXCJlbnZcImluIG4pcmV0dXJuIG4uZW52LkRFQlVHfWZ1bmN0aW9uIHUoKXt0cnl7cmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2V9Y2F0Y2godCl7fX1lPXQuZXhwb3J0cz1yKDUpLGUubG9nPXMsZS5mb3JtYXRBcmdzPWksZS5zYXZlPWEsZS5sb2FkPWMsZS51c2VDb2xvcnM9byxlLnN0b3JhZ2U9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZS5zdG9yYWdlP2Nocm9tZS5zdG9yYWdlLmxvY2FsOnUoKSxlLmNvbG9ycz1bXCJsaWdodHNlYWdyZWVuXCIsXCJmb3Jlc3RncmVlblwiLFwiZ29sZGVucm9kXCIsXCJkb2RnZXJibHVlXCIsXCJkYXJrb3JjaGlkXCIsXCJjcmltc29uXCJdLGUuZm9ybWF0dGVycy5qPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkodCl9Y2F0Y2godCl7cmV0dXJuXCJbVW5leHBlY3RlZEpTT05QYXJzZUVycm9yXTogXCIrdC5tZXNzYWdlfX0sZS5lbmFibGUoYygpKX0pLmNhbGwoZSxyKDQpKX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7dGhyb3cgbmV3IEVycm9yKFwic2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZFwiKX1mdW5jdGlvbiBuKCl7dGhyb3cgbmV3IEVycm9yKFwiY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkXCIpfWZ1bmN0aW9uIG8odCl7aWYoaD09PXNldFRpbWVvdXQpcmV0dXJuIHNldFRpbWVvdXQodCwwKTtpZigoaD09PXJ8fCFoKSYmc2V0VGltZW91dClyZXR1cm4gaD1zZXRUaW1lb3V0LHNldFRpbWVvdXQodCwwKTt0cnl7cmV0dXJuIGgodCwwKX1jYXRjaChlKXt0cnl7cmV0dXJuIGguY2FsbChudWxsLHQsMCl9Y2F0Y2goZSl7cmV0dXJuIGguY2FsbCh0aGlzLHQsMCl9fX1mdW5jdGlvbiBpKHQpe2lmKHA9PT1jbGVhclRpbWVvdXQpcmV0dXJuIGNsZWFyVGltZW91dCh0KTtpZigocD09PW58fCFwKSYmY2xlYXJUaW1lb3V0KXJldHVybiBwPWNsZWFyVGltZW91dCxjbGVhclRpbWVvdXQodCk7dHJ5e3JldHVybiBwKHQpfWNhdGNoKGUpe3RyeXtyZXR1cm4gcC5jYWxsKG51bGwsdCl9Y2F0Y2goZSl7cmV0dXJuIHAuY2FsbCh0aGlzLHQpfX19ZnVuY3Rpb24gcygpe3kmJmwmJih5PSExLGwubGVuZ3RoP2Q9bC5jb25jYXQoZCk6Zz0tMSxkLmxlbmd0aCYmYSgpKX1mdW5jdGlvbiBhKCl7aWYoIXkpe3ZhciB0PW8ocyk7eT0hMDtmb3IodmFyIGU9ZC5sZW5ndGg7ZTspe2ZvcihsPWQsZD1bXTsrK2c8ZTspbCYmbFtnXS5ydW4oKTtnPS0xLGU9ZC5sZW5ndGh9bD1udWxsLHk9ITEsaSh0KX19ZnVuY3Rpb24gYyh0LGUpe3RoaXMuZnVuPXQsdGhpcy5hcnJheT1lfWZ1bmN0aW9uIHUoKXt9dmFyIGgscCxmPXQuZXhwb3J0cz17fTshZnVuY3Rpb24oKXt0cnl7aD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBzZXRUaW1lb3V0P3NldFRpbWVvdXQ6cn1jYXRjaCh0KXtoPXJ9dHJ5e3A9XCJmdW5jdGlvblwiPT10eXBlb2YgY2xlYXJUaW1lb3V0P2NsZWFyVGltZW91dDpufWNhdGNoKHQpe3A9bn19KCk7dmFyIGwsZD1bXSx5PSExLGc9LTE7Zi5uZXh0VGljaz1mdW5jdGlvbih0KXt2YXIgZT1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aC0xKTtpZihhcmd1bWVudHMubGVuZ3RoPjEpZm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyllW3ItMV09YXJndW1lbnRzW3JdO2QucHVzaChuZXcgYyh0LGUpKSwxIT09ZC5sZW5ndGh8fHl8fG8oYSl9LGMucHJvdG90eXBlLnJ1bj1mdW5jdGlvbigpe3RoaXMuZnVuLmFwcGx5KG51bGwsdGhpcy5hcnJheSl9LGYudGl0bGU9XCJicm93c2VyXCIsZi5icm93c2VyPSEwLGYuZW52PXt9LGYuYXJndj1bXSxmLnZlcnNpb249XCJcIixmLnZlcnNpb25zPXt9LGYub249dSxmLmFkZExpc3RlbmVyPXUsZi5vbmNlPXUsZi5vZmY9dSxmLnJlbW92ZUxpc3RlbmVyPXUsZi5yZW1vdmVBbGxMaXN0ZW5lcnM9dSxmLmVtaXQ9dSxmLmJpbmRpbmc9ZnVuY3Rpb24odCl7dGhyb3cgbmV3IEVycm9yKFwicHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWRcIil9LGYuY3dkPWZ1bmN0aW9uKCl7cmV0dXJuXCIvXCJ9LGYuY2hkaXI9ZnVuY3Rpb24odCl7dGhyb3cgbmV3IEVycm9yKFwicHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkXCIpfSxmLnVtYXNrPWZ1bmN0aW9uKCl7cmV0dXJuIDB9fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe3JldHVybiBlLmNvbG9yc1toKyslZS5jb2xvcnMubGVuZ3RoXX1mdW5jdGlvbiBvKHQpe2Z1bmN0aW9uIHIoKXt9ZnVuY3Rpb24gbygpe3ZhciB0PW8scj0rbmV3IERhdGUsaT1yLSh1fHxyKTt0LmRpZmY9aSx0LnByZXY9dSx0LmN1cnI9cix1PXIsbnVsbD09dC51c2VDb2xvcnMmJih0LnVzZUNvbG9ycz1lLnVzZUNvbG9ycygpKSxudWxsPT10LmNvbG9yJiZ0LnVzZUNvbG9ycyYmKHQuY29sb3I9bigpKTtmb3IodmFyIHM9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpLGE9MDthPHMubGVuZ3RoO2ErKylzW2FdPWFyZ3VtZW50c1thXTtzWzBdPWUuY29lcmNlKHNbMF0pLFwic3RyaW5nXCIhPXR5cGVvZiBzWzBdJiYocz1bXCIlb1wiXS5jb25jYXQocykpO3ZhciBjPTA7c1swXT1zWzBdLnJlcGxhY2UoLyUoW2EteiVdKS9nLGZ1bmN0aW9uKHIsbil7aWYoXCIlJVwiPT09cilyZXR1cm4gcjtjKys7dmFyIG89ZS5mb3JtYXR0ZXJzW25dO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG8pe3ZhciBpPXNbY107cj1vLmNhbGwodCxpKSxzLnNwbGljZShjLDEpLGMtLX1yZXR1cm4gcn0pLHM9ZS5mb3JtYXRBcmdzLmFwcGx5KHQscyk7dmFyIGg9by5sb2d8fGUubG9nfHxjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO2guYXBwbHkodCxzKX1yLmVuYWJsZWQ9ITEsby5lbmFibGVkPSEwO3ZhciBpPWUuZW5hYmxlZCh0KT9vOnI7cmV0dXJuIGkubmFtZXNwYWNlPXQsaX1mdW5jdGlvbiBpKHQpe2Uuc2F2ZSh0KTtmb3IodmFyIHI9KHR8fFwiXCIpLnNwbGl0KC9bXFxzLF0rLyksbj1yLmxlbmd0aCxvPTA7bzxuO28rKylyW29dJiYodD1yW29dLnJlcGxhY2UoL1tcXFxcXiQrPy4oKXxbXFxde31dL2csXCJcXFxcJCZcIikucmVwbGFjZSgvXFwqL2csXCIuKj9cIiksXCItXCI9PT10WzBdP2Uuc2tpcHMucHVzaChuZXcgUmVnRXhwKFwiXlwiK3Quc3Vic3RyKDEpK1wiJFwiKSk6ZS5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoXCJeXCIrdCtcIiRcIikpKX1mdW5jdGlvbiBzKCl7ZS5lbmFibGUoXCJcIil9ZnVuY3Rpb24gYSh0KXt2YXIgcixuO2ZvcihyPTAsbj1lLnNraXBzLmxlbmd0aDtyPG47cisrKWlmKGUuc2tpcHNbcl0udGVzdCh0KSlyZXR1cm4hMTtmb3Iocj0wLG49ZS5uYW1lcy5sZW5ndGg7cjxuO3IrKylpZihlLm5hbWVzW3JdLnRlc3QodCkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gYyh0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIEVycm9yP3Quc3RhY2t8fHQubWVzc2FnZTp0fWU9dC5leHBvcnRzPW8uZGVidWc9byxlLmNvZXJjZT1jLGUuZGlzYWJsZT1zLGUuZW5hYmxlPWksZS5lbmFibGVkPWEsZS5odW1hbml6ZT1yKDYpLGUubmFtZXM9W10sZS5za2lwcz1bXSxlLmZvcm1hdHRlcnM9e307dmFyIHUsaD0wfSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7aWYodD1TdHJpbmcodCksISh0Lmxlbmd0aD4xZTQpKXt2YXIgZT0vXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKHQpO2lmKGUpe3ZhciByPXBhcnNlRmxvYXQoZVsxXSksbj0oZVsyXXx8XCJtc1wiKS50b0xvd2VyQ2FzZSgpO3N3aXRjaChuKXtjYXNlXCJ5ZWFyc1wiOmNhc2VcInllYXJcIjpjYXNlXCJ5cnNcIjpjYXNlXCJ5clwiOmNhc2VcInlcIjpyZXR1cm4gcipoO2Nhc2VcImRheXNcIjpjYXNlXCJkYXlcIjpjYXNlXCJkXCI6cmV0dXJuIHIqdTtjYXNlXCJob3Vyc1wiOmNhc2VcImhvdXJcIjpjYXNlXCJocnNcIjpjYXNlXCJoclwiOmNhc2VcImhcIjpyZXR1cm4gcipjO2Nhc2VcIm1pbnV0ZXNcIjpjYXNlXCJtaW51dGVcIjpjYXNlXCJtaW5zXCI6Y2FzZVwibWluXCI6Y2FzZVwibVwiOnJldHVybiByKmE7Y2FzZVwic2Vjb25kc1wiOmNhc2VcInNlY29uZFwiOmNhc2VcInNlY3NcIjpjYXNlXCJzZWNcIjpjYXNlXCJzXCI6cmV0dXJuIHIqcztjYXNlXCJtaWxsaXNlY29uZHNcIjpjYXNlXCJtaWxsaXNlY29uZFwiOmNhc2VcIm1zZWNzXCI6Y2FzZVwibXNlY1wiOmNhc2VcIm1zXCI6cmV0dXJuIHI7ZGVmYXVsdDpyZXR1cm59fX19ZnVuY3Rpb24gbih0KXtyZXR1cm4gdD49dT9NYXRoLnJvdW5kKHQvdSkrXCJkXCI6dD49Yz9NYXRoLnJvdW5kKHQvYykrXCJoXCI6dD49YT9NYXRoLnJvdW5kKHQvYSkrXCJtXCI6dD49cz9NYXRoLnJvdW5kKHQvcykrXCJzXCI6dCtcIm1zXCJ9ZnVuY3Rpb24gbyh0KXtyZXR1cm4gaSh0LHUsXCJkYXlcIil8fGkodCxjLFwiaG91clwiKXx8aSh0LGEsXCJtaW51dGVcIil8fGkodCxzLFwic2Vjb25kXCIpfHx0K1wiIG1zXCJ9ZnVuY3Rpb24gaSh0LGUscil7aWYoISh0PGUpKXJldHVybiB0PDEuNSplP01hdGguZmxvb3IodC9lKStcIiBcIityOk1hdGguY2VpbCh0L2UpK1wiIFwiK3IrXCJzXCJ9dmFyIHM9MWUzLGE9NjAqcyxjPTYwKmEsdT0yNCpjLGg9MzY1LjI1KnU7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7ZT1lfHx7fTt2YXIgaT10eXBlb2YgdDtpZihcInN0cmluZ1wiPT09aSYmdC5sZW5ndGg+MClyZXR1cm4gcih0KTtpZihcIm51bWJlclwiPT09aSYmaXNOYU4odCk9PT0hMSlyZXR1cm4gZS5sb25nP28odCk6bih0KTt0aHJvdyBuZXcgRXJyb3IoXCJ2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPVwiK0pTT04uc3RyaW5naWZ5KHQpKX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8odCl7dmFyIHI9XCJcIixuPSExO3JldHVybiByKz10LnR5cGUsZS5CSU5BUllfRVZFTlQhPXQudHlwZSYmZS5CSU5BUllfQUNLIT10LnR5cGV8fChyKz10LmF0dGFjaG1lbnRzLHIrPVwiLVwiKSx0Lm5zcCYmXCIvXCIhPXQubnNwJiYobj0hMCxyKz10Lm5zcCksbnVsbCE9dC5pZCYmKG4mJihyKz1cIixcIixuPSExKSxyKz10LmlkKSxudWxsIT10LmRhdGEmJihuJiYocis9XCIsXCIpLHIrPWYuc3RyaW5naWZ5KHQuZGF0YSkpLHAoXCJlbmNvZGVkICVqIGFzICVzXCIsdCxyKSxyfWZ1bmN0aW9uIGkodCxlKXtmdW5jdGlvbiByKHQpe3ZhciByPWQuZGVjb25zdHJ1Y3RQYWNrZXQodCksbj1vKHIucGFja2V0KSxpPXIuYnVmZmVycztpLnVuc2hpZnQobiksZShpKX1kLnJlbW92ZUJsb2JzKHQscil9ZnVuY3Rpb24gcygpe3RoaXMucmVjb25zdHJ1Y3Rvcj1udWxsfWZ1bmN0aW9uIGEodCl7dmFyIHI9e30sbj0wO2lmKHIudHlwZT1OdW1iZXIodC5jaGFyQXQoMCkpLG51bGw9PWUudHlwZXNbci50eXBlXSlyZXR1cm4gaCgpO2lmKGUuQklOQVJZX0VWRU5UPT1yLnR5cGV8fGUuQklOQVJZX0FDSz09ci50eXBlKXtmb3IodmFyIG89XCJcIjtcIi1cIiE9dC5jaGFyQXQoKytuKSYmKG8rPXQuY2hhckF0KG4pLG4hPXQubGVuZ3RoKTspO2lmKG8hPU51bWJlcihvKXx8XCItXCIhPXQuY2hhckF0KG4pKXRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgYXR0YWNobWVudHNcIik7ci5hdHRhY2htZW50cz1OdW1iZXIobyl9aWYoXCIvXCI9PXQuY2hhckF0KG4rMSkpZm9yKHIubnNwPVwiXCI7KytuOyl7dmFyIGk9dC5jaGFyQXQobik7aWYoXCIsXCI9PWkpYnJlYWs7aWYoci5uc3ArPWksbj09dC5sZW5ndGgpYnJlYWt9ZWxzZSByLm5zcD1cIi9cIjt2YXIgcz10LmNoYXJBdChuKzEpO2lmKFwiXCIhPT1zJiZOdW1iZXIocyk9PXMpe2ZvcihyLmlkPVwiXCI7KytuOyl7dmFyIGk9dC5jaGFyQXQobik7aWYobnVsbD09aXx8TnVtYmVyKGkpIT1pKXstLW47YnJlYWt9aWYoci5pZCs9dC5jaGFyQXQobiksbj09dC5sZW5ndGgpYnJlYWt9ci5pZD1OdW1iZXIoci5pZCl9cmV0dXJuIHQuY2hhckF0KCsrbikmJihyPWMocix0LnN1YnN0cihuKSkpLHAoXCJkZWNvZGVkICVzIGFzICVqXCIsdCxyKSxyfWZ1bmN0aW9uIGModCxlKXt0cnl7dC5kYXRhPWYucGFyc2UoZSl9Y2F0Y2godCl7cmV0dXJuIGgoKX1yZXR1cm4gdH1mdW5jdGlvbiB1KHQpe3RoaXMucmVjb25QYWNrPXQsdGhpcy5idWZmZXJzPVtdfWZ1bmN0aW9uIGgodCl7cmV0dXJue3R5cGU6ZS5FUlJPUixkYXRhOlwicGFyc2VyIGVycm9yXCJ9fXZhciBwPXIoOCkoXCJzb2NrZXQuaW8tcGFyc2VyXCIpLGY9cigxMSksbD1yKDEzKSxkPXIoMTQpLHk9cigxNik7ZS5wcm90b2NvbD00LGUudHlwZXM9W1wiQ09OTkVDVFwiLFwiRElTQ09OTkVDVFwiLFwiRVZFTlRcIixcIkFDS1wiLFwiRVJST1JcIixcIkJJTkFSWV9FVkVOVFwiLFwiQklOQVJZX0FDS1wiXSxlLkNPTk5FQ1Q9MCxlLkRJU0NPTk5FQ1Q9MSxlLkVWRU5UPTIsZS5BQ0s9MyxlLkVSUk9SPTQsZS5CSU5BUllfRVZFTlQ9NSxlLkJJTkFSWV9BQ0s9NixlLkVuY29kZXI9bixlLkRlY29kZXI9cyxuLnByb3RvdHlwZS5lbmNvZGU9ZnVuY3Rpb24odCxyKXtpZihwKFwiZW5jb2RpbmcgcGFja2V0ICVqXCIsdCksZS5CSU5BUllfRVZFTlQ9PXQudHlwZXx8ZS5CSU5BUllfQUNLPT10LnR5cGUpaSh0LHIpO2Vsc2V7dmFyIG49byh0KTtyKFtuXSl9fSxsKHMucHJvdG90eXBlKSxzLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odCl7dmFyIHI7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpcj1hKHQpLGUuQklOQVJZX0VWRU5UPT1yLnR5cGV8fGUuQklOQVJZX0FDSz09ci50eXBlPyh0aGlzLnJlY29uc3RydWN0b3I9bmV3IHUociksMD09PXRoaXMucmVjb25zdHJ1Y3Rvci5yZWNvblBhY2suYXR0YWNobWVudHMmJnRoaXMuZW1pdChcImRlY29kZWRcIixyKSk6dGhpcy5lbWl0KFwiZGVjb2RlZFwiLHIpO2Vsc2V7aWYoIXkodCkmJiF0LmJhc2U2NCl0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHR5cGU6IFwiK3QpO2lmKCF0aGlzLnJlY29uc3RydWN0b3IpdGhyb3cgbmV3IEVycm9yKFwiZ290IGJpbmFyeSBkYXRhIHdoZW4gbm90IHJlY29uc3RydWN0aW5nIGEgcGFja2V0XCIpO3I9dGhpcy5yZWNvbnN0cnVjdG9yLnRha2VCaW5hcnlEYXRhKHQpLHImJih0aGlzLnJlY29uc3RydWN0b3I9bnVsbCx0aGlzLmVtaXQoXCJkZWNvZGVkXCIscikpfX0scy5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVjb25zdHJ1Y3RvciYmdGhpcy5yZWNvbnN0cnVjdG9yLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKX0sdS5wcm90b3R5cGUudGFrZUJpbmFyeURhdGE9ZnVuY3Rpb24odCl7aWYodGhpcy5idWZmZXJzLnB1c2godCksdGhpcy5idWZmZXJzLmxlbmd0aD09dGhpcy5yZWNvblBhY2suYXR0YWNobWVudHMpe3ZhciBlPWQucmVjb25zdHJ1Y3RQYWNrZXQodGhpcy5yZWNvblBhY2ssdGhpcy5idWZmZXJzKTtyZXR1cm4gdGhpcy5maW5pc2hlZFJlY29uc3RydWN0aW9uKCksZX1yZXR1cm4gbnVsbH0sdS5wcm90b3R5cGUuZmluaXNoZWRSZWNvbnN0cnVjdGlvbj1mdW5jdGlvbigpe3RoaXMucmVjb25QYWNrPW51bGwsdGhpcy5idWZmZXJzPVtdfX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4oKXtyZXR1cm5cIldlYmtpdEFwcGVhcmFuY2VcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZXx8d2luZG93LmNvbnNvbGUmJihjb25zb2xlLmZpcmVidWd8fGNvbnNvbGUuZXhjZXB0aW9uJiZjb25zb2xlLnRhYmxlKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykmJnBhcnNlSW50KFJlZ0V4cC4kMSwxMCk+PTMxfWZ1bmN0aW9uIG8oKXt2YXIgdD1hcmd1bWVudHMscj10aGlzLnVzZUNvbG9ycztpZih0WzBdPShyP1wiJWNcIjpcIlwiKSt0aGlzLm5hbWVzcGFjZSsocj9cIiAlY1wiOlwiIFwiKSt0WzBdKyhyP1wiJWMgXCI6XCIgXCIpK1wiK1wiK2UuaHVtYW5pemUodGhpcy5kaWZmKSwhcilyZXR1cm4gdDt2YXIgbj1cImNvbG9yOiBcIit0aGlzLmNvbG9yO3Q9W3RbMF0sbixcImNvbG9yOiBpbmhlcml0XCJdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0LDEpKTt2YXIgbz0wLGk9MDtyZXR1cm4gdFswXS5yZXBsYWNlKC8lW2EteiVdL2csZnVuY3Rpb24odCl7XCIlJVwiIT09dCYmKG8rKyxcIiVjXCI9PT10JiYoaT1vKSl9KSx0LnNwbGljZShpLDAsbiksdH1mdW5jdGlvbiBpKCl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUubG9nJiZGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZyxjb25zb2xlLGFyZ3VtZW50cyl9ZnVuY3Rpb24gcyh0KXt0cnl7bnVsbD09dD9lLnN0b3JhZ2UucmVtb3ZlSXRlbShcImRlYnVnXCIpOmUuc3RvcmFnZS5kZWJ1Zz10fWNhdGNoKHQpe319ZnVuY3Rpb24gYSgpe3ZhciB0O3RyeXt0PWUuc3RvcmFnZS5kZWJ1Z31jYXRjaCh0KXt9cmV0dXJuIHR9ZnVuY3Rpb24gYygpe3RyeXtyZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZX1jYXRjaCh0KXt9fWU9dC5leHBvcnRzPXIoOSksZS5sb2c9aSxlLmZvcm1hdEFyZ3M9byxlLnNhdmU9cyxlLmxvYWQ9YSxlLnVzZUNvbG9ycz1uLGUuc3RvcmFnZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lLnN0b3JhZ2U/Y2hyb21lLnN0b3JhZ2UubG9jYWw6YygpLGUuY29sb3JzPVtcImxpZ2h0c2VhZ3JlZW5cIixcImZvcmVzdGdyZWVuXCIsXCJnb2xkZW5yb2RcIixcImRvZGdlcmJsdWVcIixcImRhcmtvcmNoaWRcIixcImNyaW1zb25cIl0sZS5mb3JtYXR0ZXJzLmo9ZnVuY3Rpb24odCl7cmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpfSxlLmVuYWJsZShhKCkpfSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe3JldHVybiBlLmNvbG9yc1toKyslZS5jb2xvcnMubGVuZ3RoXX1mdW5jdGlvbiBvKHQpe2Z1bmN0aW9uIHIoKXt9ZnVuY3Rpb24gbygpe3ZhciB0PW8scj0rbmV3IERhdGUsaT1yLSh1fHxyKTt0LmRpZmY9aSx0LnByZXY9dSx0LmN1cnI9cix1PXIsbnVsbD09dC51c2VDb2xvcnMmJih0LnVzZUNvbG9ycz1lLnVzZUNvbG9ycygpKSxudWxsPT10LmNvbG9yJiZ0LnVzZUNvbG9ycyYmKHQuY29sb3I9bigpKTt2YXIgcz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO3NbMF09ZS5jb2VyY2Uoc1swXSksXCJzdHJpbmdcIiE9dHlwZW9mIHNbMF0mJihzPVtcIiVvXCJdLmNvbmNhdChzKSk7dmFyIGE9MDtzWzBdPXNbMF0ucmVwbGFjZSgvJShbYS16JV0pL2csZnVuY3Rpb24ocixuKXtpZihcIiUlXCI9PT1yKXJldHVybiByO2ErKzt2YXIgbz1lLmZvcm1hdHRlcnNbbl07aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbyl7dmFyIGk9c1thXTtyPW8uY2FsbCh0LGkpLHMuc3BsaWNlKGEsMSksYS0tfXJldHVybiByfSksXCJmdW5jdGlvblwiPT10eXBlb2YgZS5mb3JtYXRBcmdzJiYocz1lLmZvcm1hdEFyZ3MuYXBwbHkodCxzKSk7dmFyIGM9by5sb2d8fGUubG9nfHxjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO2MuYXBwbHkodCxzKX1yLmVuYWJsZWQ9ITEsby5lbmFibGVkPSEwO3ZhciBpPWUuZW5hYmxlZCh0KT9vOnI7cmV0dXJuIGkubmFtZXNwYWNlPXQsaX1mdW5jdGlvbiBpKHQpe2Uuc2F2ZSh0KTtmb3IodmFyIHI9KHR8fFwiXCIpLnNwbGl0KC9bXFxzLF0rLyksbj1yLmxlbmd0aCxvPTA7bzxuO28rKylyW29dJiYodD1yW29dLnJlcGxhY2UoL1xcKi9nLFwiLio/XCIpLFwiLVwiPT09dFswXT9lLnNraXBzLnB1c2gobmV3IFJlZ0V4cChcIl5cIit0LnN1YnN0cigxKStcIiRcIikpOmUubmFtZXMucHVzaChuZXcgUmVnRXhwKFwiXlwiK3QrXCIkXCIpKSl9ZnVuY3Rpb24gcygpe2UuZW5hYmxlKFwiXCIpfWZ1bmN0aW9uIGEodCl7dmFyIHIsbjtmb3Iocj0wLG49ZS5za2lwcy5sZW5ndGg7cjxuO3IrKylpZihlLnNraXBzW3JdLnRlc3QodCkpcmV0dXJuITE7Zm9yKHI9MCxuPWUubmFtZXMubGVuZ3RoO3I8bjtyKyspaWYoZS5uYW1lc1tyXS50ZXN0KHQpKXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIGModCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBFcnJvcj90LnN0YWNrfHx0Lm1lc3NhZ2U6dH1lPXQuZXhwb3J0cz1vLGUuY29lcmNlPWMsZS5kaXNhYmxlPXMsZS5lbmFibGU9aSxlLmVuYWJsZWQ9YSxlLmh1bWFuaXplPXIoMTApLGUubmFtZXM9W10sZS5za2lwcz1bXSxlLmZvcm1hdHRlcnM9e307dmFyIHUsaD0wfSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7aWYodD1cIlwiK3QsISh0Lmxlbmd0aD4xZTQpKXt2YXIgZT0vXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKHQpO2lmKGUpe3ZhciByPXBhcnNlRmxvYXQoZVsxXSksbj0oZVsyXXx8XCJtc1wiKS50b0xvd2VyQ2FzZSgpO3N3aXRjaChuKXtjYXNlXCJ5ZWFyc1wiOmNhc2VcInllYXJcIjpjYXNlXCJ5cnNcIjpjYXNlXCJ5clwiOmNhc2VcInlcIjpyZXR1cm4gcipoO2Nhc2VcImRheXNcIjpjYXNlXCJkYXlcIjpjYXNlXCJkXCI6cmV0dXJuIHIqdTtjYXNlXCJob3Vyc1wiOmNhc2VcImhvdXJcIjpjYXNlXCJocnNcIjpjYXNlXCJoclwiOmNhc2VcImhcIjpyZXR1cm4gcipjO2Nhc2VcIm1pbnV0ZXNcIjpjYXNlXCJtaW51dGVcIjpjYXNlXCJtaW5zXCI6Y2FzZVwibWluXCI6Y2FzZVwibVwiOnJldHVybiByKmE7Y2FzZVwic2Vjb25kc1wiOmNhc2VcInNlY29uZFwiOmNhc2VcInNlY3NcIjpjYXNlXCJzZWNcIjpjYXNlXCJzXCI6cmV0dXJuIHIqcztjYXNlXCJtaWxsaXNlY29uZHNcIjpjYXNlXCJtaWxsaXNlY29uZFwiOmNhc2VcIm1zZWNzXCI6Y2FzZVwibXNlY1wiOmNhc2VcIm1zXCI6cmV0dXJuIHJ9fX19ZnVuY3Rpb24gbih0KXtyZXR1cm4gdD49dT9NYXRoLnJvdW5kKHQvdSkrXCJkXCI6dD49Yz9NYXRoLnJvdW5kKHQvYykrXCJoXCI6dD49YT9NYXRoLnJvdW5kKHQvYSkrXCJtXCI6dD49cz9NYXRoLnJvdW5kKHQvcykrXCJzXCI6dCtcIm1zXCJ9ZnVuY3Rpb24gbyh0KXtyZXR1cm4gaSh0LHUsXCJkYXlcIil8fGkodCxjLFwiaG91clwiKXx8aSh0LGEsXCJtaW51dGVcIil8fGkodCxzLFwic2Vjb25kXCIpfHx0K1wiIG1zXCJ9ZnVuY3Rpb24gaSh0LGUscil7aWYoISh0PGUpKXJldHVybiB0PDEuNSplP01hdGguZmxvb3IodC9lKStcIiBcIityOk1hdGguY2VpbCh0L2UpK1wiIFwiK3IrXCJzXCJ9dmFyIHM9MWUzLGE9NjAqcyxjPTYwKmEsdT0yNCpjLGg9MzY1LjI1KnU7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGU9ZXx8e30sXCJzdHJpbmdcIj09dHlwZW9mIHQ/cih0KTplLmxvbmc/byh0KTpuKHQpfX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbih0LHIpe3ZhciBuPSExOyhmdW5jdGlvbigpe2Z1bmN0aW9uIG8odCxlKXtmdW5jdGlvbiByKHQpe2lmKHJbdF0hPT1nKXJldHVybiByW3RdO3ZhciBvO2lmKFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCI9PXQpbz1cImFcIiE9XCJhXCJbMF07ZWxzZSBpZihcImpzb25cIj09dClvPXIoXCJqc29uLXN0cmluZ2lmeVwiKSYmcihcImpzb24tcGFyc2VcIik7ZWxzZXt2YXIgcyxhPSd7XCJhXCI6WzEsdHJ1ZSxmYWxzZSxudWxsLFwiXFxcXHUwMDAwXFxcXGJcXFxcblxcXFxmXFxcXHJcXFxcdFwiXX0nO2lmKFwianNvbi1zdHJpbmdpZnlcIj09dCl7dmFyIGM9ZS5zdHJpbmdpZnksaD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBjJiZiO2lmKGgpeyhzPWZ1bmN0aW9uKCl7cmV0dXJuIDF9KS50b0pTT049czt0cnl7aD1cIjBcIj09PWMoMCkmJlwiMFwiPT09YyhuZXcgbikmJidcIlwiJz09YyhuZXcgaSkmJmModik9PT1nJiZjKGcpPT09ZyYmYygpPT09ZyYmXCIxXCI9PT1jKHMpJiZcIlsxXVwiPT1jKFtzXSkmJlwiW251bGxdXCI9PWMoW2ddKSYmXCJudWxsXCI9PWMobnVsbCkmJlwiW251bGwsbnVsbCxudWxsXVwiPT1jKFtnLHYsbnVsbF0pJiZjKHthOltzLCEwLCExLG51bGwsXCJcXDBcXGJcXG5cXGZcXHJcXHRcIl19KT09YSYmXCIxXCI9PT1jKG51bGwscykmJlwiW1xcbiAxLFxcbiAyXFxuXVwiPT1jKFsxLDJdLG51bGwsMSkmJidcIi0yNzE4MjEtMDQtMjBUMDA6MDA6MDAuMDAwWlwiJz09YyhuZXcgdSgtODY0ZTEzKSkmJidcIisyNzU3NjAtMDktMTNUMDA6MDA6MDAuMDAwWlwiJz09YyhuZXcgdSg4NjRlMTMpKSYmJ1wiLTAwMDAwMS0wMS0wMVQwMDowMDowMC4wMDBaXCInPT1jKG5ldyB1KC02MjE5ODc1NTJlNSkpJiYnXCIxOTY5LTEyLTMxVDIzOjU5OjU5Ljk5OVpcIic9PWMobmV3IHUoLTEpKX1jYXRjaCh0KXtoPSExfX1vPWh9aWYoXCJqc29uLXBhcnNlXCI9PXQpe3ZhciBwPWUucGFyc2U7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgcCl0cnl7aWYoMD09PXAoXCIwXCIpJiYhcCghMSkpe3M9cChhKTt2YXIgZj01PT1zLmEubGVuZ3RoJiYxPT09cy5hWzBdO2lmKGYpe3RyeXtmPSFwKCdcIlxcdFwiJyl9Y2F0Y2godCl7fWlmKGYpdHJ5e2Y9MSE9PXAoXCIwMVwiKX1jYXRjaCh0KXt9aWYoZil0cnl7Zj0xIT09cChcIjEuXCIpfWNhdGNoKHQpe319fX1jYXRjaCh0KXtmPSExfW89Zn19cmV0dXJuIHJbdF09ISFvfXR8fCh0PWMuT2JqZWN0KCkpLGV8fChlPWMuT2JqZWN0KCkpO3ZhciBuPXQuTnVtYmVyfHxjLk51bWJlcixpPXQuU3RyaW5nfHxjLlN0cmluZyxhPXQuT2JqZWN0fHxjLk9iamVjdCx1PXQuRGF0ZXx8Yy5EYXRlLGg9dC5TeW50YXhFcnJvcnx8Yy5TeW50YXhFcnJvcixwPXQuVHlwZUVycm9yfHxjLlR5cGVFcnJvcixmPXQuTWF0aHx8Yy5NYXRoLGw9dC5KU09OfHxjLkpTT047XCJvYmplY3RcIj09dHlwZW9mIGwmJmwmJihlLnN0cmluZ2lmeT1sLnN0cmluZ2lmeSxlLnBhcnNlPWwucGFyc2UpO3ZhciBkLHksZyxtPWEucHJvdG90eXBlLHY9bS50b1N0cmluZyxiPW5ldyB1KC0weGM3ODJiNWI4MDBjZWMpO3RyeXtiPWIuZ2V0VVRDRnVsbFllYXIoKT09LTEwOTI1MiYmMD09PWIuZ2V0VVRDTW9udGgoKSYmMT09PWIuZ2V0VVRDRGF0ZSgpJiYxMD09Yi5nZXRVVENIb3VycygpJiYzNz09Yi5nZXRVVENNaW51dGVzKCkmJjY9PWIuZ2V0VVRDU2Vjb25kcygpJiY3MDg9PWIuZ2V0VVRDTWlsbGlzZWNvbmRzKCl9Y2F0Y2godCl7fWlmKCFyKFwianNvblwiKSl7dmFyIHc9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLGs9XCJbb2JqZWN0IERhdGVdXCIseD1cIltvYmplY3QgTnVtYmVyXVwiLEE9XCJbb2JqZWN0IFN0cmluZ11cIixDPVwiW29iamVjdCBBcnJheV1cIixCPVwiW29iamVjdCBCb29sZWFuXVwiLFM9cihcImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiKTtpZighYil2YXIgVD1mLmZsb29yLEU9WzAsMzEsNTksOTAsMTIwLDE1MSwxODEsMjEyLDI0MywyNzMsMzA0LDMzNF0sXz1mdW5jdGlvbih0LGUpe3JldHVybiBFW2VdKzM2NSoodC0xOTcwKStUKCh0LTE5NjkrKGU9KyhlPjEpKSkvNCktVCgodC0xOTAxK2UpLzEwMCkrVCgodC0xNjAxK2UpLzQwMCl9O2lmKChkPW0uaGFzT3duUHJvcGVydHkpfHwoZD1mdW5jdGlvbih0KXt2YXIgZSxyPXt9O3JldHVybihyLl9fcHJvdG9fXz1udWxsLHIuX19wcm90b19fPXt0b1N0cmluZzoxfSxyKS50b1N0cmluZyE9dj9kPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuX19wcm90b19fLHI9dCBpbih0aGlzLl9fcHJvdG9fXz1udWxsLHRoaXMpO3JldHVybiB0aGlzLl9fcHJvdG9fXz1lLHJ9OihlPXIuY29uc3RydWN0b3IsZD1mdW5jdGlvbih0KXt2YXIgcj0odGhpcy5jb25zdHJ1Y3Rvcnx8ZSkucHJvdG90eXBlO3JldHVybiB0IGluIHRoaXMmJiEodCBpbiByJiZ0aGlzW3RdPT09clt0XSl9KSxyPW51bGwsZC5jYWxsKHRoaXMsdCl9KSx5PWZ1bmN0aW9uKHQsZSl7dmFyIHIsbixvLGk9MDsocj1mdW5jdGlvbigpe3RoaXMudmFsdWVPZj0wfSkucHJvdG90eXBlLnZhbHVlT2Y9MCxuPW5ldyByO2ZvcihvIGluIG4pZC5jYWxsKG4sbykmJmkrKztyZXR1cm4gcj1uPW51bGwsaT95PTI9PWk/ZnVuY3Rpb24odCxlKXt2YXIgcixuPXt9LG89di5jYWxsKHQpPT13O2ZvcihyIGluIHQpbyYmXCJwcm90b3R5cGVcIj09cnx8ZC5jYWxsKG4scil8fCEobltyXT0xKXx8IWQuY2FsbCh0LHIpfHxlKHIpfTpmdW5jdGlvbih0LGUpe3ZhciByLG4sbz12LmNhbGwodCk9PXc7Zm9yKHIgaW4gdClvJiZcInByb3RvdHlwZVwiPT1yfHwhZC5jYWxsKHQscil8fChuPVwiY29uc3RydWN0b3JcIj09PXIpfHxlKHIpOyhufHxkLmNhbGwodCxyPVwiY29uc3RydWN0b3JcIikpJiZlKHIpfToobj1bXCJ2YWx1ZU9mXCIsXCJ0b1N0cmluZ1wiLFwidG9Mb2NhbGVTdHJpbmdcIixcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXCJpc1Byb3RvdHlwZU9mXCIsXCJoYXNPd25Qcm9wZXJ0eVwiLFwiY29uc3RydWN0b3JcIl0seT1mdW5jdGlvbih0LGUpe3ZhciByLG8saT12LmNhbGwodCk9PXcsYT0haSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdC5jb25zdHJ1Y3RvciYmc1t0eXBlb2YgdC5oYXNPd25Qcm9wZXJ0eV0mJnQuaGFzT3duUHJvcGVydHl8fGQ7Zm9yKHIgaW4gdClpJiZcInByb3RvdHlwZVwiPT1yfHwhYS5jYWxsKHQscil8fGUocik7Zm9yKG89bi5sZW5ndGg7cj1uWy0tb107YS5jYWxsKHQscikmJmUocikpO30pLHkodCxlKX0sIXIoXCJqc29uLXN0cmluZ2lmeVwiKSl7dmFyIE49ezkyOlwiXFxcXFxcXFxcIiwzNDonXFxcXFwiJyw4OlwiXFxcXGJcIiwxMjpcIlxcXFxmXCIsMTA6XCJcXFxcblwiLDEzOlwiXFxcXHJcIiw5OlwiXFxcXHRcIn0saj1cIjAwMDAwMFwiLE89ZnVuY3Rpb24odCxlKXtyZXR1cm4oaisoZXx8MCkpLnNsaWNlKC10KX0sUD1cIlxcXFx1MDBcIixSPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0nXCInLHI9MCxuPXQubGVuZ3RoLG89IVN8fG4+MTAsaT1vJiYoUz90LnNwbGl0KFwiXCIpOnQpO3I8bjtyKyspe3ZhciBzPXQuY2hhckNvZGVBdChyKTtzd2l0Y2gocyl7Y2FzZSA4OmNhc2UgOTpjYXNlIDEwOmNhc2UgMTI6Y2FzZSAxMzpjYXNlIDM0OmNhc2UgOTI6ZSs9TltzXTticmVhaztkZWZhdWx0OmlmKHM8MzIpe2UrPVArTygyLHMudG9TdHJpbmcoMTYpKTticmVha31lKz1vP2lbcl06dC5jaGFyQXQocil9fXJldHVybiBlKydcIid9LEQ9ZnVuY3Rpb24odCxlLHIsbixvLGkscyl7dmFyIGEsYyx1LGgsZixsLG0sYix3LFMsRSxOLGosUCxxLFU7dHJ5e2E9ZVt0XX1jYXRjaCh0KXt9aWYoXCJvYmplY3RcIj09dHlwZW9mIGEmJmEpaWYoYz12LmNhbGwoYSksYyE9a3x8ZC5jYWxsKGEsXCJ0b0pTT05cIikpXCJmdW5jdGlvblwiPT10eXBlb2YgYS50b0pTT04mJihjIT14JiZjIT1BJiZjIT1DfHxkLmNhbGwoYSxcInRvSlNPTlwiKSkmJihhPWEudG9KU09OKHQpKTtlbHNlIGlmKGE+LTEvMCYmYTwxLzApe2lmKF8pe2ZvcihmPVQoYS84NjRlNSksdT1UKGYvMzY1LjI0MjUpKzE5NzAtMTtfKHUrMSwwKTw9Zjt1KyspO2ZvcihoPVQoKGYtXyh1LDApKS8zMC40Mik7Xyh1LGgrMSk8PWY7aCsrKTtmPTErZi1fKHUsaCksbD0oYSU4NjRlNSs4NjRlNSklODY0ZTUsbT1UKGwvMzZlNSklMjQsYj1UKGwvNmU0KSU2MCx3PVQobC8xZTMpJTYwLFM9bCUxZTN9ZWxzZSB1PWEuZ2V0VVRDRnVsbFllYXIoKSxoPWEuZ2V0VVRDTW9udGgoKSxmPWEuZ2V0VVRDRGF0ZSgpLG09YS5nZXRVVENIb3VycygpLGI9YS5nZXRVVENNaW51dGVzKCksdz1hLmdldFVUQ1NlY29uZHMoKSxTPWEuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7YT0odTw9MHx8dT49MWU0Pyh1PDA/XCItXCI6XCIrXCIpK08oNix1PDA/LXU6dSk6Tyg0LHUpKStcIi1cIitPKDIsaCsxKStcIi1cIitPKDIsZikrXCJUXCIrTygyLG0pK1wiOlwiK08oMixiKStcIjpcIitPKDIsdykrXCIuXCIrTygzLFMpK1wiWlwifWVsc2UgYT1udWxsO2lmKHImJihhPXIuY2FsbChlLHQsYSkpLG51bGw9PT1hKXJldHVyblwibnVsbFwiO2lmKGM9di5jYWxsKGEpLGM9PUIpcmV0dXJuXCJcIithO2lmKGM9PXgpcmV0dXJuIGE+LTEvMCYmYTwxLzA/XCJcIithOlwibnVsbFwiO2lmKGM9PUEpcmV0dXJuIFIoXCJcIithKTtpZihcIm9iamVjdFwiPT10eXBlb2YgYSl7Zm9yKFA9cy5sZW5ndGg7UC0tOylpZihzW1BdPT09YSl0aHJvdyBwKCk7aWYocy5wdXNoKGEpLEU9W10scT1pLGkrPW8sYz09Qyl7Zm9yKGo9MCxQPWEubGVuZ3RoO2o8UDtqKyspTj1EKGosYSxyLG4sbyxpLHMpLEUucHVzaChOPT09Zz9cIm51bGxcIjpOKTtVPUUubGVuZ3RoP28/XCJbXFxuXCIraStFLmpvaW4oXCIsXFxuXCIraSkrXCJcXG5cIitxK1wiXVwiOlwiW1wiK0Uuam9pbihcIixcIikrXCJdXCI6XCJbXVwifWVsc2UgeShufHxhLGZ1bmN0aW9uKHQpe3ZhciBlPUQodCxhLHIsbixvLGkscyk7ZSE9PWcmJkUucHVzaChSKHQpK1wiOlwiKyhvP1wiIFwiOlwiXCIpK2UpfSksVT1FLmxlbmd0aD9vP1wie1xcblwiK2krRS5qb2luKFwiLFxcblwiK2kpK1wiXFxuXCIrcStcIn1cIjpcIntcIitFLmpvaW4oXCIsXCIpK1wifVwiOlwie31cIjtyZXR1cm4gcy5wb3AoKSxVfX07ZS5zdHJpbmdpZnk9ZnVuY3Rpb24odCxlLHIpe3ZhciBuLG8saSxhO2lmKHNbdHlwZW9mIGVdJiZlKWlmKChhPXYuY2FsbChlKSk9PXcpbz1lO2Vsc2UgaWYoYT09Qyl7aT17fTtmb3IodmFyIGMsdT0wLGg9ZS5sZW5ndGg7dTxoO2M9ZVt1KytdLGE9di5jYWxsKGMpLChhPT1BfHxhPT14KSYmKGlbY109MSkpO31pZihyKWlmKChhPXYuY2FsbChyKSk9PXgpe2lmKChyLT1yJTEpPjApZm9yKG49XCJcIixyPjEwJiYocj0xMCk7bi5sZW5ndGg8cjtuKz1cIiBcIik7fWVsc2UgYT09QSYmKG49ci5sZW5ndGg8PTEwP3I6ci5zbGljZSgwLDEwKSk7cmV0dXJuIEQoXCJcIiwoYz17fSxjW1wiXCJdPXQsYyksbyxpLG4sXCJcIixbXSl9fWlmKCFyKFwianNvbi1wYXJzZVwiKSl7dmFyIHEsVSxNPWkuZnJvbUNoYXJDb2RlLEw9ezkyOlwiXFxcXFwiLDM0OidcIicsNDc6XCIvXCIsOTg6XCJcXGJcIiwxMTY6XCJcXHRcIiwxMTA6XCJcXG5cIiwxMDI6XCJcXGZcIiwxMTQ6XCJcXHJcIn0sST1mdW5jdGlvbigpe3Rocm93IHE9VT1udWxsLGgoKX0sSD1mdW5jdGlvbigpe2Zvcih2YXIgdCxlLHIsbixvLGk9VSxzPWkubGVuZ3RoO3E8czspc3dpdGNoKG89aS5jaGFyQ29kZUF0KHEpKXtjYXNlIDk6Y2FzZSAxMDpjYXNlIDEzOmNhc2UgMzI6cSsrO2JyZWFrO2Nhc2UgMTIzOmNhc2UgMTI1OmNhc2UgOTE6Y2FzZSA5MzpjYXNlIDU4OmNhc2UgNDQ6cmV0dXJuIHQ9Uz9pLmNoYXJBdChxKTppW3FdLHErKyx0O2Nhc2UgMzQ6Zm9yKHQ9XCJAXCIscSsrO3E8czspaWYobz1pLmNoYXJDb2RlQXQocSksbzwzMilJKCk7ZWxzZSBpZig5Mj09bylzd2l0Y2gobz1pLmNoYXJDb2RlQXQoKytxKSl7Y2FzZSA5MjpjYXNlIDM0OmNhc2UgNDc6Y2FzZSA5ODpjYXNlIDExNjpjYXNlIDExMDpjYXNlIDEwMjpjYXNlIDExNDp0Kz1MW29dLHErKzticmVhaztjYXNlIDExNzpmb3IoZT0rK3Escj1xKzQ7cTxyO3ErKylvPWkuY2hhckNvZGVBdChxKSxvPj00OCYmbzw9NTd8fG8+PTk3JiZvPD0xMDJ8fG8+PTY1JiZvPD03MHx8SSgpO3QrPU0oXCIweFwiK2kuc2xpY2UoZSxxKSk7YnJlYWs7ZGVmYXVsdDpJKCl9ZWxzZXtpZigzND09bylicmVhaztmb3Iobz1pLmNoYXJDb2RlQXQocSksZT1xO28+PTMyJiY5MiE9byYmMzQhPW87KW89aS5jaGFyQ29kZUF0KCsrcSk7dCs9aS5zbGljZShlLHEpfWlmKDM0PT1pLmNoYXJDb2RlQXQocSkpcmV0dXJuIHErKyx0O0koKTtkZWZhdWx0OmlmKGU9cSw0NT09byYmKG49ITAsbz1pLmNoYXJDb2RlQXQoKytxKSksbz49NDgmJm88PTU3KXtmb3IoNDg9PW8mJihvPWkuY2hhckNvZGVBdChxKzEpLG8+PTQ4JiZvPD01NykmJkkoKSxuPSExO3E8cyYmKG89aS5jaGFyQ29kZUF0KHEpLG8+PTQ4JiZvPD01Nyk7cSsrKTtpZig0Nj09aS5jaGFyQ29kZUF0KHEpKXtmb3Iocj0rK3E7cjxzJiYobz1pLmNoYXJDb2RlQXQociksbz49NDgmJm88PTU3KTtyKyspO3I9PXEmJkkoKSxxPXJ9aWYobz1pLmNoYXJDb2RlQXQocSksMTAxPT1vfHw2OT09byl7Zm9yKG89aS5jaGFyQ29kZUF0KCsrcSksNDMhPW8mJjQ1IT1vfHxxKysscj1xO3I8cyYmKG89aS5jaGFyQ29kZUF0KHIpLG8+PTQ4JiZvPD01Nyk7cisrKTtyPT1xJiZJKCkscT1yfXJldHVybitpLnNsaWNlKGUscSl9aWYobiYmSSgpLFwidHJ1ZVwiPT1pLnNsaWNlKHEscSs0KSlyZXR1cm4gcSs9NCwhMDtpZihcImZhbHNlXCI9PWkuc2xpY2UocSxxKzUpKXJldHVybiBxKz01LCExO2lmKFwibnVsbFwiPT1pLnNsaWNlKHEscSs0KSlyZXR1cm4gcSs9NCxudWxsO0koKX1yZXR1cm5cIiRcIn0sej1mdW5jdGlvbih0KXt2YXIgZSxyO2lmKFwiJFwiPT10JiZJKCksXCJzdHJpbmdcIj09dHlwZW9mIHQpe2lmKFwiQFwiPT0oUz90LmNoYXJBdCgwKTp0WzBdKSlyZXR1cm4gdC5zbGljZSgxKTtpZihcIltcIj09dCl7Zm9yKGU9W107dD1IKCksXCJdXCIhPXQ7cnx8KHI9ITApKXImJihcIixcIj09dD8odD1IKCksXCJdXCI9PXQmJkkoKSk6SSgpKSxcIixcIj09dCYmSSgpLGUucHVzaCh6KHQpKTtyZXR1cm4gZX1pZihcIntcIj09dCl7Zm9yKGU9e307dD1IKCksXCJ9XCIhPXQ7cnx8KHI9ITApKXImJihcIixcIj09dD8odD1IKCksXCJ9XCI9PXQmJkkoKSk6SSgpKSxcIixcIiE9dCYmXCJzdHJpbmdcIj09dHlwZW9mIHQmJlwiQFwiPT0oUz90LmNoYXJBdCgwKTp0WzBdKSYmXCI6XCI9PUgoKXx8SSgpLGVbdC5zbGljZSgxKV09eihIKCkpO3JldHVybiBlfUkoKX1yZXR1cm4gdH0sSj1mdW5jdGlvbih0LGUscil7dmFyIG49WCh0LGUscik7bj09PWc/ZGVsZXRlIHRbZV06dFtlXT1ufSxYPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbixvPXRbZV07aWYoXCJvYmplY3RcIj09dHlwZW9mIG8mJm8paWYodi5jYWxsKG8pPT1DKWZvcihuPW8ubGVuZ3RoO24tLTspSihvLG4scik7ZWxzZSB5KG8sZnVuY3Rpb24odCl7SihvLHQscil9KTtyZXR1cm4gci5jYWxsKHQsZSxvKX07ZS5wYXJzZT1mdW5jdGlvbih0LGUpe3ZhciByLG47cmV0dXJuIHE9MCxVPVwiXCIrdCxyPXooSCgpKSxcIiRcIiE9SCgpJiZJKCkscT1VPW51bGwsZSYmdi5jYWxsKGUpPT13P1goKG49e30sbltcIlwiXT1yLG4pLFwiXCIsZSk6cn19fXJldHVybiBlLnJ1bkluQ29udGV4dD1vLGV9dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbi5hbWQscz17ZnVuY3Rpb246ITAsb2JqZWN0OiEwfSxhPXNbdHlwZW9mIGVdJiZlJiYhZS5ub2RlVHlwZSYmZSxjPXNbdHlwZW9mIHdpbmRvd10mJndpbmRvd3x8dGhpcyx1PWEmJnNbdHlwZW9mIHRdJiZ0JiYhdC5ub2RlVHlwZSYmXCJvYmplY3RcIj09dHlwZW9mIHImJnI7aWYoIXV8fHUuZ2xvYmFsIT09dSYmdS53aW5kb3chPT11JiZ1LnNlbGYhPT11fHwoYz11KSxhJiYhaSlvKGMsYSk7ZWxzZXt2YXIgaD1jLkpTT04scD1jLkpTT04zLGY9ITEsbD1vKGMsYy5KU09OMz17bm9Db25mbGljdDpmdW5jdGlvbigpe3JldHVybiBmfHwoZj0hMCxjLkpTT049aCxjLkpTT04zPXAsaD1wPW51bGwpLGx9fSk7Yy5KU09OPXtwYXJzZTpsLnBhcnNlLHN0cmluZ2lmeTpsLnN0cmluZ2lmeX19aSYmbihmdW5jdGlvbigpe3JldHVybiBsfSl9KS5jYWxsKHRoaXMpfSkuY2FsbChlLHIoMTIpKHQpLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gdC53ZWJwYWNrUG9seWZpbGx8fCh0LmRlcHJlY2F0ZT1mdW5jdGlvbigpe30sdC5wYXRocz1bXSx0LmNoaWxkcmVuPVtdLHQud2VicGFja1BvbHlmaWxsPTEpLHR9fSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7aWYodClyZXR1cm4gbih0KX1mdW5jdGlvbiBuKHQpe2Zvcih2YXIgZSBpbiByLnByb3RvdHlwZSl0W2VdPXIucHJvdG90eXBlW2VdO3JldHVybiB0fXQuZXhwb3J0cz1yLHIucHJvdG90eXBlLm9uPXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sKHRoaXMuX2NhbGxiYWNrc1t0XT10aGlzLl9jYWxsYmFja3NbdF18fFtdKS5wdXNoKGUpLHRoaXN9LHIucHJvdG90eXBlLm9uY2U9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7bi5vZmYodCxyKSxlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX12YXIgbj10aGlzO3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSxyLmZuPWUsdGhpcy5vbih0LHIpLHRoaXN9LHIucHJvdG90eXBlLm9mZj1yLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcj1yLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnM9ci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe2lmKHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LDA9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX2NhbGxiYWNrcz17fSx0aGlzO3ZhciByPXRoaXMuX2NhbGxiYWNrc1t0XTtpZighcilyZXR1cm4gdGhpcztpZigxPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW3RdLHRoaXM7Zm9yKHZhciBuLG89MDtvPHIubGVuZ3RoO28rKylpZihuPXJbb10sbj09PWV8fG4uZm49PT1lKXtyLnNwbGljZShvLDEpO2JyZWFrfXJldHVybiB0aGlzfSxyLnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKHQpe3RoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9O3ZhciBlPVtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHI9dGhpcy5fY2FsbGJhY2tzW3RdO2lmKHIpe3I9ci5zbGljZSgwKTtmb3IodmFyIG49MCxvPXIubGVuZ3RoO248bzsrK24pcltuXS5hcHBseSh0aGlzLGUpfXJldHVybiB0aGlzfSxyLnByb3RvdHlwZS5saXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LHRoaXMuX2NhbGxiYWNrc1t0XXx8W119LHIucHJvdG90eXBlLmhhc0xpc3RlbmVycz1mdW5jdGlvbih0KXtyZXR1cm4hIXRoaXMubGlzdGVuZXJzKHQpLmxlbmd0aH19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24odCl7dmFyIG49cigxNSksbz1yKDE2KTtlLmRlY29uc3RydWN0UGFja2V0PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCl7aWYoIXQpcmV0dXJuIHQ7aWYobyh0KSl7dmFyIGk9e19wbGFjZWhvbGRlcjohMCxudW06ci5sZW5ndGh9O3JldHVybiByLnB1c2godCksaX1pZihuKHQpKXtmb3IodmFyIHM9bmV3IEFycmF5KHQubGVuZ3RoKSxhPTA7YTx0Lmxlbmd0aDthKyspc1thXT1lKHRbYV0pO3JldHVybiBzfWlmKFwib2JqZWN0XCI9PXR5cGVvZiB0JiYhKHQgaW5zdGFuY2VvZiBEYXRlKSl7dmFyIHM9e307Zm9yKHZhciBjIGluIHQpc1tjXT1lKHRbY10pO3JldHVybiBzfXJldHVybiB0fXZhciByPVtdLGk9dC5kYXRhLHM9dDtyZXR1cm4gcy5kYXRhPWUoaSkscy5hdHRhY2htZW50cz1yLmxlbmd0aCx7cGFja2V0OnMsYnVmZmVyczpyfX0sZS5yZWNvbnN0cnVjdFBhY2tldD1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7aWYodCYmdC5fcGxhY2Vob2xkZXIpe3ZhciBvPWVbdC5udW1dO3JldHVybiBvfWlmKG4odCkpe2Zvcih2YXIgaT0wO2k8dC5sZW5ndGg7aSsrKXRbaV09cih0W2ldKTtyZXR1cm4gdH1pZih0JiZcIm9iamVjdFwiPT10eXBlb2YgdCl7Zm9yKHZhciBzIGluIHQpdFtzXT1yKHRbc10pO3JldHVybiB0fXJldHVybiB0fXJldHVybiB0LmRhdGE9cih0LmRhdGEpLHQuYXR0YWNobWVudHM9dm9pZCAwLHR9LGUucmVtb3ZlQmxvYnM9ZnVuY3Rpb24oZSxyKXtmdW5jdGlvbiBpKGUsYyx1KXtpZighZSlyZXR1cm4gZTtpZih0LkJsb2ImJmUgaW5zdGFuY2VvZiBCbG9ifHx0LkZpbGUmJmUgaW5zdGFuY2VvZiBGaWxlKXtzKys7dmFyIGg9bmV3IEZpbGVSZWFkZXI7aC5vbmxvYWQ9ZnVuY3Rpb24oKXt1P3VbY109dGhpcy5yZXN1bHQ6YT10aGlzLnJlc3VsdCwtLXN8fHIoYSl9LGgucmVhZEFzQXJyYXlCdWZmZXIoZSl9ZWxzZSBpZihuKGUpKWZvcih2YXIgcD0wO3A8ZS5sZW5ndGg7cCsrKWkoZVtwXSxwLGUpO2Vsc2UgaWYoZSYmXCJvYmplY3RcIj09dHlwZW9mIGUmJiFvKGUpKWZvcih2YXIgZiBpbiBlKWkoZVtmXSxmLGUpfXZhciBzPTAsYT1lO2koYSksc3x8cihhKX19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKHQpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpfX0sZnVuY3Rpb24odCxlKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcih0KXtyZXR1cm4gZS5CdWZmZXImJmUuQnVmZmVyLmlzQnVmZmVyKHQpfHxlLkFycmF5QnVmZmVyJiZ0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ9dC5leHBvcnRzPXJ9KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7cmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBuPyh0JiZcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6byh0KSkmJihlPXQsdD12b2lkIDApLGU9ZXx8e30sZS5wYXRoPWUucGF0aHx8XCIvc29ja2V0LmlvXCIsdGhpcy5uc3BzPXt9LHRoaXMuc3Vicz1bXSx0aGlzLm9wdHM9ZSx0aGlzLnJlY29ubmVjdGlvbihlLnJlY29ubmVjdGlvbiE9PSExKSx0aGlzLnJlY29ubmVjdGlvbkF0dGVtcHRzKGUucmVjb25uZWN0aW9uQXR0ZW1wdHN8fDEvMCksdGhpcy5yZWNvbm5lY3Rpb25EZWxheShlLnJlY29ubmVjdGlvbkRlbGF5fHwxZTMpLHRoaXMucmVjb25uZWN0aW9uRGVsYXlNYXgoZS5yZWNvbm5lY3Rpb25EZWxheU1heHx8NWUzKSx0aGlzLnJhbmRvbWl6YXRpb25GYWN0b3IoZS5yYW5kb21pemF0aW9uRmFjdG9yfHwuNSksdGhpcy5iYWNrb2ZmPW5ldyBsKHttaW46dGhpcy5yZWNvbm5lY3Rpb25EZWxheSgpLG1heDp0aGlzLnJlY29ubmVjdGlvbkRlbGF5TWF4KCksaml0dGVyOnRoaXMucmFuZG9taXphdGlvbkZhY3RvcigpfSksdGhpcy50aW1lb3V0KG51bGw9PWUudGltZW91dD8yZTQ6ZS50aW1lb3V0KSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLnVyaT10LHRoaXMuY29ubmVjdGluZz1bXSx0aGlzLmxhc3RQaW5nPW51bGwsdGhpcy5lbmNvZGluZz0hMSx0aGlzLnBhY2tldEJ1ZmZlcj1bXSx0aGlzLmVuY29kZXI9bmV3IGMuRW5jb2Rlcix0aGlzLmRlY29kZXI9bmV3IGMuRGVjb2Rlcix0aGlzLmF1dG9Db25uZWN0PWUuYXV0b0Nvbm5lY3QhPT0hMSx2b2lkKHRoaXMuYXV0b0Nvbm5lY3QmJnRoaXMub3BlbigpKSk6bmV3IG4odCxlKX12YXIgbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxpPXIoMTgpLHM9cig0NCksYT1yKDM1KSxjPXIoNyksdT1yKDQ2KSxoPXIoNDcpLHA9cigzKShcInNvY2tldC5pby1jbGllbnQ6bWFuYWdlclwiKSxmPXIoNDIpLGw9cig0OCksZD1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O3QuZXhwb3J0cz1uLG4ucHJvdG90eXBlLmVtaXRBbGw9ZnVuY3Rpb24oKXt0aGlzLmVtaXQuYXBwbHkodGhpcyxhcmd1bWVudHMpO2Zvcih2YXIgdCBpbiB0aGlzLm5zcHMpZC5jYWxsKHRoaXMubnNwcyx0KSYmdGhpcy5uc3BzW3RdLmVtaXQuYXBwbHkodGhpcy5uc3BzW3RdLGFyZ3VtZW50cyl9LG4ucHJvdG90eXBlLnVwZGF0ZVNvY2tldElkcz1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLm5zcHMpZC5jYWxsKHRoaXMubnNwcyx0KSYmKHRoaXMubnNwc1t0XS5pZD10aGlzLmVuZ2luZS5pZCl9LGEobi5wcm90b3R5cGUpLG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uPSEhdCx0aGlzKTp0aGlzLl9yZWNvbm5lY3Rpb259LG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbkF0dGVtcHRzPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0cz10LHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzfSxuLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25EZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uRGVsYXk9dCx0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRNaW4odCksdGhpcyk6dGhpcy5fcmVjb25uZWN0aW9uRGVsYXl9LG4ucHJvdG90eXBlLnJhbmRvbWl6YXRpb25GYWN0b3I9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JhbmRvbWl6YXRpb25GYWN0b3I9dCx0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRKaXR0ZXIodCksdGhpcyk6dGhpcy5fcmFuZG9taXphdGlvbkZhY3Rvcn0sbi5wcm90b3R5cGUucmVjb25uZWN0aW9uRGVsYXlNYXg9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlY29ubmVjdGlvbkRlbGF5TWF4PXQsdGhpcy5iYWNrb2ZmJiZ0aGlzLmJhY2tvZmYuc2V0TWF4KHQpLHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbkRlbGF5TWF4fSxuLnByb3RvdHlwZS50aW1lb3V0PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl90aW1lb3V0PXQsdGhpcyk6dGhpcy5fdGltZW91dH0sbi5wcm90b3R5cGUubWF5YmVSZWNvbm5lY3RPbk9wZW49ZnVuY3Rpb24oKXshdGhpcy5yZWNvbm5lY3RpbmcmJnRoaXMuX3JlY29ubmVjdGlvbiYmMD09PXRoaXMuYmFja29mZi5hdHRlbXB0cyYmdGhpcy5yZWNvbm5lY3QoKX0sbi5wcm90b3R5cGUub3Blbj1uLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKHQsZSl7aWYocChcInJlYWR5U3RhdGUgJXNcIix0aGlzLnJlYWR5U3RhdGUpLH50aGlzLnJlYWR5U3RhdGUuaW5kZXhPZihcIm9wZW5cIikpcmV0dXJuIHRoaXM7cChcIm9wZW5pbmcgJXNcIix0aGlzLnVyaSksdGhpcy5lbmdpbmU9aSh0aGlzLnVyaSx0aGlzLm9wdHMpO3ZhciByPXRoaXMuZW5naW5lLG49dGhpczt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuaW5nXCIsdGhpcy5za2lwUmVjb25uZWN0PSExO3ZhciBvPXUocixcIm9wZW5cIixmdW5jdGlvbigpe24ub25vcGVuKCksdCYmdCgpfSkscz11KHIsXCJlcnJvclwiLGZ1bmN0aW9uKGUpe2lmKHAoXCJjb25uZWN0X2Vycm9yXCIpLG4uY2xlYW51cCgpLG4ucmVhZHlTdGF0ZT1cImNsb3NlZFwiLG4uZW1pdEFsbChcImNvbm5lY3RfZXJyb3JcIixlKSx0KXt2YXIgcj1uZXcgRXJyb3IoXCJDb25uZWN0aW9uIGVycm9yXCIpO3IuZGF0YT1lLHQocil9ZWxzZSBuLm1heWJlUmVjb25uZWN0T25PcGVuKCl9KTtpZighMSE9PXRoaXMuX3RpbWVvdXQpe3ZhciBhPXRoaXMuX3RpbWVvdXQ7cChcImNvbm5lY3QgYXR0ZW1wdCB3aWxsIHRpbWVvdXQgYWZ0ZXIgJWRcIixhKTt2YXIgYz1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cChcImNvbm5lY3QgYXR0ZW1wdCB0aW1lZCBvdXQgYWZ0ZXIgJWRcIixhKSxvLmRlc3Ryb3koKSxyLmNsb3NlKCksci5lbWl0KFwiZXJyb3JcIixcInRpbWVvdXRcIiksbi5lbWl0QWxsKFwiY29ubmVjdF90aW1lb3V0XCIsYSl9LGEpO3RoaXMuc3Vicy5wdXNoKHtkZXN0cm95OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGMpfX0pfXJldHVybiB0aGlzLnN1YnMucHVzaChvKSx0aGlzLnN1YnMucHVzaChzKSx0aGlzfSxuLnByb3RvdHlwZS5vbm9wZW49ZnVuY3Rpb24oKXtwKFwib3BlblwiKSx0aGlzLmNsZWFudXAoKSx0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsdGhpcy5lbWl0KFwib3BlblwiKTt2YXIgdD10aGlzLmVuZ2luZTt0aGlzLnN1YnMucHVzaCh1KHQsXCJkYXRhXCIsaCh0aGlzLFwib25kYXRhXCIpKSksdGhpcy5zdWJzLnB1c2godSh0LFwicGluZ1wiLGgodGhpcyxcIm9ucGluZ1wiKSkpLHRoaXMuc3Vicy5wdXNoKHUodCxcInBvbmdcIixoKHRoaXMsXCJvbnBvbmdcIikpKSx0aGlzLnN1YnMucHVzaCh1KHQsXCJlcnJvclwiLGgodGhpcyxcIm9uZXJyb3JcIikpKSx0aGlzLnN1YnMucHVzaCh1KHQsXCJjbG9zZVwiLGgodGhpcyxcIm9uY2xvc2VcIikpKSx0aGlzLnN1YnMucHVzaCh1KHRoaXMuZGVjb2RlcixcImRlY29kZWRcIixoKHRoaXMsXCJvbmRlY29kZWRcIikpKX0sbi5wcm90b3R5cGUub25waW5nPWZ1bmN0aW9uKCl7dGhpcy5sYXN0UGluZz1uZXcgRGF0ZSx0aGlzLmVtaXRBbGwoXCJwaW5nXCIpfSxuLnByb3RvdHlwZS5vbnBvbmc9ZnVuY3Rpb24oKXt0aGlzLmVtaXRBbGwoXCJwb25nXCIsbmV3IERhdGUtdGhpcy5sYXN0UGluZyl9LG4ucHJvdG90eXBlLm9uZGF0YT1mdW5jdGlvbih0KXt0aGlzLmRlY29kZXIuYWRkKHQpfSxuLnByb3RvdHlwZS5vbmRlY29kZWQ9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwicGFja2V0XCIsdCl9LG4ucHJvdG90eXBlLm9uZXJyb3I9ZnVuY3Rpb24odCl7cChcImVycm9yXCIsdCksdGhpcy5lbWl0QWxsKFwiZXJyb3JcIix0KX0sbi5wcm90b3R5cGUuc29ja2V0PWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe35mKG8uY29ubmVjdGluZyxuKXx8by5jb25uZWN0aW5nLnB1c2gobil9dmFyIG49dGhpcy5uc3BzW3RdO2lmKCFuKXtuPW5ldyBzKHRoaXMsdCxlKSx0aGlzLm5zcHNbdF09bjt2YXIgbz10aGlzO24ub24oXCJjb25uZWN0aW5nXCIsciksbi5vbihcImNvbm5lY3RcIixmdW5jdGlvbigpe24uaWQ9by5lbmdpbmUuaWR9KSx0aGlzLmF1dG9Db25uZWN0JiZyKCl9cmV0dXJuIG59LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24odCl7dmFyIGU9Zih0aGlzLmNvbm5lY3RpbmcsdCk7fmUmJnRoaXMuY29ubmVjdGluZy5zcGxpY2UoZSwxKSx0aGlzLmNvbm5lY3RpbmcubGVuZ3RofHx0aGlzLmNsb3NlKCl9LG4ucHJvdG90eXBlLnBhY2tldD1mdW5jdGlvbih0KXtwKFwid3JpdGluZyBwYWNrZXQgJWpcIix0KTt2YXIgZT10aGlzO3QucXVlcnkmJjA9PT10LnR5cGUmJih0Lm5zcCs9XCI/XCIrdC5xdWVyeSksZS5lbmNvZGluZz9lLnBhY2tldEJ1ZmZlci5wdXNoKHQpOihlLmVuY29kaW5nPSEwLHRoaXMuZW5jb2Rlci5lbmNvZGUodCxmdW5jdGlvbihyKXtmb3IodmFyIG49MDtuPHIubGVuZ3RoO24rKyllLmVuZ2luZS53cml0ZShyW25dLHQub3B0aW9ucyk7ZS5lbmNvZGluZz0hMSxlLnByb2Nlc3NQYWNrZXRRdWV1ZSgpfSkpfSxuLnByb3RvdHlwZS5wcm9jZXNzUGFja2V0UXVldWU9ZnVuY3Rpb24oKXtpZih0aGlzLnBhY2tldEJ1ZmZlci5sZW5ndGg+MCYmIXRoaXMuZW5jb2Rpbmcpe3ZhciB0PXRoaXMucGFja2V0QnVmZmVyLnNoaWZ0KCk7dGhpcy5wYWNrZXQodCl9fSxuLnByb3RvdHlwZS5jbGVhbnVwPWZ1bmN0aW9uKCl7cChcImNsZWFudXBcIik7Zm9yKHZhciB0PXRoaXMuc3Vicy5sZW5ndGgsZT0wO2U8dDtlKyspe3ZhciByPXRoaXMuc3Vicy5zaGlmdCgpO3IuZGVzdHJveSgpfXRoaXMucGFja2V0QnVmZmVyPVtdLHRoaXMuZW5jb2Rpbmc9ITEsdGhpcy5sYXN0UGluZz1udWxsLHRoaXMuZGVjb2Rlci5kZXN0cm95KCl9LG4ucHJvdG90eXBlLmNsb3NlPW4ucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXtwKFwiZGlzY29ubmVjdFwiKSx0aGlzLnNraXBSZWNvbm5lY3Q9ITAsdGhpcy5yZWNvbm5lY3Rpbmc9ITEsXCJvcGVuaW5nXCI9PT10aGlzLnJlYWR5U3RhdGUmJnRoaXMuY2xlYW51cCgpLHRoaXMuYmFja29mZi5yZXNldCgpLHRoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMuZW5naW5lJiZ0aGlzLmVuZ2luZS5jbG9zZSgpfSxuLnByb3RvdHlwZS5vbmNsb3NlPWZ1bmN0aW9uKHQpe3AoXCJvbmNsb3NlXCIpLHRoaXMuY2xlYW51cCgpLHRoaXMuYmFja29mZi5yZXNldCgpLHRoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMuZW1pdChcImNsb3NlXCIsdCksdGhpcy5fcmVjb25uZWN0aW9uJiYhdGhpcy5za2lwUmVjb25uZWN0JiZ0aGlzLnJlY29ubmVjdCgpfSxuLnByb3RvdHlwZS5yZWNvbm5lY3Q9ZnVuY3Rpb24oKXtpZih0aGlzLnJlY29ubmVjdGluZ3x8dGhpcy5za2lwUmVjb25uZWN0KXJldHVybiB0aGlzO3ZhciB0PXRoaXM7aWYodGhpcy5iYWNrb2ZmLmF0dGVtcHRzPj10aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0cylwKFwicmVjb25uZWN0IGZhaWxlZFwiKSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLmVtaXRBbGwoXCJyZWNvbm5lY3RfZmFpbGVkXCIpLHRoaXMucmVjb25uZWN0aW5nPSExO2Vsc2V7dmFyIGU9dGhpcy5iYWNrb2ZmLmR1cmF0aW9uKCk7cChcIndpbGwgd2FpdCAlZG1zIGJlZm9yZSByZWNvbm5lY3QgYXR0ZW1wdFwiLGUpLHRoaXMucmVjb25uZWN0aW5nPSEwO3ZhciByPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LnNraXBSZWNvbm5lY3R8fChwKFwiYXR0ZW1wdGluZyByZWNvbm5lY3RcIiksdC5lbWl0QWxsKFwicmVjb25uZWN0X2F0dGVtcHRcIix0LmJhY2tvZmYuYXR0ZW1wdHMpLHQuZW1pdEFsbChcInJlY29ubmVjdGluZ1wiLHQuYmFja29mZi5hdHRlbXB0cyksdC5za2lwUmVjb25uZWN0fHx0Lm9wZW4oZnVuY3Rpb24oZSl7ZT8ocChcInJlY29ubmVjdCBhdHRlbXB0IGVycm9yXCIpLHQucmVjb25uZWN0aW5nPSExLHQucmVjb25uZWN0KCksdC5lbWl0QWxsKFwicmVjb25uZWN0X2Vycm9yXCIsZS5kYXRhKSk6KHAoXCJyZWNvbm5lY3Qgc3VjY2Vzc1wiKSx0Lm9ucmVjb25uZWN0KCkpfSkpfSxlKTt0aGlzLnN1YnMucHVzaCh7ZGVzdHJveTpmdW5jdGlvbigpe2NsZWFyVGltZW91dChyKX19KX19LG4ucHJvdG90eXBlLm9ucmVjb25uZWN0PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5iYWNrb2ZmLmF0dGVtcHRzO3RoaXMucmVjb25uZWN0aW5nPSExLHRoaXMuYmFja29mZi5yZXNldCgpLHRoaXMudXBkYXRlU29ja2V0SWRzKCksdGhpcy5lbWl0QWxsKFwicmVjb25uZWN0XCIsdCl9fSxmdW5jdGlvbih0LGUscil7dC5leHBvcnRzPXIoMTkpfSxmdW5jdGlvbih0LGUscil7dC5leHBvcnRzPXIoMjApLHQuZXhwb3J0cy5wYXJzZXI9cigyNyl9LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LHIpe2lmKCEodGhpcyBpbnN0YW5jZW9mIG4pKXJldHVybiBuZXcgbih0LHIpO3I9cnx8e30sdCYmXCJvYmplY3RcIj09dHlwZW9mIHQmJihyPXQsdD1udWxsKSx0Pyh0PWgodCksci5ob3N0bmFtZT10Lmhvc3Qsci5zZWN1cmU9XCJodHRwc1wiPT09dC5wcm90b2NvbHx8XCJ3c3NcIj09PXQucHJvdG9jb2wsci5wb3J0PXQucG9ydCx0LnF1ZXJ5JiYoci5xdWVyeT10LnF1ZXJ5KSk6ci5ob3N0JiYoci5ob3N0bmFtZT1oKHIuaG9zdCkuaG9zdCksXG50aGlzLnNlY3VyZT1udWxsIT1yLnNlY3VyZT9yLnNlY3VyZTplLmxvY2F0aW9uJiZcImh0dHBzOlwiPT09bG9jYXRpb24ucHJvdG9jb2wsci5ob3N0bmFtZSYmIXIucG9ydCYmKHIucG9ydD10aGlzLnNlY3VyZT9cIjQ0M1wiOlwiODBcIiksdGhpcy5hZ2VudD1yLmFnZW50fHwhMSx0aGlzLmhvc3RuYW1lPXIuaG9zdG5hbWV8fChlLmxvY2F0aW9uP2xvY2F0aW9uLmhvc3RuYW1lOlwibG9jYWxob3N0XCIpLHRoaXMucG9ydD1yLnBvcnR8fChlLmxvY2F0aW9uJiZsb2NhdGlvbi5wb3J0P2xvY2F0aW9uLnBvcnQ6dGhpcy5zZWN1cmU/NDQzOjgwKSx0aGlzLnF1ZXJ5PXIucXVlcnl8fHt9LFwic3RyaW5nXCI9PXR5cGVvZiB0aGlzLnF1ZXJ5JiYodGhpcy5xdWVyeT1mLmRlY29kZSh0aGlzLnF1ZXJ5KSksdGhpcy51cGdyYWRlPSExIT09ci51cGdyYWRlLHRoaXMucGF0aD0oci5wYXRofHxcIi9lbmdpbmUuaW9cIikucmVwbGFjZSgvXFwvJC8sXCJcIikrXCIvXCIsdGhpcy5mb3JjZUpTT05QPSEhci5mb3JjZUpTT05QLHRoaXMuanNvbnA9ITEhPT1yLmpzb25wLHRoaXMuZm9yY2VCYXNlNjQ9ISFyLmZvcmNlQmFzZTY0LHRoaXMuZW5hYmxlc1hEUj0hIXIuZW5hYmxlc1hEUix0aGlzLnRpbWVzdGFtcFBhcmFtPXIudGltZXN0YW1wUGFyYW18fFwidFwiLHRoaXMudGltZXN0YW1wUmVxdWVzdHM9ci50aW1lc3RhbXBSZXF1ZXN0cyx0aGlzLnRyYW5zcG9ydHM9ci50cmFuc3BvcnRzfHxbXCJwb2xsaW5nXCIsXCJ3ZWJzb2NrZXRcIl0sdGhpcy5yZWFkeVN0YXRlPVwiXCIsdGhpcy53cml0ZUJ1ZmZlcj1bXSx0aGlzLnByZXZCdWZmZXJMZW49MCx0aGlzLnBvbGljeVBvcnQ9ci5wb2xpY3lQb3J0fHw4NDMsdGhpcy5yZW1lbWJlclVwZ3JhZGU9ci5yZW1lbWJlclVwZ3JhZGV8fCExLHRoaXMuYmluYXJ5VHlwZT1udWxsLHRoaXMub25seUJpbmFyeVVwZ3JhZGVzPXIub25seUJpbmFyeVVwZ3JhZGVzLHRoaXMucGVyTWVzc2FnZURlZmxhdGU9ITEhPT1yLnBlck1lc3NhZ2VEZWZsYXRlJiYoci5wZXJNZXNzYWdlRGVmbGF0ZXx8e30pLCEwPT09dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSYmKHRoaXMucGVyTWVzc2FnZURlZmxhdGU9e30pLHRoaXMucGVyTWVzc2FnZURlZmxhdGUmJm51bGw9PXRoaXMucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkJiYodGhpcy5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQ9MTAyNCksdGhpcy5wZng9ci5wZnh8fG51bGwsdGhpcy5rZXk9ci5rZXl8fG51bGwsdGhpcy5wYXNzcGhyYXNlPXIucGFzc3BocmFzZXx8bnVsbCx0aGlzLmNlcnQ9ci5jZXJ0fHxudWxsLHRoaXMuY2E9ci5jYXx8bnVsbCx0aGlzLmNpcGhlcnM9ci5jaXBoZXJzfHxudWxsLHRoaXMucmVqZWN0VW5hdXRob3JpemVkPXZvaWQgMD09PXIucmVqZWN0VW5hdXRob3JpemVkP251bGw6ci5yZWplY3RVbmF1dGhvcml6ZWQsdGhpcy5mb3JjZU5vZGU9ISFyLmZvcmNlTm9kZTt2YXIgbz1cIm9iamVjdFwiPT10eXBlb2YgZSYmZTtvLmdsb2JhbD09PW8mJihyLmV4dHJhSGVhZGVycyYmT2JqZWN0LmtleXMoci5leHRyYUhlYWRlcnMpLmxlbmd0aD4wJiYodGhpcy5leHRyYUhlYWRlcnM9ci5leHRyYUhlYWRlcnMpLHIubG9jYWxBZGRyZXNzJiYodGhpcy5sb2NhbEFkZHJlc3M9ci5sb2NhbEFkZHJlc3MpKSx0aGlzLmlkPW51bGwsdGhpcy51cGdyYWRlcz1udWxsLHRoaXMucGluZ0ludGVydmFsPW51bGwsdGhpcy5waW5nVGltZW91dD1udWxsLHRoaXMucGluZ0ludGVydmFsVGltZXI9bnVsbCx0aGlzLnBpbmdUaW1lb3V0VGltZXI9bnVsbCx0aGlzLm9wZW4oKX1mdW5jdGlvbiBvKHQpe3ZhciBlPXt9O2Zvcih2YXIgciBpbiB0KXQuaGFzT3duUHJvcGVydHkocikmJihlW3JdPXRbcl0pO3JldHVybiBlfXZhciBpPXIoMjEpLHM9cigzNSksYT1yKDMpKFwiZW5naW5lLmlvLWNsaWVudDpzb2NrZXRcIiksYz1yKDQyKSx1PXIoMjcpLGg9cigyKSxwPXIoNDMpLGY9cigzNik7dC5leHBvcnRzPW4sbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ITEscyhuLnByb3RvdHlwZSksbi5wcm90b2NvbD11LnByb3RvY29sLG4uU29ja2V0PW4sbi5UcmFuc3BvcnQ9cigyNiksbi50cmFuc3BvcnRzPXIoMjEpLG4ucGFyc2VyPXIoMjcpLG4ucHJvdG90eXBlLmNyZWF0ZVRyYW5zcG9ydD1mdW5jdGlvbih0KXthKCdjcmVhdGluZyB0cmFuc3BvcnQgXCIlc1wiJyx0KTt2YXIgZT1vKHRoaXMucXVlcnkpO2UuRUlPPXUucHJvdG9jb2wsZS50cmFuc3BvcnQ9dCx0aGlzLmlkJiYoZS5zaWQ9dGhpcy5pZCk7dmFyIHI9bmV3IGlbdF0oe2FnZW50OnRoaXMuYWdlbnQsaG9zdG5hbWU6dGhpcy5ob3N0bmFtZSxwb3J0OnRoaXMucG9ydCxzZWN1cmU6dGhpcy5zZWN1cmUscGF0aDp0aGlzLnBhdGgscXVlcnk6ZSxmb3JjZUpTT05QOnRoaXMuZm9yY2VKU09OUCxqc29ucDp0aGlzLmpzb25wLGZvcmNlQmFzZTY0OnRoaXMuZm9yY2VCYXNlNjQsZW5hYmxlc1hEUjp0aGlzLmVuYWJsZXNYRFIsdGltZXN0YW1wUmVxdWVzdHM6dGhpcy50aW1lc3RhbXBSZXF1ZXN0cyx0aW1lc3RhbXBQYXJhbTp0aGlzLnRpbWVzdGFtcFBhcmFtLHBvbGljeVBvcnQ6dGhpcy5wb2xpY3lQb3J0LHNvY2tldDp0aGlzLHBmeDp0aGlzLnBmeCxrZXk6dGhpcy5rZXkscGFzc3BocmFzZTp0aGlzLnBhc3NwaHJhc2UsY2VydDp0aGlzLmNlcnQsY2E6dGhpcy5jYSxjaXBoZXJzOnRoaXMuY2lwaGVycyxyZWplY3RVbmF1dGhvcml6ZWQ6dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQscGVyTWVzc2FnZURlZmxhdGU6dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSxleHRyYUhlYWRlcnM6dGhpcy5leHRyYUhlYWRlcnMsZm9yY2VOb2RlOnRoaXMuZm9yY2VOb2RlLGxvY2FsQWRkcmVzczp0aGlzLmxvY2FsQWRkcmVzc30pO3JldHVybiByfSxuLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7dmFyIHQ7aWYodGhpcy5yZW1lbWJlclVwZ3JhZGUmJm4ucHJpb3JXZWJzb2NrZXRTdWNjZXNzJiZ0aGlzLnRyYW5zcG9ydHMuaW5kZXhPZihcIndlYnNvY2tldFwiKSE9PS0xKXQ9XCJ3ZWJzb2NrZXRcIjtlbHNle2lmKDA9PT10aGlzLnRyYW5zcG9ydHMubGVuZ3RoKXt2YXIgZT10aGlzO3JldHVybiB2b2lkIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmVtaXQoXCJlcnJvclwiLFwiTm8gdHJhbnNwb3J0cyBhdmFpbGFibGVcIil9LDApfXQ9dGhpcy50cmFuc3BvcnRzWzBdfXRoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIjt0cnl7dD10aGlzLmNyZWF0ZVRyYW5zcG9ydCh0KX1jYXRjaCh0KXtyZXR1cm4gdGhpcy50cmFuc3BvcnRzLnNoaWZ0KCksdm9pZCB0aGlzLm9wZW4oKX10Lm9wZW4oKSx0aGlzLnNldFRyYW5zcG9ydCh0KX0sbi5wcm90b3R5cGUuc2V0VHJhbnNwb3J0PWZ1bmN0aW9uKHQpe2EoXCJzZXR0aW5nIHRyYW5zcG9ydCAlc1wiLHQubmFtZSk7dmFyIGU9dGhpczt0aGlzLnRyYW5zcG9ydCYmKGEoXCJjbGVhcmluZyBleGlzdGluZyB0cmFuc3BvcnQgJXNcIix0aGlzLnRyYW5zcG9ydC5uYW1lKSx0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKSksdGhpcy50cmFuc3BvcnQ9dCx0Lm9uKFwiZHJhaW5cIixmdW5jdGlvbigpe2Uub25EcmFpbigpfSkub24oXCJwYWNrZXRcIixmdW5jdGlvbih0KXtlLm9uUGFja2V0KHQpfSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKHQpe2Uub25FcnJvcih0KX0pLm9uKFwiY2xvc2VcIixmdW5jdGlvbigpe2Uub25DbG9zZShcInRyYW5zcG9ydCBjbG9zZVwiKX0pfSxuLnByb3RvdHlwZS5wcm9iZT1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKCl7aWYoZi5vbmx5QmluYXJ5VXBncmFkZXMpe3ZhciBlPSF0aGlzLnN1cHBvcnRzQmluYXJ5JiZmLnRyYW5zcG9ydC5zdXBwb3J0c0JpbmFyeTtwPXB8fGV9cHx8KGEoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgb3BlbmVkJyx0KSxoLnNlbmQoW3t0eXBlOlwicGluZ1wiLGRhdGE6XCJwcm9iZVwifV0pLGgub25jZShcInBhY2tldFwiLGZ1bmN0aW9uKGUpe2lmKCFwKWlmKFwicG9uZ1wiPT09ZS50eXBlJiZcInByb2JlXCI9PT1lLmRhdGEpe2lmKGEoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgcG9uZycsdCksZi51cGdyYWRpbmc9ITAsZi5lbWl0KFwidXBncmFkaW5nXCIsaCksIWgpcmV0dXJuO24ucHJpb3JXZWJzb2NrZXRTdWNjZXNzPVwid2Vic29ja2V0XCI9PT1oLm5hbWUsYSgncGF1c2luZyBjdXJyZW50IHRyYW5zcG9ydCBcIiVzXCInLGYudHJhbnNwb3J0Lm5hbWUpLGYudHJhbnNwb3J0LnBhdXNlKGZ1bmN0aW9uKCl7cHx8XCJjbG9zZWRcIiE9PWYucmVhZHlTdGF0ZSYmKGEoXCJjaGFuZ2luZyB0cmFuc3BvcnQgYW5kIHNlbmRpbmcgdXBncmFkZSBwYWNrZXRcIiksdSgpLGYuc2V0VHJhbnNwb3J0KGgpLGguc2VuZChbe3R5cGU6XCJ1cGdyYWRlXCJ9XSksZi5lbWl0KFwidXBncmFkZVwiLGgpLGg9bnVsbCxmLnVwZ3JhZGluZz0hMSxmLmZsdXNoKCkpfSl9ZWxzZXthKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIGZhaWxlZCcsdCk7dmFyIHI9bmV3IEVycm9yKFwicHJvYmUgZXJyb3JcIik7ci50cmFuc3BvcnQ9aC5uYW1lLGYuZW1pdChcInVwZ3JhZGVFcnJvclwiLHIpfX0pKX1mdW5jdGlvbiByKCl7cHx8KHA9ITAsdSgpLGguY2xvc2UoKSxoPW51bGwpfWZ1bmN0aW9uIG8oZSl7dmFyIG49bmV3IEVycm9yKFwicHJvYmUgZXJyb3I6IFwiK2UpO24udHJhbnNwb3J0PWgubmFtZSxyKCksYSgncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBmYWlsZWQgYmVjYXVzZSBvZiBlcnJvcjogJXMnLHQsZSksZi5lbWl0KFwidXBncmFkZUVycm9yXCIsbil9ZnVuY3Rpb24gaSgpe28oXCJ0cmFuc3BvcnQgY2xvc2VkXCIpfWZ1bmN0aW9uIHMoKXtvKFwic29ja2V0IGNsb3NlZFwiKX1mdW5jdGlvbiBjKHQpe2gmJnQubmFtZSE9PWgubmFtZSYmKGEoJ1wiJXNcIiB3b3JrcyAtIGFib3J0aW5nIFwiJXNcIicsdC5uYW1lLGgubmFtZSkscigpKX1mdW5jdGlvbiB1KCl7aC5yZW1vdmVMaXN0ZW5lcihcIm9wZW5cIixlKSxoLnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIixvKSxoLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIixpKSxmLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIixzKSxmLnJlbW92ZUxpc3RlbmVyKFwidXBncmFkaW5nXCIsYyl9YSgncHJvYmluZyB0cmFuc3BvcnQgXCIlc1wiJyx0KTt2YXIgaD10aGlzLmNyZWF0ZVRyYW5zcG9ydCh0LHtwcm9iZToxfSkscD0hMSxmPXRoaXM7bi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ITEsaC5vbmNlKFwib3BlblwiLGUpLGgub25jZShcImVycm9yXCIsbyksaC5vbmNlKFwiY2xvc2VcIixpKSx0aGlzLm9uY2UoXCJjbG9zZVwiLHMpLHRoaXMub25jZShcInVwZ3JhZGluZ1wiLGMpLGgub3BlbigpfSxuLnByb3RvdHlwZS5vbk9wZW49ZnVuY3Rpb24oKXtpZihhKFwic29ja2V0IG9wZW5cIiksdGhpcy5yZWFkeVN0YXRlPVwib3BlblwiLG4ucHJpb3JXZWJzb2NrZXRTdWNjZXNzPVwid2Vic29ja2V0XCI9PT10aGlzLnRyYW5zcG9ydC5uYW1lLHRoaXMuZW1pdChcIm9wZW5cIiksdGhpcy5mbHVzaCgpLFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlJiZ0aGlzLnVwZ3JhZGUmJnRoaXMudHJhbnNwb3J0LnBhdXNlKXthKFwic3RhcnRpbmcgdXBncmFkZSBwcm9iZXNcIik7Zm9yKHZhciB0PTAsZT10aGlzLnVwZ3JhZGVzLmxlbmd0aDt0PGU7dCsrKXRoaXMucHJvYmUodGhpcy51cGdyYWRlc1t0XSl9fSxuLnByb3RvdHlwZS5vblBhY2tldD1mdW5jdGlvbih0KXtpZihcIm9wZW5pbmdcIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwiY2xvc2luZ1wiPT09dGhpcy5yZWFkeVN0YXRlKXN3aXRjaChhKCdzb2NrZXQgcmVjZWl2ZTogdHlwZSBcIiVzXCIsIGRhdGEgXCIlc1wiJyx0LnR5cGUsdC5kYXRhKSx0aGlzLmVtaXQoXCJwYWNrZXRcIix0KSx0aGlzLmVtaXQoXCJoZWFydGJlYXRcIiksdC50eXBlKXtjYXNlXCJvcGVuXCI6dGhpcy5vbkhhbmRzaGFrZShwKHQuZGF0YSkpO2JyZWFrO2Nhc2VcInBvbmdcIjp0aGlzLnNldFBpbmcoKSx0aGlzLmVtaXQoXCJwb25nXCIpO2JyZWFrO2Nhc2VcImVycm9yXCI6dmFyIGU9bmV3IEVycm9yKFwic2VydmVyIGVycm9yXCIpO2UuY29kZT10LmRhdGEsdGhpcy5vbkVycm9yKGUpO2JyZWFrO2Nhc2VcIm1lc3NhZ2VcIjp0aGlzLmVtaXQoXCJkYXRhXCIsdC5kYXRhKSx0aGlzLmVtaXQoXCJtZXNzYWdlXCIsdC5kYXRhKX1lbHNlIGEoJ3BhY2tldCByZWNlaXZlZCB3aXRoIHNvY2tldCByZWFkeVN0YXRlIFwiJXNcIicsdGhpcy5yZWFkeVN0YXRlKX0sbi5wcm90b3R5cGUub25IYW5kc2hha2U9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwiaGFuZHNoYWtlXCIsdCksdGhpcy5pZD10LnNpZCx0aGlzLnRyYW5zcG9ydC5xdWVyeS5zaWQ9dC5zaWQsdGhpcy51cGdyYWRlcz10aGlzLmZpbHRlclVwZ3JhZGVzKHQudXBncmFkZXMpLHRoaXMucGluZ0ludGVydmFsPXQucGluZ0ludGVydmFsLHRoaXMucGluZ1RpbWVvdXQ9dC5waW5nVGltZW91dCx0aGlzLm9uT3BlbigpLFwiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJih0aGlzLnNldFBpbmcoKSx0aGlzLnJlbW92ZUxpc3RlbmVyKFwiaGVhcnRiZWF0XCIsdGhpcy5vbkhlYXJ0YmVhdCksdGhpcy5vbihcImhlYXJ0YmVhdFwiLHRoaXMub25IZWFydGJlYXQpKX0sbi5wcm90b3R5cGUub25IZWFydGJlYXQ9ZnVuY3Rpb24odCl7Y2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7dmFyIGU9dGhpcztlLnBpbmdUaW1lb3V0VGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe1wiY2xvc2VkXCIhPT1lLnJlYWR5U3RhdGUmJmUub25DbG9zZShcInBpbmcgdGltZW91dFwiKX0sdHx8ZS5waW5nSW50ZXJ2YWwrZS5waW5nVGltZW91dCl9LG4ucHJvdG90eXBlLnNldFBpbmc9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO2NsZWFyVGltZW91dCh0LnBpbmdJbnRlcnZhbFRpbWVyKSx0LnBpbmdJbnRlcnZhbFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthKFwid3JpdGluZyBwaW5nIHBhY2tldCAtIGV4cGVjdGluZyBwb25nIHdpdGhpbiAlc21zXCIsdC5waW5nVGltZW91dCksdC5waW5nKCksdC5vbkhlYXJ0YmVhdCh0LnBpbmdUaW1lb3V0KX0sdC5waW5nSW50ZXJ2YWwpfSxuLnByb3RvdHlwZS5waW5nPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLnNlbmRQYWNrZXQoXCJwaW5nXCIsZnVuY3Rpb24oKXt0LmVtaXQoXCJwaW5nXCIpfSl9LG4ucHJvdG90eXBlLm9uRHJhaW49ZnVuY3Rpb24oKXt0aGlzLndyaXRlQnVmZmVyLnNwbGljZSgwLHRoaXMucHJldkJ1ZmZlckxlbiksdGhpcy5wcmV2QnVmZmVyTGVuPTAsMD09PXRoaXMud3JpdGVCdWZmZXIubGVuZ3RoP3RoaXMuZW1pdChcImRyYWluXCIpOnRoaXMuZmx1c2goKX0sbi5wcm90b3R5cGUuZmx1c2g9ZnVuY3Rpb24oKXtcImNsb3NlZFwiIT09dGhpcy5yZWFkeVN0YXRlJiZ0aGlzLnRyYW5zcG9ydC53cml0YWJsZSYmIXRoaXMudXBncmFkaW5nJiZ0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCYmKGEoXCJmbHVzaGluZyAlZCBwYWNrZXRzIGluIHNvY2tldFwiLHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoKSx0aGlzLnRyYW5zcG9ydC5zZW5kKHRoaXMud3JpdGVCdWZmZXIpLHRoaXMucHJldkJ1ZmZlckxlbj10aGlzLndyaXRlQnVmZmVyLmxlbmd0aCx0aGlzLmVtaXQoXCJmbHVzaFwiKSl9LG4ucHJvdG90eXBlLndyaXRlPW4ucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24odCxlLHIpe3JldHVybiB0aGlzLnNlbmRQYWNrZXQoXCJtZXNzYWdlXCIsdCxlLHIpLHRoaXN9LG4ucHJvdG90eXBlLnNlbmRQYWNrZXQ9ZnVuY3Rpb24odCxlLHIsbil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmKG49ZSxlPXZvaWQgMCksXCJmdW5jdGlvblwiPT10eXBlb2YgciYmKG49cixyPW51bGwpLFwiY2xvc2luZ1wiIT09dGhpcy5yZWFkeVN0YXRlJiZcImNsb3NlZFwiIT09dGhpcy5yZWFkeVN0YXRlKXtyPXJ8fHt9LHIuY29tcHJlc3M9ITEhPT1yLmNvbXByZXNzO3ZhciBvPXt0eXBlOnQsZGF0YTplLG9wdGlvbnM6cn07dGhpcy5lbWl0KFwicGFja2V0Q3JlYXRlXCIsbyksdGhpcy53cml0ZUJ1ZmZlci5wdXNoKG8pLG4mJnRoaXMub25jZShcImZsdXNoXCIsbiksdGhpcy5mbHVzaCgpfX0sbi5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7bi5vbkNsb3NlKFwiZm9yY2VkIGNsb3NlXCIpLGEoXCJzb2NrZXQgY2xvc2luZyAtIHRlbGxpbmcgdHJhbnNwb3J0IHRvIGNsb3NlXCIpLG4udHJhbnNwb3J0LmNsb3NlKCl9ZnVuY3Rpb24gZSgpe24ucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRlXCIsZSksbi5yZW1vdmVMaXN0ZW5lcihcInVwZ3JhZGVFcnJvclwiLGUpLHQoKX1mdW5jdGlvbiByKCl7bi5vbmNlKFwidXBncmFkZVwiLGUpLG4ub25jZShcInVwZ3JhZGVFcnJvclwiLGUpfWlmKFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlfHxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZSl7dGhpcy5yZWFkeVN0YXRlPVwiY2xvc2luZ1wiO3ZhciBuPXRoaXM7dGhpcy53cml0ZUJ1ZmZlci5sZW5ndGg/dGhpcy5vbmNlKFwiZHJhaW5cIixmdW5jdGlvbigpe3RoaXMudXBncmFkaW5nP3IoKTp0KCl9KTp0aGlzLnVwZ3JhZGluZz9yKCk6dCgpfXJldHVybiB0aGlzfSxuLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKHQpe2EoXCJzb2NrZXQgZXJyb3IgJWpcIix0KSxuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz0hMSx0aGlzLmVtaXQoXCJlcnJvclwiLHQpLHRoaXMub25DbG9zZShcInRyYW5zcG9ydCBlcnJvclwiLHQpfSxuLnByb3RvdHlwZS5vbkNsb3NlPWZ1bmN0aW9uKHQsZSl7aWYoXCJvcGVuaW5nXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlfHxcImNsb3NpbmdcIj09PXRoaXMucmVhZHlTdGF0ZSl7YSgnc29ja2V0IGNsb3NlIHdpdGggcmVhc29uOiBcIiVzXCInLHQpO3ZhciByPXRoaXM7Y2xlYXJUaW1lb3V0KHRoaXMucGluZ0ludGVydmFsVGltZXIpLGNsZWFyVGltZW91dCh0aGlzLnBpbmdUaW1lb3V0VGltZXIpLHRoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycyhcImNsb3NlXCIpLHRoaXMudHJhbnNwb3J0LmNsb3NlKCksdGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsdGhpcy5pZD1udWxsLHRoaXMuZW1pdChcImNsb3NlXCIsdCxlKSxyLndyaXRlQnVmZmVyPVtdLHIucHJldkJ1ZmZlckxlbj0wfX0sbi5wcm90b3R5cGUuZmlsdGVyVXBncmFkZXM9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtdLHI9MCxuPXQubGVuZ3RoO3I8bjtyKyspfmModGhpcy50cmFuc3BvcnRzLHRbcl0pJiZlLnB1c2godFtyXSk7cmV0dXJuIGV9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oZSl7dmFyIHIsbj0hMSxhPSExLGM9ITEhPT1lLmpzb25wO2lmKHQubG9jYXRpb24pe3ZhciB1PVwiaHR0cHM6XCI9PT1sb2NhdGlvbi5wcm90b2NvbCxoPWxvY2F0aW9uLnBvcnQ7aHx8KGg9dT80NDM6ODApLG49ZS5ob3N0bmFtZSE9PWxvY2F0aW9uLmhvc3RuYW1lfHxoIT09ZS5wb3J0LGE9ZS5zZWN1cmUhPT11fWlmKGUueGRvbWFpbj1uLGUueHNjaGVtZT1hLHI9bmV3IG8oZSksXCJvcGVuXCJpbiByJiYhZS5mb3JjZUpTT05QKXJldHVybiBuZXcgaShlKTtpZighYyl0aHJvdyBuZXcgRXJyb3IoXCJKU09OUCBkaXNhYmxlZFwiKTtyZXR1cm4gbmV3IHMoZSl9dmFyIG89cigyMiksaT1yKDI0KSxzPXIoMzkpLGE9cig0MCk7ZS5wb2xsaW5nPW4sZS53ZWJzb2NrZXQ9YX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXt2YXIgbj1yKDIzKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIHI9dC54ZG9tYWluLG89dC54c2NoZW1lLGk9dC5lbmFibGVzWERSO3RyeXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgWE1MSHR0cFJlcXVlc3QmJighcnx8bikpcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdH1jYXRjaCh0KXt9dHJ5e2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBYRG9tYWluUmVxdWVzdCYmIW8mJmkpcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdH1jYXRjaCh0KXt9aWYoIXIpdHJ5e3JldHVybiBuZXcoZVtbXCJBY3RpdmVcIl0uY29uY2F0KFwiT2JqZWN0XCIpLmpvaW4oXCJYXCIpXSkoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKX1jYXRjaCh0KXt9fX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt0cnl7dC5leHBvcnRzPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBYTUxIdHRwUmVxdWVzdCYmXCJ3aXRoQ3JlZGVudGlhbHNcImluIG5ldyBYTUxIdHRwUmVxdWVzdH1jYXRjaChlKXt0LmV4cG9ydHM9ITF9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyh0KXtpZihjLmNhbGwodGhpcyx0KSx0aGlzLnJlcXVlc3RUaW1lb3V0PXQucmVxdWVzdFRpbWVvdXQsZS5sb2NhdGlvbil7dmFyIHI9XCJodHRwczpcIj09PWxvY2F0aW9uLnByb3RvY29sLG49bG9jYXRpb24ucG9ydDtufHwobj1yPzQ0Mzo4MCksdGhpcy54ZD10Lmhvc3RuYW1lIT09ZS5sb2NhdGlvbi5ob3N0bmFtZXx8biE9PXQucG9ydCx0aGlzLnhzPXQuc2VjdXJlIT09cn1lbHNlIHRoaXMuZXh0cmFIZWFkZXJzPXQuZXh0cmFIZWFkZXJzfWZ1bmN0aW9uIGkodCl7dGhpcy5tZXRob2Q9dC5tZXRob2R8fFwiR0VUXCIsdGhpcy51cmk9dC51cmksdGhpcy54ZD0hIXQueGQsdGhpcy54cz0hIXQueHMsdGhpcy5hc3luYz0hMSE9PXQuYXN5bmMsdGhpcy5kYXRhPXZvaWQgMCE9PXQuZGF0YT90LmRhdGE6bnVsbCx0aGlzLmFnZW50PXQuYWdlbnQsdGhpcy5pc0JpbmFyeT10LmlzQmluYXJ5LHRoaXMuc3VwcG9ydHNCaW5hcnk9dC5zdXBwb3J0c0JpbmFyeSx0aGlzLmVuYWJsZXNYRFI9dC5lbmFibGVzWERSLHRoaXMucmVxdWVzdFRpbWVvdXQ9dC5yZXF1ZXN0VGltZW91dCx0aGlzLnBmeD10LnBmeCx0aGlzLmtleT10LmtleSx0aGlzLnBhc3NwaHJhc2U9dC5wYXNzcGhyYXNlLHRoaXMuY2VydD10LmNlcnQsdGhpcy5jYT10LmNhLHRoaXMuY2lwaGVycz10LmNpcGhlcnMsdGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ9dC5yZWplY3RVbmF1dGhvcml6ZWQsdGhpcy5leHRyYUhlYWRlcnM9dC5leHRyYUhlYWRlcnMsdGhpcy5jcmVhdGUoKX1mdW5jdGlvbiBzKCl7Zm9yKHZhciB0IGluIGkucmVxdWVzdHMpaS5yZXF1ZXN0cy5oYXNPd25Qcm9wZXJ0eSh0KSYmaS5yZXF1ZXN0c1t0XS5hYm9ydCgpfXZhciBhPXIoMjIpLGM9cigyNSksdT1yKDM1KSxoPXIoMzcpLHA9cigzKShcImVuZ2luZS5pby1jbGllbnQ6cG9sbGluZy14aHJcIik7dC5leHBvcnRzPW8sdC5leHBvcnRzLlJlcXVlc3Q9aSxoKG8sYyksby5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnk9ITAsby5wcm90b3R5cGUucmVxdWVzdD1mdW5jdGlvbih0KXtyZXR1cm4gdD10fHx7fSx0LnVyaT10aGlzLnVyaSgpLHQueGQ9dGhpcy54ZCx0LnhzPXRoaXMueHMsdC5hZ2VudD10aGlzLmFnZW50fHwhMSx0LnN1cHBvcnRzQmluYXJ5PXRoaXMuc3VwcG9ydHNCaW5hcnksdC5lbmFibGVzWERSPXRoaXMuZW5hYmxlc1hEUix0LnBmeD10aGlzLnBmeCx0LmtleT10aGlzLmtleSx0LnBhc3NwaHJhc2U9dGhpcy5wYXNzcGhyYXNlLHQuY2VydD10aGlzLmNlcnQsdC5jYT10aGlzLmNhLHQuY2lwaGVycz10aGlzLmNpcGhlcnMsdC5yZWplY3RVbmF1dGhvcml6ZWQ9dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQsdC5yZXF1ZXN0VGltZW91dD10aGlzLnJlcXVlc3RUaW1lb3V0LHQuZXh0cmFIZWFkZXJzPXRoaXMuZXh0cmFIZWFkZXJzLG5ldyBpKHQpfSxvLnByb3RvdHlwZS5kb1dyaXRlPWZ1bmN0aW9uKHQsZSl7dmFyIHI9XCJzdHJpbmdcIiE9dHlwZW9mIHQmJnZvaWQgMCE9PXQsbj10aGlzLnJlcXVlc3Qoe21ldGhvZDpcIlBPU1RcIixkYXRhOnQsaXNCaW5hcnk6cn0pLG89dGhpcztuLm9uKFwic3VjY2Vzc1wiLGUpLG4ub24oXCJlcnJvclwiLGZ1bmN0aW9uKHQpe28ub25FcnJvcihcInhociBwb3N0IGVycm9yXCIsdCl9KSx0aGlzLnNlbmRYaHI9bn0sby5wcm90b3R5cGUuZG9Qb2xsPWZ1bmN0aW9uKCl7cChcInhociBwb2xsXCIpO3ZhciB0PXRoaXMucmVxdWVzdCgpLGU9dGhpczt0Lm9uKFwiZGF0YVwiLGZ1bmN0aW9uKHQpe2Uub25EYXRhKHQpfSksdC5vbihcImVycm9yXCIsZnVuY3Rpb24odCl7ZS5vbkVycm9yKFwieGhyIHBvbGwgZXJyb3JcIix0KX0pLHRoaXMucG9sbFhocj10fSx1KGkucHJvdG90eXBlKSxpLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXt2YXIgdD17YWdlbnQ6dGhpcy5hZ2VudCx4ZG9tYWluOnRoaXMueGQseHNjaGVtZTp0aGlzLnhzLGVuYWJsZXNYRFI6dGhpcy5lbmFibGVzWERSfTt0LnBmeD10aGlzLnBmeCx0LmtleT10aGlzLmtleSx0LnBhc3NwaHJhc2U9dGhpcy5wYXNzcGhyYXNlLHQuY2VydD10aGlzLmNlcnQsdC5jYT10aGlzLmNhLHQuY2lwaGVycz10aGlzLmNpcGhlcnMsdC5yZWplY3RVbmF1dGhvcml6ZWQ9dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ7dmFyIHI9dGhpcy54aHI9bmV3IGEodCksbj10aGlzO3RyeXtwKFwieGhyIG9wZW4gJXM6ICVzXCIsdGhpcy5tZXRob2QsdGhpcy51cmkpLHIub3Blbih0aGlzLm1ldGhvZCx0aGlzLnVyaSx0aGlzLmFzeW5jKTt0cnl7aWYodGhpcy5leHRyYUhlYWRlcnMpe3Iuc2V0RGlzYWJsZUhlYWRlckNoZWNrKCEwKTtmb3IodmFyIG8gaW4gdGhpcy5leHRyYUhlYWRlcnMpdGhpcy5leHRyYUhlYWRlcnMuaGFzT3duUHJvcGVydHkobykmJnIuc2V0UmVxdWVzdEhlYWRlcihvLHRoaXMuZXh0cmFIZWFkZXJzW29dKX19Y2F0Y2godCl7fWlmKHRoaXMuc3VwcG9ydHNCaW5hcnkmJihyLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIpLFwiUE9TVFwiPT09dGhpcy5tZXRob2QpdHJ5e3RoaXMuaXNCaW5hcnk/ci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik6ci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIil9Y2F0Y2godCl7fXRyeXtyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIixcIiovKlwiKX1jYXRjaCh0KXt9XCJ3aXRoQ3JlZGVudGlhbHNcImluIHImJihyLndpdGhDcmVkZW50aWFscz0hMCksdGhpcy5yZXF1ZXN0VGltZW91dCYmKHIudGltZW91dD10aGlzLnJlcXVlc3RUaW1lb3V0KSx0aGlzLmhhc1hEUigpPyhyLm9ubG9hZD1mdW5jdGlvbigpe24ub25Mb2FkKCl9LHIub25lcnJvcj1mdW5jdGlvbigpe24ub25FcnJvcihyLnJlc3BvbnNlVGV4dCl9KTpyLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpezQ9PT1yLnJlYWR5U3RhdGUmJigyMDA9PT1yLnN0YXR1c3x8MTIyMz09PXIuc3RhdHVzP24ub25Mb2FkKCk6c2V0VGltZW91dChmdW5jdGlvbigpe24ub25FcnJvcihyLnN0YXR1cyl9LDApKX0scChcInhociBkYXRhICVzXCIsdGhpcy5kYXRhKSxyLnNlbmQodGhpcy5kYXRhKX1jYXRjaCh0KXtyZXR1cm4gdm9pZCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5vbkVycm9yKHQpfSwwKX1lLmRvY3VtZW50JiYodGhpcy5pbmRleD1pLnJlcXVlc3RzQ291bnQrKyxpLnJlcXVlc3RzW3RoaXMuaW5kZXhdPXRoaXMpfSxpLnByb3RvdHlwZS5vblN1Y2Nlc3M9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJzdWNjZXNzXCIpLHRoaXMuY2xlYW51cCgpfSxpLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwiZGF0YVwiLHQpLHRoaXMub25TdWNjZXNzKCl9LGkucHJvdG90eXBlLm9uRXJyb3I9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwiZXJyb3JcIix0KSx0aGlzLmNsZWFudXAoITApfSxpLnByb3RvdHlwZS5jbGVhbnVwPWZ1bmN0aW9uKHQpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB0aGlzLnhociYmbnVsbCE9PXRoaXMueGhyKXtpZih0aGlzLmhhc1hEUigpP3RoaXMueGhyLm9ubG9hZD10aGlzLnhoci5vbmVycm9yPW46dGhpcy54aHIub25yZWFkeXN0YXRlY2hhbmdlPW4sdCl0cnl7dGhpcy54aHIuYWJvcnQoKX1jYXRjaCh0KXt9ZS5kb2N1bWVudCYmZGVsZXRlIGkucmVxdWVzdHNbdGhpcy5pbmRleF0sdGhpcy54aHI9bnVsbH19LGkucHJvdG90eXBlLm9uTG9hZD1mdW5jdGlvbigpe3ZhciB0O3RyeXt2YXIgZTt0cnl7ZT10aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKS5zcGxpdChcIjtcIilbMF19Y2F0Y2godCl7fWlmKFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI9PT1lKXQ9dGhpcy54aHIucmVzcG9uc2V8fHRoaXMueGhyLnJlc3BvbnNlVGV4dDtlbHNlIGlmKHRoaXMuc3VwcG9ydHNCaW5hcnkpdHJ5e3Q9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLG5ldyBVaW50OEFycmF5KHRoaXMueGhyLnJlc3BvbnNlKSl9Y2F0Y2goZSl7Zm9yKHZhciByPW5ldyBVaW50OEFycmF5KHRoaXMueGhyLnJlc3BvbnNlKSxuPVtdLG89MCxpPXIubGVuZ3RoO288aTtvKyspbi5wdXNoKHJbb10pO3Q9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLG4pfWVsc2UgdD10aGlzLnhoci5yZXNwb25zZVRleHR9Y2F0Y2godCl7dGhpcy5vbkVycm9yKHQpfW51bGwhPXQmJnRoaXMub25EYXRhKHQpfSxpLnByb3RvdHlwZS5oYXNYRFI9ZnVuY3Rpb24oKXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgZS5YRG9tYWluUmVxdWVzdCYmIXRoaXMueHMmJnRoaXMuZW5hYmxlc1hEUn0saS5wcm90b3R5cGUuYWJvcnQ9ZnVuY3Rpb24oKXt0aGlzLmNsZWFudXAoKX0saS5yZXF1ZXN0c0NvdW50PTAsaS5yZXF1ZXN0cz17fSxlLmRvY3VtZW50JiYoZS5hdHRhY2hFdmVudD9lLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIixzKTplLmFkZEV2ZW50TGlzdGVuZXImJmUuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLHMsITEpKX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dCYmdC5mb3JjZUJhc2U2NDtoJiYhZXx8KHRoaXMuc3VwcG9ydHNCaW5hcnk9ITEpLG8uY2FsbCh0aGlzLHQpfXZhciBvPXIoMjYpLGk9cigzNikscz1yKDI3KSxhPXIoMzcpLGM9cigzOCksdT1yKDMpKFwiZW5naW5lLmlvLWNsaWVudDpwb2xsaW5nXCIpO3QuZXhwb3J0cz1uO3ZhciBoPWZ1bmN0aW9uKCl7dmFyIHQ9cigyMiksZT1uZXcgdCh7eGRvbWFpbjohMX0pO3JldHVybiBudWxsIT1lLnJlc3BvbnNlVHlwZX0oKTthKG4sbyksbi5wcm90b3R5cGUubmFtZT1cInBvbGxpbmdcIixuLnByb3RvdHlwZS5kb09wZW49ZnVuY3Rpb24oKXt0aGlzLnBvbGwoKX0sbi5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSgpe3UoXCJwYXVzZWRcIiksci5yZWFkeVN0YXRlPVwicGF1c2VkXCIsdCgpfXZhciByPXRoaXM7aWYodGhpcy5yZWFkeVN0YXRlPVwicGF1c2luZ1wiLHRoaXMucG9sbGluZ3x8IXRoaXMud3JpdGFibGUpe3ZhciBuPTA7dGhpcy5wb2xsaW5nJiYodShcIndlIGFyZSBjdXJyZW50bHkgcG9sbGluZyAtIHdhaXRpbmcgdG8gcGF1c2VcIiksbisrLHRoaXMub25jZShcInBvbGxDb21wbGV0ZVwiLGZ1bmN0aW9uKCl7dShcInByZS1wYXVzZSBwb2xsaW5nIGNvbXBsZXRlXCIpLC0tbnx8ZSgpfSkpLHRoaXMud3JpdGFibGV8fCh1KFwid2UgYXJlIGN1cnJlbnRseSB3cml0aW5nIC0gd2FpdGluZyB0byBwYXVzZVwiKSxuKyssdGhpcy5vbmNlKFwiZHJhaW5cIixmdW5jdGlvbigpe3UoXCJwcmUtcGF1c2Ugd3JpdGluZyBjb21wbGV0ZVwiKSwtLW58fGUoKX0pKX1lbHNlIGUoKX0sbi5wcm90b3R5cGUucG9sbD1mdW5jdGlvbigpe3UoXCJwb2xsaW5nXCIpLHRoaXMucG9sbGluZz0hMCx0aGlzLmRvUG9sbCgpLHRoaXMuZW1pdChcInBvbGxcIil9LG4ucHJvdG90eXBlLm9uRGF0YT1mdW5jdGlvbih0KXt2YXIgZT10aGlzO3UoXCJwb2xsaW5nIGdvdCBkYXRhICVzXCIsdCk7dmFyIHI9ZnVuY3Rpb24odCxyLG4pe3JldHVyblwib3BlbmluZ1wiPT09ZS5yZWFkeVN0YXRlJiZlLm9uT3BlbigpLFwiY2xvc2VcIj09PXQudHlwZT8oZS5vbkNsb3NlKCksITEpOnZvaWQgZS5vblBhY2tldCh0KX07cy5kZWNvZGVQYXlsb2FkKHQsdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSxyKSxcImNsb3NlZFwiIT09dGhpcy5yZWFkeVN0YXRlJiYodGhpcy5wb2xsaW5nPSExLHRoaXMuZW1pdChcInBvbGxDb21wbGV0ZVwiKSxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZT90aGlzLnBvbGwoKTp1KCdpZ25vcmluZyBwb2xsIC0gdHJhbnNwb3J0IHN0YXRlIFwiJXNcIicsdGhpcy5yZWFkeVN0YXRlKSl9LG4ucHJvdG90eXBlLmRvQ2xvc2U9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7dShcIndyaXRpbmcgY2xvc2UgcGFja2V0XCIpLGUud3JpdGUoW3t0eXBlOlwiY2xvc2VcIn1dKX12YXIgZT10aGlzO1wib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlPyh1KFwidHJhbnNwb3J0IG9wZW4gLSBjbG9zaW5nXCIpLHQoKSk6KHUoXCJ0cmFuc3BvcnQgbm90IG9wZW4gLSBkZWZlcnJpbmcgY2xvc2VcIiksdGhpcy5vbmNlKFwib3BlblwiLHQpKX0sbi5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24odCl7dmFyIGU9dGhpczt0aGlzLndyaXRhYmxlPSExO3ZhciByPWZ1bmN0aW9uKCl7ZS53cml0YWJsZT0hMCxlLmVtaXQoXCJkcmFpblwiKX07cy5lbmNvZGVQYXlsb2FkKHQsdGhpcy5zdXBwb3J0c0JpbmFyeSxmdW5jdGlvbih0KXtlLmRvV3JpdGUodCxyKX0pfSxuLnByb3RvdHlwZS51cmk9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnF1ZXJ5fHx7fSxlPXRoaXMuc2VjdXJlP1wiaHR0cHNcIjpcImh0dHBcIixyPVwiXCI7ITEhPT10aGlzLnRpbWVzdGFtcFJlcXVlc3RzJiYodFt0aGlzLnRpbWVzdGFtcFBhcmFtXT1jKCkpLHRoaXMuc3VwcG9ydHNCaW5hcnl8fHQuc2lkfHwodC5iNjQ9MSksdD1pLmVuY29kZSh0KSx0aGlzLnBvcnQmJihcImh0dHBzXCI9PT1lJiY0NDMhPT1OdW1iZXIodGhpcy5wb3J0KXx8XCJodHRwXCI9PT1lJiY4MCE9PU51bWJlcih0aGlzLnBvcnQpKSYmKHI9XCI6XCIrdGhpcy5wb3J0KSx0Lmxlbmd0aCYmKHQ9XCI/XCIrdCk7dmFyIG49dGhpcy5ob3N0bmFtZS5pbmRleE9mKFwiOlwiKSE9PS0xO3JldHVybiBlK1wiOi8vXCIrKG4/XCJbXCIrdGhpcy5ob3N0bmFtZStcIl1cIjp0aGlzLmhvc3RuYW1lKStyK3RoaXMucGF0aCt0fX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dGhpcy5wYXRoPXQucGF0aCx0aGlzLmhvc3RuYW1lPXQuaG9zdG5hbWUsdGhpcy5wb3J0PXQucG9ydCx0aGlzLnNlY3VyZT10LnNlY3VyZSx0aGlzLnF1ZXJ5PXQucXVlcnksdGhpcy50aW1lc3RhbXBQYXJhbT10LnRpbWVzdGFtcFBhcmFtLHRoaXMudGltZXN0YW1wUmVxdWVzdHM9dC50aW1lc3RhbXBSZXF1ZXN0cyx0aGlzLnJlYWR5U3RhdGU9XCJcIix0aGlzLmFnZW50PXQuYWdlbnR8fCExLHRoaXMuc29ja2V0PXQuc29ja2V0LHRoaXMuZW5hYmxlc1hEUj10LmVuYWJsZXNYRFIsdGhpcy5wZng9dC5wZngsdGhpcy5rZXk9dC5rZXksdGhpcy5wYXNzcGhyYXNlPXQucGFzc3BocmFzZSx0aGlzLmNlcnQ9dC5jZXJ0LHRoaXMuY2E9dC5jYSx0aGlzLmNpcGhlcnM9dC5jaXBoZXJzLHRoaXMucmVqZWN0VW5hdXRob3JpemVkPXQucmVqZWN0VW5hdXRob3JpemVkLHRoaXMuZm9yY2VOb2RlPXQuZm9yY2VOb2RlLHRoaXMuZXh0cmFIZWFkZXJzPXQuZXh0cmFIZWFkZXJzLHRoaXMubG9jYWxBZGRyZXNzPXQubG9jYWxBZGRyZXNzfXZhciBvPXIoMjcpLGk9cigzNSk7dC5leHBvcnRzPW4saShuLnByb3RvdHlwZSksbi5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbih0LGUpe3ZhciByPW5ldyBFcnJvcih0KTtyZXR1cm4gci50eXBlPVwiVHJhbnNwb3J0RXJyb3JcIixyLmRlc2NyaXB0aW9uPWUsdGhpcy5lbWl0KFwiZXJyb3JcIixyKSx0aGlzfSxuLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7cmV0dXJuXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmXCJcIiE9PXRoaXMucmVhZHlTdGF0ZXx8KHRoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIix0aGlzLmRvT3BlbigpKSx0aGlzfSxuLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3JldHVyblwib3BlbmluZ1wiIT09dGhpcy5yZWFkeVN0YXRlJiZcIm9wZW5cIiE9PXRoaXMucmVhZHlTdGF0ZXx8KHRoaXMuZG9DbG9zZSgpLHRoaXMub25DbG9zZSgpKSx0aGlzfSxuLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKHQpe2lmKFwib3BlblwiIT09dGhpcy5yZWFkeVN0YXRlKXRocm93IG5ldyBFcnJvcihcIlRyYW5zcG9ydCBub3Qgb3BlblwiKTt0aGlzLndyaXRlKHQpfSxuLnByb3RvdHlwZS5vbk9wZW49ZnVuY3Rpb24oKXt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsdGhpcy53cml0YWJsZT0hMCx0aGlzLmVtaXQoXCJvcGVuXCIpfSxuLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24odCl7dmFyIGU9by5kZWNvZGVQYWNrZXQodCx0aGlzLnNvY2tldC5iaW5hcnlUeXBlKTt0aGlzLm9uUGFja2V0KGUpfSxuLnByb3RvdHlwZS5vblBhY2tldD1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJwYWNrZXRcIix0KX0sbi5wcm90b3R5cGUub25DbG9zZT1mdW5jdGlvbigpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMuZW1pdChcImNsb3NlXCIpfX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbih0KXtmdW5jdGlvbiBuKHQscil7dmFyIG49XCJiXCIrZS5wYWNrZXRzW3QudHlwZV0rdC5kYXRhLmRhdGE7cmV0dXJuIHIobil9ZnVuY3Rpb24gbyh0LHIsbil7aWYoIXIpcmV0dXJuIGUuZW5jb2RlQmFzZTY0UGFja2V0KHQsbik7dmFyIG89dC5kYXRhLGk9bmV3IFVpbnQ4QXJyYXkobykscz1uZXcgVWludDhBcnJheSgxK28uYnl0ZUxlbmd0aCk7c1swXT12W3QudHlwZV07Zm9yKHZhciBhPTA7YTxpLmxlbmd0aDthKyspc1thKzFdPWlbYV07cmV0dXJuIG4ocy5idWZmZXIpfWZ1bmN0aW9uIGkodCxyLG4pe2lmKCFyKXJldHVybiBlLmVuY29kZUJhc2U2NFBhY2tldCh0LG4pO3ZhciBvPW5ldyBGaWxlUmVhZGVyO3JldHVybiBvLm9ubG9hZD1mdW5jdGlvbigpe3QuZGF0YT1vLnJlc3VsdCxlLmVuY29kZVBhY2tldCh0LHIsITAsbil9LG8ucmVhZEFzQXJyYXlCdWZmZXIodC5kYXRhKX1mdW5jdGlvbiBzKHQscixuKXtpZighcilyZXR1cm4gZS5lbmNvZGVCYXNlNjRQYWNrZXQodCxuKTtpZihtKXJldHVybiBpKHQscixuKTt2YXIgbz1uZXcgVWludDhBcnJheSgxKTtvWzBdPXZbdC50eXBlXTt2YXIgcz1uZXcgayhbby5idWZmZXIsdC5kYXRhXSk7cmV0dXJuIG4ocyl9ZnVuY3Rpb24gYSh0KXt0cnl7dD1kLmRlY29kZSh0KX1jYXRjaCh0KXtyZXR1cm4hMX1yZXR1cm4gdH1mdW5jdGlvbiBjKHQsZSxyKXtmb3IodmFyIG49bmV3IEFycmF5KHQubGVuZ3RoKSxvPWwodC5sZW5ndGgsciksaT1mdW5jdGlvbih0LHIsbyl7ZShyLGZ1bmN0aW9uKGUscil7blt0XT1yLG8oZSxuKX0pfSxzPTA7czx0Lmxlbmd0aDtzKyspaShzLHRbc10sbyl9dmFyIHUsaD1yKDI4KSxwPXIoMjkpLGY9cigzMCksbD1yKDMxKSxkPXIoMzIpO3QmJnQuQXJyYXlCdWZmZXImJih1PXIoMzMpKTt2YXIgeT1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiYvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksZz1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiYvUGhhbnRvbUpTL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxtPXl8fGc7ZS5wcm90b2NvbD0zO3ZhciB2PWUucGFja2V0cz17b3BlbjowLGNsb3NlOjEscGluZzoyLHBvbmc6MyxtZXNzYWdlOjQsdXBncmFkZTo1LG5vb3A6Nn0sYj1oKHYpLHc9e3R5cGU6XCJlcnJvclwiLGRhdGE6XCJwYXJzZXIgZXJyb3JcIn0saz1yKDM0KTtlLmVuY29kZVBhY2tldD1mdW5jdGlvbihlLHIsaSxhKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYoYT1yLHI9ITEpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGkmJihhPWksaT1udWxsKTt2YXIgYz12b2lkIDA9PT1lLmRhdGE/dm9pZCAwOmUuZGF0YS5idWZmZXJ8fGUuZGF0YTtpZih0LkFycmF5QnVmZmVyJiZjIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpcmV0dXJuIG8oZSxyLGEpO2lmKGsmJmMgaW5zdGFuY2VvZiB0LkJsb2IpcmV0dXJuIHMoZSxyLGEpO2lmKGMmJmMuYmFzZTY0KXJldHVybiBuKGUsYSk7dmFyIHU9dltlLnR5cGVdO3JldHVybiB2b2lkIDAhPT1lLmRhdGEmJih1Kz1pP2QuZW5jb2RlKFN0cmluZyhlLmRhdGEpKTpTdHJpbmcoZS5kYXRhKSksYShcIlwiK3UpfSxlLmVuY29kZUJhc2U2NFBhY2tldD1mdW5jdGlvbihyLG4pe3ZhciBvPVwiYlwiK2UucGFja2V0c1tyLnR5cGVdO2lmKGsmJnIuZGF0YSBpbnN0YW5jZW9mIHQuQmxvYil7dmFyIGk9bmV3IEZpbGVSZWFkZXI7cmV0dXJuIGkub25sb2FkPWZ1bmN0aW9uKCl7dmFyIHQ9aS5yZXN1bHQuc3BsaXQoXCIsXCIpWzFdO24obyt0KX0saS5yZWFkQXNEYXRhVVJMKHIuZGF0YSl9dmFyIHM7dHJ5e3M9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLG5ldyBVaW50OEFycmF5KHIuZGF0YSkpfWNhdGNoKHQpe2Zvcih2YXIgYT1uZXcgVWludDhBcnJheShyLmRhdGEpLGM9bmV3IEFycmF5KGEubGVuZ3RoKSx1PTA7dTxhLmxlbmd0aDt1KyspY1t1XT1hW3VdO3M9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGMpfXJldHVybiBvKz10LmJ0b2EocyksbihvKX0sZS5kZWNvZGVQYWNrZXQ9ZnVuY3Rpb24odCxyLG4pe2lmKHZvaWQgMD09PXQpcmV0dXJuIHc7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpe2lmKFwiYlwiPT10LmNoYXJBdCgwKSlyZXR1cm4gZS5kZWNvZGVCYXNlNjRQYWNrZXQodC5zdWJzdHIoMSkscik7aWYobiYmKHQ9YSh0KSx0PT09ITEpKXJldHVybiB3O3ZhciBvPXQuY2hhckF0KDApO3JldHVybiBOdW1iZXIobyk9PW8mJmJbb10/dC5sZW5ndGg+MT97dHlwZTpiW29dLGRhdGE6dC5zdWJzdHJpbmcoMSl9Ont0eXBlOmJbb119Ond9dmFyIGk9bmV3IFVpbnQ4QXJyYXkodCksbz1pWzBdLHM9Zih0LDEpO3JldHVybiBrJiZcImJsb2JcIj09PXImJihzPW5ldyBrKFtzXSkpLHt0eXBlOmJbb10sZGF0YTpzfX0sZS5kZWNvZGVCYXNlNjRQYWNrZXQ9ZnVuY3Rpb24odCxlKXt2YXIgcj1iW3QuY2hhckF0KDApXTtpZighdSlyZXR1cm57dHlwZTpyLGRhdGE6e2Jhc2U2NDohMCxkYXRhOnQuc3Vic3RyKDEpfX07dmFyIG49dS5kZWNvZGUodC5zdWJzdHIoMSkpO3JldHVyblwiYmxvYlwiPT09ZSYmayYmKG49bmV3IGsoW25dKSkse3R5cGU6cixkYXRhOm59fSxlLmVuY29kZVBheWxvYWQ9ZnVuY3Rpb24odCxyLG4pe2Z1bmN0aW9uIG8odCl7cmV0dXJuIHQubGVuZ3RoK1wiOlwiK3R9ZnVuY3Rpb24gaSh0LG4pe2UuZW5jb2RlUGFja2V0KHQsISFzJiZyLCEwLGZ1bmN0aW9uKHQpe24obnVsbCxvKHQpKX0pfVwiZnVuY3Rpb25cIj09dHlwZW9mIHImJihuPXIscj1udWxsKTt2YXIgcz1wKHQpO3JldHVybiByJiZzP2smJiFtP2UuZW5jb2RlUGF5bG9hZEFzQmxvYih0LG4pOmUuZW5jb2RlUGF5bG9hZEFzQXJyYXlCdWZmZXIodCxuKTp0Lmxlbmd0aD92b2lkIGModCxpLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIG4oZS5qb2luKFwiXCIpKX0pOm4oXCIwOlwiKX0sZS5kZWNvZGVQYXlsb2FkPWZ1bmN0aW9uKHQscixuKXtpZihcInN0cmluZ1wiIT10eXBlb2YgdClyZXR1cm4gZS5kZWNvZGVQYXlsb2FkQXNCaW5hcnkodCxyLG4pO1wiZnVuY3Rpb25cIj09dHlwZW9mIHImJihuPXIscj1udWxsKTt2YXIgbztpZihcIlwiPT10KXJldHVybiBuKHcsMCwxKTtmb3IodmFyIGkscyxhPVwiXCIsYz0wLHU9dC5sZW5ndGg7Yzx1O2MrKyl7dmFyIGg9dC5jaGFyQXQoYyk7aWYoXCI6XCIhPWgpYSs9aDtlbHNle2lmKFwiXCI9PWF8fGEhPShpPU51bWJlcihhKSkpcmV0dXJuIG4odywwLDEpO2lmKHM9dC5zdWJzdHIoYysxLGkpLGEhPXMubGVuZ3RoKXJldHVybiBuKHcsMCwxKTtpZihzLmxlbmd0aCl7aWYobz1lLmRlY29kZVBhY2tldChzLHIsITApLHcudHlwZT09by50eXBlJiZ3LmRhdGE9PW8uZGF0YSlyZXR1cm4gbih3LDAsMSk7dmFyIHA9bihvLGMraSx1KTtpZighMT09PXApcmV0dXJufWMrPWksYT1cIlwifX1yZXR1cm5cIlwiIT1hP24odywwLDEpOnZvaWQgMH0sZS5lbmNvZGVQYXlsb2FkQXNBcnJheUJ1ZmZlcj1mdW5jdGlvbih0LHIpe2Z1bmN0aW9uIG4odCxyKXtlLmVuY29kZVBhY2tldCh0LCEwLCEwLGZ1bmN0aW9uKHQpe3JldHVybiByKG51bGwsdCl9KX1yZXR1cm4gdC5sZW5ndGg/dm9pZCBjKHQsbixmdW5jdGlvbih0LGUpe3ZhciBuPWUucmVkdWNlKGZ1bmN0aW9uKHQsZSl7dmFyIHI7cmV0dXJuIHI9XCJzdHJpbmdcIj09dHlwZW9mIGU/ZS5sZW5ndGg6ZS5ieXRlTGVuZ3RoLHQrci50b1N0cmluZygpLmxlbmd0aCtyKzJ9LDApLG89bmV3IFVpbnQ4QXJyYXkobiksaT0wO3JldHVybiBlLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9XCJzdHJpbmdcIj09dHlwZW9mIHQscj10O2lmKGUpe2Zvcih2YXIgbj1uZXcgVWludDhBcnJheSh0Lmxlbmd0aCkscz0wO3M8dC5sZW5ndGg7cysrKW5bc109dC5jaGFyQ29kZUF0KHMpO3I9bi5idWZmZXJ9ZT9vW2krK109MDpvW2krK109MTtmb3IodmFyIGE9ci5ieXRlTGVuZ3RoLnRvU3RyaW5nKCkscz0wO3M8YS5sZW5ndGg7cysrKW9baSsrXT1wYXJzZUludChhW3NdKTtvW2krK109MjU1O2Zvcih2YXIgbj1uZXcgVWludDhBcnJheShyKSxzPTA7czxuLmxlbmd0aDtzKyspb1tpKytdPW5bc119KSxyKG8uYnVmZmVyKX0pOnIobmV3IEFycmF5QnVmZmVyKDApKX0sZS5lbmNvZGVQYXlsb2FkQXNCbG9iPWZ1bmN0aW9uKHQscil7ZnVuY3Rpb24gbih0LHIpe2UuZW5jb2RlUGFja2V0KHQsITAsITAsZnVuY3Rpb24odCl7dmFyIGU9bmV3IFVpbnQ4QXJyYXkoMSk7aWYoZVswXT0xLFwic3RyaW5nXCI9PXR5cGVvZiB0KXtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkodC5sZW5ndGgpLG89MDtvPHQubGVuZ3RoO28rKyluW29dPXQuY2hhckNvZGVBdChvKTt0PW4uYnVmZmVyLGVbMF09MH1mb3IodmFyIGk9dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyP3QuYnl0ZUxlbmd0aDp0LnNpemUscz1pLnRvU3RyaW5nKCksYT1uZXcgVWludDhBcnJheShzLmxlbmd0aCsxKSxvPTA7bzxzLmxlbmd0aDtvKyspYVtvXT1wYXJzZUludChzW29dKTtpZihhW3MubGVuZ3RoXT0yNTUsayl7dmFyIGM9bmV3IGsoW2UuYnVmZmVyLGEuYnVmZmVyLHRdKTtyKG51bGwsYyl9fSl9Yyh0LG4sZnVuY3Rpb24odCxlKXtyZXR1cm4gcihuZXcgayhlKSl9KX0sZS5kZWNvZGVQYXlsb2FkQXNCaW5hcnk9ZnVuY3Rpb24odCxyLG4pe1wiZnVuY3Rpb25cIj09dHlwZW9mIHImJihuPXIscj1udWxsKTtmb3IodmFyIG89dCxpPVtdLHM9ITE7by5ieXRlTGVuZ3RoPjA7KXtmb3IodmFyIGE9bmV3IFVpbnQ4QXJyYXkobyksYz0wPT09YVswXSx1PVwiXCIsaD0xOzI1NSE9YVtoXTtoKyspe2lmKHUubGVuZ3RoPjMxMCl7cz0hMDticmVha311Kz1hW2hdfWlmKHMpcmV0dXJuIG4odywwLDEpO289ZihvLDIrdS5sZW5ndGgpLHU9cGFyc2VJbnQodSk7dmFyIHA9ZihvLDAsdSk7aWYoYyl0cnl7cD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkocCkpfWNhdGNoKHQpe3ZhciBsPW5ldyBVaW50OEFycmF5KHApO3A9XCJcIjtmb3IodmFyIGg9MDtoPGwubGVuZ3RoO2grKylwKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGxbaF0pfWkucHVzaChwKSxvPWYobyx1KX12YXIgZD1pLmxlbmd0aDtpLmZvckVhY2goZnVuY3Rpb24odCxvKXtuKGUuZGVjb2RlUGFja2V0KHQsciwhMCksbyxkKX0pfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKHQpe3ZhciBlPVtdLHI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmb3IodmFyIG4gaW4gdClyLmNhbGwodCxuKSYmZS5wdXNoKG4pO3JldHVybiBlfX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe2Z1bmN0aW9uIHIodCl7aWYoIXQpcmV0dXJuITE7aWYoZS5CdWZmZXImJmUuQnVmZmVyLmlzQnVmZmVyJiZlLkJ1ZmZlci5pc0J1ZmZlcih0KXx8ZS5BcnJheUJ1ZmZlciYmdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxlLkJsb2ImJnQgaW5zdGFuY2VvZiBCbG9ifHxlLkZpbGUmJnQgaW5zdGFuY2VvZiBGaWxlKXJldHVybiEwO2lmKG8odCkpe2Zvcih2YXIgbj0wO248dC5sZW5ndGg7bisrKWlmKHIodFtuXSkpcmV0dXJuITB9ZWxzZSBpZih0JiZcIm9iamVjdFwiPT10eXBlb2YgdCl7dC50b0pTT04mJlwiZnVuY3Rpb25cIj09dHlwZW9mIHQudG9KU09OJiYodD10LnRvSlNPTigpKTtmb3IodmFyIGkgaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxpKSYmcih0W2ldKSlyZXR1cm4hMH1yZXR1cm4hMX1yZXR1cm4gcih0KX12YXIgbz1yKDE1KTt0LmV4cG9ydHM9bn0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlLHIpe3ZhciBuPXQuYnl0ZUxlbmd0aDtpZihlPWV8fDAscj1yfHxuLHQuc2xpY2UpcmV0dXJuIHQuc2xpY2UoZSxyKTtpZihlPDAmJihlKz1uKSxyPDAmJihyKz1uKSxyPm4mJihyPW4pLGU+PW58fGU+PXJ8fDA9PT1uKXJldHVybiBuZXcgQXJyYXlCdWZmZXIoMCk7Zm9yKHZhciBvPW5ldyBVaW50OEFycmF5KHQpLGk9bmV3IFVpbnQ4QXJyYXkoci1lKSxzPWUsYT0wO3M8cjtzKyssYSsrKWlbYV09b1tzXTtyZXR1cm4gaS5idWZmZXJ9fSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCxlLHIpe2Z1bmN0aW9uIG8odCxuKXtpZihvLmNvdW50PD0wKXRocm93IG5ldyBFcnJvcihcImFmdGVyIGNhbGxlZCB0b28gbWFueSB0aW1lc1wiKTstLW8uY291bnQsdD8oaT0hMCxlKHQpLGU9cik6MCE9PW8uY291bnR8fGl8fGUobnVsbCxuKX12YXIgaT0hMTtyZXR1cm4gcj1yfHxuLG8uY291bnQ9dCwwPT09dD9lKCk6b31mdW5jdGlvbiBuKCl7fXQuZXhwb3J0cz1yfSxmdW5jdGlvbih0LGUscil7dmFyIG47KGZ1bmN0aW9uKHQsbyl7IWZ1bmN0aW9uKGkpe2Z1bmN0aW9uIHModCl7Zm9yKHZhciBlLHIsbj1bXSxvPTAsaT10Lmxlbmd0aDtvPGk7KWU9dC5jaGFyQ29kZUF0KG8rKyksZT49NTUyOTYmJmU8PTU2MzE5JiZvPGk/KHI9dC5jaGFyQ29kZUF0KG8rKyksNTYzMjA9PSg2NDUxMiZyKT9uLnB1c2goKCgxMDIzJmUpPDwxMCkrKDEwMjMmcikrNjU1MzYpOihuLnB1c2goZSksby0tKSk6bi5wdXNoKGUpO3JldHVybiBufWZ1bmN0aW9uIGEodCl7Zm9yKHZhciBlLHI9dC5sZW5ndGgsbj0tMSxvPVwiXCI7KytuPHI7KWU9dFtuXSxlPjY1NTM1JiYoZS09NjU1MzYsbys9YihlPj4+MTAmMTAyM3w1NTI5NiksZT01NjMyMHwxMDIzJmUpLG8rPWIoZSk7cmV0dXJuIG99ZnVuY3Rpb24gYyh0LGUpe3JldHVybiBiKHQ+PmUmNjN8MTI4KX1mdW5jdGlvbiB1KHQpe2lmKDA9PSg0Mjk0OTY3MTY4JnQpKXJldHVybiBiKHQpO3ZhciBlPVwiXCI7cmV0dXJuIDA9PSg0Mjk0OTY1MjQ4JnQpP2U9Yih0Pj42JjMxfDE5Mik6MD09KDQyOTQ5MDE3NjAmdCk/KGU9Yih0Pj4xMiYxNXwyMjQpLGUrPWModCw2KSk6MD09KDQyOTI4NzAxNDQmdCkmJihlPWIodD4+MTgmN3wyNDApLGUrPWModCwxMiksZSs9Yyh0LDYpKSxlKz1iKDYzJnR8MTI4KX1mdW5jdGlvbiBoKHQpe2Zvcih2YXIgZSxyPXModCksbj1yLmxlbmd0aCxvPS0xLGk9XCJcIjsrK288bjspZT1yW29dLGkrPXUoZSk7cmV0dXJuIGl9ZnVuY3Rpb24gcCgpe2lmKHY+PW0pdGhyb3cgRXJyb3IoXCJJbnZhbGlkIGJ5dGUgaW5kZXhcIik7dmFyIHQ9MjU1Jmdbdl07aWYodisrLDEyOD09KDE5MiZ0KSlyZXR1cm4gNjMmdDt0aHJvdyBFcnJvcihcIkludmFsaWQgY29udGludWF0aW9uIGJ5dGVcIil9ZnVuY3Rpb24gZigpe3ZhciB0LGUscixuLG87aWYodj5tKXRocm93IEVycm9yKFwiSW52YWxpZCBieXRlIGluZGV4XCIpO2lmKHY9PW0pcmV0dXJuITE7aWYodD0yNTUmZ1t2XSx2KyssMD09KDEyOCZ0KSlyZXR1cm4gdDtpZigxOTI9PSgyMjQmdCkpe3ZhciBlPXAoKTtpZihvPSgzMSZ0KTw8NnxlLG8+PTEyOClyZXR1cm4gbzt0aHJvdyBFcnJvcihcIkludmFsaWQgY29udGludWF0aW9uIGJ5dGVcIil9aWYoMjI0PT0oMjQwJnQpKXtpZihlPXAoKSxyPXAoKSxvPSgxNSZ0KTw8MTJ8ZTw8NnxyLG8+PTIwNDgpcmV0dXJuIG87dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWlmKDI0MD09KDI0OCZ0KSYmKGU9cCgpLHI9cCgpLG49cCgpLG89KDE1JnQpPDwxOHxlPDwxMnxyPDw2fG4sbz49NjU1MzYmJm88PTExMTQxMTEpKXJldHVybiBvO3Rocm93IEVycm9yKFwiSW52YWxpZCBXVEYtOCBkZXRlY3RlZFwiKX1mdW5jdGlvbiBsKHQpe2c9cyh0KSxtPWcubGVuZ3RoLHY9MDtmb3IodmFyIGUscj1bXTsoZT1mKCkpIT09ITE7KXIucHVzaChlKTtyZXR1cm4gYShyKX12YXIgZD1cIm9iamVjdFwiPT10eXBlb2YgZSYmZSx5PShcIm9iamVjdFwiPT10eXBlb2YgdCYmdCYmdC5leHBvcnRzPT1kJiZ0LFwib2JqZWN0XCI9PXR5cGVvZiBvJiZvKTt5Lmdsb2JhbCE9PXkmJnkud2luZG93IT09eXx8KGk9eSk7dmFyIGcsbSx2LGI9U3RyaW5nLmZyb21DaGFyQ29kZSx3PXt2ZXJzaW9uOlwiMS4wLjBcIixlbmNvZGU6aCxkZWNvZGU6bH07bj1mdW5jdGlvbigpe3JldHVybiB3fS5jYWxsKGUscixlLHQpLCEodm9pZCAwIT09biYmKHQuZXhwb3J0cz1uKSl9KHRoaXMpfSkuY2FsbChlLHIoMTIpKHQpLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpeyFmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Zvcih2YXIgdD1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIixyPW5ldyBVaW50OEFycmF5KDI1Niksbj0wO248dC5sZW5ndGg7bisrKXJbdC5jaGFyQ29kZUF0KG4pXT1uO2UuZW5jb2RlPWZ1bmN0aW9uKGUpe3ZhciByLG49bmV3IFVpbnQ4QXJyYXkoZSksbz1uLmxlbmd0aCxpPVwiXCI7Zm9yKHI9MDtyPG87cis9MylpKz10W25bcl0+PjJdLGkrPXRbKDMmbltyXSk8PDR8bltyKzFdPj40XSxpKz10WygxNSZuW3IrMV0pPDwyfG5bcisyXT4+Nl0saSs9dFs2MyZuW3IrMl1dO3JldHVybiBvJTM9PT0yP2k9aS5zdWJzdHJpbmcoMCxpLmxlbmd0aC0xKStcIj1cIjpvJTM9PT0xJiYoaT1pLnN1YnN0cmluZygwLGkubGVuZ3RoLTIpK1wiPT1cIiksaX0sZS5kZWNvZGU9ZnVuY3Rpb24odCl7dmFyIGUsbixvLGkscyxhPS43NSp0Lmxlbmd0aCxjPXQubGVuZ3RoLHU9MDtcIj1cIj09PXRbdC5sZW5ndGgtMV0mJihhLS0sXCI9XCI9PT10W3QubGVuZ3RoLTJdJiZhLS0pO3ZhciBoPW5ldyBBcnJheUJ1ZmZlcihhKSxwPW5ldyBVaW50OEFycmF5KGgpO2ZvcihlPTA7ZTxjO2UrPTQpbj1yW3QuY2hhckNvZGVBdChlKV0sbz1yW3QuY2hhckNvZGVBdChlKzEpXSxpPXJbdC5jaGFyQ29kZUF0KGUrMildLHM9clt0LmNoYXJDb2RlQXQoZSszKV0scFt1KytdPW48PDJ8bz4+NCxwW3UrK109KDE1Jm8pPDw0fGk+PjIscFt1KytdPSgzJmkpPDw2fDYzJnM7cmV0dXJuIGh9fSgpfSxmdW5jdGlvbih0LGUpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiByKHQpe2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXt2YXIgcj10W2VdO2lmKHIuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe3ZhciBuPXIuYnVmZmVyO2lmKHIuYnl0ZUxlbmd0aCE9PW4uYnl0ZUxlbmd0aCl7dmFyIG89bmV3IFVpbnQ4QXJyYXkoci5ieXRlTGVuZ3RoKTtvLnNldChuZXcgVWludDhBcnJheShuLHIuYnl0ZU9mZnNldCxyLmJ5dGVMZW5ndGgpKSxuPW8uYnVmZmVyfXRbZV09bn19fWZ1bmN0aW9uIG4odCxlKXtlPWV8fHt9O3ZhciBuPW5ldyBpO3IodCk7Zm9yKHZhciBvPTA7bzx0Lmxlbmd0aDtvKyspbi5hcHBlbmQodFtvXSk7cmV0dXJuIGUudHlwZT9uLmdldEJsb2IoZS50eXBlKTpuLmdldEJsb2IoKX1mdW5jdGlvbiBvKHQsZSl7cmV0dXJuIHIodCksbmV3IEJsb2IodCxlfHx7fSl9dmFyIGk9ZS5CbG9iQnVpbGRlcnx8ZS5XZWJLaXRCbG9iQnVpbGRlcnx8ZS5NU0Jsb2JCdWlsZGVyfHxlLk1vekJsb2JCdWlsZGVyLHM9ZnVuY3Rpb24oKXt0cnl7dmFyIHQ9bmV3IEJsb2IoW1wiaGlcIl0pO3JldHVybiAyPT09dC5zaXplfWNhdGNoKHQpe3JldHVybiExfX0oKSxhPXMmJmZ1bmN0aW9uKCl7dHJ5e3ZhciB0PW5ldyBCbG9iKFtuZXcgVWludDhBcnJheShbMSwyXSldKTtyZXR1cm4gMj09PXQuc2l6ZX1jYXRjaCh0KXtyZXR1cm4hMX19KCksYz1pJiZpLnByb3RvdHlwZS5hcHBlbmQmJmkucHJvdG90eXBlLmdldEJsb2I7dC5leHBvcnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHM/YT9lLkJsb2I6bzpjP246dm9pZCAwfSgpfSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtpZih0KXJldHVybiBvKHQpfWZ1bmN0aW9uIG8odCl7Zm9yKHZhciBlIGluIG4ucHJvdG90eXBlKXRbZV09bi5wcm90b3R5cGVbZV07cmV0dXJuIHR9dC5leHBvcnRzPW4sbi5wcm90b3R5cGUub249bi5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSwodGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdPXRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XXx8W10pLnB1c2goZSksdGhpc30sbi5wcm90b3R5cGUub25jZT1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIoKXt0aGlzLm9mZih0LHIpLGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiByLmZuPWUsdGhpcy5vbih0LHIpLHRoaXN9LG4ucHJvdG90eXBlLm9mZj1uLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcj1uLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnM9bi5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe2lmKHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LDA9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX2NhbGxiYWNrcz17fSx0aGlzO3ZhciByPXRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XTtpZighcilyZXR1cm4gdGhpcztpZigxPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdLHRoaXM7Zm9yKHZhciBuLG89MDtvPHIubGVuZ3RoO28rKylpZihuPXJbb10sbj09PWV8fG4uZm49PT1lKXtyLnNwbGljZShvLDEpO2JyZWFrfXJldHVybiB0aGlzfSxuLnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKHQpe3RoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9O3ZhciBlPVtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHI9dGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdO2lmKHIpe3I9ci5zbGljZSgwKTtmb3IodmFyIG49MCxvPXIubGVuZ3RoO248bzsrK24pcltuXS5hcHBseSh0aGlzLGUpfXJldHVybiB0aGlzfSxuLnByb3RvdHlwZS5saXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LHRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XXx8W119LG4ucHJvdG90eXBlLmhhc0xpc3RlbmVycz1mdW5jdGlvbih0KXtyZXR1cm4hIXRoaXMubGlzdGVuZXJzKHQpLmxlbmd0aH19LGZ1bmN0aW9uKHQsZSl7ZS5lbmNvZGU9ZnVuY3Rpb24odCl7dmFyIGU9XCJcIjtmb3IodmFyIHIgaW4gdCl0Lmhhc093blByb3BlcnR5KHIpJiYoZS5sZW5ndGgmJihlKz1cIiZcIiksZSs9ZW5jb2RlVVJJQ29tcG9uZW50KHIpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudCh0W3JdKSk7cmV0dXJuIGV9LGUuZGVjb2RlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT17fSxyPXQuc3BsaXQoXCImXCIpLG49MCxvPXIubGVuZ3RoO248bztuKyspe3ZhciBpPXJbbl0uc3BsaXQoXCI9XCIpO2VbZGVjb2RlVVJJQ29tcG9uZW50KGlbMF0pXT1kZWNvZGVVUklDb21wb25lbnQoaVsxXSl9cmV0dXJuIGV9fSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3ZhciByPWZ1bmN0aW9uKCl7fTtyLnByb3RvdHlwZT1lLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgcix0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10fX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3ZhciBlPVwiXCI7ZG8gZT1zW3QlYV0rZSx0PU1hdGguZmxvb3IodC9hKTt3aGlsZSh0PjApO3JldHVybiBlfWZ1bmN0aW9uIG4odCl7dmFyIGU9MDtmb3IoaD0wO2g8dC5sZW5ndGg7aCsrKWU9ZSphK2NbdC5jaGFyQXQoaCldO3JldHVybiBlfWZ1bmN0aW9uIG8oKXt2YXIgdD1yKCtuZXcgRGF0ZSk7cmV0dXJuIHQhPT1pPyh1PTAsaT10KTp0K1wiLlwiK3IodSsrKX1mb3IodmFyIGkscz1cIjAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6LV9cIi5zcGxpdChcIlwiKSxhPTY0LGM9e30sdT0wLGg9MDtoPGE7aCsrKWNbc1toXV09aDtvLmVuY29kZT1yLG8uZGVjb2RlPW4sdC5leHBvcnRzPW99LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKHQpe2kuY2FsbCh0aGlzLHQpLHRoaXMucXVlcnk9dGhpcy5xdWVyeXx8e30sYXx8KGUuX19fZWlvfHwoZS5fX19laW89W10pLGE9ZS5fX19laW8pLHRoaXMuaW5kZXg9YS5sZW5ndGg7dmFyIHI9dGhpczthLnB1c2goZnVuY3Rpb24odCl7ci5vbkRhdGEodCl9KSx0aGlzLnF1ZXJ5Lmo9dGhpcy5pbmRleCxlLmRvY3VtZW50JiZlLmFkZEV2ZW50TGlzdGVuZXImJmUuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLGZ1bmN0aW9uKCl7ci5zY3JpcHQmJihyLnNjcmlwdC5vbmVycm9yPW4pfSwhMSl9dmFyIGk9cigyNSkscz1yKDM3KTt0LmV4cG9ydHM9bzt2YXIgYSxjPS9cXG4vZyx1PS9cXFxcbi9nO3MobyxpKSxvLnByb3RvdHlwZS5zdXBwb3J0c0JpbmFyeT0hMSxvLnByb3RvdHlwZS5kb0Nsb3NlPWZ1bmN0aW9uKCl7dGhpcy5zY3JpcHQmJih0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KSx0aGlzLnNjcmlwdD1udWxsKSx0aGlzLmZvcm0mJih0aGlzLmZvcm0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmZvcm0pLHRoaXMuZm9ybT1udWxsLHRoaXMuaWZyYW1lPW51bGwpLGkucHJvdG90eXBlLmRvQ2xvc2UuY2FsbCh0aGlzKX0sby5wcm90b3R5cGUuZG9Qb2xsPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dGhpcy5zY3JpcHQmJih0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KSx0aGlzLnNjcmlwdD1udWxsKSxlLmFzeW5jPSEwLGUuc3JjPXRoaXMudXJpKCksZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3Qub25FcnJvcihcImpzb25wIHBvbGwgZXJyb3JcIixlKX07dmFyIHI9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF07cj9yLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUscik6KGRvY3VtZW50LmhlYWR8fGRvY3VtZW50LmJvZHkpLmFwcGVuZENoaWxkKGUpLHRoaXMuc2NyaXB0PWU7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL2dlY2tvL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtuJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodCl9LDEwMCl9LG8ucHJvdG90eXBlLmRvV3JpdGU9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7bigpLGUoKX1mdW5jdGlvbiBuKCl7aWYoby5pZnJhbWUpdHJ5e28uZm9ybS5yZW1vdmVDaGlsZChvLmlmcmFtZSl9Y2F0Y2godCl7by5vbkVycm9yKFwianNvbnAgcG9sbGluZyBpZnJhbWUgcmVtb3ZhbCBlcnJvclwiLHQpfXRyeXt2YXIgdD0nPGlmcmFtZSBzcmM9XCJqYXZhc2NyaXB0OjBcIiBuYW1lPVwiJytvLmlmcmFtZUlkKydcIj4nO2k9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0KX1jYXRjaCh0KXtpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksaS5uYW1lPW8uaWZyYW1lSWQsaS5zcmM9XCJqYXZhc2NyaXB0OjBcIn1pLmlkPW8uaWZyYW1lSWQsby5mb3JtLmFwcGVuZENoaWxkKGkpLG8uaWZyYW1lPWl9dmFyIG89dGhpcztpZighdGhpcy5mb3JtKXt2YXIgaSxzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpLGg9dGhpcy5pZnJhbWVJZD1cImVpb19pZnJhbWVfXCIrdGhpcy5pbmRleDtzLmNsYXNzTmFtZT1cInNvY2tldGlvXCIscy5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCIscy5zdHlsZS50b3A9XCItMTAwMHB4XCIscy5zdHlsZS5sZWZ0PVwiLTEwMDBweFwiLHMudGFyZ2V0PWgscy5tZXRob2Q9XCJQT1NUXCIscy5zZXRBdHRyaWJ1dGUoXCJhY2NlcHQtY2hhcnNldFwiLFwidXRmLThcIiksYS5uYW1lPVwiZFwiLHMuYXBwZW5kQ2hpbGQoYSksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKSx0aGlzLmZvcm09cyx0aGlzLmFyZWE9YX10aGlzLmZvcm0uYWN0aW9uPXRoaXMudXJpKCksbigpLHQ9dC5yZXBsYWNlKHUsXCJcXFxcXFxuXCIpLHRoaXMuYXJlYS52YWx1ZT10LnJlcGxhY2UoYyxcIlxcXFxuXCIpO3RyeXt0aGlzLmZvcm0uc3VibWl0KCl9Y2F0Y2godCl7fXRoaXMuaWZyYW1lLmF0dGFjaEV2ZW50P3RoaXMuaWZyYW1lLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe1wiY29tcGxldGVcIj09PW8uaWZyYW1lLnJlYWR5U3RhdGUmJnIoKTtcbn06dGhpcy5pZnJhbWUub25sb2FkPXJ9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dCYmdC5mb3JjZUJhc2U2NDtlJiYodGhpcy5zdXBwb3J0c0JpbmFyeT0hMSksdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZT10LnBlck1lc3NhZ2VEZWZsYXRlLHRoaXMudXNpbmdCcm93c2VyV2ViU29ja2V0PXAmJiF0LmZvcmNlTm9kZSx0aGlzLnVzaW5nQnJvd3NlcldlYlNvY2tldHx8KGY9byksaS5jYWxsKHRoaXMsdCl9dmFyIG8saT1yKDI2KSxzPXIoMjcpLGE9cigzNiksYz1yKDM3KSx1PXIoMzgpLGg9cigzKShcImVuZ2luZS5pby1jbGllbnQ6d2Vic29ja2V0XCIpLHA9ZS5XZWJTb2NrZXR8fGUuTW96V2ViU29ja2V0O2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cpdHJ5e289cig0MSl9Y2F0Y2godCl7fXZhciBmPXA7Znx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvd3x8KGY9byksdC5leHBvcnRzPW4sYyhuLGkpLG4ucHJvdG90eXBlLm5hbWU9XCJ3ZWJzb2NrZXRcIixuLnByb3RvdHlwZS5zdXBwb3J0c0JpbmFyeT0hMCxuLnByb3RvdHlwZS5kb09wZW49ZnVuY3Rpb24oKXtpZih0aGlzLmNoZWNrKCkpe3ZhciB0PXRoaXMudXJpKCksZT12b2lkIDAscj17YWdlbnQ6dGhpcy5hZ2VudCxwZXJNZXNzYWdlRGVmbGF0ZTp0aGlzLnBlck1lc3NhZ2VEZWZsYXRlfTtyLnBmeD10aGlzLnBmeCxyLmtleT10aGlzLmtleSxyLnBhc3NwaHJhc2U9dGhpcy5wYXNzcGhyYXNlLHIuY2VydD10aGlzLmNlcnQsci5jYT10aGlzLmNhLHIuY2lwaGVycz10aGlzLmNpcGhlcnMsci5yZWplY3RVbmF1dGhvcml6ZWQ9dGhpcy5yZWplY3RVbmF1dGhvcml6ZWQsdGhpcy5leHRyYUhlYWRlcnMmJihyLmhlYWRlcnM9dGhpcy5leHRyYUhlYWRlcnMpLHRoaXMubG9jYWxBZGRyZXNzJiYoci5sb2NhbEFkZHJlc3M9dGhpcy5sb2NhbEFkZHJlc3MpO3RyeXt0aGlzLndzPXRoaXMudXNpbmdCcm93c2VyV2ViU29ja2V0P25ldyBmKHQpOm5ldyBmKHQsZSxyKX1jYXRjaCh0KXtyZXR1cm4gdGhpcy5lbWl0KFwiZXJyb3JcIix0KX12b2lkIDA9PT10aGlzLndzLmJpbmFyeVR5cGUmJih0aGlzLnN1cHBvcnRzQmluYXJ5PSExKSx0aGlzLndzLnN1cHBvcnRzJiZ0aGlzLndzLnN1cHBvcnRzLmJpbmFyeT8odGhpcy5zdXBwb3J0c0JpbmFyeT0hMCx0aGlzLndzLmJpbmFyeVR5cGU9XCJub2RlYnVmZmVyXCIpOnRoaXMud3MuYmluYXJ5VHlwZT1cImFycmF5YnVmZmVyXCIsdGhpcy5hZGRFdmVudExpc3RlbmVycygpfX0sbi5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3RoaXMud3Mub25vcGVuPWZ1bmN0aW9uKCl7dC5vbk9wZW4oKX0sdGhpcy53cy5vbmNsb3NlPWZ1bmN0aW9uKCl7dC5vbkNsb3NlKCl9LHRoaXMud3Mub25tZXNzYWdlPWZ1bmN0aW9uKGUpe3Qub25EYXRhKGUuZGF0YSl9LHRoaXMud3Mub25lcnJvcj1mdW5jdGlvbihlKXt0Lm9uRXJyb3IoXCJ3ZWJzb2NrZXQgZXJyb3JcIixlKX19LG4ucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoKXtuLmVtaXQoXCJmbHVzaFwiKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi53cml0YWJsZT0hMCxuLmVtaXQoXCJkcmFpblwiKX0sMCl9dmFyIG49dGhpczt0aGlzLndyaXRhYmxlPSExO2Zvcih2YXIgbz10Lmxlbmd0aCxpPTAsYT1vO2k8YTtpKyspIWZ1bmN0aW9uKHQpe3MuZW5jb2RlUGFja2V0KHQsbi5zdXBwb3J0c0JpbmFyeSxmdW5jdGlvbihpKXtpZighbi51c2luZ0Jyb3dzZXJXZWJTb2NrZXQpe3ZhciBzPXt9O2lmKHQub3B0aW9ucyYmKHMuY29tcHJlc3M9dC5vcHRpb25zLmNvbXByZXNzKSxuLnBlck1lc3NhZ2VEZWZsYXRlKXt2YXIgYT1cInN0cmluZ1wiPT10eXBlb2YgaT9lLkJ1ZmZlci5ieXRlTGVuZ3RoKGkpOmkubGVuZ3RoO2E8bi5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQmJihzLmNvbXByZXNzPSExKX19dHJ5e24udXNpbmdCcm93c2VyV2ViU29ja2V0P24ud3Muc2VuZChpKTpuLndzLnNlbmQoaSxzKX1jYXRjaCh0KXtoKFwid2Vic29ja2V0IGNsb3NlZCBiZWZvcmUgb25jbG9zZSBldmVudFwiKX0tLW98fHIoKX0pfSh0W2ldKX0sbi5wcm90b3R5cGUub25DbG9zZT1mdW5jdGlvbigpe2kucHJvdG90eXBlLm9uQ2xvc2UuY2FsbCh0aGlzKX0sbi5wcm90b3R5cGUuZG9DbG9zZT1mdW5jdGlvbigpe1widW5kZWZpbmVkXCIhPXR5cGVvZiB0aGlzLndzJiZ0aGlzLndzLmNsb3NlKCl9LG4ucHJvdG90eXBlLnVyaT1mdW5jdGlvbigpe3ZhciB0PXRoaXMucXVlcnl8fHt9LGU9dGhpcy5zZWN1cmU/XCJ3c3NcIjpcIndzXCIscj1cIlwiO3RoaXMucG9ydCYmKFwid3NzXCI9PT1lJiY0NDMhPT1OdW1iZXIodGhpcy5wb3J0KXx8XCJ3c1wiPT09ZSYmODAhPT1OdW1iZXIodGhpcy5wb3J0KSkmJihyPVwiOlwiK3RoaXMucG9ydCksdGhpcy50aW1lc3RhbXBSZXF1ZXN0cyYmKHRbdGhpcy50aW1lc3RhbXBQYXJhbV09dSgpKSx0aGlzLnN1cHBvcnRzQmluYXJ5fHwodC5iNjQ9MSksdD1hLmVuY29kZSh0KSx0Lmxlbmd0aCYmKHQ9XCI/XCIrdCk7dmFyIG49dGhpcy5ob3N0bmFtZS5pbmRleE9mKFwiOlwiKSE9PS0xO3JldHVybiBlK1wiOi8vXCIrKG4/XCJbXCIrdGhpcy5ob3N0bmFtZStcIl1cIjp0aGlzLmhvc3RuYW1lKStyK3RoaXMucGF0aCt0fSxuLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbigpe3JldHVybiEoIWZ8fFwiX19pbml0aWFsaXplXCJpbiBmJiZ0aGlzLm5hbWU9PT1uLnByb3RvdHlwZS5uYW1lKX19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7fSxmdW5jdGlvbih0LGUpe3ZhciByPVtdLmluZGV4T2Y7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7aWYocilyZXR1cm4gdC5pbmRleE9mKGUpO2Zvcih2YXIgbj0wO248dC5sZW5ndGg7KytuKWlmKHRbbl09PT1lKXJldHVybiBuO3JldHVybi0xfX0sZnVuY3Rpb24odCxlKXsoZnVuY3Rpb24oZSl7dmFyIHI9L15bXFxdLDp7fVxcc10qJC8sbj0vXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nLG89L1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLGk9Lyg/Ol58OnwsKSg/OlxccypcXFspKy9nLHM9L15cXHMrLyxhPS9cXHMrJC87dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0JiZ0Pyh0PXQucmVwbGFjZShzLFwiXCIpLnJlcGxhY2UoYSxcIlwiKSxlLkpTT04mJkpTT04ucGFyc2U/SlNPTi5wYXJzZSh0KTpyLnRlc3QodC5yZXBsYWNlKG4sXCJAXCIpLnJlcGxhY2UobyxcIl1cIikucmVwbGFjZShpLFwiXCIpKT9uZXcgRnVuY3Rpb24oXCJyZXR1cm4gXCIrdCkoKTp2b2lkIDApOm51bGx9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUscil7dGhpcy5pbz10LHRoaXMubnNwPWUsdGhpcy5qc29uPXRoaXMsdGhpcy5pZHM9MCx0aGlzLmFja3M9e30sdGhpcy5yZWNlaXZlQnVmZmVyPVtdLHRoaXMuc2VuZEJ1ZmZlcj1bXSx0aGlzLmNvbm5lY3RlZD0hMSx0aGlzLmRpc2Nvbm5lY3RlZD0hMCxyJiZyLnF1ZXJ5JiYodGhpcy5xdWVyeT1yLnF1ZXJ5KSx0aGlzLmlvLmF1dG9Db25uZWN0JiZ0aGlzLm9wZW4oKX12YXIgbz1yKDcpLGk9cigzNSkscz1yKDQ1KSxhPXIoNDYpLGM9cig0NyksdT1yKDMpKFwic29ja2V0LmlvLWNsaWVudDpzb2NrZXRcIiksaD1yKDI5KTt0LmV4cG9ydHM9ZT1uO3ZhciBwPXtjb25uZWN0OjEsY29ubmVjdF9lcnJvcjoxLGNvbm5lY3RfdGltZW91dDoxLGNvbm5lY3Rpbmc6MSxkaXNjb25uZWN0OjEsZXJyb3I6MSxyZWNvbm5lY3Q6MSxyZWNvbm5lY3RfYXR0ZW1wdDoxLHJlY29ubmVjdF9mYWlsZWQ6MSxyZWNvbm5lY3RfZXJyb3I6MSxyZWNvbm5lY3Rpbmc6MSxwaW5nOjEscG9uZzoxfSxmPWkucHJvdG90eXBlLmVtaXQ7aShuLnByb3RvdHlwZSksbi5wcm90b3R5cGUuc3ViRXZlbnRzPWZ1bmN0aW9uKCl7aWYoIXRoaXMuc3Vicyl7dmFyIHQ9dGhpcy5pbzt0aGlzLnN1YnM9W2EodCxcIm9wZW5cIixjKHRoaXMsXCJvbm9wZW5cIikpLGEodCxcInBhY2tldFwiLGModGhpcyxcIm9ucGFja2V0XCIpKSxhKHQsXCJjbG9zZVwiLGModGhpcyxcIm9uY2xvc2VcIikpXX19LG4ucHJvdG90eXBlLm9wZW49bi5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbm5lY3RlZD90aGlzOih0aGlzLnN1YkV2ZW50cygpLHRoaXMuaW8ub3BlbigpLFwib3BlblwiPT09dGhpcy5pby5yZWFkeVN0YXRlJiZ0aGlzLm9ub3BlbigpLHRoaXMuZW1pdChcImNvbm5lY3RpbmdcIiksdGhpcyl9LG4ucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24oKXt2YXIgdD1zKGFyZ3VtZW50cyk7cmV0dXJuIHQudW5zaGlmdChcIm1lc3NhZ2VcIiksdGhpcy5lbWl0LmFwcGx5KHRoaXMsdCksdGhpc30sbi5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0KXtpZihwLmhhc093blByb3BlcnR5KHQpKXJldHVybiBmLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzO3ZhciBlPXMoYXJndW1lbnRzKSxyPW8uRVZFTlQ7aChlKSYmKHI9by5CSU5BUllfRVZFTlQpO3ZhciBuPXt0eXBlOnIsZGF0YTplfTtyZXR1cm4gbi5vcHRpb25zPXt9LG4ub3B0aW9ucy5jb21wcmVzcz0hdGhpcy5mbGFnc3x8ITEhPT10aGlzLmZsYWdzLmNvbXByZXNzLFwiZnVuY3Rpb25cIj09dHlwZW9mIGVbZS5sZW5ndGgtMV0mJih1KFwiZW1pdHRpbmcgcGFja2V0IHdpdGggYWNrIGlkICVkXCIsdGhpcy5pZHMpLHRoaXMuYWNrc1t0aGlzLmlkc109ZS5wb3AoKSxuLmlkPXRoaXMuaWRzKyspLHRoaXMuY29ubmVjdGVkP3RoaXMucGFja2V0KG4pOnRoaXMuc2VuZEJ1ZmZlci5wdXNoKG4pLGRlbGV0ZSB0aGlzLmZsYWdzLHRoaXN9LG4ucHJvdG90eXBlLnBhY2tldD1mdW5jdGlvbih0KXt0Lm5zcD10aGlzLm5zcCx0aGlzLmlvLnBhY2tldCh0KX0sbi5wcm90b3R5cGUub25vcGVuPWZ1bmN0aW9uKCl7dShcInRyYW5zcG9ydCBpcyBvcGVuIC0gY29ubmVjdGluZ1wiKSxcIi9cIiE9PXRoaXMubnNwJiYodGhpcy5xdWVyeT90aGlzLnBhY2tldCh7dHlwZTpvLkNPTk5FQ1QscXVlcnk6dGhpcy5xdWVyeX0pOnRoaXMucGFja2V0KHt0eXBlOm8uQ09OTkVDVH0pKX0sbi5wcm90b3R5cGUub25jbG9zZT1mdW5jdGlvbih0KXt1KFwiY2xvc2UgKCVzKVwiLHQpLHRoaXMuY29ubmVjdGVkPSExLHRoaXMuZGlzY29ubmVjdGVkPSEwLGRlbGV0ZSB0aGlzLmlkLHRoaXMuZW1pdChcImRpc2Nvbm5lY3RcIix0KX0sbi5wcm90b3R5cGUub25wYWNrZXQ9ZnVuY3Rpb24odCl7aWYodC5uc3A9PT10aGlzLm5zcClzd2l0Y2godC50eXBlKXtjYXNlIG8uQ09OTkVDVDp0aGlzLm9uY29ubmVjdCgpO2JyZWFrO2Nhc2Ugby5FVkVOVDp0aGlzLm9uZXZlbnQodCk7YnJlYWs7Y2FzZSBvLkJJTkFSWV9FVkVOVDp0aGlzLm9uZXZlbnQodCk7YnJlYWs7Y2FzZSBvLkFDSzp0aGlzLm9uYWNrKHQpO2JyZWFrO2Nhc2Ugby5CSU5BUllfQUNLOnRoaXMub25hY2sodCk7YnJlYWs7Y2FzZSBvLkRJU0NPTk5FQ1Q6dGhpcy5vbmRpc2Nvbm5lY3QoKTticmVhaztjYXNlIG8uRVJST1I6dGhpcy5lbWl0KFwiZXJyb3JcIix0LmRhdGEpfX0sbi5wcm90b3R5cGUub25ldmVudD1mdW5jdGlvbih0KXt2YXIgZT10LmRhdGF8fFtdO3UoXCJlbWl0dGluZyBldmVudCAlalwiLGUpLG51bGwhPXQuaWQmJih1KFwiYXR0YWNoaW5nIGFjayBjYWxsYmFjayB0byBldmVudFwiKSxlLnB1c2godGhpcy5hY2sodC5pZCkpKSx0aGlzLmNvbm5lY3RlZD9mLmFwcGx5KHRoaXMsZSk6dGhpcy5yZWNlaXZlQnVmZmVyLnB1c2goZSl9LG4ucHJvdG90eXBlLmFjaz1mdW5jdGlvbih0KXt2YXIgZT10aGlzLHI9ITE7cmV0dXJuIGZ1bmN0aW9uKCl7aWYoIXIpe3I9ITA7dmFyIG49cyhhcmd1bWVudHMpO3UoXCJzZW5kaW5nIGFjayAlalwiLG4pO3ZhciBpPWgobik/by5CSU5BUllfQUNLOm8uQUNLO2UucGFja2V0KHt0eXBlOmksaWQ6dCxkYXRhOm59KX19fSxuLnByb3RvdHlwZS5vbmFjaz1mdW5jdGlvbih0KXt2YXIgZT10aGlzLmFja3NbdC5pZF07XCJmdW5jdGlvblwiPT10eXBlb2YgZT8odShcImNhbGxpbmcgYWNrICVzIHdpdGggJWpcIix0LmlkLHQuZGF0YSksZS5hcHBseSh0aGlzLHQuZGF0YSksZGVsZXRlIHRoaXMuYWNrc1t0LmlkXSk6dShcImJhZCBhY2sgJXNcIix0LmlkKX0sbi5wcm90b3R5cGUub25jb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5jb25uZWN0ZWQ9ITAsdGhpcy5kaXNjb25uZWN0ZWQ9ITEsdGhpcy5lbWl0KFwiY29ubmVjdFwiKSx0aGlzLmVtaXRCdWZmZXJlZCgpfSxuLnByb3RvdHlwZS5lbWl0QnVmZmVyZWQ9ZnVuY3Rpb24oKXt2YXIgdDtmb3IodD0wO3Q8dGhpcy5yZWNlaXZlQnVmZmVyLmxlbmd0aDt0KyspZi5hcHBseSh0aGlzLHRoaXMucmVjZWl2ZUJ1ZmZlclt0XSk7Zm9yKHRoaXMucmVjZWl2ZUJ1ZmZlcj1bXSx0PTA7dDx0aGlzLnNlbmRCdWZmZXIubGVuZ3RoO3QrKyl0aGlzLnBhY2tldCh0aGlzLnNlbmRCdWZmZXJbdF0pO3RoaXMuc2VuZEJ1ZmZlcj1bXX0sbi5wcm90b3R5cGUub25kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dShcInNlcnZlciBkaXNjb25uZWN0ICglcylcIix0aGlzLm5zcCksdGhpcy5kZXN0cm95KCksdGhpcy5vbmNsb3NlKFwiaW8gc2VydmVyIGRpc2Nvbm5lY3RcIil9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtpZih0aGlzLnN1YnMpe2Zvcih2YXIgdD0wO3Q8dGhpcy5zdWJzLmxlbmd0aDt0KyspdGhpcy5zdWJzW3RdLmRlc3Ryb3koKTt0aGlzLnN1YnM9bnVsbH10aGlzLmlvLmRlc3Ryb3kodGhpcyl9LG4ucHJvdG90eXBlLmNsb3NlPW4ucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb25uZWN0ZWQmJih1KFwicGVyZm9ybWluZyBkaXNjb25uZWN0ICglcylcIix0aGlzLm5zcCksdGhpcy5wYWNrZXQoe3R5cGU6by5ESVNDT05ORUNUfSkpLHRoaXMuZGVzdHJveSgpLHRoaXMuY29ubmVjdGVkJiZ0aGlzLm9uY2xvc2UoXCJpbyBjbGllbnQgZGlzY29ubmVjdFwiKSx0aGlzfSxuLnByb3RvdHlwZS5jb21wcmVzcz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5mbGFncz10aGlzLmZsYWdzfHx7fSx0aGlzLmZsYWdzLmNvbXByZXNzPXQsdGhpc319LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0LGUpe3ZhciByPVtdO2U9ZXx8MDtmb3IodmFyIG49ZXx8MDtuPHQubGVuZ3RoO24rKylyW24tZV09dFtuXTtyZXR1cm4gcn10LmV4cG9ydHM9cn0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSxyKXtyZXR1cm4gdC5vbihlLHIpLHtkZXN0cm95OmZ1bmN0aW9uKCl7dC5yZW1vdmVMaXN0ZW5lcihlLHIpfX19dC5leHBvcnRzPXJ9LGZ1bmN0aW9uKHQsZSl7dmFyIHI9W10uc2xpY2U7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXRbZV0pLFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IEVycm9yKFwiYmluZCgpIHJlcXVpcmVzIGEgZnVuY3Rpb25cIik7dmFyIG49ci5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0LG4uY29uY2F0KHIuY2FsbChhcmd1bWVudHMpKSl9fX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe3Q9dHx8e30sdGhpcy5tcz10Lm1pbnx8MTAwLHRoaXMubWF4PXQubWF4fHwxZTQsdGhpcy5mYWN0b3I9dC5mYWN0b3J8fDIsdGhpcy5qaXR0ZXI9dC5qaXR0ZXI+MCYmdC5qaXR0ZXI8PTE/dC5qaXR0ZXI6MCx0aGlzLmF0dGVtcHRzPTB9dC5leHBvcnRzPXIsci5wcm90b3R5cGUuZHVyYXRpb249ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm1zKk1hdGgucG93KHRoaXMuZmFjdG9yLHRoaXMuYXR0ZW1wdHMrKyk7aWYodGhpcy5qaXR0ZXIpe3ZhciBlPU1hdGgucmFuZG9tKCkscj1NYXRoLmZsb29yKGUqdGhpcy5qaXR0ZXIqdCk7dD0wPT0oMSZNYXRoLmZsb29yKDEwKmUpKT90LXI6dCtyfXJldHVybiAwfE1hdGgubWluKHQsdGhpcy5tYXgpfSxyLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYXR0ZW1wdHM9MH0sci5wcm90b3R5cGUuc2V0TWluPWZ1bmN0aW9uKHQpe3RoaXMubXM9dH0sci5wcm90b3R5cGUuc2V0TWF4PWZ1bmN0aW9uKHQpe3RoaXMubWF4PXR9LHIucHJvdG90eXBlLnNldEppdHRlcj1mdW5jdGlvbih0KXt0aGlzLmppdHRlcj10fX1dKX0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vdmVuZG9yL3NvY2tldC5pby5taW4uanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQWtCQTs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFUQTtBQVdBO0FBWEE7QUFhQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTs7O0FBQUE7QUFPQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBckRBO0FBdURBO0FBQ0E7QUFFQTs7Ozs7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZBO0FBaUJBO0FBQ0E7QUFFQTs7Ozs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7Ozs7OztBQ2pFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBIiwic291cmNlUm9vdCI6IiJ9