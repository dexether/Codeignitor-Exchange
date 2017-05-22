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

var Table = function (element, key, data) {
    var k = 10; //count of the recirds

    var table = $(element);
    var keys = key;
    var tableValue = data || [];
    var countOfRows = tableValue.length < k ? tableValue.length : k;
    var pageNumber = 1;
    var pageCount;
    if (tableValue.length % countOfRows === 0) {
        pageCount = Math.round(tableValue.length / countOfRows);
    } else {
        pageCount = Math.round(tableValue.length / countOfRows) + 1;
    }

    function createPagination() {

        console.log('+');
        $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        $(table).find('.first').on('click', function () {
            pageNumber = 1;
            changePageView();
        });
        $(table).find('.next').on('click', function () {
            if (pageNumber < pageCount) {
                pageNumber++;
                changePageView();
            }
        });
        $(table).find('.prevent').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                changePageView();
            }
        });
        $(table).find('.last').on('click', function () {
            pageNumber = pageCount;
            changePageView();
        });
    }
    ;

    function deletePagination() {
        $(table).find('.paginnation').remove();
    }
    ;

    //Recount the numbers of the pagination
    function changePageView() {
        var length = tableValue.length;

        if (length % countOfRows === 0 && length > countOfRows) {
            pageCount = Math.round(length / countOfRows);
        } else pageCount = Math.round(length / countOfRows) + 1;
        if (pageCount < pageNumber) {
            pageNumber = pageCount;
        }

        //Replace the numbers
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);

        updateTable();
    }
    ;

    function updateTable() {
        var row = '';
        var messageTemplate = '';
        for (var i = 0; i < countOfRows; i++) {
            var rowOfTable = $(table).find('tr:eq( ' + (i + 1) + ')');

            row = '<tr>';
            if (tableValue[i + k * (pageNumber - 1)]) {
                for (var key in keys) {
                    row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';
                if (rowOfTable.length === 0) {
                    if (countOfRows > $(table).find('tr').length) $(table).find('tbody').append(row);
                } else {
                    if (countOfRows >= $(table).find('tr').length) {
                        $(rowOfTable).replaceWith(row);
                    } else {
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
        createTable: function () {
            var row = '+';
            var rowTemplate = '';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    row += '<td>' + tableValue[i][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';
                rowTemplate += row;
            }
            ;

            $(table).find('tbody').html('').append(rowTemplate);

            console.log(tableValue.length, table);
            if (countOfRows < tableValue.length) {
                createPagination();
            }
        },

        updateValue: function (value) {
            tableValue = value;
            if (countOfRows < value.length) {
                if ($(table).find('.paginnation').length === 0) createPagination();
                countOfRows = k;
            } else {
                deletePagination();
            }
            ;

            changePageView();
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
    var io = __webpack_require__(8);
    var Table = __webpack_require__(7);

    var room = user.room;

    var ask = objectOfTables['asks'],
        bids = objectOfTables['bids'],
        trade = objectOfTables['marketHistory'],
        orderOpen = objectOfTables['openOrders'],
        orderHistory = objectOfTables['orderHistory'];

    return function () {
        if (!window.WebSocket) {
            alert('Your browser does not support WebSocket.');
        }
        ;

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

//Each tables contain the object with data
var bidsTable, asksTable, marketHistoryTable, openOrdersTable, orderHistoryTable;

var initData = __webpack_require__(1);
var init;

$.ajax({
    url: "http://localhost:7777/get_init_data",
    data: {
        'room': room
    },
    type: "post",
    dataType: "json"
}).done(function (json) {
    user = new User(json); //store the user data
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
            createChart();
        }
    };
}
;

module.exports = ChartMarket();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var Table = function () {
    var table;
    var tableValue = [];
    var pageNumber = 1;
    var pageCount = 1;
    var countOfRows = 6;

    function changePageView() {
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
    }
    ;

    function updateTable() {
        changePageView();

        var count = pageCount !== pageNumber ? countOfRows : Math.round(10 * tableValue.length / countOfRows) - Math.round(tableValue.length / countOfRows);
        var data = tableValue.splice((pageNumber - 1) * countOfRows, count);
        for (var i = 0; i < countOfRows; i++) {
            if (data[i]) {
                var bid = '<tr><td>' + Math.round(data[i]['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(data[i]['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + data[i]['size(ngl)'] + '</td>\n\
                        <td>' + data[i]['bid(btc)'] + '</td></tr>';
            } else {
                var bid = '<tr><td></td>\n\
                        <td></td>\n\
                        <td></td>\n\
                        <td></td></tr>';
            }
            ;
            $(table).find('tr:eq( ' + (i + 1) + ')').replaceWith(bid);
        }
        ;
    }
    ;

    return {
        setCount: function (newValue) {
            countOfRows = newValue;
        },

        updateValue: function (value) {
            tableValue = value;
            if (value.length % countOfRows === 0) pageCount = Math.round(value.length / countOfRows);else pageCount = Math.round(value.length / countOfRows) + 1;

            if (pageCount < pageNumber && pageCount > 1) pageNumber = pageCount - 1;

            updateTable();
        },

        createTable: function (element) {
            table = element;
            var messageTemplate = '<tr><th>Sum</th><th>Total</th><th>Size (NLG)</th><th>Bid (BTC)</th></tr>';
            var row = '+';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr class="row-' + i + '"><td></td><td> </td><td> </td><td> </td></tr>';
                messageTemplate += row;
            }

            $(table).find('tbody').html('').append(messageTemplate);
            $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
            $(table).find('.first').on('click', function () {
                pageNumber = 1;
                updateTable();
            });
            $(table).find('.next').on('click', function () {
                if (pageNumber < pageCount) {
                    pageNumber++;
                    changePageView();
                    updateTable();
                }
            });
            $(table).find('.prevent').on('click', function () {
                if (pageNumber > 1) {
                    pageNumber--;
                    changePageView();
                    updateTable();
                }
            });
            $(table).find('.last').on('click', function () {
                pageNumber = pageCount;
                updateTable();
            });
        }

    };
};

module.exports = Table;

/***/ }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTMzMmJiMDRmMzdkZTY5N2ZlYWIiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9zZXJ2aWNlcy9pbml0X3BhZ2UuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NldmljZXMvdGFibGUuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NldmljZXMvdXNlci5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvcm9vbS9yb29tLmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vY2hhcnQuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZXNPcmRlckJvb2suanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuaW8ubWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDUzMzJiYjA0ZjM3ZGU2OTdmZWFiIiwidmFyIGNvbmZpZyA9IHtcbiAgICAnY291bnRfcm93X2JpZHMnOiA1LFxuICAgICdrZXlfYmlkcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdrZXlfYXNrcyc6IFsnc3VtJywgJ3RvdGFsJywgJ3NpemUobmdsKScsICdiaWQoYnRjKSddLFxuICAgICdjb3VudF9yb3dfYXNrJzogNSxcbiAgICAnY291bnRfdHJhZGVfaGlzdG9yeSc6IDEwLFxuICAgICdrZXlzX21hcmtldF9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0J10sXG4gICAgJ2NvdW50X29yZGVyX29wZW4nOiA1LFxuICAgICdrZXlzX29yZGVyX29wZW4nOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ2NvdW50X29yZGVyX2hpc3RvcnknOiA1LFxuICAgICdrZXlzX29yZGVyX2hpc3RvcnknOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ3Jvb21zJzogW1xuICAgICAgICAnR1RTLU5MRycsXG4gICAgICAgICdFVVItTkxHJ1xuICAgIF1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9jb25maWcuanMiLCJ2YXIgaW5pdERhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBiaWRzID0gZGF0YVsnb3JkZXJfYm9va3MnXVsnYmlkcyddIHx8IFtdO1xuICAgIHZhciBhc2tzID0gZGF0YVsnb3JkZXJfYm9va3MnXVsnYXNrcyddIHx8IFtdO1xuICAgIHZhciBtYXJrZXRfaGlzdG9yeSA9IChkYXRhWydtYXJrZXRfaGlzdG9yeSddKSB8fCBbXTtcbiAgICB2YXIgb3Blbl9vcmRlcnMgPSAoZGF0YVsnb3Blbl9vcmRlcnMnXSkgfHwgW107XG4gICAgdmFyIG9yZGVyX2hpc3RvcnkgPSAoZGF0YVsnb3JkZXJfaGlzdG9yeSddKSB8fCBbXTtcbiAgICBcbiAgICBmdW5jdGlvbiBiaWRzVCAoKXtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYmlkc1tpXSkge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD4nICsgTWF0aC5yb3VuZChiaWRzW2ldWydzdW0nXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgTWF0aC5yb3VuZChiaWRzW2ldWyd0b3RhbCddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBiaWRzW2ldWydzaXplKG5nbCknXSArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGJpZHNbaV1bJ2JpZChidGMpJ10gKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPjwvdHI+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICQoJyN0YWJsZS1iaWRzJykuZmluZCgndGJvZHknKS5hcHBlbmQoYmlkKTtcblxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBiaWRzVCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhiaWRzLCBhc2tzLCBtYXJrZXRfaGlzdG9yeSwgb3Blbl9vcmRlcnMsIG9yZGVyX2hpc3RvcnkpO1xuICAgICAgICBjb25zb2xlLmxvZygnaW5pdERhdGEgaXMgd29ya2luZyEnKTtcbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXREYXRhO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9yb29tL3NlcnZpY2VzL2luaXRfcGFnZS5qcyIsInZhciBUYWJsZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBrZXksIGRhdGEpIHtcbiAgICB2YXIgayA9IDEwOyAvL2NvdW50IG9mIHRoZSByZWNpcmRzXG5cbiAgICB2YXIgdGFibGUgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBrZXlzID0ga2V5O1xuICAgIHZhciB0YWJsZVZhbHVlID0gZGF0YSB8fCBbXTtcbiAgICB2YXIgY291bnRPZlJvd3MgPSAodGFibGVWYWx1ZS5sZW5ndGggPCBrKSA/IHRhYmxlVmFsdWUubGVuZ3RoIDogaztcbiAgICB2YXIgcGFnZU51bWJlciA9IDE7XG4gICAgdmFyIHBhZ2VDb3VudDtcbiAgICBpZiAodGFibGVWYWx1ZS5sZW5ndGggJSBjb3VudE9mUm93cyA9PT0gMCkge1xuICAgICAgICBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKHRhYmxlVmFsdWUubGVuZ3RoIC8gY291bnRPZlJvd3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodGFibGVWYWx1ZS5sZW5ndGggLyBjb3VudE9mUm93cykgKyAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcrJyk7XG4gICAgICAgICQodGFibGUpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3BhZ2lubmF0aW9uJz5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdmaXJzdCc+Rmlyc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2ZW50Jz5QcmV2ZW50PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3BhZ2UtbnVtYmVyJz5cIiArIHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50ICsgXCI8L3NwYW4+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dCc+TmV4dDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2xhc3QnPkxhc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLmZpcnN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFnZU51bWJlciA8IHBhZ2VDb3VudCkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLnByZXZlbnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFnZU51bWJlciA+IDEpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyLS07XG4gICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQodGFibGUpLmZpbmQoJy5sYXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICA7XG5cbiAgICBmdW5jdGlvbiBkZWxldGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAkKHRhYmxlKS5maW5kKCcucGFnaW5uYXRpb24nKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgO1xuXG4gICAgLy9SZWNvdW50IHRoZSBudW1iZXJzIG9mIHRoZSBwYWdpbmF0aW9uXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFnZVZpZXcoKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0YWJsZVZhbHVlLmxlbmd0aDtcblxuICAgICAgICBpZiAoKGxlbmd0aCAlIGNvdW50T2ZSb3dzID09PSAwKSAmJiAobGVuZ3RoID4gY291bnRPZlJvd3MpKSB7XG4gICAgICAgICAgICBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKGxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKGxlbmd0aCAvIGNvdW50T2ZSb3dzKSArIDE7XG4gICAgICAgIGlmIChwYWdlQ291bnQgPCBwYWdlTnVtYmVyKSB7XG4gICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9SZXBsYWNlIHRoZSBudW1iZXJzXG4gICAgICAgICQodGFibGUpLmZpbmQoJy5wYWdlLW51bWJlcicpLnRleHQocGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQpO1xuXG4gICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgfVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICB2YXIgcm93ID0gJyc7XG4gICAgICAgIHZhciBtZXNzYWdlVGVtcGxhdGUgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudE9mUm93czsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93T2ZUYWJsZSA9ICQodGFibGUpLmZpbmQoJ3RyOmVxKCAnICsgKGkgKyAxKSArICcpJyk7XG5cbiAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgIGlmICh0YWJsZVZhbHVlW2kgKyBrICogKHBhZ2VOdW1iZXIgLSAxKV0pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGFibGVWYWx1ZVtpICsgayAqIChwYWdlTnVtYmVyIC0gMSldW2tleXNba2V5XV0gKyAnPC90ZD4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgaWYgKHJvd09mVGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudE9mUm93cyA+ICQodGFibGUpLmZpbmQoJ3RyJykubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgndGJvZHknKS5hcHBlbmQocm93KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPj0gJCh0YWJsZSkuZmluZCgndHInKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyb3dPZlRhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gJzx0cj4nO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8dGQ+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG5cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfVxuICAgIDtcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlVGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByb3cgPSAnKyc7XG4gICAgICAgICAgICB2YXIgcm93VGVtcGxhdGUgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGFibGVWYWx1ZVtpXVtrZXlzW2tleV1dICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgIHJvd1RlbXBsYXRlICs9IHJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgJCh0YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ3Rib2R5JylcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQocm93VGVtcGxhdGUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYmxlVmFsdWUubGVuZ3RoLCB0YWJsZSk7XG4gICAgICAgICAgICBpZiAoY291bnRPZlJvd3MgPCB0YWJsZVZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGFibGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKGNvdW50T2ZSb3dzIDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGFibGUpLmZpbmQoJy5wYWdpbm5hdGlvbicpLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgIGNvdW50T2ZSb3dzID0gaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvc2V2aWNlcy90YWJsZS5qcyIsInZhciBVc2VyID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgdXNlcl9pZCA9IGRhdGFbJ3VzZXJfaWQnXSB8fCAnJztcbiAgICBhY3RpdmVSb29tID0gZGF0YVsncm9vbSddO1xuICAgIHZhciBFVVIgPSBkYXRhWydFVVInXSB8fCAwO1xuICAgIHZhciBOR0wgPSAoZGF0YVsnTkdMJ10pIHx8IDA7XG5cbiAgICByZXR1cm4gIHtcbiAgICAgICAgdXNlcklkOiB1c2VyX2lkLFxuICAgICAgICByb29tOiBhY3RpdmVSb29tLFxuICAgICAgICBldXJBdmFsYWlibGU6IEVVUixcbiAgICAgICAgbmdsQXZhbGFpYmxlOiBOR0xcbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NldmljZXMvdXNlci5qcyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gQ2xpZW50U29ja2V0cyhvYmplY3RPZlRhYmxlcywgdXNlcikgeyAgICBcbiAgICB2YXIgaW8gPSByZXF1aXJlKCcuL3NvY2tldC5pby5taW4nKTtcbiAgICB2YXIgVGFibGUgPSByZXF1aXJlKCcuL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc09yZGVyQm9vaycpO1xuICAgIFxuICAgIHZhciByb29tID0gdXNlci5yb29tO1xuICAgIFxuICAgIHZhciBhc2sgPSBvYmplY3RPZlRhYmxlc1snYXNrcyddLFxuICAgICAgICAgICAgYmlkcyA9IG9iamVjdE9mVGFibGVzWydiaWRzJ10sXG4gICAgICAgICAgICB0cmFkZSA9IG9iamVjdE9mVGFibGVzWydtYXJrZXRIaXN0b3J5J10sXG4gICAgICAgICAgICBvcmRlck9wZW4gPSBvYmplY3RPZlRhYmxlc1snb3Blbk9yZGVycyddLFxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5ID0gb2JqZWN0T2ZUYWJsZXNbJ29yZGVySGlzdG9yeSddO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuV2ViU29ja2V0KSB7XG4gICAgICAgICAgICBhbGVydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgV2ViU29ja2V0LicpO1xuICAgICAgICB9XG4gICAgICAgIDtcblxuICAgICAgICAvLyBjcmVhdGUgY29ubmVjdGlvblxuICAgICAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgY2hhcnQgPSByZXF1aXJlKCcuL2NoYXJ0Jyk7XG5cbiAgICAgICAgICAgIC8vQ29ubmVjdGlvbiB0byB0aGUgcm9vbVxuICAgICAgICAgICAgc29ja2V0LmVtaXQoJ3Jvb20nLCByb29tKTtcblxuXG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnZGF0YV90b19jaGFydCcsICcnKTtcbiAgICAgICAgICAgIHNvY2tldC5vbignZGF0YV90b19jaGFydCcsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBjaGFydC5sb2FkRGF0YShtc2cpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vTGlzdGVuIHRoZSBzb2NrZXRzIHRvIGNoYW5nZSB0aGUgdGFibGVzXG4gICAgICAgICAgICBzb2NrZXQub24oJ2FzaycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBhc2sudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2JpZHMnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgYmlkcy51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigndHJhZGVfaGlzdG9yeScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICB0cmFkZS51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignb3JkZXJfb3BlbicsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBvcmRlck9wZW4udXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ29yZGVyX2hpc3RvcnknLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJIaXN0b3J5LnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIC8vRGV2ZWxvcG1lbnRcbiAgICAgICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG47XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50U29ja2V0cztcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuanMiLCJ2YXIgQ29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XG52YXIgcm9vbTtcbnZhciByb29tcyA9IENvbmZpZ1sncm9vbXMnXTtcbnZhciBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuLy9TZWxlY3Qgcm9vbSAoaWYgVVJMIGNvbnRhaW5zIHRoZSBuYW1lIG9mIHRoZSByb29tKVxucm9vbXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIGlmIChwYXRobmFtZS5pbmRleE9mKGVsZW1lbnQpID49IDApIHtcbiAgICAgICAgcm9vbSA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIDtcbn0pO1xuXG52YXIgQ2xpZW50U29ja2V0cyA9IHJlcXVpcmUoJy4uL3NvY2tldC5pby9zb2NrZXQnKTtcbnZhciBzZXJ2aWNlO1xuXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL3NldmljZXMvdXNlcicpO1xuLy9UaGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHVzZXIgZGF0YVxudmFyIHVzZXI7XG5cbnZhciBUYWJsZSA9IHJlcXVpcmUoJy4uL3NldmljZXMvdGFibGUnKTtcblxuLy9FYWNoIHRhYmxlcyBjb250YWluIHRoZSBvYmplY3Qgd2l0aCBkYXRhXG52YXIgYmlkc1RhYmxlLCBhc2tzVGFibGUsIG1hcmtldEhpc3RvcnlUYWJsZSwgb3Blbk9yZGVyc1RhYmxlLCBvcmRlckhpc3RvcnlUYWJsZTtcblxudmFyIGluaXREYXRhID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9pbml0X3BhZ2UnKTtcbnZhciBpbml0O1xuXG4kLmFqYXgoe1xuICAgIHVybDogXCJodHRwOi8vbG9jYWxob3N0Ojc3NzcvZ2V0X2luaXRfZGF0YVwiLFxuICAgIGRhdGE6IHtcbiAgICAgICAgJ3Jvb20nOiByb29tXG4gICAgfSxcbiAgICB0eXBlOiBcInBvc3RcIixcbiAgICBkYXRhVHlwZTogXCJqc29uXCJcbn0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICB1c2VyID0gbmV3IFVzZXIoanNvbik7ICAvL3N0b3JlIHRoZSB1c2VyIGRhdGFcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coKTtcbiAgICAgICAgICAkKCcjYXZhaWxhYmxlRmlyc3QnKS5odG1sKGpzb25bJ2ZpcnN0Q3VycmVuY3knXSk7XG4gICAgICAgICAgJCgnI2F2YWlsYWJsZVNlY29uZCcpLmh0bWwoanNvblsnc2Vjb25kQ3VycmVuY3knXSk7XG5cbiAgICAgICAgICAgIGJpZHNUYWJsZSA9IG5ldyBUYWJsZSgnI3RhYmxlLWJpZHMnLCBqc29uWydrZXlzJ11bJ2JpZHNfa2V5cyddLCBqc29uWydvcmRlcl9ib29rcyddWydiaWRzJ10pO1xuICAgICAgICAgICAgYmlkc1RhYmxlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAgICAgICAgIGFza3NUYWJsZSA9IG5ldyBUYWJsZSgnI3RhYmxlLWFzaycsIGpzb25bJ2tleXMnXVsnYXNrc19rZXlzJ10sIGpzb25bJ29yZGVyX2Jvb2tzJ11bJ2Fza3MnXSk7XG4gICAgICAgICAgICBhc2tzVGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgbWFya2V0SGlzdG9yeVRhYmxlID0gbmV3IFRhYmxlKCcjbWFya2V0LWhpc3RvcnknLCBqc29uWydrZXlzJ11bJ21hcmtldF9oaXN0b3J5X2tleXMnXSwganNvblsnbWFya2V0X2hpc3RvcnknXSk7XG4gICAgICAgICAgICBtYXJrZXRIaXN0b3J5VGFibGUuY3JlYXRlVGFibGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25bJ21hcmtldF9oaXN0b3J5J10pO1xuXG4gICAgICAgICAgICBvcGVuT3JkZXJzVGFibGUgPSBuZXcgVGFibGUoJyN0YWJsZS1vcGVuJywganNvblsna2V5cyddWydvcmRlcl9vcGVuX2tleXMnXSwganNvblsnb3JkZXJfb3BlbiddKTtcbiAgICAgICAgICAgIG9wZW5PcmRlcnNUYWJsZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgICAgICAgICBvcmRlckhpc3RvcnlUYWJsZSA9IG5ldyBUYWJsZSgnI29yZGVyLWhpc3RvcnknLCBqc29uWydrZXlzJ11bJ29yZGVyX2hpc3Rvcnlfa2V5cyddLCBqc29uWydvcmRlci1oaXN0b3J5J10pO1xuICAgICAgICAgICAgb3JkZXJIaXN0b3J5VGFibGUuY3JlYXRlVGFibGUoKTtcblxuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgQ2xpZW50U29ja2V0cyh7XG4gICAgICAgICAgICAgICAgJ2JpZHMnOiBiaWRzVGFibGUsXG4gICAgICAgICAgICAgICAgJ2Fza3MnOiBhc2tzVGFibGUsXG4gICAgICAgICAgICAgICAgJ21hcmtldEhpc3RvcnknOiBtYXJrZXRIaXN0b3J5VGFibGUsXG4gICAgICAgICAgICAgICAgJ29wZW5PcmRlcnMnOiBvcGVuT3JkZXJzVGFibGUsXG4gICAgICAgICAgICAgICAgJ29yZGVySGlzdG9yeSc6IG9yZGVySGlzdG9yeVRhYmxlXG4gICAgICAgICAgICB9LCB1c2VyKTtcbiAgICAgICAgICAgIHNlcnZpY2UoKTtcblxuICAgICAgICAgICAgLy9pbml0ID0gbmV3IGluaXREYXRhKGpzb24pO1xuICAgICAgICAgICAgLy8gaW5pdCgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgZXJyb3JUaHJvd24pO1xuICAgICAgICB9KVxuICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlIVwiKTtcbiAgICAgICAgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3Jvb20vcm9vbS5qcyIsImZ1bmN0aW9uIENoYXJ0TWFya2V0KCkge1xuICAgIHZhciBkYXRhID0gW107XG4gICAgXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQgKCkge1xuICAgICAgICAgICAgdmFyIGNkYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGFueWNoYXJ0Lm9uRG9jdW1lbnRSZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGRhdGEgdXNlZCBpbiB0aGlzIHNhbXBsZSBjYW4gYmUgb2J0YWluZWQgZnJvbSB0aGUgQ0ROXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL2Nkbi5hbnljaGFydC5jb20vY3N2LWRhdGEvY3Njby1kYWlseS5qc1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGRhdGEgdGFibGUgb24gbG9hZGVkIGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRhYmxlID0gYW55Y2hhcnQuZGF0YS50YWJsZSgpO1xuICAgICAgICAgICAgICAgIGRhdGFUYWJsZS5hZGREYXRhKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gYW55Y2hhcnQuZ3JhcGhpY3MuY3JlYXRlKCdjb250YWluZXJfY2hhcnQnKTtcbiAgICAgICAgICAgICAgICAvLyBtYXAgbG9hZGVkIGRhdGEgZm9yIHRoZSBvaGxjIHNlcmllc1xuICAgICAgICAgICAgICAgIHZhciBtYXBwaW5nID0gZGF0YVRhYmxlLm1hcEFzKHtcbiAgICAgICAgICAgICAgICAgICAgJ29wZW4nOiAxLFxuICAgICAgICAgICAgICAgICAgICAnaGlnaCc6IDIsXG4gICAgICAgICAgICAgICAgICAgICdsb3cnOiAzLFxuICAgICAgICAgICAgICAgICAgICAnY2xvc2UnOiA0LFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB7Y29sdW1uOiA0LCB0eXBlOiAnY2xvc2UnfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFwIGxvYWRlZCBkYXRhIGZvciB0aGUgc2Nyb2xsZXJcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsZXJNYXBwaW5nID0gZGF0YVRhYmxlLm1hcEFzKCk7XG4gICAgICAgICAgICAgICAgc2Nyb2xsZXJNYXBwaW5nLmFkZEZpZWxkKCd2YWx1ZScsIDEwKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBzdG9jayBjaGFydFxuICAgICAgICAgICAgICAgIGNoYXJ0ID0gYW55Y2hhcnQuc3RvY2soKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmaXJzdCBwbG90IG9uIHRoZSBjaGFydFxuICAgICAgICAgICAgICAgIHZhciBwbG90ID0gY2hhcnQucGxvdCgpO1xuICAgICAgICAgICAgICAgIHBsb3QuZ3JpZCgpLmVuYWJsZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcGxvdC5ncmlkKDEpLmVuYWJsZWQodHJ1ZSkubGF5b3V0KCd2ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgICAgIHBsb3QubWlub3JHcmlkKCkuZW5hYmxlZCh0cnVlKTtcbiAgICAgICAgICAgICAgICBwbG90Lm1pbm9yR3JpZCgxKS5lbmFibGVkKHRydWUpLmxheW91dCgndmVydGljYWwnKTtcblxuICAgICAgICAgICAgICAgIHZhciBzZXJpZXMgPSBwbG90LmNhbmRsZXN0aWNrKG1hcHBpbmcpLm5hbWUoJ0NTQ08nKTtcbiAgICAgICAgICAgICAgICBzZXJpZXMubGVnZW5kSXRlbSgpLmljb25UeXBlKCdyaXNpbmdmYWxsaW5nJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgQkJhbmRzIGluZGljYXRvciB3aXRoIHBlcmlvZCAyMFxuICAgICAgICAgICAgICAgIHZhciBiQmFuZHNJbmRpY2F0b3IgPSBwbG90LmJiYW5kcyhtYXBwaW5nKTtcbiAgICAgICAgICAgICAgICBiQmFuZHNJbmRpY2F0b3IuZGV2aWF0aW9uKDIuNSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5kaWNhdG9yUGxvdCA9IGNoYXJ0LnBsb3QoMSk7XG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yUGxvdC5oZWlnaHQoJzMwJScpO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIEJCYW5kcyBXaWR0aCBpbmRpY2F0b3Igd2l0aCBwZXJpb2QgMjBcbiAgICAgICAgICAgICAgICB2YXIgYkJhbmRzV2lkdGhJbmRpY2F0b3IgPSBpbmRpY2F0b3JQbG90LmJiYW5kc1dpZHRoKG1hcHBpbmcpLnNlcmllcygnc3BsaW5lQXJlYScpO1xuICAgICAgICAgICAgICAgIGJCYW5kc1dpZHRoSW5kaWNhdG9yLmRldmlhdGlvbigyLjUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluZGljYXRvclNlcmllcyA9IGJCYW5kc1dpZHRoSW5kaWNhdG9yLnNlcmllcygpO1xuICAgICAgICAgICAgICAgIGluZGljYXRvclNlcmllcy5zdHJva2UoJzEuNSAjRjE4MTI2Jyk7XG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yU2VyaWVzLmZpbGwoYW55Y2hhcnQuY29sb3IubGlnaHRlbihpbmRpY2F0b3JTZXJpZXMuc3Ryb2tlKCkuY29sb3IsIDAuNSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHNjcm9sbGVyIHNlcmllcyB3aXRoIG1hcHBlZCBkYXRhXG4gICAgICAgICAgICAgICAgY2hhcnQuc2Nyb2xsZXIoKS5jYW5kbGVzdGljayhtYXBwaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBjb250YWluZXIgaWQgZm9yIHRoZSBjaGFydFxuICAgICAgICAgICAgICAgIGNoYXJ0LmNvbnRhaW5lcihzdGFnZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY2hhcnQgc2VsZWN0ZWQgZGF0ZS90aW1lIHJhbmdlXG4gICAgICAgICAgICAgICAgY2hhcnQuc2VsZWN0UmFuZ2UoJzE5OTAtMDQtMTgnLCAnMTk5MC0wNS0xNycpO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhdGUgY2hhcnQgZHJhd2luZ1xuICAgICAgICAgICAgICAgIGNoYXJ0LmRyYXcoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBsb2FkRGF0YTogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICAgICAgZGF0YSA9IG9iamVjdFsnZGF0YSddO1xuICAgICAgICAgICAgY3JlYXRlQ2hhcnQgKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0TWFya2V0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9jaGFydC5qcyIsInZhciBUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFibGU7XG4gICAgdmFyIHRhYmxlVmFsdWUgPSBbXTtcbiAgICB2YXIgcGFnZU51bWJlciA9IDE7XG4gICAgdmFyIHBhZ2VDb3VudCA9IDE7XG4gICAgdmFyIGNvdW50T2ZSb3dzID0gNjtcblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhZ2VWaWV3KCkge1xuICAgICAgICAkKHRhYmxlKS5maW5kKCcucGFnZS1udW1iZXInKS50ZXh0KHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50KTtcbiAgICB9XG4gICAgO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gKHBhZ2VDb3VudCAhPT0gcGFnZU51bWJlcikgPyBjb3VudE9mUm93cyA6IE1hdGgucm91bmQoMTAgKiB0YWJsZVZhbHVlLmxlbmd0aCAvIGNvdW50T2ZSb3dzKSAtIE1hdGgucm91bmQodGFibGVWYWx1ZS5sZW5ndGggLyBjb3VudE9mUm93cyk7XG4gICAgICAgIHZhciBkYXRhID0gdGFibGVWYWx1ZS5zcGxpY2UoKHBhZ2VOdW1iZXIgLSAxKSAqIGNvdW50T2ZSb3dzLCBjb3VudCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYmlkID0gJzx0cj48dGQ+JyArIE1hdGgucm91bmQoZGF0YVtpXVsnc3VtJ10gKiAxMDAwMCkgLyAxMDAwMCArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIE1hdGgucm91bmQoZGF0YVtpXVsndG90YWwnXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgZGF0YVtpXVsnc2l6ZShuZ2wpJ10gKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBkYXRhW2ldWydiaWQoYnRjKSddICsgJzwvdGQ+PC90cj4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYmlkID0gJzx0cj48dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD48L3RyPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCd0cjplcSggJyArIChpICsgMSkgKyAnKScpLnJlcGxhY2VXaXRoKGJpZCk7XG5cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfVxuICAgIDtcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0Q291bnQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgY291bnRPZlJvd3MgPSBuZXdWYWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoKHZhbHVlLmxlbmd0aCAlIGNvdW50T2ZSb3dzID09PSAwKSlcbiAgICAgICAgICAgICAgICBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKHZhbHVlLmxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwYWdlQ291bnQgPSBNYXRoLnJvdW5kKHZhbHVlLmxlbmd0aCAvIGNvdW50T2ZSb3dzKSArIDE7XG5cbiAgICAgICAgICAgIGlmICgocGFnZUNvdW50IDwgcGFnZU51bWJlcikmJihwYWdlQ291bnQ+MSkpXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudCAtIDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVGFibGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICB0YWJsZSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZVRlbXBsYXRlID0gJzx0cj48dGg+U3VtPC90aD48dGg+VG90YWw8L3RoPjx0aD5TaXplIChOTEcpPC90aD48dGg+QmlkIChCVEMpPC90aD48L3RyPic7XG4gICAgICAgICAgICB2YXIgcm93ID0gJysnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudE9mUm93czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ID0gJzx0ciBjbGFzcz1cInJvdy0nICsgaSArICdcIj48dGQ+PC90ZD48dGQ+IDwvdGQ+PHRkPiA8L3RkPjx0ZD4gPC90ZD48L3RyPic7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVRlbXBsYXRlICs9IHJvdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ3Rib2R5JylcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQobWVzc2FnZVRlbXBsYXRlKTtcbiAgICAgICAgICAgICQodGFibGUpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3BhZ2lubmF0aW9uJz5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdmaXJzdCc+Rmlyc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2ZW50Jz5QcmV2ZW50PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3BhZ2UtbnVtYmVyJz5cIiArIHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50ICsgXCI8L3NwYW4+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dCc+TmV4dDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2xhc3QnPkxhc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5maXJzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gMTtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcubmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZU51bWJlciA8IHBhZ2VDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyKys7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcucHJldmVudCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZU51bWJlciA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlci0tO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLmxhc3QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZXNPcmRlckJvb2suanMiLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLmlvPWUoKTp0LmlvPWUoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtmdW5jdGlvbiBlKG4pe2lmKHJbbl0pcmV0dXJuIHJbbl0uZXhwb3J0czt2YXIgbz1yW25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gdFtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxlKSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIHI9e307cmV0dXJuIGUubT10LGUuYz1yLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjppKHQpKSYmKGU9dCx0PXZvaWQgMCksZT1lfHx7fTt2YXIgcixuPXModCksYT1uLnNvdXJjZSxwPW4uaWQsZj1uLnBhdGgsbD1oW3BdJiZmIGluIGhbcF0ubnNwcyxkPWUuZm9yY2VOZXd8fGVbXCJmb3JjZSBuZXcgY29ubmVjdGlvblwiXXx8ITE9PT1lLm11bHRpcGxleHx8bDtyZXR1cm4gZD8odShcImlnbm9yaW5nIHNvY2tldCBjYWNoZSBmb3IgJXNcIixhKSxyPWMoYSxlKSk6KGhbcF18fCh1KFwibmV3IGlvIGluc3RhbmNlIGZvciAlc1wiLGEpLGhbcF09YyhhLGUpKSxyPWhbcF0pLG4ucXVlcnkmJiFlLnF1ZXJ5P2UucXVlcnk9bi5xdWVyeTplJiZcIm9iamVjdFwiPT09aShlLnF1ZXJ5KSYmKGUucXVlcnk9byhlLnF1ZXJ5KSksci5zb2NrZXQobi5wYXRoLGUpfWZ1bmN0aW9uIG8odCl7dmFyIGU9W107Zm9yKHZhciByIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShyKSYmZS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChyKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQodFtyXSkpO3JldHVybiBlLmpvaW4oXCImXCIpfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LHM9cigxKSxhPXIoNyksYz1yKDE3KSx1PXIoMykoXCJzb2NrZXQuaW8tY2xpZW50XCIpO3QuZXhwb3J0cz1lPW47dmFyIGg9ZS5tYW5hZ2Vycz17fTtlLnByb3RvY29sPWEucHJvdG9jb2wsZS5jb25uZWN0PW4sZS5NYW5hZ2VyPXIoMTcpLGUuU29ja2V0PXIoNDQpfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxyKXt2YXIgbj10O3I9cnx8ZS5sb2NhdGlvbixudWxsPT10JiYodD1yLnByb3RvY29sK1wiLy9cIityLmhvc3QpLFwic3RyaW5nXCI9PXR5cGVvZiB0JiYoXCIvXCI9PT10LmNoYXJBdCgwKSYmKHQ9XCIvXCI9PT10LmNoYXJBdCgxKT9yLnByb3RvY29sK3Q6ci5ob3N0K3QpLC9eKGh0dHBzP3x3c3M/KTpcXC9cXC8vLnRlc3QodCl8fChpKFwicHJvdG9jb2wtbGVzcyB1cmwgJXNcIix0KSx0PVwidW5kZWZpbmVkXCIhPXR5cGVvZiByP3IucHJvdG9jb2wrXCIvL1wiK3Q6XCJodHRwczovL1wiK3QpLGkoXCJwYXJzZSAlc1wiLHQpLG49byh0KSksbi5wb3J0fHwoL14oaHR0cHx3cykkLy50ZXN0KG4ucHJvdG9jb2wpP24ucG9ydD1cIjgwXCI6L14oaHR0cHx3cylzJC8udGVzdChuLnByb3RvY29sKSYmKG4ucG9ydD1cIjQ0M1wiKSksbi5wYXRoPW4ucGF0aHx8XCIvXCI7dmFyIHM9bi5ob3N0LmluZGV4T2YoXCI6XCIpIT09LTEsYT1zP1wiW1wiK24uaG9zdCtcIl1cIjpuLmhvc3Q7cmV0dXJuIG4uaWQ9bi5wcm90b2NvbCtcIjovL1wiK2ErXCI6XCIrbi5wb3J0LG4uaHJlZj1uLnByb3RvY29sK1wiOi8vXCIrYSsociYmci5wb3J0PT09bi5wb3J0P1wiXCI6XCI6XCIrbi5wb3J0KSxufXZhciBvPXIoMiksaT1yKDMpKFwic29ja2V0LmlvLWNsaWVudDp1cmxcIik7dC5leHBvcnRzPW59KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dmFyIHI9L14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoaHR0cHxodHRwc3x3c3x3c3MpOlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oKD86W2EtZjAtOV17MCw0fTopezIsN31bYS1mMC05XXswLDR9fFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sbj1bXCJzb3VyY2VcIixcInByb3RvY29sXCIsXCJhdXRob3JpdHlcIixcInVzZXJJbmZvXCIsXCJ1c2VyXCIsXCJwYXNzd29yZFwiLFwiaG9zdFwiLFwicG9ydFwiLFwicmVsYXRpdmVcIixcInBhdGhcIixcImRpcmVjdG9yeVwiLFwiZmlsZVwiLFwicXVlcnlcIixcImFuY2hvclwiXTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIGU9dCxvPXQuaW5kZXhPZihcIltcIiksaT10LmluZGV4T2YoXCJdXCIpO28hPS0xJiZpIT0tMSYmKHQ9dC5zdWJzdHJpbmcoMCxvKSt0LnN1YnN0cmluZyhvLGkpLnJlcGxhY2UoLzovZyxcIjtcIikrdC5zdWJzdHJpbmcoaSx0Lmxlbmd0aCkpO2Zvcih2YXIgcz1yLmV4ZWModHx8XCJcIiksYT17fSxjPTE0O2MtLTspYVtuW2NdXT1zW2NdfHxcIlwiO3JldHVybiBvIT0tMSYmaSE9LTEmJihhLnNvdXJjZT1lLGEuaG9zdD1hLmhvc3Quc3Vic3RyaW5nKDEsYS5ob3N0Lmxlbmd0aC0xKS5yZXBsYWNlKC87L2csXCI6XCIpLGEuYXV0aG9yaXR5PWEuYXV0aG9yaXR5LnJlcGxhY2UoXCJbXCIsXCJcIikucmVwbGFjZShcIl1cIixcIlwiKS5yZXBsYWNlKC87L2csXCI6XCIpLGEuaXB2NnVyaT0hMCksYX19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24obil7ZnVuY3Rpb24gbygpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmXCJXZWJraXRBcHBlYXJhbmNlXCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGV8fHdpbmRvdy5jb25zb2xlJiYoY29uc29sZS5maXJlYnVnfHxjb25zb2xlLmV4Y2VwdGlvbiYmY29uc29sZS50YWJsZSl8fG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pJiZwYXJzZUludChSZWdFeHAuJDEsMTApPj0zMX1mdW5jdGlvbiBpKCl7dmFyIHQ9YXJndW1lbnRzLHI9dGhpcy51c2VDb2xvcnM7aWYodFswXT0ocj9cIiVjXCI6XCJcIikrdGhpcy5uYW1lc3BhY2UrKHI/XCIgJWNcIjpcIiBcIikrdFswXSsocj9cIiVjIFwiOlwiIFwiKStcIitcIitlLmh1bWFuaXplKHRoaXMuZGlmZiksIXIpcmV0dXJuIHQ7dmFyIG49XCJjb2xvcjogXCIrdGhpcy5jb2xvcjt0PVt0WzBdLG4sXCJjb2xvcjogaW5oZXJpdFwiXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodCwxKSk7dmFyIG89MCxpPTA7cmV0dXJuIHRbMF0ucmVwbGFjZSgvJVthLXolXS9nLGZ1bmN0aW9uKHQpe1wiJSVcIiE9PXQmJihvKyssXCIlY1wiPT09dCYmKGk9bykpfSksdC5zcGxpY2UoaSwwLG4pLHR9ZnVuY3Rpb24gcygpe3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmxvZyYmRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csY29uc29sZSxhcmd1bWVudHMpfWZ1bmN0aW9uIGEodCl7dHJ5e251bGw9PXQ/ZS5zdG9yYWdlLnJlbW92ZUl0ZW0oXCJkZWJ1Z1wiKTplLnN0b3JhZ2UuZGVidWc9dH1jYXRjaCh0KXt9fWZ1bmN0aW9uIGMoKXt0cnl7cmV0dXJuIGUuc3RvcmFnZS5kZWJ1Z31jYXRjaCh0KXt9aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG4mJlwiZW52XCJpbiBuKXJldHVybiBuLmVudi5ERUJVR31mdW5jdGlvbiB1KCl7dHJ5e3JldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlfWNhdGNoKHQpe319ZT10LmV4cG9ydHM9cig1KSxlLmxvZz1zLGUuZm9ybWF0QXJncz1pLGUuc2F2ZT1hLGUubG9hZD1jLGUudXNlQ29sb3JzPW8sZS5zdG9yYWdlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBjaHJvbWUmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBjaHJvbWUuc3RvcmFnZT9jaHJvbWUuc3RvcmFnZS5sb2NhbDp1KCksZS5jb2xvcnM9W1wibGlnaHRzZWFncmVlblwiLFwiZm9yZXN0Z3JlZW5cIixcImdvbGRlbnJvZFwiLFwiZG9kZ2VyYmx1ZVwiLFwiZGFya29yY2hpZFwiLFwiY3JpbXNvblwiXSxlLmZvcm1hdHRlcnMuaj1mdW5jdGlvbih0KXt0cnl7cmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpfWNhdGNoKHQpe3JldHVyblwiW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06IFwiK3QubWVzc2FnZX19LGUuZW5hYmxlKGMoKSl9KS5jYWxsKGUscig0KSl9LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe3Rocm93IG5ldyBFcnJvcihcInNldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWRcIil9ZnVuY3Rpb24gbigpe3Rocm93IG5ldyBFcnJvcihcImNsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZFwiKX1mdW5jdGlvbiBvKHQpe2lmKGg9PT1zZXRUaW1lb3V0KXJldHVybiBzZXRUaW1lb3V0KHQsMCk7aWYoKGg9PT1yfHwhaCkmJnNldFRpbWVvdXQpcmV0dXJuIGg9c2V0VGltZW91dCxzZXRUaW1lb3V0KHQsMCk7dHJ5e3JldHVybiBoKHQsMCl9Y2F0Y2goZSl7dHJ5e3JldHVybiBoLmNhbGwobnVsbCx0LDApfWNhdGNoKGUpe3JldHVybiBoLmNhbGwodGhpcyx0LDApfX19ZnVuY3Rpb24gaSh0KXtpZihwPT09Y2xlYXJUaW1lb3V0KXJldHVybiBjbGVhclRpbWVvdXQodCk7aWYoKHA9PT1ufHwhcCkmJmNsZWFyVGltZW91dClyZXR1cm4gcD1jbGVhclRpbWVvdXQsY2xlYXJUaW1lb3V0KHQpO3RyeXtyZXR1cm4gcCh0KX1jYXRjaChlKXt0cnl7cmV0dXJuIHAuY2FsbChudWxsLHQpfWNhdGNoKGUpe3JldHVybiBwLmNhbGwodGhpcyx0KX19fWZ1bmN0aW9uIHMoKXt5JiZsJiYoeT0hMSxsLmxlbmd0aD9kPWwuY29uY2F0KGQpOmc9LTEsZC5sZW5ndGgmJmEoKSl9ZnVuY3Rpb24gYSgpe2lmKCF5KXt2YXIgdD1vKHMpO3k9ITA7Zm9yKHZhciBlPWQubGVuZ3RoO2U7KXtmb3IobD1kLGQ9W107KytnPGU7KWwmJmxbZ10ucnVuKCk7Zz0tMSxlPWQubGVuZ3RofWw9bnVsbCx5PSExLGkodCl9fWZ1bmN0aW9uIGModCxlKXt0aGlzLmZ1bj10LHRoaXMuYXJyYXk9ZX1mdW5jdGlvbiB1KCl7fXZhciBoLHAsZj10LmV4cG9ydHM9e307IWZ1bmN0aW9uKCl7dHJ5e2g9XCJmdW5jdGlvblwiPT10eXBlb2Ygc2V0VGltZW91dD9zZXRUaW1lb3V0OnJ9Y2F0Y2godCl7aD1yfXRyeXtwPVwiZnVuY3Rpb25cIj09dHlwZW9mIGNsZWFyVGltZW91dD9jbGVhclRpbWVvdXQ6bn1jYXRjaCh0KXtwPW59fSgpO3ZhciBsLGQ9W10seT0hMSxnPS0xO2YubmV4dFRpY2s9ZnVuY3Rpb24odCl7dmFyIGU9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMSk7aWYoYXJndW1lbnRzLmxlbmd0aD4xKWZvcih2YXIgcj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspZVtyLTFdPWFyZ3VtZW50c1tyXTtkLnB1c2gobmV3IGModCxlKSksMSE9PWQubGVuZ3RofHx5fHxvKGEpfSxjLnByb3RvdHlwZS5ydW49ZnVuY3Rpb24oKXt0aGlzLmZ1bi5hcHBseShudWxsLHRoaXMuYXJyYXkpfSxmLnRpdGxlPVwiYnJvd3NlclwiLGYuYnJvd3Nlcj0hMCxmLmVudj17fSxmLmFyZ3Y9W10sZi52ZXJzaW9uPVwiXCIsZi52ZXJzaW9ucz17fSxmLm9uPXUsZi5hZGRMaXN0ZW5lcj11LGYub25jZT11LGYub2ZmPXUsZi5yZW1vdmVMaXN0ZW5lcj11LGYucmVtb3ZlQWxsTGlzdGVuZXJzPXUsZi5lbWl0PXUsZi5iaW5kaW5nPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyBFcnJvcihcInByb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkXCIpfSxmLmN3ZD1mdW5jdGlvbigpe3JldHVyblwiL1wifSxmLmNoZGlyPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyBFcnJvcihcInByb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZFwiKX0sZi51bWFzaz1mdW5jdGlvbigpe3JldHVybiAwfX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gZS5jb2xvcnNbaCsrJWUuY29sb3JzLmxlbmd0aF19ZnVuY3Rpb24gbyh0KXtmdW5jdGlvbiByKCl7fWZ1bmN0aW9uIG8oKXt2YXIgdD1vLHI9K25ldyBEYXRlLGk9ci0odXx8cik7dC5kaWZmPWksdC5wcmV2PXUsdC5jdXJyPXIsdT1yLG51bGw9PXQudXNlQ29sb3JzJiYodC51c2VDb2xvcnM9ZS51c2VDb2xvcnMoKSksbnVsbD09dC5jb2xvciYmdC51c2VDb2xvcnMmJih0LmNvbG9yPW4oKSk7Zm9yKHZhciBzPW5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKSxhPTA7YTxzLmxlbmd0aDthKyspc1thXT1hcmd1bWVudHNbYV07c1swXT1lLmNvZXJjZShzWzBdKSxcInN0cmluZ1wiIT10eXBlb2Ygc1swXSYmKHM9W1wiJW9cIl0uY29uY2F0KHMpKTt2YXIgYz0wO3NbMF09c1swXS5yZXBsYWNlKC8lKFthLXolXSkvZyxmdW5jdGlvbihyLG4pe2lmKFwiJSVcIj09PXIpcmV0dXJuIHI7YysrO3ZhciBvPWUuZm9ybWF0dGVyc1tuXTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBvKXt2YXIgaT1zW2NdO3I9by5jYWxsKHQsaSkscy5zcGxpY2UoYywxKSxjLS19cmV0dXJuIHJ9KSxzPWUuZm9ybWF0QXJncy5hcHBseSh0LHMpO3ZhciBoPW8ubG9nfHxlLmxvZ3x8Y29uc29sZS5sb2cuYmluZChjb25zb2xlKTtoLmFwcGx5KHQscyl9ci5lbmFibGVkPSExLG8uZW5hYmxlZD0hMDt2YXIgaT1lLmVuYWJsZWQodCk/bzpyO3JldHVybiBpLm5hbWVzcGFjZT10LGl9ZnVuY3Rpb24gaSh0KXtlLnNhdmUodCk7Zm9yKHZhciByPSh0fHxcIlwiKS5zcGxpdCgvW1xccyxdKy8pLG49ci5sZW5ndGgsbz0wO288bjtvKyspcltvXSYmKHQ9cltvXS5yZXBsYWNlKC9bXFxcXF4kKz8uKCl8W1xcXXt9XS9nLFwiXFxcXCQmXCIpLnJlcGxhY2UoL1xcKi9nLFwiLio/XCIpLFwiLVwiPT09dFswXT9lLnNraXBzLnB1c2gobmV3IFJlZ0V4cChcIl5cIit0LnN1YnN0cigxKStcIiRcIikpOmUubmFtZXMucHVzaChuZXcgUmVnRXhwKFwiXlwiK3QrXCIkXCIpKSl9ZnVuY3Rpb24gcygpe2UuZW5hYmxlKFwiXCIpfWZ1bmN0aW9uIGEodCl7dmFyIHIsbjtmb3Iocj0wLG49ZS5za2lwcy5sZW5ndGg7cjxuO3IrKylpZihlLnNraXBzW3JdLnRlc3QodCkpcmV0dXJuITE7Zm9yKHI9MCxuPWUubmFtZXMubGVuZ3RoO3I8bjtyKyspaWYoZS5uYW1lc1tyXS50ZXN0KHQpKXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIGModCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBFcnJvcj90LnN0YWNrfHx0Lm1lc3NhZ2U6dH1lPXQuZXhwb3J0cz1vLmRlYnVnPW8sZS5jb2VyY2U9YyxlLmRpc2FibGU9cyxlLmVuYWJsZT1pLGUuZW5hYmxlZD1hLGUuaHVtYW5pemU9cig2KSxlLm5hbWVzPVtdLGUuc2tpcHM9W10sZS5mb3JtYXR0ZXJzPXt9O3ZhciB1LGg9MH0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe2lmKHQ9U3RyaW5nKHQpLCEodC5sZW5ndGg+MWU0KSl7dmFyIGU9L14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyh0KTtpZihlKXt2YXIgcj1wYXJzZUZsb2F0KGVbMV0pLG49KGVbMl18fFwibXNcIikudG9Mb3dlckNhc2UoKTtzd2l0Y2gobil7Y2FzZVwieWVhcnNcIjpjYXNlXCJ5ZWFyXCI6Y2FzZVwieXJzXCI6Y2FzZVwieXJcIjpjYXNlXCJ5XCI6cmV0dXJuIHIqaDtjYXNlXCJkYXlzXCI6Y2FzZVwiZGF5XCI6Y2FzZVwiZFwiOnJldHVybiByKnU7Y2FzZVwiaG91cnNcIjpjYXNlXCJob3VyXCI6Y2FzZVwiaHJzXCI6Y2FzZVwiaHJcIjpjYXNlXCJoXCI6cmV0dXJuIHIqYztjYXNlXCJtaW51dGVzXCI6Y2FzZVwibWludXRlXCI6Y2FzZVwibWluc1wiOmNhc2VcIm1pblwiOmNhc2VcIm1cIjpyZXR1cm4gciphO2Nhc2VcInNlY29uZHNcIjpjYXNlXCJzZWNvbmRcIjpjYXNlXCJzZWNzXCI6Y2FzZVwic2VjXCI6Y2FzZVwic1wiOnJldHVybiByKnM7Y2FzZVwibWlsbGlzZWNvbmRzXCI6Y2FzZVwibWlsbGlzZWNvbmRcIjpjYXNlXCJtc2Vjc1wiOmNhc2VcIm1zZWNcIjpjYXNlXCJtc1wiOnJldHVybiByO2RlZmF1bHQ6cmV0dXJufX19fWZ1bmN0aW9uIG4odCl7cmV0dXJuIHQ+PXU/TWF0aC5yb3VuZCh0L3UpK1wiZFwiOnQ+PWM/TWF0aC5yb3VuZCh0L2MpK1wiaFwiOnQ+PWE/TWF0aC5yb3VuZCh0L2EpK1wibVwiOnQ+PXM/TWF0aC5yb3VuZCh0L3MpK1wic1wiOnQrXCJtc1wifWZ1bmN0aW9uIG8odCl7cmV0dXJuIGkodCx1LFwiZGF5XCIpfHxpKHQsYyxcImhvdXJcIil8fGkodCxhLFwibWludXRlXCIpfHxpKHQscyxcInNlY29uZFwiKXx8dCtcIiBtc1wifWZ1bmN0aW9uIGkodCxlLHIpe2lmKCEodDxlKSlyZXR1cm4gdDwxLjUqZT9NYXRoLmZsb29yKHQvZSkrXCIgXCIrcjpNYXRoLmNlaWwodC9lKStcIiBcIityK1wic1wifXZhciBzPTFlMyxhPTYwKnMsYz02MCphLHU9MjQqYyxoPTM2NS4yNSp1O3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe2U9ZXx8e307dmFyIGk9dHlwZW9mIHQ7aWYoXCJzdHJpbmdcIj09PWkmJnQubGVuZ3RoPjApcmV0dXJuIHIodCk7aWYoXCJudW1iZXJcIj09PWkmJmlzTmFOKHQpPT09ITEpcmV0dXJuIGUubG9uZz9vKHQpOm4odCk7dGhyb3cgbmV3IEVycm9yKFwidmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD1cIitKU09OLnN0cmluZ2lmeSh0KSl9fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKHQpe3ZhciByPVwiXCIsbj0hMTtyZXR1cm4gcis9dC50eXBlLGUuQklOQVJZX0VWRU5UIT10LnR5cGUmJmUuQklOQVJZX0FDSyE9dC50eXBlfHwocis9dC5hdHRhY2htZW50cyxyKz1cIi1cIiksdC5uc3AmJlwiL1wiIT10Lm5zcCYmKG49ITAscis9dC5uc3ApLG51bGwhPXQuaWQmJihuJiYocis9XCIsXCIsbj0hMSkscis9dC5pZCksbnVsbCE9dC5kYXRhJiYobiYmKHIrPVwiLFwiKSxyKz1mLnN0cmluZ2lmeSh0LmRhdGEpKSxwKFwiZW5jb2RlZCAlaiBhcyAlc1wiLHQscikscn1mdW5jdGlvbiBpKHQsZSl7ZnVuY3Rpb24gcih0KXt2YXIgcj1kLmRlY29uc3RydWN0UGFja2V0KHQpLG49byhyLnBhY2tldCksaT1yLmJ1ZmZlcnM7aS51bnNoaWZ0KG4pLGUoaSl9ZC5yZW1vdmVCbG9icyh0LHIpfWZ1bmN0aW9uIHMoKXt0aGlzLnJlY29uc3RydWN0b3I9bnVsbH1mdW5jdGlvbiBhKHQpe3ZhciByPXt9LG49MDtpZihyLnR5cGU9TnVtYmVyKHQuY2hhckF0KDApKSxudWxsPT1lLnR5cGVzW3IudHlwZV0pcmV0dXJuIGgoKTtpZihlLkJJTkFSWV9FVkVOVD09ci50eXBlfHxlLkJJTkFSWV9BQ0s9PXIudHlwZSl7Zm9yKHZhciBvPVwiXCI7XCItXCIhPXQuY2hhckF0KCsrbikmJihvKz10LmNoYXJBdChuKSxuIT10Lmxlbmd0aCk7KTtpZihvIT1OdW1iZXIobyl8fFwiLVwiIT10LmNoYXJBdChuKSl0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIGF0dGFjaG1lbnRzXCIpO3IuYXR0YWNobWVudHM9TnVtYmVyKG8pfWlmKFwiL1wiPT10LmNoYXJBdChuKzEpKWZvcihyLm5zcD1cIlwiOysrbjspe3ZhciBpPXQuY2hhckF0KG4pO2lmKFwiLFwiPT1pKWJyZWFrO2lmKHIubnNwKz1pLG49PXQubGVuZ3RoKWJyZWFrfWVsc2Ugci5uc3A9XCIvXCI7dmFyIHM9dC5jaGFyQXQobisxKTtpZihcIlwiIT09cyYmTnVtYmVyKHMpPT1zKXtmb3Ioci5pZD1cIlwiOysrbjspe3ZhciBpPXQuY2hhckF0KG4pO2lmKG51bGw9PWl8fE51bWJlcihpKSE9aSl7LS1uO2JyZWFrfWlmKHIuaWQrPXQuY2hhckF0KG4pLG49PXQubGVuZ3RoKWJyZWFrfXIuaWQ9TnVtYmVyKHIuaWQpfXJldHVybiB0LmNoYXJBdCgrK24pJiYocj1jKHIsdC5zdWJzdHIobikpKSxwKFwiZGVjb2RlZCAlcyBhcyAlalwiLHQscikscn1mdW5jdGlvbiBjKHQsZSl7dHJ5e3QuZGF0YT1mLnBhcnNlKGUpfWNhdGNoKHQpe3JldHVybiBoKCl9cmV0dXJuIHR9ZnVuY3Rpb24gdSh0KXt0aGlzLnJlY29uUGFjaz10LHRoaXMuYnVmZmVycz1bXX1mdW5jdGlvbiBoKHQpe3JldHVybnt0eXBlOmUuRVJST1IsZGF0YTpcInBhcnNlciBlcnJvclwifX12YXIgcD1yKDgpKFwic29ja2V0LmlvLXBhcnNlclwiKSxmPXIoMTEpLGw9cigxMyksZD1yKDE0KSx5PXIoMTYpO2UucHJvdG9jb2w9NCxlLnR5cGVzPVtcIkNPTk5FQ1RcIixcIkRJU0NPTk5FQ1RcIixcIkVWRU5UXCIsXCJBQ0tcIixcIkVSUk9SXCIsXCJCSU5BUllfRVZFTlRcIixcIkJJTkFSWV9BQ0tcIl0sZS5DT05ORUNUPTAsZS5ESVNDT05ORUNUPTEsZS5FVkVOVD0yLGUuQUNLPTMsZS5FUlJPUj00LGUuQklOQVJZX0VWRU5UPTUsZS5CSU5BUllfQUNLPTYsZS5FbmNvZGVyPW4sZS5EZWNvZGVyPXMsbi5wcm90b3R5cGUuZW5jb2RlPWZ1bmN0aW9uKHQscil7aWYocChcImVuY29kaW5nIHBhY2tldCAlalwiLHQpLGUuQklOQVJZX0VWRU5UPT10LnR5cGV8fGUuQklOQVJZX0FDSz09dC50eXBlKWkodCxyKTtlbHNle3ZhciBuPW8odCk7cihbbl0pfX0sbChzLnByb3RvdHlwZSkscy5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKHQpe3ZhciByO2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KXI9YSh0KSxlLkJJTkFSWV9FVkVOVD09ci50eXBlfHxlLkJJTkFSWV9BQ0s9PXIudHlwZT8odGhpcy5yZWNvbnN0cnVjdG9yPW5ldyB1KHIpLDA9PT10aGlzLnJlY29uc3RydWN0b3IucmVjb25QYWNrLmF0dGFjaG1lbnRzJiZ0aGlzLmVtaXQoXCJkZWNvZGVkXCIscikpOnRoaXMuZW1pdChcImRlY29kZWRcIixyKTtlbHNle2lmKCF5KHQpJiYhdC5iYXNlNjQpdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0eXBlOiBcIit0KTtpZighdGhpcy5yZWNvbnN0cnVjdG9yKXRocm93IG5ldyBFcnJvcihcImdvdCBiaW5hcnkgZGF0YSB3aGVuIG5vdCByZWNvbnN0cnVjdGluZyBhIHBhY2tldFwiKTtyPXRoaXMucmVjb25zdHJ1Y3Rvci50YWtlQmluYXJ5RGF0YSh0KSxyJiYodGhpcy5yZWNvbnN0cnVjdG9yPW51bGwsdGhpcy5lbWl0KFwiZGVjb2RlZFwiLHIpKX19LHMucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlY29uc3RydWN0b3ImJnRoaXMucmVjb25zdHJ1Y3Rvci5maW5pc2hlZFJlY29uc3RydWN0aW9uKCl9LHUucHJvdG90eXBlLnRha2VCaW5hcnlEYXRhPWZ1bmN0aW9uKHQpe2lmKHRoaXMuYnVmZmVycy5wdXNoKHQpLHRoaXMuYnVmZmVycy5sZW5ndGg9PXRoaXMucmVjb25QYWNrLmF0dGFjaG1lbnRzKXt2YXIgZT1kLnJlY29uc3RydWN0UGFja2V0KHRoaXMucmVjb25QYWNrLHRoaXMuYnVmZmVycyk7cmV0dXJuIHRoaXMuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpLGV9cmV0dXJuIG51bGx9LHUucHJvdG90eXBlLmZpbmlzaGVkUmVjb25zdHJ1Y3Rpb249ZnVuY3Rpb24oKXt0aGlzLnJlY29uUGFjaz1udWxsLHRoaXMuYnVmZmVycz1bXX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7cmV0dXJuXCJXZWJraXRBcHBlYXJhbmNlXCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGV8fHdpbmRvdy5jb25zb2xlJiYoY29uc29sZS5maXJlYnVnfHxjb25zb2xlLmV4Y2VwdGlvbiYmY29uc29sZS50YWJsZSl8fG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pJiZwYXJzZUludChSZWdFeHAuJDEsMTApPj0zMX1mdW5jdGlvbiBvKCl7dmFyIHQ9YXJndW1lbnRzLHI9dGhpcy51c2VDb2xvcnM7aWYodFswXT0ocj9cIiVjXCI6XCJcIikrdGhpcy5uYW1lc3BhY2UrKHI/XCIgJWNcIjpcIiBcIikrdFswXSsocj9cIiVjIFwiOlwiIFwiKStcIitcIitlLmh1bWFuaXplKHRoaXMuZGlmZiksIXIpcmV0dXJuIHQ7dmFyIG49XCJjb2xvcjogXCIrdGhpcy5jb2xvcjt0PVt0WzBdLG4sXCJjb2xvcjogaW5oZXJpdFwiXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodCwxKSk7dmFyIG89MCxpPTA7cmV0dXJuIHRbMF0ucmVwbGFjZSgvJVthLXolXS9nLGZ1bmN0aW9uKHQpe1wiJSVcIiE9PXQmJihvKyssXCIlY1wiPT09dCYmKGk9bykpfSksdC5zcGxpY2UoaSwwLG4pLHR9ZnVuY3Rpb24gaSgpe3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmxvZyYmRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csY29uc29sZSxhcmd1bWVudHMpfWZ1bmN0aW9uIHModCl7dHJ5e251bGw9PXQ/ZS5zdG9yYWdlLnJlbW92ZUl0ZW0oXCJkZWJ1Z1wiKTplLnN0b3JhZ2UuZGVidWc9dH1jYXRjaCh0KXt9fWZ1bmN0aW9uIGEoKXt2YXIgdDt0cnl7dD1lLnN0b3JhZ2UuZGVidWd9Y2F0Y2godCl7fXJldHVybiB0fWZ1bmN0aW9uIGMoKXt0cnl7cmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2V9Y2F0Y2godCl7fX1lPXQuZXhwb3J0cz1yKDkpLGUubG9nPWksZS5mb3JtYXRBcmdzPW8sZS5zYXZlPXMsZS5sb2FkPWEsZS51c2VDb2xvcnM9bixlLnN0b3JhZ2U9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZS5zdG9yYWdlP2Nocm9tZS5zdG9yYWdlLmxvY2FsOmMoKSxlLmNvbG9ycz1bXCJsaWdodHNlYWdyZWVuXCIsXCJmb3Jlc3RncmVlblwiLFwiZ29sZGVucm9kXCIsXCJkb2RnZXJibHVlXCIsXCJkYXJrb3JjaGlkXCIsXCJjcmltc29uXCJdLGUuZm9ybWF0dGVycy5qPWZ1bmN0aW9uKHQpe3JldHVybiBKU09OLnN0cmluZ2lmeSh0KX0sZS5lbmFibGUoYSgpKX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gZS5jb2xvcnNbaCsrJWUuY29sb3JzLmxlbmd0aF19ZnVuY3Rpb24gbyh0KXtmdW5jdGlvbiByKCl7fWZ1bmN0aW9uIG8oKXt2YXIgdD1vLHI9K25ldyBEYXRlLGk9ci0odXx8cik7dC5kaWZmPWksdC5wcmV2PXUsdC5jdXJyPXIsdT1yLG51bGw9PXQudXNlQ29sb3JzJiYodC51c2VDb2xvcnM9ZS51c2VDb2xvcnMoKSksbnVsbD09dC5jb2xvciYmdC51c2VDb2xvcnMmJih0LmNvbG9yPW4oKSk7dmFyIHM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtzWzBdPWUuY29lcmNlKHNbMF0pLFwic3RyaW5nXCIhPXR5cGVvZiBzWzBdJiYocz1bXCIlb1wiXS5jb25jYXQocykpO3ZhciBhPTA7c1swXT1zWzBdLnJlcGxhY2UoLyUoW2EteiVdKS9nLGZ1bmN0aW9uKHIsbil7aWYoXCIlJVwiPT09cilyZXR1cm4gcjthKys7dmFyIG89ZS5mb3JtYXR0ZXJzW25dO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG8pe3ZhciBpPXNbYV07cj1vLmNhbGwodCxpKSxzLnNwbGljZShhLDEpLGEtLX1yZXR1cm4gcn0pLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUuZm9ybWF0QXJncyYmKHM9ZS5mb3JtYXRBcmdzLmFwcGx5KHQscykpO3ZhciBjPW8ubG9nfHxlLmxvZ3x8Y29uc29sZS5sb2cuYmluZChjb25zb2xlKTtjLmFwcGx5KHQscyl9ci5lbmFibGVkPSExLG8uZW5hYmxlZD0hMDt2YXIgaT1lLmVuYWJsZWQodCk/bzpyO3JldHVybiBpLm5hbWVzcGFjZT10LGl9ZnVuY3Rpb24gaSh0KXtlLnNhdmUodCk7Zm9yKHZhciByPSh0fHxcIlwiKS5zcGxpdCgvW1xccyxdKy8pLG49ci5sZW5ndGgsbz0wO288bjtvKyspcltvXSYmKHQ9cltvXS5yZXBsYWNlKC9cXCovZyxcIi4qP1wiKSxcIi1cIj09PXRbMF0/ZS5za2lwcy5wdXNoKG5ldyBSZWdFeHAoXCJeXCIrdC5zdWJzdHIoMSkrXCIkXCIpKTplLm5hbWVzLnB1c2gobmV3IFJlZ0V4cChcIl5cIit0K1wiJFwiKSkpfWZ1bmN0aW9uIHMoKXtlLmVuYWJsZShcIlwiKX1mdW5jdGlvbiBhKHQpe3ZhciByLG47Zm9yKHI9MCxuPWUuc2tpcHMubGVuZ3RoO3I8bjtyKyspaWYoZS5za2lwc1tyXS50ZXN0KHQpKXJldHVybiExO2ZvcihyPTAsbj1lLm5hbWVzLmxlbmd0aDtyPG47cisrKWlmKGUubmFtZXNbcl0udGVzdCh0KSlyZXR1cm4hMDtyZXR1cm4hMX1mdW5jdGlvbiBjKHQpe3JldHVybiB0IGluc3RhbmNlb2YgRXJyb3I/dC5zdGFja3x8dC5tZXNzYWdlOnR9ZT10LmV4cG9ydHM9byxlLmNvZXJjZT1jLGUuZGlzYWJsZT1zLGUuZW5hYmxlPWksZS5lbmFibGVkPWEsZS5odW1hbml6ZT1yKDEwKSxlLm5hbWVzPVtdLGUuc2tpcHM9W10sZS5mb3JtYXR0ZXJzPXt9O3ZhciB1LGg9MH0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe2lmKHQ9XCJcIit0LCEodC5sZW5ndGg+MWU0KSl7dmFyIGU9L14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyh0KTtpZihlKXt2YXIgcj1wYXJzZUZsb2F0KGVbMV0pLG49KGVbMl18fFwibXNcIikudG9Mb3dlckNhc2UoKTtzd2l0Y2gobil7Y2FzZVwieWVhcnNcIjpjYXNlXCJ5ZWFyXCI6Y2FzZVwieXJzXCI6Y2FzZVwieXJcIjpjYXNlXCJ5XCI6cmV0dXJuIHIqaDtjYXNlXCJkYXlzXCI6Y2FzZVwiZGF5XCI6Y2FzZVwiZFwiOnJldHVybiByKnU7Y2FzZVwiaG91cnNcIjpjYXNlXCJob3VyXCI6Y2FzZVwiaHJzXCI6Y2FzZVwiaHJcIjpjYXNlXCJoXCI6cmV0dXJuIHIqYztjYXNlXCJtaW51dGVzXCI6Y2FzZVwibWludXRlXCI6Y2FzZVwibWluc1wiOmNhc2VcIm1pblwiOmNhc2VcIm1cIjpyZXR1cm4gciphO2Nhc2VcInNlY29uZHNcIjpjYXNlXCJzZWNvbmRcIjpjYXNlXCJzZWNzXCI6Y2FzZVwic2VjXCI6Y2FzZVwic1wiOnJldHVybiByKnM7Y2FzZVwibWlsbGlzZWNvbmRzXCI6Y2FzZVwibWlsbGlzZWNvbmRcIjpjYXNlXCJtc2Vjc1wiOmNhc2VcIm1zZWNcIjpjYXNlXCJtc1wiOnJldHVybiByfX19fWZ1bmN0aW9uIG4odCl7cmV0dXJuIHQ+PXU/TWF0aC5yb3VuZCh0L3UpK1wiZFwiOnQ+PWM/TWF0aC5yb3VuZCh0L2MpK1wiaFwiOnQ+PWE/TWF0aC5yb3VuZCh0L2EpK1wibVwiOnQ+PXM/TWF0aC5yb3VuZCh0L3MpK1wic1wiOnQrXCJtc1wifWZ1bmN0aW9uIG8odCl7cmV0dXJuIGkodCx1LFwiZGF5XCIpfHxpKHQsYyxcImhvdXJcIil8fGkodCxhLFwibWludXRlXCIpfHxpKHQscyxcInNlY29uZFwiKXx8dCtcIiBtc1wifWZ1bmN0aW9uIGkodCxlLHIpe2lmKCEodDxlKSlyZXR1cm4gdDwxLjUqZT9NYXRoLmZsb29yKHQvZSkrXCIgXCIrcjpNYXRoLmNlaWwodC9lKStcIiBcIityK1wic1wifXZhciBzPTFlMyxhPTYwKnMsYz02MCphLHU9MjQqYyxoPTM2NS4yNSp1O3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3JldHVybiBlPWV8fHt9LFwic3RyaW5nXCI9PXR5cGVvZiB0P3IodCk6ZS5sb25nP28odCk6bih0KX19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24odCxyKXt2YXIgbj0hMTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBvKHQsZSl7ZnVuY3Rpb24gcih0KXtpZihyW3RdIT09ZylyZXR1cm4gclt0XTt2YXIgbztpZihcImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiPT10KW89XCJhXCIhPVwiYVwiWzBdO2Vsc2UgaWYoXCJqc29uXCI9PXQpbz1yKFwianNvbi1zdHJpbmdpZnlcIikmJnIoXCJqc29uLXBhcnNlXCIpO2Vsc2V7dmFyIHMsYT0ne1wiYVwiOlsxLHRydWUsZmFsc2UsbnVsbCxcIlxcXFx1MDAwMFxcXFxiXFxcXG5cXFxcZlxcXFxyXFxcXHRcIl19JztpZihcImpzb24tc3RyaW5naWZ5XCI9PXQpe3ZhciBjPWUuc3RyaW5naWZ5LGg9XCJmdW5jdGlvblwiPT10eXBlb2YgYyYmYjtpZihoKXsocz1mdW5jdGlvbigpe3JldHVybiAxfSkudG9KU09OPXM7dHJ5e2g9XCIwXCI9PT1jKDApJiZcIjBcIj09PWMobmV3IG4pJiYnXCJcIic9PWMobmV3IGkpJiZjKHYpPT09ZyYmYyhnKT09PWcmJmMoKT09PWcmJlwiMVwiPT09YyhzKSYmXCJbMV1cIj09Yyhbc10pJiZcIltudWxsXVwiPT1jKFtnXSkmJlwibnVsbFwiPT1jKG51bGwpJiZcIltudWxsLG51bGwsbnVsbF1cIj09YyhbZyx2LG51bGxdKSYmYyh7YTpbcywhMCwhMSxudWxsLFwiXFwwXFxiXFxuXFxmXFxyXFx0XCJdfSk9PWEmJlwiMVwiPT09YyhudWxsLHMpJiZcIltcXG4gMSxcXG4gMlxcbl1cIj09YyhbMSwyXSxudWxsLDEpJiYnXCItMjcxODIxLTA0LTIwVDAwOjAwOjAwLjAwMFpcIic9PWMobmV3IHUoLTg2NGUxMykpJiYnXCIrMjc1NzYwLTA5LTEzVDAwOjAwOjAwLjAwMFpcIic9PWMobmV3IHUoODY0ZTEzKSkmJidcIi0wMDAwMDEtMDEtMDFUMDA6MDA6MDAuMDAwWlwiJz09YyhuZXcgdSgtNjIxOTg3NTUyZTUpKSYmJ1wiMTk2OS0xMi0zMVQyMzo1OTo1OS45OTlaXCInPT1jKG5ldyB1KC0xKSl9Y2F0Y2godCl7aD0hMX19bz1ofWlmKFwianNvbi1wYXJzZVwiPT10KXt2YXIgcD1lLnBhcnNlO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHApdHJ5e2lmKDA9PT1wKFwiMFwiKSYmIXAoITEpKXtzPXAoYSk7dmFyIGY9NT09cy5hLmxlbmd0aCYmMT09PXMuYVswXTtpZihmKXt0cnl7Zj0hcCgnXCJcXHRcIicpfWNhdGNoKHQpe31pZihmKXRyeXtmPTEhPT1wKFwiMDFcIil9Y2F0Y2godCl7fWlmKGYpdHJ5e2Y9MSE9PXAoXCIxLlwiKX1jYXRjaCh0KXt9fX19Y2F0Y2godCl7Zj0hMX1vPWZ9fXJldHVybiByW3RdPSEhb310fHwodD1jLk9iamVjdCgpKSxlfHwoZT1jLk9iamVjdCgpKTt2YXIgbj10Lk51bWJlcnx8Yy5OdW1iZXIsaT10LlN0cmluZ3x8Yy5TdHJpbmcsYT10Lk9iamVjdHx8Yy5PYmplY3QsdT10LkRhdGV8fGMuRGF0ZSxoPXQuU3ludGF4RXJyb3J8fGMuU3ludGF4RXJyb3IscD10LlR5cGVFcnJvcnx8Yy5UeXBlRXJyb3IsZj10Lk1hdGh8fGMuTWF0aCxsPXQuSlNPTnx8Yy5KU09OO1wib2JqZWN0XCI9PXR5cGVvZiBsJiZsJiYoZS5zdHJpbmdpZnk9bC5zdHJpbmdpZnksZS5wYXJzZT1sLnBhcnNlKTt2YXIgZCx5LGcsbT1hLnByb3RvdHlwZSx2PW0udG9TdHJpbmcsYj1uZXcgdSgtMHhjNzgyYjViODAwY2VjKTt0cnl7Yj1iLmdldFVUQ0Z1bGxZZWFyKCk9PS0xMDkyNTImJjA9PT1iLmdldFVUQ01vbnRoKCkmJjE9PT1iLmdldFVUQ0RhdGUoKSYmMTA9PWIuZ2V0VVRDSG91cnMoKSYmMzc9PWIuZ2V0VVRDTWludXRlcygpJiY2PT1iLmdldFVUQ1NlY29uZHMoKSYmNzA4PT1iLmdldFVUQ01pbGxpc2Vjb25kcygpfWNhdGNoKHQpe31pZighcihcImpzb25cIikpe3ZhciB3PVwiW29iamVjdCBGdW5jdGlvbl1cIixrPVwiW29iamVjdCBEYXRlXVwiLHg9XCJbb2JqZWN0IE51bWJlcl1cIixBPVwiW29iamVjdCBTdHJpbmddXCIsQz1cIltvYmplY3QgQXJyYXldXCIsQj1cIltvYmplY3QgQm9vbGVhbl1cIixTPXIoXCJidWctc3RyaW5nLWNoYXItaW5kZXhcIik7aWYoIWIpdmFyIFQ9Zi5mbG9vcixFPVswLDMxLDU5LDkwLDEyMCwxNTEsMTgxLDIxMiwyNDMsMjczLDMwNCwzMzRdLF89ZnVuY3Rpb24odCxlKXtyZXR1cm4gRVtlXSszNjUqKHQtMTk3MCkrVCgodC0xOTY5KyhlPSsoZT4xKSkpLzQpLVQoKHQtMTkwMStlKS8xMDApK1QoKHQtMTYwMStlKS80MDApfTtpZigoZD1tLmhhc093blByb3BlcnR5KXx8KGQ9ZnVuY3Rpb24odCl7dmFyIGUscj17fTtyZXR1cm4oci5fX3Byb3RvX189bnVsbCxyLl9fcHJvdG9fXz17dG9TdHJpbmc6MX0scikudG9TdHJpbmchPXY/ZD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLl9fcHJvdG9fXyxyPXQgaW4odGhpcy5fX3Byb3RvX189bnVsbCx0aGlzKTtyZXR1cm4gdGhpcy5fX3Byb3RvX189ZSxyfTooZT1yLmNvbnN0cnVjdG9yLGQ9ZnVuY3Rpb24odCl7dmFyIHI9KHRoaXMuY29uc3RydWN0b3J8fGUpLnByb3RvdHlwZTtyZXR1cm4gdCBpbiB0aGlzJiYhKHQgaW4gciYmdGhpc1t0XT09PXJbdF0pfSkscj1udWxsLGQuY2FsbCh0aGlzLHQpfSkseT1mdW5jdGlvbih0LGUpe3ZhciByLG4sbyxpPTA7KHI9ZnVuY3Rpb24oKXt0aGlzLnZhbHVlT2Y9MH0pLnByb3RvdHlwZS52YWx1ZU9mPTAsbj1uZXcgcjtmb3IobyBpbiBuKWQuY2FsbChuLG8pJiZpKys7cmV0dXJuIHI9bj1udWxsLGk/eT0yPT1pP2Z1bmN0aW9uKHQsZSl7dmFyIHIsbj17fSxvPXYuY2FsbCh0KT09dztmb3IociBpbiB0KW8mJlwicHJvdG90eXBlXCI9PXJ8fGQuY2FsbChuLHIpfHwhKG5bcl09MSl8fCFkLmNhbGwodCxyKXx8ZShyKX06ZnVuY3Rpb24odCxlKXt2YXIgcixuLG89di5jYWxsKHQpPT13O2ZvcihyIGluIHQpbyYmXCJwcm90b3R5cGVcIj09cnx8IWQuY2FsbCh0LHIpfHwobj1cImNvbnN0cnVjdG9yXCI9PT1yKXx8ZShyKTsobnx8ZC5jYWxsKHQscj1cImNvbnN0cnVjdG9yXCIpKSYmZShyKX06KG49W1widmFsdWVPZlwiLFwidG9TdHJpbmdcIixcInRvTG9jYWxlU3RyaW5nXCIsXCJwcm9wZXJ0eUlzRW51bWVyYWJsZVwiLFwiaXNQcm90b3R5cGVPZlwiLFwiaGFzT3duUHJvcGVydHlcIixcImNvbnN0cnVjdG9yXCJdLHk9ZnVuY3Rpb24odCxlKXt2YXIgcixvLGk9di5jYWxsKHQpPT13LGE9IWkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQuY29uc3RydWN0b3ImJnNbdHlwZW9mIHQuaGFzT3duUHJvcGVydHldJiZ0Lmhhc093blByb3BlcnR5fHxkO2ZvcihyIGluIHQpaSYmXCJwcm90b3R5cGVcIj09cnx8IWEuY2FsbCh0LHIpfHxlKHIpO2ZvcihvPW4ubGVuZ3RoO3I9blstLW9dO2EuY2FsbCh0LHIpJiZlKHIpKTt9KSx5KHQsZSl9LCFyKFwianNvbi1zdHJpbmdpZnlcIikpe3ZhciBOPXs5MjpcIlxcXFxcXFxcXCIsMzQ6J1xcXFxcIicsODpcIlxcXFxiXCIsMTI6XCJcXFxcZlwiLDEwOlwiXFxcXG5cIiwxMzpcIlxcXFxyXCIsOTpcIlxcXFx0XCJ9LGo9XCIwMDAwMDBcIixPPWZ1bmN0aW9uKHQsZSl7cmV0dXJuKGorKGV8fDApKS5zbGljZSgtdCl9LFA9XCJcXFxcdTAwXCIsUj1mdW5jdGlvbih0KXtmb3IodmFyIGU9J1wiJyxyPTAsbj10Lmxlbmd0aCxvPSFTfHxuPjEwLGk9byYmKFM/dC5zcGxpdChcIlwiKTp0KTtyPG47cisrKXt2YXIgcz10LmNoYXJDb2RlQXQocik7c3dpdGNoKHMpe2Nhc2UgODpjYXNlIDk6Y2FzZSAxMDpjYXNlIDEyOmNhc2UgMTM6Y2FzZSAzNDpjYXNlIDkyOmUrPU5bc107YnJlYWs7ZGVmYXVsdDppZihzPDMyKXtlKz1QK08oMixzLnRvU3RyaW5nKDE2KSk7YnJlYWt9ZSs9bz9pW3JdOnQuY2hhckF0KHIpfX1yZXR1cm4gZSsnXCInfSxEPWZ1bmN0aW9uKHQsZSxyLG4sbyxpLHMpe3ZhciBhLGMsdSxoLGYsbCxtLGIsdyxTLEUsTixqLFAscSxVO3RyeXthPWVbdF19Y2F0Y2godCl7fWlmKFwib2JqZWN0XCI9PXR5cGVvZiBhJiZhKWlmKGM9di5jYWxsKGEpLGMhPWt8fGQuY2FsbChhLFwidG9KU09OXCIpKVwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG9KU09OJiYoYyE9eCYmYyE9QSYmYyE9Q3x8ZC5jYWxsKGEsXCJ0b0pTT05cIikpJiYoYT1hLnRvSlNPTih0KSk7ZWxzZSBpZihhPi0xLzAmJmE8MS8wKXtpZihfKXtmb3IoZj1UKGEvODY0ZTUpLHU9VChmLzM2NS4yNDI1KSsxOTcwLTE7Xyh1KzEsMCk8PWY7dSsrKTtmb3IoaD1UKChmLV8odSwwKSkvMzAuNDIpO18odSxoKzEpPD1mO2grKyk7Zj0xK2YtXyh1LGgpLGw9KGElODY0ZTUrODY0ZTUpJTg2NGU1LG09VChsLzM2ZTUpJTI0LGI9VChsLzZlNCklNjAsdz1UKGwvMWUzKSU2MCxTPWwlMWUzfWVsc2UgdT1hLmdldFVUQ0Z1bGxZZWFyKCksaD1hLmdldFVUQ01vbnRoKCksZj1hLmdldFVUQ0RhdGUoKSxtPWEuZ2V0VVRDSG91cnMoKSxiPWEuZ2V0VVRDTWludXRlcygpLHc9YS5nZXRVVENTZWNvbmRzKCksUz1hLmdldFVUQ01pbGxpc2Vjb25kcygpO2E9KHU8PTB8fHU+PTFlND8odTwwP1wiLVwiOlwiK1wiKStPKDYsdTwwPy11OnUpOk8oNCx1KSkrXCItXCIrTygyLGgrMSkrXCItXCIrTygyLGYpK1wiVFwiK08oMixtKStcIjpcIitPKDIsYikrXCI6XCIrTygyLHcpK1wiLlwiK08oMyxTKStcIlpcIn1lbHNlIGE9bnVsbDtpZihyJiYoYT1yLmNhbGwoZSx0LGEpKSxudWxsPT09YSlyZXR1cm5cIm51bGxcIjtpZihjPXYuY2FsbChhKSxjPT1CKXJldHVyblwiXCIrYTtpZihjPT14KXJldHVybiBhPi0xLzAmJmE8MS8wP1wiXCIrYTpcIm51bGxcIjtpZihjPT1BKXJldHVybiBSKFwiXCIrYSk7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEpe2ZvcihQPXMubGVuZ3RoO1AtLTspaWYoc1tQXT09PWEpdGhyb3cgcCgpO2lmKHMucHVzaChhKSxFPVtdLHE9aSxpKz1vLGM9PUMpe2ZvcihqPTAsUD1hLmxlbmd0aDtqPFA7aisrKU49RChqLGEscixuLG8saSxzKSxFLnB1c2goTj09PWc/XCJudWxsXCI6Tik7VT1FLmxlbmd0aD9vP1wiW1xcblwiK2krRS5qb2luKFwiLFxcblwiK2kpK1wiXFxuXCIrcStcIl1cIjpcIltcIitFLmpvaW4oXCIsXCIpK1wiXVwiOlwiW11cIn1lbHNlIHkobnx8YSxmdW5jdGlvbih0KXt2YXIgZT1EKHQsYSxyLG4sbyxpLHMpO2UhPT1nJiZFLnB1c2goUih0KStcIjpcIisobz9cIiBcIjpcIlwiKStlKX0pLFU9RS5sZW5ndGg/bz9cIntcXG5cIitpK0Uuam9pbihcIixcXG5cIitpKStcIlxcblwiK3ErXCJ9XCI6XCJ7XCIrRS5qb2luKFwiLFwiKStcIn1cIjpcInt9XCI7cmV0dXJuIHMucG9wKCksVX19O2Uuc3RyaW5naWZ5PWZ1bmN0aW9uKHQsZSxyKXt2YXIgbixvLGksYTtpZihzW3R5cGVvZiBlXSYmZSlpZigoYT12LmNhbGwoZSkpPT13KW89ZTtlbHNlIGlmKGE9PUMpe2k9e307Zm9yKHZhciBjLHU9MCxoPWUubGVuZ3RoO3U8aDtjPWVbdSsrXSxhPXYuY2FsbChjKSwoYT09QXx8YT09eCkmJihpW2NdPTEpKTt9aWYocilpZigoYT12LmNhbGwocikpPT14KXtpZigoci09ciUxKT4wKWZvcihuPVwiXCIscj4xMCYmKHI9MTApO24ubGVuZ3RoPHI7bis9XCIgXCIpO31lbHNlIGE9PUEmJihuPXIubGVuZ3RoPD0xMD9yOnIuc2xpY2UoMCwxMCkpO3JldHVybiBEKFwiXCIsKGM9e30sY1tcIlwiXT10LGMpLG8saSxuLFwiXCIsW10pfX1pZighcihcImpzb24tcGFyc2VcIikpe3ZhciBxLFUsTT1pLmZyb21DaGFyQ29kZSxMPXs5MjpcIlxcXFxcIiwzNDonXCInLDQ3OlwiL1wiLDk4OlwiXFxiXCIsMTE2OlwiXFx0XCIsMTEwOlwiXFxuXCIsMTAyOlwiXFxmXCIsMTE0OlwiXFxyXCJ9LEk9ZnVuY3Rpb24oKXt0aHJvdyBxPVU9bnVsbCxoKCl9LEg9ZnVuY3Rpb24oKXtmb3IodmFyIHQsZSxyLG4sbyxpPVUscz1pLmxlbmd0aDtxPHM7KXN3aXRjaChvPWkuY2hhckNvZGVBdChxKSl7Y2FzZSA5OmNhc2UgMTA6Y2FzZSAxMzpjYXNlIDMyOnErKzticmVhaztjYXNlIDEyMzpjYXNlIDEyNTpjYXNlIDkxOmNhc2UgOTM6Y2FzZSA1ODpjYXNlIDQ0OnJldHVybiB0PVM/aS5jaGFyQXQocSk6aVtxXSxxKyssdDtjYXNlIDM0OmZvcih0PVwiQFwiLHErKztxPHM7KWlmKG89aS5jaGFyQ29kZUF0KHEpLG88MzIpSSgpO2Vsc2UgaWYoOTI9PW8pc3dpdGNoKG89aS5jaGFyQ29kZUF0KCsrcSkpe2Nhc2UgOTI6Y2FzZSAzNDpjYXNlIDQ3OmNhc2UgOTg6Y2FzZSAxMTY6Y2FzZSAxMTA6Y2FzZSAxMDI6Y2FzZSAxMTQ6dCs9TFtvXSxxKys7YnJlYWs7Y2FzZSAxMTc6Zm9yKGU9KytxLHI9cSs0O3E8cjtxKyspbz1pLmNoYXJDb2RlQXQocSksbz49NDgmJm88PTU3fHxvPj05NyYmbzw9MTAyfHxvPj02NSYmbzw9NzB8fEkoKTt0Kz1NKFwiMHhcIitpLnNsaWNlKGUscSkpO2JyZWFrO2RlZmF1bHQ6SSgpfWVsc2V7aWYoMzQ9PW8pYnJlYWs7Zm9yKG89aS5jaGFyQ29kZUF0KHEpLGU9cTtvPj0zMiYmOTIhPW8mJjM0IT1vOylvPWkuY2hhckNvZGVBdCgrK3EpO3QrPWkuc2xpY2UoZSxxKX1pZigzND09aS5jaGFyQ29kZUF0KHEpKXJldHVybiBxKyssdDtJKCk7ZGVmYXVsdDppZihlPXEsNDU9PW8mJihuPSEwLG89aS5jaGFyQ29kZUF0KCsrcSkpLG8+PTQ4JiZvPD01Nyl7Zm9yKDQ4PT1vJiYobz1pLmNoYXJDb2RlQXQocSsxKSxvPj00OCYmbzw9NTcpJiZJKCksbj0hMTtxPHMmJihvPWkuY2hhckNvZGVBdChxKSxvPj00OCYmbzw9NTcpO3ErKyk7aWYoNDY9PWkuY2hhckNvZGVBdChxKSl7Zm9yKHI9KytxO3I8cyYmKG89aS5jaGFyQ29kZUF0KHIpLG8+PTQ4JiZvPD01Nyk7cisrKTtyPT1xJiZJKCkscT1yfWlmKG89aS5jaGFyQ29kZUF0KHEpLDEwMT09b3x8Njk9PW8pe2ZvcihvPWkuY2hhckNvZGVBdCgrK3EpLDQzIT1vJiY0NSE9b3x8cSsrLHI9cTtyPHMmJihvPWkuY2hhckNvZGVBdChyKSxvPj00OCYmbzw9NTcpO3IrKyk7cj09cSYmSSgpLHE9cn1yZXR1cm4raS5zbGljZShlLHEpfWlmKG4mJkkoKSxcInRydWVcIj09aS5zbGljZShxLHErNCkpcmV0dXJuIHErPTQsITA7aWYoXCJmYWxzZVwiPT1pLnNsaWNlKHEscSs1KSlyZXR1cm4gcSs9NSwhMTtpZihcIm51bGxcIj09aS5zbGljZShxLHErNCkpcmV0dXJuIHErPTQsbnVsbDtJKCl9cmV0dXJuXCIkXCJ9LHo9ZnVuY3Rpb24odCl7dmFyIGUscjtpZihcIiRcIj09dCYmSSgpLFwic3RyaW5nXCI9PXR5cGVvZiB0KXtpZihcIkBcIj09KFM/dC5jaGFyQXQoMCk6dFswXSkpcmV0dXJuIHQuc2xpY2UoMSk7aWYoXCJbXCI9PXQpe2ZvcihlPVtdO3Q9SCgpLFwiXVwiIT10O3J8fChyPSEwKSlyJiYoXCIsXCI9PXQ/KHQ9SCgpLFwiXVwiPT10JiZJKCkpOkkoKSksXCIsXCI9PXQmJkkoKSxlLnB1c2goeih0KSk7cmV0dXJuIGV9aWYoXCJ7XCI9PXQpe2ZvcihlPXt9O3Q9SCgpLFwifVwiIT10O3J8fChyPSEwKSlyJiYoXCIsXCI9PXQ/KHQ9SCgpLFwifVwiPT10JiZJKCkpOkkoKSksXCIsXCIhPXQmJlwic3RyaW5nXCI9PXR5cGVvZiB0JiZcIkBcIj09KFM/dC5jaGFyQXQoMCk6dFswXSkmJlwiOlwiPT1IKCl8fEkoKSxlW3Quc2xpY2UoMSldPXooSCgpKTtyZXR1cm4gZX1JKCl9cmV0dXJuIHR9LEo9ZnVuY3Rpb24odCxlLHIpe3ZhciBuPVgodCxlLHIpO249PT1nP2RlbGV0ZSB0W2VdOnRbZV09bn0sWD1mdW5jdGlvbih0LGUscil7dmFyIG4sbz10W2VdO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBvJiZvKWlmKHYuY2FsbChvKT09Qylmb3Iobj1vLmxlbmd0aDtuLS07KUoobyxuLHIpO2Vsc2UgeShvLGZ1bmN0aW9uKHQpe0oobyx0LHIpfSk7cmV0dXJuIHIuY2FsbCh0LGUsbyl9O2UucGFyc2U9ZnVuY3Rpb24odCxlKXt2YXIgcixuO3JldHVybiBxPTAsVT1cIlwiK3Qscj16KEgoKSksXCIkXCIhPUgoKSYmSSgpLHE9VT1udWxsLGUmJnYuY2FsbChlKT09dz9YKChuPXt9LG5bXCJcIl09cixuKSxcIlwiLGUpOnJ9fX1yZXR1cm4gZS5ydW5JbkNvbnRleHQ9byxlfXZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm4uYW1kLHM9e2Z1bmN0aW9uOiEwLG9iamVjdDohMH0sYT1zW3R5cGVvZiBlXSYmZSYmIWUubm9kZVR5cGUmJmUsYz1zW3R5cGVvZiB3aW5kb3ddJiZ3aW5kb3d8fHRoaXMsdT1hJiZzW3R5cGVvZiB0XSYmdCYmIXQubm9kZVR5cGUmJlwib2JqZWN0XCI9PXR5cGVvZiByJiZyO2lmKCF1fHx1Lmdsb2JhbCE9PXUmJnUud2luZG93IT09dSYmdS5zZWxmIT09dXx8KGM9dSksYSYmIWkpbyhjLGEpO2Vsc2V7dmFyIGg9Yy5KU09OLHA9Yy5KU09OMyxmPSExLGw9byhjLGMuSlNPTjM9e25vQ29uZmxpY3Q6ZnVuY3Rpb24oKXtyZXR1cm4gZnx8KGY9ITAsYy5KU09OPWgsYy5KU09OMz1wLGg9cD1udWxsKSxsfX0pO2MuSlNPTj17cGFyc2U6bC5wYXJzZSxzdHJpbmdpZnk6bC5zdHJpbmdpZnl9fWkmJm4oZnVuY3Rpb24oKXtyZXR1cm4gbH0pfSkuY2FsbCh0aGlzKX0pLmNhbGwoZSxyKDEyKSh0KSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHQud2VicGFja1BvbHlmaWxsfHwodC5kZXByZWNhdGU9ZnVuY3Rpb24oKXt9LHQucGF0aHM9W10sdC5jaGlsZHJlbj1bXSx0LndlYnBhY2tQb2x5ZmlsbD0xKSx0fX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe2lmKHQpcmV0dXJuIG4odCl9ZnVuY3Rpb24gbih0KXtmb3IodmFyIGUgaW4gci5wcm90b3R5cGUpdFtlXT1yLnByb3RvdHlwZVtlXTtyZXR1cm4gdH10LmV4cG9ydHM9cixyLnByb3RvdHlwZS5vbj1yLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuX2NhbGxiYWNrcz10aGlzLl9jYWxsYmFja3N8fHt9LCh0aGlzLl9jYWxsYmFja3NbdF09dGhpcy5fY2FsbGJhY2tzW3RdfHxbXSkucHVzaChlKSx0aGlzfSxyLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe24ub2ZmKHQsciksZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9dmFyIG49dGhpcztyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sci5mbj1lLHRoaXMub24odCxyKSx0aGlzfSxyLnByb3RvdHlwZS5vZmY9ci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9ci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtpZih0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSwwPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9jYWxsYmFja3M9e30sdGhpczt2YXIgcj10aGlzLl9jYWxsYmFja3NbdF07aWYoIXIpcmV0dXJuIHRoaXM7aWYoMT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1t0XSx0aGlzO2Zvcih2YXIgbixvPTA7bzxyLmxlbmd0aDtvKyspaWYobj1yW29dLG49PT1lfHxuLmZuPT09ZSl7ci5zcGxpY2UobywxKTticmVha31yZXR1cm4gdGhpc30sci5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0KXt0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fTt2YXIgZT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxyPXRoaXMuX2NhbGxiYWNrc1t0XTtpZihyKXtyPXIuc2xpY2UoMCk7Zm9yKHZhciBuPTAsbz1yLmxlbmd0aDtuPG87KytuKXJbbl0uYXBwbHkodGhpcyxlKX1yZXR1cm4gdGhpc30sci5wcm90b3R5cGUubGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSx0aGlzLl9jYWxsYmFja3NbdF18fFtdfSxyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuISF0aGlzLmxpc3RlbmVycyh0KS5sZW5ndGh9fSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKHQpe3ZhciBuPXIoMTUpLG89cigxNik7ZS5kZWNvbnN0cnVjdFBhY2tldD1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe2lmKCF0KXJldHVybiB0O2lmKG8odCkpe3ZhciBpPXtfcGxhY2Vob2xkZXI6ITAsbnVtOnIubGVuZ3RofTtyZXR1cm4gci5wdXNoKHQpLGl9aWYobih0KSl7Zm9yKHZhciBzPW5ldyBBcnJheSh0Lmxlbmd0aCksYT0wO2E8dC5sZW5ndGg7YSsrKXNbYV09ZSh0W2FdKTtyZXR1cm4gc31pZihcIm9iamVjdFwiPT10eXBlb2YgdCYmISh0IGluc3RhbmNlb2YgRGF0ZSkpe3ZhciBzPXt9O2Zvcih2YXIgYyBpbiB0KXNbY109ZSh0W2NdKTtyZXR1cm4gc31yZXR1cm4gdH12YXIgcj1bXSxpPXQuZGF0YSxzPXQ7cmV0dXJuIHMuZGF0YT1lKGkpLHMuYXR0YWNobWVudHM9ci5sZW5ndGgse3BhY2tldDpzLGJ1ZmZlcnM6cn19LGUucmVjb25zdHJ1Y3RQYWNrZXQ9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe2lmKHQmJnQuX3BsYWNlaG9sZGVyKXt2YXIgbz1lW3QubnVtXTtyZXR1cm4gb31pZihuKHQpKXtmb3IodmFyIGk9MDtpPHQubGVuZ3RoO2krKyl0W2ldPXIodFtpXSk7cmV0dXJuIHR9aWYodCYmXCJvYmplY3RcIj09dHlwZW9mIHQpe2Zvcih2YXIgcyBpbiB0KXRbc109cih0W3NdKTtyZXR1cm4gdH1yZXR1cm4gdH1yZXR1cm4gdC5kYXRhPXIodC5kYXRhKSx0LmF0dGFjaG1lbnRzPXZvaWQgMCx0fSxlLnJlbW92ZUJsb2JzPWZ1bmN0aW9uKGUscil7ZnVuY3Rpb24gaShlLGMsdSl7aWYoIWUpcmV0dXJuIGU7aWYodC5CbG9iJiZlIGluc3RhbmNlb2YgQmxvYnx8dC5GaWxlJiZlIGluc3RhbmNlb2YgRmlsZSl7cysrO3ZhciBoPW5ldyBGaWxlUmVhZGVyO2gub25sb2FkPWZ1bmN0aW9uKCl7dT91W2NdPXRoaXMucmVzdWx0OmE9dGhpcy5yZXN1bHQsLS1zfHxyKGEpfSxoLnJlYWRBc0FycmF5QnVmZmVyKGUpfWVsc2UgaWYobihlKSlmb3IodmFyIHA9MDtwPGUubGVuZ3RoO3ArKylpKGVbcF0scCxlKTtlbHNlIGlmKGUmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiYhbyhlKSlmb3IodmFyIGYgaW4gZSlpKGVbZl0sZixlKX12YXIgcz0wLGE9ZTtpKGEpLHN8fHIoYSl9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbih0KXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KX19LGZ1bmN0aW9uKHQsZSl7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIodCl7cmV0dXJuIGUuQnVmZmVyJiZlLkJ1ZmZlci5pc0J1ZmZlcih0KXx8ZS5BcnJheUJ1ZmZlciYmdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfXQuZXhwb3J0cz1yfSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe3JldHVybiB0aGlzIGluc3RhbmNlb2Ygbj8odCYmXCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOm8odCkpJiYoZT10LHQ9dm9pZCAwKSxlPWV8fHt9LGUucGF0aD1lLnBhdGh8fFwiL3NvY2tldC5pb1wiLHRoaXMubnNwcz17fSx0aGlzLnN1YnM9W10sdGhpcy5vcHRzPWUsdGhpcy5yZWNvbm5lY3Rpb24oZS5yZWNvbm5lY3Rpb24hPT0hMSksdGhpcy5yZWNvbm5lY3Rpb25BdHRlbXB0cyhlLnJlY29ubmVjdGlvbkF0dGVtcHRzfHwxLzApLHRoaXMucmVjb25uZWN0aW9uRGVsYXkoZS5yZWNvbm5lY3Rpb25EZWxheXx8MWUzKSx0aGlzLnJlY29ubmVjdGlvbkRlbGF5TWF4KGUucmVjb25uZWN0aW9uRGVsYXlNYXh8fDVlMyksdGhpcy5yYW5kb21pemF0aW9uRmFjdG9yKGUucmFuZG9taXphdGlvbkZhY3Rvcnx8LjUpLHRoaXMuYmFja29mZj1uZXcgbCh7bWluOnRoaXMucmVjb25uZWN0aW9uRGVsYXkoKSxtYXg6dGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heCgpLGppdHRlcjp0aGlzLnJhbmRvbWl6YXRpb25GYWN0b3IoKX0pLHRoaXMudGltZW91dChudWxsPT1lLnRpbWVvdXQ/MmU0OmUudGltZW91dCksdGhpcy5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsdGhpcy51cmk9dCx0aGlzLmNvbm5lY3Rpbmc9W10sdGhpcy5sYXN0UGluZz1udWxsLHRoaXMuZW5jb2Rpbmc9ITEsdGhpcy5wYWNrZXRCdWZmZXI9W10sdGhpcy5lbmNvZGVyPW5ldyBjLkVuY29kZXIsdGhpcy5kZWNvZGVyPW5ldyBjLkRlY29kZXIsdGhpcy5hdXRvQ29ubmVjdD1lLmF1dG9Db25uZWN0IT09ITEsdm9pZCh0aGlzLmF1dG9Db25uZWN0JiZ0aGlzLm9wZW4oKSkpOm5ldyBuKHQsZSl9dmFyIG89XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0saT1yKDE4KSxzPXIoNDQpLGE9cigzNSksYz1yKDcpLHU9cig0NiksaD1yKDQ3KSxwPXIoMykoXCJzb2NrZXQuaW8tY2xpZW50Om1hbmFnZXJcIiksZj1yKDQyKSxsPXIoNDgpLGQ9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTt0LmV4cG9ydHM9bixuLnByb3RvdHlwZS5lbWl0QWxsPWZ1bmN0aW9uKCl7dGhpcy5lbWl0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtmb3IodmFyIHQgaW4gdGhpcy5uc3BzKWQuY2FsbCh0aGlzLm5zcHMsdCkmJnRoaXMubnNwc1t0XS5lbWl0LmFwcGx5KHRoaXMubnNwc1t0XSxhcmd1bWVudHMpfSxuLnByb3RvdHlwZS51cGRhdGVTb2NrZXRJZHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQgaW4gdGhpcy5uc3BzKWQuY2FsbCh0aGlzLm5zcHMsdCkmJih0aGlzLm5zcHNbdF0uaWQ9dGhpcy5lbmdpbmUuaWQpfSxhKG4ucHJvdG90eXBlKSxuLnByb3RvdHlwZS5yZWNvbm5lY3Rpb249ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlY29ubmVjdGlvbj0hIXQsdGhpcyk6dGhpcy5fcmVjb25uZWN0aW9ufSxuLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25BdHRlbXB0cz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uQXR0ZW1wdHM9dCx0aGlzKTp0aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0c30sbi5wcm90b3R5cGUucmVjb25uZWN0aW9uRGVsYXk9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlY29ubmVjdGlvbkRlbGF5PXQsdGhpcy5iYWNrb2ZmJiZ0aGlzLmJhY2tvZmYuc2V0TWluKHQpLHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbkRlbGF5fSxuLnByb3RvdHlwZS5yYW5kb21pemF0aW9uRmFjdG9yPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yYW5kb21pemF0aW9uRmFjdG9yPXQsdGhpcy5iYWNrb2ZmJiZ0aGlzLmJhY2tvZmYuc2V0Sml0dGVyKHQpLHRoaXMpOnRoaXMuX3JhbmRvbWl6YXRpb25GYWN0b3J9LG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbkRlbGF5TWF4PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZWNvbm5lY3Rpb25EZWxheU1heD10LHRoaXMuYmFja29mZiYmdGhpcy5iYWNrb2ZmLnNldE1heCh0KSx0aGlzKTp0aGlzLl9yZWNvbm5lY3Rpb25EZWxheU1heH0sbi5wcm90b3R5cGUudGltZW91dD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fdGltZW91dD10LHRoaXMpOnRoaXMuX3RpbWVvdXR9LG4ucHJvdG90eXBlLm1heWJlUmVjb25uZWN0T25PcGVuPWZ1bmN0aW9uKCl7IXRoaXMucmVjb25uZWN0aW5nJiZ0aGlzLl9yZWNvbm5lY3Rpb24mJjA9PT10aGlzLmJhY2tvZmYuYXR0ZW1wdHMmJnRoaXMucmVjb25uZWN0KCl9LG4ucHJvdG90eXBlLm9wZW49bi5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbih0LGUpe2lmKHAoXCJyZWFkeVN0YXRlICVzXCIsdGhpcy5yZWFkeVN0YXRlKSx+dGhpcy5yZWFkeVN0YXRlLmluZGV4T2YoXCJvcGVuXCIpKXJldHVybiB0aGlzO3AoXCJvcGVuaW5nICVzXCIsdGhpcy51cmkpLHRoaXMuZW5naW5lPWkodGhpcy51cmksdGhpcy5vcHRzKTt2YXIgcj10aGlzLmVuZ2luZSxuPXRoaXM7dGhpcy5yZWFkeVN0YXRlPVwib3BlbmluZ1wiLHRoaXMuc2tpcFJlY29ubmVjdD0hMTt2YXIgbz11KHIsXCJvcGVuXCIsZnVuY3Rpb24oKXtuLm9ub3BlbigpLHQmJnQoKX0pLHM9dShyLFwiZXJyb3JcIixmdW5jdGlvbihlKXtpZihwKFwiY29ubmVjdF9lcnJvclwiKSxuLmNsZWFudXAoKSxuLnJlYWR5U3RhdGU9XCJjbG9zZWRcIixuLmVtaXRBbGwoXCJjb25uZWN0X2Vycm9yXCIsZSksdCl7dmFyIHI9bmV3IEVycm9yKFwiQ29ubmVjdGlvbiBlcnJvclwiKTtyLmRhdGE9ZSx0KHIpfWVsc2Ugbi5tYXliZVJlY29ubmVjdE9uT3BlbigpfSk7aWYoITEhPT10aGlzLl90aW1lb3V0KXt2YXIgYT10aGlzLl90aW1lb3V0O3AoXCJjb25uZWN0IGF0dGVtcHQgd2lsbCB0aW1lb3V0IGFmdGVyICVkXCIsYSk7dmFyIGM9c2V0VGltZW91dChmdW5jdGlvbigpe3AoXCJjb25uZWN0IGF0dGVtcHQgdGltZWQgb3V0IGFmdGVyICVkXCIsYSksby5kZXN0cm95KCksci5jbG9zZSgpLHIuZW1pdChcImVycm9yXCIsXCJ0aW1lb3V0XCIpLG4uZW1pdEFsbChcImNvbm5lY3RfdGltZW91dFwiLGEpfSxhKTt0aGlzLnN1YnMucHVzaCh7ZGVzdHJveTpmdW5jdGlvbigpe2NsZWFyVGltZW91dChjKX19KX1yZXR1cm4gdGhpcy5zdWJzLnB1c2gobyksdGhpcy5zdWJzLnB1c2gocyksdGhpc30sbi5wcm90b3R5cGUub25vcGVuPWZ1bmN0aW9uKCl7cChcIm9wZW5cIiksdGhpcy5jbGVhbnVwKCksdGhpcy5yZWFkeVN0YXRlPVwib3BlblwiLHRoaXMuZW1pdChcIm9wZW5cIik7dmFyIHQ9dGhpcy5lbmdpbmU7dGhpcy5zdWJzLnB1c2godSh0LFwiZGF0YVwiLGgodGhpcyxcIm9uZGF0YVwiKSkpLHRoaXMuc3Vicy5wdXNoKHUodCxcInBpbmdcIixoKHRoaXMsXCJvbnBpbmdcIikpKSx0aGlzLnN1YnMucHVzaCh1KHQsXCJwb25nXCIsaCh0aGlzLFwib25wb25nXCIpKSksdGhpcy5zdWJzLnB1c2godSh0LFwiZXJyb3JcIixoKHRoaXMsXCJvbmVycm9yXCIpKSksdGhpcy5zdWJzLnB1c2godSh0LFwiY2xvc2VcIixoKHRoaXMsXCJvbmNsb3NlXCIpKSksdGhpcy5zdWJzLnB1c2godSh0aGlzLmRlY29kZXIsXCJkZWNvZGVkXCIsaCh0aGlzLFwib25kZWNvZGVkXCIpKSl9LG4ucHJvdG90eXBlLm9ucGluZz1mdW5jdGlvbigpe3RoaXMubGFzdFBpbmc9bmV3IERhdGUsdGhpcy5lbWl0QWxsKFwicGluZ1wiKX0sbi5wcm90b3R5cGUub25wb25nPWZ1bmN0aW9uKCl7dGhpcy5lbWl0QWxsKFwicG9uZ1wiLG5ldyBEYXRlLXRoaXMubGFzdFBpbmcpfSxuLnByb3RvdHlwZS5vbmRhdGE9ZnVuY3Rpb24odCl7dGhpcy5kZWNvZGVyLmFkZCh0KX0sbi5wcm90b3R5cGUub25kZWNvZGVkPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcInBhY2tldFwiLHQpfSxuLnByb3RvdHlwZS5vbmVycm9yPWZ1bmN0aW9uKHQpe3AoXCJlcnJvclwiLHQpLHRoaXMuZW1pdEFsbChcImVycm9yXCIsdCl9LG4ucHJvdG90eXBlLnNvY2tldD1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIoKXt+ZihvLmNvbm5lY3Rpbmcsbil8fG8uY29ubmVjdGluZy5wdXNoKG4pfXZhciBuPXRoaXMubnNwc1t0XTtpZighbil7bj1uZXcgcyh0aGlzLHQsZSksdGhpcy5uc3BzW3RdPW47dmFyIG89dGhpcztuLm9uKFwiY29ubmVjdGluZ1wiLHIpLG4ub24oXCJjb25uZWN0XCIsZnVuY3Rpb24oKXtuLmlkPW8uZW5naW5lLmlkfSksdGhpcy5hdXRvQ29ubmVjdCYmcigpfXJldHVybiBufSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKHQpe3ZhciBlPWYodGhpcy5jb25uZWN0aW5nLHQpO35lJiZ0aGlzLmNvbm5lY3Rpbmcuc3BsaWNlKGUsMSksdGhpcy5jb25uZWN0aW5nLmxlbmd0aHx8dGhpcy5jbG9zZSgpfSxuLnByb3RvdHlwZS5wYWNrZXQ9ZnVuY3Rpb24odCl7cChcIndyaXRpbmcgcGFja2V0ICVqXCIsdCk7dmFyIGU9dGhpczt0LnF1ZXJ5JiYwPT09dC50eXBlJiYodC5uc3ArPVwiP1wiK3QucXVlcnkpLGUuZW5jb2Rpbmc/ZS5wYWNrZXRCdWZmZXIucHVzaCh0KTooZS5lbmNvZGluZz0hMCx0aGlzLmVuY29kZXIuZW5jb2RlKHQsZnVuY3Rpb24ocil7Zm9yKHZhciBuPTA7bjxyLmxlbmd0aDtuKyspZS5lbmdpbmUud3JpdGUocltuXSx0Lm9wdGlvbnMpO2UuZW5jb2Rpbmc9ITEsZS5wcm9jZXNzUGFja2V0UXVldWUoKX0pKX0sbi5wcm90b3R5cGUucHJvY2Vzc1BhY2tldFF1ZXVlPWZ1bmN0aW9uKCl7aWYodGhpcy5wYWNrZXRCdWZmZXIubGVuZ3RoPjAmJiF0aGlzLmVuY29kaW5nKXt2YXIgdD10aGlzLnBhY2tldEJ1ZmZlci5zaGlmdCgpO3RoaXMucGFja2V0KHQpfX0sbi5wcm90b3R5cGUuY2xlYW51cD1mdW5jdGlvbigpe3AoXCJjbGVhbnVwXCIpO2Zvcih2YXIgdD10aGlzLnN1YnMubGVuZ3RoLGU9MDtlPHQ7ZSsrKXt2YXIgcj10aGlzLnN1YnMuc2hpZnQoKTtyLmRlc3Ryb3koKX10aGlzLnBhY2tldEJ1ZmZlcj1bXSx0aGlzLmVuY29kaW5nPSExLHRoaXMubGFzdFBpbmc9bnVsbCx0aGlzLmRlY29kZXIuZGVzdHJveSgpfSxuLnByb3RvdHlwZS5jbG9zZT1uLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7cChcImRpc2Nvbm5lY3RcIiksdGhpcy5za2lwUmVjb25uZWN0PSEwLHRoaXMucmVjb25uZWN0aW5nPSExLFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlJiZ0aGlzLmNsZWFudXAoKSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmVuZ2luZSYmdGhpcy5lbmdpbmUuY2xvc2UoKX0sbi5wcm90b3R5cGUub25jbG9zZT1mdW5jdGlvbih0KXtwKFwib25jbG9zZVwiKSx0aGlzLmNsZWFudXAoKSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmVtaXQoXCJjbG9zZVwiLHQpLHRoaXMuX3JlY29ubmVjdGlvbiYmIXRoaXMuc2tpcFJlY29ubmVjdCYmdGhpcy5yZWNvbm5lY3QoKX0sbi5wcm90b3R5cGUucmVjb25uZWN0PWZ1bmN0aW9uKCl7aWYodGhpcy5yZWNvbm5lY3Rpbmd8fHRoaXMuc2tpcFJlY29ubmVjdClyZXR1cm4gdGhpczt2YXIgdD10aGlzO2lmKHRoaXMuYmFja29mZi5hdHRlbXB0cz49dGhpcy5fcmVjb25uZWN0aW9uQXR0ZW1wdHMpcChcInJlY29ubmVjdCBmYWlsZWRcIiksdGhpcy5iYWNrb2ZmLnJlc2V0KCksdGhpcy5lbWl0QWxsKFwicmVjb25uZWN0X2ZhaWxlZFwiKSx0aGlzLnJlY29ubmVjdGluZz0hMTtlbHNle3ZhciBlPXRoaXMuYmFja29mZi5kdXJhdGlvbigpO3AoXCJ3aWxsIHdhaXQgJWRtcyBiZWZvcmUgcmVjb25uZWN0IGF0dGVtcHRcIixlKSx0aGlzLnJlY29ubmVjdGluZz0hMDt2YXIgcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5za2lwUmVjb25uZWN0fHwocChcImF0dGVtcHRpbmcgcmVjb25uZWN0XCIpLHQuZW1pdEFsbChcInJlY29ubmVjdF9hdHRlbXB0XCIsdC5iYWNrb2ZmLmF0dGVtcHRzKSx0LmVtaXRBbGwoXCJyZWNvbm5lY3RpbmdcIix0LmJhY2tvZmYuYXR0ZW1wdHMpLHQuc2tpcFJlY29ubmVjdHx8dC5vcGVuKGZ1bmN0aW9uKGUpe2U/KHAoXCJyZWNvbm5lY3QgYXR0ZW1wdCBlcnJvclwiKSx0LnJlY29ubmVjdGluZz0hMSx0LnJlY29ubmVjdCgpLHQuZW1pdEFsbChcInJlY29ubmVjdF9lcnJvclwiLGUuZGF0YSkpOihwKFwicmVjb25uZWN0IHN1Y2Nlc3NcIiksdC5vbnJlY29ubmVjdCgpKX0pKX0sZSk7dGhpcy5zdWJzLnB1c2goe2Rlc3Ryb3k6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocil9fSl9fSxuLnByb3RvdHlwZS5vbnJlY29ubmVjdD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuYmFja29mZi5hdHRlbXB0czt0aGlzLnJlY29ubmVjdGluZz0hMSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnVwZGF0ZVNvY2tldElkcygpLHRoaXMuZW1pdEFsbChcInJlY29ubmVjdFwiLHQpfX0sZnVuY3Rpb24odCxlLHIpe3QuZXhwb3J0cz1yKDE5KX0sZnVuY3Rpb24odCxlLHIpe3QuZXhwb3J0cz1yKDIwKSx0LmV4cG9ydHMucGFyc2VyPXIoMjcpfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxyKXtpZighKHRoaXMgaW5zdGFuY2VvZiBuKSlyZXR1cm4gbmV3IG4odCxyKTtyPXJ8fHt9LHQmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiYocj10LHQ9bnVsbCksdD8odD1oKHQpLHIuaG9zdG5hbWU9dC5ob3N0LHIuc2VjdXJlPVwiaHR0cHNcIj09PXQucHJvdG9jb2x8fFwid3NzXCI9PT10LnByb3RvY29sLHIucG9ydD10LnBvcnQsdC5xdWVyeSYmKHIucXVlcnk9dC5xdWVyeSkpOnIuaG9zdCYmKHIuaG9zdG5hbWU9aChyLmhvc3QpLmhvc3QpLFxudGhpcy5zZWN1cmU9bnVsbCE9ci5zZWN1cmU/ci5zZWN1cmU6ZS5sb2NhdGlvbiYmXCJodHRwczpcIj09PWxvY2F0aW9uLnByb3RvY29sLHIuaG9zdG5hbWUmJiFyLnBvcnQmJihyLnBvcnQ9dGhpcy5zZWN1cmU/XCI0NDNcIjpcIjgwXCIpLHRoaXMuYWdlbnQ9ci5hZ2VudHx8ITEsdGhpcy5ob3N0bmFtZT1yLmhvc3RuYW1lfHwoZS5sb2NhdGlvbj9sb2NhdGlvbi5ob3N0bmFtZTpcImxvY2FsaG9zdFwiKSx0aGlzLnBvcnQ9ci5wb3J0fHwoZS5sb2NhdGlvbiYmbG9jYXRpb24ucG9ydD9sb2NhdGlvbi5wb3J0OnRoaXMuc2VjdXJlPzQ0Mzo4MCksdGhpcy5xdWVyeT1yLnF1ZXJ5fHx7fSxcInN0cmluZ1wiPT10eXBlb2YgdGhpcy5xdWVyeSYmKHRoaXMucXVlcnk9Zi5kZWNvZGUodGhpcy5xdWVyeSkpLHRoaXMudXBncmFkZT0hMSE9PXIudXBncmFkZSx0aGlzLnBhdGg9KHIucGF0aHx8XCIvZW5naW5lLmlvXCIpLnJlcGxhY2UoL1xcLyQvLFwiXCIpK1wiL1wiLHRoaXMuZm9yY2VKU09OUD0hIXIuZm9yY2VKU09OUCx0aGlzLmpzb25wPSExIT09ci5qc29ucCx0aGlzLmZvcmNlQmFzZTY0PSEhci5mb3JjZUJhc2U2NCx0aGlzLmVuYWJsZXNYRFI9ISFyLmVuYWJsZXNYRFIsdGhpcy50aW1lc3RhbXBQYXJhbT1yLnRpbWVzdGFtcFBhcmFtfHxcInRcIix0aGlzLnRpbWVzdGFtcFJlcXVlc3RzPXIudGltZXN0YW1wUmVxdWVzdHMsdGhpcy50cmFuc3BvcnRzPXIudHJhbnNwb3J0c3x8W1wicG9sbGluZ1wiLFwid2Vic29ja2V0XCJdLHRoaXMucmVhZHlTdGF0ZT1cIlwiLHRoaXMud3JpdGVCdWZmZXI9W10sdGhpcy5wcmV2QnVmZmVyTGVuPTAsdGhpcy5wb2xpY3lQb3J0PXIucG9saWN5UG9ydHx8ODQzLHRoaXMucmVtZW1iZXJVcGdyYWRlPXIucmVtZW1iZXJVcGdyYWRlfHwhMSx0aGlzLmJpbmFyeVR5cGU9bnVsbCx0aGlzLm9ubHlCaW5hcnlVcGdyYWRlcz1yLm9ubHlCaW5hcnlVcGdyYWRlcyx0aGlzLnBlck1lc3NhZ2VEZWZsYXRlPSExIT09ci5wZXJNZXNzYWdlRGVmbGF0ZSYmKHIucGVyTWVzc2FnZURlZmxhdGV8fHt9KSwhMD09PXRoaXMucGVyTWVzc2FnZURlZmxhdGUmJih0aGlzLnBlck1lc3NhZ2VEZWZsYXRlPXt9KSx0aGlzLnBlck1lc3NhZ2VEZWZsYXRlJiZudWxsPT10aGlzLnBlck1lc3NhZ2VEZWZsYXRlLnRocmVzaG9sZCYmKHRoaXMucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkPTEwMjQpLHRoaXMucGZ4PXIucGZ4fHxudWxsLHRoaXMua2V5PXIua2V5fHxudWxsLHRoaXMucGFzc3BocmFzZT1yLnBhc3NwaHJhc2V8fG51bGwsdGhpcy5jZXJ0PXIuY2VydHx8bnVsbCx0aGlzLmNhPXIuY2F8fG51bGwsdGhpcy5jaXBoZXJzPXIuY2lwaGVyc3x8bnVsbCx0aGlzLnJlamVjdFVuYXV0aG9yaXplZD12b2lkIDA9PT1yLnJlamVjdFVuYXV0aG9yaXplZD9udWxsOnIucmVqZWN0VW5hdXRob3JpemVkLHRoaXMuZm9yY2VOb2RlPSEhci5mb3JjZU5vZGU7dmFyIG89XCJvYmplY3RcIj09dHlwZW9mIGUmJmU7by5nbG9iYWw9PT1vJiYoci5leHRyYUhlYWRlcnMmJk9iamVjdC5rZXlzKHIuZXh0cmFIZWFkZXJzKS5sZW5ndGg+MCYmKHRoaXMuZXh0cmFIZWFkZXJzPXIuZXh0cmFIZWFkZXJzKSxyLmxvY2FsQWRkcmVzcyYmKHRoaXMubG9jYWxBZGRyZXNzPXIubG9jYWxBZGRyZXNzKSksdGhpcy5pZD1udWxsLHRoaXMudXBncmFkZXM9bnVsbCx0aGlzLnBpbmdJbnRlcnZhbD1udWxsLHRoaXMucGluZ1RpbWVvdXQ9bnVsbCx0aGlzLnBpbmdJbnRlcnZhbFRpbWVyPW51bGwsdGhpcy5waW5nVGltZW91dFRpbWVyPW51bGwsdGhpcy5vcGVuKCl9ZnVuY3Rpb24gbyh0KXt2YXIgZT17fTtmb3IodmFyIHIgaW4gdCl0Lmhhc093blByb3BlcnR5KHIpJiYoZVtyXT10W3JdKTtyZXR1cm4gZX12YXIgaT1yKDIxKSxzPXIoMzUpLGE9cigzKShcImVuZ2luZS5pby1jbGllbnQ6c29ja2V0XCIpLGM9cig0MiksdT1yKDI3KSxoPXIoMikscD1yKDQzKSxmPXIoMzYpO3QuZXhwb3J0cz1uLG4ucHJpb3JXZWJzb2NrZXRTdWNjZXNzPSExLHMobi5wcm90b3R5cGUpLG4ucHJvdG9jb2w9dS5wcm90b2NvbCxuLlNvY2tldD1uLG4uVHJhbnNwb3J0PXIoMjYpLG4udHJhbnNwb3J0cz1yKDIxKSxuLnBhcnNlcj1yKDI3KSxuLnByb3RvdHlwZS5jcmVhdGVUcmFuc3BvcnQ9ZnVuY3Rpb24odCl7YSgnY3JlYXRpbmcgdHJhbnNwb3J0IFwiJXNcIicsdCk7dmFyIGU9byh0aGlzLnF1ZXJ5KTtlLkVJTz11LnByb3RvY29sLGUudHJhbnNwb3J0PXQsdGhpcy5pZCYmKGUuc2lkPXRoaXMuaWQpO3ZhciByPW5ldyBpW3RdKHthZ2VudDp0aGlzLmFnZW50LGhvc3RuYW1lOnRoaXMuaG9zdG5hbWUscG9ydDp0aGlzLnBvcnQsc2VjdXJlOnRoaXMuc2VjdXJlLHBhdGg6dGhpcy5wYXRoLHF1ZXJ5OmUsZm9yY2VKU09OUDp0aGlzLmZvcmNlSlNPTlAsanNvbnA6dGhpcy5qc29ucCxmb3JjZUJhc2U2NDp0aGlzLmZvcmNlQmFzZTY0LGVuYWJsZXNYRFI6dGhpcy5lbmFibGVzWERSLHRpbWVzdGFtcFJlcXVlc3RzOnRoaXMudGltZXN0YW1wUmVxdWVzdHMsdGltZXN0YW1wUGFyYW06dGhpcy50aW1lc3RhbXBQYXJhbSxwb2xpY3lQb3J0OnRoaXMucG9saWN5UG9ydCxzb2NrZXQ6dGhpcyxwZng6dGhpcy5wZngsa2V5OnRoaXMua2V5LHBhc3NwaHJhc2U6dGhpcy5wYXNzcGhyYXNlLGNlcnQ6dGhpcy5jZXJ0LGNhOnRoaXMuY2EsY2lwaGVyczp0aGlzLmNpcGhlcnMscmVqZWN0VW5hdXRob3JpemVkOnRoaXMucmVqZWN0VW5hdXRob3JpemVkLHBlck1lc3NhZ2VEZWZsYXRlOnRoaXMucGVyTWVzc2FnZURlZmxhdGUsZXh0cmFIZWFkZXJzOnRoaXMuZXh0cmFIZWFkZXJzLGZvcmNlTm9kZTp0aGlzLmZvcmNlTm9kZSxsb2NhbEFkZHJlc3M6dGhpcy5sb2NhbEFkZHJlc3N9KTtyZXR1cm4gcn0sbi5wcm90b3R5cGUub3Blbj1mdW5jdGlvbigpe3ZhciB0O2lmKHRoaXMucmVtZW1iZXJVcGdyYWRlJiZuLnByaW9yV2Vic29ja2V0U3VjY2VzcyYmdGhpcy50cmFuc3BvcnRzLmluZGV4T2YoXCJ3ZWJzb2NrZXRcIikhPT0tMSl0PVwid2Vic29ja2V0XCI7ZWxzZXtpZigwPT09dGhpcy50cmFuc3BvcnRzLmxlbmd0aCl7dmFyIGU9dGhpcztyZXR1cm4gdm9pZCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5lbWl0KFwiZXJyb3JcIixcIk5vIHRyYW5zcG9ydHMgYXZhaWxhYmxlXCIpfSwwKX10PXRoaXMudHJhbnNwb3J0c1swXX10aGlzLnJlYWR5U3RhdGU9XCJvcGVuaW5nXCI7dHJ5e3Q9dGhpcy5jcmVhdGVUcmFuc3BvcnQodCl9Y2F0Y2godCl7cmV0dXJuIHRoaXMudHJhbnNwb3J0cy5zaGlmdCgpLHZvaWQgdGhpcy5vcGVuKCl9dC5vcGVuKCksdGhpcy5zZXRUcmFuc3BvcnQodCl9LG4ucHJvdG90eXBlLnNldFRyYW5zcG9ydD1mdW5jdGlvbih0KXthKFwic2V0dGluZyB0cmFuc3BvcnQgJXNcIix0Lm5hbWUpO3ZhciBlPXRoaXM7dGhpcy50cmFuc3BvcnQmJihhKFwiY2xlYXJpbmcgZXhpc3RpbmcgdHJhbnNwb3J0ICVzXCIsdGhpcy50cmFuc3BvcnQubmFtZSksdGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKCkpLHRoaXMudHJhbnNwb3J0PXQsdC5vbihcImRyYWluXCIsZnVuY3Rpb24oKXtlLm9uRHJhaW4oKX0pLm9uKFwicGFja2V0XCIsZnVuY3Rpb24odCl7ZS5vblBhY2tldCh0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbih0KXtlLm9uRXJyb3IodCl9KS5vbihcImNsb3NlXCIsZnVuY3Rpb24oKXtlLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgY2xvc2VcIil9KX0sbi5wcm90b3R5cGUucHJvYmU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSgpe2lmKGYub25seUJpbmFyeVVwZ3JhZGVzKXt2YXIgZT0hdGhpcy5zdXBwb3J0c0JpbmFyeSYmZi50cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnk7cD1wfHxlfXB8fChhKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIG9wZW5lZCcsdCksaC5zZW5kKFt7dHlwZTpcInBpbmdcIixkYXRhOlwicHJvYmVcIn1dKSxoLm9uY2UoXCJwYWNrZXRcIixmdW5jdGlvbihlKXtpZighcClpZihcInBvbmdcIj09PWUudHlwZSYmXCJwcm9iZVwiPT09ZS5kYXRhKXtpZihhKCdwcm9iZSB0cmFuc3BvcnQgXCIlc1wiIHBvbmcnLHQpLGYudXBncmFkaW5nPSEwLGYuZW1pdChcInVwZ3JhZGluZ1wiLGgpLCFoKXJldHVybjtuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz1cIndlYnNvY2tldFwiPT09aC5uYW1lLGEoJ3BhdXNpbmcgY3VycmVudCB0cmFuc3BvcnQgXCIlc1wiJyxmLnRyYW5zcG9ydC5uYW1lKSxmLnRyYW5zcG9ydC5wYXVzZShmdW5jdGlvbigpe3B8fFwiY2xvc2VkXCIhPT1mLnJlYWR5U3RhdGUmJihhKFwiY2hhbmdpbmcgdHJhbnNwb3J0IGFuZCBzZW5kaW5nIHVwZ3JhZGUgcGFja2V0XCIpLHUoKSxmLnNldFRyYW5zcG9ydChoKSxoLnNlbmQoW3t0eXBlOlwidXBncmFkZVwifV0pLGYuZW1pdChcInVwZ3JhZGVcIixoKSxoPW51bGwsZi51cGdyYWRpbmc9ITEsZi5mbHVzaCgpKX0pfWVsc2V7YSgncHJvYmUgdHJhbnNwb3J0IFwiJXNcIiBmYWlsZWQnLHQpO3ZhciByPW5ldyBFcnJvcihcInByb2JlIGVycm9yXCIpO3IudHJhbnNwb3J0PWgubmFtZSxmLmVtaXQoXCJ1cGdyYWRlRXJyb3JcIixyKX19KSl9ZnVuY3Rpb24gcigpe3B8fChwPSEwLHUoKSxoLmNsb3NlKCksaD1udWxsKX1mdW5jdGlvbiBvKGUpe3ZhciBuPW5ldyBFcnJvcihcInByb2JlIGVycm9yOiBcIitlKTtuLnRyYW5zcG9ydD1oLm5hbWUscigpLGEoJ3Byb2JlIHRyYW5zcG9ydCBcIiVzXCIgZmFpbGVkIGJlY2F1c2Ugb2YgZXJyb3I6ICVzJyx0LGUpLGYuZW1pdChcInVwZ3JhZGVFcnJvclwiLG4pfWZ1bmN0aW9uIGkoKXtvKFwidHJhbnNwb3J0IGNsb3NlZFwiKX1mdW5jdGlvbiBzKCl7byhcInNvY2tldCBjbG9zZWRcIil9ZnVuY3Rpb24gYyh0KXtoJiZ0Lm5hbWUhPT1oLm5hbWUmJihhKCdcIiVzXCIgd29ya3MgLSBhYm9ydGluZyBcIiVzXCInLHQubmFtZSxoLm5hbWUpLHIoKSl9ZnVuY3Rpb24gdSgpe2gucmVtb3ZlTGlzdGVuZXIoXCJvcGVuXCIsZSksaC5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsbyksaC5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIsaSksZi5yZW1vdmVMaXN0ZW5lcihcImNsb3NlXCIscyksZi5yZW1vdmVMaXN0ZW5lcihcInVwZ3JhZGluZ1wiLGMpfWEoJ3Byb2JpbmcgdHJhbnNwb3J0IFwiJXNcIicsdCk7dmFyIGg9dGhpcy5jcmVhdGVUcmFuc3BvcnQodCx7cHJvYmU6MX0pLHA9ITEsZj10aGlzO24ucHJpb3JXZWJzb2NrZXRTdWNjZXNzPSExLGgub25jZShcIm9wZW5cIixlKSxoLm9uY2UoXCJlcnJvclwiLG8pLGgub25jZShcImNsb3NlXCIsaSksdGhpcy5vbmNlKFwiY2xvc2VcIixzKSx0aGlzLm9uY2UoXCJ1cGdyYWRpbmdcIixjKSxoLm9wZW4oKX0sbi5wcm90b3R5cGUub25PcGVuPWZ1bmN0aW9uKCl7aWYoYShcInNvY2tldCBvcGVuXCIpLHRoaXMucmVhZHlTdGF0ZT1cIm9wZW5cIixuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz1cIndlYnNvY2tldFwiPT09dGhpcy50cmFuc3BvcnQubmFtZSx0aGlzLmVtaXQoXCJvcGVuXCIpLHRoaXMuZmx1c2goKSxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZSYmdGhpcy51cGdyYWRlJiZ0aGlzLnRyYW5zcG9ydC5wYXVzZSl7YShcInN0YXJ0aW5nIHVwZ3JhZGUgcHJvYmVzXCIpO2Zvcih2YXIgdD0wLGU9dGhpcy51cGdyYWRlcy5sZW5ndGg7dDxlO3QrKyl0aGlzLnByb2JlKHRoaXMudXBncmFkZXNbdF0pfX0sbi5wcm90b3R5cGUub25QYWNrZXQ9ZnVuY3Rpb24odCl7aWYoXCJvcGVuaW5nXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlfHxcImNsb3NpbmdcIj09PXRoaXMucmVhZHlTdGF0ZSlzd2l0Y2goYSgnc29ja2V0IHJlY2VpdmU6IHR5cGUgXCIlc1wiLCBkYXRhIFwiJXNcIicsdC50eXBlLHQuZGF0YSksdGhpcy5lbWl0KFwicGFja2V0XCIsdCksdGhpcy5lbWl0KFwiaGVhcnRiZWF0XCIpLHQudHlwZSl7Y2FzZVwib3BlblwiOnRoaXMub25IYW5kc2hha2UocCh0LmRhdGEpKTticmVhaztjYXNlXCJwb25nXCI6dGhpcy5zZXRQaW5nKCksdGhpcy5lbWl0KFwicG9uZ1wiKTticmVhaztjYXNlXCJlcnJvclwiOnZhciBlPW5ldyBFcnJvcihcInNlcnZlciBlcnJvclwiKTtlLmNvZGU9dC5kYXRhLHRoaXMub25FcnJvcihlKTticmVhaztjYXNlXCJtZXNzYWdlXCI6dGhpcy5lbWl0KFwiZGF0YVwiLHQuZGF0YSksdGhpcy5lbWl0KFwibWVzc2FnZVwiLHQuZGF0YSl9ZWxzZSBhKCdwYWNrZXQgcmVjZWl2ZWQgd2l0aCBzb2NrZXQgcmVhZHlTdGF0ZSBcIiVzXCInLHRoaXMucmVhZHlTdGF0ZSl9LG4ucHJvdG90eXBlLm9uSGFuZHNoYWtlPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcImhhbmRzaGFrZVwiLHQpLHRoaXMuaWQ9dC5zaWQsdGhpcy50cmFuc3BvcnQucXVlcnkuc2lkPXQuc2lkLHRoaXMudXBncmFkZXM9dGhpcy5maWx0ZXJVcGdyYWRlcyh0LnVwZ3JhZGVzKSx0aGlzLnBpbmdJbnRlcnZhbD10LnBpbmdJbnRlcnZhbCx0aGlzLnBpbmdUaW1lb3V0PXQucGluZ1RpbWVvdXQsdGhpcy5vbk9wZW4oKSxcImNsb3NlZFwiIT09dGhpcy5yZWFkeVN0YXRlJiYodGhpcy5zZXRQaW5nKCksdGhpcy5yZW1vdmVMaXN0ZW5lcihcImhlYXJ0YmVhdFwiLHRoaXMub25IZWFydGJlYXQpLHRoaXMub24oXCJoZWFydGJlYXRcIix0aGlzLm9uSGVhcnRiZWF0KSl9LG4ucHJvdG90eXBlLm9uSGVhcnRiZWF0PWZ1bmN0aW9uKHQpe2NsZWFyVGltZW91dCh0aGlzLnBpbmdUaW1lb3V0VGltZXIpO3ZhciBlPXRoaXM7ZS5waW5nVGltZW91dFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcImNsb3NlZFwiIT09ZS5yZWFkeVN0YXRlJiZlLm9uQ2xvc2UoXCJwaW5nIHRpbWVvdXRcIil9LHR8fGUucGluZ0ludGVydmFsK2UucGluZ1RpbWVvdXQpfSxuLnByb3RvdHlwZS5zZXRQaW5nPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcztjbGVhclRpbWVvdXQodC5waW5nSW50ZXJ2YWxUaW1lciksdC5waW5nSW50ZXJ2YWxUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YShcIndyaXRpbmcgcGluZyBwYWNrZXQgLSBleHBlY3RpbmcgcG9uZyB3aXRoaW4gJXNtc1wiLHQucGluZ1RpbWVvdXQpLHQucGluZygpLHQub25IZWFydGJlYXQodC5waW5nVGltZW91dCl9LHQucGluZ0ludGVydmFsKX0sbi5wcm90b3R5cGUucGluZz1mdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy5zZW5kUGFja2V0KFwicGluZ1wiLGZ1bmN0aW9uKCl7dC5lbWl0KFwicGluZ1wiKX0pfSxuLnByb3RvdHlwZS5vbkRyYWluPWZ1bmN0aW9uKCl7dGhpcy53cml0ZUJ1ZmZlci5zcGxpY2UoMCx0aGlzLnByZXZCdWZmZXJMZW4pLHRoaXMucHJldkJ1ZmZlckxlbj0wLDA9PT10aGlzLndyaXRlQnVmZmVyLmxlbmd0aD90aGlzLmVtaXQoXCJkcmFpblwiKTp0aGlzLmZsdXNoKCl9LG4ucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7XCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmdGhpcy50cmFuc3BvcnQud3JpdGFibGUmJiF0aGlzLnVwZ3JhZGluZyYmdGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgmJihhKFwiZmx1c2hpbmcgJWQgcGFja2V0cyBpbiBzb2NrZXRcIix0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCksdGhpcy50cmFuc3BvcnQuc2VuZCh0aGlzLndyaXRlQnVmZmVyKSx0aGlzLnByZXZCdWZmZXJMZW49dGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgsdGhpcy5lbWl0KFwiZmx1c2hcIikpfSxuLnByb3RvdHlwZS53cml0ZT1uLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKHQsZSxyKXtyZXR1cm4gdGhpcy5zZW5kUGFja2V0KFwibWVzc2FnZVwiLHQsZSxyKSx0aGlzfSxuLnByb3RvdHlwZS5zZW5kUGFja2V0PWZ1bmN0aW9uKHQsZSxyLG4pe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihuPWUsZT12b2lkIDApLFwiZnVuY3Rpb25cIj09dHlwZW9mIHImJihuPXIscj1udWxsKSxcImNsb3NpbmdcIiE9PXRoaXMucmVhZHlTdGF0ZSYmXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSl7cj1yfHx7fSxyLmNvbXByZXNzPSExIT09ci5jb21wcmVzczt2YXIgbz17dHlwZTp0LGRhdGE6ZSxvcHRpb25zOnJ9O3RoaXMuZW1pdChcInBhY2tldENyZWF0ZVwiLG8pLHRoaXMud3JpdGVCdWZmZXIucHVzaChvKSxuJiZ0aGlzLm9uY2UoXCJmbHVzaFwiLG4pLHRoaXMuZmx1c2goKX19LG4ucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe24ub25DbG9zZShcImZvcmNlZCBjbG9zZVwiKSxhKFwic29ja2V0IGNsb3NpbmcgLSB0ZWxsaW5nIHRyYW5zcG9ydCB0byBjbG9zZVwiKSxuLnRyYW5zcG9ydC5jbG9zZSgpfWZ1bmN0aW9uIGUoKXtuLnJlbW92ZUxpc3RlbmVyKFwidXBncmFkZVwiLGUpLG4ucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRlRXJyb3JcIixlKSx0KCl9ZnVuY3Rpb24gcigpe24ub25jZShcInVwZ3JhZGVcIixlKSxuLm9uY2UoXCJ1cGdyYWRlRXJyb3JcIixlKX1pZihcIm9wZW5pbmdcIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NpbmdcIjt2YXIgbj10aGlzO3RoaXMud3JpdGVCdWZmZXIubGVuZ3RoP3RoaXMub25jZShcImRyYWluXCIsZnVuY3Rpb24oKXt0aGlzLnVwZ3JhZGluZz9yKCk6dCgpfSk6dGhpcy51cGdyYWRpbmc/cigpOnQoKX1yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbih0KXthKFwic29ja2V0IGVycm9yICVqXCIsdCksbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ITEsdGhpcy5lbWl0KFwiZXJyb3JcIix0KSx0aGlzLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgZXJyb3JcIix0KX0sbi5wcm90b3R5cGUub25DbG9zZT1mdW5jdGlvbih0LGUpe2lmKFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlfHxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJjbG9zaW5nXCI9PT10aGlzLnJlYWR5U3RhdGUpe2EoJ3NvY2tldCBjbG9zZSB3aXRoIHJlYXNvbjogXCIlc1wiJyx0KTt2YXIgcj10aGlzO2NsZWFyVGltZW91dCh0aGlzLnBpbmdJbnRlcnZhbFRpbWVyKSxjbGVhclRpbWVvdXQodGhpcy5waW5nVGltZW91dFRpbWVyKSx0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJjbG9zZVwiKSx0aGlzLnRyYW5zcG9ydC5jbG9zZSgpLHRoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMuaWQ9bnVsbCx0aGlzLmVtaXQoXCJjbG9zZVwiLHQsZSksci53cml0ZUJ1ZmZlcj1bXSxyLnByZXZCdWZmZXJMZW49MH19LG4ucHJvdG90eXBlLmZpbHRlclVwZ3JhZGVzPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxyPTAsbj10Lmxlbmd0aDtyPG47cisrKX5jKHRoaXMudHJhbnNwb3J0cyx0W3JdKSYmZS5wdXNoKHRbcl0pO3JldHVybiBlfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbih0KXtmdW5jdGlvbiBuKGUpe3ZhciByLG49ITEsYT0hMSxjPSExIT09ZS5qc29ucDtpZih0LmxvY2F0aW9uKXt2YXIgdT1cImh0dHBzOlwiPT09bG9jYXRpb24ucHJvdG9jb2wsaD1sb2NhdGlvbi5wb3J0O2h8fChoPXU/NDQzOjgwKSxuPWUuaG9zdG5hbWUhPT1sb2NhdGlvbi5ob3N0bmFtZXx8aCE9PWUucG9ydCxhPWUuc2VjdXJlIT09dX1pZihlLnhkb21haW49bixlLnhzY2hlbWU9YSxyPW5ldyBvKGUpLFwib3BlblwiaW4gciYmIWUuZm9yY2VKU09OUClyZXR1cm4gbmV3IGkoZSk7aWYoIWMpdGhyb3cgbmV3IEVycm9yKFwiSlNPTlAgZGlzYWJsZWRcIik7cmV0dXJuIG5ldyBzKGUpfXZhciBvPXIoMjIpLGk9cigyNCkscz1yKDM5KSxhPXIoNDApO2UucG9sbGluZz1uLGUud2Vic29ja2V0PWF9KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7dmFyIG49cigyMyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3ZhciByPXQueGRvbWFpbixvPXQueHNjaGVtZSxpPXQuZW5hYmxlc1hEUjt0cnl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhNTEh0dHBSZXF1ZXN0JiYoIXJ8fG4pKXJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3R9Y2F0Y2godCl7fXRyeXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgWERvbWFpblJlcXVlc3QmJiFvJiZpKXJldHVybiBuZXcgWERvbWFpblJlcXVlc3R9Y2F0Y2godCl7fWlmKCFyKXRyeXtyZXR1cm4gbmV3KGVbW1wiQWN0aXZlXCJdLmNvbmNhdChcIk9iamVjdFwiKS5qb2luKFwiWFwiKV0pKFwiTWljcm9zb2Z0LlhNTEhUVFBcIil9Y2F0Y2godCl7fX19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dHJ5e3QuZXhwb3J0cz1cInVuZGVmaW5lZFwiIT10eXBlb2YgWE1MSHR0cFJlcXVlc3QmJlwid2l0aENyZWRlbnRpYWxzXCJpbiBuZXcgWE1MSHR0cFJlcXVlc3R9Y2F0Y2goZSl7dC5leHBvcnRzPSExfX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8odCl7aWYoYy5jYWxsKHRoaXMsdCksdGhpcy5yZXF1ZXN0VGltZW91dD10LnJlcXVlc3RUaW1lb3V0LGUubG9jYXRpb24pe3ZhciByPVwiaHR0cHM6XCI9PT1sb2NhdGlvbi5wcm90b2NvbCxuPWxvY2F0aW9uLnBvcnQ7bnx8KG49cj80NDM6ODApLHRoaXMueGQ9dC5ob3N0bmFtZSE9PWUubG9jYXRpb24uaG9zdG5hbWV8fG4hPT10LnBvcnQsdGhpcy54cz10LnNlY3VyZSE9PXJ9ZWxzZSB0aGlzLmV4dHJhSGVhZGVycz10LmV4dHJhSGVhZGVyc31mdW5jdGlvbiBpKHQpe3RoaXMubWV0aG9kPXQubWV0aG9kfHxcIkdFVFwiLHRoaXMudXJpPXQudXJpLHRoaXMueGQ9ISF0LnhkLHRoaXMueHM9ISF0LnhzLHRoaXMuYXN5bmM9ITEhPT10LmFzeW5jLHRoaXMuZGF0YT12b2lkIDAhPT10LmRhdGE/dC5kYXRhOm51bGwsdGhpcy5hZ2VudD10LmFnZW50LHRoaXMuaXNCaW5hcnk9dC5pc0JpbmFyeSx0aGlzLnN1cHBvcnRzQmluYXJ5PXQuc3VwcG9ydHNCaW5hcnksdGhpcy5lbmFibGVzWERSPXQuZW5hYmxlc1hEUix0aGlzLnJlcXVlc3RUaW1lb3V0PXQucmVxdWVzdFRpbWVvdXQsdGhpcy5wZng9dC5wZngsdGhpcy5rZXk9dC5rZXksdGhpcy5wYXNzcGhyYXNlPXQucGFzc3BocmFzZSx0aGlzLmNlcnQ9dC5jZXJ0LHRoaXMuY2E9dC5jYSx0aGlzLmNpcGhlcnM9dC5jaXBoZXJzLHRoaXMucmVqZWN0VW5hdXRob3JpemVkPXQucmVqZWN0VW5hdXRob3JpemVkLHRoaXMuZXh0cmFIZWFkZXJzPXQuZXh0cmFIZWFkZXJzLHRoaXMuY3JlYXRlKCl9ZnVuY3Rpb24gcygpe2Zvcih2YXIgdCBpbiBpLnJlcXVlc3RzKWkucmVxdWVzdHMuaGFzT3duUHJvcGVydHkodCkmJmkucmVxdWVzdHNbdF0uYWJvcnQoKX12YXIgYT1yKDIyKSxjPXIoMjUpLHU9cigzNSksaD1yKDM3KSxwPXIoMykoXCJlbmdpbmUuaW8tY2xpZW50OnBvbGxpbmcteGhyXCIpO3QuZXhwb3J0cz1vLHQuZXhwb3J0cy5SZXF1ZXN0PWksaChvLGMpLG8ucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PSEwLG8ucHJvdG90eXBlLnJlcXVlc3Q9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9dHx8e30sdC51cmk9dGhpcy51cmkoKSx0LnhkPXRoaXMueGQsdC54cz10aGlzLnhzLHQuYWdlbnQ9dGhpcy5hZ2VudHx8ITEsdC5zdXBwb3J0c0JpbmFyeT10aGlzLnN1cHBvcnRzQmluYXJ5LHQuZW5hYmxlc1hEUj10aGlzLmVuYWJsZXNYRFIsdC5wZng9dGhpcy5wZngsdC5rZXk9dGhpcy5rZXksdC5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZSx0LmNlcnQ9dGhpcy5jZXJ0LHQuY2E9dGhpcy5jYSx0LmNpcGhlcnM9dGhpcy5jaXBoZXJzLHQucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkLHQucmVxdWVzdFRpbWVvdXQ9dGhpcy5yZXF1ZXN0VGltZW91dCx0LmV4dHJhSGVhZGVycz10aGlzLmV4dHJhSGVhZGVycyxuZXcgaSh0KX0sby5wcm90b3R5cGUuZG9Xcml0ZT1mdW5jdGlvbih0LGUpe3ZhciByPVwic3RyaW5nXCIhPXR5cGVvZiB0JiZ2b2lkIDAhPT10LG49dGhpcy5yZXF1ZXN0KHttZXRob2Q6XCJQT1NUXCIsZGF0YTp0LGlzQmluYXJ5OnJ9KSxvPXRoaXM7bi5vbihcInN1Y2Nlc3NcIixlKSxuLm9uKFwiZXJyb3JcIixmdW5jdGlvbih0KXtvLm9uRXJyb3IoXCJ4aHIgcG9zdCBlcnJvclwiLHQpfSksdGhpcy5zZW5kWGhyPW59LG8ucHJvdG90eXBlLmRvUG9sbD1mdW5jdGlvbigpe3AoXCJ4aHIgcG9sbFwiKTt2YXIgdD10aGlzLnJlcXVlc3QoKSxlPXRoaXM7dC5vbihcImRhdGFcIixmdW5jdGlvbih0KXtlLm9uRGF0YSh0KX0pLHQub24oXCJlcnJvclwiLGZ1bmN0aW9uKHQpe2Uub25FcnJvcihcInhociBwb2xsIGVycm9yXCIsdCl9KSx0aGlzLnBvbGxYaHI9dH0sdShpLnByb3RvdHlwZSksaS5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9e2FnZW50OnRoaXMuYWdlbnQseGRvbWFpbjp0aGlzLnhkLHhzY2hlbWU6dGhpcy54cyxlbmFibGVzWERSOnRoaXMuZW5hYmxlc1hEUn07dC5wZng9dGhpcy5wZngsdC5rZXk9dGhpcy5rZXksdC5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZSx0LmNlcnQ9dGhpcy5jZXJ0LHQuY2E9dGhpcy5jYSx0LmNpcGhlcnM9dGhpcy5jaXBoZXJzLHQucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkO3ZhciByPXRoaXMueGhyPW5ldyBhKHQpLG49dGhpczt0cnl7cChcInhociBvcGVuICVzOiAlc1wiLHRoaXMubWV0aG9kLHRoaXMudXJpKSxyLm9wZW4odGhpcy5tZXRob2QsdGhpcy51cmksdGhpcy5hc3luYyk7dHJ5e2lmKHRoaXMuZXh0cmFIZWFkZXJzKXtyLnNldERpc2FibGVIZWFkZXJDaGVjayghMCk7Zm9yKHZhciBvIGluIHRoaXMuZXh0cmFIZWFkZXJzKXRoaXMuZXh0cmFIZWFkZXJzLmhhc093blByb3BlcnR5KG8pJiZyLnNldFJlcXVlc3RIZWFkZXIobyx0aGlzLmV4dHJhSGVhZGVyc1tvXSl9fWNhdGNoKHQpe31pZih0aGlzLnN1cHBvcnRzQmluYXJ5JiYoci5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiKSxcIlBPU1RcIj09PXRoaXMubWV0aG9kKXRyeXt0aGlzLmlzQmluYXJ5P3Iuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpOnIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpfWNhdGNoKHQpe310cnl7ci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsXCIqLypcIil9Y2F0Y2godCl7fVwid2l0aENyZWRlbnRpYWxzXCJpbiByJiYoci53aXRoQ3JlZGVudGlhbHM9ITApLHRoaXMucmVxdWVzdFRpbWVvdXQmJihyLnRpbWVvdXQ9dGhpcy5yZXF1ZXN0VGltZW91dCksdGhpcy5oYXNYRFIoKT8oci5vbmxvYWQ9ZnVuY3Rpb24oKXtuLm9uTG9hZCgpfSxyLm9uZXJyb3I9ZnVuY3Rpb24oKXtuLm9uRXJyb3Ioci5yZXNwb25zZVRleHQpfSk6ci5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXs0PT09ci5yZWFkeVN0YXRlJiYoMjAwPT09ci5zdGF0dXN8fDEyMjM9PT1yLnN0YXR1cz9uLm9uTG9hZCgpOnNldFRpbWVvdXQoZnVuY3Rpb24oKXtuLm9uRXJyb3Ioci5zdGF0dXMpfSwwKSl9LHAoXCJ4aHIgZGF0YSAlc1wiLHRoaXMuZGF0YSksci5zZW5kKHRoaXMuZGF0YSl9Y2F0Y2godCl7cmV0dXJuIHZvaWQgc2V0VGltZW91dChmdW5jdGlvbigpe24ub25FcnJvcih0KX0sMCl9ZS5kb2N1bWVudCYmKHRoaXMuaW5kZXg9aS5yZXF1ZXN0c0NvdW50KyssaS5yZXF1ZXN0c1t0aGlzLmluZGV4XT10aGlzKX0saS5wcm90b3R5cGUub25TdWNjZXNzPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwic3VjY2Vzc1wiKSx0aGlzLmNsZWFudXAoKX0saS5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcImRhdGFcIix0KSx0aGlzLm9uU3VjY2VzcygpfSxpLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcImVycm9yXCIsdCksdGhpcy5jbGVhbnVwKCEwKX0saS5wcm90b3R5cGUuY2xlYW51cD1mdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgdGhpcy54aHImJm51bGwhPT10aGlzLnhocil7aWYodGhpcy5oYXNYRFIoKT90aGlzLnhoci5vbmxvYWQ9dGhpcy54aHIub25lcnJvcj1uOnRoaXMueGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT1uLHQpdHJ5e3RoaXMueGhyLmFib3J0KCl9Y2F0Y2godCl7fWUuZG9jdW1lbnQmJmRlbGV0ZSBpLnJlcXVlc3RzW3RoaXMuaW5kZXhdLHRoaXMueGhyPW51bGx9fSxpLnByb3RvdHlwZS5vbkxvYWQ9ZnVuY3Rpb24oKXt2YXIgdDt0cnl7dmFyIGU7dHJ5e2U9dGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikuc3BsaXQoXCI7XCIpWzBdfWNhdGNoKHQpe31pZihcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiPT09ZSl0PXRoaXMueGhyLnJlc3BvbnNlfHx0aGlzLnhoci5yZXNwb25zZVRleHQ7ZWxzZSBpZih0aGlzLnN1cHBvcnRzQmluYXJ5KXRyeXt0PVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheSh0aGlzLnhoci5yZXNwb25zZSkpfWNhdGNoKGUpe2Zvcih2YXIgcj1uZXcgVWludDhBcnJheSh0aGlzLnhoci5yZXNwb25zZSksbj1bXSxvPTAsaT1yLmxlbmd0aDtvPGk7bysrKW4ucHVzaChyW29dKTt0PVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuKX1lbHNlIHQ9dGhpcy54aHIucmVzcG9uc2VUZXh0fWNhdGNoKHQpe3RoaXMub25FcnJvcih0KX1udWxsIT10JiZ0aGlzLm9uRGF0YSh0KX0saS5wcm90b3R5cGUuaGFzWERSPWZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGUuWERvbWFpblJlcXVlc3QmJiF0aGlzLnhzJiZ0aGlzLmVuYWJsZXNYRFJ9LGkucHJvdG90eXBlLmFib3J0PWZ1bmN0aW9uKCl7dGhpcy5jbGVhbnVwKCl9LGkucmVxdWVzdHNDb3VudD0wLGkucmVxdWVzdHM9e30sZS5kb2N1bWVudCYmKGUuYXR0YWNoRXZlbnQ/ZS5hdHRhY2hFdmVudChcIm9udW5sb2FkXCIscyk6ZS5hZGRFdmVudExpc3RlbmVyJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIixzLCExKSl9KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlPXQmJnQuZm9yY2VCYXNlNjQ7aCYmIWV8fCh0aGlzLnN1cHBvcnRzQmluYXJ5PSExKSxvLmNhbGwodGhpcyx0KX12YXIgbz1yKDI2KSxpPXIoMzYpLHM9cigyNyksYT1yKDM3KSxjPXIoMzgpLHU9cigzKShcImVuZ2luZS5pby1jbGllbnQ6cG9sbGluZ1wiKTt0LmV4cG9ydHM9bjt2YXIgaD1mdW5jdGlvbigpe3ZhciB0PXIoMjIpLGU9bmV3IHQoe3hkb21haW46ITF9KTtyZXR1cm4gbnVsbCE9ZS5yZXNwb25zZVR5cGV9KCk7YShuLG8pLG4ucHJvdG90eXBlLm5hbWU9XCJwb2xsaW5nXCIsbi5wcm90b3R5cGUuZG9PcGVuPWZ1bmN0aW9uKCl7dGhpcy5wb2xsKCl9LG4ucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoKXt1KFwicGF1c2VkXCIpLHIucmVhZHlTdGF0ZT1cInBhdXNlZFwiLHQoKX12YXIgcj10aGlzO2lmKHRoaXMucmVhZHlTdGF0ZT1cInBhdXNpbmdcIix0aGlzLnBvbGxpbmd8fCF0aGlzLndyaXRhYmxlKXt2YXIgbj0wO3RoaXMucG9sbGluZyYmKHUoXCJ3ZSBhcmUgY3VycmVudGx5IHBvbGxpbmcgLSB3YWl0aW5nIHRvIHBhdXNlXCIpLG4rKyx0aGlzLm9uY2UoXCJwb2xsQ29tcGxldGVcIixmdW5jdGlvbigpe3UoXCJwcmUtcGF1c2UgcG9sbGluZyBjb21wbGV0ZVwiKSwtLW58fGUoKX0pKSx0aGlzLndyaXRhYmxlfHwodShcIndlIGFyZSBjdXJyZW50bHkgd3JpdGluZyAtIHdhaXRpbmcgdG8gcGF1c2VcIiksbisrLHRoaXMub25jZShcImRyYWluXCIsZnVuY3Rpb24oKXt1KFwicHJlLXBhdXNlIHdyaXRpbmcgY29tcGxldGVcIiksLS1ufHxlKCl9KSl9ZWxzZSBlKCl9LG4ucHJvdG90eXBlLnBvbGw9ZnVuY3Rpb24oKXt1KFwicG9sbGluZ1wiKSx0aGlzLnBvbGxpbmc9ITAsdGhpcy5kb1BvbGwoKSx0aGlzLmVtaXQoXCJwb2xsXCIpfSxuLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24odCl7dmFyIGU9dGhpczt1KFwicG9sbGluZyBnb3QgZGF0YSAlc1wiLHQpO3ZhciByPWZ1bmN0aW9uKHQscixuKXtyZXR1cm5cIm9wZW5pbmdcIj09PWUucmVhZHlTdGF0ZSYmZS5vbk9wZW4oKSxcImNsb3NlXCI9PT10LnR5cGU/KGUub25DbG9zZSgpLCExKTp2b2lkIGUub25QYWNrZXQodCl9O3MuZGVjb2RlUGF5bG9hZCh0LHRoaXMuc29ja2V0LmJpbmFyeVR5cGUsciksXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmKHRoaXMucG9sbGluZz0hMSx0aGlzLmVtaXQoXCJwb2xsQ29tcGxldGVcIiksXCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGU/dGhpcy5wb2xsKCk6dSgnaWdub3JpbmcgcG9sbCAtIHRyYW5zcG9ydCBzdGF0ZSBcIiVzXCInLHRoaXMucmVhZHlTdGF0ZSkpfSxuLnByb3RvdHlwZS5kb0Nsb3NlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3UoXCJ3cml0aW5nIGNsb3NlIHBhY2tldFwiKSxlLndyaXRlKFt7dHlwZTpcImNsb3NlXCJ9XSl9dmFyIGU9dGhpcztcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZT8odShcInRyYW5zcG9ydCBvcGVuIC0gY2xvc2luZ1wiKSx0KCkpOih1KFwidHJhbnNwb3J0IG5vdCBvcGVuIC0gZGVmZXJyaW5nIGNsb3NlXCIpLHRoaXMub25jZShcIm9wZW5cIix0KSl9LG4ucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7dGhpcy53cml0YWJsZT0hMTt2YXIgcj1mdW5jdGlvbigpe2Uud3JpdGFibGU9ITAsZS5lbWl0KFwiZHJhaW5cIil9O3MuZW5jb2RlUGF5bG9hZCh0LHRoaXMuc3VwcG9ydHNCaW5hcnksZnVuY3Rpb24odCl7ZS5kb1dyaXRlKHQscil9KX0sbi5wcm90b3R5cGUudXJpPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5xdWVyeXx8e30sZT10aGlzLnNlY3VyZT9cImh0dHBzXCI6XCJodHRwXCIscj1cIlwiOyExIT09dGhpcy50aW1lc3RhbXBSZXF1ZXN0cyYmKHRbdGhpcy50aW1lc3RhbXBQYXJhbV09YygpKSx0aGlzLnN1cHBvcnRzQmluYXJ5fHx0LnNpZHx8KHQuYjY0PTEpLHQ9aS5lbmNvZGUodCksdGhpcy5wb3J0JiYoXCJodHRwc1wiPT09ZSYmNDQzIT09TnVtYmVyKHRoaXMucG9ydCl8fFwiaHR0cFwiPT09ZSYmODAhPT1OdW1iZXIodGhpcy5wb3J0KSkmJihyPVwiOlwiK3RoaXMucG9ydCksdC5sZW5ndGgmJih0PVwiP1wiK3QpO3ZhciBuPXRoaXMuaG9zdG5hbWUuaW5kZXhPZihcIjpcIikhPT0tMTtyZXR1cm4gZStcIjovL1wiKyhuP1wiW1wiK3RoaXMuaG9zdG5hbWUrXCJdXCI6dGhpcy5ob3N0bmFtZSkrcit0aGlzLnBhdGgrdH19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3RoaXMucGF0aD10LnBhdGgsdGhpcy5ob3N0bmFtZT10Lmhvc3RuYW1lLHRoaXMucG9ydD10LnBvcnQsdGhpcy5zZWN1cmU9dC5zZWN1cmUsdGhpcy5xdWVyeT10LnF1ZXJ5LHRoaXMudGltZXN0YW1wUGFyYW09dC50aW1lc3RhbXBQYXJhbSx0aGlzLnRpbWVzdGFtcFJlcXVlc3RzPXQudGltZXN0YW1wUmVxdWVzdHMsdGhpcy5yZWFkeVN0YXRlPVwiXCIsdGhpcy5hZ2VudD10LmFnZW50fHwhMSx0aGlzLnNvY2tldD10LnNvY2tldCx0aGlzLmVuYWJsZXNYRFI9dC5lbmFibGVzWERSLHRoaXMucGZ4PXQucGZ4LHRoaXMua2V5PXQua2V5LHRoaXMucGFzc3BocmFzZT10LnBhc3NwaHJhc2UsdGhpcy5jZXJ0PXQuY2VydCx0aGlzLmNhPXQuY2EsdGhpcy5jaXBoZXJzPXQuY2lwaGVycyx0aGlzLnJlamVjdFVuYXV0aG9yaXplZD10LnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmZvcmNlTm9kZT10LmZvcmNlTm9kZSx0aGlzLmV4dHJhSGVhZGVycz10LmV4dHJhSGVhZGVycyx0aGlzLmxvY2FsQWRkcmVzcz10LmxvY2FsQWRkcmVzc312YXIgbz1yKDI3KSxpPXIoMzUpO3QuZXhwb3J0cz1uLGkobi5wcm90b3R5cGUpLG4ucHJvdG90eXBlLm9uRXJyb3I9ZnVuY3Rpb24odCxlKXt2YXIgcj1uZXcgRXJyb3IodCk7cmV0dXJuIHIudHlwZT1cIlRyYW5zcG9ydEVycm9yXCIsci5kZXNjcmlwdGlvbj1lLHRoaXMuZW1pdChcImVycm9yXCIsciksdGhpc30sbi5wcm90b3R5cGUub3Blbj1mdW5jdGlvbigpe3JldHVyblwiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJlwiXCIhPT10aGlzLnJlYWR5U3RhdGV8fCh0aGlzLnJlYWR5U3RhdGU9XCJvcGVuaW5nXCIsdGhpcy5kb09wZW4oKSksdGhpc30sbi5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXtyZXR1cm5cIm9wZW5pbmdcIiE9PXRoaXMucmVhZHlTdGF0ZSYmXCJvcGVuXCIhPT10aGlzLnJlYWR5U3RhdGV8fCh0aGlzLmRvQ2xvc2UoKSx0aGlzLm9uQ2xvc2UoKSksdGhpc30sbi5wcm90b3R5cGUuc2VuZD1mdW5jdGlvbih0KXtpZihcIm9wZW5cIiE9PXRoaXMucmVhZHlTdGF0ZSl0aHJvdyBuZXcgRXJyb3IoXCJUcmFuc3BvcnQgbm90IG9wZW5cIik7dGhpcy53cml0ZSh0KX0sbi5wcm90b3R5cGUub25PcGVuPWZ1bmN0aW9uKCl7dGhpcy5yZWFkeVN0YXRlPVwib3BlblwiLHRoaXMud3JpdGFibGU9ITAsdGhpcy5lbWl0KFwib3BlblwiKX0sbi5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKHQpe3ZhciBlPW8uZGVjb2RlUGFja2V0KHQsdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSk7dGhpcy5vblBhY2tldChlKX0sbi5wcm90b3R5cGUub25QYWNrZXQ9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwicGFja2V0XCIsdCl9LG4ucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmVtaXQoXCJjbG9zZVwiKX19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24odCl7ZnVuY3Rpb24gbih0LHIpe3ZhciBuPVwiYlwiK2UucGFja2V0c1t0LnR5cGVdK3QuZGF0YS5kYXRhO3JldHVybiByKG4pfWZ1bmN0aW9uIG8odCxyLG4pe2lmKCFyKXJldHVybiBlLmVuY29kZUJhc2U2NFBhY2tldCh0LG4pO3ZhciBvPXQuZGF0YSxpPW5ldyBVaW50OEFycmF5KG8pLHM9bmV3IFVpbnQ4QXJyYXkoMStvLmJ5dGVMZW5ndGgpO3NbMF09dlt0LnR5cGVdO2Zvcih2YXIgYT0wO2E8aS5sZW5ndGg7YSsrKXNbYSsxXT1pW2FdO3JldHVybiBuKHMuYnVmZmVyKX1mdW5jdGlvbiBpKHQscixuKXtpZighcilyZXR1cm4gZS5lbmNvZGVCYXNlNjRQYWNrZXQodCxuKTt2YXIgbz1uZXcgRmlsZVJlYWRlcjtyZXR1cm4gby5vbmxvYWQ9ZnVuY3Rpb24oKXt0LmRhdGE9by5yZXN1bHQsZS5lbmNvZGVQYWNrZXQodCxyLCEwLG4pfSxvLnJlYWRBc0FycmF5QnVmZmVyKHQuZGF0YSl9ZnVuY3Rpb24gcyh0LHIsbil7aWYoIXIpcmV0dXJuIGUuZW5jb2RlQmFzZTY0UGFja2V0KHQsbik7aWYobSlyZXR1cm4gaSh0LHIsbik7dmFyIG89bmV3IFVpbnQ4QXJyYXkoMSk7b1swXT12W3QudHlwZV07dmFyIHM9bmV3IGsoW28uYnVmZmVyLHQuZGF0YV0pO3JldHVybiBuKHMpfWZ1bmN0aW9uIGEodCl7dHJ5e3Q9ZC5kZWNvZGUodCl9Y2F0Y2godCl7cmV0dXJuITF9cmV0dXJuIHR9ZnVuY3Rpb24gYyh0LGUscil7Zm9yKHZhciBuPW5ldyBBcnJheSh0Lmxlbmd0aCksbz1sKHQubGVuZ3RoLHIpLGk9ZnVuY3Rpb24odCxyLG8pe2UocixmdW5jdGlvbihlLHIpe25bdF09cixvKGUsbil9KX0scz0wO3M8dC5sZW5ndGg7cysrKWkocyx0W3NdLG8pfXZhciB1LGg9cigyOCkscD1yKDI5KSxmPXIoMzApLGw9cigzMSksZD1yKDMyKTt0JiZ0LkFycmF5QnVmZmVyJiYodT1yKDMzKSk7dmFyIHk9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGc9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL1BoYW50b21KUy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksbT15fHxnO2UucHJvdG9jb2w9Mzt2YXIgdj1lLnBhY2tldHM9e29wZW46MCxjbG9zZToxLHBpbmc6Mixwb25nOjMsbWVzc2FnZTo0LHVwZ3JhZGU6NSxub29wOjZ9LGI9aCh2KSx3PXt0eXBlOlwiZXJyb3JcIixkYXRhOlwicGFyc2VyIGVycm9yXCJ9LGs9cigzNCk7ZS5lbmNvZGVQYWNrZXQ9ZnVuY3Rpb24oZSxyLGksYSl7XCJmdW5jdGlvblwiPT10eXBlb2YgciYmKGE9cixyPSExKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiYoYT1pLGk9bnVsbCk7dmFyIGM9dm9pZCAwPT09ZS5kYXRhP3ZvaWQgMDplLmRhdGEuYnVmZmVyfHxlLmRhdGE7aWYodC5BcnJheUJ1ZmZlciYmYyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXJldHVybiBvKGUscixhKTtpZihrJiZjIGluc3RhbmNlb2YgdC5CbG9iKXJldHVybiBzKGUscixhKTtpZihjJiZjLmJhc2U2NClyZXR1cm4gbihlLGEpO3ZhciB1PXZbZS50eXBlXTtyZXR1cm4gdm9pZCAwIT09ZS5kYXRhJiYodSs9aT9kLmVuY29kZShTdHJpbmcoZS5kYXRhKSk6U3RyaW5nKGUuZGF0YSkpLGEoXCJcIit1KX0sZS5lbmNvZGVCYXNlNjRQYWNrZXQ9ZnVuY3Rpb24ocixuKXt2YXIgbz1cImJcIitlLnBhY2tldHNbci50eXBlXTtpZihrJiZyLmRhdGEgaW5zdGFuY2VvZiB0LkJsb2Ipe3ZhciBpPW5ldyBGaWxlUmVhZGVyO3JldHVybiBpLm9ubG9hZD1mdW5jdGlvbigpe3ZhciB0PWkucmVzdWx0LnNwbGl0KFwiLFwiKVsxXTtuKG8rdCl9LGkucmVhZEFzRGF0YVVSTChyLmRhdGEpfXZhciBzO3RyeXtzPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheShyLmRhdGEpKX1jYXRjaCh0KXtmb3IodmFyIGE9bmV3IFVpbnQ4QXJyYXkoci5kYXRhKSxjPW5ldyBBcnJheShhLmxlbmd0aCksdT0wO3U8YS5sZW5ndGg7dSsrKWNbdV09YVt1XTtzPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxjKX1yZXR1cm4gbys9dC5idG9hKHMpLG4obyl9LGUuZGVjb2RlUGFja2V0PWZ1bmN0aW9uKHQscixuKXtpZih2b2lkIDA9PT10KXJldHVybiB3O2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KXtpZihcImJcIj09dC5jaGFyQXQoMCkpcmV0dXJuIGUuZGVjb2RlQmFzZTY0UGFja2V0KHQuc3Vic3RyKDEpLHIpO2lmKG4mJih0PWEodCksdD09PSExKSlyZXR1cm4gdzt2YXIgbz10LmNoYXJBdCgwKTtyZXR1cm4gTnVtYmVyKG8pPT1vJiZiW29dP3QubGVuZ3RoPjE/e3R5cGU6YltvXSxkYXRhOnQuc3Vic3RyaW5nKDEpfTp7dHlwZTpiW29dfTp3fXZhciBpPW5ldyBVaW50OEFycmF5KHQpLG89aVswXSxzPWYodCwxKTtyZXR1cm4gayYmXCJibG9iXCI9PT1yJiYocz1uZXcgayhbc10pKSx7dHlwZTpiW29dLGRhdGE6c319LGUuZGVjb2RlQmFzZTY0UGFja2V0PWZ1bmN0aW9uKHQsZSl7dmFyIHI9Ylt0LmNoYXJBdCgwKV07aWYoIXUpcmV0dXJue3R5cGU6cixkYXRhOntiYXNlNjQ6ITAsZGF0YTp0LnN1YnN0cigxKX19O3ZhciBuPXUuZGVjb2RlKHQuc3Vic3RyKDEpKTtyZXR1cm5cImJsb2JcIj09PWUmJmsmJihuPW5ldyBrKFtuXSkpLHt0eXBlOnIsZGF0YTpufX0sZS5lbmNvZGVQYXlsb2FkPWZ1bmN0aW9uKHQscixuKXtmdW5jdGlvbiBvKHQpe3JldHVybiB0Lmxlbmd0aCtcIjpcIit0fWZ1bmN0aW9uIGkodCxuKXtlLmVuY29kZVBhY2tldCh0LCEhcyYmciwhMCxmdW5jdGlvbih0KXtuKG51bGwsbyh0KSl9KX1cImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7dmFyIHM9cCh0KTtyZXR1cm4gciYmcz9rJiYhbT9lLmVuY29kZVBheWxvYWRBc0Jsb2IodCxuKTplLmVuY29kZVBheWxvYWRBc0FycmF5QnVmZmVyKHQsbik6dC5sZW5ndGg/dm9pZCBjKHQsaSxmdW5jdGlvbih0LGUpe3JldHVybiBuKGUuam9pbihcIlwiKSl9KTpuKFwiMDpcIil9LGUuZGVjb2RlUGF5bG9hZD1mdW5jdGlvbih0LHIsbil7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIHQpcmV0dXJuIGUuZGVjb2RlUGF5bG9hZEFzQmluYXJ5KHQscixuKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7dmFyIG87aWYoXCJcIj09dClyZXR1cm4gbih3LDAsMSk7Zm9yKHZhciBpLHMsYT1cIlwiLGM9MCx1PXQubGVuZ3RoO2M8dTtjKyspe3ZhciBoPXQuY2hhckF0KGMpO2lmKFwiOlwiIT1oKWErPWg7ZWxzZXtpZihcIlwiPT1hfHxhIT0oaT1OdW1iZXIoYSkpKXJldHVybiBuKHcsMCwxKTtpZihzPXQuc3Vic3RyKGMrMSxpKSxhIT1zLmxlbmd0aClyZXR1cm4gbih3LDAsMSk7aWYocy5sZW5ndGgpe2lmKG89ZS5kZWNvZGVQYWNrZXQocyxyLCEwKSx3LnR5cGU9PW8udHlwZSYmdy5kYXRhPT1vLmRhdGEpcmV0dXJuIG4odywwLDEpO3ZhciBwPW4obyxjK2ksdSk7aWYoITE9PT1wKXJldHVybn1jKz1pLGE9XCJcIn19cmV0dXJuXCJcIiE9YT9uKHcsMCwxKTp2b2lkIDB9LGUuZW5jb2RlUGF5bG9hZEFzQXJyYXlCdWZmZXI9ZnVuY3Rpb24odCxyKXtmdW5jdGlvbiBuKHQscil7ZS5lbmNvZGVQYWNrZXQodCwhMCwhMCxmdW5jdGlvbih0KXtyZXR1cm4gcihudWxsLHQpfSl9cmV0dXJuIHQubGVuZ3RoP3ZvaWQgYyh0LG4sZnVuY3Rpb24odCxlKXt2YXIgbj1lLnJlZHVjZShmdW5jdGlvbih0LGUpe3ZhciByO3JldHVybiByPVwic3RyaW5nXCI9PXR5cGVvZiBlP2UubGVuZ3RoOmUuYnl0ZUxlbmd0aCx0K3IudG9TdHJpbmcoKS5sZW5ndGgrcisyfSwwKSxvPW5ldyBVaW50OEFycmF5KG4pLGk9MDtyZXR1cm4gZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBlPVwic3RyaW5nXCI9PXR5cGVvZiB0LHI9dDtpZihlKXtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkodC5sZW5ndGgpLHM9MDtzPHQubGVuZ3RoO3MrKyluW3NdPXQuY2hhckNvZGVBdChzKTtyPW4uYnVmZmVyfWU/b1tpKytdPTA6b1tpKytdPTE7Zm9yKHZhciBhPXIuYnl0ZUxlbmd0aC50b1N0cmluZygpLHM9MDtzPGEubGVuZ3RoO3MrKylvW2krK109cGFyc2VJbnQoYVtzXSk7b1tpKytdPTI1NTtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkocikscz0wO3M8bi5sZW5ndGg7cysrKW9baSsrXT1uW3NdfSkscihvLmJ1ZmZlcil9KTpyKG5ldyBBcnJheUJ1ZmZlcigwKSl9LGUuZW5jb2RlUGF5bG9hZEFzQmxvYj1mdW5jdGlvbih0LHIpe2Z1bmN0aW9uIG4odCxyKXtlLmVuY29kZVBhY2tldCh0LCEwLCEwLGZ1bmN0aW9uKHQpe3ZhciBlPW5ldyBVaW50OEFycmF5KDEpO2lmKGVbMF09MSxcInN0cmluZ1wiPT10eXBlb2YgdCl7Zm9yKHZhciBuPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKSxvPTA7bzx0Lmxlbmd0aDtvKyspbltvXT10LmNoYXJDb2RlQXQobyk7dD1uLmJ1ZmZlcixlWzBdPTB9Zm9yKHZhciBpPXQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcj90LmJ5dGVMZW5ndGg6dC5zaXplLHM9aS50b1N0cmluZygpLGE9bmV3IFVpbnQ4QXJyYXkocy5sZW5ndGgrMSksbz0wO288cy5sZW5ndGg7bysrKWFbb109cGFyc2VJbnQoc1tvXSk7aWYoYVtzLmxlbmd0aF09MjU1LGspe3ZhciBjPW5ldyBrKFtlLmJ1ZmZlcixhLmJ1ZmZlcix0XSk7cihudWxsLGMpfX0pfWModCxuLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHIobmV3IGsoZSkpfSl9LGUuZGVjb2RlUGF5bG9hZEFzQmluYXJ5PWZ1bmN0aW9uKHQscixuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7Zm9yKHZhciBvPXQsaT1bXSxzPSExO28uYnl0ZUxlbmd0aD4wOyl7Zm9yKHZhciBhPW5ldyBVaW50OEFycmF5KG8pLGM9MD09PWFbMF0sdT1cIlwiLGg9MTsyNTUhPWFbaF07aCsrKXtpZih1Lmxlbmd0aD4zMTApe3M9ITA7YnJlYWt9dSs9YVtoXX1pZihzKXJldHVybiBuKHcsMCwxKTtvPWYobywyK3UubGVuZ3RoKSx1PXBhcnNlSW50KHUpO3ZhciBwPWYobywwLHUpO2lmKGMpdHJ5e3A9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLG5ldyBVaW50OEFycmF5KHApKX1jYXRjaCh0KXt2YXIgbD1uZXcgVWludDhBcnJheShwKTtwPVwiXCI7Zm9yKHZhciBoPTA7aDxsLmxlbmd0aDtoKyspcCs9U3RyaW5nLmZyb21DaGFyQ29kZShsW2hdKX1pLnB1c2gocCksbz1mKG8sdSl9dmFyIGQ9aS5sZW5ndGg7aS5mb3JFYWNoKGZ1bmN0aW9uKHQsbyl7bihlLmRlY29kZVBhY2tldCh0LHIsITApLG8sZCl9KX19KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPU9iamVjdC5rZXlzfHxmdW5jdGlvbih0KXt2YXIgZT1bXSxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7Zm9yKHZhciBuIGluIHQpci5jYWxsKHQsbikmJmUucHVzaChuKTtyZXR1cm4gZX19LGZ1bmN0aW9uKHQsZSxyKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXtmdW5jdGlvbiByKHQpe2lmKCF0KXJldHVybiExO2lmKGUuQnVmZmVyJiZlLkJ1ZmZlci5pc0J1ZmZlciYmZS5CdWZmZXIuaXNCdWZmZXIodCl8fGUuQXJyYXlCdWZmZXImJnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8ZS5CbG9iJiZ0IGluc3RhbmNlb2YgQmxvYnx8ZS5GaWxlJiZ0IGluc3RhbmNlb2YgRmlsZSlyZXR1cm4hMDtpZihvKHQpKXtmb3IodmFyIG49MDtuPHQubGVuZ3RoO24rKylpZihyKHRbbl0pKXJldHVybiEwfWVsc2UgaWYodCYmXCJvYmplY3RcIj09dHlwZW9mIHQpe3QudG9KU09OJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LnRvSlNPTiYmKHQ9dC50b0pTT04oKSk7Zm9yKHZhciBpIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsaSkmJnIodFtpXSkpcmV0dXJuITB9cmV0dXJuITF9cmV0dXJuIHIodCl9dmFyIG89cigxNSk7dC5leHBvcnRzPW59KS5jYWxsKGUsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbj10LmJ5dGVMZW5ndGg7aWYoZT1lfHwwLHI9cnx8bix0LnNsaWNlKXJldHVybiB0LnNsaWNlKGUscik7aWYoZTwwJiYoZSs9bikscjwwJiYocis9bikscj5uJiYocj1uKSxlPj1ufHxlPj1yfHwwPT09bilyZXR1cm4gbmV3IEFycmF5QnVmZmVyKDApO2Zvcih2YXIgbz1uZXcgVWludDhBcnJheSh0KSxpPW5ldyBVaW50OEFycmF5KHItZSkscz1lLGE9MDtzPHI7cysrLGErKylpW2FdPW9bc107cmV0dXJuIGkuYnVmZmVyfX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQsZSxyKXtmdW5jdGlvbiBvKHQsbil7aWYoby5jb3VudDw9MCl0aHJvdyBuZXcgRXJyb3IoXCJhZnRlciBjYWxsZWQgdG9vIG1hbnkgdGltZXNcIik7LS1vLmNvdW50LHQ/KGk9ITAsZSh0KSxlPXIpOjAhPT1vLmNvdW50fHxpfHxlKG51bGwsbil9dmFyIGk9ITE7cmV0dXJuIHI9cnx8bixvLmNvdW50PXQsMD09PXQ/ZSgpOm99ZnVuY3Rpb24gbigpe310LmV4cG9ydHM9cn0sZnVuY3Rpb24odCxlLHIpe3ZhciBuOyhmdW5jdGlvbih0LG8peyFmdW5jdGlvbihpKXtmdW5jdGlvbiBzKHQpe2Zvcih2YXIgZSxyLG49W10sbz0wLGk9dC5sZW5ndGg7bzxpOyllPXQuY2hhckNvZGVBdChvKyspLGU+PTU1Mjk2JiZlPD01NjMxOSYmbzxpPyhyPXQuY2hhckNvZGVBdChvKyspLDU2MzIwPT0oNjQ1MTImcik/bi5wdXNoKCgoMTAyMyZlKTw8MTApKygxMDIzJnIpKzY1NTM2KToobi5wdXNoKGUpLG8tLSkpOm4ucHVzaChlKTtyZXR1cm4gbn1mdW5jdGlvbiBhKHQpe2Zvcih2YXIgZSxyPXQubGVuZ3RoLG49LTEsbz1cIlwiOysrbjxyOyllPXRbbl0sZT42NTUzNSYmKGUtPTY1NTM2LG8rPWIoZT4+PjEwJjEwMjN8NTUyOTYpLGU9NTYzMjB8MTAyMyZlKSxvKz1iKGUpO3JldHVybiBvfWZ1bmN0aW9uIGModCxlKXtyZXR1cm4gYih0Pj5lJjYzfDEyOCl9ZnVuY3Rpb24gdSh0KXtpZigwPT0oNDI5NDk2NzE2OCZ0KSlyZXR1cm4gYih0KTt2YXIgZT1cIlwiO3JldHVybiAwPT0oNDI5NDk2NTI0OCZ0KT9lPWIodD4+NiYzMXwxOTIpOjA9PSg0Mjk0OTAxNzYwJnQpPyhlPWIodD4+MTImMTV8MjI0KSxlKz1jKHQsNikpOjA9PSg0MjkyODcwMTQ0JnQpJiYoZT1iKHQ+PjE4Jjd8MjQwKSxlKz1jKHQsMTIpLGUrPWModCw2KSksZSs9Yig2MyZ0fDEyOCl9ZnVuY3Rpb24gaCh0KXtmb3IodmFyIGUscj1zKHQpLG49ci5sZW5ndGgsbz0tMSxpPVwiXCI7KytvPG47KWU9cltvXSxpKz11KGUpO3JldHVybiBpfWZ1bmN0aW9uIHAoKXtpZih2Pj1tKXRocm93IEVycm9yKFwiSW52YWxpZCBieXRlIGluZGV4XCIpO3ZhciB0PTI1NSZnW3ZdO2lmKHYrKywxMjg9PSgxOTImdCkpcmV0dXJuIDYzJnQ7dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWZ1bmN0aW9uIGYoKXt2YXIgdCxlLHIsbixvO2lmKHY+bSl0aHJvdyBFcnJvcihcIkludmFsaWQgYnl0ZSBpbmRleFwiKTtpZih2PT1tKXJldHVybiExO2lmKHQ9MjU1Jmdbdl0sdisrLDA9PSgxMjgmdCkpcmV0dXJuIHQ7aWYoMTkyPT0oMjI0JnQpKXt2YXIgZT1wKCk7aWYobz0oMzEmdCk8PDZ8ZSxvPj0xMjgpcmV0dXJuIG87dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWlmKDIyND09KDI0MCZ0KSl7aWYoZT1wKCkscj1wKCksbz0oMTUmdCk8PDEyfGU8PDZ8cixvPj0yMDQ4KXJldHVybiBvO3Rocm93IEVycm9yKFwiSW52YWxpZCBjb250aW51YXRpb24gYnl0ZVwiKX1pZigyNDA9PSgyNDgmdCkmJihlPXAoKSxyPXAoKSxuPXAoKSxvPSgxNSZ0KTw8MTh8ZTw8MTJ8cjw8NnxuLG8+PTY1NTM2JiZvPD0xMTE0MTExKSlyZXR1cm4gbzt0aHJvdyBFcnJvcihcIkludmFsaWQgV1RGLTggZGV0ZWN0ZWRcIil9ZnVuY3Rpb24gbCh0KXtnPXModCksbT1nLmxlbmd0aCx2PTA7Zm9yKHZhciBlLHI9W107KGU9ZigpKSE9PSExOylyLnB1c2goZSk7cmV0dXJuIGEocil9dmFyIGQ9XCJvYmplY3RcIj09dHlwZW9mIGUmJmUseT0oXCJvYmplY3RcIj09dHlwZW9mIHQmJnQmJnQuZXhwb3J0cz09ZCYmdCxcIm9iamVjdFwiPT10eXBlb2YgbyYmbyk7eS5nbG9iYWwhPT15JiZ5LndpbmRvdyE9PXl8fChpPXkpO3ZhciBnLG0sdixiPVN0cmluZy5mcm9tQ2hhckNvZGUsdz17dmVyc2lvbjpcIjEuMC4wXCIsZW5jb2RlOmgsZGVjb2RlOmx9O249ZnVuY3Rpb24oKXtyZXR1cm4gd30uY2FsbChlLHIsZSx0KSwhKHZvaWQgMCE9PW4mJih0LmV4cG9ydHM9bikpfSh0aGlzKX0pLmNhbGwoZSxyKDEyKSh0KSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlKXshZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmb3IodmFyIHQ9XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIscj1uZXcgVWludDhBcnJheSgyNTYpLG49MDtuPHQubGVuZ3RoO24rKylyW3QuY2hhckNvZGVBdChuKV09bjtlLmVuY29kZT1mdW5jdGlvbihlKXt2YXIgcixuPW5ldyBVaW50OEFycmF5KGUpLG89bi5sZW5ndGgsaT1cIlwiO2ZvcihyPTA7cjxvO3IrPTMpaSs9dFtuW3JdPj4yXSxpKz10WygzJm5bcl0pPDw0fG5bcisxXT4+NF0saSs9dFsoMTUmbltyKzFdKTw8MnxuW3IrMl0+PjZdLGkrPXRbNjMmbltyKzJdXTtyZXR1cm4gbyUzPT09Mj9pPWkuc3Vic3RyaW5nKDAsaS5sZW5ndGgtMSkrXCI9XCI6byUzPT09MSYmKGk9aS5zdWJzdHJpbmcoMCxpLmxlbmd0aC0yKStcIj09XCIpLGl9LGUuZGVjb2RlPWZ1bmN0aW9uKHQpe3ZhciBlLG4sbyxpLHMsYT0uNzUqdC5sZW5ndGgsYz10Lmxlbmd0aCx1PTA7XCI9XCI9PT10W3QubGVuZ3RoLTFdJiYoYS0tLFwiPVwiPT09dFt0Lmxlbmd0aC0yXSYmYS0tKTt2YXIgaD1uZXcgQXJyYXlCdWZmZXIoYSkscD1uZXcgVWludDhBcnJheShoKTtmb3IoZT0wO2U8YztlKz00KW49clt0LmNoYXJDb2RlQXQoZSldLG89clt0LmNoYXJDb2RlQXQoZSsxKV0saT1yW3QuY2hhckNvZGVBdChlKzIpXSxzPXJbdC5jaGFyQ29kZUF0KGUrMyldLHBbdSsrXT1uPDwyfG8+PjQscFt1KytdPSgxNSZvKTw8NHxpPj4yLHBbdSsrXT0oMyZpKTw8Nnw2MyZzO3JldHVybiBofX0oKX0sZnVuY3Rpb24odCxlKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcih0KXtmb3IodmFyIGU9MDtlPHQubGVuZ3RoO2UrKyl7dmFyIHI9dFtlXTtpZihyLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXt2YXIgbj1yLmJ1ZmZlcjtpZihyLmJ5dGVMZW5ndGghPT1uLmJ5dGVMZW5ndGgpe3ZhciBvPW5ldyBVaW50OEFycmF5KHIuYnl0ZUxlbmd0aCk7by5zZXQobmV3IFVpbnQ4QXJyYXkobixyLmJ5dGVPZmZzZXQsci5ieXRlTGVuZ3RoKSksbj1vLmJ1ZmZlcn10W2VdPW59fX1mdW5jdGlvbiBuKHQsZSl7ZT1lfHx7fTt2YXIgbj1uZXcgaTtyKHQpO2Zvcih2YXIgbz0wO288dC5sZW5ndGg7bysrKW4uYXBwZW5kKHRbb10pO3JldHVybiBlLnR5cGU/bi5nZXRCbG9iKGUudHlwZSk6bi5nZXRCbG9iKCl9ZnVuY3Rpb24gbyh0LGUpe3JldHVybiByKHQpLG5ldyBCbG9iKHQsZXx8e30pfXZhciBpPWUuQmxvYkJ1aWxkZXJ8fGUuV2ViS2l0QmxvYkJ1aWxkZXJ8fGUuTVNCbG9iQnVpbGRlcnx8ZS5Nb3pCbG9iQnVpbGRlcixzPWZ1bmN0aW9uKCl7dHJ5e3ZhciB0PW5ldyBCbG9iKFtcImhpXCJdKTtyZXR1cm4gMj09PXQuc2l6ZX1jYXRjaCh0KXtyZXR1cm4hMX19KCksYT1zJiZmdW5jdGlvbigpe3RyeXt2YXIgdD1uZXcgQmxvYihbbmV3IFVpbnQ4QXJyYXkoWzEsMl0pXSk7cmV0dXJuIDI9PT10LnNpemV9Y2F0Y2godCl7cmV0dXJuITF9fSgpLGM9aSYmaS5wcm90b3R5cGUuYXBwZW5kJiZpLnByb3RvdHlwZS5nZXRCbG9iO3QuZXhwb3J0cz1mdW5jdGlvbigpe3JldHVybiBzP2E/ZS5CbG9iOm86Yz9uOnZvaWQgMH0oKX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7aWYodClyZXR1cm4gbyh0KX1mdW5jdGlvbiBvKHQpe2Zvcih2YXIgZSBpbiBuLnByb3RvdHlwZSl0W2VdPW4ucHJvdG90eXBlW2VdO3JldHVybiB0fXQuZXhwb3J0cz1uLG4ucHJvdG90eXBlLm9uPW4ucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sKHRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XT10aGlzLl9jYWxsYmFja3NbXCIkXCIrdF18fFtdKS5wdXNoKGUpLHRoaXN9LG4ucHJvdG90eXBlLm9uY2U9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7dGhpcy5vZmYodCxyKSxlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gci5mbj1lLHRoaXMub24odCxyKSx0aGlzfSxuLnByb3RvdHlwZS5vZmY9bi5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9bi5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPW4ucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtpZih0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSwwPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9jYWxsYmFja3M9e30sdGhpczt2YXIgcj10aGlzLl9jYWxsYmFja3NbXCIkXCIrdF07aWYoIXIpcmV0dXJuIHRoaXM7aWYoMT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XSx0aGlzO2Zvcih2YXIgbixvPTA7bzxyLmxlbmd0aDtvKyspaWYobj1yW29dLG49PT1lfHxuLmZuPT09ZSl7ci5zcGxpY2UobywxKTticmVha31yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0KXt0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fTt2YXIgZT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxyPXRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XTtpZihyKXtyPXIuc2xpY2UoMCk7Zm9yKHZhciBuPTAsbz1yLmxlbmd0aDtuPG87KytuKXJbbl0uYXBwbHkodGhpcyxlKX1yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUubGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSx0aGlzLl9jYWxsYmFja3NbXCIkXCIrdF18fFtdfSxuLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuISF0aGlzLmxpc3RlbmVycyh0KS5sZW5ndGh9fSxmdW5jdGlvbih0LGUpe2UuZW5jb2RlPWZ1bmN0aW9uKHQpe3ZhciBlPVwiXCI7Zm9yKHZhciByIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShyKSYmKGUubGVuZ3RoJiYoZSs9XCImXCIpLGUrPWVuY29kZVVSSUNvbXBvbmVudChyKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQodFtyXSkpO3JldHVybiBlfSxlLmRlY29kZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9e30scj10LnNwbGl0KFwiJlwiKSxuPTAsbz1yLmxlbmd0aDtuPG87bisrKXt2YXIgaT1yW25dLnNwbGl0KFwiPVwiKTtlW2RlY29kZVVSSUNvbXBvbmVudChpWzBdKV09ZGVjb2RlVVJJQ29tcG9uZW50KGlbMV0pfXJldHVybiBlfX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXt2YXIgcj1mdW5jdGlvbigpe307ci5wcm90b3R5cGU9ZS5wcm90b3R5cGUsdC5wcm90b3R5cGU9bmV3IHIsdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dH19LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXt2YXIgZT1cIlwiO2RvIGU9c1t0JWFdK2UsdD1NYXRoLmZsb29yKHQvYSk7d2hpbGUodD4wKTtyZXR1cm4gZX1mdW5jdGlvbiBuKHQpe3ZhciBlPTA7Zm9yKGg9MDtoPHQubGVuZ3RoO2grKyllPWUqYStjW3QuY2hhckF0KGgpXTtyZXR1cm4gZX1mdW5jdGlvbiBvKCl7dmFyIHQ9cigrbmV3IERhdGUpO3JldHVybiB0IT09aT8odT0wLGk9dCk6dCtcIi5cIityKHUrKyl9Zm9yKHZhciBpLHM9XCIwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ei1fXCIuc3BsaXQoXCJcIiksYT02NCxjPXt9LHU9MCxoPTA7aDxhO2grKyljW3NbaF1dPWg7by5lbmNvZGU9cixvLmRlY29kZT1uLHQuZXhwb3J0cz1vfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyh0KXtpLmNhbGwodGhpcyx0KSx0aGlzLnF1ZXJ5PXRoaXMucXVlcnl8fHt9LGF8fChlLl9fX2Vpb3x8KGUuX19fZWlvPVtdKSxhPWUuX19fZWlvKSx0aGlzLmluZGV4PWEubGVuZ3RoO3ZhciByPXRoaXM7YS5wdXNoKGZ1bmN0aW9uKHQpe3Iub25EYXRhKHQpfSksdGhpcy5xdWVyeS5qPXRoaXMuaW5kZXgsZS5kb2N1bWVudCYmZS5hZGRFdmVudExpc3RlbmVyJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIixmdW5jdGlvbigpe3Iuc2NyaXB0JiYoci5zY3JpcHQub25lcnJvcj1uKX0sITEpfXZhciBpPXIoMjUpLHM9cigzNyk7dC5leHBvcnRzPW87dmFyIGEsYz0vXFxuL2csdT0vXFxcXG4vZztzKG8saSksby5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnk9ITEsby5wcm90b3R5cGUuZG9DbG9zZT1mdW5jdGlvbigpe3RoaXMuc2NyaXB0JiYodGhpcy5zY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNjcmlwdCksdGhpcy5zY3JpcHQ9bnVsbCksdGhpcy5mb3JtJiYodGhpcy5mb3JtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5mb3JtKSx0aGlzLmZvcm09bnVsbCx0aGlzLmlmcmFtZT1udWxsKSxpLnByb3RvdHlwZS5kb0Nsb3NlLmNhbGwodGhpcyl9LG8ucHJvdG90eXBlLmRvUG9sbD1mdW5jdGlvbigpe3ZhciB0PXRoaXMsZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO3RoaXMuc2NyaXB0JiYodGhpcy5zY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNjcmlwdCksdGhpcy5zY3JpcHQ9bnVsbCksZS5hc3luYz0hMCxlLnNyYz10aGlzLnVyaSgpLGUub25lcnJvcj1mdW5jdGlvbihlKXt0Lm9uRXJyb3IoXCJqc29ucCBwb2xsIGVycm9yXCIsZSl9O3ZhciByPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdO3I/ci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLHIpOihkb2N1bWVudC5oZWFkfHxkb2N1bWVudC5ib2R5KS5hcHBlbmRDaGlsZChlKSx0aGlzLnNjcmlwdD1lO3ZhciBuPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9nZWNrby9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7biYmc2V0VGltZW91dChmdW5jdGlvbigpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0KSxkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHQpfSwxMDApfSxvLnByb3RvdHlwZS5kb1dyaXRlPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe24oKSxlKCl9ZnVuY3Rpb24gbigpe2lmKG8uaWZyYW1lKXRyeXtvLmZvcm0ucmVtb3ZlQ2hpbGQoby5pZnJhbWUpfWNhdGNoKHQpe28ub25FcnJvcihcImpzb25wIHBvbGxpbmcgaWZyYW1lIHJlbW92YWwgZXJyb3JcIix0KX10cnl7dmFyIHQ9JzxpZnJhbWUgc3JjPVwiamF2YXNjcmlwdDowXCIgbmFtZT1cIicrby5pZnJhbWVJZCsnXCI+JztpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodCl9Y2F0Y2godCl7aT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpLGkubmFtZT1vLmlmcmFtZUlkLGkuc3JjPVwiamF2YXNjcmlwdDowXCJ9aS5pZD1vLmlmcmFtZUlkLG8uZm9ybS5hcHBlbmRDaGlsZChpKSxvLmlmcmFtZT1pfXZhciBvPXRoaXM7aWYoIXRoaXMuZm9ybSl7dmFyIGkscz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKSxhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKSxoPXRoaXMuaWZyYW1lSWQ9XCJlaW9faWZyYW1lX1wiK3RoaXMuaW5kZXg7cy5jbGFzc05hbWU9XCJzb2NrZXRpb1wiLHMuc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiLHMuc3R5bGUudG9wPVwiLTEwMDBweFwiLHMuc3R5bGUubGVmdD1cIi0xMDAwcHhcIixzLnRhcmdldD1oLHMubWV0aG9kPVwiUE9TVFwiLHMuc2V0QXR0cmlidXRlKFwiYWNjZXB0LWNoYXJzZXRcIixcInV0Zi04XCIpLGEubmFtZT1cImRcIixzLmFwcGVuZENoaWxkKGEpLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocyksdGhpcy5mb3JtPXMsdGhpcy5hcmVhPWF9dGhpcy5mb3JtLmFjdGlvbj10aGlzLnVyaSgpLG4oKSx0PXQucmVwbGFjZSh1LFwiXFxcXFxcblwiKSx0aGlzLmFyZWEudmFsdWU9dC5yZXBsYWNlKGMsXCJcXFxcblwiKTt0cnl7dGhpcy5mb3JtLnN1Ym1pdCgpfWNhdGNoKHQpe310aGlzLmlmcmFtZS5hdHRhY2hFdmVudD90aGlzLmlmcmFtZS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtcImNvbXBsZXRlXCI9PT1vLmlmcmFtZS5yZWFkeVN0YXRlJiZyKCk7XG59OnRoaXMuaWZyYW1lLm9ubG9hZD1yfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBlPXQmJnQuZm9yY2VCYXNlNjQ7ZSYmKHRoaXMuc3VwcG9ydHNCaW5hcnk9ITEpLHRoaXMucGVyTWVzc2FnZURlZmxhdGU9dC5wZXJNZXNzYWdlRGVmbGF0ZSx0aGlzLnVzaW5nQnJvd3NlcldlYlNvY2tldD1wJiYhdC5mb3JjZU5vZGUsdGhpcy51c2luZ0Jyb3dzZXJXZWJTb2NrZXR8fChmPW8pLGkuY2FsbCh0aGlzLHQpfXZhciBvLGk9cigyNikscz1yKDI3KSxhPXIoMzYpLGM9cigzNyksdT1yKDM4KSxoPXIoMykoXCJlbmdpbmUuaW8tY2xpZW50OndlYnNvY2tldFwiKSxwPWUuV2ViU29ja2V0fHxlLk1veldlYlNvY2tldDtpZihcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93KXRyeXtvPXIoNDEpfWNhdGNoKHQpe312YXIgZj1wO2Z8fFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3d8fChmPW8pLHQuZXhwb3J0cz1uLGMobixpKSxuLnByb3RvdHlwZS5uYW1lPVwid2Vic29ja2V0XCIsbi5wcm90b3R5cGUuc3VwcG9ydHNCaW5hcnk9ITAsbi5wcm90b3R5cGUuZG9PcGVuPWZ1bmN0aW9uKCl7aWYodGhpcy5jaGVjaygpKXt2YXIgdD10aGlzLnVyaSgpLGU9dm9pZCAwLHI9e2FnZW50OnRoaXMuYWdlbnQscGVyTWVzc2FnZURlZmxhdGU6dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZX07ci5wZng9dGhpcy5wZngsci5rZXk9dGhpcy5rZXksci5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZSxyLmNlcnQ9dGhpcy5jZXJ0LHIuY2E9dGhpcy5jYSxyLmNpcGhlcnM9dGhpcy5jaXBoZXJzLHIucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkLHRoaXMuZXh0cmFIZWFkZXJzJiYoci5oZWFkZXJzPXRoaXMuZXh0cmFIZWFkZXJzKSx0aGlzLmxvY2FsQWRkcmVzcyYmKHIubG9jYWxBZGRyZXNzPXRoaXMubG9jYWxBZGRyZXNzKTt0cnl7dGhpcy53cz10aGlzLnVzaW5nQnJvd3NlcldlYlNvY2tldD9uZXcgZih0KTpuZXcgZih0LGUscil9Y2F0Y2godCl7cmV0dXJuIHRoaXMuZW1pdChcImVycm9yXCIsdCl9dm9pZCAwPT09dGhpcy53cy5iaW5hcnlUeXBlJiYodGhpcy5zdXBwb3J0c0JpbmFyeT0hMSksdGhpcy53cy5zdXBwb3J0cyYmdGhpcy53cy5zdXBwb3J0cy5iaW5hcnk/KHRoaXMuc3VwcG9ydHNCaW5hcnk9ITAsdGhpcy53cy5iaW5hcnlUeXBlPVwibm9kZWJ1ZmZlclwiKTp0aGlzLndzLmJpbmFyeVR5cGU9XCJhcnJheWJ1ZmZlclwiLHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKX19LG4ucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLndzLm9ub3Blbj1mdW5jdGlvbigpe3Qub25PcGVuKCl9LHRoaXMud3Mub25jbG9zZT1mdW5jdGlvbigpe3Qub25DbG9zZSgpfSx0aGlzLndzLm9ubWVzc2FnZT1mdW5jdGlvbihlKXt0Lm9uRGF0YShlLmRhdGEpfSx0aGlzLndzLm9uZXJyb3I9ZnVuY3Rpb24oZSl7dC5vbkVycm9yKFwid2Vic29ja2V0IGVycm9yXCIsZSl9fSxuLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbih0KXtmdW5jdGlvbiByKCl7bi5lbWl0KFwiZmx1c2hcIiksc2V0VGltZW91dChmdW5jdGlvbigpe24ud3JpdGFibGU9ITAsbi5lbWl0KFwiZHJhaW5cIil9LDApfXZhciBuPXRoaXM7dGhpcy53cml0YWJsZT0hMTtmb3IodmFyIG89dC5sZW5ndGgsaT0wLGE9bztpPGE7aSsrKSFmdW5jdGlvbih0KXtzLmVuY29kZVBhY2tldCh0LG4uc3VwcG9ydHNCaW5hcnksZnVuY3Rpb24oaSl7aWYoIW4udXNpbmdCcm93c2VyV2ViU29ja2V0KXt2YXIgcz17fTtpZih0Lm9wdGlvbnMmJihzLmNvbXByZXNzPXQub3B0aW9ucy5jb21wcmVzcyksbi5wZXJNZXNzYWdlRGVmbGF0ZSl7dmFyIGE9XCJzdHJpbmdcIj09dHlwZW9mIGk/ZS5CdWZmZXIuYnl0ZUxlbmd0aChpKTppLmxlbmd0aDthPG4ucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkJiYocy5jb21wcmVzcz0hMSl9fXRyeXtuLnVzaW5nQnJvd3NlcldlYlNvY2tldD9uLndzLnNlbmQoaSk6bi53cy5zZW5kKGkscyl9Y2F0Y2godCl7aChcIndlYnNvY2tldCBjbG9zZWQgYmVmb3JlIG9uY2xvc2UgZXZlbnRcIil9LS1vfHxyKCl9KX0odFtpXSl9LG4ucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24oKXtpLnByb3RvdHlwZS5vbkNsb3NlLmNhbGwodGhpcyl9LG4ucHJvdG90eXBlLmRvQ2xvc2U9ZnVuY3Rpb24oKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgdGhpcy53cyYmdGhpcy53cy5jbG9zZSgpfSxuLnByb3RvdHlwZS51cmk9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnF1ZXJ5fHx7fSxlPXRoaXMuc2VjdXJlP1wid3NzXCI6XCJ3c1wiLHI9XCJcIjt0aGlzLnBvcnQmJihcIndzc1wiPT09ZSYmNDQzIT09TnVtYmVyKHRoaXMucG9ydCl8fFwid3NcIj09PWUmJjgwIT09TnVtYmVyKHRoaXMucG9ydCkpJiYocj1cIjpcIit0aGlzLnBvcnQpLHRoaXMudGltZXN0YW1wUmVxdWVzdHMmJih0W3RoaXMudGltZXN0YW1wUGFyYW1dPXUoKSksdGhpcy5zdXBwb3J0c0JpbmFyeXx8KHQuYjY0PTEpLHQ9YS5lbmNvZGUodCksdC5sZW5ndGgmJih0PVwiP1wiK3QpO3ZhciBuPXRoaXMuaG9zdG5hbWUuaW5kZXhPZihcIjpcIikhPT0tMTtyZXR1cm4gZStcIjovL1wiKyhuP1wiW1wiK3RoaXMuaG9zdG5hbWUrXCJdXCI6dGhpcy5ob3N0bmFtZSkrcit0aGlzLnBhdGgrdH0sbi5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtyZXR1cm4hKCFmfHxcIl9faW5pdGlhbGl6ZVwiaW4gZiYmdGhpcy5uYW1lPT09bi5wcm90b3R5cGUubmFtZSl9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUpe30sZnVuY3Rpb24odCxlKXt2YXIgcj1bXS5pbmRleE9mO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe2lmKHIpcmV0dXJuIHQuaW5kZXhPZihlKTtmb3IodmFyIG49MDtuPHQubGVuZ3RoOysrbilpZih0W25dPT09ZSlyZXR1cm4gbjtyZXR1cm4tMX19LGZ1bmN0aW9uKHQsZSl7KGZ1bmN0aW9uKGUpe3ZhciByPS9eW1xcXSw6e31cXHNdKiQvLG49L1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZyxvPS9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxpPS8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZyxzPS9eXFxzKy8sYT0vXFxzKyQvO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdCYmdD8odD10LnJlcGxhY2UocyxcIlwiKS5yZXBsYWNlKGEsXCJcIiksZS5KU09OJiZKU09OLnBhcnNlP0pTT04ucGFyc2UodCk6ci50ZXN0KHQucmVwbGFjZShuLFwiQFwiKS5yZXBsYWNlKG8sXCJdXCIpLnJlcGxhY2UoaSxcIlwiKSk/bmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiK3QpKCk6dm9pZCAwKTpudWxsfX0pLmNhbGwoZSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlLHIpe3RoaXMuaW89dCx0aGlzLm5zcD1lLHRoaXMuanNvbj10aGlzLHRoaXMuaWRzPTAsdGhpcy5hY2tzPXt9LHRoaXMucmVjZWl2ZUJ1ZmZlcj1bXSx0aGlzLnNlbmRCdWZmZXI9W10sdGhpcy5jb25uZWN0ZWQ9ITEsdGhpcy5kaXNjb25uZWN0ZWQ9ITAsciYmci5xdWVyeSYmKHRoaXMucXVlcnk9ci5xdWVyeSksdGhpcy5pby5hdXRvQ29ubmVjdCYmdGhpcy5vcGVuKCl9dmFyIG89cig3KSxpPXIoMzUpLHM9cig0NSksYT1yKDQ2KSxjPXIoNDcpLHU9cigzKShcInNvY2tldC5pby1jbGllbnQ6c29ja2V0XCIpLGg9cigyOSk7dC5leHBvcnRzPWU9bjt2YXIgcD17Y29ubmVjdDoxLGNvbm5lY3RfZXJyb3I6MSxjb25uZWN0X3RpbWVvdXQ6MSxjb25uZWN0aW5nOjEsZGlzY29ubmVjdDoxLGVycm9yOjEscmVjb25uZWN0OjEscmVjb25uZWN0X2F0dGVtcHQ6MSxyZWNvbm5lY3RfZmFpbGVkOjEscmVjb25uZWN0X2Vycm9yOjEscmVjb25uZWN0aW5nOjEscGluZzoxLHBvbmc6MX0sZj1pLnByb3RvdHlwZS5lbWl0O2kobi5wcm90b3R5cGUpLG4ucHJvdG90eXBlLnN1YkV2ZW50cz1mdW5jdGlvbigpe2lmKCF0aGlzLnN1YnMpe3ZhciB0PXRoaXMuaW87dGhpcy5zdWJzPVthKHQsXCJvcGVuXCIsYyh0aGlzLFwib25vcGVuXCIpKSxhKHQsXCJwYWNrZXRcIixjKHRoaXMsXCJvbnBhY2tldFwiKSksYSh0LFwiY2xvc2VcIixjKHRoaXMsXCJvbmNsb3NlXCIpKV19fSxuLnByb3RvdHlwZS5vcGVuPW4ucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb25uZWN0ZWQ/dGhpczoodGhpcy5zdWJFdmVudHMoKSx0aGlzLmlvLm9wZW4oKSxcIm9wZW5cIj09PXRoaXMuaW8ucmVhZHlTdGF0ZSYmdGhpcy5vbm9wZW4oKSx0aGlzLmVtaXQoXCJjb25uZWN0aW5nXCIpLHRoaXMpfSxuLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKCl7dmFyIHQ9cyhhcmd1bWVudHMpO3JldHVybiB0LnVuc2hpZnQoXCJtZXNzYWdlXCIpLHRoaXMuZW1pdC5hcHBseSh0aGlzLHQpLHRoaXN9LG4ucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24odCl7aWYocC5oYXNPd25Qcm9wZXJ0eSh0KSlyZXR1cm4gZi5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpczt2YXIgZT1zKGFyZ3VtZW50cykscj1vLkVWRU5UO2goZSkmJihyPW8uQklOQVJZX0VWRU5UKTt2YXIgbj17dHlwZTpyLGRhdGE6ZX07cmV0dXJuIG4ub3B0aW9ucz17fSxuLm9wdGlvbnMuY29tcHJlc3M9IXRoaXMuZmxhZ3N8fCExIT09dGhpcy5mbGFncy5jb21wcmVzcyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlW2UubGVuZ3RoLTFdJiYodShcImVtaXR0aW5nIHBhY2tldCB3aXRoIGFjayBpZCAlZFwiLHRoaXMuaWRzKSx0aGlzLmFja3NbdGhpcy5pZHNdPWUucG9wKCksbi5pZD10aGlzLmlkcysrKSx0aGlzLmNvbm5lY3RlZD90aGlzLnBhY2tldChuKTp0aGlzLnNlbmRCdWZmZXIucHVzaChuKSxkZWxldGUgdGhpcy5mbGFncyx0aGlzfSxuLnByb3RvdHlwZS5wYWNrZXQ9ZnVuY3Rpb24odCl7dC5uc3A9dGhpcy5uc3AsdGhpcy5pby5wYWNrZXQodCl9LG4ucHJvdG90eXBlLm9ub3Blbj1mdW5jdGlvbigpe3UoXCJ0cmFuc3BvcnQgaXMgb3BlbiAtIGNvbm5lY3RpbmdcIiksXCIvXCIhPT10aGlzLm5zcCYmKHRoaXMucXVlcnk/dGhpcy5wYWNrZXQoe3R5cGU6by5DT05ORUNULHF1ZXJ5OnRoaXMucXVlcnl9KTp0aGlzLnBhY2tldCh7dHlwZTpvLkNPTk5FQ1R9KSl9LG4ucHJvdG90eXBlLm9uY2xvc2U9ZnVuY3Rpb24odCl7dShcImNsb3NlICglcylcIix0KSx0aGlzLmNvbm5lY3RlZD0hMSx0aGlzLmRpc2Nvbm5lY3RlZD0hMCxkZWxldGUgdGhpcy5pZCx0aGlzLmVtaXQoXCJkaXNjb25uZWN0XCIsdCl9LG4ucHJvdG90eXBlLm9ucGFja2V0PWZ1bmN0aW9uKHQpe2lmKHQubnNwPT09dGhpcy5uc3Apc3dpdGNoKHQudHlwZSl7Y2FzZSBvLkNPTk5FQ1Q6dGhpcy5vbmNvbm5lY3QoKTticmVhaztjYXNlIG8uRVZFTlQ6dGhpcy5vbmV2ZW50KHQpO2JyZWFrO2Nhc2Ugby5CSU5BUllfRVZFTlQ6dGhpcy5vbmV2ZW50KHQpO2JyZWFrO2Nhc2Ugby5BQ0s6dGhpcy5vbmFjayh0KTticmVhaztjYXNlIG8uQklOQVJZX0FDSzp0aGlzLm9uYWNrKHQpO2JyZWFrO2Nhc2Ugby5ESVNDT05ORUNUOnRoaXMub25kaXNjb25uZWN0KCk7YnJlYWs7Y2FzZSBvLkVSUk9SOnRoaXMuZW1pdChcImVycm9yXCIsdC5kYXRhKX19LG4ucHJvdG90eXBlLm9uZXZlbnQ9ZnVuY3Rpb24odCl7dmFyIGU9dC5kYXRhfHxbXTt1KFwiZW1pdHRpbmcgZXZlbnQgJWpcIixlKSxudWxsIT10LmlkJiYodShcImF0dGFjaGluZyBhY2sgY2FsbGJhY2sgdG8gZXZlbnRcIiksZS5wdXNoKHRoaXMuYWNrKHQuaWQpKSksdGhpcy5jb25uZWN0ZWQ/Zi5hcHBseSh0aGlzLGUpOnRoaXMucmVjZWl2ZUJ1ZmZlci5wdXNoKGUpfSxuLnByb3RvdHlwZS5hY2s9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxyPSExO3JldHVybiBmdW5jdGlvbigpe2lmKCFyKXtyPSEwO3ZhciBuPXMoYXJndW1lbnRzKTt1KFwic2VuZGluZyBhY2sgJWpcIixuKTt2YXIgaT1oKG4pP28uQklOQVJZX0FDSzpvLkFDSztlLnBhY2tldCh7dHlwZTppLGlkOnQsZGF0YTpufSl9fX0sbi5wcm90b3R5cGUub25hY2s9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5hY2tzW3QuaWRdO1wiZnVuY3Rpb25cIj09dHlwZW9mIGU/KHUoXCJjYWxsaW5nIGFjayAlcyB3aXRoICVqXCIsdC5pZCx0LmRhdGEpLGUuYXBwbHkodGhpcyx0LmRhdGEpLGRlbGV0ZSB0aGlzLmFja3NbdC5pZF0pOnUoXCJiYWQgYWNrICVzXCIsdC5pZCl9LG4ucHJvdG90eXBlLm9uY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuY29ubmVjdGVkPSEwLHRoaXMuZGlzY29ubmVjdGVkPSExLHRoaXMuZW1pdChcImNvbm5lY3RcIiksdGhpcy5lbWl0QnVmZmVyZWQoKX0sbi5wcm90b3R5cGUuZW1pdEJ1ZmZlcmVkPWZ1bmN0aW9uKCl7dmFyIHQ7Zm9yKHQ9MDt0PHRoaXMucmVjZWl2ZUJ1ZmZlci5sZW5ndGg7dCsrKWYuYXBwbHkodGhpcyx0aGlzLnJlY2VpdmVCdWZmZXJbdF0pO2Zvcih0aGlzLnJlY2VpdmVCdWZmZXI9W10sdD0wO3Q8dGhpcy5zZW5kQnVmZmVyLmxlbmd0aDt0KyspdGhpcy5wYWNrZXQodGhpcy5zZW5kQnVmZmVyW3RdKTt0aGlzLnNlbmRCdWZmZXI9W119LG4ucHJvdG90eXBlLm9uZGlzY29ubmVjdD1mdW5jdGlvbigpe3UoXCJzZXJ2ZXIgZGlzY29ubmVjdCAoJXMpXCIsdGhpcy5uc3ApLHRoaXMuZGVzdHJveSgpLHRoaXMub25jbG9zZShcImlvIHNlcnZlciBkaXNjb25uZWN0XCIpfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7aWYodGhpcy5zdWJzKXtmb3IodmFyIHQ9MDt0PHRoaXMuc3Vicy5sZW5ndGg7dCsrKXRoaXMuc3Vic1t0XS5kZXN0cm95KCk7dGhpcy5zdWJzPW51bGx9dGhpcy5pby5kZXN0cm95KHRoaXMpfSxuLnByb3RvdHlwZS5jbG9zZT1uLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29ubmVjdGVkJiYodShcInBlcmZvcm1pbmcgZGlzY29ubmVjdCAoJXMpXCIsdGhpcy5uc3ApLHRoaXMucGFja2V0KHt0eXBlOm8uRElTQ09OTkVDVH0pKSx0aGlzLmRlc3Ryb3koKSx0aGlzLmNvbm5lY3RlZCYmdGhpcy5vbmNsb3NlKFwiaW8gY2xpZW50IGRpc2Nvbm5lY3RcIiksdGhpc30sbi5wcm90b3R5cGUuY29tcHJlc3M9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZmxhZ3M9dGhpcy5mbGFnc3x8e30sdGhpcy5mbGFncy5jb21wcmVzcz10LHRoaXN9fSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCxlKXt2YXIgcj1bXTtlPWV8fDA7Zm9yKHZhciBuPWV8fDA7bjx0Lmxlbmd0aDtuKyspcltuLWVdPXRbbl07cmV0dXJuIHJ9dC5leHBvcnRzPXJ9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0LGUscil7cmV0dXJuIHQub24oZSxyKSx7ZGVzdHJveTpmdW5jdGlvbigpe3QucmVtb3ZlTGlzdGVuZXIoZSxyKX19fXQuZXhwb3J0cz1yfSxmdW5jdGlvbih0LGUpe3ZhciByPVtdLnNsaWNlO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT10W2VdKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBFcnJvcihcImJpbmQoKSByZXF1aXJlcyBhIGZ1bmN0aW9uXCIpO3ZhciBuPXIuY2FsbChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUuYXBwbHkodCxuLmNvbmNhdChyLmNhbGwoYXJndW1lbnRzKSkpfX19LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0KXt0PXR8fHt9LHRoaXMubXM9dC5taW58fDEwMCx0aGlzLm1heD10Lm1heHx8MWU0LHRoaXMuZmFjdG9yPXQuZmFjdG9yfHwyLHRoaXMuaml0dGVyPXQuaml0dGVyPjAmJnQuaml0dGVyPD0xP3Quaml0dGVyOjAsdGhpcy5hdHRlbXB0cz0wfXQuZXhwb3J0cz1yLHIucHJvdG90eXBlLmR1cmF0aW9uPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5tcypNYXRoLnBvdyh0aGlzLmZhY3Rvcix0aGlzLmF0dGVtcHRzKyspO2lmKHRoaXMuaml0dGVyKXt2YXIgZT1NYXRoLnJhbmRvbSgpLHI9TWF0aC5mbG9vcihlKnRoaXMuaml0dGVyKnQpO3Q9MD09KDEmTWF0aC5mbG9vcigxMCplKSk/dC1yOnQrcn1yZXR1cm4gMHxNYXRoLm1pbih0LHRoaXMubWF4KX0sci5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmF0dGVtcHRzPTB9LHIucHJvdG90eXBlLnNldE1pbj1mdW5jdGlvbih0KXt0aGlzLm1zPXR9LHIucHJvdG90eXBlLnNldE1heD1mdW5jdGlvbih0KXt0aGlzLm1heD10fSxyLnByb3RvdHlwZS5zZXRKaXR0ZXI9ZnVuY3Rpb24odCl7dGhpcy5qaXR0ZXI9dH19XSl9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5pby5taW4uanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQWdCQTs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBOzs7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTs7O0FBQUE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2Q0E7QUF5Q0E7QUFDQTtBQUVBOzs7Ozs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUVBOzs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQU5BO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBOzs7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTs7O0FBQUE7OztBQUFBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0RBO0FBK0RBO0FBQ0E7QUFFQTs7Ozs7O0FDeEdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=