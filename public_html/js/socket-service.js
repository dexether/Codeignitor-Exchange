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
    'count_row_bids': 6,
    'count_row_ask': 6,
    'rooms': ['GTS-NLG', 'EUR-NLG']
};

module.exports = config;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Table = function () {
    var table;
    var tableValue = [];
    var pageNumber = 1;
    var pageCount = 1;
    var countRow = 6;

    function changePageView() {
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
    }
    ;

    function updateTable() {
        changePageView();

        var count = pageCount !== pageNumber ? countRow : Math.round(10 * tableValue.length / countRow) - Math.round(tableValue.length / countRow);
        var data = tableValue.splice((pageNumber - 1) * countRow, count);
        for (var i = 0; i < countRow; i++) {
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
            countRow = newValue;
        },

        updateValue: function (value) {
            tableValue = value;

            if (value.length % countRow === 0) pageCount = Math.round(value.length / countRow);else pageCount = Math.round(value.length / countRow) + 1;

            if (pageCount < pageNumber) pageNumber = pageCount - 1;

            updateTable();
        },

        createTable: function (element) {
            table = element;
            var messageTemplate = '<tr><th>Sum</th><th>Total</th><th>Size (NLG)</th><th>Bid (BTC)</th></tr>';
            var row = '+';
            for (var i = 0; i < countRow; i++) {
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_createTable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_createTable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__services_createTable__);


if (!window.WebSocket) {
    alert('Your browser does not support WebSocket.');
}

var pathname = window.location.pathname;
console.log(pathname);


var rooms = __WEBPACK_IMPORTED_MODULE_0__config___default.a['rooms'];
var room;
rooms.forEach(function (element) {
    if (pathname.indexOf(element) >= 0) {
        room = element;
        console.log('You`re jioned to the room ' + room);
    };
});



//Create the objects of the tables
var bids = new __WEBPACK_IMPORTED_MODULE_1__services_createTable___default.a();
var ask = new __WEBPACK_IMPORTED_MODULE_1__services_createTable___default.a();

//Set the count of the row in this table
bids.setCount(__WEBPACK_IMPORTED_MODULE_0__config___default.a['count_row_bids']);
ask.setCount(__WEBPACK_IMPORTED_MODULE_0__config___default.a['count_row_ask']);

//Create the views of the tables
bids.createTable($('#table-bids'));
ask.createTable($('#table-ask'));

// create connection
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.emit('room', room);

    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        ask.updateValue(msg);
    });

    socket.on('bids', function (msg) {
        bids.updateValue(msg);
    });
});

