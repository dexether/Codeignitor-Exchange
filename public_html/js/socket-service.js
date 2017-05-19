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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTU1ODQyOTJmNmRjMzZiYWU1OTkiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc09yZGVyQm9vay5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlc1N0YXRpc3RpY3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvcHVibGljX2h0bWwvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTU1ODQyOTJmNmRjMzZiYWU1OTkiLCJ2YXIgY29uZmlnID0ge1xuICAgICdjb3VudF9yb3dfYmlkcyc6IDUsXG4gICAgJ2NvdW50X3Jvd19hc2snOiA1LFxuICAgICdjb3VudF90cmFkZV9oaXN0b3J5JzogMTAsXG4gICAgJ2tleXNfdHJhZGVfaGlzdG9yeSc6IFsnZGF0ZScsICdidXkvc2VsbCcsICdndHMnLCAndG90YWwgdW5pdHMnLCAndG90YWwgY29zdCddLFxuICAgICdjb3VudF9vcmRlcl9vcGVuJzogNSxcbiAgICAna2V5c19vcmRlcl9vcGVuJzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0JywgJ3NvbWV0aGluZyddLFxuICAgICdjb3VudF9vcmRlcl9oaXN0b3J5JzogNSxcbiAgICAna2V5c19vcmRlcl9oaXN0b3J5JzogWydkYXRlJywgJ2J1eS9zZWxsJywgJ2d0cycsICd0b3RhbCB1bml0cycsICd0b3RhbCBjb3N0JywgJ3NvbWV0aGluZyddLFxuICAgICdyb29tcyc6IFtcbiAgICAgICAgJ0dUUy1OTEcnLFxuICAgICAgICAnRVVSLU5MRydcbiAgICBdXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvY29uZmlnLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBDbGllbnRTb2NrZXRzKCkge1xuXG4gICAgdmFyIENvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuICAgIHZhciBUYWJsZSA9IHJlcXVpcmUoJy4vc2VydmljZXMvY3JlYXRlVGFibGVzT3JkZXJCb29rJyk7XG5cbiAgICB2YXIgcm9vbSxcbiAgICAgICAgICAgIGFzayxcbiAgICAgICAgICAgIGJpZHMsXG4gICAgICAgICAgICB0cmFkZSxcbiAgICAgICAgICAgIG9yZGVyT3BlbixcbiAgICAgICAgICAgIG9yZGVySGlzdG9yeTtcblxuICAgIGZ1bmN0aW9uIHNlbGVjdFJvb20oKSB7XG4gICAgICAgIC8vR2V0IGEgbGlzdCBvZiB0aGUgcm9vbXMgYW5kIGN1cnJlbnQgVVJMXG4gICAgICAgIHZhciByb29tcyA9IENvbmZpZ1sncm9vbXMnXTtcbiAgICAgICAgdmFyIHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICAvL1NlbGVjdCByb29tIChpZiBVUkwgY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIHJvb20pXG4gICAgICAgIHJvb21zLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXRobmFtZS5pbmRleE9mKGVsZW1lbnQpID49IDApIHtcbiAgICAgICAgICAgICAgICByb29tID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91YHJlIGppb25lZCB0byB0aGUgcm9vbSAnICsgcm9vbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICA7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVUYWJsZXMoKSB7XG4gICAgICAgIC8vQ3JlYXRlIHRoZSBvYmplY3RzIG9mIHRoZSB0YWJsZXNcbiAgICAgICAgYmlkcyA9IG5ldyBUYWJsZSgpO1xuICAgICAgICBhc2sgPSBuZXcgVGFibGUoKTtcblxuICAgICAgICAvL1NldCB0aGUgY291bnQgb2YgdGhlIHJvdyBpbiB0aGlzIHRhYmxlXG4gICAgICAgIGJpZHMuc2V0Q291bnQoQ29uZmlnWydjb3VudF9yb3dfYmlkcyddKTtcbiAgICAgICAgYXNrLnNldENvdW50KENvbmZpZ1snY291bnRfcm93X2FzayddKTtcblxuICAgICAgICAvL0NyZWF0ZSB0aGUgdmlld3Mgb2YgdGhlIHRhYmxlc1xuICAgICAgICBiaWRzLmNyZWF0ZVRhYmxlKCQoJyN0YWJsZS1iaWRzJykpO1xuICAgICAgICBhc2suY3JlYXRlVGFibGUoJCgnI3RhYmxlLWFzaycpKTtcblxuICAgICAgICAvL01hcmtldCBoaXN0b3J5XG4gICAgICAgIHRyYWRlID0gbmV3IFRhYmxlU3RhdGlzdGljcygpO1xuICAgICAgICB0cmFkZS5zZXRLZXlzKENvbmZpZ1sna2V5c190cmFkZV9oaXN0b3J5J10pO1xuICAgICAgICB0cmFkZS5zZXRDb3VudChDb25maWdbJ2NvdW50X3RyYWRlX2hpc3RvcnknXSk7XG4gICAgICAgIHRyYWRlLmNyZWF0ZVRhYmxlKCQoJyNtYXJrZXQtaGlzdG9yeScpKTtcblxuXG4gICAgICAgIG9yZGVyT3BlbiA9IG5ldyBUYWJsZVN0YXRpc3RpY3MoKTtcbiAgICAgICAgb3JkZXJPcGVuLnNldEtleXMoQ29uZmlnWydrZXlzX29yZGVyX29wZW4nXSk7XG4gICAgICAgIG9yZGVyT3Blbi5zZXRDb3VudChDb25maWdbJ2NvdW50X29yZGVyX29wZW4nXSk7XG4gICAgICAgIG9yZGVyT3Blbi5jcmVhdGVUYWJsZSgkKCcjdGFibGUtb3BlbicpKTtcblxuXG4gICAgICAgIG9yZGVySGlzdG9yeSA9IG5ldyBUYWJsZVN0YXRpc3RpY3MoKTtcbiAgICAgICAgb3JkZXJIaXN0b3J5LnNldEtleXMoQ29uZmlnWydrZXlzX29yZGVyX2hpc3RvcnknXSk7XG4gICAgICAgIG9yZGVySGlzdG9yeS5zZXRDb3VudChDb25maWdbJ2NvdW50X29yZGVyX2hpc3RvcnknXSk7XG4gICAgICAgIG9yZGVySGlzdG9yeS5jcmVhdGVUYWJsZSgkKCcjb3JkZXItaGlzdG9yeScpKTtcbiAgICB9XG5cblxuXG4gICAgdmFyIFRhYmxlU3RhdGlzdGljcyA9IHJlcXVpcmUoJy4vc2VydmljZXMvY3JlYXRlVGFibGVzU3RhdGlzdGljcycpO1xuXG4gICAgLy90cmFkZS5zZXRLZXlzKENvbmZpZ1sna2V5c190cmFkZV9oaXN0b3J5J10pO1xuXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5XZWJTb2NrZXQpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJTb2NrZXQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBjb25uZWN0aW9uXG4gICAgICAgIHZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjgwODAnKTtcblxuICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHNlbGVjdFJvb20oKTtcbiAgICAgICAgICAgIGNyZWF0ZVRhYmxlcygpO1xuXG4gICAgICAgICAgICAvL0Nvbm5lY3Rpb24gdG8gdGhlIHJvb21cbiAgICAgICAgICAgIHNvY2tldC5lbWl0KCdyb29tJywgcm9vbSk7XG5cbiAgICAgICAgICAgIC8vTGlzdGVuIHRoZSBzb2NrZXRzIHRvIGNoYW5nZSB0aGUgdGFibGVzXG4gICAgICAgICAgICBzb2NrZXQub24oJ2FzaycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBhc2sudXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2JpZHMnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgYmlkcy51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigndHJhZGVfaGlzdG9yeScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICB0cmFkZS51cGRhdGVWYWx1ZShtc2cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNvY2tldC5vbignb3JkZXJfb3BlbicsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBvcmRlck9wZW4udXBkYXRlVmFsdWUobXNnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzb2NrZXQub24oJ29yZGVyX2hpc3RvcnknLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJIaXN0b3J5LnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIC8vRGV2ZWxvcG1lbnRcbiAgICAgICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG47XG5cbnZhciBzZXJ2aWNlID0gbmV3IENsaWVudFNvY2tldHMoKTtcbnNlcnZpY2UoKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuanMiLCJ2YXIgVGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYmxlO1xuICAgIHZhciB0YWJsZVZhbHVlID0gW107XG4gICAgdmFyIHBhZ2VOdW1iZXIgPSAxO1xuICAgIHZhciBwYWdlQ291bnQgPSAxO1xuICAgIHZhciBjb3VudE9mUm93cyA9IDY7XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VQYWdlVmlldygpIHtcbiAgICAgICAgJCh0YWJsZSkuZmluZCgnLnBhZ2UtbnVtYmVyJykudGV4dChwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCk7XG4gICAgfVxuICAgIDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuXG4gICAgICAgIHZhciBjb3VudCA9IChwYWdlQ291bnQgIT09IHBhZ2VOdW1iZXIpID8gY291bnRPZlJvd3MgOiBNYXRoLnJvdW5kKDEwICogdGFibGVWYWx1ZS5sZW5ndGggLyBjb3VudE9mUm93cykgLSBNYXRoLnJvdW5kKHRhYmxlVmFsdWUubGVuZ3RoIC8gY291bnRPZlJvd3MpO1xuICAgICAgICB2YXIgZGF0YSA9IHRhYmxlVmFsdWUuc3BsaWNlKChwYWdlTnVtYmVyIC0gMSkgKiBjb3VudE9mUm93cywgY291bnQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50T2ZSb3dzOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2ldKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpZCA9ICc8dHI+PHRkPicgKyBNYXRoLnJvdW5kKGRhdGFbaV1bJ3N1bSddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBNYXRoLnJvdW5kKGRhdGFbaV1bJ3RvdGFsJ10gKiAxMDAwMCkgLyAxMDAwMCArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGRhdGFbaV1bJ3NpemUobmdsKSddICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgZGF0YVtpXVsnYmlkKGJ0YyknXSArICc8L3RkPjwvdHI+JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpZCA9ICc8dHI+PHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+PC90cj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgndHI6ZXEoICcgKyAoaSArIDEpICsgJyknKS5yZXBsYWNlV2l0aChiaWQpO1xuXG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH1cbiAgICA7XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIHNldENvdW50OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGNvdW50T2ZSb3dzID0gbmV3VmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGFibGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKCh2YWx1ZS5sZW5ndGggJSBjb3VudE9mUm93cyA9PT0gMCkpXG4gICAgICAgICAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh2YWx1ZS5sZW5ndGggLyBjb3VudE9mUm93cyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh2YWx1ZS5sZW5ndGggLyBjb3VudE9mUm93cykgKyAxO1xuXG4gICAgICAgICAgICBpZiAoKHBhZ2VDb3VudCA8IHBhZ2VOdW1iZXIpJiYocGFnZUNvdW50PjEpKVxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSBwYWdlQ291bnQgLSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRhYmxlOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdGFibGUgPSBlbGVtZW50O1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VUZW1wbGF0ZSA9ICc8dHI+PHRoPlN1bTwvdGg+PHRoPlRvdGFsPC90aD48dGg+U2l6ZSAoTkxHKTwvdGg+PHRoPkJpZCAoQlRDKTwvdGg+PC90cj4nO1xuICAgICAgICAgICAgdmFyIHJvdyA9ICcrJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRPZlJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyA9ICc8dHIgY2xhc3M9XCJyb3ctJyArIGkgKyAnXCI+PHRkPjwvdGQ+PHRkPiA8L3RkPjx0ZD4gPC90ZD48dGQ+IDwvdGQ+PC90cj4nO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VUZW1wbGF0ZSArPSByb3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGFibGUpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCd0Ym9keScpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKG1lc3NhZ2VUZW1wbGF0ZSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdwYWdpbm5hdGlvbic+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nZmlyc3QnPkZpcnN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldmVudCc+UHJldmVudDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdwYWdlLW51bWJlcic+XCIgKyBwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCArIFwiPC9zcGFuPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J25leHQnPk5leHQ8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdsYXN0Jz5MYXN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcuZmlyc3QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPCBwYWdlQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcisrO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLnByZXZlbnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXItLTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5sYXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSBwYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc2VydmljZXMvY3JlYXRlVGFibGVzT3JkZXJCb29rLmpzIiwidmFyIFRhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIHZhciB0YWJsZVZhbHVlID0gW107XG4gICAgdmFyIGNvdW50T2ZSb3dzID0gNTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuXG4gICAgICAgIHZhciByb3cgPSAnKyc7XG4gICAgICAgIHZhciBtZXNzYWdlVGVtcGxhdGUgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudE9mUm93czsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93T2ZUYWJsZSA9ICQodGFibGUpLmZpbmQoJ3RyOmVxKCAnICsgKGkgKyAxKSArICcpJyk7XG4gICAgICAgICAgICByb3cgPSAnPHRyPic7XG4gICAgICAgICAgICBpZiAodGFibGVWYWx1ZVtpXSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPicgKyB0YWJsZVZhbHVlW2ldW2tleXNba2V5XV0gKyAnPC90ZD4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgcm93ICs9ICc8L3RyPic7XG5cbiAgICAgICAgICAgICAgICBpZiAocm93T2ZUYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJChyb3dPZlRhYmxlKS5yZXBsYWNlV2l0aChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGFibGUpLmZpbmQoJ3Rib2R5JykuYXBwZW5kKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRhYmxlKS5maW5kKCd0cjplcSggJyArICh0YWJsZVZhbHVlLmxlbmd0aCArIDEpICsgJyknKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcblxuICAgICAgICB9XG4gICAgfVxuICAgIDtcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0S2V5czogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBrZXlzID0gbmV3VmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVGFibGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICB0YWJsZSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgaGVhZE9mVGFibGUgPSAnPHRyPic7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgIGhlYWRPZlRhYmxlICs9ICc8dGg+JyArIGtleXNba2V5XSArICc8L3RoPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBoZWFkT2ZUYWJsZSArPSAnPC90cj4nO1xuXG4gICAgICAgICAgICB2YXIgcm93ID0gJysnO1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VUZW1wbGF0ZSA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudE9mUm93czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ID0gJzx0cj4nO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyArPSAnPHRkPjwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIHJvdyArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VUZW1wbGF0ZSArPSByb3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGFibGUpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCd0Ym9keScpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKGhlYWRPZlRhYmxlKTtcbiAgICAgICAgICAgICQodGFibGUpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCd0Ym9keScpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKG1lc3NhZ2VUZW1wbGF0ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q291bnQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgY291bnRPZlJvd3MgPSBuZXdWYWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc2VydmljZXMvY3JlYXRlVGFibGVzU3RhdGlzdGljcy5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFjQTs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTs7O0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7OztBQUFBOzs7QUFBQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdEQTtBQStEQTtBQUNBO0FBRUE7Ozs7OztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1Q0E7QUE4Q0E7QUFDQTtBQUVBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==