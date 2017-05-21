var main =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var config = {
    'count_row_bids': 5,
    'count_row_ask': 5,
    'count_trade_history': 10,
    'keys_trade_history': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
    'count_order_open': 5,
    'keys_order_open': ['date', 'buy/sell', 'gts', 'total units', 'total cost', 'something'],
    'count_order_history': 5,
    'keys_order_history': ['date', 'buy/sell', 'gts', 'total units', 'total cost', 'something'],
    'rooms': ['GTS-NLG', 'EUR-NLG']
};

module.exports = config;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function ClientSockets() {

    var Config = __webpack_require__(0);
    var Table = __webpack_require__(3);

    var room, ask, bids, trade, orderOpen, orderHistory;

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

    var TableStatistics = __webpack_require__(4);

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

            var chart = __webpack_require__(5);

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

var service = new ClientSockets();
service();

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

var Table = function () {
    var table;
    var keys = [];
    var tableValue = [];
    var countOfRows = 5;

    function updateTable() {

        var row = '+';
        var messageTemplate = '';
        for (var i = 0; i < countOfRows; i++) {
            var rowOfTable = $(table).find('tr:eq( ' + (i + 1) + ')');
            row = '<tr>';
            if (tableValue[i]) {
                for (var key in keys) {
                    row += '<td>' + tableValue[i][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';

                if (rowOfTable.length) {
                    $(rowOfTable).replaceWith(row);
                } else {
                    $(table).find('tbody').append(row);
                }
            } else {
                $(table).find('tr:eq( ' + (tableValue.length + 1) + ')').remove();
            }
            ;
        }
    }
    ;

    return {
        setKeys: function (newValue) {
            keys = newValue;
        },

        createTable: function (element) {
            table = element;
            var headOfTable = '<tr>';
            for (var key in keys) {
                headOfTable += '<th>' + keys[key] + '</th>';
            }
            ;
            headOfTable += '</tr>';

            var row = '+';
            var messageTemplate = '';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    row += '<td></td>';
                }
                ;
                row += '</tr>';
                messageTemplate += row;
            }

            $(table).find('tbody').html('').append(headOfTable);
            $(table).find('tbody').html('').append(messageTemplate);
        },

        setCount: function (newValue) {
            countOfRows = newValue;
        },

        updateValue: function (value) {
            tableValue = value;

            updateTable();
        }
    };
};

module.exports = Table;

/***/ }),
/* 5 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGMxNDlkZDBhODQxNjFjYWY1MTMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc09yZGVyQm9vay5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc1N0YXRpc3RpY3MuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9jaGFydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9wdWJsaWNfaHRtbC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkYzE0OWRkMGE4NDE2MWNhZjUxMyIsInZhciBjb25maWcgPSB7XG4gICAgJ2NvdW50X3Jvd19iaWRzJzogNSxcbiAgICAnY291bnRfcm93X2Fzayc6IDUsXG4gICAgJ2NvdW50X3RyYWRlX2hpc3RvcnknOiAxMCxcbiAgICAna2V5c190cmFkZV9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0J10sXG4gICAgJ2NvdW50X29yZGVyX29wZW4nOiA1LFxuICAgICdrZXlzX29yZGVyX29wZW4nOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ2NvdW50X29yZGVyX2hpc3RvcnknOiA1LFxuICAgICdrZXlzX29yZGVyX2hpc3RvcnknOiBbJ2RhdGUnLCAnYnV5L3NlbGwnLCAnZ3RzJywgJ3RvdGFsIHVuaXRzJywgJ3RvdGFsIGNvc3QnLCAnc29tZXRoaW5nJ10sXG4gICAgJ3Jvb21zJzogW1xuICAgICAgICAnR1RTLU5MRycsXG4gICAgICAgICdFVVItTkxHJ1xuICAgIF1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9jb25maWcuanMiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIENsaWVudFNvY2tldHMoKSB7XG5cbiAgICB2YXIgQ29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XG4gICAgdmFyIFRhYmxlID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9jcmVhdGVUYWJsZXNPcmRlckJvb2snKTtcblxuICAgIHZhciByb29tLFxuICAgICAgICAgICAgYXNrLFxuICAgICAgICAgICAgYmlkcyxcbiAgICAgICAgICAgIHRyYWRlLFxuICAgICAgICAgICAgb3JkZXJPcGVuLFxuICAgICAgICAgICAgb3JkZXJIaXN0b3J5O1xuXG4gICAgZnVuY3Rpb24gc2VsZWN0Um9vbSgpIHtcbiAgICAgICAgLy9HZXQgYSBsaXN0IG9mIHRoZSByb29tcyBhbmQgY3VycmVudCBVUkxcbiAgICAgICAgdmFyIHJvb21zID0gQ29uZmlnWydyb29tcyddO1xuICAgICAgICB2YXIgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgIC8vU2VsZWN0IHJvb20gKGlmIFVSTCBjb250YWlucyB0aGUgbmFtZSBvZiB0aGUgcm9vbSlcbiAgICAgICAgcm9vbXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHBhdGhuYW1lLmluZGV4T2YoZWxlbWVudCkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJvb20gPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3VgcmUgamlvbmVkIHRvIHRoZSByb29tICcgKyByb29tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhYmxlcygpIHtcbiAgICAgICAgLy9DcmVhdGUgdGhlIG9iamVjdHMgb2YgdGhlIHRhYmxlc1xuICAgICAgICBiaWRzID0gbmV3IFRhYmxlKCk7XG4gICAgICAgIGFzayA9IG5ldyBUYWJsZSgpO1xuXG4gICAgICAgIC8vU2V0IHRoZSBjb3VudCBvZiB0aGUgcm93IGluIHRoaXMgdGFibGVcbiAgICAgICAgYmlkcy5zZXRDb3VudChDb25maWdbJ2NvdW50X3Jvd19iaWRzJ10pO1xuICAgICAgICBhc2suc2V0Q291bnQoQ29uZmlnWydjb3VudF9yb3dfYXNrJ10pO1xuXG4gICAgICAgIC8vQ3JlYXRlIHRoZSB2aWV3cyBvZiB0aGUgdGFibGVzXG4gICAgICAgIGJpZHMuY3JlYXRlVGFibGUoJCgnI3RhYmxlLWJpZHMnKSk7XG4gICAgICAgIGFzay5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYXNrJykpO1xuXG4gICAgICAgIC8vTWFya2V0IGhpc3RvcnlcbiAgICAgICAgdHJhZGUgPSBuZXcgVGFibGVTdGF0aXN0aWNzKCk7XG4gICAgICAgIHRyYWRlLnNldEtleXMoQ29uZmlnWydrZXlzX3RyYWRlX2hpc3RvcnknXSk7XG4gICAgICAgIHRyYWRlLnNldENvdW50KENvbmZpZ1snY291bnRfdHJhZGVfaGlzdG9yeSddKTtcbiAgICAgICAgdHJhZGUuY3JlYXRlVGFibGUoJCgnI21hcmtldC1oaXN0b3J5JykpO1xuXG5cbiAgICAgICAgb3JkZXJPcGVuID0gbmV3IFRhYmxlU3RhdGlzdGljcygpO1xuICAgICAgICBvcmRlck9wZW4uc2V0S2V5cyhDb25maWdbJ2tleXNfb3JkZXJfb3BlbiddKTtcbiAgICAgICAgb3JkZXJPcGVuLnNldENvdW50KENvbmZpZ1snY291bnRfb3JkZXJfb3BlbiddKTtcbiAgICAgICAgb3JkZXJPcGVuLmNyZWF0ZVRhYmxlKCQoJyN0YWJsZS1vcGVuJykpO1xuXG5cbiAgICAgICAgb3JkZXJIaXN0b3J5ID0gbmV3IFRhYmxlU3RhdGlzdGljcygpO1xuICAgICAgICBvcmRlckhpc3Rvcnkuc2V0S2V5cyhDb25maWdbJ2tleXNfb3JkZXJfaGlzdG9yeSddKTtcbiAgICAgICAgb3JkZXJIaXN0b3J5LnNldENvdW50KENvbmZpZ1snY291bnRfb3JkZXJfaGlzdG9yeSddKTtcbiAgICAgICAgb3JkZXJIaXN0b3J5LmNyZWF0ZVRhYmxlKCQoJyNvcmRlci1oaXN0b3J5JykpO1xuICAgIH1cblxuXG5cbiAgICB2YXIgVGFibGVTdGF0aXN0aWNzID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9jcmVhdGVUYWJsZXNTdGF0aXN0aWNzJyk7XG5cbiAgICAvL3RyYWRlLnNldEtleXMoQ29uZmlnWydrZXlzX3RyYWRlX2hpc3RvcnknXSk7XG5cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghd2luZG93LldlYlNvY2tldCkge1xuICAgICAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlNvY2tldC4nKTtcbiAgICAgICAgfVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gY3JlYXRlIGNvbm5lY3Rpb25cbiAgICAgICAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcpO1xuXG4gICAgICAgIHNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgc2VsZWN0Um9vbSgpO1xuICAgICAgICAgICAgY3JlYXRlVGFibGVzKCk7XG5cblxuICAgICAgICAgICAgdmFyIGNoYXJ0ID0gcmVxdWlyZSgnLi9jaGFydCcpO1xuXG4gICAgICAgICAgICAvL0Nvbm5lY3Rpb24gdG8gdGhlIHJvb21cbiAgICAgICAgICAgIHNvY2tldC5lbWl0KCdyb29tJywgcm9vbSk7XG5cblxuICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2RhdGFfdG9fY2hhcnQnLCAnJyk7XG4gICAgICAgICAgICBzb2NrZXQub24oJ2RhdGFfdG9fY2hhcnQnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgY2hhcnQubG9hZERhdGEobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL0xpc3RlbiB0aGUgc29ja2V0cyB0byBjaGFuZ2UgdGhlIHRhYmxlc1xuICAgICAgICAgICAgc29ja2V0Lm9uKCdhc2snLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgYXNrLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdiaWRzJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgIGJpZHMudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3RyYWRlX2hpc3RvcnknLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgdHJhZGUudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ29yZGVyX29wZW4nLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJPcGVuLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdvcmRlcl9oaXN0b3J5JywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgIG9yZGVySGlzdG9yeS51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAvL0RldmVsb3BtZW50XG4gICAgICAgICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuO1xuXG52YXIgc2VydmljZSA9IG5ldyBDbGllbnRTb2NrZXRzKCk7XG5zZXJ2aWNlKCk7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIiwidmFyIFRhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZTtcbiAgICB2YXIgdGFibGVWYWx1ZSA9IFtdO1xuICAgIHZhciBwYWdlTnVtYmVyID0gMTtcbiAgICB2YXIgcGFnZUNvdW50ID0gMTtcbiAgICB2YXIgY291bnRPZlJvd3MgPSA2O1xuXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFnZVZpZXcoKSB7XG4gICAgICAgICQodGFibGUpLmZpbmQoJy5wYWdlLW51bWJlcicpLnRleHQocGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQpO1xuICAgIH1cbiAgICA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcblxuICAgICAgICB2YXIgY291bnQgPSAocGFnZUNvdW50ICE9PSBwYWdlTnVtYmVyKSA/IGNvdW50T2ZSb3dzIDogTWF0aC5yb3VuZCgxMCAqIHRhYmxlVmFsdWUubGVuZ3RoIC8gY291bnRPZlJvd3MpIC0gTWF0aC5yb3VuZCh0YWJsZVZhbHVlLmxlbmd0aCAvIGNvdW50T2ZSb3dzKTtcbiAgICAgICAgdmFyIGRhdGEgPSB0YWJsZVZhbHVlLnNwbGljZSgocGFnZU51bWJlciAtIDEpICogY291bnRPZlJvd3MsIGNvdW50KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudE9mUm93czsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD4nICsgTWF0aC5yb3VuZChkYXRhW2ldWydzdW0nXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgTWF0aC5yb3VuZChkYXRhW2ldWyd0b3RhbCddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBkYXRhW2ldWydzaXplKG5nbCknXSArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGRhdGFbaV1bJ2JpZChidGMpJ10gKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPjwvdHI+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJ3RyOmVxKCAnICsgKGkgKyAxKSArICcpJykucmVwbGFjZVdpdGgoYmlkKTtcblxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG4gICAgO1xuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzZXRDb3VudDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBjb3VudE9mUm93cyA9IG5ld1ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICgodmFsdWUubGVuZ3RoICUgY291bnRPZlJvd3MgPT09IDApKVxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodmFsdWUubGVuZ3RoIC8gY291bnRPZlJvd3MpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodmFsdWUubGVuZ3RoIC8gY291bnRPZlJvd3MpICsgMTtcblxuICAgICAgICAgICAgaWYgKChwYWdlQ291bnQgPCBwYWdlTnVtYmVyKSYmKHBhZ2VDb3VudD4xKSlcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50IC0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVUYWJsZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRhYmxlID0gZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlVGVtcGxhdGUgPSAnPHRyPjx0aD5TdW08L3RoPjx0aD5Ub3RhbDwvdGg+PHRoPlNpemUgKE5MRyk8L3RoPjx0aD5CaWQgKEJUQyk8L3RoPjwvdHI+JztcbiAgICAgICAgICAgIHZhciByb3cgPSAnKyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgPSAnPHRyIGNsYXNzPVwicm93LScgKyBpICsgJ1wiPjx0ZD48L3RkPjx0ZD4gPC90ZD48dGQ+IDwvdGQ+PHRkPiA8L3RkPjwvdHI+JztcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGVtcGxhdGUgKz0gcm93O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRhYmxlKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgndGJvZHknKVxuICAgICAgICAgICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChtZXNzYWdlVGVtcGxhdGUpO1xuICAgICAgICAgICAgJCh0YWJsZSkuYXBwZW5kKFwiPGRpdiBjbGFzcz0ncGFnaW5uYXRpb24nPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2ZpcnN0Jz5GaXJzdDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J3ByZXZlbnQnPlByZXZlbnQ8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ncGFnZS1udW1iZXInPlwiICsgcGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQgKyBcIjwvc3Bhbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSduZXh0Jz5OZXh0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbGFzdCc+TGFzdDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLmZpcnN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSAxO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlTnVtYmVyIDwgcGFnZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5wcmV2ZW50Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlTnVtYmVyID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyLS07XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcubGFzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50O1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc09yZGVyQm9vay5qcyIsInZhciBUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFibGU7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICB2YXIgdGFibGVWYWx1ZSA9IFtdO1xuICAgIHZhciBjb3VudE9mUm93cyA9IDU7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcblxuICAgICAgICB2YXIgcm93ID0gJysnO1xuICAgICAgICB2YXIgbWVzc2FnZVRlbXBsYXRlID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJvd09mVGFibGUgPSAkKHRhYmxlKS5maW5kKCd0cjplcSggJyArIChpICsgMSkgKyAnKScpO1xuICAgICAgICAgICAgcm93ID0gJzx0cj4nO1xuICAgICAgICAgICAgaWYgKHRhYmxlVmFsdWVbaV0pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD4nICsgdGFibGVWYWx1ZVtpXVtrZXlzW2tleV1dICsgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvd09mVGFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQocm93T2ZUYWJsZSkucmVwbGFjZVdpdGgocm93KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRhYmxlKS5maW5kKCd0Ym9keScpLmFwcGVuZChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgndHI6ZXEoICcgKyAodGFibGVWYWx1ZS5sZW5ndGggKyAxKSArICcpJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIHNldEtleXM6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAga2V5cyA9IG5ld1ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRhYmxlOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdGFibGUgPSBlbGVtZW50O1xuICAgICAgICAgICAgdmFyIGhlYWRPZlRhYmxlID0gJzx0cj4nO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgICAgICBoZWFkT2ZUYWJsZSArPSAnPHRoPicgKyBrZXlzW2tleV0gKyAnPC90aD4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgaGVhZE9mVGFibGUgKz0gJzwvdHI+JztcblxuICAgICAgICAgICAgdmFyIHJvdyA9ICcrJztcbiAgICAgICAgICAgIHZhciBtZXNzYWdlVGVtcGxhdGUgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyA9ICc8dHI+JztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgICAgICByb3cgKz0gJzx0ZD48L3RkPic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICByb3cgKz0gJzwvdHI+JztcbiAgICAgICAgICAgICAgICBtZXNzYWdlVGVtcGxhdGUgKz0gcm93O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRhYmxlKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgndGJvZHknKVxuICAgICAgICAgICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChoZWFkT2ZUYWJsZSk7XG4gICAgICAgICAgICAkKHRhYmxlKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgndGJvZHknKVxuICAgICAgICAgICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChtZXNzYWdlVGVtcGxhdGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldENvdW50OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGNvdW50T2ZSb3dzID0gbmV3VmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGFibGVWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc1N0YXRpc3RpY3MuanMiLCJmdW5jdGlvbiBDaGFydE1hcmtldCgpIHtcbiAgICB2YXIgZGF0YSA9IFtdO1xuICAgIFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0ICgpIHtcbiAgICAgICAgICAgIHZhciBjZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBhbnljaGFydC5vbkRvY3VtZW50UmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBkYXRhIHVzZWQgaW4gdGhpcyBzYW1wbGUgY2FuIGJlIG9idGFpbmVkIGZyb20gdGhlIENETlxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9jZG4uYW55Y2hhcnQuY29tL2Nzdi1kYXRhL2NzY28tZGFpbHkuanNcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBkYXRhIHRhYmxlIG9uIGxvYWRlZCBkYXRhXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFUYWJsZSA9IGFueWNoYXJ0LmRhdGEudGFibGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhVGFibGUuYWRkRGF0YShkYXRhKTtcblxuICAgICAgICAgICAgICAgIHZhciBzdGFnZSA9IGFueWNoYXJ0LmdyYXBoaWNzLmNyZWF0ZSgnY29udGFpbmVyX2NoYXJ0Jyk7XG4gICAgICAgICAgICAgICAgLy8gbWFwIGxvYWRlZCBkYXRhIGZvciB0aGUgb2hsYyBzZXJpZXNcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGluZyA9IGRhdGFUYWJsZS5tYXBBcyh7XG4gICAgICAgICAgICAgICAgICAgICdvcGVuJzogMSxcbiAgICAgICAgICAgICAgICAgICAgJ2hpZ2gnOiAyLFxuICAgICAgICAgICAgICAgICAgICAnbG93JzogMyxcbiAgICAgICAgICAgICAgICAgICAgJ2Nsb3NlJzogNCxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzoge2NvbHVtbjogNCwgdHlwZTogJ2Nsb3NlJ31cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIG1hcCBsb2FkZWQgZGF0YSBmb3IgdGhlIHNjcm9sbGVyXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbGVyTWFwcGluZyA9IGRhdGFUYWJsZS5tYXBBcygpO1xuICAgICAgICAgICAgICAgIHNjcm9sbGVyTWFwcGluZy5hZGRGaWVsZCgndmFsdWUnLCAxMCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgc3RvY2sgY2hhcnRcbiAgICAgICAgICAgICAgICBjaGFydCA9IGFueWNoYXJ0LnN0b2NrKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgZmlyc3QgcGxvdCBvbiB0aGUgY2hhcnRcbiAgICAgICAgICAgICAgICB2YXIgcGxvdCA9IGNoYXJ0LnBsb3QoKTtcbiAgICAgICAgICAgICAgICBwbG90LmdyaWQoKS5lbmFibGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIHBsb3QuZ3JpZCgxKS5lbmFibGVkKHRydWUpLmxheW91dCgndmVydGljYWwnKTtcbiAgICAgICAgICAgICAgICBwbG90Lm1pbm9yR3JpZCgpLmVuYWJsZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcGxvdC5taW5vckdyaWQoMSkuZW5hYmxlZCh0cnVlKS5sYXlvdXQoJ3ZlcnRpY2FsJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VyaWVzID0gcGxvdC5jYW5kbGVzdGljayhtYXBwaW5nKS5uYW1lKCdDU0NPJyk7XG4gICAgICAgICAgICAgICAgc2VyaWVzLmxlZ2VuZEl0ZW0oKS5pY29uVHlwZSgncmlzaW5nZmFsbGluZycpO1xuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIEJCYW5kcyBpbmRpY2F0b3Igd2l0aCBwZXJpb2QgMjBcbiAgICAgICAgICAgICAgICB2YXIgYkJhbmRzSW5kaWNhdG9yID0gcGxvdC5iYmFuZHMobWFwcGluZyk7XG4gICAgICAgICAgICAgICAgYkJhbmRzSW5kaWNhdG9yLmRldmlhdGlvbigyLjUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluZGljYXRvclBsb3QgPSBjaGFydC5wbG90KDEpO1xuICAgICAgICAgICAgICAgIGluZGljYXRvclBsb3QuaGVpZ2h0KCczMCUnKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBCQmFuZHMgV2lkdGggaW5kaWNhdG9yIHdpdGggcGVyaW9kIDIwXG4gICAgICAgICAgICAgICAgdmFyIGJCYW5kc1dpZHRoSW5kaWNhdG9yID0gaW5kaWNhdG9yUGxvdC5iYmFuZHNXaWR0aChtYXBwaW5nKS5zZXJpZXMoJ3NwbGluZUFyZWEnKTtcbiAgICAgICAgICAgICAgICBiQmFuZHNXaWR0aEluZGljYXRvci5kZXZpYXRpb24oMi41KTtcblxuICAgICAgICAgICAgICAgIHZhciBpbmRpY2F0b3JTZXJpZXMgPSBiQmFuZHNXaWR0aEluZGljYXRvci5zZXJpZXMoKTtcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JTZXJpZXMuc3Ryb2tlKCcxLjUgI0YxODEyNicpO1xuICAgICAgICAgICAgICAgIGluZGljYXRvclNlcmllcy5maWxsKGFueWNoYXJ0LmNvbG9yLmxpZ2h0ZW4oaW5kaWNhdG9yU2VyaWVzLnN0cm9rZSgpLmNvbG9yLCAwLjUpKTtcblxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBzY3JvbGxlciBzZXJpZXMgd2l0aCBtYXBwZWQgZGF0YVxuICAgICAgICAgICAgICAgIGNoYXJ0LnNjcm9sbGVyKCkuY2FuZGxlc3RpY2sobWFwcGluZyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY29udGFpbmVyIGlkIGZvciB0aGUgY2hhcnRcbiAgICAgICAgICAgICAgICBjaGFydC5jb250YWluZXIoc3RhZ2UpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNoYXJ0IHNlbGVjdGVkIGRhdGUvdGltZSByYW5nZVxuICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdFJhbmdlKCcxOTkwLTA0LTE4JywgJzE5OTAtMDUtMTcnKTtcblxuICAgICAgICAgICAgICAgIC8vIGluaXRpYXRlIGNoYXJ0IGRyYXdpbmdcbiAgICAgICAgICAgICAgICBjaGFydC5kcmF3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9hZERhdGE6IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgICAgIGRhdGEgPSBvYmplY3RbJ2RhdGEnXTtcbiAgICAgICAgICAgIGNyZWF0ZUNoYXJ0ICgpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbjtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydE1hcmtldCgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vY2hhcnQuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBY0E7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTs7O0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7OztBQUFBOzs7QUFBQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdEQTtBQStEQTtBQUNBO0FBRUE7Ozs7OztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1Q0E7QUE4Q0E7QUFDQTtBQUVBOzs7Ozs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7OztBIiwic291cmNlUm9vdCI6IiJ9