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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
    'rooms': ['GTS-NLG', 'EUR-NLG']
};

module.exports = config;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var initData = function (data) {
    var bids = data['order_books']['bids'] || [];
    var asks = data['order_books']['asks'] || [];
    var market_history = data['market_history'] || [];
    var open_orders = data['open_orders'] || [];
    var order_history = data['order_history'] || [];

    function bidsT() {
        for (var i = 0; i < 10; i++) {
            if (bids[i]) {
                var bid = '<tr><td>' + Math.round(bids[i]['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(bids[i]['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + bids[i]['size(ngl)'] + '</td>\n\
                        <td>' + bids[i]['bid(btc)'] + '</td></tr>';
            } else {
                var bid = '<tr><td></td>\n\
                        <td></td>\n\
                        <td></td>\n\
                        <td></td></tr>';
            }
            ;
            $('#table-bids').find('tbody').append(bid);
        }
        ;
    }

    return function () {
        bidsT();
        console.log(bids, asks, market_history, open_orders, order_history);
        console.log('initData is working!');
    };
};

module.exports = initData;

/***/ }),
/* 2 */
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
                if (button === 'prevent') {
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
        $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        //Add the EventListeners for the control buttons
        $(table).find('.first').on('click', function () {
            if (pageNumber >= 3 && tableLength > 50) {
                //if we need to update the tableValue
                pageNumber = 1;
                downloadNext(1, 'first'); //load the records
            } else {
                pageNumber = 1;
                changePageView();
            }
        });

        $(table).find('.next').on('click', function () {
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

        $(table).find('.prevent').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                if (pageNumber > 2 && pageNumber + 1 < pageCount && tableLength > 50) {
                    if ((pageNumber - 1) % 2 === 0) {
                        downloadNext(k * (pageNumber - 3) + 1, 'prevent'); //load the records
                    } else changePageView();
                } else {
                    changePageView();
                }
                ;
            }
        });

        $(table).find('.last').on('click', function () {
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
        $(table).find('.paginnation').remove();
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
                    row += '<td>' + tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]] + '</td>';
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
                    row += '<td>' + tableValue[i][keys[key]] + '</td>';
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
                    if ($(table).find('.paginnation').length === 0) createPagination();
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
/* 3 */
/***/ (function(module, exports) {

var User = function (data) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var EUR = data['EUR'] || 0;
    var NGL = data['NGL'] || 0;

    return {
        userId: user_id,
        room: activeRoom,
        eurAvalaible: EUR,
        nglAvalaible: NGL
    };
};

module.exports = User;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function ClientSockets(objectOfTables, user) {
    //Fetch the libs
    var io = __webpack_require__(8);

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

            socket.on('connect', function () {

                var chart = __webpack_require__(6);

                //Connection to the room
                socket.emit('room', room);

                socket.emit('data_to_chart', '');
                socket.on('data_to_chart', function (msg) {
                    chart.loadData(msg);
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
/* 5 */
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

var ClientSockets = __webpack_require__(4);
var service;

var User = __webpack_require__(3);
//The object that contains the user data
var user;

var Table = __webpack_require__(2);

//Each one of tables contain the object with data and control buttons
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;

var initData = __webpack_require__(1);
var init;

//when our page are loaded, we need to get the init data
$.ajax({
    url: "http://localhost:7777/get_init_data",
    data: {
        'room': room //send the name of the room where the user is
    },
    type: "post",
    dataType: "json"
}).done(function (json) {
    //if we got the response 
    //create the user object
    user = new User(json['user']); //store the user data

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
}).fail(function (xhr, status, errorThrown) {
    console.error("Error: " + errorThrown);
}).always(function (xhr, status) {
    //console.log("The request is complete!");
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function ChartMarket() {
    var data = [];

    function createChart() {
        var cdata = data;
        anychart.onDocumentReady(function () {
            // The data used in this sample can be obtained from the CDN
            // http://cdn.anychart.com/csv-data/csco-daily.js

            // create data table on loaded data
            var dataTable = anychart.data.table();
            dataTable.addData(data);

            var stage = anychart.graphics.create('container_chart');
            // map loaded data for the ohlc series
            var mapping = dataTable.mapAs({
                'open': 1,
                'high': 2,
                'low': 3,
                'close': 4,
                'value': { column: 4, type: 'close' }
            });

            // map loaded data for the scroller
            var scrollerMapping = dataTable.mapAs();
            scrollerMapping.addField('value', 10);

            // create stock chart
            chart = anychart.stock();

            // create first plot on the chart
            var plot = chart.plot();
            plot.grid().enabled(true);
            plot.grid(1).enabled(true).layout('vertical');
            plot.minorGrid().enabled(true);
            plot.minorGrid(1).enabled(true).layout('vertical');

            var series = plot.candlestick(mapping).name('CSCO');
            series.legendItem().iconType('risingfalling');

            // create BBands indicator with period 20
            var bBandsIndicator = plot.bbands(mapping);
            bBandsIndicator.deviation(2.5);

            var indicatorPlot = chart.plot(1);
            indicatorPlot.height('30%');

            // create BBands Width indicator with period 20
            var bBandsWidthIndicator = indicatorPlot.bbandsWidth(mapping).series('splineArea');
            bBandsWidthIndicator.deviation(2.5);

            var indicatorSeries = bBandsWidthIndicator.series();
            indicatorSeries.stroke('1.5 #F18126');
            indicatorSeries.fill(anychart.color.lighten(indicatorSeries.stroke().color, 0.5));

            // create scroller series with mapped data
            chart.scroller().candlestick(mapping);

            // set container id for the chart
            chart.container(stage);

            // set chart selected date/time range
            chart.selectRange('1990-04-18', '1990-05-17');

            // initiate chart drawing
            chart.draw();
        });
    };

    return {
        loadData: function (object) {
            data = object['data'];
            console.log('create chart');
            createChart();
        }
    };
}
;

module.exports = ChartMarket();

/***/ }),
/* 7 */,
/* 8 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDAwMGU5MjMyNGE5OWU0MDAyNjAiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9zZXJ2aWNlcy9pbml0X3BhZ2UuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NldmljZXMvdGFibGUuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NldmljZXMvdXNlci5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9yb29tLmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vY2hhcnQuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuaW8ubWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQwMDBlOTIzMjRhOTllNDAwMjYwIiwidmFyIGNvbmZpZyA9IHtcbiAgICAnY291bnRfcm93X2JpZHMnOiA1LFxuICAgICdrZXlfYmlkcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdrZXlfYXNrcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdjb3VudF9yb3dfYXNrJzogNSxcbiAgICAnY291bnRfdHJhZGVfaGlzdG9yeSc6IDEwLFxuICAgICdrZXlzX21hcmtldF9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0J10sXG4gICAgJ2NvdW50X29yZGVyX29wZW4nOiA1LFxuICAgICdrZXlzX29yZGVyX29wZW4nOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ2NvdW50X29yZGVyX2hpc3RvcnknOiA1LFxuICAgICdrZXlzX29yZGVyX2hpc3RvcnknOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ3Jvb21zJzogW1xuICAgICAgICAnR1RTLU5MRycsXG4gICAgICAgICdFVVItTkxHJ1xuICAgIF1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9jb25maWcuanMiLCJ2YXIgaW5pdERhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBiaWRzID0gZGF0YVsnb3JkZXJfYm9va3MnXVsnYmlkcyddIHx8IFtdO1xuICAgIHZhciBhc2tzID0gZGF0YVsnb3JkZXJfYm9va3MnXVsnYXNrcyddIHx8IFtdO1xuICAgIHZhciBtYXJrZXRfaGlzdG9yeSA9IChkYXRhWydtYXJrZXRfaGlzdG9yeSddKSB8fCBbXTtcbiAgICB2YXIgb3Blbl9vcmRlcnMgPSAoZGF0YVsnb3Blbl9vcmRlcnMnXSkgfHwgW107XG4gICAgdmFyIG9yZGVyX2hpc3RvcnkgPSAoZGF0YVsnb3JkZXJfaGlzdG9yeSddKSB8fCBbXTtcbiAgICBcbiAgICBmdW5jdGlvbiBiaWRzVCAoKXtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYmlkc1tpXSkge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD4nICsgTWF0aC5yb3VuZChiaWRzW2ldWydzdW0nXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgTWF0aC5yb3VuZChiaWRzW2ldWyd0b3RhbCddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBiaWRzW2ldWydzaXplKG5nbCknXSArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGJpZHNbaV1bJ2JpZChidGMpJ10gKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPjwvdHI+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICQoJyN0YWJsZS1iaWRzJykuZmluZCgndGJvZHknKS5hcHBlbmQoYmlkKTtcblxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBiaWRzVCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhiaWRzLCBhc2tzLCBtYXJrZXRfaGlzdG9yeSwgb3Blbl9vcmRlcnMsIG9yZGVyX2hpc3RvcnkpO1xuICAgICAgICBjb25zb2xlLmxvZygnaW5pdERhdGEgaXMgd29ya2luZyEnKTtcbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXREYXRhO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9yb29tL3NlcnZpY2VzL2luaXRfcGFnZS5qcyIsInZhciBUYWJsZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvYmplY3QsIHVzZXJJbmZvKSB7XG4gICAgdmFyIGsgPSAxMDsgLy9jb3VudCBvZiB0aGUgcmVjb3JkcyBpbiB0aGUgdGFibGVzXG5cbiAgICAvL0luaXQgdGhlIG9iamVjdFxuICAgIHZhciB1c2VyID0gdXNlckluZm87ICAgICAgICAgICAgICAgICAgICAvL3RoZSB1c2VyIG9iamVjdCBmcm9tIHRoZSByb29tLmpzIFxuICAgIHZhciB0YWJsZUlEID0gJChlbGVtZW50KS5hdHRyKCdpZCcpOyAgICAvL2hvbGQgdGhlIElEIG9mIHRoZSB0YWJsZSBvZiB0aGlzIG9iamVjdFxuICAgIHZhciB0YWJsZSA9ICQoZWxlbWVudCkuZmluZCgndGJvZHknKTsgICAvL3RoZSBET00gZWxlbWVudCBvZiB0aGUgdGFibGVcbiAgICB2YXIga2V5cyA9IG9iamVjdFsna2V5cyddOyAgICAgICAgICAgICAgLy9UaGUgbmFtZSBvZiBjb2x1bW5zIGZyb20gdGhlYWQgaW4gdGhlIG9yZGVyXG4gICAgdmFyIHRhYmxlVmFsdWUgPSBvYmplY3RbJ2ZpcnN0J10gfHwgW107IC8vVGhlIGFycmF5IG9mIHRoZSByZWNvcmRzIG9mIHRoaXMgdGFibGVcbiAgICB2YXIgZmlyc3RQYWdlSW5UYWJsZSA9IDE7ICAgICAgICAgICAgICAgLy9UaGUgbnVtYmVyIG9mIGZpcnN0IHBhZ2Ugb2YgdGhlIHJlY29yZHMgdGhhdCBpcyBzYXZpbmdcbiAgICB2YXIgdGFibGVMZW5ndGggPSBvYmplY3RbJ2NvdW50J107ICAgICAgLy9NQVggY291bnQgb2YgdGhlIHJlY29yZHMgaW4gdGhpcyB0YWJsZSAvb24gdGhlIHNlcnZlclxuXG4gICAgdmFyIGNvdW50T2ZSb3dzID0gKHRhYmxlVmFsdWUubGVuZ3RoIDwgaykgPyB0YWJsZVZhbHVlLmxlbmd0aCA6IGs7XG4gICAgLy9NQVggY291bnQgb2YgdGhlIHJlY29yZHMgaW4gdGhlIHRhYmxlcyAgICBcbiAgICB2YXIgcGFnZU51bWJlciA9IDE7ICAgICAgICAgICAgICAgICAgICAgLy9QYWdlIG9mIHRoZSB0YWJsZSB0aGF0IGlzIHNob3dpbmcgb24gdGhlIHNpdGVcbiAgICB2YXIgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh0YWJsZUxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbiAgICAvL0NhbGMgdGhlIGNvdW50IG9mIHRoZSBwYWdlcyBcblxuICAgIC8vVXBkYXRlIHRoZSBjb3VudCBvZiB0aGUgcGFnZXNcbiAgICBmdW5jdGlvbiBzZXROZXdQYWdlQ291bnQoKSB7XG4gICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodGFibGVMZW5ndGggLyBjb3VudE9mUm93cyk7XG4gICAgfVxuICAgIDtcblxuICAgIC8vRG93bmxvYWQgdGhlIHJlY29yZHMgb2YgdGhlIHRhYmxlIHZpYSBBSkFYXG4gICAgLy8gICdmcm9tTnVtYmVyJyAtIGZyb20gd2hpY2ggbnVtYmVyIHRoZSByZWNvcmRzIGFyZSByZXF1ZXN0ZWQsXG4gICAgLy8gICdidXR0b24nICAgICAtIHdoaWNoIGZ1bmN0aW9uIGlzIGNhbGxpbmcgdGhpcyByZXF1ZXN0IFxuICAgIGZ1bmN0aW9uIGRvd25sb2FkTmV4dChmcm9tTnVtYmVyLCBidXR0b24pIHtcbiAgICAgICAgLy9mb3IgJ2ZpcnN0JywgJ2xhc3QnIG9yICd1cGRhdGUnIHdlJ3JlIGdvaW5nIHRvIHVwZGF0ZSB0aGUgYWxsIHRhYmxlXG4gICAgICAgIC8vZm9yIHRoZSByZXN0IG9ubHkgMjAgcmVjb3Jkc1xuICAgICAgICB2YXIgY291bnRGb3JMb2FkZWQgPSAoKGJ1dHRvbiA9PT0gJ2ZpcnN0JykgfHwgKGJ1dHRvbiA9PT0gJ2xhc3QnKSB8fCAoYnV0dG9uID09PSAndXBkYXRlJykpID8gNTAgOiAyICogaztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vbG9jYWxob3N0Ojc3NzcvZ2V0X25leHRfcmVjb3Jkc1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdmcm9tTnVtYmVyJzogZnJvbU51bWJlciwgLy9mcm9tIHdoaWNoIG51bWJlciB0aGUgcmVjb3JkcyBhcmUgcmVxdWVzdGVkXG4gICAgICAgICAgICAgICAgJ2NvdW50JzogY291bnRGb3JMb2FkZWQsIC8vaG93IG1hbnkgcmVjb3JkcyBhcmUgcmVxdWVzdGVkXG4gICAgICAgICAgICAgICAgJ3Jvb20nOiB1c2VyWydyb29tJ10sIC8vdGhpcyBpcyB0aGUgcm9vbSB3aGVyZSBhIHVzZXIgaXMgbG9nZ2luZyxcbiAgICAgICAgICAgICAgICAndGFibGUnOiB0YWJsZUlEICAgICAgICAgICAgLy90aGUgSUQgb2YgdGhlIHRhYmxlIHdob3NlIHJlY29yZHMgYXJlIHJlcXVlc3RlZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vaWYgQUpBWCBQT1NUIHJlcXVlc3QgIGlzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uID09PSAnbmV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUuc3BsaWNlKDAsIDIgKiBrKTsgLy9yZW1vdmUgdGhlIHVubmVjZXNzYXJ5IHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUucHVzaC5hcHBseSh0YWJsZVZhbHVlLCBqc29uWyd2YWx1ZSddKTsgLy8gYWRkIG5ldyBmcm9tIHRoZSByZXNwb25zZVxuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uID09PSAncHJldmVudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVZhbHVlLnNwbGljZSgyMCwgKDMgKiBrKSk7Ly9yZW1vdmUgdGhlIHVubmVjZXNzYXJ5IHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMiA9IGpzb25bJ3ZhbHVlJ10uc2xpY2UoKTsgLy8gYWRkIG5ldyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycjIucHVzaC5hcHBseShhcnIyLCB0YWJsZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVZhbHVlID0gYXJyMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdFBhZ2VJblRhYmxlID4gMikgLy91cGRhdGUgdGhlIGZpcnN0UGFnZUluVGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IGZpcnN0UGFnZUluVGFibGUgLSAyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24gPT09ICdmaXJzdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IDE7IC8vdXBkYXRlIHRoZSBmaXJzdFBhZ2VJblRhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVmFsdWUgPSBqc29uWyd2YWx1ZSddOyAvL3VwZGF0ZSB0aGUgdGFibGVWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYnV0dG9uID09PSAnbGFzdCcpIHx8IChidXR0b24gPT09ICd1cGRhdGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVWYWx1ZSA9IGpzb25bJ3ZhbHVlJ107ICAvL3VwZGF0ZSB0aGUgdGFibGVWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTsgIC8vdXBkYXRlIHRoZSB2aWV3IHRoZSB0YWJsZSwgc2hvdyBuZXcgcmVjb3Jkc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoeGhyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9DcmVhdGUgdGhlIHBhZ2luYXRpb24gZm9yIHRoaXMgdGFibGVcbiAgICBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAvL0FkZCB0aGUgSFRNTCBzdHJ1Y3R1cmVcbiAgICAgICAgJCh0YWJsZSkuYXBwZW5kKFwiPGRpdiBjbGFzcz0ncGFnaW5uYXRpb24nPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2ZpcnN0Jz5GaXJzdDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J3ByZXZlbnQnPlByZXZlbnQ8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ncGFnZS1udW1iZXInPlwiICsgcGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQgKyBcIjwvc3Bhbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSduZXh0Jz5OZXh0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbGFzdCc+TGFzdDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgICAvL0FkZCB0aGUgRXZlbnRMaXN0ZW5lcnMgZm9yIHRoZSBjb250cm9sIGJ1dHRvbnNcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLmZpcnN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyID49IDMpICYmICh0YWJsZUxlbmd0aCA+IDUwKSkgeyAvL2lmIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB0YWJsZVZhbHVlXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgZG93bmxvYWROZXh0KDEsICdmaXJzdCcpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgICQodGFibGUpLmZpbmQoJy5uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPCBwYWdlQ291bnQgLSAxKSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlcisrO1xuICAgICAgICAgICAgICAgIGlmICgocGFnZU51bWJlciA+IDMpICYmICh0YWJsZUxlbmd0aCA+IDUwKSkgeyAvL2lmIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB0YWJsZVZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlmICgocGFnZU51bWJlciAtIDIpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IGZpcnN0UGFnZUluVGFibGUgKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG93bmxvYWROZXh0KGsgKiAocGFnZU51bWJlciArIDEpICsgMSwgJ25leHQnKTsvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPT09IHBhZ2VDb3VudCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcisrO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLnByZXZlbnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFnZU51bWJlciA+IDEpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyLS07XG4gICAgICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyID4gMikgJiYgKHBhZ2VOdW1iZXIgKyAxIDwgcGFnZUNvdW50KSAmJiAodGFibGVMZW5ndGggPiA1MCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChwYWdlTnVtYmVyIC0gMSkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChwYWdlTnVtYmVyIC0gMykgKyAxLCAncHJldmVudCcpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICAkKHRhYmxlKS5maW5kKCcubGFzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgocGFnZU51bWJlciArIDIgPj0gcGFnZUNvdW50KSAmJiAodGFibGVMZW5ndGggPiA1MCkpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50O1xuICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSBwYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgLy9VcGRhdGUgdGhlIGZpcnN0UGFnZUluVGFibGVcbiAgICAgICAgICAgICAgICBpZiAoKHBhZ2VOdW1iZXIgJSAyKSA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RQYWdlSW5UYWJsZSA9IHBhZ2VDb3VudCAtIDM7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmaXJzdFBhZ2VJblRhYmxlID0gcGFnZU51bWJlciAtIDI7XG5cbiAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChmaXJzdFBhZ2VJblRhYmxlIC0gMSkgKyAxLCAnbGFzdCcpOyAvL2xvYWQgdGhlIHJlY29yZHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIDtcblxuICAgIC8vRGVsZXRlIHRoZSBwYWdpbmF0aW9uXG4gICAgZnVuY3Rpb24gZGVsZXRlUGFnaW5hdGlvbigpIHtcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLnBhZ2lubmF0aW9uJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIDtcblxuICAgIC8vUmVjb3VudCB0aGUgbnVtYmVycyBvZiB0aGUgcGFnaW5hdGlvblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhZ2VWaWV3KCkge1xuICAgICAgICAvL1JlcGxhY2UgdGhlIG51bWJlcnNcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLnBhZ2UtbnVtYmVyJykudGV4dChwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCk7XG4gICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgfVxuICAgIDtcblxuICAgIC8vdXBkYXRlIHRoZSB2YWx1ZXMgaW4gdGhlIHRhYmxlIHdoaWNoIGFyZSBzaG93biBcbiAgICBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgdmFyIHJvdyA9ICcnOyAvL3RoZSBuZXcgcm93IDx0cj4gb2YgdGhlIHRhYmxlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykgeyAvL2ZvciBhbGwgcm93cyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIC8vR2V0IHRoZSBjdXJyZW50IHJvd1xuICAgICAgICAgICAgdmFyIHJvd09mVGFibGUgPSAkKHRhYmxlKS5maW5kKCd0cjplcSggJyArIGkgKyAnKScpO1xuICAgICAgICAgICAgcm93ID0gJzx0cj4nO1xuICAgICAgICAgICAgLy9pZiBuZWNlc3NhcnkgcmVjb3JkIGV4aXN0IGluIHRoZSB0YWJsZVxuICAgICAgICAgICAgaWYgKHRhYmxlVmFsdWVbaSArIGsgKiAocGFnZU51bWJlciAtIGZpcnN0UGFnZUluVGFibGUpXSkge1xuICAgICAgICAgICAgICAgIC8vdGhlIGxvb3AgYnkga2V5c1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWRkIGNvbHVtbiB3aXRoIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+JyArIHRhYmxlVmFsdWVbaSArIGsgKiAocGFnZU51bWJlciAtIGZpcnN0UGFnZUluVGFibGUpXVtrZXlzW2tleV1dICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgY3VycmVudCByb3cgaW4gdGhlIHRhYmxlIGlzIG5vdCBleGlzdGluZ1xuICAgICAgICAgICAgICAgIGlmIChyb3dPZlRhYmxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL2J1dCB3ZSBuZWVkIG1vcmUgdGhlbiByb3dzIGFyZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPiAkKHRhYmxlKS5maW5kKCd0cicpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWRkIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YWJsZSkuYXBwZW5kKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBqdXN0IHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPj0gJCh0YWJsZSkuZmluZCgndHInKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgdGFibGUgaXMgdG9vIHNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHJvd09mVGFibGUpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocm93T2ZUYWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgICAgICAkKHJvd09mVGFibGUpLnJlcGxhY2VXaXRoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG4gICAgO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy9jcmVhdGUgYSBuZXcgdGFibGUsIGFkZCB0aGUgcmVjb3Jkc1xuICAgICAgICBjcmVhdGVUYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJvdyA9ICcnOyAgICAgICAgIC8vIHRoZSByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICB2YXIgcm93VGVtcGxhdGUgPSAnJzsgLy8gdGhlIGJvZHkgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgPSAnPHRyPic7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+JyArIHRhYmxlVmFsdWVbaV1ba2V5c1trZXldXSArICc8L3RkPic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgIHJvd1RlbXBsYXRlICs9IHJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vQWRkIEhUTUwgdGVtcGxhdGUgdG8gcGFnZVxuICAgICAgICAgICAgJCh0YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQocm93VGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPCB0YWJsZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL1VwZGF0ZSB0aGUgdmFsdWVzIG9mIHRhYmxlVmFsdWUgYW5kIGNoYW5nZSB0aGUgcmVjb3JkcyB3aGljaCBhcmUgc2hvd25cbiAgICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgICAgIC8vaWYgdXBkYXRlZCBkYXRhIGhhdmUgY2FtZSB3aGVuIHdlIHNhdmUgdGhlIGZpcnN0IDUgcGFnZXNcbiAgICAgICAgICAgIGlmIChmaXJzdFBhZ2VJblRhYmxlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gb2JqZWN0WydmaXJzdCddO1xuICAgICAgICAgICAgICAgIHRhYmxlTGVuZ3RoID0gb2JqZWN0Wydjb3VudCddO1xuICAgICAgICAgICAgICAgIHNldE5ld1BhZ2VDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgdGFibGVWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50T2ZSb3dzIDw9IHRhYmxlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRhYmxlKS5maW5kKCcucGFnaW5uYXRpb24nKS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50T2ZSb3dzID0gaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb3dubG9hZE5leHQoayAqIChmaXJzdFBhZ2VJblRhYmxlIC0gMSkgKyAxLCAndXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgc2V0TmV3UGFnZUNvdW50KCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NldmljZXMvdGFibGUuanMiLCJ2YXIgVXNlciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHVzZXJfaWQgPSBkYXRhWyd1c2VyX2lkJ10gfHwgJyc7XG4gICAgYWN0aXZlUm9vbSA9IGRhdGFbJ3Jvb20nXTtcbiAgICB2YXIgRVVSID0gZGF0YVsnRVVSJ10gfHwgMDtcbiAgICB2YXIgTkdMID0gKGRhdGFbJ05HTCddKSB8fCAwO1xuXG4gICAgcmV0dXJuICB7XG4gICAgICAgIHVzZXJJZDogdXNlcl9pZCxcbiAgICAgICAgcm9vbTogYWN0aXZlUm9vbSxcbiAgICAgICAgZXVyQXZhbGFpYmxlOiBFVVIsXG4gICAgICAgIG5nbEF2YWxhaWJsZTogTkdMXG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zZXZpY2VzL3VzZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIENsaWVudFNvY2tldHMob2JqZWN0T2ZUYWJsZXMsIHVzZXIpIHtcbiAgICAvL0ZldGNoIHRoZSBsaWJzXG4gICAgdmFyIGlvID0gcmVxdWlyZSgnLi9zb2NrZXQuaW8ubWluJyk7XG5cbiAgICAvL0dldCB0aGUgbmFtZSBvZiB0aGUgcm9vbVxuICAgIHZhciByb29tID0gdXNlci5yb29tO1xuXG4gICAgdmFyIGFzayA9IG9iamVjdE9mVGFibGVzWydhc2tzJ10sXG4gICAgICAgICAgICBiaWRzID0gb2JqZWN0T2ZUYWJsZXNbJ2JpZHMnXSxcbiAgICAgICAgICAgIHRyYWRlID0gb2JqZWN0T2ZUYWJsZXNbJ21hcmtldEhpc3RvcnknXSxcbiAgICAgICAgICAgIG9yZGVyT3BlbiA9IG9iamVjdE9mVGFibGVzWydvcGVuT3JkZXJzJ10sXG4gICAgICAgICAgICBvcmRlckhpc3RvcnkgPSBvYmplY3RPZlRhYmxlc1snb3JkZXJIaXN0b3J5J107XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5XZWJTb2NrZXQpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJTb2NrZXQuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgY29ubmVjdGlvblxuICAgICAgICAgICAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcpO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhcnQgPSByZXF1aXJlKCcuL2NoYXJ0Jyk7XG5cbiAgICAgICAgICAgICAgICAvL0Nvbm5lY3Rpb24gdG8gdGhlIHJvb21cbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgncm9vbScsIHJvb20pO1xuXG5cbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZGF0YV90b19jaGFydCcsICcnKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ2RhdGFfdG9fY2hhcnQnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmxvYWREYXRhKG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL0xpc3RlbiB0aGUgc29ja2V0cyB0byBjaGFuZ2UgdGhlIHRhYmxlc1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbignYXNrJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBhc2sudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignYmlkcycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgYmlkcy51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCd0cmFkZV9oaXN0b3J5JywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICB0cmFkZS51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdvcmRlcl9vcGVuJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlck9wZW4udXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignb3JkZXJfaGlzdG9yeScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJIaXN0b3J5LnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgLy9EZXZlbG9wbWVudFxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9O1xufVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudFNvY2tldHM7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIiwidmFyIENvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xudmFyIHJvb207XG52YXIgcm9vbXMgPSBDb25maWdbJ3Jvb21zJ107XG52YXIgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cbi8vU2VsZWN0IHJvb20gKGlmIFVSTCBjb250YWlucyB0aGUgbmFtZSBvZiB0aGUgcm9vbSlcbnJvb21zLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBpZiAocGF0aG5hbWUuaW5kZXhPZihlbGVtZW50KSA+PSAwKSB7XG4gICAgICAgIHJvb20gPSBlbGVtZW50O1xuICAgIH1cbiAgICA7XG59KTtcblxudmFyIENsaWVudFNvY2tldHMgPSByZXF1aXJlKCcuLi9zb2NrZXQuaW8vc29ja2V0Jyk7XG52YXIgc2VydmljZTtcblxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9zZXZpY2VzL3VzZXInKTtcbi8vVGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSB1c2VyIGRhdGFcbnZhciB1c2VyO1xuXG52YXIgVGFibGUgPSByZXF1aXJlKCcuLi9zZXZpY2VzL3RhYmxlJyk7XG5cbi8vRWFjaCBvbmUgb2YgdGFibGVzIGNvbnRhaW4gdGhlIG9iamVjdCB3aXRoIGRhdGEgYW5kIGNvbnRyb2wgYnV0dG9uc1xudmFyIGJpZHNUYWJsZSwgYXNrc1RhYmxlLCBtYXJrZXRIaXN0b3J5VGFibGUsIG9wZW5PcmRlcnNUYWJsZSwgb3JkZXJIaXN0b3J5VGFibGU7XG5cbnZhciBpbml0RGF0YSA9IHJlcXVpcmUoJy4vc2VydmljZXMvaW5pdF9wYWdlJyk7XG52YXIgaW5pdDtcblxuLy93aGVuIG91ciBwYWdlIGFyZSBsb2FkZWQsIHdlIG5lZWQgdG8gZ2V0IHRoZSBpbml0IGRhdGFcbiQuYWpheCh7XG4gICAgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6Nzc3Ny9nZXRfaW5pdF9kYXRhXCIsXG4gICAgZGF0YToge1xuICAgICAgICAncm9vbSc6IHJvb20gLy9zZW5kIHRoZSBuYW1lIG9mIHRoZSByb29tIHdoZXJlIHRoZSB1c2VyIGlzXG4gICAgfSxcbiAgICB0eXBlOiBcInBvc3RcIixcbiAgICBkYXRhVHlwZTogXCJqc29uXCJcbn0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAvL2lmIHdlIGdvdCB0aGUgcmVzcG9uc2UgXG4gICAgICAgICAgICAvL2NyZWF0ZSB0aGUgdXNlciBvYmplY3RcbiAgICAgICAgICAgIHVzZXIgPSBuZXcgVXNlcihqc29uWyd1c2VyJ10pOyAgLy9zdG9yZSB0aGUgdXNlciBkYXRhXG5cbiAgICAgICAgICAgIC8vY2hhbmdlIHRoZSBhdmFpbGFibGUgY3VycmVuY3lcbiAgICAgICAgICAgICQoJyNhdmFpbGFibGVGaXJzdCcpLmh0bWwoanNvblsnZmlyc3RDdXJyZW5jeSddKTtcbiAgICAgICAgICAgICQoJyNhdmFpbGFibGVTZWNvbmQnKS5odG1sKGpzb25bJ3NlY29uZEN1cnJlbmN5J10pO1xuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgb2JqZWN0cyBvZiB0aGUgdGFibGVzIGFuZCBzaG93IHRoZWlyXG4gICAgICAgICAgICBiaWRzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1iaWRzJywganNvblsndGFibGVzJ11bJ3RhYmxlLWJpZHMnXSwgdXNlcik7XG4gICAgICAgICAgICBiaWRzVGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgYXNrc1RhYmxlID0gbmV3IFRhYmxlKCcjdGFibGUtYXNrJywganNvblsndGFibGVzJ11bJ3RhYmxlLWFzayddLCB1c2VyKTtcbiAgICAgICAgICAgIGFza3NUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBtYXJrZXRIaXN0b3J5VGFibGUgPSBuZXcgVGFibGUoJyNtYXJrZXQtaGlzdG9yeScsIGpzb25bJ3RhYmxlcyddWydtYXJrZXQtaGlzdG9yeSddLCB1c2VyKTtcbiAgICAgICAgICAgIG1hcmtldEhpc3RvcnlUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBvcGVuT3JkZXJzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1vcGVuJywganNvblsndGFibGVzJ11bJ3RhYmxlLW9wZW4nXSwgdXNlcik7XG4gICAgICAgICAgICBvcGVuT3JkZXJzVGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5VGFibGUgPSBuZXcgVGFibGUoJyNvcmRlci1oaXN0b3J5JywganNvblsndGFibGVzJ11bJ29yZGVyLWhpc3RvcnknXSwgdXNlcik7XG4gICAgICAgICAgICBvcmRlckhpc3RvcnlUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IENsaWVudFNvY2tldHMoe1xuICAgICAgICAgICAgICAgICdiaWRzJzogYmlkc1RhYmxlLFxuICAgICAgICAgICAgICAgICdhc2tzJzogYXNrc1RhYmxlLFxuICAgICAgICAgICAgICAgICdtYXJrZXRIaXN0b3J5JzogbWFya2V0SGlzdG9yeVRhYmxlLFxuICAgICAgICAgICAgICAgICdvcGVuT3JkZXJzJzogb3Blbk9yZGVyc1RhYmxlLFxuICAgICAgICAgICAgICAgICdvcmRlckhpc3RvcnknOiBvcmRlckhpc3RvcnlUYWJsZVxuICAgICAgICAgICAgfSwgdXNlcik7XG4gICAgICAgICAgICBzZXJ2aWNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBlcnJvclRocm93bik7XG4gICAgICAgIH0pXG4gICAgICAgIC5hbHdheXMoZnVuY3Rpb24gKHhociwgc3RhdHVzKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVGhlIHJlcXVlc3QgaXMgY29tcGxldGUhXCIpO1xuICAgICAgICB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvcm9vbS9yb29tLmpzIiwiZnVuY3Rpb24gQ2hhcnRNYXJrZXQoKSB7XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICBcbiAgICBmdW5jdGlvbiBjcmVhdGVDaGFydCAoKSB7XG4gICAgICAgICAgICB2YXIgY2RhdGEgPSBkYXRhO1xuICAgICAgICAgICAgYW55Y2hhcnQub25Eb2N1bWVudFJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgZGF0YSB1c2VkIGluIHRoaXMgc2FtcGxlIGNhbiBiZSBvYnRhaW5lZCBmcm9tIHRoZSBDRE5cbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vY2RuLmFueWNoYXJ0LmNvbS9jc3YtZGF0YS9jc2NvLWRhaWx5LmpzXG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgZGF0YSB0YWJsZSBvbiBsb2FkZWQgZGF0YVxuICAgICAgICAgICAgICAgIHZhciBkYXRhVGFibGUgPSBhbnljaGFydC5kYXRhLnRhYmxlKCk7XG4gICAgICAgICAgICAgICAgZGF0YVRhYmxlLmFkZERhdGEoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBhbnljaGFydC5ncmFwaGljcy5jcmVhdGUoJ2NvbnRhaW5lcl9jaGFydCcpO1xuICAgICAgICAgICAgICAgIC8vIG1hcCBsb2FkZWQgZGF0YSBmb3IgdGhlIG9obGMgc2VyaWVzXG4gICAgICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSBkYXRhVGFibGUubWFwQXMoe1xuICAgICAgICAgICAgICAgICAgICAnb3Blbic6IDEsXG4gICAgICAgICAgICAgICAgICAgICdoaWdoJzogMixcbiAgICAgICAgICAgICAgICAgICAgJ2xvdyc6IDMsXG4gICAgICAgICAgICAgICAgICAgICdjbG9zZSc6IDQsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHtjb2x1bW46IDQsIHR5cGU6ICdjbG9zZSd9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBtYXAgbG9hZGVkIGRhdGEgZm9yIHRoZSBzY3JvbGxlclxuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxlck1hcHBpbmcgPSBkYXRhVGFibGUubWFwQXMoKTtcbiAgICAgICAgICAgICAgICBzY3JvbGxlck1hcHBpbmcuYWRkRmllbGQoJ3ZhbHVlJywgMTApO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHN0b2NrIGNoYXJ0XG4gICAgICAgICAgICAgICAgY2hhcnQgPSBhbnljaGFydC5zdG9jaygpO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZpcnN0IHBsb3Qgb24gdGhlIGNoYXJ0XG4gICAgICAgICAgICAgICAgdmFyIHBsb3QgPSBjaGFydC5wbG90KCk7XG4gICAgICAgICAgICAgICAgcGxvdC5ncmlkKCkuZW5hYmxlZCh0cnVlKTtcbiAgICAgICAgICAgICAgICBwbG90LmdyaWQoMSkuZW5hYmxlZCh0cnVlKS5sYXlvdXQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgICAgICAgICAgcGxvdC5taW5vckdyaWQoKS5lbmFibGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIHBsb3QubWlub3JHcmlkKDEpLmVuYWJsZWQodHJ1ZSkubGF5b3V0KCd2ZXJ0aWNhbCcpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlcmllcyA9IHBsb3QuY2FuZGxlc3RpY2sobWFwcGluZykubmFtZSgnQ1NDTycpO1xuICAgICAgICAgICAgICAgIHNlcmllcy5sZWdlbmRJdGVtKCkuaWNvblR5cGUoJ3Jpc2luZ2ZhbGxpbmcnKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBCQmFuZHMgaW5kaWNhdG9yIHdpdGggcGVyaW9kIDIwXG4gICAgICAgICAgICAgICAgdmFyIGJCYW5kc0luZGljYXRvciA9IHBsb3QuYmJhbmRzKG1hcHBpbmcpO1xuICAgICAgICAgICAgICAgIGJCYW5kc0luZGljYXRvci5kZXZpYXRpb24oMi41KTtcblxuICAgICAgICAgICAgICAgIHZhciBpbmRpY2F0b3JQbG90ID0gY2hhcnQucGxvdCgxKTtcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JQbG90LmhlaWdodCgnMzAlJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgQkJhbmRzIFdpZHRoIGluZGljYXRvciB3aXRoIHBlcmlvZCAyMFxuICAgICAgICAgICAgICAgIHZhciBiQmFuZHNXaWR0aEluZGljYXRvciA9IGluZGljYXRvclBsb3QuYmJhbmRzV2lkdGgobWFwcGluZykuc2VyaWVzKCdzcGxpbmVBcmVhJyk7XG4gICAgICAgICAgICAgICAgYkJhbmRzV2lkdGhJbmRpY2F0b3IuZGV2aWF0aW9uKDIuNSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5kaWNhdG9yU2VyaWVzID0gYkJhbmRzV2lkdGhJbmRpY2F0b3Iuc2VyaWVzKCk7XG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yU2VyaWVzLnN0cm9rZSgnMS41ICNGMTgxMjYnKTtcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JTZXJpZXMuZmlsbChhbnljaGFydC5jb2xvci5saWdodGVuKGluZGljYXRvclNlcmllcy5zdHJva2UoKS5jb2xvciwgMC41KSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgc2Nyb2xsZXIgc2VyaWVzIHdpdGggbWFwcGVkIGRhdGFcbiAgICAgICAgICAgICAgICBjaGFydC5zY3JvbGxlcigpLmNhbmRsZXN0aWNrKG1hcHBpbmcpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNvbnRhaW5lciBpZCBmb3IgdGhlIGNoYXJ0XG4gICAgICAgICAgICAgICAgY2hhcnQuY29udGFpbmVyKHN0YWdlKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBjaGFydCBzZWxlY3RlZCBkYXRlL3RpbWUgcmFuZ2VcbiAgICAgICAgICAgICAgICBjaGFydC5zZWxlY3RSYW5nZSgnMTk5MC0wNC0xOCcsICcxOTkwLTA1LTE3Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBpbml0aWF0ZSBjaGFydCBkcmF3aW5nXG4gICAgICAgICAgICAgICAgY2hhcnQuZHJhdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGxvYWREYXRhOiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgICAgICBkYXRhID0gb2JqZWN0WydkYXRhJ107XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlIGNoYXJ0Jyk7XG4gICAgICAgICAgICBjcmVhdGVDaGFydCAoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG47XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRNYXJrZXQoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvc29ja2V0LmlvL2NoYXJ0LmpzIiwiIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sZSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5pbz1lKCk6dC5pbz1lKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7ZnVuY3Rpb24gZShuKXtpZihyW25dKXJldHVybiByW25dLmV4cG9ydHM7dmFyIG89cltuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIHRbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsZSksby5sb2FkZWQ9ITAsby5leHBvcnRzfXZhciByPXt9O3JldHVybiBlLm09dCxlLmM9cixlLnA9XCJcIixlKDApfShbZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXtcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6aSh0KSkmJihlPXQsdD12b2lkIDApLGU9ZXx8e307dmFyIHIsbj1zKHQpLGE9bi5zb3VyY2UscD1uLmlkLGY9bi5wYXRoLGw9aFtwXSYmZiBpbiBoW3BdLm5zcHMsZD1lLmZvcmNlTmV3fHxlW1wiZm9yY2UgbmV3IGNvbm5lY3Rpb25cIl18fCExPT09ZS5tdWx0aXBsZXh8fGw7cmV0dXJuIGQ/KHUoXCJpZ25vcmluZyBzb2NrZXQgY2FjaGUgZm9yICVzXCIsYSkscj1jKGEsZSkpOihoW3BdfHwodShcIm5ldyBpbyBpbnN0YW5jZSBmb3IgJXNcIixhKSxoW3BdPWMoYSxlKSkscj1oW3BdKSxuLnF1ZXJ5JiYhZS5xdWVyeT9lLnF1ZXJ5PW4ucXVlcnk6ZSYmXCJvYmplY3RcIj09PWkoZS5xdWVyeSkmJihlLnF1ZXJ5PW8oZS5xdWVyeSkpLHIuc29ja2V0KG4ucGF0aCxlKX1mdW5jdGlvbiBvKHQpe3ZhciBlPVtdO2Zvcih2YXIgciBpbiB0KXQuaGFzT3duUHJvcGVydHkocikmJmUucHVzaChlbmNvZGVVUklDb21wb25lbnQocikrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHRbcl0pKTtyZXR1cm4gZS5qb2luKFwiJlwiKX12YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxzPXIoMSksYT1yKDcpLGM9cigxNyksdT1yKDMpKFwic29ja2V0LmlvLWNsaWVudFwiKTt0LmV4cG9ydHM9ZT1uO3ZhciBoPWUubWFuYWdlcnM9e307ZS5wcm90b2NvbD1hLnByb3RvY29sLGUuY29ubmVjdD1uLGUuTWFuYWdlcj1yKDE3KSxlLlNvY2tldD1yKDQ0KX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQscil7dmFyIG49dDtyPXJ8fGUubG9jYXRpb24sbnVsbD09dCYmKHQ9ci5wcm90b2NvbCtcIi8vXCIrci5ob3N0KSxcInN0cmluZ1wiPT10eXBlb2YgdCYmKFwiL1wiPT09dC5jaGFyQXQoMCkmJih0PVwiL1wiPT09dC5jaGFyQXQoMSk/ci5wcm90b2NvbCt0OnIuaG9zdCt0KSwvXihodHRwcz98d3NzPyk6XFwvXFwvLy50ZXN0KHQpfHwoaShcInByb3RvY29sLWxlc3MgdXJsICVzXCIsdCksdD1cInVuZGVmaW5lZFwiIT10eXBlb2Ygcj9yLnByb3RvY29sK1wiLy9cIit0OlwiaHR0cHM6Ly9cIit0KSxpKFwicGFyc2UgJXNcIix0KSxuPW8odCkpLG4ucG9ydHx8KC9eKGh0dHB8d3MpJC8udGVzdChuLnByb3RvY29sKT9uLnBvcnQ9XCI4MFwiOi9eKGh0dHB8d3MpcyQvLnRlc3Qobi5wcm90b2NvbCkmJihuLnBvcnQ9XCI0NDNcIikpLG4ucGF0aD1uLnBhdGh8fFwiL1wiO3ZhciBzPW4uaG9zdC5pbmRleE9mKFwiOlwiKSE9PS0xLGE9cz9cIltcIituLmhvc3QrXCJdXCI6bi5ob3N0O3JldHVybiBuLmlkPW4ucHJvdG9jb2wrXCI6Ly9cIithK1wiOlwiK24ucG9ydCxuLmhyZWY9bi5wcm90b2NvbCtcIjovL1wiK2ErKHImJnIucG9ydD09PW4ucG9ydD9cIlwiOlwiOlwiK24ucG9ydCksbn12YXIgbz1yKDIpLGk9cigzKShcInNvY2tldC5pby1jbGllbnQ6dXJsXCIpO3QuZXhwb3J0cz1ufSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3ZhciByPS9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKGh0dHB8aHR0cHN8d3N8d3NzKTpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KCg/OlthLWYwLTldezAsNH06KXsyLDd9W2EtZjAtOV17MCw0fXxbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLG49W1wic291cmNlXCIsXCJwcm90b2NvbFwiLFwiYXV0aG9yaXR5XCIsXCJ1c2VySW5mb1wiLFwidXNlclwiLFwicGFzc3dvcmRcIixcImhvc3RcIixcInBvcnRcIixcInJlbGF0aXZlXCIsXCJwYXRoXCIsXCJkaXJlY3RvcnlcIixcImZpbGVcIixcInF1ZXJ5XCIsXCJhbmNob3JcIl07dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3ZhciBlPXQsbz10LmluZGV4T2YoXCJbXCIpLGk9dC5pbmRleE9mKFwiXVwiKTtvIT0tMSYmaSE9LTEmJih0PXQuc3Vic3RyaW5nKDAsbykrdC5zdWJzdHJpbmcobyxpKS5yZXBsYWNlKC86L2csXCI7XCIpK3Quc3Vic3RyaW5nKGksdC5sZW5ndGgpKTtmb3IodmFyIHM9ci5leGVjKHR8fFwiXCIpLGE9e30sYz0xNDtjLS07KWFbbltjXV09c1tjXXx8XCJcIjtyZXR1cm4gbyE9LTEmJmkhPS0xJiYoYS5zb3VyY2U9ZSxhLmhvc3Q9YS5ob3N0LnN1YnN0cmluZygxLGEuaG9zdC5sZW5ndGgtMSkucmVwbGFjZSgvOy9nLFwiOlwiKSxhLmF1dGhvcml0eT1hLmF1dGhvcml0eS5yZXBsYWNlKFwiW1wiLFwiXCIpLnJlcGxhY2UoXCJdXCIsXCJcIikucmVwbGFjZSgvOy9nLFwiOlwiKSxhLmlwdjZ1cmk9ITApLGF9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKG4pe2Z1bmN0aW9uIG8oKXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQmJlwiV2Via2l0QXBwZWFyYW5jZVwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlfHx3aW5kb3cuY29uc29sZSYmKGNvbnNvbGUuZmlyZWJ1Z3x8Y29uc29sZS5leGNlcHRpb24mJmNvbnNvbGUudGFibGUpfHxuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSYmcGFyc2VJbnQoUmVnRXhwLiQxLDEwKT49MzF9ZnVuY3Rpb24gaSgpe3ZhciB0PWFyZ3VtZW50cyxyPXRoaXMudXNlQ29sb3JzO2lmKHRbMF09KHI/XCIlY1wiOlwiXCIpK3RoaXMubmFtZXNwYWNlKyhyP1wiICVjXCI6XCIgXCIpK3RbMF0rKHI/XCIlYyBcIjpcIiBcIikrXCIrXCIrZS5odW1hbml6ZSh0aGlzLmRpZmYpLCFyKXJldHVybiB0O3ZhciBuPVwiY29sb3I6IFwiK3RoaXMuY29sb3I7dD1bdFswXSxuLFwiY29sb3I6IGluaGVyaXRcIl0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHQsMSkpO3ZhciBvPTAsaT0wO3JldHVybiB0WzBdLnJlcGxhY2UoLyVbYS16JV0vZyxmdW5jdGlvbih0KXtcIiUlXCIhPT10JiYobysrLFwiJWNcIj09PXQmJihpPW8pKX0pLHQuc3BsaWNlKGksMCxuKSx0fWZ1bmN0aW9uIHMoKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgY29uc29sZSYmY29uc29sZS5sb2cmJkZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLGNvbnNvbGUsYXJndW1lbnRzKX1mdW5jdGlvbiBhKHQpe3RyeXtudWxsPT10P2Uuc3RvcmFnZS5yZW1vdmVJdGVtKFwiZGVidWdcIik6ZS5zdG9yYWdlLmRlYnVnPXR9Y2F0Y2godCl7fX1mdW5jdGlvbiBjKCl7dHJ5e3JldHVybiBlLnN0b3JhZ2UuZGVidWd9Y2F0Y2godCl7fWlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBuJiZcImVudlwiaW4gbilyZXR1cm4gbi5lbnYuREVCVUd9ZnVuY3Rpb24gdSgpe3RyeXtyZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZX1jYXRjaCh0KXt9fWU9dC5leHBvcnRzPXIoNSksZS5sb2c9cyxlLmZvcm1hdEFyZ3M9aSxlLnNhdmU9YSxlLmxvYWQ9YyxlLnVzZUNvbG9ycz1vLGUuc3RvcmFnZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lLnN0b3JhZ2U/Y2hyb21lLnN0b3JhZ2UubG9jYWw6dSgpLGUuY29sb3JzPVtcImxpZ2h0c2VhZ3JlZW5cIixcImZvcmVzdGdyZWVuXCIsXCJnb2xkZW5yb2RcIixcImRvZGdlcmJsdWVcIixcImRhcmtvcmNoaWRcIixcImNyaW1zb25cIl0sZS5mb3JtYXR0ZXJzLmo9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiBKU09OLnN0cmluZ2lmeSh0KX1jYXRjaCh0KXtyZXR1cm5cIltVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiBcIit0Lm1lc3NhZ2V9fSxlLmVuYWJsZShjKCkpfSkuY2FsbChlLHIoNCkpfSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIoKXt0aHJvdyBuZXcgRXJyb3IoXCJzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkXCIpfWZ1bmN0aW9uIG4oKXt0aHJvdyBuZXcgRXJyb3IoXCJjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWRcIil9ZnVuY3Rpb24gbyh0KXtpZihoPT09c2V0VGltZW91dClyZXR1cm4gc2V0VGltZW91dCh0LDApO2lmKChoPT09cnx8IWgpJiZzZXRUaW1lb3V0KXJldHVybiBoPXNldFRpbWVvdXQsc2V0VGltZW91dCh0LDApO3RyeXtyZXR1cm4gaCh0LDApfWNhdGNoKGUpe3RyeXtyZXR1cm4gaC5jYWxsKG51bGwsdCwwKX1jYXRjaChlKXtyZXR1cm4gaC5jYWxsKHRoaXMsdCwwKX19fWZ1bmN0aW9uIGkodCl7aWYocD09PWNsZWFyVGltZW91dClyZXR1cm4gY2xlYXJUaW1lb3V0KHQpO2lmKChwPT09bnx8IXApJiZjbGVhclRpbWVvdXQpcmV0dXJuIHA9Y2xlYXJUaW1lb3V0LGNsZWFyVGltZW91dCh0KTt0cnl7cmV0dXJuIHAodCl9Y2F0Y2goZSl7dHJ5e3JldHVybiBwLmNhbGwobnVsbCx0KX1jYXRjaChlKXtyZXR1cm4gcC5jYWxsKHRoaXMsdCl9fX1mdW5jdGlvbiBzKCl7eSYmbCYmKHk9ITEsbC5sZW5ndGg/ZD1sLmNvbmNhdChkKTpnPS0xLGQubGVuZ3RoJiZhKCkpfWZ1bmN0aW9uIGEoKXtpZigheSl7dmFyIHQ9byhzKTt5PSEwO2Zvcih2YXIgZT1kLmxlbmd0aDtlOyl7Zm9yKGw9ZCxkPVtdOysrZzxlOylsJiZsW2ddLnJ1bigpO2c9LTEsZT1kLmxlbmd0aH1sPW51bGwseT0hMSxpKHQpfX1mdW5jdGlvbiBjKHQsZSl7dGhpcy5mdW49dCx0aGlzLmFycmF5PWV9ZnVuY3Rpb24gdSgpe312YXIgaCxwLGY9dC5leHBvcnRzPXt9OyFmdW5jdGlvbigpe3RyeXtoPVwiZnVuY3Rpb25cIj09dHlwZW9mIHNldFRpbWVvdXQ/c2V0VGltZW91dDpyfWNhdGNoKHQpe2g9cn10cnl7cD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBjbGVhclRpbWVvdXQ/Y2xlYXJUaW1lb3V0Om59Y2F0Y2godCl7cD1ufX0oKTt2YXIgbCxkPVtdLHk9ITEsZz0tMTtmLm5leHRUaWNrPWZ1bmN0aW9uKHQpe3ZhciBlPW5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoLTEpO2lmKGFyZ3VtZW50cy5sZW5ndGg+MSlmb3IodmFyIHI9MTtyPGFyZ3VtZW50cy5sZW5ndGg7cisrKWVbci0xXT1hcmd1bWVudHNbcl07ZC5wdXNoKG5ldyBjKHQsZSkpLDEhPT1kLmxlbmd0aHx8eXx8byhhKX0sYy5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKCl7dGhpcy5mdW4uYXBwbHkobnVsbCx0aGlzLmFycmF5KX0sZi50aXRsZT1cImJyb3dzZXJcIixmLmJyb3dzZXI9ITAsZi5lbnY9e30sZi5hcmd2PVtdLGYudmVyc2lvbj1cIlwiLGYudmVyc2lvbnM9e30sZi5vbj11LGYuYWRkTGlzdGVuZXI9dSxmLm9uY2U9dSxmLm9mZj11LGYucmVtb3ZlTGlzdGVuZXI9dSxmLnJlbW92ZUFsbExpc3RlbmVycz11LGYuZW1pdD11LGYuYmluZGluZz1mdW5jdGlvbih0KXt0aHJvdyBuZXcgRXJyb3IoXCJwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZFwiKX0sZi5jd2Q9ZnVuY3Rpb24oKXtyZXR1cm5cIi9cIn0sZi5jaGRpcj1mdW5jdGlvbih0KXt0aHJvdyBuZXcgRXJyb3IoXCJwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWRcIil9LGYudW1hc2s9ZnVuY3Rpb24oKXtyZXR1cm4gMH19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7cmV0dXJuIGUuY29sb3JzW2grKyVlLmNvbG9ycy5sZW5ndGhdfWZ1bmN0aW9uIG8odCl7ZnVuY3Rpb24gcigpe31mdW5jdGlvbiBvKCl7dmFyIHQ9byxyPStuZXcgRGF0ZSxpPXItKHV8fHIpO3QuZGlmZj1pLHQucHJldj11LHQuY3Vycj1yLHU9cixudWxsPT10LnVzZUNvbG9ycyYmKHQudXNlQ29sb3JzPWUudXNlQ29sb3JzKCkpLG51bGw9PXQuY29sb3ImJnQudXNlQ29sb3JzJiYodC5jb2xvcj1uKCkpO2Zvcih2YXIgcz1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCksYT0wO2E8cy5sZW5ndGg7YSsrKXNbYV09YXJndW1lbnRzW2FdO3NbMF09ZS5jb2VyY2Uoc1swXSksXCJzdHJpbmdcIiE9dHlwZW9mIHNbMF0mJihzPVtcIiVvXCJdLmNvbmNhdChzKSk7dmFyIGM9MDtzWzBdPXNbMF0ucmVwbGFjZSgvJShbYS16JV0pL2csZnVuY3Rpb24ocixuKXtpZihcIiUlXCI9PT1yKXJldHVybiByO2MrKzt2YXIgbz1lLmZvcm1hdHRlcnNbbl07aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbyl7dmFyIGk9c1tjXTtyPW8uY2FsbCh0LGkpLHMuc3BsaWNlKGMsMSksYy0tfXJldHVybiByfSkscz1lLmZvcm1hdEFyZ3MuYXBwbHkodCxzKTt2YXIgaD1vLmxvZ3x8ZS5sb2d8fGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7aC5hcHBseSh0LHMpfXIuZW5hYmxlZD0hMSxvLmVuYWJsZWQ9ITA7dmFyIGk9ZS5lbmFibGVkKHQpP286cjtyZXR1cm4gaS5uYW1lc3BhY2U9dCxpfWZ1bmN0aW9uIGkodCl7ZS5zYXZlKHQpO2Zvcih2YXIgcj0odHx8XCJcIikuc3BsaXQoL1tcXHMsXSsvKSxuPXIubGVuZ3RoLG89MDtvPG47bysrKXJbb10mJih0PXJbb10ucmVwbGFjZSgvW1xcXFxeJCs/LigpfFtcXF17fV0vZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXCovZyxcIi4qP1wiKSxcIi1cIj09PXRbMF0/ZS5za2lwcy5wdXNoKG5ldyBSZWdFeHAoXCJeXCIrdC5zdWJzdHIoMSkrXCIkXCIpKTplLm5hbWVzLnB1c2gobmV3IFJlZ0V4cChcIl5cIit0K1wiJFwiKSkpfWZ1bmN0aW9uIHMoKXtlLmVuYWJsZShcIlwiKX1mdW5jdGlvbiBhKHQpe3ZhciByLG47Zm9yKHI9MCxuPWUuc2tpcHMubGVuZ3RoO3I8bjtyKyspaWYoZS5za2lwc1tyXS50ZXN0KHQpKXJldHVybiExO2ZvcihyPTAsbj1lLm5hbWVzLmxlbmd0aDtyPG47cisrKWlmKGUubmFtZXNbcl0udGVzdCh0KSlyZXR1cm4hMDtyZXR1cm4hMX1mdW5jdGlvbiBjKHQpe3JldHVybiB0IGluc3RhbmNlb2YgRXJyb3I/dC5zdGFja3x8dC5tZXNzYWdlOnR9ZT10LmV4cG9ydHM9by5kZWJ1Zz1vLGUuY29lcmNlPWMsZS5kaXNhYmxlPXMsZS5lbmFibGU9aSxlLmVuYWJsZWQ9YSxlLmh1bWFuaXplPXIoNiksZS5uYW1lcz1bXSxlLnNraXBzPVtdLGUuZm9ybWF0dGVycz17fTt2YXIgdSxoPTB9LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0KXtpZih0PVN0cmluZyh0KSwhKHQubGVuZ3RoPjFlNCkpe3ZhciBlPS9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWModCk7aWYoZSl7dmFyIHI9cGFyc2VGbG9hdChlWzFdKSxuPShlWzJdfHxcIm1zXCIpLnRvTG93ZXJDYXNlKCk7c3dpdGNoKG4pe2Nhc2VcInllYXJzXCI6Y2FzZVwieWVhclwiOmNhc2VcInlyc1wiOmNhc2VcInlyXCI6Y2FzZVwieVwiOnJldHVybiByKmg7Y2FzZVwiZGF5c1wiOmNhc2VcImRheVwiOmNhc2VcImRcIjpyZXR1cm4gcip1O2Nhc2VcImhvdXJzXCI6Y2FzZVwiaG91clwiOmNhc2VcImhyc1wiOmNhc2VcImhyXCI6Y2FzZVwiaFwiOnJldHVybiByKmM7Y2FzZVwibWludXRlc1wiOmNhc2VcIm1pbnV0ZVwiOmNhc2VcIm1pbnNcIjpjYXNlXCJtaW5cIjpjYXNlXCJtXCI6cmV0dXJuIHIqYTtjYXNlXCJzZWNvbmRzXCI6Y2FzZVwic2Vjb25kXCI6Y2FzZVwic2Vjc1wiOmNhc2VcInNlY1wiOmNhc2VcInNcIjpyZXR1cm4gcipzO2Nhc2VcIm1pbGxpc2Vjb25kc1wiOmNhc2VcIm1pbGxpc2Vjb25kXCI6Y2FzZVwibXNlY3NcIjpjYXNlXCJtc2VjXCI6Y2FzZVwibXNcIjpyZXR1cm4gcjtkZWZhdWx0OnJldHVybn19fX1mdW5jdGlvbiBuKHQpe3JldHVybiB0Pj11P01hdGgucm91bmQodC91KStcImRcIjp0Pj1jP01hdGgucm91bmQodC9jKStcImhcIjp0Pj1hP01hdGgucm91bmQodC9hKStcIm1cIjp0Pj1zP01hdGgucm91bmQodC9zKStcInNcIjp0K1wibXNcIn1mdW5jdGlvbiBvKHQpe3JldHVybiBpKHQsdSxcImRheVwiKXx8aSh0LGMsXCJob3VyXCIpfHxpKHQsYSxcIm1pbnV0ZVwiKXx8aSh0LHMsXCJzZWNvbmRcIil8fHQrXCIgbXNcIn1mdW5jdGlvbiBpKHQsZSxyKXtpZighKHQ8ZSkpcmV0dXJuIHQ8MS41KmU/TWF0aC5mbG9vcih0L2UpK1wiIFwiK3I6TWF0aC5jZWlsKHQvZSkrXCIgXCIrcitcInNcIn12YXIgcz0xZTMsYT02MCpzLGM9NjAqYSx1PTI0KmMsaD0zNjUuMjUqdTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtlPWV8fHt9O3ZhciBpPXR5cGVvZiB0O2lmKFwic3RyaW5nXCI9PT1pJiZ0Lmxlbmd0aD4wKXJldHVybiByKHQpO2lmKFwibnVtYmVyXCI9PT1pJiZpc05hTih0KT09PSExKXJldHVybiBlLmxvbmc/byh0KTpuKHQpO3Rocm93IG5ldyBFcnJvcihcInZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgdmFsaWQgbnVtYmVyLiB2YWw9XCIrSlNPTi5zdHJpbmdpZnkodCkpfX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyh0KXt2YXIgcj1cIlwiLG49ITE7cmV0dXJuIHIrPXQudHlwZSxlLkJJTkFSWV9FVkVOVCE9dC50eXBlJiZlLkJJTkFSWV9BQ0shPXQudHlwZXx8KHIrPXQuYXR0YWNobWVudHMscis9XCItXCIpLHQubnNwJiZcIi9cIiE9dC5uc3AmJihuPSEwLHIrPXQubnNwKSxudWxsIT10LmlkJiYobiYmKHIrPVwiLFwiLG49ITEpLHIrPXQuaWQpLG51bGwhPXQuZGF0YSYmKG4mJihyKz1cIixcIikscis9Zi5zdHJpbmdpZnkodC5kYXRhKSkscChcImVuY29kZWQgJWogYXMgJXNcIix0LHIpLHJ9ZnVuY3Rpb24gaSh0LGUpe2Z1bmN0aW9uIHIodCl7dmFyIHI9ZC5kZWNvbnN0cnVjdFBhY2tldCh0KSxuPW8oci5wYWNrZXQpLGk9ci5idWZmZXJzO2kudW5zaGlmdChuKSxlKGkpfWQucmVtb3ZlQmxvYnModCxyKX1mdW5jdGlvbiBzKCl7dGhpcy5yZWNvbnN0cnVjdG9yPW51bGx9ZnVuY3Rpb24gYSh0KXt2YXIgcj17fSxuPTA7aWYoci50eXBlPU51bWJlcih0LmNoYXJBdCgwKSksbnVsbD09ZS50eXBlc1tyLnR5cGVdKXJldHVybiBoKCk7aWYoZS5CSU5BUllfRVZFTlQ9PXIudHlwZXx8ZS5CSU5BUllfQUNLPT1yLnR5cGUpe2Zvcih2YXIgbz1cIlwiO1wiLVwiIT10LmNoYXJBdCgrK24pJiYobys9dC5jaGFyQXQobiksbiE9dC5sZW5ndGgpOyk7aWYobyE9TnVtYmVyKG8pfHxcIi1cIiE9dC5jaGFyQXQobikpdGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBhdHRhY2htZW50c1wiKTtyLmF0dGFjaG1lbnRzPU51bWJlcihvKX1pZihcIi9cIj09dC5jaGFyQXQobisxKSlmb3Ioci5uc3A9XCJcIjsrK247KXt2YXIgaT10LmNoYXJBdChuKTtpZihcIixcIj09aSlicmVhaztpZihyLm5zcCs9aSxuPT10Lmxlbmd0aClicmVha31lbHNlIHIubnNwPVwiL1wiO3ZhciBzPXQuY2hhckF0KG4rMSk7aWYoXCJcIiE9PXMmJk51bWJlcihzKT09cyl7Zm9yKHIuaWQ9XCJcIjsrK247KXt2YXIgaT10LmNoYXJBdChuKTtpZihudWxsPT1pfHxOdW1iZXIoaSkhPWkpey0tbjticmVha31pZihyLmlkKz10LmNoYXJBdChuKSxuPT10Lmxlbmd0aClicmVha31yLmlkPU51bWJlcihyLmlkKX1yZXR1cm4gdC5jaGFyQXQoKytuKSYmKHI9YyhyLHQuc3Vic3RyKG4pKSkscChcImRlY29kZWQgJXMgYXMgJWpcIix0LHIpLHJ9ZnVuY3Rpb24gYyh0LGUpe3RyeXt0LmRhdGE9Zi5wYXJzZShlKX1jYXRjaCh0KXtyZXR1cm4gaCgpfXJldHVybiB0fWZ1bmN0aW9uIHUodCl7dGhpcy5yZWNvblBhY2s9dCx0aGlzLmJ1ZmZlcnM9W119ZnVuY3Rpb24gaCh0KXtyZXR1cm57dHlwZTplLkVSUk9SLGRhdGE6XCJwYXJzZXIgZXJyb3JcIn19dmFyIHA9cig4KShcInNvY2tldC5pby1wYXJzZXJcIiksZj1yKDExKSxsPXIoMTMpLGQ9cigxNCkseT1yKDE2KTtlLnByb3RvY29sPTQsZS50eXBlcz1bXCJDT05ORUNUXCIsXCJESVNDT05ORUNUXCIsXCJFVkVOVFwiLFwiQUNLXCIsXCJFUlJPUlwiLFwiQklOQVJZX0VWRU5UXCIsXCJCSU5BUllfQUNLXCJdLGUuQ09OTkVDVD0wLGUuRElTQ09OTkVDVD0xLGUuRVZFTlQ9MixlLkFDSz0zLGUuRVJST1I9NCxlLkJJTkFSWV9FVkVOVD01LGUuQklOQVJZX0FDSz02LGUuRW5jb2Rlcj1uLGUuRGVjb2Rlcj1zLG4ucHJvdG90eXBlLmVuY29kZT1mdW5jdGlvbih0LHIpe2lmKHAoXCJlbmNvZGluZyBwYWNrZXQgJWpcIix0KSxlLkJJTkFSWV9FVkVOVD09dC50eXBlfHxlLkJJTkFSWV9BQ0s9PXQudHlwZSlpKHQscik7ZWxzZXt2YXIgbj1vKHQpO3IoW25dKX19LGwocy5wcm90b3R5cGUpLHMucHJvdG90eXBlLmFkZD1mdW5jdGlvbih0KXt2YXIgcjtpZihcInN0cmluZ1wiPT10eXBlb2YgdClyPWEodCksZS5CSU5BUllfRVZFTlQ9PXIudHlwZXx8ZS5CSU5BUllfQUNLPT1yLnR5cGU/KHRoaXMucmVjb25zdHJ1Y3Rvcj1uZXcgdShyKSwwPT09dGhpcy5yZWNvbnN0cnVjdG9yLnJlY29uUGFjay5hdHRhY2htZW50cyYmdGhpcy5lbWl0KFwiZGVjb2RlZFwiLHIpKTp0aGlzLmVtaXQoXCJkZWNvZGVkXCIscik7ZWxzZXtpZigheSh0KSYmIXQuYmFzZTY0KXRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZTogXCIrdCk7aWYoIXRoaXMucmVjb25zdHJ1Y3Rvcil0aHJvdyBuZXcgRXJyb3IoXCJnb3QgYmluYXJ5IGRhdGEgd2hlbiBub3QgcmVjb25zdHJ1Y3RpbmcgYSBwYWNrZXRcIik7cj10aGlzLnJlY29uc3RydWN0b3IudGFrZUJpbmFyeURhdGEodCksciYmKHRoaXMucmVjb25zdHJ1Y3Rvcj1udWxsLHRoaXMuZW1pdChcImRlY29kZWRcIixyKSl9fSxzLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZWNvbnN0cnVjdG9yJiZ0aGlzLnJlY29uc3RydWN0b3IuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpfSx1LnByb3RvdHlwZS50YWtlQmluYXJ5RGF0YT1mdW5jdGlvbih0KXtpZih0aGlzLmJ1ZmZlcnMucHVzaCh0KSx0aGlzLmJ1ZmZlcnMubGVuZ3RoPT10aGlzLnJlY29uUGFjay5hdHRhY2htZW50cyl7dmFyIGU9ZC5yZWNvbnN0cnVjdFBhY2tldCh0aGlzLnJlY29uUGFjayx0aGlzLmJ1ZmZlcnMpO3JldHVybiB0aGlzLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb24oKSxlfXJldHVybiBudWxsfSx1LnByb3RvdHlwZS5maW5pc2hlZFJlY29uc3RydWN0aW9uPWZ1bmN0aW9uKCl7dGhpcy5yZWNvblBhY2s9bnVsbCx0aGlzLmJ1ZmZlcnM9W119fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe3JldHVyblwiV2Via2l0QXBwZWFyYW5jZVwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlfHx3aW5kb3cuY29uc29sZSYmKGNvbnNvbGUuZmlyZWJ1Z3x8Y29uc29sZS5leGNlcHRpb24mJmNvbnNvbGUudGFibGUpfHxuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSYmcGFyc2VJbnQoUmVnRXhwLiQxLDEwKT49MzF9ZnVuY3Rpb24gbygpe3ZhciB0PWFyZ3VtZW50cyxyPXRoaXMudXNlQ29sb3JzO2lmKHRbMF09KHI/XCIlY1wiOlwiXCIpK3RoaXMubmFtZXNwYWNlKyhyP1wiICVjXCI6XCIgXCIpK3RbMF0rKHI/XCIlYyBcIjpcIiBcIikrXCIrXCIrZS5odW1hbml6ZSh0aGlzLmRpZmYpLCFyKXJldHVybiB0O3ZhciBuPVwiY29sb3I6IFwiK3RoaXMuY29sb3I7dD1bdFswXSxuLFwiY29sb3I6IGluaGVyaXRcIl0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHQsMSkpO3ZhciBvPTAsaT0wO3JldHVybiB0WzBdLnJlcGxhY2UoLyVbYS16JV0vZyxmdW5jdGlvbih0KXtcIiUlXCIhPT10JiYobysrLFwiJWNcIj09PXQmJihpPW8pKX0pLHQuc3BsaWNlKGksMCxuKSx0fWZ1bmN0aW9uIGkoKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgY29uc29sZSYmY29uc29sZS5sb2cmJkZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLGNvbnNvbGUsYXJndW1lbnRzKX1mdW5jdGlvbiBzKHQpe3RyeXtudWxsPT10P2Uuc3RvcmFnZS5yZW1vdmVJdGVtKFwiZGVidWdcIik6ZS5zdG9yYWdlLmRlYnVnPXR9Y2F0Y2godCl7fX1mdW5jdGlvbiBhKCl7dmFyIHQ7dHJ5e3Q9ZS5zdG9yYWdlLmRlYnVnfWNhdGNoKHQpe31yZXR1cm4gdH1mdW5jdGlvbiBjKCl7dHJ5e3JldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlfWNhdGNoKHQpe319ZT10LmV4cG9ydHM9cig5KSxlLmxvZz1pLGUuZm9ybWF0QXJncz1vLGUuc2F2ZT1zLGUubG9hZD1hLGUudXNlQ29sb3JzPW4sZS5zdG9yYWdlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBjaHJvbWUmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBjaHJvbWUuc3RvcmFnZT9jaHJvbWUuc3RvcmFnZS5sb2NhbDpjKCksZS5jb2xvcnM9W1wibGlnaHRzZWFncmVlblwiLFwiZm9yZXN0Z3JlZW5cIixcImdvbGRlbnJvZFwiLFwiZG9kZ2VyYmx1ZVwiLFwiZGFya29yY2hpZFwiLFwiY3JpbXNvblwiXSxlLmZvcm1hdHRlcnMuaj1mdW5jdGlvbih0KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkodCl9LGUuZW5hYmxlKGEoKSl9LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7cmV0dXJuIGUuY29sb3JzW2grKyVlLmNvbG9ycy5sZW5ndGhdfWZ1bmN0aW9uIG8odCl7ZnVuY3Rpb24gcigpe31mdW5jdGlvbiBvKCl7dmFyIHQ9byxyPStuZXcgRGF0ZSxpPXItKHV8fHIpO3QuZGlmZj1pLHQucHJldj11LHQuY3Vycj1yLHU9cixudWxsPT10LnVzZUNvbG9ycyYmKHQudXNlQ29sb3JzPWUudXNlQ29sb3JzKCkpLG51bGw9PXQuY29sb3ImJnQudXNlQ29sb3JzJiYodC5jb2xvcj1uKCkpO3ZhciBzPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7c1swXT1lLmNvZXJjZShzWzBdKSxcInN0cmluZ1wiIT10eXBlb2Ygc1swXSYmKHM9W1wiJW9cIl0uY29uY2F0KHMpKTt2YXIgYT0wO3NbMF09c1swXS5yZXBsYWNlKC8lKFthLXolXSkvZyxmdW5jdGlvbihyLG4pe2lmKFwiJSVcIj09PXIpcmV0dXJuIHI7YSsrO3ZhciBvPWUuZm9ybWF0dGVyc1tuXTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBvKXt2YXIgaT1zW2FdO3I9by5jYWxsKHQsaSkscy5zcGxpY2UoYSwxKSxhLS19cmV0dXJuIHJ9KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLmZvcm1hdEFyZ3MmJihzPWUuZm9ybWF0QXJncy5hcHBseSh0LHMpKTt2YXIgYz1vLmxvZ3x8ZS5sb2d8fGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7Yy5hcHBseSh0LHMpfXIuZW5hYmxlZD0hMSxvLmVuYWJsZWQ9ITA7dmFyIGk9ZS5lbmFibGVkKHQpP286cjtyZXR1cm4gaS5uYW1lc3BhY2U9dCxpfWZ1bmN0aW9uIGkodCl7ZS5zYXZlKHQpO2Zvcih2YXIgcj0odHx8XCJcIikuc3BsaXQoL1tcXHMsXSsvKSxuPXIubGVuZ3RoLG89MDtvPG47bysrKXJbb10mJih0PXJbb10ucmVwbGFjZSgvXFwqL2csXCIuKj9cIiksXCItXCI9PT10WzBdP2Uuc2tpcHMucHVzaChuZXcgUmVnRXhwKFwiXlwiK3Quc3Vic3RyKDEpK1wiJFwiKSk6ZS5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoXCJeXCIrdCtcIiRcIikpKX1mdW5jdGlvbiBzKCl7ZS5lbmFibGUoXCJcIil9ZnVuY3Rpb24gYSh0KXt2YXIgcixuO2ZvcihyPTAsbj1lLnNraXBzLmxlbmd0aDtyPG47cisrKWlmKGUuc2tpcHNbcl0udGVzdCh0KSlyZXR1cm4hMTtmb3Iocj0wLG49ZS5uYW1lcy5sZW5ndGg7cjxuO3IrKylpZihlLm5hbWVzW3JdLnRlc3QodCkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gYyh0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIEVycm9yP3Quc3RhY2t8fHQubWVzc2FnZTp0fWU9dC5leHBvcnRzPW8sZS5jb2VyY2U9YyxlLmRpc2FibGU9cyxlLmVuYWJsZT1pLGUuZW5hYmxlZD1hLGUuaHVtYW5pemU9cigxMCksZS5uYW1lcz1bXSxlLnNraXBzPVtdLGUuZm9ybWF0dGVycz17fTt2YXIgdSxoPTB9LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0KXtpZih0PVwiXCIrdCwhKHQubGVuZ3RoPjFlNCkpe3ZhciBlPS9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWModCk7aWYoZSl7dmFyIHI9cGFyc2VGbG9hdChlWzFdKSxuPShlWzJdfHxcIm1zXCIpLnRvTG93ZXJDYXNlKCk7c3dpdGNoKG4pe2Nhc2VcInllYXJzXCI6Y2FzZVwieWVhclwiOmNhc2VcInlyc1wiOmNhc2VcInlyXCI6Y2FzZVwieVwiOnJldHVybiByKmg7Y2FzZVwiZGF5c1wiOmNhc2VcImRheVwiOmNhc2VcImRcIjpyZXR1cm4gcip1O2Nhc2VcImhvdXJzXCI6Y2FzZVwiaG91clwiOmNhc2VcImhyc1wiOmNhc2VcImhyXCI6Y2FzZVwiaFwiOnJldHVybiByKmM7Y2FzZVwibWludXRlc1wiOmNhc2VcIm1pbnV0ZVwiOmNhc2VcIm1pbnNcIjpjYXNlXCJtaW5cIjpjYXNlXCJtXCI6cmV0dXJuIHIqYTtjYXNlXCJzZWNvbmRzXCI6Y2FzZVwic2Vjb25kXCI6Y2FzZVwic2Vjc1wiOmNhc2VcInNlY1wiOmNhc2VcInNcIjpyZXR1cm4gcipzO2Nhc2VcIm1pbGxpc2Vjb25kc1wiOmNhc2VcIm1pbGxpc2Vjb25kXCI6Y2FzZVwibXNlY3NcIjpjYXNlXCJtc2VjXCI6Y2FzZVwibXNcIjpyZXR1cm4gcn19fX1mdW5jdGlvbiBuKHQpe3JldHVybiB0Pj11P01hdGgucm91bmQodC91KStcImRcIjp0Pj1jP01hdGgucm91bmQodC9jKStcImhcIjp0Pj1hP01hdGgucm91bmQodC9hKStcIm1cIjp0Pj1zP01hdGgucm91bmQodC9zKStcInNcIjp0K1wibXNcIn1mdW5jdGlvbiBvKHQpe3JldHVybiBpKHQsdSxcImRheVwiKXx8aSh0LGMsXCJob3VyXCIpfHxpKHQsYSxcIm1pbnV0ZVwiKXx8aSh0LHMsXCJzZWNvbmRcIil8fHQrXCIgbXNcIn1mdW5jdGlvbiBpKHQsZSxyKXtpZighKHQ8ZSkpcmV0dXJuIHQ8MS41KmU/TWF0aC5mbG9vcih0L2UpK1wiIFwiK3I6TWF0aC5jZWlsKHQvZSkrXCIgXCIrcitcInNcIn12YXIgcz0xZTMsYT02MCpzLGM9NjAqYSx1PTI0KmMsaD0zNjUuMjUqdTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtyZXR1cm4gZT1lfHx7fSxcInN0cmluZ1wiPT10eXBlb2YgdD9yKHQpOmUubG9uZz9vKHQpOm4odCl9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKHQscil7dmFyIG49ITE7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbyh0LGUpe2Z1bmN0aW9uIHIodCl7aWYoclt0XSE9PWcpcmV0dXJuIHJbdF07dmFyIG87aWYoXCJidWctc3RyaW5nLWNoYXItaW5kZXhcIj09dClvPVwiYVwiIT1cImFcIlswXTtlbHNlIGlmKFwianNvblwiPT10KW89cihcImpzb24tc3RyaW5naWZ5XCIpJiZyKFwianNvbi1wYXJzZVwiKTtlbHNle3ZhciBzLGE9J3tcImFcIjpbMSx0cnVlLGZhbHNlLG51bGwsXCJcXFxcdTAwMDBcXFxcYlxcXFxuXFxcXGZcXFxcclxcXFx0XCJdfSc7aWYoXCJqc29uLXN0cmluZ2lmeVwiPT10KXt2YXIgYz1lLnN0cmluZ2lmeSxoPVwiZnVuY3Rpb25cIj09dHlwZW9mIGMmJmI7aWYoaCl7KHM9ZnVuY3Rpb24oKXtyZXR1cm4gMX0pLnRvSlNPTj1zO3RyeXtoPVwiMFwiPT09YygwKSYmXCIwXCI9PT1jKG5ldyBuKSYmJ1wiXCInPT1jKG5ldyBpKSYmYyh2KT09PWcmJmMoZyk9PT1nJiZjKCk9PT1nJiZcIjFcIj09PWMocykmJlwiWzFdXCI9PWMoW3NdKSYmXCJbbnVsbF1cIj09YyhbZ10pJiZcIm51bGxcIj09YyhudWxsKSYmXCJbbnVsbCxudWxsLG51bGxdXCI9PWMoW2csdixudWxsXSkmJmMoe2E6W3MsITAsITEsbnVsbCxcIlxcMFxcYlxcblxcZlxcclxcdFwiXX0pPT1hJiZcIjFcIj09PWMobnVsbCxzKSYmXCJbXFxuIDEsXFxuIDJcXG5dXCI9PWMoWzEsMl0sbnVsbCwxKSYmJ1wiLTI3MTgyMS0wNC0yMFQwMDowMDowMC4wMDBaXCInPT1jKG5ldyB1KC04NjRlMTMpKSYmJ1wiKzI3NTc2MC0wOS0xM1QwMDowMDowMC4wMDBaXCInPT1jKG5ldyB1KDg2NGUxMykpJiYnXCItMDAwMDAxLTAxLTAxVDAwOjAwOjAwLjAwMFpcIic9PWMobmV3IHUoLTYyMTk4NzU1MmU1KSkmJidcIjE5NjktMTItMzFUMjM6NTk6NTkuOTk5WlwiJz09YyhuZXcgdSgtMSkpfWNhdGNoKHQpe2g9ITF9fW89aH1pZihcImpzb24tcGFyc2VcIj09dCl7dmFyIHA9ZS5wYXJzZTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBwKXRyeXtpZigwPT09cChcIjBcIikmJiFwKCExKSl7cz1wKGEpO3ZhciBmPTU9PXMuYS5sZW5ndGgmJjE9PT1zLmFbMF07aWYoZil7dHJ5e2Y9IXAoJ1wiXFx0XCInKX1jYXRjaCh0KXt9aWYoZil0cnl7Zj0xIT09cChcIjAxXCIpfWNhdGNoKHQpe31pZihmKXRyeXtmPTEhPT1wKFwiMS5cIil9Y2F0Y2godCl7fX19fWNhdGNoKHQpe2Y9ITF9bz1mfX1yZXR1cm4gclt0XT0hIW99dHx8KHQ9Yy5PYmplY3QoKSksZXx8KGU9Yy5PYmplY3QoKSk7dmFyIG49dC5OdW1iZXJ8fGMuTnVtYmVyLGk9dC5TdHJpbmd8fGMuU3RyaW5nLGE9dC5PYmplY3R8fGMuT2JqZWN0LHU9dC5EYXRlfHxjLkRhdGUsaD10LlN5bnRheEVycm9yfHxjLlN5bnRheEVycm9yLHA9dC5UeXBlRXJyb3J8fGMuVHlwZUVycm9yLGY9dC5NYXRofHxjLk1hdGgsbD10LkpTT058fGMuSlNPTjtcIm9iamVjdFwiPT10eXBlb2YgbCYmbCYmKGUuc3RyaW5naWZ5PWwuc3RyaW5naWZ5LGUucGFyc2U9bC5wYXJzZSk7dmFyIGQseSxnLG09YS5wcm90b3R5cGUsdj1tLnRvU3RyaW5nLGI9bmV3IHUoLTB4Yzc4MmI1YjgwMGNlYyk7dHJ5e2I9Yi5nZXRVVENGdWxsWWVhcigpPT0tMTA5MjUyJiYwPT09Yi5nZXRVVENNb250aCgpJiYxPT09Yi5nZXRVVENEYXRlKCkmJjEwPT1iLmdldFVUQ0hvdXJzKCkmJjM3PT1iLmdldFVUQ01pbnV0ZXMoKSYmNj09Yi5nZXRVVENTZWNvbmRzKCkmJjcwOD09Yi5nZXRVVENNaWxsaXNlY29uZHMoKX1jYXRjaCh0KXt9aWYoIXIoXCJqc29uXCIpKXt2YXIgdz1cIltvYmplY3QgRnVuY3Rpb25dXCIsaz1cIltvYmplY3QgRGF0ZV1cIix4PVwiW29iamVjdCBOdW1iZXJdXCIsQT1cIltvYmplY3QgU3RyaW5nXVwiLEM9XCJbb2JqZWN0IEFycmF5XVwiLEI9XCJbb2JqZWN0IEJvb2xlYW5dXCIsUz1yKFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCIpO2lmKCFiKXZhciBUPWYuZmxvb3IsRT1bMCwzMSw1OSw5MCwxMjAsMTUxLDE4MSwyMTIsMjQzLDI3MywzMDQsMzM0XSxfPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIEVbZV0rMzY1Kih0LTE5NzApK1QoKHQtMTk2OSsoZT0rKGU+MSkpKS80KS1UKCh0LTE5MDErZSkvMTAwKStUKCh0LTE2MDErZSkvNDAwKX07aWYoKGQ9bS5oYXNPd25Qcm9wZXJ0eSl8fChkPWZ1bmN0aW9uKHQpe3ZhciBlLHI9e307cmV0dXJuKHIuX19wcm90b19fPW51bGwsci5fX3Byb3RvX189e3RvU3RyaW5nOjF9LHIpLnRvU3RyaW5nIT12P2Q9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5fX3Byb3RvX18scj10IGluKHRoaXMuX19wcm90b19fPW51bGwsdGhpcyk7cmV0dXJuIHRoaXMuX19wcm90b19fPWUscn06KGU9ci5jb25zdHJ1Y3RvcixkPWZ1bmN0aW9uKHQpe3ZhciByPSh0aGlzLmNvbnN0cnVjdG9yfHxlKS5wcm90b3R5cGU7cmV0dXJuIHQgaW4gdGhpcyYmISh0IGluIHImJnRoaXNbdF09PT1yW3RdKX0pLHI9bnVsbCxkLmNhbGwodGhpcyx0KX0pLHk9ZnVuY3Rpb24odCxlKXt2YXIgcixuLG8saT0wOyhyPWZ1bmN0aW9uKCl7dGhpcy52YWx1ZU9mPTB9KS5wcm90b3R5cGUudmFsdWVPZj0wLG49bmV3IHI7Zm9yKG8gaW4gbilkLmNhbGwobixvKSYmaSsrO3JldHVybiByPW49bnVsbCxpP3k9Mj09aT9mdW5jdGlvbih0LGUpe3ZhciByLG49e30sbz12LmNhbGwodCk9PXc7Zm9yKHIgaW4gdClvJiZcInByb3RvdHlwZVwiPT1yfHxkLmNhbGwobixyKXx8IShuW3JdPTEpfHwhZC5jYWxsKHQscil8fGUocil9OmZ1bmN0aW9uKHQsZSl7dmFyIHIsbixvPXYuY2FsbCh0KT09dztmb3IociBpbiB0KW8mJlwicHJvdG90eXBlXCI9PXJ8fCFkLmNhbGwodCxyKXx8KG49XCJjb25zdHJ1Y3RvclwiPT09cil8fGUocik7KG58fGQuY2FsbCh0LHI9XCJjb25zdHJ1Y3RvclwiKSkmJmUocil9OihuPVtcInZhbHVlT2ZcIixcInRvU3RyaW5nXCIsXCJ0b0xvY2FsZVN0cmluZ1wiLFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcImlzUHJvdG90eXBlT2ZcIixcImhhc093blByb3BlcnR5XCIsXCJjb25zdHJ1Y3RvclwiXSx5PWZ1bmN0aW9uKHQsZSl7dmFyIHIsbyxpPXYuY2FsbCh0KT09dyxhPSFpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmNvbnN0cnVjdG9yJiZzW3R5cGVvZiB0Lmhhc093blByb3BlcnR5XSYmdC5oYXNPd25Qcm9wZXJ0eXx8ZDtmb3IociBpbiB0KWkmJlwicHJvdG90eXBlXCI9PXJ8fCFhLmNhbGwodCxyKXx8ZShyKTtmb3Iobz1uLmxlbmd0aDtyPW5bLS1vXTthLmNhbGwodCxyKSYmZShyKSk7fSkseSh0LGUpfSwhcihcImpzb24tc3RyaW5naWZ5XCIpKXt2YXIgTj17OTI6XCJcXFxcXFxcXFwiLDM0OidcXFxcXCInLDg6XCJcXFxcYlwiLDEyOlwiXFxcXGZcIiwxMDpcIlxcXFxuXCIsMTM6XCJcXFxcclwiLDk6XCJcXFxcdFwifSxqPVwiMDAwMDAwXCIsTz1mdW5jdGlvbih0LGUpe3JldHVybihqKyhlfHwwKSkuc2xpY2UoLXQpfSxQPVwiXFxcXHUwMFwiLFI9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPSdcIicscj0wLG49dC5sZW5ndGgsbz0hU3x8bj4xMCxpPW8mJihTP3Quc3BsaXQoXCJcIik6dCk7cjxuO3IrKyl7dmFyIHM9dC5jaGFyQ29kZUF0KHIpO3N3aXRjaChzKXtjYXNlIDg6Y2FzZSA5OmNhc2UgMTA6Y2FzZSAxMjpjYXNlIDEzOmNhc2UgMzQ6Y2FzZSA5MjplKz1OW3NdO2JyZWFrO2RlZmF1bHQ6aWYoczwzMil7ZSs9UCtPKDIscy50b1N0cmluZygxNikpO2JyZWFrfWUrPW8/aVtyXTp0LmNoYXJBdChyKX19cmV0dXJuIGUrJ1wiJ30sRD1mdW5jdGlvbih0LGUscixuLG8saSxzKXt2YXIgYSxjLHUsaCxmLGwsbSxiLHcsUyxFLE4saixQLHEsVTt0cnl7YT1lW3RdfWNhdGNoKHQpe31pZihcIm9iamVjdFwiPT10eXBlb2YgYSYmYSlpZihjPXYuY2FsbChhKSxjIT1rfHxkLmNhbGwoYSxcInRvSlNPTlwiKSlcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLnRvSlNPTiYmKGMhPXgmJmMhPUEmJmMhPUN8fGQuY2FsbChhLFwidG9KU09OXCIpKSYmKGE9YS50b0pTT04odCkpO2Vsc2UgaWYoYT4tMS8wJiZhPDEvMCl7aWYoXyl7Zm9yKGY9VChhLzg2NGU1KSx1PVQoZi8zNjUuMjQyNSkrMTk3MC0xO18odSsxLDApPD1mO3UrKyk7Zm9yKGg9VCgoZi1fKHUsMCkpLzMwLjQyKTtfKHUsaCsxKTw9ZjtoKyspO2Y9MStmLV8odSxoKSxsPShhJTg2NGU1Kzg2NGU1KSU4NjRlNSxtPVQobC8zNmU1KSUyNCxiPVQobC82ZTQpJTYwLHc9VChsLzFlMyklNjAsUz1sJTFlM31lbHNlIHU9YS5nZXRVVENGdWxsWWVhcigpLGg9YS5nZXRVVENNb250aCgpLGY9YS5nZXRVVENEYXRlKCksbT1hLmdldFVUQ0hvdXJzKCksYj1hLmdldFVUQ01pbnV0ZXMoKSx3PWEuZ2V0VVRDU2Vjb25kcygpLFM9YS5nZXRVVENNaWxsaXNlY29uZHMoKTthPSh1PD0wfHx1Pj0xZTQ/KHU8MD9cIi1cIjpcIitcIikrTyg2LHU8MD8tdTp1KTpPKDQsdSkpK1wiLVwiK08oMixoKzEpK1wiLVwiK08oMixmKStcIlRcIitPKDIsbSkrXCI6XCIrTygyLGIpK1wiOlwiK08oMix3KStcIi5cIitPKDMsUykrXCJaXCJ9ZWxzZSBhPW51bGw7aWYociYmKGE9ci5jYWxsKGUsdCxhKSksbnVsbD09PWEpcmV0dXJuXCJudWxsXCI7aWYoYz12LmNhbGwoYSksYz09QilyZXR1cm5cIlwiK2E7aWYoYz09eClyZXR1cm4gYT4tMS8wJiZhPDEvMD9cIlwiK2E6XCJudWxsXCI7aWYoYz09QSlyZXR1cm4gUihcIlwiK2EpO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBhKXtmb3IoUD1zLmxlbmd0aDtQLS07KWlmKHNbUF09PT1hKXRocm93IHAoKTtpZihzLnB1c2goYSksRT1bXSxxPWksaSs9byxjPT1DKXtmb3Ioaj0wLFA9YS5sZW5ndGg7ajxQO2orKylOPUQoaixhLHIsbixvLGkscyksRS5wdXNoKE49PT1nP1wibnVsbFwiOk4pO1U9RS5sZW5ndGg/bz9cIltcXG5cIitpK0Uuam9pbihcIixcXG5cIitpKStcIlxcblwiK3ErXCJdXCI6XCJbXCIrRS5qb2luKFwiLFwiKStcIl1cIjpcIltdXCJ9ZWxzZSB5KG58fGEsZnVuY3Rpb24odCl7dmFyIGU9RCh0LGEscixuLG8saSxzKTtlIT09ZyYmRS5wdXNoKFIodCkrXCI6XCIrKG8/XCIgXCI6XCJcIikrZSl9KSxVPUUubGVuZ3RoP28/XCJ7XFxuXCIraStFLmpvaW4oXCIsXFxuXCIraSkrXCJcXG5cIitxK1wifVwiOlwie1wiK0Uuam9pbihcIixcIikrXCJ9XCI6XCJ7fVwiO3JldHVybiBzLnBvcCgpLFV9fTtlLnN0cmluZ2lmeT1mdW5jdGlvbih0LGUscil7dmFyIG4sbyxpLGE7aWYoc1t0eXBlb2YgZV0mJmUpaWYoKGE9di5jYWxsKGUpKT09dylvPWU7ZWxzZSBpZihhPT1DKXtpPXt9O2Zvcih2YXIgYyx1PTAsaD1lLmxlbmd0aDt1PGg7Yz1lW3UrK10sYT12LmNhbGwoYyksKGE9PUF8fGE9PXgpJiYoaVtjXT0xKSk7fWlmKHIpaWYoKGE9di5jYWxsKHIpKT09eCl7aWYoKHItPXIlMSk+MClmb3Iobj1cIlwiLHI+MTAmJihyPTEwKTtuLmxlbmd0aDxyO24rPVwiIFwiKTt9ZWxzZSBhPT1BJiYobj1yLmxlbmd0aDw9MTA/cjpyLnNsaWNlKDAsMTApKTtyZXR1cm4gRChcIlwiLChjPXt9LGNbXCJcIl09dCxjKSxvLGksbixcIlwiLFtdKX19aWYoIXIoXCJqc29uLXBhcnNlXCIpKXt2YXIgcSxVLE09aS5mcm9tQ2hhckNvZGUsTD17OTI6XCJcXFxcXCIsMzQ6J1wiJyw0NzpcIi9cIiw5ODpcIlxcYlwiLDExNjpcIlxcdFwiLDExMDpcIlxcblwiLDEwMjpcIlxcZlwiLDExNDpcIlxcclwifSxJPWZ1bmN0aW9uKCl7dGhyb3cgcT1VPW51bGwsaCgpfSxIPWZ1bmN0aW9uKCl7Zm9yKHZhciB0LGUscixuLG8saT1VLHM9aS5sZW5ndGg7cTxzOylzd2l0Y2gobz1pLmNoYXJDb2RlQXQocSkpe2Nhc2UgOTpjYXNlIDEwOmNhc2UgMTM6Y2FzZSAzMjpxKys7YnJlYWs7Y2FzZSAxMjM6Y2FzZSAxMjU6Y2FzZSA5MTpjYXNlIDkzOmNhc2UgNTg6Y2FzZSA0NDpyZXR1cm4gdD1TP2kuY2hhckF0KHEpOmlbcV0scSsrLHQ7Y2FzZSAzNDpmb3IodD1cIkBcIixxKys7cTxzOylpZihvPWkuY2hhckNvZGVBdChxKSxvPDMyKUkoKTtlbHNlIGlmKDkyPT1vKXN3aXRjaChvPWkuY2hhckNvZGVBdCgrK3EpKXtjYXNlIDkyOmNhc2UgMzQ6Y2FzZSA0NzpjYXNlIDk4OmNhc2UgMTE2OmNhc2UgMTEwOmNhc2UgMTAyOmNhc2UgMTE0OnQrPUxbb10scSsrO2JyZWFrO2Nhc2UgMTE3OmZvcihlPSsrcSxyPXErNDtxPHI7cSsrKW89aS5jaGFyQ29kZUF0KHEpLG8+PTQ4JiZvPD01N3x8bz49OTcmJm88PTEwMnx8bz49NjUmJm88PTcwfHxJKCk7dCs9TShcIjB4XCIraS5zbGljZShlLHEpKTticmVhaztkZWZhdWx0OkkoKX1lbHNle2lmKDM0PT1vKWJyZWFrO2ZvcihvPWkuY2hhckNvZGVBdChxKSxlPXE7bz49MzImJjkyIT1vJiYzNCE9bzspbz1pLmNoYXJDb2RlQXQoKytxKTt0Kz1pLnNsaWNlKGUscSl9aWYoMzQ9PWkuY2hhckNvZGVBdChxKSlyZXR1cm4gcSsrLHQ7SSgpO2RlZmF1bHQ6aWYoZT1xLDQ1PT1vJiYobj0hMCxvPWkuY2hhckNvZGVBdCgrK3EpKSxvPj00OCYmbzw9NTcpe2Zvcig0OD09byYmKG89aS5jaGFyQ29kZUF0KHErMSksbz49NDgmJm88PTU3KSYmSSgpLG49ITE7cTxzJiYobz1pLmNoYXJDb2RlQXQocSksbz49NDgmJm88PTU3KTtxKyspO2lmKDQ2PT1pLmNoYXJDb2RlQXQocSkpe2ZvcihyPSsrcTtyPHMmJihvPWkuY2hhckNvZGVBdChyKSxvPj00OCYmbzw9NTcpO3IrKyk7cj09cSYmSSgpLHE9cn1pZihvPWkuY2hhckNvZGVBdChxKSwxMDE9PW98fDY5PT1vKXtmb3Iobz1pLmNoYXJDb2RlQXQoKytxKSw0MyE9byYmNDUhPW98fHErKyxyPXE7cjxzJiYobz1pLmNoYXJDb2RlQXQociksbz49NDgmJm88PTU3KTtyKyspO3I9PXEmJkkoKSxxPXJ9cmV0dXJuK2kuc2xpY2UoZSxxKX1pZihuJiZJKCksXCJ0cnVlXCI9PWkuc2xpY2UocSxxKzQpKXJldHVybiBxKz00LCEwO2lmKFwiZmFsc2VcIj09aS5zbGljZShxLHErNSkpcmV0dXJuIHErPTUsITE7aWYoXCJudWxsXCI9PWkuc2xpY2UocSxxKzQpKXJldHVybiBxKz00LG51bGw7SSgpfXJldHVyblwiJFwifSx6PWZ1bmN0aW9uKHQpe3ZhciBlLHI7aWYoXCIkXCI9PXQmJkkoKSxcInN0cmluZ1wiPT10eXBlb2YgdCl7aWYoXCJAXCI9PShTP3QuY2hhckF0KDApOnRbMF0pKXJldHVybiB0LnNsaWNlKDEpO2lmKFwiW1wiPT10KXtmb3IoZT1bXTt0PUgoKSxcIl1cIiE9dDtyfHwocj0hMCkpciYmKFwiLFwiPT10Pyh0PUgoKSxcIl1cIj09dCYmSSgpKTpJKCkpLFwiLFwiPT10JiZJKCksZS5wdXNoKHoodCkpO3JldHVybiBlfWlmKFwie1wiPT10KXtmb3IoZT17fTt0PUgoKSxcIn1cIiE9dDtyfHwocj0hMCkpciYmKFwiLFwiPT10Pyh0PUgoKSxcIn1cIj09dCYmSSgpKTpJKCkpLFwiLFwiIT10JiZcInN0cmluZ1wiPT10eXBlb2YgdCYmXCJAXCI9PShTP3QuY2hhckF0KDApOnRbMF0pJiZcIjpcIj09SCgpfHxJKCksZVt0LnNsaWNlKDEpXT16KEgoKSk7cmV0dXJuIGV9SSgpfXJldHVybiB0fSxKPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbj1YKHQsZSxyKTtuPT09Zz9kZWxldGUgdFtlXTp0W2VdPW59LFg9ZnVuY3Rpb24odCxlLHIpe3ZhciBuLG89dFtlXTtpZihcIm9iamVjdFwiPT10eXBlb2YgbyYmbylpZih2LmNhbGwobyk9PUMpZm9yKG49by5sZW5ndGg7bi0tOylKKG8sbixyKTtlbHNlIHkobyxmdW5jdGlvbih0KXtKKG8sdCxyKX0pO3JldHVybiByLmNhbGwodCxlLG8pfTtlLnBhcnNlPWZ1bmN0aW9uKHQsZSl7dmFyIHIsbjtyZXR1cm4gcT0wLFU9XCJcIit0LHI9eihIKCkpLFwiJFwiIT1IKCkmJkkoKSxxPVU9bnVsbCxlJiZ2LmNhbGwoZSk9PXc/WCgobj17fSxuW1wiXCJdPXIsbiksXCJcIixlKTpyfX19cmV0dXJuIGUucnVuSW5Db250ZXh0PW8sZX12YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZuLmFtZCxzPXtmdW5jdGlvbjohMCxvYmplY3Q6ITB9LGE9c1t0eXBlb2YgZV0mJmUmJiFlLm5vZGVUeXBlJiZlLGM9c1t0eXBlb2Ygd2luZG93XSYmd2luZG93fHx0aGlzLHU9YSYmc1t0eXBlb2YgdF0mJnQmJiF0Lm5vZGVUeXBlJiZcIm9iamVjdFwiPT10eXBlb2YgciYmcjtpZighdXx8dS5nbG9iYWwhPT11JiZ1LndpbmRvdyE9PXUmJnUuc2VsZiE9PXV8fChjPXUpLGEmJiFpKW8oYyxhKTtlbHNle3ZhciBoPWMuSlNPTixwPWMuSlNPTjMsZj0hMSxsPW8oYyxjLkpTT04zPXtub0NvbmZsaWN0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ8fChmPSEwLGMuSlNPTj1oLGMuSlNPTjM9cCxoPXA9bnVsbCksbH19KTtjLkpTT049e3BhcnNlOmwucGFyc2Usc3RyaW5naWZ5Omwuc3RyaW5naWZ5fX1pJiZuKGZ1bmN0aW9uKCl7cmV0dXJuIGx9KX0pLmNhbGwodGhpcyl9KS5jYWxsKGUscigxMikodCksZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiB0LndlYnBhY2tQb2x5ZmlsbHx8KHQuZGVwcmVjYXRlPWZ1bmN0aW9uKCl7fSx0LnBhdGhzPVtdLHQuY2hpbGRyZW49W10sdC53ZWJwYWNrUG9seWZpbGw9MSksdH19LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0KXtpZih0KXJldHVybiBuKHQpfWZ1bmN0aW9uIG4odCl7Zm9yKHZhciBlIGluIHIucHJvdG90eXBlKXRbZV09ci5wcm90b3R5cGVbZV07cmV0dXJuIHR9dC5leHBvcnRzPXIsci5wcm90b3R5cGUub249ci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSwodGhpcy5fY2FsbGJhY2tzW3RdPXRoaXMuX2NhbGxiYWNrc1t0XXx8W10pLnB1c2goZSksdGhpc30sci5wcm90b3R5cGUub25jZT1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIoKXtuLm9mZih0LHIpLGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfXZhciBuPXRoaXM7cmV0dXJuIHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LHIuZm49ZSx0aGlzLm9uKHQsciksdGhpc30sci5wcm90b3R5cGUub2ZmPXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyPXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycz1yLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sMD09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXt9LHRoaXM7dmFyIHI9dGhpcy5fY2FsbGJhY2tzW3RdO2lmKCFyKXJldHVybiB0aGlzO2lmKDE9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbdF0sdGhpcztmb3IodmFyIG4sbz0wO288ci5sZW5ndGg7bysrKWlmKG49cltvXSxuPT09ZXx8bi5mbj09PWUpe3Iuc3BsaWNlKG8sMSk7YnJlYWt9cmV0dXJuIHRoaXN9LHIucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24odCl7dGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e307dmFyIGU9W10uc2xpY2UuY2FsbChhcmd1bWVudHMsMSkscj10aGlzLl9jYWxsYmFja3NbdF07aWYocil7cj1yLnNsaWNlKDApO2Zvcih2YXIgbj0wLG89ci5sZW5ndGg7bjxvOysrbilyW25dLmFwcGx5KHRoaXMsZSl9cmV0dXJuIHRoaXN9LHIucHJvdG90eXBlLmxpc3RlbmVycz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sdGhpcy5fY2FsbGJhY2tzW3RdfHxbXX0sci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiEhdGhpcy5saXN0ZW5lcnModCkubGVuZ3RofX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbih0KXt2YXIgbj1yKDE1KSxvPXIoMTYpO2UuZGVjb25zdHJ1Y3RQYWNrZXQ9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0KXtpZighdClyZXR1cm4gdDtpZihvKHQpKXt2YXIgaT17X3BsYWNlaG9sZGVyOiEwLG51bTpyLmxlbmd0aH07cmV0dXJuIHIucHVzaCh0KSxpfWlmKG4odCkpe2Zvcih2YXIgcz1uZXcgQXJyYXkodC5sZW5ndGgpLGE9MDthPHQubGVuZ3RoO2ErKylzW2FdPWUodFthXSk7cmV0dXJuIHN9aWYoXCJvYmplY3RcIj09dHlwZW9mIHQmJiEodCBpbnN0YW5jZW9mIERhdGUpKXt2YXIgcz17fTtmb3IodmFyIGMgaW4gdClzW2NdPWUodFtjXSk7cmV0dXJuIHN9cmV0dXJuIHR9dmFyIHI9W10saT10LmRhdGEscz10O3JldHVybiBzLmRhdGE9ZShpKSxzLmF0dGFjaG1lbnRzPXIubGVuZ3RoLHtwYWNrZXQ6cyxidWZmZXJzOnJ9fSxlLnJlY29uc3RydWN0UGFja2V0PWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9wbGFjZWhvbGRlcil7dmFyIG89ZVt0Lm51bV07cmV0dXJuIG99aWYobih0KSl7Zm9yKHZhciBpPTA7aTx0Lmxlbmd0aDtpKyspdFtpXT1yKHRbaV0pO3JldHVybiB0fWlmKHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0KXtmb3IodmFyIHMgaW4gdCl0W3NdPXIodFtzXSk7cmV0dXJuIHR9cmV0dXJuIHR9cmV0dXJuIHQuZGF0YT1yKHQuZGF0YSksdC5hdHRhY2htZW50cz12b2lkIDAsdH0sZS5yZW1vdmVCbG9icz1mdW5jdGlvbihlLHIpe2Z1bmN0aW9uIGkoZSxjLHUpe2lmKCFlKXJldHVybiBlO2lmKHQuQmxvYiYmZSBpbnN0YW5jZW9mIEJsb2J8fHQuRmlsZSYmZSBpbnN0YW5jZW9mIEZpbGUpe3MrKzt2YXIgaD1uZXcgRmlsZVJlYWRlcjtoLm9ubG9hZD1mdW5jdGlvbigpe3U/dVtjXT10aGlzLnJlc3VsdDphPXRoaXMucmVzdWx0LC0tc3x8cihhKX0saC5yZWFkQXNBcnJheUJ1ZmZlcihlKX1lbHNlIGlmKG4oZSkpZm9yKHZhciBwPTA7cDxlLmxlbmd0aDtwKyspaShlW3BdLHAsZSk7ZWxzZSBpZihlJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmIW8oZSkpZm9yKHZhciBmIGluIGUpaShlW2ZdLGYsZSl9dmFyIHM9MCxhPWU7aShhKSxzfHxyKGEpfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24odCl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9fSxmdW5jdGlvbih0LGUpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiByKHQpe3JldHVybiBlLkJ1ZmZlciYmZS5CdWZmZXIuaXNCdWZmZXIodCl8fGUuQXJyYXlCdWZmZXImJnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcn10LmV4cG9ydHM9cn0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXtyZXR1cm4gdGhpcyBpbnN0YW5jZW9mIG4/KHQmJlwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpvKHQpKSYmKGU9dCx0PXZvaWQgMCksZT1lfHx7fSxlLnBhdGg9ZS5wYXRofHxcIi9zb2NrZXQuaW9cIix0aGlzLm5zcHM9e30sdGhpcy5zdWJzPVtdLHRoaXMub3B0cz1lLHRoaXMucmVjb25uZWN0aW9uKGUucmVjb25uZWN0aW9uIT09ITEpLHRoaXMucmVjb25uZWN0aW9uQXR0ZW1wdHMoZS5yZWNvbm5lY3Rpb25BdHRlbXB0c3x8MS8wKSx0aGlzLnJlY29ubmVjdGlvbkRlbGF5KGUucmVjb25uZWN0aW9uRGVsYXl8fDFlMyksdGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heChlLnJlY29ubmVjdGlvbkRlbGF5TWF4fHw1ZTMpLHRoaXMucmFuZG9taXphdGlvbkZhY3RvcihlLnJhbmRvbWl6YXRpb25GYWN0b3J8fC41KSx0aGlzLmJhY2tvZmY9bmV3IGwoe21pbjp0aGlzLnJlY29ubmVjdGlvbkRlbGF5KCksbWF4OnRoaXMucmVjb25uZWN0aW9uRGVsYXlNYXgoKSxqaXR0ZXI6dGhpcy5yYW5kb21pemF0aW9uRmFjdG9yKCl9KSx0aGlzLnRpbWVvdXQobnVsbD09ZS50aW1lb3V0PzJlNDplLnRpbWVvdXQpLHRoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMudXJpPXQsdGhpcy5jb25uZWN0aW5nPVtdLHRoaXMubGFzdFBpbmc9bnVsbCx0aGlzLmVuY29kaW5nPSExLHRoaXMucGFja2V0QnVmZmVyPVtdLHRoaXMuZW5jb2Rlcj1uZXcgYy5FbmNvZGVyLHRoaXMuZGVjb2Rlcj1uZXcgYy5EZWNvZGVyLHRoaXMuYXV0b0Nvbm5lY3Q9ZS5hdXRvQ29ubmVjdCE9PSExLHZvaWQodGhpcy5hdXRvQ29ubmVjdCYmdGhpcy5vcGVuKCkpKTpuZXcgbih0LGUpfXZhciBvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LGk9cigxOCkscz1yKDQ0KSxhPXIoMzUpLGM9cig3KSx1PXIoNDYpLGg9cig0NykscD1yKDMpKFwic29ja2V0LmlvLWNsaWVudDptYW5hZ2VyXCIpLGY9cig0MiksbD1yKDQ4KSxkPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dC5leHBvcnRzPW4sbi5wcm90b3R5cGUuZW1pdEFsbD1mdW5jdGlvbigpe3RoaXMuZW1pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7Zm9yKHZhciB0IGluIHRoaXMubnNwcylkLmNhbGwodGhpcy5uc3BzLHQpJiZ0aGlzLm5zcHNbdF0uZW1pdC5hcHBseSh0aGlzLm5zcHNbdF0sYXJndW1lbnRzKX0sbi5wcm90b3R5cGUudXBkYXRlU29ja2V0SWRzPWZ1bmN0aW9uKCl7Zm9yKHZhciB0IGluIHRoaXMubnNwcylkLmNhbGwodGhpcy5uc3BzLHQpJiYodGhpcy5uc3BzW3RdLmlkPXRoaXMuZW5naW5lLmlkKX0sYShuLnByb3RvdHlwZSksbi5wcm90b3R5cGUucmVjb25uZWN0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZWNvbm5lY3Rpb249ISF0LHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbn0sbi5wcm90b3R5cGUucmVjb25uZWN0aW9uQXR0ZW1wdHM9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzPXQsdGhpcyk6dGhpcy5fcmVjb25uZWN0aW9uQXR0ZW1wdHN9LG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbkRlbGF5PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZWNvbm5lY3Rpb25EZWxheT10LHRoaXMuYmFja29mZiYmdGhpcy5iYWNrb2ZmLnNldE1pbih0KSx0aGlzKTp0aGlzLl9yZWNvbm5lY3Rpb25EZWxheX0sbi5wcm90b3R5cGUucmFuZG9taXphdGlvbkZhY3Rvcj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmFuZG9taXphdGlvbkZhY3Rvcj10LHRoaXMuYmFja29mZiYmdGhpcy5iYWNrb2ZmLnNldEppdHRlcih0KSx0aGlzKTp0aGlzLl9yYW5kb21pemF0aW9uRmFjdG9yfSxuLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25EZWxheU1heD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXg9dCx0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRNYXgodCksdGhpcyk6dGhpcy5fcmVjb25uZWN0aW9uRGVsYXlNYXh9LG4ucHJvdG90eXBlLnRpbWVvdXQ9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3RpbWVvdXQ9dCx0aGlzKTp0aGlzLl90aW1lb3V0fSxuLnByb3RvdHlwZS5tYXliZVJlY29ubmVjdE9uT3Blbj1mdW5jdGlvbigpeyF0aGlzLnJlY29ubmVjdGluZyYmdGhpcy5fcmVjb25uZWN0aW9uJiYwPT09dGhpcy5iYWNrb2ZmLmF0dGVtcHRzJiZ0aGlzLnJlY29ubmVjdCgpfSxuLnByb3RvdHlwZS5vcGVuPW4ucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24odCxlKXtpZihwKFwicmVhZHlTdGF0ZSAlc1wiLHRoaXMucmVhZHlTdGF0ZSksfnRoaXMucmVhZHlTdGF0ZS5pbmRleE9mKFwib3BlblwiKSlyZXR1cm4gdGhpcztwKFwib3BlbmluZyAlc1wiLHRoaXMudXJpKSx0aGlzLmVuZ2luZT1pKHRoaXMudXJpLHRoaXMub3B0cyk7dmFyIHI9dGhpcy5lbmdpbmUsbj10aGlzO3RoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIix0aGlzLnNraXBSZWNvbm5lY3Q9ITE7dmFyIG89dShyLFwib3BlblwiLGZ1bmN0aW9uKCl7bi5vbm9wZW4oKSx0JiZ0KCl9KSxzPXUocixcImVycm9yXCIsZnVuY3Rpb24oZSl7aWYocChcImNvbm5lY3RfZXJyb3JcIiksbi5jbGVhbnVwKCksbi5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsbi5lbWl0QWxsKFwiY29ubmVjdF9lcnJvclwiLGUpLHQpe3ZhciByPW5ldyBFcnJvcihcIkNvbm5lY3Rpb24gZXJyb3JcIik7ci5kYXRhPWUsdChyKX1lbHNlIG4ubWF5YmVSZWNvbm5lY3RPbk9wZW4oKX0pO2lmKCExIT09dGhpcy5fdGltZW91dCl7dmFyIGE9dGhpcy5fdGltZW91dDtwKFwiY29ubmVjdCBhdHRlbXB0IHdpbGwgdGltZW91dCBhZnRlciAlZFwiLGEpO3ZhciBjPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtwKFwiY29ubmVjdCBhdHRlbXB0IHRpbWVkIG91dCBhZnRlciAlZFwiLGEpLG8uZGVzdHJveSgpLHIuY2xvc2UoKSxyLmVtaXQoXCJlcnJvclwiLFwidGltZW91dFwiKSxuLmVtaXRBbGwoXCJjb25uZWN0X3RpbWVvdXRcIixhKX0sYSk7dGhpcy5zdWJzLnB1c2goe2Rlc3Ryb3k6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoYyl9fSl9cmV0dXJuIHRoaXMuc3Vicy5wdXNoKG8pLHRoaXMuc3Vicy5wdXNoKHMpLHRoaXN9LG4ucHJvdG90eXBlLm9ub3Blbj1mdW5jdGlvbigpe3AoXCJvcGVuXCIpLHRoaXMuY2xlYW51cCgpLHRoaXMucmVhZHlTdGF0ZT1cIm9wZW5cIix0aGlzLmVtaXQoXCJvcGVuXCIpO3ZhciB0PXRoaXMuZW5naW5lO3RoaXMuc3Vicy5wdXNoKHUodCxcImRhdGFcIixoKHRoaXMsXCJvbmRhdGFcIikpKSx0aGlzLnN1YnMucHVzaCh1KHQsXCJwaW5nXCIsaCh0aGlzLFwib25waW5nXCIpKSksdGhpcy5zdWJzLnB1c2godSh0LFwicG9uZ1wiLGgodGhpcyxcIm9ucG9uZ1wiKSkpLHRoaXMuc3Vicy5wdXNoKHUodCxcImVycm9yXCIsaCh0aGlzLFwib25lcnJvclwiKSkpLHRoaXMuc3Vicy5wdXNoKHUodCxcImNsb3NlXCIsaCh0aGlzLFwib25jbG9zZVwiKSkpLHRoaXMuc3Vicy5wdXNoKHUodGhpcy5kZWNvZGVyLFwiZGVjb2RlZFwiLGgodGhpcyxcIm9uZGVjb2RlZFwiKSkpfSxuLnByb3RvdHlwZS5vbnBpbmc9ZnVuY3Rpb24oKXt0aGlzLmxhc3RQaW5nPW5ldyBEYXRlLHRoaXMuZW1pdEFsbChcInBpbmdcIil9LG4ucHJvdG90eXBlLm9ucG9uZz1mdW5jdGlvbigpe3RoaXMuZW1pdEFsbChcInBvbmdcIixuZXcgRGF0ZS10aGlzLmxhc3RQaW5nKX0sbi5wcm90b3R5cGUub25kYXRhPWZ1bmN0aW9uKHQpe3RoaXMuZGVjb2Rlci5hZGQodCl9LG4ucHJvdG90eXBlLm9uZGVjb2RlZD1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJwYWNrZXRcIix0KX0sbi5wcm90b3R5cGUub25lcnJvcj1mdW5jdGlvbih0KXtwKFwiZXJyb3JcIix0KSx0aGlzLmVtaXRBbGwoXCJlcnJvclwiLHQpfSxuLnByb3RvdHlwZS5zb2NrZXQ9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7fmYoby5jb25uZWN0aW5nLG4pfHxvLmNvbm5lY3RpbmcucHVzaChuKX12YXIgbj10aGlzLm5zcHNbdF07aWYoIW4pe249bmV3IHModGhpcyx0LGUpLHRoaXMubnNwc1t0XT1uO3ZhciBvPXRoaXM7bi5vbihcImNvbm5lY3RpbmdcIixyKSxuLm9uKFwiY29ubmVjdFwiLGZ1bmN0aW9uKCl7bi5pZD1vLmVuZ2luZS5pZH0pLHRoaXMuYXV0b0Nvbm5lY3QmJnIoKX1yZXR1cm4gbn0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbih0KXt2YXIgZT1mKHRoaXMuY29ubmVjdGluZyx0KTt+ZSYmdGhpcy5jb25uZWN0aW5nLnNwbGljZShlLDEpLHRoaXMuY29ubmVjdGluZy5sZW5ndGh8fHRoaXMuY2xvc2UoKX0sbi5wcm90b3R5cGUucGFja2V0PWZ1bmN0aW9uKHQpe3AoXCJ3cml0aW5nIHBhY2tldCAlalwiLHQpO3ZhciBlPXRoaXM7dC5xdWVyeSYmMD09PXQudHlwZSYmKHQubnNwKz1cIj9cIit0LnF1ZXJ5KSxlLmVuY29kaW5nP2UucGFja2V0QnVmZmVyLnB1c2godCk6KGUuZW5jb2Rpbmc9ITAsdGhpcy5lbmNvZGVyLmVuY29kZSh0LGZ1bmN0aW9uKHIpe2Zvcih2YXIgbj0wO248ci5sZW5ndGg7bisrKWUuZW5naW5lLndyaXRlKHJbbl0sdC5vcHRpb25zKTtlLmVuY29kaW5nPSExLGUucHJvY2Vzc1BhY2tldFF1ZXVlKCl9KSl9LG4ucHJvdG90eXBlLnByb2Nlc3NQYWNrZXRRdWV1ZT1mdW5jdGlvbigpe2lmKHRoaXMucGFja2V0QnVmZmVyLmxlbmd0aD4wJiYhdGhpcy5lbmNvZGluZyl7dmFyIHQ9dGhpcy5wYWNrZXRCdWZmZXIuc2hpZnQoKTt0aGlzLnBhY2tldCh0KX19LG4ucHJvdG90eXBlLmNsZWFudXA9ZnVuY3Rpb24oKXtwKFwiY2xlYW51cFwiKTtmb3IodmFyIHQ9dGhpcy5zdWJzLmxlbmd0aCxlPTA7ZTx0O2UrKyl7dmFyIHI9dGhpcy5zdWJzLnNoaWZ0KCk7ci5kZXN0cm95KCl9dGhpcy5wYWNrZXRCdWZmZXI9W10sdGhpcy5lbmNvZGluZz0hMSx0aGlzLmxhc3RQaW5nPW51bGwsdGhpcy5kZWNvZGVyLmRlc3Ryb3koKX0sbi5wcm90b3R5cGUuY2xvc2U9bi5wcm90b3R5cGUuZGlzY29ubmVjdD1mdW5jdGlvbigpe3AoXCJkaXNjb25uZWN0XCIpLHRoaXMuc2tpcFJlY29ubmVjdD0hMCx0aGlzLnJlY29ubmVjdGluZz0hMSxcIm9wZW5pbmdcIj09PXRoaXMucmVhZHlTdGF0ZSYmdGhpcy5jbGVhbnVwKCksdGhpcy5iYWNrb2ZmLnJlc2V0KCksdGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsdGhpcy5lbmdpbmUmJnRoaXMuZW5naW5lLmNsb3NlKCl9LG4ucHJvdG90eXBlLm9uY2xvc2U9ZnVuY3Rpb24odCl7cChcIm9uY2xvc2VcIiksdGhpcy5jbGVhbnVwKCksdGhpcy5iYWNrb2ZmLnJlc2V0KCksdGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsdGhpcy5lbWl0KFwiY2xvc2VcIix0KSx0aGlzLl9yZWNvbm5lY3Rpb24mJiF0aGlzLnNraXBSZWNvbm5lY3QmJnRoaXMucmVjb25uZWN0KCl9LG4ucHJvdG90eXBlLnJlY29ubmVjdD1mdW5jdGlvbigpe2lmKHRoaXMucmVjb25uZWN0aW5nfHx0aGlzLnNraXBSZWNvbm5lY3QpcmV0dXJuIHRoaXM7dmFyIHQ9dGhpcztpZih0aGlzLmJhY2tvZmYuYXR0ZW1wdHM+PXRoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzKXAoXCJyZWNvbm5lY3QgZmFpbGVkXCIpLHRoaXMuYmFja29mZi5yZXNldCgpLHRoaXMuZW1pdEFsbChcInJlY29ubmVjdF9mYWlsZWRcIiksdGhpcy5yZWNvbm5lY3Rpbmc9ITE7ZWxzZXt2YXIgZT10aGlzLmJhY2tvZmYuZHVyYXRpb24oKTtwKFwid2lsbCB3YWl0ICVkbXMgYmVmb3JlIHJlY29ubmVjdCBhdHRlbXB0XCIsZSksdGhpcy5yZWNvbm5lY3Rpbmc9ITA7dmFyIHI9c2V0VGltZW91dChmdW5jdGlvbigpe3Quc2tpcFJlY29ubmVjdHx8KHAoXCJhdHRlbXB0aW5nIHJlY29ubmVjdFwiKSx0LmVtaXRBbGwoXCJyZWNvbm5lY3RfYXR0ZW1wdFwiLHQuYmFja29mZi5hdHRlbXB0cyksdC5lbWl0QWxsKFwicmVjb25uZWN0aW5nXCIsdC5iYWNrb2ZmLmF0dGVtcHRzKSx0LnNraXBSZWNvbm5lY3R8fHQub3BlbihmdW5jdGlvbihlKXtlPyhwKFwicmVjb25uZWN0IGF0dGVtcHQgZXJyb3JcIiksdC5yZWNvbm5lY3Rpbmc9ITEsdC5yZWNvbm5lY3QoKSx0LmVtaXRBbGwoXCJyZWNvbm5lY3RfZXJyb3JcIixlLmRhdGEpKToocChcInJlY29ubmVjdCBzdWNjZXNzXCIpLHQub25yZWNvbm5lY3QoKSl9KSl9LGUpO3RoaXMuc3Vicy5wdXNoKHtkZXN0cm95OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpfX0pfX0sbi5wcm90b3R5cGUub25yZWNvbm5lY3Q9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLmJhY2tvZmYuYXR0ZW1wdHM7dGhpcy5yZWNvbm5lY3Rpbmc9ITEsdGhpcy5iYWNrb2ZmLnJlc2V0KCksdGhpcy51cGRhdGVTb2NrZXRJZHMoKSx0aGlzLmVtaXRBbGwoXCJyZWNvbm5lY3RcIix0KX19LGZ1bmN0aW9uKHQsZSxyKXt0LmV4cG9ydHM9cigxOSl9LGZ1bmN0aW9uKHQsZSxyKXt0LmV4cG9ydHM9cigyMCksdC5leHBvcnRzLnBhcnNlcj1yKDI3KX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQscil7aWYoISh0aGlzIGluc3RhbmNlb2YgbikpcmV0dXJuIG5ldyBuKHQscik7cj1yfHx7fSx0JiZcIm9iamVjdFwiPT10eXBlb2YgdCYmKHI9dCx0PW51bGwpLHQ/KHQ9aCh0KSxyLmhvc3RuYW1lPXQuaG9zdCxyLnNlY3VyZT1cImh0dHBzXCI9PT10LnByb3RvY29sfHxcIndzc1wiPT09dC5wcm90b2NvbCxyLnBvcnQ9dC5wb3J0LHQucXVlcnkmJihyLnF1ZXJ5PXQucXVlcnkpKTpyLmhvc3QmJihyLmhvc3RuYW1lPWgoci5ob3N0KS5ob3N0KSxcbnRoaXMuc2VjdXJlPW51bGwhPXIuc2VjdXJlP3Iuc2VjdXJlOmUubG9jYXRpb24mJlwiaHR0cHM6XCI9PT1sb2NhdGlvbi5wcm90b2NvbCxyLmhvc3RuYW1lJiYhci5wb3J0JiYoci5wb3J0PXRoaXMuc2VjdXJlP1wiNDQzXCI6XCI4MFwiKSx0aGlzLmFnZW50PXIuYWdlbnR8fCExLHRoaXMuaG9zdG5hbWU9ci5ob3N0bmFtZXx8KGUubG9jYXRpb24/bG9jYXRpb24uaG9zdG5hbWU6XCJsb2NhbGhvc3RcIiksdGhpcy5wb3J0PXIucG9ydHx8KGUubG9jYXRpb24mJmxvY2F0aW9uLnBvcnQ/bG9jYXRpb24ucG9ydDp0aGlzLnNlY3VyZT80NDM6ODApLHRoaXMucXVlcnk9ci5xdWVyeXx8e30sXCJzdHJpbmdcIj09dHlwZW9mIHRoaXMucXVlcnkmJih0aGlzLnF1ZXJ5PWYuZGVjb2RlKHRoaXMucXVlcnkpKSx0aGlzLnVwZ3JhZGU9ITEhPT1yLnVwZ3JhZGUsdGhpcy5wYXRoPShyLnBhdGh8fFwiL2VuZ2luZS5pb1wiKS5yZXBsYWNlKC9cXC8kLyxcIlwiKStcIi9cIix0aGlzLmZvcmNlSlNPTlA9ISFyLmZvcmNlSlNPTlAsdGhpcy5qc29ucD0hMSE9PXIuanNvbnAsdGhpcy5mb3JjZUJhc2U2ND0hIXIuZm9yY2VCYXNlNjQsdGhpcy5lbmFibGVzWERSPSEhci5lbmFibGVzWERSLHRoaXMudGltZXN0YW1wUGFyYW09ci50aW1lc3RhbXBQYXJhbXx8XCJ0XCIsdGhpcy50aW1lc3RhbXBSZXF1ZXN0cz1yLnRpbWVzdGFtcFJlcXVlc3RzLHRoaXMudHJhbnNwb3J0cz1yLnRyYW5zcG9ydHN8fFtcInBvbGxpbmdcIixcIndlYnNvY2tldFwiXSx0aGlzLnJlYWR5U3RhdGU9XCJcIix0aGlzLndyaXRlQnVmZmVyPVtdLHRoaXMucHJldkJ1ZmZlckxlbj0wLHRoaXMucG9saWN5UG9ydD1yLnBvbGljeVBvcnR8fDg0Myx0aGlzLnJlbWVtYmVyVXBncmFkZT1yLnJlbWVtYmVyVXBncmFkZXx8ITEsdGhpcy5iaW5hcnlUeXBlPW51bGwsdGhpcy5vbmx5QmluYXJ5VXBncmFkZXM9ci5vbmx5QmluYXJ5VXBncmFkZXMsdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZT0hMSE9PXIucGVyTWVzc2FnZURlZmxhdGUmJihyLnBlck1lc3NhZ2VEZWZsYXRlfHx7fSksITA9PT10aGlzLnBlck1lc3NhZ2VEZWZsYXRlJiYodGhpcy5wZXJNZXNzYWdlRGVmbGF0ZT17fSksdGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSYmbnVsbD09dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQmJih0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZD0xMDI0KSx0aGlzLnBmeD1yLnBmeHx8bnVsbCx0aGlzLmtleT1yLmtleXx8bnVsbCx0aGlzLnBhc3NwaHJhc2U9ci5wYXNzcGhyYXNlfHxudWxsLHRoaXMuY2VydD1yLmNlcnR8fG51bGwsdGhpcy5jYT1yLmNhfHxudWxsLHRoaXMuY2lwaGVycz1yLmNpcGhlcnN8fG51bGwsdGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ9dm9pZCAwPT09ci5yZWplY3RVbmF1dGhvcml6ZWQ/bnVsbDpyLnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmZvcmNlTm9kZT0hIXIuZm9yY2VOb2RlO3ZhciBvPVwib2JqZWN0XCI9PXR5cGVvZiBlJiZlO28uZ2xvYmFsPT09byYmKHIuZXh0cmFIZWFkZXJzJiZPYmplY3Qua2V5cyhyLmV4dHJhSGVhZGVycykubGVuZ3RoPjAmJih0aGlzLmV4dHJhSGVhZGVycz1yLmV4dHJhSGVhZGVycyksci5sb2NhbEFkZHJlc3MmJih0aGlzLmxvY2FsQWRkcmVzcz1yLmxvY2FsQWRkcmVzcykpLHRoaXMuaWQ9bnVsbCx0aGlzLnVwZ3JhZGVzPW51bGwsdGhpcy5waW5nSW50ZXJ2YWw9bnVsbCx0aGlzLnBpbmdUaW1lb3V0PW51bGwsdGhpcy5waW5nSW50ZXJ2YWxUaW1lcj1udWxsLHRoaXMucGluZ1RpbWVvdXRUaW1lcj1udWxsLHRoaXMub3BlbigpfWZ1bmN0aW9uIG8odCl7dmFyIGU9e307Zm9yKHZhciByIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShyKSYmKGVbcl09dFtyXSk7cmV0dXJuIGV9dmFyIGk9cigyMSkscz1yKDM1KSxhPXIoMykoXCJlbmdpbmUuaW8tY2xpZW50OnNvY2tldFwiKSxjPXIoNDIpLHU9cigyNyksaD1yKDIpLHA9cig0MyksZj1yKDM2KTt0LmV4cG9ydHM9bixuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz0hMSxzKG4ucHJvdG90eXBlKSxuLnByb3RvY29sPXUucHJvdG9jb2wsbi5Tb2NrZXQ9bixuLlRyYW5zcG9ydD1yKDI2KSxuLnRyYW5zcG9ydHM9cigyMSksbi5wYXJzZXI9cigyNyksbi5wcm90b3R5cGUuY3JlYXRlVHJhbnNwb3J0PWZ1bmN0aW9uKHQpe2EoJ2NyZWF0aW5nIHRyYW5zcG9ydCBcIiVzXCInLHQpO3ZhciBlPW8odGhpcy5xdWVyeSk7ZS5FSU89dS5wcm90b2NvbCxlLnRyYW5zcG9ydD10LHRoaXMuaWQmJihlLnNpZD10aGlzLmlkKTt2YXIgcj1uZXcgaVt0XSh7YWdlbnQ6dGhpcy5hZ2VudCxob3N0bmFtZTp0aGlzLmhvc3RuYW1lLHBvcnQ6dGhpcy5wb3J0LHNlY3VyZTp0aGlzLnNlY3VyZSxwYXRoOnRoaXMucGF0aCxxdWVyeTplLGZvcmNlSlNPTlA6dGhpcy5mb3JjZUpTT05QLGpzb25wOnRoaXMuanNvbnAsZm9yY2VCYXNlNjQ6dGhpcy5mb3JjZUJhc2U2NCxlbmFibGVzWERSOnRoaXMuZW5hYmxlc1hEUix0aW1lc3RhbXBSZXF1ZXN0czp0aGlzLnRpbWVzdGFtcFJlcXVlc3RzLHRpbWVzdGFtcFBhcmFtOnRoaXMudGltZXN0YW1wUGFyYW0scG9saWN5UG9ydDp0aGlzLnBvbGljeVBvcnQsc29ja2V0OnRoaXMscGZ4OnRoaXMucGZ4LGtleTp0aGlzLmtleSxwYXNzcGhyYXNlOnRoaXMucGFzc3BocmFzZSxjZXJ0OnRoaXMuY2VydCxjYTp0aGlzLmNhLGNpcGhlcnM6dGhpcy5jaXBoZXJzLHJlamVjdFVuYXV0aG9yaXplZDp0aGlzLnJlamVjdFVuYXV0aG9yaXplZCxwZXJNZXNzYWdlRGVmbGF0ZTp0aGlzLnBlck1lc3NhZ2VEZWZsYXRlLGV4dHJhSGVhZGVyczp0aGlzLmV4dHJhSGVhZGVycyxmb3JjZU5vZGU6dGhpcy5mb3JjZU5vZGUsbG9jYWxBZGRyZXNzOnRoaXMubG9jYWxBZGRyZXNzfSk7cmV0dXJuIHJ9LG4ucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oKXt2YXIgdDtpZih0aGlzLnJlbWVtYmVyVXBncmFkZSYmbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3MmJnRoaXMudHJhbnNwb3J0cy5pbmRleE9mKFwid2Vic29ja2V0XCIpIT09LTEpdD1cIndlYnNvY2tldFwiO2Vsc2V7aWYoMD09PXRoaXMudHJhbnNwb3J0cy5sZW5ndGgpe3ZhciBlPXRoaXM7cmV0dXJuIHZvaWQgc2V0VGltZW91dChmdW5jdGlvbigpe2UuZW1pdChcImVycm9yXCIsXCJObyB0cmFuc3BvcnRzIGF2YWlsYWJsZVwiKX0sMCl9dD10aGlzLnRyYW5zcG9ydHNbMF19dGhpcy5yZWFkeVN0YXRlPVwib3BlbmluZ1wiO3RyeXt0PXRoaXMuY3JlYXRlVHJhbnNwb3J0KHQpfWNhdGNoKHQpe3JldHVybiB0aGlzLnRyYW5zcG9ydHMuc2hpZnQoKSx2b2lkIHRoaXMub3BlbigpfXQub3BlbigpLHRoaXMuc2V0VHJhbnNwb3J0KHQpfSxuLnByb3RvdHlwZS5zZXRUcmFuc3BvcnQ9ZnVuY3Rpb24odCl7YShcInNldHRpbmcgdHJhbnNwb3J0ICVzXCIsdC5uYW1lKTt2YXIgZT10aGlzO3RoaXMudHJhbnNwb3J0JiYoYShcImNsZWFyaW5nIGV4aXN0aW5nIHRyYW5zcG9ydCAlc1wiLHRoaXMudHJhbnNwb3J0Lm5hbWUpLHRoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycygpKSx0aGlzLnRyYW5zcG9ydD10LHQub24oXCJkcmFpblwiLGZ1bmN0aW9uKCl7ZS5vbkRyYWluKCl9KS5vbihcInBhY2tldFwiLGZ1bmN0aW9uKHQpe2Uub25QYWNrZXQodCl9KS5vbihcImVycm9yXCIsZnVuY3Rpb24odCl7ZS5vbkVycm9yKHQpfSkub24oXCJjbG9zZVwiLGZ1bmN0aW9uKCl7ZS5vbkNsb3NlKFwidHJhbnNwb3J0IGNsb3NlXCIpfSl9LG4ucHJvdG90eXBlLnByb2JlPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoKXtpZihmLm9ubHlCaW5hcnlVcGdyYWRlcyl7dmFyIGU9IXRoaXMuc3VwcG9ydHNCaW5hcnkmJmYudHJhbnNwb3J0LnN1cHBvcnRzQmluYXJ5O3A9cHx8ZX1wfHwoYSgncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBvcGVuZWQnLHQpLGguc2VuZChbe3R5cGU6XCJwaW5nXCIsZGF0YTpcInByb2JlXCJ9XSksaC5vbmNlKFwicGFja2V0XCIsZnVuY3Rpb24oZSl7aWYoIXApaWYoXCJwb25nXCI9PT1lLnR5cGUmJlwicHJvYmVcIj09PWUuZGF0YSl7aWYoYSgncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBwb25nJyx0KSxmLnVwZ3JhZGluZz0hMCxmLmVtaXQoXCJ1cGdyYWRpbmdcIixoKSwhaClyZXR1cm47bi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9XCJ3ZWJzb2NrZXRcIj09PWgubmFtZSxhKCdwYXVzaW5nIGN1cnJlbnQgdHJhbnNwb3J0IFwiJXNcIicsZi50cmFuc3BvcnQubmFtZSksZi50cmFuc3BvcnQucGF1c2UoZnVuY3Rpb24oKXtwfHxcImNsb3NlZFwiIT09Zi5yZWFkeVN0YXRlJiYoYShcImNoYW5naW5nIHRyYW5zcG9ydCBhbmQgc2VuZGluZyB1cGdyYWRlIHBhY2tldFwiKSx1KCksZi5zZXRUcmFuc3BvcnQoaCksaC5zZW5kKFt7dHlwZTpcInVwZ3JhZGVcIn1dKSxmLmVtaXQoXCJ1cGdyYWRlXCIsaCksaD1udWxsLGYudXBncmFkaW5nPSExLGYuZmx1c2goKSl9KX1lbHNle2EoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgZmFpbGVkJyx0KTt2YXIgcj1uZXcgRXJyb3IoXCJwcm9iZSBlcnJvclwiKTtyLnRyYW5zcG9ydD1oLm5hbWUsZi5lbWl0KFwidXBncmFkZUVycm9yXCIscil9fSkpfWZ1bmN0aW9uIHIoKXtwfHwocD0hMCx1KCksaC5jbG9zZSgpLGg9bnVsbCl9ZnVuY3Rpb24gbyhlKXt2YXIgbj1uZXcgRXJyb3IoXCJwcm9iZSBlcnJvcjogXCIrZSk7bi50cmFuc3BvcnQ9aC5uYW1lLHIoKSxhKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIGZhaWxlZCBiZWNhdXNlIG9mIGVycm9yOiAlcycsdCxlKSxmLmVtaXQoXCJ1cGdyYWRlRXJyb3JcIixuKX1mdW5jdGlvbiBpKCl7byhcInRyYW5zcG9ydCBjbG9zZWRcIil9ZnVuY3Rpb24gcygpe28oXCJzb2NrZXQgY2xvc2VkXCIpfWZ1bmN0aW9uIGModCl7aCYmdC5uYW1lIT09aC5uYW1lJiYoYSgnXCIlc1wiIHdvcmtzIC0gYWJvcnRpbmcgXCIlc1wiJyx0Lm5hbWUsaC5uYW1lKSxyKCkpfWZ1bmN0aW9uIHUoKXtoLnJlbW92ZUxpc3RlbmVyKFwib3BlblwiLGUpLGgucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLG8pLGgucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLGkpLGYucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLHMpLGYucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRpbmdcIixjKX1hKCdwcm9iaW5nIHRyYW5zcG9ydCBcIiVzXCInLHQpO3ZhciBoPXRoaXMuY3JlYXRlVHJhbnNwb3J0KHQse3Byb2JlOjF9KSxwPSExLGY9dGhpcztuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz0hMSxoLm9uY2UoXCJvcGVuXCIsZSksaC5vbmNlKFwiZXJyb3JcIixvKSxoLm9uY2UoXCJjbG9zZVwiLGkpLHRoaXMub25jZShcImNsb3NlXCIscyksdGhpcy5vbmNlKFwidXBncmFkaW5nXCIsYyksaC5vcGVuKCl9LG4ucHJvdG90eXBlLm9uT3Blbj1mdW5jdGlvbigpe2lmKGEoXCJzb2NrZXQgb3BlblwiKSx0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9XCJ3ZWJzb2NrZXRcIj09PXRoaXMudHJhbnNwb3J0Lm5hbWUsdGhpcy5lbWl0KFwib3BlblwiKSx0aGlzLmZsdXNoKCksXCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGUmJnRoaXMudXBncmFkZSYmdGhpcy50cmFuc3BvcnQucGF1c2Upe2EoXCJzdGFydGluZyB1cGdyYWRlIHByb2Jlc1wiKTtmb3IodmFyIHQ9MCxlPXRoaXMudXBncmFkZXMubGVuZ3RoO3Q8ZTt0KyspdGhpcy5wcm9iZSh0aGlzLnVwZ3JhZGVzW3RdKX19LG4ucHJvdG90eXBlLm9uUGFja2V0PWZ1bmN0aW9uKHQpe2lmKFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlfHxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJjbG9zaW5nXCI9PT10aGlzLnJlYWR5U3RhdGUpc3dpdGNoKGEoJ3NvY2tldCByZWNlaXZlOiB0eXBlIFwiJXNcIiwgZGF0YSBcIiVzXCInLHQudHlwZSx0LmRhdGEpLHRoaXMuZW1pdChcInBhY2tldFwiLHQpLHRoaXMuZW1pdChcImhlYXJ0YmVhdFwiKSx0LnR5cGUpe2Nhc2VcIm9wZW5cIjp0aGlzLm9uSGFuZHNoYWtlKHAodC5kYXRhKSk7YnJlYWs7Y2FzZVwicG9uZ1wiOnRoaXMuc2V0UGluZygpLHRoaXMuZW1pdChcInBvbmdcIik7YnJlYWs7Y2FzZVwiZXJyb3JcIjp2YXIgZT1uZXcgRXJyb3IoXCJzZXJ2ZXIgZXJyb3JcIik7ZS5jb2RlPXQuZGF0YSx0aGlzLm9uRXJyb3IoZSk7YnJlYWs7Y2FzZVwibWVzc2FnZVwiOnRoaXMuZW1pdChcImRhdGFcIix0LmRhdGEpLHRoaXMuZW1pdChcIm1lc3NhZ2VcIix0LmRhdGEpfWVsc2UgYSgncGFja2V0IHJlY2VpdmVkIHdpdGggc29ja2V0IHJlYWR5U3RhdGUgXCIlc1wiJyx0aGlzLnJlYWR5U3RhdGUpfSxuLnByb3RvdHlwZS5vbkhhbmRzaGFrZT1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJoYW5kc2hha2VcIix0KSx0aGlzLmlkPXQuc2lkLHRoaXMudHJhbnNwb3J0LnF1ZXJ5LnNpZD10LnNpZCx0aGlzLnVwZ3JhZGVzPXRoaXMuZmlsdGVyVXBncmFkZXModC51cGdyYWRlcyksdGhpcy5waW5nSW50ZXJ2YWw9dC5waW5nSW50ZXJ2YWwsdGhpcy5waW5nVGltZW91dD10LnBpbmdUaW1lb3V0LHRoaXMub25PcGVuKCksXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmKHRoaXMuc2V0UGluZygpLHRoaXMucmVtb3ZlTGlzdGVuZXIoXCJoZWFydGJlYXRcIix0aGlzLm9uSGVhcnRiZWF0KSx0aGlzLm9uKFwiaGVhcnRiZWF0XCIsdGhpcy5vbkhlYXJ0YmVhdCkpfSxuLnByb3RvdHlwZS5vbkhlYXJ0YmVhdD1mdW5jdGlvbih0KXtjbGVhclRpbWVvdXQodGhpcy5waW5nVGltZW91dFRpbWVyKTt2YXIgZT10aGlzO2UucGluZ1RpbWVvdXRUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XCJjbG9zZWRcIiE9PWUucmVhZHlTdGF0ZSYmZS5vbkNsb3NlKFwicGluZyB0aW1lb3V0XCIpfSx0fHxlLnBpbmdJbnRlcnZhbCtlLnBpbmdUaW1lb3V0KX0sbi5wcm90b3R5cGUuc2V0UGluZz1mdW5jdGlvbigpe3ZhciB0PXRoaXM7Y2xlYXJUaW1lb3V0KHQucGluZ0ludGVydmFsVGltZXIpLHQucGluZ0ludGVydmFsVGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2EoXCJ3cml0aW5nIHBpbmcgcGFja2V0IC0gZXhwZWN0aW5nIHBvbmcgd2l0aGluICVzbXNcIix0LnBpbmdUaW1lb3V0KSx0LnBpbmcoKSx0Lm9uSGVhcnRiZWF0KHQucGluZ1RpbWVvdXQpfSx0LnBpbmdJbnRlcnZhbCl9LG4ucHJvdG90eXBlLnBpbmc9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3RoaXMuc2VuZFBhY2tldChcInBpbmdcIixmdW5jdGlvbigpe3QuZW1pdChcInBpbmdcIil9KX0sbi5wcm90b3R5cGUub25EcmFpbj1mdW5jdGlvbigpe3RoaXMud3JpdGVCdWZmZXIuc3BsaWNlKDAsdGhpcy5wcmV2QnVmZmVyTGVuKSx0aGlzLnByZXZCdWZmZXJMZW49MCwwPT09dGhpcy53cml0ZUJ1ZmZlci5sZW5ndGg/dGhpcy5lbWl0KFwiZHJhaW5cIik6dGhpcy5mbHVzaCgpfSxuLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe1wiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJnRoaXMudHJhbnNwb3J0LndyaXRhYmxlJiYhdGhpcy51cGdyYWRpbmcmJnRoaXMud3JpdGVCdWZmZXIubGVuZ3RoJiYoYShcImZsdXNoaW5nICVkIHBhY2tldHMgaW4gc29ja2V0XCIsdGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgpLHRoaXMudHJhbnNwb3J0LnNlbmQodGhpcy53cml0ZUJ1ZmZlciksdGhpcy5wcmV2QnVmZmVyTGVuPXRoaXMud3JpdGVCdWZmZXIubGVuZ3RoLHRoaXMuZW1pdChcImZsdXNoXCIpKX0sbi5wcm90b3R5cGUud3JpdGU9bi5wcm90b3R5cGUuc2VuZD1mdW5jdGlvbih0LGUscil7cmV0dXJuIHRoaXMuc2VuZFBhY2tldChcIm1lc3NhZ2VcIix0LGUsciksdGhpc30sbi5wcm90b3R5cGUuc2VuZFBhY2tldD1mdW5jdGlvbih0LGUscixuKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiYobj1lLGU9dm9pZCAwKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCksXCJjbG9zaW5nXCIhPT10aGlzLnJlYWR5U3RhdGUmJlwiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUpe3I9cnx8e30sci5jb21wcmVzcz0hMSE9PXIuY29tcHJlc3M7dmFyIG89e3R5cGU6dCxkYXRhOmUsb3B0aW9uczpyfTt0aGlzLmVtaXQoXCJwYWNrZXRDcmVhdGVcIixvKSx0aGlzLndyaXRlQnVmZmVyLnB1c2gobyksbiYmdGhpcy5vbmNlKFwiZmx1c2hcIixuKSx0aGlzLmZsdXNoKCl9fSxuLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtuLm9uQ2xvc2UoXCJmb3JjZWQgY2xvc2VcIiksYShcInNvY2tldCBjbG9zaW5nIC0gdGVsbGluZyB0cmFuc3BvcnQgdG8gY2xvc2VcIiksbi50cmFuc3BvcnQuY2xvc2UoKX1mdW5jdGlvbiBlKCl7bi5yZW1vdmVMaXN0ZW5lcihcInVwZ3JhZGVcIixlKSxuLnJlbW92ZUxpc3RlbmVyKFwidXBncmFkZUVycm9yXCIsZSksdCgpfWZ1bmN0aW9uIHIoKXtuLm9uY2UoXCJ1cGdyYWRlXCIsZSksbi5vbmNlKFwidXBncmFkZUVycm9yXCIsZSl9aWYoXCJvcGVuaW5nXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlKXt0aGlzLnJlYWR5U3RhdGU9XCJjbG9zaW5nXCI7dmFyIG49dGhpczt0aGlzLndyaXRlQnVmZmVyLmxlbmd0aD90aGlzLm9uY2UoXCJkcmFpblwiLGZ1bmN0aW9uKCl7dGhpcy51cGdyYWRpbmc/cigpOnQoKX0pOnRoaXMudXBncmFkaW5nP3IoKTp0KCl9cmV0dXJuIHRoaXN9LG4ucHJvdG90eXBlLm9uRXJyb3I9ZnVuY3Rpb24odCl7YShcInNvY2tldCBlcnJvciAlalwiLHQpLG4ucHJpb3JXZWJzb2NrZXRTdWNjZXNzPSExLHRoaXMuZW1pdChcImVycm9yXCIsdCksdGhpcy5vbkNsb3NlKFwidHJhbnNwb3J0IGVycm9yXCIsdCl9LG4ucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24odCxlKXtpZihcIm9wZW5pbmdcIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwiY2xvc2luZ1wiPT09dGhpcy5yZWFkeVN0YXRlKXthKCdzb2NrZXQgY2xvc2Ugd2l0aCByZWFzb246IFwiJXNcIicsdCk7dmFyIHI9dGhpcztjbGVhclRpbWVvdXQodGhpcy5waW5nSW50ZXJ2YWxUaW1lciksY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lciksdGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKFwiY2xvc2VcIiksdGhpcy50cmFuc3BvcnQuY2xvc2UoKSx0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmlkPW51bGwsdGhpcy5lbWl0KFwiY2xvc2VcIix0LGUpLHIud3JpdGVCdWZmZXI9W10sci5wcmV2QnVmZmVyTGVuPTB9fSxuLnByb3RvdHlwZS5maWx0ZXJVcGdyYWRlcz1mdW5jdGlvbih0KXtmb3IodmFyIGU9W10scj0wLG49dC5sZW5ndGg7cjxuO3IrKyl+Yyh0aGlzLnRyYW5zcG9ydHMsdFtyXSkmJmUucHVzaCh0W3JdKTtyZXR1cm4gZX19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihlKXt2YXIgcixuPSExLGE9ITEsYz0hMSE9PWUuanNvbnA7aWYodC5sb2NhdGlvbil7dmFyIHU9XCJodHRwczpcIj09PWxvY2F0aW9uLnByb3RvY29sLGg9bG9jYXRpb24ucG9ydDtofHwoaD11PzQ0Mzo4MCksbj1lLmhvc3RuYW1lIT09bG9jYXRpb24uaG9zdG5hbWV8fGghPT1lLnBvcnQsYT1lLnNlY3VyZSE9PXV9aWYoZS54ZG9tYWluPW4sZS54c2NoZW1lPWEscj1uZXcgbyhlKSxcIm9wZW5cImluIHImJiFlLmZvcmNlSlNPTlApcmV0dXJuIG5ldyBpKGUpO2lmKCFjKXRocm93IG5ldyBFcnJvcihcIkpTT05QIGRpc2FibGVkXCIpO3JldHVybiBuZXcgcyhlKX12YXIgbz1yKDIyKSxpPXIoMjQpLHM9cigzOSksYT1yKDQwKTtlLnBvbGxpbmc9bixlLndlYnNvY2tldD1hfSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe3ZhciBuPXIoMjMpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgcj10Lnhkb21haW4sbz10LnhzY2hlbWUsaT10LmVuYWJsZXNYRFI7dHJ5e2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBYTUxIdHRwUmVxdWVzdCYmKCFyfHxuKSlyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKHQpe310cnl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhEb21haW5SZXF1ZXN0JiYhbyYmaSlyZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0fWNhdGNoKHQpe31pZighcil0cnl7cmV0dXJuIG5ldyhlW1tcIkFjdGl2ZVwiXS5jb25jYXQoXCJPYmplY3RcIikuam9pbihcIlhcIildKShcIk1pY3Jvc29mdC5YTUxIVFRQXCIpfWNhdGNoKHQpe319fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3RyeXt0LmV4cG9ydHM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhNTEh0dHBSZXF1ZXN0JiZcIndpdGhDcmVkZW50aWFsc1wiaW4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKGUpe3QuZXhwb3J0cz0hMX19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKHQpe2lmKGMuY2FsbCh0aGlzLHQpLHRoaXMucmVxdWVzdFRpbWVvdXQ9dC5yZXF1ZXN0VGltZW91dCxlLmxvY2F0aW9uKXt2YXIgcj1cImh0dHBzOlwiPT09bG9jYXRpb24ucHJvdG9jb2wsbj1sb2NhdGlvbi5wb3J0O258fChuPXI/NDQzOjgwKSx0aGlzLnhkPXQuaG9zdG5hbWUhPT1lLmxvY2F0aW9uLmhvc3RuYW1lfHxuIT09dC5wb3J0LHRoaXMueHM9dC5zZWN1cmUhPT1yfWVsc2UgdGhpcy5leHRyYUhlYWRlcnM9dC5leHRyYUhlYWRlcnN9ZnVuY3Rpb24gaSh0KXt0aGlzLm1ldGhvZD10Lm1ldGhvZHx8XCJHRVRcIix0aGlzLnVyaT10LnVyaSx0aGlzLnhkPSEhdC54ZCx0aGlzLnhzPSEhdC54cyx0aGlzLmFzeW5jPSExIT09dC5hc3luYyx0aGlzLmRhdGE9dm9pZCAwIT09dC5kYXRhP3QuZGF0YTpudWxsLHRoaXMuYWdlbnQ9dC5hZ2VudCx0aGlzLmlzQmluYXJ5PXQuaXNCaW5hcnksdGhpcy5zdXBwb3J0c0JpbmFyeT10LnN1cHBvcnRzQmluYXJ5LHRoaXMuZW5hYmxlc1hEUj10LmVuYWJsZXNYRFIsdGhpcy5yZXF1ZXN0VGltZW91dD10LnJlcXVlc3RUaW1lb3V0LHRoaXMucGZ4PXQucGZ4LHRoaXMua2V5PXQua2V5LHRoaXMucGFzc3BocmFzZT10LnBhc3NwaHJhc2UsdGhpcy5jZXJ0PXQuY2VydCx0aGlzLmNhPXQuY2EsdGhpcy5jaXBoZXJzPXQuY2lwaGVycyx0aGlzLnJlamVjdFVuYXV0aG9yaXplZD10LnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmV4dHJhSGVhZGVycz10LmV4dHJhSGVhZGVycyx0aGlzLmNyZWF0ZSgpfWZ1bmN0aW9uIHMoKXtmb3IodmFyIHQgaW4gaS5yZXF1ZXN0cylpLnJlcXVlc3RzLmhhc093blByb3BlcnR5KHQpJiZpLnJlcXVlc3RzW3RdLmFib3J0KCl9dmFyIGE9cigyMiksYz1yKDI1KSx1PXIoMzUpLGg9cigzNykscD1yKDMpKFwiZW5naW5lLmlvLWNsaWVudDpwb2xsaW5nLXhoclwiKTt0LmV4cG9ydHM9byx0LmV4cG9ydHMuUmVxdWVzdD1pLGgobyxjKSxvLnByb3RvdHlwZS5zdXBwb3J0c0JpbmFyeT0hMCxvLnByb3RvdHlwZS5yZXF1ZXN0PWZ1bmN0aW9uKHQpe3JldHVybiB0PXR8fHt9LHQudXJpPXRoaXMudXJpKCksdC54ZD10aGlzLnhkLHQueHM9dGhpcy54cyx0LmFnZW50PXRoaXMuYWdlbnR8fCExLHQuc3VwcG9ydHNCaW5hcnk9dGhpcy5zdXBwb3J0c0JpbmFyeSx0LmVuYWJsZXNYRFI9dGhpcy5lbmFibGVzWERSLHQucGZ4PXRoaXMucGZ4LHQua2V5PXRoaXMua2V5LHQucGFzc3BocmFzZT10aGlzLnBhc3NwaHJhc2UsdC5jZXJ0PXRoaXMuY2VydCx0LmNhPXRoaXMuY2EsdC5jaXBoZXJzPXRoaXMuY2lwaGVycyx0LnJlamVjdFVuYXV0aG9yaXplZD10aGlzLnJlamVjdFVuYXV0aG9yaXplZCx0LnJlcXVlc3RUaW1lb3V0PXRoaXMucmVxdWVzdFRpbWVvdXQsdC5leHRyYUhlYWRlcnM9dGhpcy5leHRyYUhlYWRlcnMsbmV3IGkodCl9LG8ucHJvdG90eXBlLmRvV3JpdGU9ZnVuY3Rpb24odCxlKXt2YXIgcj1cInN0cmluZ1wiIT10eXBlb2YgdCYmdm9pZCAwIT09dCxuPXRoaXMucmVxdWVzdCh7bWV0aG9kOlwiUE9TVFwiLGRhdGE6dCxpc0JpbmFyeTpyfSksbz10aGlzO24ub24oXCJzdWNjZXNzXCIsZSksbi5vbihcImVycm9yXCIsZnVuY3Rpb24odCl7by5vbkVycm9yKFwieGhyIHBvc3QgZXJyb3JcIix0KX0pLHRoaXMuc2VuZFhocj1ufSxvLnByb3RvdHlwZS5kb1BvbGw9ZnVuY3Rpb24oKXtwKFwieGhyIHBvbGxcIik7dmFyIHQ9dGhpcy5yZXF1ZXN0KCksZT10aGlzO3Qub24oXCJkYXRhXCIsZnVuY3Rpb24odCl7ZS5vbkRhdGEodCl9KSx0Lm9uKFwiZXJyb3JcIixmdW5jdGlvbih0KXtlLm9uRXJyb3IoXCJ4aHIgcG9sbCBlcnJvclwiLHQpfSksdGhpcy5wb2xsWGhyPXR9LHUoaS5wcm90b3R5cGUpLGkucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3ZhciB0PXthZ2VudDp0aGlzLmFnZW50LHhkb21haW46dGhpcy54ZCx4c2NoZW1lOnRoaXMueHMsZW5hYmxlc1hEUjp0aGlzLmVuYWJsZXNYRFJ9O3QucGZ4PXRoaXMucGZ4LHQua2V5PXRoaXMua2V5LHQucGFzc3BocmFzZT10aGlzLnBhc3NwaHJhc2UsdC5jZXJ0PXRoaXMuY2VydCx0LmNhPXRoaXMuY2EsdC5jaXBoZXJzPXRoaXMuY2lwaGVycyx0LnJlamVjdFVuYXV0aG9yaXplZD10aGlzLnJlamVjdFVuYXV0aG9yaXplZDt2YXIgcj10aGlzLnhocj1uZXcgYSh0KSxuPXRoaXM7dHJ5e3AoXCJ4aHIgb3BlbiAlczogJXNcIix0aGlzLm1ldGhvZCx0aGlzLnVyaSksci5vcGVuKHRoaXMubWV0aG9kLHRoaXMudXJpLHRoaXMuYXN5bmMpO3RyeXtpZih0aGlzLmV4dHJhSGVhZGVycyl7ci5zZXREaXNhYmxlSGVhZGVyQ2hlY2soITApO2Zvcih2YXIgbyBpbiB0aGlzLmV4dHJhSGVhZGVycyl0aGlzLmV4dHJhSGVhZGVycy5oYXNPd25Qcm9wZXJ0eShvKSYmci5zZXRSZXF1ZXN0SGVhZGVyKG8sdGhpcy5leHRyYUhlYWRlcnNbb10pfX1jYXRjaCh0KXt9aWYodGhpcy5zdXBwb3J0c0JpbmFyeSYmKHIucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIiksXCJQT1NUXCI9PT10aGlzLm1ldGhvZCl0cnl7dGhpcy5pc0JpbmFyeT9yLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIixcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTpyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIixcInRleHQvcGxhaW47Y2hhcnNldD1VVEYtOFwiKX1jYXRjaCh0KXt9dHJ5e3Iuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLFwiKi8qXCIpfWNhdGNoKHQpe31cIndpdGhDcmVkZW50aWFsc1wiaW4gciYmKHIud2l0aENyZWRlbnRpYWxzPSEwKSx0aGlzLnJlcXVlc3RUaW1lb3V0JiYoci50aW1lb3V0PXRoaXMucmVxdWVzdFRpbWVvdXQpLHRoaXMuaGFzWERSKCk/KHIub25sb2FkPWZ1bmN0aW9uKCl7bi5vbkxvYWQoKX0sci5vbmVycm9yPWZ1bmN0aW9uKCl7bi5vbkVycm9yKHIucmVzcG9uc2VUZXh0KX0pOnIub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7ND09PXIucmVhZHlTdGF0ZSYmKDIwMD09PXIuc3RhdHVzfHwxMjIzPT09ci5zdGF0dXM/bi5vbkxvYWQoKTpzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bi5vbkVycm9yKHIuc3RhdHVzKX0sMCkpfSxwKFwieGhyIGRhdGEgJXNcIix0aGlzLmRhdGEpLHIuc2VuZCh0aGlzLmRhdGEpfWNhdGNoKHQpe3JldHVybiB2b2lkIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLm9uRXJyb3IodCl9LDApfWUuZG9jdW1lbnQmJih0aGlzLmluZGV4PWkucmVxdWVzdHNDb3VudCsrLGkucmVxdWVzdHNbdGhpcy5pbmRleF09dGhpcyl9LGkucHJvdG90eXBlLm9uU3VjY2Vzcz1mdW5jdGlvbigpe3RoaXMuZW1pdChcInN1Y2Nlc3NcIiksdGhpcy5jbGVhbnVwKCl9LGkucHJvdG90eXBlLm9uRGF0YT1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJkYXRhXCIsdCksdGhpcy5vblN1Y2Nlc3MoKX0saS5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJlcnJvclwiLHQpLHRoaXMuY2xlYW51cCghMCl9LGkucHJvdG90eXBlLmNsZWFudXA9ZnVuY3Rpb24odCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHRoaXMueGhyJiZudWxsIT09dGhpcy54aHIpe2lmKHRoaXMuaGFzWERSKCk/dGhpcy54aHIub25sb2FkPXRoaXMueGhyLm9uZXJyb3I9bjp0aGlzLnhoci5vbnJlYWR5c3RhdGVjaGFuZ2U9bix0KXRyeXt0aGlzLnhoci5hYm9ydCgpfWNhdGNoKHQpe31lLmRvY3VtZW50JiZkZWxldGUgaS5yZXF1ZXN0c1t0aGlzLmluZGV4XSx0aGlzLnhocj1udWxsfX0saS5wcm90b3R5cGUub25Mb2FkPWZ1bmN0aW9uKCl7dmFyIHQ7dHJ5e3ZhciBlO3RyeXtlPXRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpLnNwbGl0KFwiO1wiKVswXX1jYXRjaCh0KXt9aWYoXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIj09PWUpdD10aGlzLnhoci5yZXNwb25zZXx8dGhpcy54aHIucmVzcG9uc2VUZXh0O2Vsc2UgaWYodGhpcy5zdXBwb3J0c0JpbmFyeSl0cnl7dD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkodGhpcy54aHIucmVzcG9uc2UpKX1jYXRjaChlKXtmb3IodmFyIHI9bmV3IFVpbnQ4QXJyYXkodGhpcy54aHIucmVzcG9uc2UpLG49W10sbz0wLGk9ci5sZW5ndGg7bzxpO28rKyluLnB1c2gocltvXSk7dD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbil9ZWxzZSB0PXRoaXMueGhyLnJlc3BvbnNlVGV4dH1jYXRjaCh0KXt0aGlzLm9uRXJyb3IodCl9bnVsbCE9dCYmdGhpcy5vbkRhdGEodCl9LGkucHJvdG90eXBlLmhhc1hEUj1mdW5jdGlvbigpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBlLlhEb21haW5SZXF1ZXN0JiYhdGhpcy54cyYmdGhpcy5lbmFibGVzWERSfSxpLnByb3RvdHlwZS5hYm9ydD1mdW5jdGlvbigpe3RoaXMuY2xlYW51cCgpfSxpLnJlcXVlc3RzQ291bnQ9MCxpLnJlcXVlc3RzPXt9LGUuZG9jdW1lbnQmJihlLmF0dGFjaEV2ZW50P2UuYXR0YWNoRXZlbnQoXCJvbnVubG9hZFwiLHMpOmUuYWRkRXZlbnRMaXN0ZW5lciYmZS5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIscywhMSkpfSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10JiZ0LmZvcmNlQmFzZTY0O2gmJiFlfHwodGhpcy5zdXBwb3J0c0JpbmFyeT0hMSksby5jYWxsKHRoaXMsdCl9dmFyIG89cigyNiksaT1yKDM2KSxzPXIoMjcpLGE9cigzNyksYz1yKDM4KSx1PXIoMykoXCJlbmdpbmUuaW8tY2xpZW50OnBvbGxpbmdcIik7dC5leHBvcnRzPW47dmFyIGg9ZnVuY3Rpb24oKXt2YXIgdD1yKDIyKSxlPW5ldyB0KHt4ZG9tYWluOiExfSk7cmV0dXJuIG51bGwhPWUucmVzcG9uc2VUeXBlfSgpO2EobixvKSxuLnByb3RvdHlwZS5uYW1lPVwicG9sbGluZ1wiLG4ucHJvdG90eXBlLmRvT3Blbj1mdW5jdGlvbigpe3RoaXMucG9sbCgpfSxuLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKCl7dShcInBhdXNlZFwiKSxyLnJlYWR5U3RhdGU9XCJwYXVzZWRcIix0KCl9dmFyIHI9dGhpcztpZih0aGlzLnJlYWR5U3RhdGU9XCJwYXVzaW5nXCIsdGhpcy5wb2xsaW5nfHwhdGhpcy53cml0YWJsZSl7dmFyIG49MDt0aGlzLnBvbGxpbmcmJih1KFwid2UgYXJlIGN1cnJlbnRseSBwb2xsaW5nIC0gd2FpdGluZyB0byBwYXVzZVwiKSxuKyssdGhpcy5vbmNlKFwicG9sbENvbXBsZXRlXCIsZnVuY3Rpb24oKXt1KFwicHJlLXBhdXNlIHBvbGxpbmcgY29tcGxldGVcIiksLS1ufHxlKCl9KSksdGhpcy53cml0YWJsZXx8KHUoXCJ3ZSBhcmUgY3VycmVudGx5IHdyaXRpbmcgLSB3YWl0aW5nIHRvIHBhdXNlXCIpLG4rKyx0aGlzLm9uY2UoXCJkcmFpblwiLGZ1bmN0aW9uKCl7dShcInByZS1wYXVzZSB3cml0aW5nIGNvbXBsZXRlXCIpLC0tbnx8ZSgpfSkpfWVsc2UgZSgpfSxuLnByb3RvdHlwZS5wb2xsPWZ1bmN0aW9uKCl7dShcInBvbGxpbmdcIiksdGhpcy5wb2xsaW5nPSEwLHRoaXMuZG9Qb2xsKCksdGhpcy5lbWl0KFwicG9sbFwiKX0sbi5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7dShcInBvbGxpbmcgZ290IGRhdGEgJXNcIix0KTt2YXIgcj1mdW5jdGlvbih0LHIsbil7cmV0dXJuXCJvcGVuaW5nXCI9PT1lLnJlYWR5U3RhdGUmJmUub25PcGVuKCksXCJjbG9zZVwiPT09dC50eXBlPyhlLm9uQ2xvc2UoKSwhMSk6dm9pZCBlLm9uUGFja2V0KHQpfTtzLmRlY29kZVBheWxvYWQodCx0aGlzLnNvY2tldC5iaW5hcnlUeXBlLHIpLFwiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJih0aGlzLnBvbGxpbmc9ITEsdGhpcy5lbWl0KFwicG9sbENvbXBsZXRlXCIpLFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlP3RoaXMucG9sbCgpOnUoJ2lnbm9yaW5nIHBvbGwgLSB0cmFuc3BvcnQgc3RhdGUgXCIlc1wiJyx0aGlzLnJlYWR5U3RhdGUpKX0sbi5wcm90b3R5cGUuZG9DbG9zZT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXt1KFwid3JpdGluZyBjbG9zZSBwYWNrZXRcIiksZS53cml0ZShbe3R5cGU6XCJjbG9zZVwifV0pfXZhciBlPXRoaXM7XCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGU/KHUoXCJ0cmFuc3BvcnQgb3BlbiAtIGNsb3NpbmdcIiksdCgpKToodShcInRyYW5zcG9ydCBub3Qgb3BlbiAtIGRlZmVycmluZyBjbG9zZVwiKSx0aGlzLm9uY2UoXCJvcGVuXCIsdCkpfSxuLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbih0KXt2YXIgZT10aGlzO3RoaXMud3JpdGFibGU9ITE7dmFyIHI9ZnVuY3Rpb24oKXtlLndyaXRhYmxlPSEwLGUuZW1pdChcImRyYWluXCIpfTtzLmVuY29kZVBheWxvYWQodCx0aGlzLnN1cHBvcnRzQmluYXJ5LGZ1bmN0aW9uKHQpe2UuZG9Xcml0ZSh0LHIpfSl9LG4ucHJvdG90eXBlLnVyaT1mdW5jdGlvbigpe3ZhciB0PXRoaXMucXVlcnl8fHt9LGU9dGhpcy5zZWN1cmU/XCJodHRwc1wiOlwiaHR0cFwiLHI9XCJcIjshMSE9PXRoaXMudGltZXN0YW1wUmVxdWVzdHMmJih0W3RoaXMudGltZXN0YW1wUGFyYW1dPWMoKSksdGhpcy5zdXBwb3J0c0JpbmFyeXx8dC5zaWR8fCh0LmI2ND0xKSx0PWkuZW5jb2RlKHQpLHRoaXMucG9ydCYmKFwiaHR0cHNcIj09PWUmJjQ0MyE9PU51bWJlcih0aGlzLnBvcnQpfHxcImh0dHBcIj09PWUmJjgwIT09TnVtYmVyKHRoaXMucG9ydCkpJiYocj1cIjpcIit0aGlzLnBvcnQpLHQubGVuZ3RoJiYodD1cIj9cIit0KTt2YXIgbj10aGlzLmhvc3RuYW1lLmluZGV4T2YoXCI6XCIpIT09LTE7cmV0dXJuIGUrXCI6Ly9cIisobj9cIltcIit0aGlzLmhvc3RuYW1lK1wiXVwiOnRoaXMuaG9zdG5hbWUpK3IrdGhpcy5wYXRoK3R9fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt0aGlzLnBhdGg9dC5wYXRoLHRoaXMuaG9zdG5hbWU9dC5ob3N0bmFtZSx0aGlzLnBvcnQ9dC5wb3J0LHRoaXMuc2VjdXJlPXQuc2VjdXJlLHRoaXMucXVlcnk9dC5xdWVyeSx0aGlzLnRpbWVzdGFtcFBhcmFtPXQudGltZXN0YW1wUGFyYW0sdGhpcy50aW1lc3RhbXBSZXF1ZXN0cz10LnRpbWVzdGFtcFJlcXVlc3RzLHRoaXMucmVhZHlTdGF0ZT1cIlwiLHRoaXMuYWdlbnQ9dC5hZ2VudHx8ITEsdGhpcy5zb2NrZXQ9dC5zb2NrZXQsdGhpcy5lbmFibGVzWERSPXQuZW5hYmxlc1hEUix0aGlzLnBmeD10LnBmeCx0aGlzLmtleT10LmtleSx0aGlzLnBhc3NwaHJhc2U9dC5wYXNzcGhyYXNlLHRoaXMuY2VydD10LmNlcnQsdGhpcy5jYT10LmNhLHRoaXMuY2lwaGVycz10LmNpcGhlcnMsdGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ9dC5yZWplY3RVbmF1dGhvcml6ZWQsdGhpcy5mb3JjZU5vZGU9dC5mb3JjZU5vZGUsdGhpcy5leHRyYUhlYWRlcnM9dC5leHRyYUhlYWRlcnMsdGhpcy5sb2NhbEFkZHJlc3M9dC5sb2NhbEFkZHJlc3N9dmFyIG89cigyNyksaT1yKDM1KTt0LmV4cG9ydHM9bixpKG4ucHJvdG90eXBlKSxuLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKHQsZSl7dmFyIHI9bmV3IEVycm9yKHQpO3JldHVybiByLnR5cGU9XCJUcmFuc3BvcnRFcnJvclwiLHIuZGVzY3JpcHRpb249ZSx0aGlzLmVtaXQoXCJlcnJvclwiLHIpLHRoaXN9LG4ucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oKXtyZXR1cm5cImNsb3NlZFwiIT09dGhpcy5yZWFkeVN0YXRlJiZcIlwiIT09dGhpcy5yZWFkeVN0YXRlfHwodGhpcy5yZWFkeVN0YXRlPVwib3BlbmluZ1wiLHRoaXMuZG9PcGVuKCkpLHRoaXN9LG4ucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7cmV0dXJuXCJvcGVuaW5nXCIhPT10aGlzLnJlYWR5U3RhdGUmJlwib3BlblwiIT09dGhpcy5yZWFkeVN0YXRlfHwodGhpcy5kb0Nsb3NlKCksdGhpcy5vbkNsb3NlKCkpLHRoaXN9LG4ucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24odCl7aWYoXCJvcGVuXCIhPT10aGlzLnJlYWR5U3RhdGUpdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNwb3J0IG5vdCBvcGVuXCIpO3RoaXMud3JpdGUodCl9LG4ucHJvdG90eXBlLm9uT3Blbj1mdW5jdGlvbigpe3RoaXMucmVhZHlTdGF0ZT1cIm9wZW5cIix0aGlzLndyaXRhYmxlPSEwLHRoaXMuZW1pdChcIm9wZW5cIil9LG4ucHJvdG90eXBlLm9uRGF0YT1mdW5jdGlvbih0KXt2YXIgZT1vLmRlY29kZVBhY2tldCh0LHRoaXMuc29ja2V0LmJpbmFyeVR5cGUpO3RoaXMub25QYWNrZXQoZSl9LG4ucHJvdG90eXBlLm9uUGFja2V0PWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcInBhY2tldFwiLHQpfSxuLnByb3RvdHlwZS5vbkNsb3NlPWZ1bmN0aW9uKCl7dGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsdGhpcy5lbWl0KFwiY2xvc2VcIil9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4odCxyKXt2YXIgbj1cImJcIitlLnBhY2tldHNbdC50eXBlXSt0LmRhdGEuZGF0YTtyZXR1cm4gcihuKX1mdW5jdGlvbiBvKHQscixuKXtpZighcilyZXR1cm4gZS5lbmNvZGVCYXNlNjRQYWNrZXQodCxuKTt2YXIgbz10LmRhdGEsaT1uZXcgVWludDhBcnJheShvKSxzPW5ldyBVaW50OEFycmF5KDErby5ieXRlTGVuZ3RoKTtzWzBdPXZbdC50eXBlXTtmb3IodmFyIGE9MDthPGkubGVuZ3RoO2ErKylzW2ErMV09aVthXTtyZXR1cm4gbihzLmJ1ZmZlcil9ZnVuY3Rpb24gaSh0LHIsbil7aWYoIXIpcmV0dXJuIGUuZW5jb2RlQmFzZTY0UGFja2V0KHQsbik7dmFyIG89bmV3IEZpbGVSZWFkZXI7cmV0dXJuIG8ub25sb2FkPWZ1bmN0aW9uKCl7dC5kYXRhPW8ucmVzdWx0LGUuZW5jb2RlUGFja2V0KHQsciwhMCxuKX0sby5yZWFkQXNBcnJheUJ1ZmZlcih0LmRhdGEpfWZ1bmN0aW9uIHModCxyLG4pe2lmKCFyKXJldHVybiBlLmVuY29kZUJhc2U2NFBhY2tldCh0LG4pO2lmKG0pcmV0dXJuIGkodCxyLG4pO3ZhciBvPW5ldyBVaW50OEFycmF5KDEpO29bMF09dlt0LnR5cGVdO3ZhciBzPW5ldyBrKFtvLmJ1ZmZlcix0LmRhdGFdKTtyZXR1cm4gbihzKX1mdW5jdGlvbiBhKHQpe3RyeXt0PWQuZGVjb2RlKHQpfWNhdGNoKHQpe3JldHVybiExfXJldHVybiB0fWZ1bmN0aW9uIGModCxlLHIpe2Zvcih2YXIgbj1uZXcgQXJyYXkodC5sZW5ndGgpLG89bCh0Lmxlbmd0aCxyKSxpPWZ1bmN0aW9uKHQscixvKXtlKHIsZnVuY3Rpb24oZSxyKXtuW3RdPXIsbyhlLG4pfSl9LHM9MDtzPHQubGVuZ3RoO3MrKylpKHMsdFtzXSxvKX12YXIgdSxoPXIoMjgpLHA9cigyOSksZj1yKDMwKSxsPXIoMzEpLGQ9cigzMik7dCYmdC5BcnJheUJ1ZmZlciYmKHU9cigzMykpO3ZhciB5PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxnPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9QaGFudG9tSlMvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLG09eXx8ZztlLnByb3RvY29sPTM7dmFyIHY9ZS5wYWNrZXRzPXtvcGVuOjAsY2xvc2U6MSxwaW5nOjIscG9uZzozLG1lc3NhZ2U6NCx1cGdyYWRlOjUsbm9vcDo2fSxiPWgodiksdz17dHlwZTpcImVycm9yXCIsZGF0YTpcInBhcnNlciBlcnJvclwifSxrPXIoMzQpO2UuZW5jb2RlUGFja2V0PWZ1bmN0aW9uKGUscixpLGEpe1wiZnVuY3Rpb25cIj09dHlwZW9mIHImJihhPXIscj0hMSksXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmKGE9aSxpPW51bGwpO3ZhciBjPXZvaWQgMD09PWUuZGF0YT92b2lkIDA6ZS5kYXRhLmJ1ZmZlcnx8ZS5kYXRhO2lmKHQuQXJyYXlCdWZmZXImJmMgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcilyZXR1cm4gbyhlLHIsYSk7aWYoayYmYyBpbnN0YW5jZW9mIHQuQmxvYilyZXR1cm4gcyhlLHIsYSk7aWYoYyYmYy5iYXNlNjQpcmV0dXJuIG4oZSxhKTt2YXIgdT12W2UudHlwZV07cmV0dXJuIHZvaWQgMCE9PWUuZGF0YSYmKHUrPWk/ZC5lbmNvZGUoU3RyaW5nKGUuZGF0YSkpOlN0cmluZyhlLmRhdGEpKSxhKFwiXCIrdSl9LGUuZW5jb2RlQmFzZTY0UGFja2V0PWZ1bmN0aW9uKHIsbil7dmFyIG89XCJiXCIrZS5wYWNrZXRzW3IudHlwZV07aWYoayYmci5kYXRhIGluc3RhbmNlb2YgdC5CbG9iKXt2YXIgaT1uZXcgRmlsZVJlYWRlcjtyZXR1cm4gaS5vbmxvYWQ9ZnVuY3Rpb24oKXt2YXIgdD1pLnJlc3VsdC5zcGxpdChcIixcIilbMV07bihvK3QpfSxpLnJlYWRBc0RhdGFVUkwoci5kYXRhKX12YXIgczt0cnl7cz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkoci5kYXRhKSl9Y2F0Y2godCl7Zm9yKHZhciBhPW5ldyBVaW50OEFycmF5KHIuZGF0YSksYz1uZXcgQXJyYXkoYS5sZW5ndGgpLHU9MDt1PGEubGVuZ3RoO3UrKyljW3VdPWFbdV07cz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsYyl9cmV0dXJuIG8rPXQuYnRvYShzKSxuKG8pfSxlLmRlY29kZVBhY2tldD1mdW5jdGlvbih0LHIsbil7aWYodm9pZCAwPT09dClyZXR1cm4gdztpZihcInN0cmluZ1wiPT10eXBlb2YgdCl7aWYoXCJiXCI9PXQuY2hhckF0KDApKXJldHVybiBlLmRlY29kZUJhc2U2NFBhY2tldCh0LnN1YnN0cigxKSxyKTtpZihuJiYodD1hKHQpLHQ9PT0hMSkpcmV0dXJuIHc7dmFyIG89dC5jaGFyQXQoMCk7cmV0dXJuIE51bWJlcihvKT09byYmYltvXT90Lmxlbmd0aD4xP3t0eXBlOmJbb10sZGF0YTp0LnN1YnN0cmluZygxKX06e3R5cGU6YltvXX06d312YXIgaT1uZXcgVWludDhBcnJheSh0KSxvPWlbMF0scz1mKHQsMSk7cmV0dXJuIGsmJlwiYmxvYlwiPT09ciYmKHM9bmV3IGsoW3NdKSkse3R5cGU6YltvXSxkYXRhOnN9fSxlLmRlY29kZUJhc2U2NFBhY2tldD1mdW5jdGlvbih0LGUpe3ZhciByPWJbdC5jaGFyQXQoMCldO2lmKCF1KXJldHVybnt0eXBlOnIsZGF0YTp7YmFzZTY0OiEwLGRhdGE6dC5zdWJzdHIoMSl9fTt2YXIgbj11LmRlY29kZSh0LnN1YnN0cigxKSk7cmV0dXJuXCJibG9iXCI9PT1lJiZrJiYobj1uZXcgayhbbl0pKSx7dHlwZTpyLGRhdGE6bn19LGUuZW5jb2RlUGF5bG9hZD1mdW5jdGlvbih0LHIsbil7ZnVuY3Rpb24gbyh0KXtyZXR1cm4gdC5sZW5ndGgrXCI6XCIrdH1mdW5jdGlvbiBpKHQsbil7ZS5lbmNvZGVQYWNrZXQodCwhIXMmJnIsITAsZnVuY3Rpb24odCl7bihudWxsLG8odCkpfSl9XCJmdW5jdGlvblwiPT10eXBlb2YgciYmKG49cixyPW51bGwpO3ZhciBzPXAodCk7cmV0dXJuIHImJnM/ayYmIW0/ZS5lbmNvZGVQYXlsb2FkQXNCbG9iKHQsbik6ZS5lbmNvZGVQYXlsb2FkQXNBcnJheUJ1ZmZlcih0LG4pOnQubGVuZ3RoP3ZvaWQgYyh0LGksZnVuY3Rpb24odCxlKXtyZXR1cm4gbihlLmpvaW4oXCJcIikpfSk6bihcIjA6XCIpfSxlLmRlY29kZVBheWxvYWQ9ZnVuY3Rpb24odCxyLG4pe2lmKFwic3RyaW5nXCIhPXR5cGVvZiB0KXJldHVybiBlLmRlY29kZVBheWxvYWRBc0JpbmFyeSh0LHIsbik7XCJmdW5jdGlvblwiPT10eXBlb2YgciYmKG49cixyPW51bGwpO3ZhciBvO2lmKFwiXCI9PXQpcmV0dXJuIG4odywwLDEpO2Zvcih2YXIgaSxzLGE9XCJcIixjPTAsdT10Lmxlbmd0aDtjPHU7YysrKXt2YXIgaD10LmNoYXJBdChjKTtpZihcIjpcIiE9aClhKz1oO2Vsc2V7aWYoXCJcIj09YXx8YSE9KGk9TnVtYmVyKGEpKSlyZXR1cm4gbih3LDAsMSk7aWYocz10LnN1YnN0cihjKzEsaSksYSE9cy5sZW5ndGgpcmV0dXJuIG4odywwLDEpO2lmKHMubGVuZ3RoKXtpZihvPWUuZGVjb2RlUGFja2V0KHMsciwhMCksdy50eXBlPT1vLnR5cGUmJncuZGF0YT09by5kYXRhKXJldHVybiBuKHcsMCwxKTt2YXIgcD1uKG8sYytpLHUpO2lmKCExPT09cClyZXR1cm59Yys9aSxhPVwiXCJ9fXJldHVyblwiXCIhPWE/bih3LDAsMSk6dm9pZCAwfSxlLmVuY29kZVBheWxvYWRBc0FycmF5QnVmZmVyPWZ1bmN0aW9uKHQscil7ZnVuY3Rpb24gbih0LHIpe2UuZW5jb2RlUGFja2V0KHQsITAsITAsZnVuY3Rpb24odCl7cmV0dXJuIHIobnVsbCx0KX0pfXJldHVybiB0Lmxlbmd0aD92b2lkIGModCxuLGZ1bmN0aW9uKHQsZSl7dmFyIG49ZS5yZWR1Y2UoZnVuY3Rpb24odCxlKXt2YXIgcjtyZXR1cm4gcj1cInN0cmluZ1wiPT10eXBlb2YgZT9lLmxlbmd0aDplLmJ5dGVMZW5ndGgsdCtyLnRvU3RyaW5nKCkubGVuZ3RoK3IrMn0sMCksbz1uZXcgVWludDhBcnJheShuKSxpPTA7cmV0dXJuIGUuZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgZT1cInN0cmluZ1wiPT10eXBlb2YgdCxyPXQ7aWYoZSl7Zm9yKHZhciBuPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKSxzPTA7czx0Lmxlbmd0aDtzKyspbltzXT10LmNoYXJDb2RlQXQocyk7cj1uLmJ1ZmZlcn1lP29baSsrXT0wOm9baSsrXT0xO2Zvcih2YXIgYT1yLmJ5dGVMZW5ndGgudG9TdHJpbmcoKSxzPTA7czxhLmxlbmd0aDtzKyspb1tpKytdPXBhcnNlSW50KGFbc10pO29baSsrXT0yNTU7Zm9yKHZhciBuPW5ldyBVaW50OEFycmF5KHIpLHM9MDtzPG4ubGVuZ3RoO3MrKylvW2krK109bltzXX0pLHIoby5idWZmZXIpfSk6cihuZXcgQXJyYXlCdWZmZXIoMCkpfSxlLmVuY29kZVBheWxvYWRBc0Jsb2I9ZnVuY3Rpb24odCxyKXtmdW5jdGlvbiBuKHQscil7ZS5lbmNvZGVQYWNrZXQodCwhMCwhMCxmdW5jdGlvbih0KXt2YXIgZT1uZXcgVWludDhBcnJheSgxKTtpZihlWzBdPTEsXCJzdHJpbmdcIj09dHlwZW9mIHQpe2Zvcih2YXIgbj1uZXcgVWludDhBcnJheSh0Lmxlbmd0aCksbz0wO288dC5sZW5ndGg7bysrKW5bb109dC5jaGFyQ29kZUF0KG8pO3Q9bi5idWZmZXIsZVswXT0wfWZvcih2YXIgaT10IGluc3RhbmNlb2YgQXJyYXlCdWZmZXI/dC5ieXRlTGVuZ3RoOnQuc2l6ZSxzPWkudG9TdHJpbmcoKSxhPW5ldyBVaW50OEFycmF5KHMubGVuZ3RoKzEpLG89MDtvPHMubGVuZ3RoO28rKylhW29dPXBhcnNlSW50KHNbb10pO2lmKGFbcy5sZW5ndGhdPTI1NSxrKXt2YXIgYz1uZXcgayhbZS5idWZmZXIsYS5idWZmZXIsdF0pO3IobnVsbCxjKX19KX1jKHQsbixmdW5jdGlvbih0LGUpe3JldHVybiByKG5ldyBrKGUpKX0pfSxlLmRlY29kZVBheWxvYWRBc0JpbmFyeT1mdW5jdGlvbih0LHIsbil7XCJmdW5jdGlvblwiPT10eXBlb2YgciYmKG49cixyPW51bGwpO2Zvcih2YXIgbz10LGk9W10scz0hMTtvLmJ5dGVMZW5ndGg+MDspe2Zvcih2YXIgYT1uZXcgVWludDhBcnJheShvKSxjPTA9PT1hWzBdLHU9XCJcIixoPTE7MjU1IT1hW2hdO2grKyl7aWYodS5sZW5ndGg+MzEwKXtzPSEwO2JyZWFrfXUrPWFbaF19aWYocylyZXR1cm4gbih3LDAsMSk7bz1mKG8sMit1Lmxlbmd0aCksdT1wYXJzZUludCh1KTt2YXIgcD1mKG8sMCx1KTtpZihjKXRyeXtwPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheShwKSl9Y2F0Y2godCl7dmFyIGw9bmV3IFVpbnQ4QXJyYXkocCk7cD1cIlwiO2Zvcih2YXIgaD0wO2g8bC5sZW5ndGg7aCsrKXArPVN0cmluZy5mcm9tQ2hhckNvZGUobFtoXSl9aS5wdXNoKHApLG89ZihvLHUpfXZhciBkPWkubGVuZ3RoO2kuZm9yRWFjaChmdW5jdGlvbih0LG8pe24oZS5kZWNvZGVQYWNrZXQodCxyLCEwKSxvLGQpfSl9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1PYmplY3Qua2V5c3x8ZnVuY3Rpb24odCl7dmFyIGU9W10scj1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O2Zvcih2YXIgbiBpbiB0KXIuY2FsbCh0LG4pJiZlLnB1c2gobik7cmV0dXJuIGV9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7ZnVuY3Rpb24gcih0KXtpZighdClyZXR1cm4hMTtpZihlLkJ1ZmZlciYmZS5CdWZmZXIuaXNCdWZmZXImJmUuQnVmZmVyLmlzQnVmZmVyKHQpfHxlLkFycmF5QnVmZmVyJiZ0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGUuQmxvYiYmdCBpbnN0YW5jZW9mIEJsb2J8fGUuRmlsZSYmdCBpbnN0YW5jZW9mIEZpbGUpcmV0dXJuITA7aWYobyh0KSl7Zm9yKHZhciBuPTA7bjx0Lmxlbmd0aDtuKyspaWYocih0W25dKSlyZXR1cm4hMH1lbHNlIGlmKHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0KXt0LnRvSlNPTiYmXCJmdW5jdGlvblwiPT10eXBlb2YgdC50b0pTT04mJih0PXQudG9KU09OKCkpO2Zvcih2YXIgaSBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LGkpJiZyKHRbaV0pKXJldHVybiEwfXJldHVybiExfXJldHVybiByKHQpfXZhciBvPXIoMTUpO3QuZXhwb3J0cz1ufSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1mdW5jdGlvbih0LGUscil7dmFyIG49dC5ieXRlTGVuZ3RoO2lmKGU9ZXx8MCxyPXJ8fG4sdC5zbGljZSlyZXR1cm4gdC5zbGljZShlLHIpO2lmKGU8MCYmKGUrPW4pLHI8MCYmKHIrPW4pLHI+biYmKHI9biksZT49bnx8ZT49cnx8MD09PW4pcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKTtmb3IodmFyIG89bmV3IFVpbnQ4QXJyYXkodCksaT1uZXcgVWludDhBcnJheShyLWUpLHM9ZSxhPTA7czxyO3MrKyxhKyspaVthXT1vW3NdO3JldHVybiBpLmJ1ZmZlcn19LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0LGUscil7ZnVuY3Rpb24gbyh0LG4pe2lmKG8uY291bnQ8PTApdGhyb3cgbmV3IEVycm9yKFwiYWZ0ZXIgY2FsbGVkIHRvbyBtYW55IHRpbWVzXCIpOy0tby5jb3VudCx0PyhpPSEwLGUodCksZT1yKTowIT09by5jb3VudHx8aXx8ZShudWxsLG4pfXZhciBpPSExO3JldHVybiByPXJ8fG4sby5jb3VudD10LDA9PT10P2UoKTpvfWZ1bmN0aW9uIG4oKXt9dC5leHBvcnRzPXJ9LGZ1bmN0aW9uKHQsZSxyKXt2YXIgbjsoZnVuY3Rpb24odCxvKXshZnVuY3Rpb24oaSl7ZnVuY3Rpb24gcyh0KXtmb3IodmFyIGUscixuPVtdLG89MCxpPXQubGVuZ3RoO288aTspZT10LmNoYXJDb2RlQXQobysrKSxlPj01NTI5NiYmZTw9NTYzMTkmJm88aT8ocj10LmNoYXJDb2RlQXQobysrKSw1NjMyMD09KDY0NTEyJnIpP24ucHVzaCgoKDEwMjMmZSk8PDEwKSsoMTAyMyZyKSs2NTUzNik6KG4ucHVzaChlKSxvLS0pKTpuLnB1c2goZSk7cmV0dXJuIG59ZnVuY3Rpb24gYSh0KXtmb3IodmFyIGUscj10Lmxlbmd0aCxuPS0xLG89XCJcIjsrK248cjspZT10W25dLGU+NjU1MzUmJihlLT02NTUzNixvKz1iKGU+Pj4xMCYxMDIzfDU1Mjk2KSxlPTU2MzIwfDEwMjMmZSksbys9YihlKTtyZXR1cm4gb31mdW5jdGlvbiBjKHQsZSl7cmV0dXJuIGIodD4+ZSY2M3wxMjgpfWZ1bmN0aW9uIHUodCl7aWYoMD09KDQyOTQ5NjcxNjgmdCkpcmV0dXJuIGIodCk7dmFyIGU9XCJcIjtyZXR1cm4gMD09KDQyOTQ5NjUyNDgmdCk/ZT1iKHQ+PjYmMzF8MTkyKTowPT0oNDI5NDkwMTc2MCZ0KT8oZT1iKHQ+PjEyJjE1fDIyNCksZSs9Yyh0LDYpKTowPT0oNDI5Mjg3MDE0NCZ0KSYmKGU9Yih0Pj4xOCY3fDI0MCksZSs9Yyh0LDEyKSxlKz1jKHQsNikpLGUrPWIoNjMmdHwxMjgpfWZ1bmN0aW9uIGgodCl7Zm9yKHZhciBlLHI9cyh0KSxuPXIubGVuZ3RoLG89LTEsaT1cIlwiOysrbzxuOyllPXJbb10saSs9dShlKTtyZXR1cm4gaX1mdW5jdGlvbiBwKCl7aWYodj49bSl0aHJvdyBFcnJvcihcIkludmFsaWQgYnl0ZSBpbmRleFwiKTt2YXIgdD0yNTUmZ1t2XTtpZih2KyssMTI4PT0oMTkyJnQpKXJldHVybiA2MyZ0O3Rocm93IEVycm9yKFwiSW52YWxpZCBjb250aW51YXRpb24gYnl0ZVwiKX1mdW5jdGlvbiBmKCl7dmFyIHQsZSxyLG4sbztpZih2Pm0pdGhyb3cgRXJyb3IoXCJJbnZhbGlkIGJ5dGUgaW5kZXhcIik7aWYodj09bSlyZXR1cm4hMTtpZih0PTI1NSZnW3ZdLHYrKywwPT0oMTI4JnQpKXJldHVybiB0O2lmKDE5Mj09KDIyNCZ0KSl7dmFyIGU9cCgpO2lmKG89KDMxJnQpPDw2fGUsbz49MTI4KXJldHVybiBvO3Rocm93IEVycm9yKFwiSW52YWxpZCBjb250aW51YXRpb24gYnl0ZVwiKX1pZigyMjQ9PSgyNDAmdCkpe2lmKGU9cCgpLHI9cCgpLG89KDE1JnQpPDwxMnxlPDw2fHIsbz49MjA0OClyZXR1cm4gbzt0aHJvdyBFcnJvcihcIkludmFsaWQgY29udGludWF0aW9uIGJ5dGVcIil9aWYoMjQwPT0oMjQ4JnQpJiYoZT1wKCkscj1wKCksbj1wKCksbz0oMTUmdCk8PDE4fGU8PDEyfHI8PDZ8bixvPj02NTUzNiYmbzw9MTExNDExMSkpcmV0dXJuIG87dGhyb3cgRXJyb3IoXCJJbnZhbGlkIFdURi04IGRldGVjdGVkXCIpfWZ1bmN0aW9uIGwodCl7Zz1zKHQpLG09Zy5sZW5ndGgsdj0wO2Zvcih2YXIgZSxyPVtdOyhlPWYoKSkhPT0hMTspci5wdXNoKGUpO3JldHVybiBhKHIpfXZhciBkPVwib2JqZWN0XCI9PXR5cGVvZiBlJiZlLHk9KFwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0JiZ0LmV4cG9ydHM9PWQmJnQsXCJvYmplY3RcIj09dHlwZW9mIG8mJm8pO3kuZ2xvYmFsIT09eSYmeS53aW5kb3chPT15fHwoaT15KTt2YXIgZyxtLHYsYj1TdHJpbmcuZnJvbUNoYXJDb2RlLHc9e3ZlcnNpb246XCIxLjAuMFwiLGVuY29kZTpoLGRlY29kZTpsfTtuPWZ1bmN0aW9uKCl7cmV0dXJuIHd9LmNhbGwoZSxyLGUsdCksISh2b2lkIDAhPT1uJiYodC5leHBvcnRzPW4pKX0odGhpcyl9KS5jYWxsKGUscigxMikodCksZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7IWZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7Zm9yKHZhciB0PVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLHI9bmV3IFVpbnQ4QXJyYXkoMjU2KSxuPTA7bjx0Lmxlbmd0aDtuKyspclt0LmNoYXJDb2RlQXQobildPW47ZS5lbmNvZGU9ZnVuY3Rpb24oZSl7dmFyIHIsbj1uZXcgVWludDhBcnJheShlKSxvPW4ubGVuZ3RoLGk9XCJcIjtmb3Iocj0wO3I8bztyKz0zKWkrPXRbbltyXT4+Ml0saSs9dFsoMyZuW3JdKTw8NHxuW3IrMV0+PjRdLGkrPXRbKDE1Jm5bcisxXSk8PDJ8bltyKzJdPj42XSxpKz10WzYzJm5bcisyXV07cmV0dXJuIG8lMz09PTI/aT1pLnN1YnN0cmluZygwLGkubGVuZ3RoLTEpK1wiPVwiOm8lMz09PTEmJihpPWkuc3Vic3RyaW5nKDAsaS5sZW5ndGgtMikrXCI9PVwiKSxpfSxlLmRlY29kZT1mdW5jdGlvbih0KXt2YXIgZSxuLG8saSxzLGE9Ljc1KnQubGVuZ3RoLGM9dC5sZW5ndGgsdT0wO1wiPVwiPT09dFt0Lmxlbmd0aC0xXSYmKGEtLSxcIj1cIj09PXRbdC5sZW5ndGgtMl0mJmEtLSk7dmFyIGg9bmV3IEFycmF5QnVmZmVyKGEpLHA9bmV3IFVpbnQ4QXJyYXkoaCk7Zm9yKGU9MDtlPGM7ZSs9NCluPXJbdC5jaGFyQ29kZUF0KGUpXSxvPXJbdC5jaGFyQ29kZUF0KGUrMSldLGk9clt0LmNoYXJDb2RlQXQoZSsyKV0scz1yW3QuY2hhckNvZGVBdChlKzMpXSxwW3UrK109bjw8MnxvPj40LHBbdSsrXT0oMTUmbyk8PDR8aT4+MixwW3UrK109KDMmaSk8PDZ8NjMmcztyZXR1cm4gaH19KCl9LGZ1bmN0aW9uKHQsZSl7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIodCl7Zm9yKHZhciBlPTA7ZTx0Lmxlbmd0aDtlKyspe3ZhciByPXRbZV07aWYoci5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7dmFyIG49ci5idWZmZXI7aWYoci5ieXRlTGVuZ3RoIT09bi5ieXRlTGVuZ3RoKXt2YXIgbz1uZXcgVWludDhBcnJheShyLmJ5dGVMZW5ndGgpO28uc2V0KG5ldyBVaW50OEFycmF5KG4sci5ieXRlT2Zmc2V0LHIuYnl0ZUxlbmd0aCkpLG49by5idWZmZXJ9dFtlXT1ufX19ZnVuY3Rpb24gbih0LGUpe2U9ZXx8e307dmFyIG49bmV3IGk7cih0KTtmb3IodmFyIG89MDtvPHQubGVuZ3RoO28rKyluLmFwcGVuZCh0W29dKTtyZXR1cm4gZS50eXBlP24uZ2V0QmxvYihlLnR5cGUpOm4uZ2V0QmxvYigpfWZ1bmN0aW9uIG8odCxlKXtyZXR1cm4gcih0KSxuZXcgQmxvYih0LGV8fHt9KX12YXIgaT1lLkJsb2JCdWlsZGVyfHxlLldlYktpdEJsb2JCdWlsZGVyfHxlLk1TQmxvYkJ1aWxkZXJ8fGUuTW96QmxvYkJ1aWxkZXIscz1mdW5jdGlvbigpe3RyeXt2YXIgdD1uZXcgQmxvYihbXCJoaVwiXSk7cmV0dXJuIDI9PT10LnNpemV9Y2F0Y2godCl7cmV0dXJuITF9fSgpLGE9cyYmZnVuY3Rpb24oKXt0cnl7dmFyIHQ9bmV3IEJsb2IoW25ldyBVaW50OEFycmF5KFsxLDJdKV0pO3JldHVybiAyPT09dC5zaXplfWNhdGNoKHQpe3JldHVybiExfX0oKSxjPWkmJmkucHJvdG90eXBlLmFwcGVuZCYmaS5wcm90b3R5cGUuZ2V0QmxvYjt0LmV4cG9ydHM9ZnVuY3Rpb24oKXtyZXR1cm4gcz9hP2UuQmxvYjpvOmM/bjp2b2lkIDB9KCl9KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2lmKHQpcmV0dXJuIG8odCl9ZnVuY3Rpb24gbyh0KXtmb3IodmFyIGUgaW4gbi5wcm90b3R5cGUpdFtlXT1uLnByb3RvdHlwZVtlXTtyZXR1cm4gdH10LmV4cG9ydHM9bixuLnByb3RvdHlwZS5vbj1uLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LCh0aGlzLl9jYWxsYmFja3NbXCIkXCIrdF09dGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdfHxbXSkucHVzaChlKSx0aGlzfSxuLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe3RoaXMub2ZmKHQsciksZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIHIuZm49ZSx0aGlzLm9uKHQsciksdGhpc30sbi5wcm90b3R5cGUub2ZmPW4ucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyPW4ucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycz1uLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sMD09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXt9LHRoaXM7dmFyIHI9dGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdO2lmKCFyKXJldHVybiB0aGlzO2lmKDE9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbXCIkXCIrdF0sdGhpcztmb3IodmFyIG4sbz0wO288ci5sZW5ndGg7bysrKWlmKG49cltvXSxuPT09ZXx8bi5mbj09PWUpe3Iuc3BsaWNlKG8sMSk7YnJlYWt9cmV0dXJuIHRoaXN9LG4ucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24odCl7dGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e307dmFyIGU9W10uc2xpY2UuY2FsbChhcmd1bWVudHMsMSkscj10aGlzLl9jYWxsYmFja3NbXCIkXCIrdF07aWYocil7cj1yLnNsaWNlKDApO2Zvcih2YXIgbj0wLG89ci5sZW5ndGg7bjxvOysrbilyW25dLmFwcGx5KHRoaXMsZSl9cmV0dXJuIHRoaXN9LG4ucHJvdG90eXBlLmxpc3RlbmVycz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sdGhpcy5fY2FsbGJhY2tzW1wiJFwiK3RdfHxbXX0sbi5wcm90b3R5cGUuaGFzTGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiEhdGhpcy5saXN0ZW5lcnModCkubGVuZ3RofX0sZnVuY3Rpb24odCxlKXtlLmVuY29kZT1mdW5jdGlvbih0KXt2YXIgZT1cIlwiO2Zvcih2YXIgciBpbiB0KXQuaGFzT3duUHJvcGVydHkocikmJihlLmxlbmd0aCYmKGUrPVwiJlwiKSxlKz1lbmNvZGVVUklDb21wb25lbnQocikrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHRbcl0pKTtyZXR1cm4gZX0sZS5kZWNvZGU9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXt9LHI9dC5zcGxpdChcIiZcIiksbj0wLG89ci5sZW5ndGg7bjxvO24rKyl7dmFyIGk9cltuXS5zcGxpdChcIj1cIik7ZVtkZWNvZGVVUklDb21wb25lbnQoaVswXSldPWRlY29kZVVSSUNvbXBvbmVudChpWzFdKX1yZXR1cm4gZX19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7dmFyIHI9ZnVuY3Rpb24oKXt9O3IucHJvdG90eXBlPWUucHJvdG90eXBlLHQucHJvdG90eXBlPW5ldyByLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXR9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7dmFyIGU9XCJcIjtkbyBlPXNbdCVhXStlLHQ9TWF0aC5mbG9vcih0L2EpO3doaWxlKHQ+MCk7cmV0dXJuIGV9ZnVuY3Rpb24gbih0KXt2YXIgZT0wO2ZvcihoPTA7aDx0Lmxlbmd0aDtoKyspZT1lKmErY1t0LmNoYXJBdChoKV07cmV0dXJuIGV9ZnVuY3Rpb24gbygpe3ZhciB0PXIoK25ldyBEYXRlKTtyZXR1cm4gdCE9PWk/KHU9MCxpPXQpOnQrXCIuXCIrcih1KyspfWZvcih2YXIgaSxzPVwiMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXotX1wiLnNwbGl0KFwiXCIpLGE9NjQsYz17fSx1PTAsaD0wO2g8YTtoKyspY1tzW2hdXT1oO28uZW5jb2RlPXIsby5kZWNvZGU9bix0LmV4cG9ydHM9b30sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8odCl7aS5jYWxsKHRoaXMsdCksdGhpcy5xdWVyeT10aGlzLnF1ZXJ5fHx7fSxhfHwoZS5fX19laW98fChlLl9fX2Vpbz1bXSksYT1lLl9fX2VpbyksdGhpcy5pbmRleD1hLmxlbmd0aDt2YXIgcj10aGlzO2EucHVzaChmdW5jdGlvbih0KXtyLm9uRGF0YSh0KX0pLHRoaXMucXVlcnkuaj10aGlzLmluZGV4LGUuZG9jdW1lbnQmJmUuYWRkRXZlbnRMaXN0ZW5lciYmZS5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsZnVuY3Rpb24oKXtyLnNjcmlwdCYmKHIuc2NyaXB0Lm9uZXJyb3I9bil9LCExKX12YXIgaT1yKDI1KSxzPXIoMzcpO3QuZXhwb3J0cz1vO3ZhciBhLGM9L1xcbi9nLHU9L1xcXFxuL2c7cyhvLGkpLG8ucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PSExLG8ucHJvdG90eXBlLmRvQ2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnNjcmlwdCYmKHRoaXMuc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5zY3JpcHQpLHRoaXMuc2NyaXB0PW51bGwpLHRoaXMuZm9ybSYmKHRoaXMuZm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZm9ybSksdGhpcy5mb3JtPW51bGwsdGhpcy5pZnJhbWU9bnVsbCksaS5wcm90b3R5cGUuZG9DbG9zZS5jYWxsKHRoaXMpfSxvLnByb3RvdHlwZS5kb1BvbGw9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTt0aGlzLnNjcmlwdCYmKHRoaXMuc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5zY3JpcHQpLHRoaXMuc2NyaXB0PW51bGwpLGUuYXN5bmM9ITAsZS5zcmM9dGhpcy51cmkoKSxlLm9uZXJyb3I9ZnVuY3Rpb24oZSl7dC5vbkVycm9yKFwianNvbnAgcG9sbCBlcnJvclwiLGUpfTt2YXIgcj1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKVswXTtyP3IucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSxyKTooZG9jdW1lbnQuaGVhZHx8ZG9jdW1lbnQuYm9keSkuYXBwZW5kQ2hpbGQoZSksdGhpcy5zY3JpcHQ9ZTt2YXIgbj1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiYvZ2Vja28vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO24mJnNldFRpbWVvdXQoZnVuY3Rpb24oKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodCksZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0KX0sMTAwKX0sby5wcm90b3R5cGUuZG9Xcml0ZT1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIoKXtuKCksZSgpfWZ1bmN0aW9uIG4oKXtpZihvLmlmcmFtZSl0cnl7by5mb3JtLnJlbW92ZUNoaWxkKG8uaWZyYW1lKX1jYXRjaCh0KXtvLm9uRXJyb3IoXCJqc29ucCBwb2xsaW5nIGlmcmFtZSByZW1vdmFsIGVycm9yXCIsdCl9dHJ5e3ZhciB0PSc8aWZyYW1lIHNyYz1cImphdmFzY3JpcHQ6MFwiIG5hbWU9XCInK28uaWZyYW1lSWQrJ1wiPic7aT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KHQpfWNhdGNoKHQpe2k9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxpLm5hbWU9by5pZnJhbWVJZCxpLnNyYz1cImphdmFzY3JpcHQ6MFwifWkuaWQ9by5pZnJhbWVJZCxvLmZvcm0uYXBwZW5kQ2hpbGQoaSksby5pZnJhbWU9aX12YXIgbz10aGlzO2lmKCF0aGlzLmZvcm0pe3ZhciBpLHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIiksaD10aGlzLmlmcmFtZUlkPVwiZWlvX2lmcmFtZV9cIit0aGlzLmluZGV4O3MuY2xhc3NOYW1lPVwic29ja2V0aW9cIixzLnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIixzLnN0eWxlLnRvcD1cIi0xMDAwcHhcIixzLnN0eWxlLmxlZnQ9XCItMTAwMHB4XCIscy50YXJnZXQ9aCxzLm1ldGhvZD1cIlBPU1RcIixzLnNldEF0dHJpYnV0ZShcImFjY2VwdC1jaGFyc2V0XCIsXCJ1dGYtOFwiKSxhLm5hbWU9XCJkXCIscy5hcHBlbmRDaGlsZChhKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpLHRoaXMuZm9ybT1zLHRoaXMuYXJlYT1hfXRoaXMuZm9ybS5hY3Rpb249dGhpcy51cmkoKSxuKCksdD10LnJlcGxhY2UodSxcIlxcXFxcXG5cIiksdGhpcy5hcmVhLnZhbHVlPXQucmVwbGFjZShjLFwiXFxcXG5cIik7dHJ5e3RoaXMuZm9ybS5zdWJtaXQoKX1jYXRjaCh0KXt9dGhpcy5pZnJhbWUuYXR0YWNoRXZlbnQ/dGhpcy5pZnJhbWUub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7XCJjb21wbGV0ZVwiPT09by5pZnJhbWUucmVhZHlTdGF0ZSYmcigpO1xufTp0aGlzLmlmcmFtZS5vbmxvYWQ9cn19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgZT10JiZ0LmZvcmNlQmFzZTY0O2UmJih0aGlzLnN1cHBvcnRzQmluYXJ5PSExKSx0aGlzLnBlck1lc3NhZ2VEZWZsYXRlPXQucGVyTWVzc2FnZURlZmxhdGUsdGhpcy51c2luZ0Jyb3dzZXJXZWJTb2NrZXQ9cCYmIXQuZm9yY2VOb2RlLHRoaXMudXNpbmdCcm93c2VyV2ViU29ja2V0fHwoZj1vKSxpLmNhbGwodGhpcyx0KX12YXIgbyxpPXIoMjYpLHM9cigyNyksYT1yKDM2KSxjPXIoMzcpLHU9cigzOCksaD1yKDMpKFwiZW5naW5lLmlvLWNsaWVudDp3ZWJzb2NrZXRcIikscD1lLldlYlNvY2tldHx8ZS5Nb3pXZWJTb2NrZXQ7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyl0cnl7bz1yKDQxKX1jYXRjaCh0KXt9dmFyIGY9cDtmfHxcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93fHwoZj1vKSx0LmV4cG9ydHM9bixjKG4saSksbi5wcm90b3R5cGUubmFtZT1cIndlYnNvY2tldFwiLG4ucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PSEwLG4ucHJvdG90eXBlLmRvT3Blbj1mdW5jdGlvbigpe2lmKHRoaXMuY2hlY2soKSl7dmFyIHQ9dGhpcy51cmkoKSxlPXZvaWQgMCxyPXthZ2VudDp0aGlzLmFnZW50LHBlck1lc3NhZ2VEZWZsYXRlOnRoaXMucGVyTWVzc2FnZURlZmxhdGV9O3IucGZ4PXRoaXMucGZ4LHIua2V5PXRoaXMua2V5LHIucGFzc3BocmFzZT10aGlzLnBhc3NwaHJhc2Usci5jZXJ0PXRoaXMuY2VydCxyLmNhPXRoaXMuY2Esci5jaXBoZXJzPXRoaXMuY2lwaGVycyxyLnJlamVjdFVuYXV0aG9yaXplZD10aGlzLnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmV4dHJhSGVhZGVycyYmKHIuaGVhZGVycz10aGlzLmV4dHJhSGVhZGVycyksdGhpcy5sb2NhbEFkZHJlc3MmJihyLmxvY2FsQWRkcmVzcz10aGlzLmxvY2FsQWRkcmVzcyk7dHJ5e3RoaXMud3M9dGhpcy51c2luZ0Jyb3dzZXJXZWJTb2NrZXQ/bmV3IGYodCk6bmV3IGYodCxlLHIpfWNhdGNoKHQpe3JldHVybiB0aGlzLmVtaXQoXCJlcnJvclwiLHQpfXZvaWQgMD09PXRoaXMud3MuYmluYXJ5VHlwZSYmKHRoaXMuc3VwcG9ydHNCaW5hcnk9ITEpLHRoaXMud3Muc3VwcG9ydHMmJnRoaXMud3Muc3VwcG9ydHMuYmluYXJ5Pyh0aGlzLnN1cHBvcnRzQmluYXJ5PSEwLHRoaXMud3MuYmluYXJ5VHlwZT1cIm5vZGVidWZmZXJcIik6dGhpcy53cy5iaW5hcnlUeXBlPVwiYXJyYXlidWZmZXJcIix0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCl9fSxuLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy53cy5vbm9wZW49ZnVuY3Rpb24oKXt0Lm9uT3BlbigpfSx0aGlzLndzLm9uY2xvc2U9ZnVuY3Rpb24oKXt0Lm9uQ2xvc2UoKX0sdGhpcy53cy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7dC5vbkRhdGEoZS5kYXRhKX0sdGhpcy53cy5vbmVycm9yPWZ1bmN0aW9uKGUpe3Qub25FcnJvcihcIndlYnNvY2tldCBlcnJvclwiLGUpfX0sbi5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcigpe24uZW1pdChcImZsdXNoXCIpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLndyaXRhYmxlPSEwLG4uZW1pdChcImRyYWluXCIpfSwwKX12YXIgbj10aGlzO3RoaXMud3JpdGFibGU9ITE7Zm9yKHZhciBvPXQubGVuZ3RoLGk9MCxhPW87aTxhO2krKykhZnVuY3Rpb24odCl7cy5lbmNvZGVQYWNrZXQodCxuLnN1cHBvcnRzQmluYXJ5LGZ1bmN0aW9uKGkpe2lmKCFuLnVzaW5nQnJvd3NlcldlYlNvY2tldCl7dmFyIHM9e307aWYodC5vcHRpb25zJiYocy5jb21wcmVzcz10Lm9wdGlvbnMuY29tcHJlc3MpLG4ucGVyTWVzc2FnZURlZmxhdGUpe3ZhciBhPVwic3RyaW5nXCI9PXR5cGVvZiBpP2UuQnVmZmVyLmJ5dGVMZW5ndGgoaSk6aS5sZW5ndGg7YTxuLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZCYmKHMuY29tcHJlc3M9ITEpfX10cnl7bi51c2luZ0Jyb3dzZXJXZWJTb2NrZXQ/bi53cy5zZW5kKGkpOm4ud3Muc2VuZChpLHMpfWNhdGNoKHQpe2goXCJ3ZWJzb2NrZXQgY2xvc2VkIGJlZm9yZSBvbmNsb3NlIGV2ZW50XCIpfS0tb3x8cigpfSl9KHRbaV0pfSxuLnByb3RvdHlwZS5vbkNsb3NlPWZ1bmN0aW9uKCl7aS5wcm90b3R5cGUub25DbG9zZS5jYWxsKHRoaXMpfSxuLnByb3RvdHlwZS5kb0Nsb3NlPWZ1bmN0aW9uKCl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHRoaXMud3MmJnRoaXMud3MuY2xvc2UoKX0sbi5wcm90b3R5cGUudXJpPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5xdWVyeXx8e30sZT10aGlzLnNlY3VyZT9cIndzc1wiOlwid3NcIixyPVwiXCI7dGhpcy5wb3J0JiYoXCJ3c3NcIj09PWUmJjQ0MyE9PU51bWJlcih0aGlzLnBvcnQpfHxcIndzXCI9PT1lJiY4MCE9PU51bWJlcih0aGlzLnBvcnQpKSYmKHI9XCI6XCIrdGhpcy5wb3J0KSx0aGlzLnRpbWVzdGFtcFJlcXVlc3RzJiYodFt0aGlzLnRpbWVzdGFtcFBhcmFtXT11KCkpLHRoaXMuc3VwcG9ydHNCaW5hcnl8fCh0LmI2ND0xKSx0PWEuZW5jb2RlKHQpLHQubGVuZ3RoJiYodD1cIj9cIit0KTt2YXIgbj10aGlzLmhvc3RuYW1lLmluZGV4T2YoXCI6XCIpIT09LTE7cmV0dXJuIGUrXCI6Ly9cIisobj9cIltcIit0aGlzLmhvc3RuYW1lK1wiXVwiOnRoaXMuaG9zdG5hbWUpK3IrdGhpcy5wYXRoK3R9LG4ucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKCl7cmV0dXJuISghZnx8XCJfX2luaXRpYWxpemVcImluIGYmJnRoaXMubmFtZT09PW4ucHJvdG90eXBlLm5hbWUpfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt9LGZ1bmN0aW9uKHQsZSl7dmFyIHI9W10uaW5kZXhPZjt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtpZihyKXJldHVybiB0LmluZGV4T2YoZSk7Zm9yKHZhciBuPTA7bjx0Lmxlbmd0aDsrK24paWYodFtuXT09PWUpcmV0dXJuIG47cmV0dXJuLTF9fSxmdW5jdGlvbih0LGUpeyhmdW5jdGlvbihlKXt2YXIgcj0vXltcXF0sOnt9XFxzXSokLyxuPS9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csbz0vXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csaT0vKD86Xnw6fCwpKD86XFxzKlxcWykrL2cscz0vXlxccysvLGE9L1xccyskLzt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHQmJnQ/KHQ9dC5yZXBsYWNlKHMsXCJcIikucmVwbGFjZShhLFwiXCIpLGUuSlNPTiYmSlNPTi5wYXJzZT9KU09OLnBhcnNlKHQpOnIudGVzdCh0LnJlcGxhY2UobixcIkBcIikucmVwbGFjZShvLFwiXVwiKS5yZXBsYWNlKGksXCJcIikpP25ldyBGdW5jdGlvbihcInJldHVybiBcIit0KSgpOnZvaWQgMCk6bnVsbH19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSxyKXt0aGlzLmlvPXQsdGhpcy5uc3A9ZSx0aGlzLmpzb249dGhpcyx0aGlzLmlkcz0wLHRoaXMuYWNrcz17fSx0aGlzLnJlY2VpdmVCdWZmZXI9W10sdGhpcy5zZW5kQnVmZmVyPVtdLHRoaXMuY29ubmVjdGVkPSExLHRoaXMuZGlzY29ubmVjdGVkPSEwLHImJnIucXVlcnkmJih0aGlzLnF1ZXJ5PXIucXVlcnkpLHRoaXMuaW8uYXV0b0Nvbm5lY3QmJnRoaXMub3BlbigpfXZhciBvPXIoNyksaT1yKDM1KSxzPXIoNDUpLGE9cig0NiksYz1yKDQ3KSx1PXIoMykoXCJzb2NrZXQuaW8tY2xpZW50OnNvY2tldFwiKSxoPXIoMjkpO3QuZXhwb3J0cz1lPW47dmFyIHA9e2Nvbm5lY3Q6MSxjb25uZWN0X2Vycm9yOjEsY29ubmVjdF90aW1lb3V0OjEsY29ubmVjdGluZzoxLGRpc2Nvbm5lY3Q6MSxlcnJvcjoxLHJlY29ubmVjdDoxLHJlY29ubmVjdF9hdHRlbXB0OjEscmVjb25uZWN0X2ZhaWxlZDoxLHJlY29ubmVjdF9lcnJvcjoxLHJlY29ubmVjdGluZzoxLHBpbmc6MSxwb25nOjF9LGY9aS5wcm90b3R5cGUuZW1pdDtpKG4ucHJvdG90eXBlKSxuLnByb3RvdHlwZS5zdWJFdmVudHM9ZnVuY3Rpb24oKXtpZighdGhpcy5zdWJzKXt2YXIgdD10aGlzLmlvO3RoaXMuc3Vicz1bYSh0LFwib3BlblwiLGModGhpcyxcIm9ub3BlblwiKSksYSh0LFwicGFja2V0XCIsYyh0aGlzLFwib25wYWNrZXRcIikpLGEodCxcImNsb3NlXCIsYyh0aGlzLFwib25jbG9zZVwiKSldfX0sbi5wcm90b3R5cGUub3Blbj1uLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29ubmVjdGVkP3RoaXM6KHRoaXMuc3ViRXZlbnRzKCksdGhpcy5pby5vcGVuKCksXCJvcGVuXCI9PT10aGlzLmlvLnJlYWR5U3RhdGUmJnRoaXMub25vcGVuKCksdGhpcy5lbWl0KFwiY29ubmVjdGluZ1wiKSx0aGlzKX0sbi5wcm90b3R5cGUuc2VuZD1mdW5jdGlvbigpe3ZhciB0PXMoYXJndW1lbnRzKTtyZXR1cm4gdC51bnNoaWZ0KFwibWVzc2FnZVwiKSx0aGlzLmVtaXQuYXBwbHkodGhpcyx0KSx0aGlzfSxuLnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKHQpe2lmKHAuaGFzT3duUHJvcGVydHkodCkpcmV0dXJuIGYuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXM7dmFyIGU9cyhhcmd1bWVudHMpLHI9by5FVkVOVDtoKGUpJiYocj1vLkJJTkFSWV9FVkVOVCk7dmFyIG49e3R5cGU6cixkYXRhOmV9O3JldHVybiBuLm9wdGlvbnM9e30sbi5vcHRpb25zLmNvbXByZXNzPSF0aGlzLmZsYWdzfHwhMSE9PXRoaXMuZmxhZ3MuY29tcHJlc3MsXCJmdW5jdGlvblwiPT10eXBlb2YgZVtlLmxlbmd0aC0xXSYmKHUoXCJlbWl0dGluZyBwYWNrZXQgd2l0aCBhY2sgaWQgJWRcIix0aGlzLmlkcyksdGhpcy5hY2tzW3RoaXMuaWRzXT1lLnBvcCgpLG4uaWQ9dGhpcy5pZHMrKyksdGhpcy5jb25uZWN0ZWQ/dGhpcy5wYWNrZXQobik6dGhpcy5zZW5kQnVmZmVyLnB1c2gobiksZGVsZXRlIHRoaXMuZmxhZ3MsdGhpc30sbi5wcm90b3R5cGUucGFja2V0PWZ1bmN0aW9uKHQpe3QubnNwPXRoaXMubnNwLHRoaXMuaW8ucGFja2V0KHQpfSxuLnByb3RvdHlwZS5vbm9wZW49ZnVuY3Rpb24oKXt1KFwidHJhbnNwb3J0IGlzIG9wZW4gLSBjb25uZWN0aW5nXCIpLFwiL1wiIT09dGhpcy5uc3AmJih0aGlzLnF1ZXJ5P3RoaXMucGFja2V0KHt0eXBlOm8uQ09OTkVDVCxxdWVyeTp0aGlzLnF1ZXJ5fSk6dGhpcy5wYWNrZXQoe3R5cGU6by5DT05ORUNUfSkpfSxuLnByb3RvdHlwZS5vbmNsb3NlPWZ1bmN0aW9uKHQpe3UoXCJjbG9zZSAoJXMpXCIsdCksdGhpcy5jb25uZWN0ZWQ9ITEsdGhpcy5kaXNjb25uZWN0ZWQ9ITAsZGVsZXRlIHRoaXMuaWQsdGhpcy5lbWl0KFwiZGlzY29ubmVjdFwiLHQpfSxuLnByb3RvdHlwZS5vbnBhY2tldD1mdW5jdGlvbih0KXtpZih0Lm5zcD09PXRoaXMubnNwKXN3aXRjaCh0LnR5cGUpe2Nhc2Ugby5DT05ORUNUOnRoaXMub25jb25uZWN0KCk7YnJlYWs7Y2FzZSBvLkVWRU5UOnRoaXMub25ldmVudCh0KTticmVhaztjYXNlIG8uQklOQVJZX0VWRU5UOnRoaXMub25ldmVudCh0KTticmVhaztjYXNlIG8uQUNLOnRoaXMub25hY2sodCk7YnJlYWs7Y2FzZSBvLkJJTkFSWV9BQ0s6dGhpcy5vbmFjayh0KTticmVhaztjYXNlIG8uRElTQ09OTkVDVDp0aGlzLm9uZGlzY29ubmVjdCgpO2JyZWFrO2Nhc2Ugby5FUlJPUjp0aGlzLmVtaXQoXCJlcnJvclwiLHQuZGF0YSl9fSxuLnByb3RvdHlwZS5vbmV2ZW50PWZ1bmN0aW9uKHQpe3ZhciBlPXQuZGF0YXx8W107dShcImVtaXR0aW5nIGV2ZW50ICVqXCIsZSksbnVsbCE9dC5pZCYmKHUoXCJhdHRhY2hpbmcgYWNrIGNhbGxiYWNrIHRvIGV2ZW50XCIpLGUucHVzaCh0aGlzLmFjayh0LmlkKSkpLHRoaXMuY29ubmVjdGVkP2YuYXBwbHkodGhpcyxlKTp0aGlzLnJlY2VpdmVCdWZmZXIucHVzaChlKX0sbi5wcm90b3R5cGUuYWNrPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMscj0hMTtyZXR1cm4gZnVuY3Rpb24oKXtpZighcil7cj0hMDt2YXIgbj1zKGFyZ3VtZW50cyk7dShcInNlbmRpbmcgYWNrICVqXCIsbik7dmFyIGk9aChuKT9vLkJJTkFSWV9BQ0s6by5BQ0s7ZS5wYWNrZXQoe3R5cGU6aSxpZDp0LGRhdGE6bn0pfX19LG4ucHJvdG90eXBlLm9uYWNrPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuYWNrc1t0LmlkXTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBlPyh1KFwiY2FsbGluZyBhY2sgJXMgd2l0aCAlalwiLHQuaWQsdC5kYXRhKSxlLmFwcGx5KHRoaXMsdC5kYXRhKSxkZWxldGUgdGhpcy5hY2tzW3QuaWRdKTp1KFwiYmFkIGFjayAlc1wiLHQuaWQpfSxuLnByb3RvdHlwZS5vbmNvbm5lY3Q9ZnVuY3Rpb24oKXt0aGlzLmNvbm5lY3RlZD0hMCx0aGlzLmRpc2Nvbm5lY3RlZD0hMSx0aGlzLmVtaXQoXCJjb25uZWN0XCIpLHRoaXMuZW1pdEJ1ZmZlcmVkKCl9LG4ucHJvdG90eXBlLmVtaXRCdWZmZXJlZD1mdW5jdGlvbigpe3ZhciB0O2Zvcih0PTA7dDx0aGlzLnJlY2VpdmVCdWZmZXIubGVuZ3RoO3QrKylmLmFwcGx5KHRoaXMsdGhpcy5yZWNlaXZlQnVmZmVyW3RdKTtmb3IodGhpcy5yZWNlaXZlQnVmZmVyPVtdLHQ9MDt0PHRoaXMuc2VuZEJ1ZmZlci5sZW5ndGg7dCsrKXRoaXMucGFja2V0KHRoaXMuc2VuZEJ1ZmZlclt0XSk7dGhpcy5zZW5kQnVmZmVyPVtdfSxuLnByb3RvdHlwZS5vbmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXt1KFwic2VydmVyIGRpc2Nvbm5lY3QgKCVzKVwiLHRoaXMubnNwKSx0aGlzLmRlc3Ryb3koKSx0aGlzLm9uY2xvc2UoXCJpbyBzZXJ2ZXIgZGlzY29ubmVjdFwiKX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2lmKHRoaXMuc3Vicyl7Zm9yKHZhciB0PTA7dDx0aGlzLnN1YnMubGVuZ3RoO3QrKyl0aGlzLnN1YnNbdF0uZGVzdHJveSgpO3RoaXMuc3Vicz1udWxsfXRoaXMuaW8uZGVzdHJveSh0aGlzKX0sbi5wcm90b3R5cGUuY2xvc2U9bi5wcm90b3R5cGUuZGlzY29ubmVjdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbm5lY3RlZCYmKHUoXCJwZXJmb3JtaW5nIGRpc2Nvbm5lY3QgKCVzKVwiLHRoaXMubnNwKSx0aGlzLnBhY2tldCh7dHlwZTpvLkRJU0NPTk5FQ1R9KSksdGhpcy5kZXN0cm95KCksdGhpcy5jb25uZWN0ZWQmJnRoaXMub25jbG9zZShcImlvIGNsaWVudCBkaXNjb25uZWN0XCIpLHRoaXN9LG4ucHJvdG90eXBlLmNvbXByZXNzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmZsYWdzPXRoaXMuZmxhZ3N8fHt9LHRoaXMuZmxhZ3MuY29tcHJlc3M9dCx0aGlzfX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQsZSl7dmFyIHI9W107ZT1lfHwwO2Zvcih2YXIgbj1lfHwwO248dC5sZW5ndGg7bisrKXJbbi1lXT10W25dO3JldHVybiByfXQuZXhwb3J0cz1yfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlLHIpe3JldHVybiB0Lm9uKGUscikse2Rlc3Ryb3k6ZnVuY3Rpb24oKXt0LnJlbW92ZUxpc3RlbmVyKGUscil9fX10LmV4cG9ydHM9cn0sZnVuY3Rpb24odCxlKXt2YXIgcj1bXS5zbGljZTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtpZihcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9dFtlXSksXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgRXJyb3IoXCJiaW5kKCkgcmVxdWlyZXMgYSBmdW5jdGlvblwiKTt2YXIgbj1yLmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBlLmFwcGx5KHQsbi5jb25jYXQoci5jYWxsKGFyZ3VtZW50cykpKX19fSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7dD10fHx7fSx0aGlzLm1zPXQubWlufHwxMDAsdGhpcy5tYXg9dC5tYXh8fDFlNCx0aGlzLmZhY3Rvcj10LmZhY3Rvcnx8Mix0aGlzLmppdHRlcj10LmppdHRlcj4wJiZ0LmppdHRlcjw9MT90LmppdHRlcjowLHRoaXMuYXR0ZW1wdHM9MH10LmV4cG9ydHM9cixyLnByb3RvdHlwZS5kdXJhdGlvbj1mdW5jdGlvbigpe3ZhciB0PXRoaXMubXMqTWF0aC5wb3codGhpcy5mYWN0b3IsdGhpcy5hdHRlbXB0cysrKTtpZih0aGlzLmppdHRlcil7dmFyIGU9TWF0aC5yYW5kb20oKSxyPU1hdGguZmxvb3IoZSp0aGlzLmppdHRlcip0KTt0PTA9PSgxJk1hdGguZmxvb3IoMTAqZSkpP3Qtcjp0K3J9cmV0dXJuIDB8TWF0aC5taW4odCx0aGlzLm1heCl9LHIucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5hdHRlbXB0cz0wfSxyLnByb3RvdHlwZS5zZXRNaW49ZnVuY3Rpb24odCl7dGhpcy5tcz10fSxyLnByb3RvdHlwZS5zZXRNYXg9ZnVuY3Rpb24odCl7dGhpcy5tYXg9dH0sci5wcm90b3R5cGUuc2V0Sml0dGVyPWZ1bmN0aW9uKHQpe3RoaXMuaml0dGVyPXR9fV0pfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuaW8ubWluLmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFnQkE7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTs7O0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBVEE7QUFXQTtBQVhBO0FBYUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7OztBQUFBO0FBT0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEvQ0E7QUFpREE7QUFDQTtBQUVBOzs7Ozs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUVBOzs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFOQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7Ozs7OztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDL0VBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=