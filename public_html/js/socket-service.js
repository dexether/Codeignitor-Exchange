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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
            console.log(countRow);
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_createTable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_createTable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__services_createTable__);


console.log('sc is working');
if (!window.WebSocket) {
    alert('our browser does not support WebSocket.');
}

var pathname = window.location.pathname;
console.log(pathname);


var rooms = __WEBPACK_IMPORTED_MODULE_0__config___default.a['rooms'];



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
    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        ask.updateValue(msg);
    });

    socket.on('bids', function (msg) {
        bids.updateValue(msg);
    });

    document.querySelector('#buy_button').onclick = function () {
        socket.emit('room', 'EUR-NLG');
    };
});

//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

var config = {
    'count_row_bids': 6,
    'count_row_ask': 6,
    'rooms': ['GTS-NLG', 'EUR-NLG']
};

module.exports = config;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTg4MWFkNGQyYzliOTI0MGFmNDciLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZS5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vcHVibGljX2h0bWwvanMvY29uZmlnLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDU4ODFhZDRkMmM5YjkyNDBhZjQ3IiwidmFyIFRhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZTtcbiAgICB2YXIgdGFibGVWYWx1ZSA9IFtdO1xuICAgIHZhciBwYWdlTnVtYmVyID0gMTtcbiAgICB2YXIgcGFnZUNvdW50ID0gMTtcbiAgICB2YXIgY291bnRSb3cgPSA2O1xuXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFnZVZpZXcoKSB7XG4gICAgICAgICQodGFibGUpLmZpbmQoJy5wYWdlLW51bWJlcicpLnRleHQocGFnZU51bWJlciArIFwiIC8gXCIgKyBwYWdlQ291bnQpO1xuICAgIH1cbiAgICA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgY2hhbmdlUGFnZVZpZXcoKTtcblxuICAgICAgICB2YXIgY291bnQgPSAocGFnZUNvdW50ICE9PSBwYWdlTnVtYmVyKSA/IGNvdW50Um93IDogTWF0aC5yb3VuZCgxMCAqIHRhYmxlVmFsdWUubGVuZ3RoIC8gY291bnRSb3cpIC0gTWF0aC5yb3VuZCh0YWJsZVZhbHVlLmxlbmd0aCAvIGNvdW50Um93KTtcbiAgICAgICAgdmFyIGRhdGEgPSB0YWJsZVZhbHVlLnNwbGljZSgocGFnZU51bWJlciAtIDEpICogY291bnRSb3csIGNvdW50KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudFJvdzsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD4nICsgTWF0aC5yb3VuZChkYXRhW2ldWydzdW0nXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgTWF0aC5yb3VuZChkYXRhW2ldWyd0b3RhbCddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBkYXRhW2ldWydzaXplKG5nbCknXSArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGRhdGFbaV1bJ2JpZChidGMpJ10gKyAnPC90ZD48L3RyPic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD48L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPjwvdHI+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJ3RyOmVxKCAnICsgKGkgKyAxKSArICcpJykucmVwbGFjZVdpdGgoYmlkKTtcblxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9XG4gICAgO1xuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzZXRDb3VudDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBjb3VudFJvdyA9IG5ld1ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRhYmxlVmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKCh2YWx1ZS5sZW5ndGggJSBjb3VudFJvdyA9PT0gMCkpXG4gICAgICAgICAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh2YWx1ZS5sZW5ndGggLyBjb3VudFJvdyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFnZUNvdW50ID0gTWF0aC5yb3VuZCh2YWx1ZS5sZW5ndGggLyBjb3VudFJvdykgKyAxO1xuXG4gICAgICAgICAgICBpZiAocGFnZUNvdW50IDwgcGFnZU51bWJlcilcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gcGFnZUNvdW50IC0gMTtcblxuICAgICAgICAgICAgdXBkYXRlVGFibGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVUYWJsZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRhYmxlID0gZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlVGVtcGxhdGUgPSAnPHRyPjx0aD5TdW08L3RoPjx0aD5Ub3RhbDwvdGg+PHRoPlNpemUgKE5MRyk8L3RoPjx0aD5CaWQgKEJUQyk8L3RoPjwvdHI+JztcbiAgICAgICAgICAgIHZhciByb3cgPSAnKyc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb3VudFJvdyk7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY291bnRSb3c7IGkrKyl7XG4gICAgICAgICAgICAgICAgcm93ID0gJzx0ciBjbGFzcz1cInJvdy0nICsgaSArICdcIj48dGQ+PC90ZD48dGQ+IDwvdGQ+PHRkPiA8L3RkPjx0ZD4gPC90ZD48L3RyPic7XG4gICAgICAgICAgICAgICAgbWVzc2FnZVRlbXBsYXRlICs9IHJvdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ3Rib2R5JylcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQobWVzc2FnZVRlbXBsYXRlKTtcbiAgICAgICAgICAgICQodGFibGUpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3BhZ2lubmF0aW9uJz5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdmaXJzdCc+Rmlyc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2ZW50Jz5QcmV2ZW50PC9idXR0b24+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3BhZ2UtbnVtYmVyJz5cIiArIHBhZ2VOdW1iZXIgKyBcIiAvIFwiICsgcGFnZUNvdW50ICsgXCI8L3NwYW4+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dCc+TmV4dDwvYnV0dG9uPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2xhc3QnPkxhc3Q8L2J1dHRvbj5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgICAgICQodGFibGUpLmZpbmQoJy5maXJzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyID0gMTtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcubmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZU51bWJlciA8IHBhZ2VDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyKys7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhZ2VWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVRhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRhYmxlKS5maW5kKCcucHJldmVudCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZU51bWJlciA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlci0tO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQYWdlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0YWJsZSkuZmluZCgnLmxhc3QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciA9IHBhZ2VDb3VudDtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYWJsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuY29uc29sZS5sb2coJ3NjIGlzIHdvcmtpbmcnKTtcbmlmICghd2luZG93LldlYlNvY2tldCkge1xuICAgIGFsZXJ0KCdvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlNvY2tldC4nKTtcbn1cblxuXG5cbnZhciBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbmNvbnNvbGUubG9nKHBhdGhuYW1lKTtcblxuXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG52YXIgcm9vbXMgPSBDb25maWdbJ3Jvb21zJ107XG5cbmltcG9ydCBUYWJsZSBmcm9tICcuL3NlcnZpY2VzL2NyZWF0ZVRhYmxlJztcblxuLy9DcmVhdGUgdGhlIG9iamVjdHMgb2YgdGhlIHRhYmxlc1xudmFyIGJpZHMgPSBuZXcgVGFibGUoKTtcbnZhciBhc2sgPSBuZXcgVGFibGUoKTtcblxuXG4vL1NldCB0aGUgY291bnQgb2YgdGhlIHJvdyBpbiB0aGlzIHRhYmxlXG5iaWRzLnNldENvdW50KENvbmZpZ1snY291bnRfcm93X2JpZHMnXSk7XG5hc2suc2V0Q291bnQoQ29uZmlnWydjb3VudF9yb3dfYXNrJ10pO1xuXG4vL0NyZWF0ZSB0aGUgdmlld3Mgb2YgdGhlIHRhYmxlc1xuYmlkcy5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYmlkcycpKTtcbmFzay5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYXNrJykpO1xuXG5cblxuLy8gY3JlYXRlIGNvbm5lY3Rpb25cbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjgwODAnKTtcbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oJ2FzaycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgYXNrLnVwZGF0ZVZhbHVlKG1zZyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oJ2JpZHMnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgYmlkcy51cGRhdGVWYWx1ZShtc2cpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1eV9idXR0b24nKS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgncm9vbScsICdFVVItTkxHJyk7XG4gICAgfTtcbn0pO1xuXG5cblxuXG4vL2V4cG9ydHMuc2V0SGVhZGVyID0gdGltZWxpbmVNb2R1bGUuc2V0SGVhZGVyKHVzZXIpO1xuLy9leHBvcnRzLnNldFRpbWVsaW5lID0gdGltZWxpbmVNb2R1bGUuc2V0VGltZWxpbmUodXNlcik7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuanMiLCJ2YXIgY29uZmlnID0ge1xuICAgICdjb3VudF9yb3dfYmlkcyc6IDYsXG4gICAgJ2NvdW50X3Jvd19hc2snOiA2LFxuICAgICdyb29tcyc6IFtcbiAgICAgICAgJ0dUUy1OTEcnLFxuICAgICAgICAnRVVSLU5MRydcbiAgICBdXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljX2h0bWwvanMvY29uZmlnLmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBOzs7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7OztBQUFBOzs7QUFBQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9EQTtBQWlFQTtBQUNBO0FBRUE7Ozs7Ozs7QUMxR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBOzs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQVFBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==