//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGQ2YzBlNWYxNDkwM2U3NjJhOTEiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL2NyZWF0ZVRhYmxlLmpzIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRkNmMwZTVmMTQ5MDNlNzYyYTkxIiwidmFyIGNvbmZpZyA9IHtcbiAgICAnY291bnRfcm93X2JpZHMnOiA2LFxuICAgICdjb3VudF9yb3dfYXNrJzogNixcbiAgICAncm9vbXMnOiBbXG4gICAgICAgICdHVFMtTkxHJyxcbiAgICAgICAgJ0VVUi1OTEcnXG4gICAgXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL2NvbmZpZy5qcyIsInZhciBUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFibGU7XG4gICAgdmFyIHRhYmxlVmFsdWUgPSBbXTtcbiAgICB2YXIgcGFnZU51bWJlciA9IDE7XG4gICAgdmFyIHBhZ2VDb3VudCA9IDE7XG4gICAgdmFyIGNvdW50Um93ID0gNjtcblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhZ2VWaWV3KCkge1xuICAgICAgICAkKHRhYmxlKS5maW5kKCcucGFnZS1udW1iZXInKS50ZXh0KHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50KTtcbiAgICB9XG4gICAgO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gKHBhZ2VDb3VudCAhPT0gcGFnZU51bWJlcikgPyBjb3VudFJvdyA6IE1hdGgucm91bmQoMTAgKiB0YWJsZVZhbHVlLmxlbmd0aCAvIGNvdW50Um93KSAtIE1hdGgucm91bmQodGFibGVWYWx1ZS5sZW5ndGggLyBjb3VudFJvdyk7XG4gICAgICAgIHZhciBkYXRhID0gdGFibGVWYWx1ZS5zcGxpY2UoKHBhZ2VOdW1iZXIgLSAxKSAqIGNvdW50Um93LCBjb3VudCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRSb3c7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYmlkID0gJzx0cj48dGQ+JyArIE1hdGgucm91bmQoZGF0YVtpXVsnc3VtJ10gKiAxMDAwMCkgLyAxMDAwMCArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIE1hdGgucm91bmQoZGF0YVtpXVsndG90YWwnXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgZGF0YVtpXVsnc2l6ZShuZ2wpJ10gKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBkYXRhW2ldWydiaWQoYnRjKSddICsgJzwvdGQ+PC90cj4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYmlkID0gJzx0cj48dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD48L3RyPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCd0cjplcSggJyArIChpICsgMSkgKyAnKScpLnJlcGxhY2VXaXRoKGJpZCk7XG5cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfVxuICAgIDtcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0Q291bnQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgY291bnRSb3cgPSBuZXdWYWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0YWJsZVZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIGlmICgodmFsdWUubGVuZ3RoICUgY291bnRSb3cgPT09IDApKVxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodmFsdWUubGVuZ3RoIC8gY291bnRSb3cpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudCA9IE1hdGgucm91bmQodmFsdWUubGVuZ3RoIC8gY291bnRSb3cpICsgMTtcblxuICAgICAgICAgICAgaWYgKHBhZ2VDb3VudCA8IHBhZ2VOdW1iZXIpXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudCAtIDE7XG5cbiAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVGFibGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICB0YWJsZSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZVRlbXBsYXRlID0gJzx0cj48dGg+U3VtPC90aD48dGg+VG90YWw8L3RoPjx0aD5TaXplIChOTEcpPC90aD48dGg+QmlkIChCVEMpPC90aD48L3RyPic7XG4gICAgICAgICAgICB2YXIgcm93ID0gJysnO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNvdW50Um93OyBpKyspe1xuICAgICAgICAgICAgICAgIHJvdyA9ICc8dHIgY2xhc3M9XCJyb3ctJyArIGkgKyAnXCI+PHRkPjwvdGQ+PHRkPiA8L3RkPjx0ZD4gPC90ZD48dGQ+IDwvdGQ+PC90cj4nO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VUZW1wbGF0ZSArPSByb3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGFibGUpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCd0Ym9keScpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKG1lc3NhZ2VUZW1wbGF0ZSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdwYWdpbm5hdGlvbic+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nZmlyc3QnPkZpcnN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ncHJldmVudCc+UHJldmVudDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdwYWdlLW51bWJlcic+XCIgKyBwYWdlTnVtYmVyICsgXCIgLyBcIiArIHBhZ2VDb3VudCArIFwiPC9zcGFuPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J25leHQnPk5leHQ8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdsYXN0Jz5MYXN0PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcuZmlyc3QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XG4gICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPCBwYWdlQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcisrO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLnByZXZlbnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXItLTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5sYXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgPSBwYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc2VydmljZXMvY3JlYXRlVGFibGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmlmICghd2luZG93LldlYlNvY2tldCkge1xuICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJTb2NrZXQuJyk7XG59XG5cblxuXG52YXIgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5jb25zb2xlLmxvZyhwYXRobmFtZSk7XG5cblxuaW1wb3J0IENvbmZpZyBmcm9tICcuLi9jb25maWcnO1xudmFyIHJvb21zID0gQ29uZmlnWydyb29tcyddO1xudmFyIHJvb207XG5yb29tcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAocGF0aG5hbWUuaW5kZXhPZihlbGVtZW50KSA+PSAwKSB7XG4gICAgICAgIHJvb20gPSBlbGVtZW50O1xuICAgICAgICBjb25zb2xlLmxvZygnWW91YHJlIGppb25lZCB0byB0aGUgcm9vbSAnKyByb29tKTtcbiAgICB9O1xufSk7XG5cbmltcG9ydCBUYWJsZSBmcm9tICcuL3NlcnZpY2VzL2NyZWF0ZVRhYmxlJztcblxuLy9DcmVhdGUgdGhlIG9iamVjdHMgb2YgdGhlIHRhYmxlc1xudmFyIGJpZHMgPSBuZXcgVGFibGUoKTtcbnZhciBhc2sgPSBuZXcgVGFibGUoKTtcblxuXG4vL1NldCB0aGUgY291bnQgb2YgdGhlIHJvdyBpbiB0aGlzIHRhYmxlXG5iaWRzLnNldENvdW50KENvbmZpZ1snY291bnRfcm93X2JpZHMnXSk7XG5hc2suc2V0Q291bnQoQ29uZmlnWydjb3VudF9yb3dfYXNrJ10pO1xuXG4vL0NyZWF0ZSB0aGUgdmlld3Mgb2YgdGhlIHRhYmxlc1xuYmlkcy5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYmlkcycpKTtcbmFzay5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYXNrJykpO1xuXG5cblxuLy8gY3JlYXRlIGNvbm5lY3Rpb25cbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjgwODAnKTtcbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICBzb2NrZXQuZW1pdCgncm9vbScsIHJvb20pO1xuICAgIFxuICAgIHNvY2tldC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbignYXNrJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBhc2sudXBkYXRlVmFsdWUobXNnKTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbignYmlkcycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICBiaWRzLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgfSk7XG59KTtcblxuXG5cblxuLy9leHBvcnRzLnNldEhlYWRlciA9IHRpbWVsaW5lTW9kdWxlLnNldEhlYWRlcih1c2VyKTtcbi8vZXhwb3J0cy5zZXRUaW1lbGluZSA9IHRpbWVsaW5lTW9kdWxlLnNldFRpbWVsaW5lKHVzZXIpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQVFBOzs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTs7O0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTs7O0FBQUE7OztBQUFBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBOURBO0FBZ0VBO0FBQ0E7QUFFQTs7Ozs7OztBQ3pHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=