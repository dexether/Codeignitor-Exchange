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
/***/ (function(module, exports, __webpack_require__) {

function updateTable(element, objectValue) {
    for (var i = 0; i < objectValue.length; i++) {
        var elem = objectValue[i];
        var bid = '<tr><td>' + Math.round(elem['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(elem['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + elem['size(ngl)'] + '</td>\n\
                        <td>' + elem['bid(btc)'] + '</td></tr>';
        $(element).find('tr:eq( ' + (i + 2) + ')').replaceWith(bid);
    }
    ;
}

function createTable(element) {
    var messageTemplate = __webpack_require__(1);
    $(element).find('tbody').html('').append(messageTemplate);
}

module.exports = {
    createTable: createTable,
    updateTable: updateTable
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<tr></tr><th>Sum</th><th>Total</th><th>Size (NLG)</th><th>Bid (BTC)</th><tr class=\"row-0\"><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr class=\"row-1\"><td>1</td><td>1</td><td>2</td><td>3</td></tr><tr class=\"row-2\"><td>2</td><td>1</td><td>2</td><td>3</td></tr><tr class=\"row-3\"><td>3</td><td>1</td><td>2</td><td>3</td></tr><tr class=\"row-4\"><td>4</td><td>1</td><td>2</td><td>3</td></tr><tr class=\"row-5\"><td>5</td><td>1</td><td>2</td><td>3</td></tr>"

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_createTable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_createTable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__services_createTable__);


console.log('sc is working');
if (!window.WebSocket) {
    alert('our browser does not support WebSocket.');
}



__WEBPACK_IMPORTED_MODULE_0__services_createTable___default.a.createTable($('#table-bids'));
__WEBPACK_IMPORTED_MODULE_0__services_createTable___default.a.createTable($('#table-ask'));

var pathname = window.location.pathname;
console.log(pathname);

// create connection
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('ask', function (msg) {
        __WEBPACK_IMPORTED_MODULE_0__services_createTable___default.a.updateTable($('#table-ask'), msg);
    });

    socket.on('bids', function (msg) {
        __WEBPACK_IMPORTED_MODULE_0__services_createTable___default.a.updateTable($('#table-bids'), msg);
    });

    document.querySelector('#buy_button').onclick = function () {
        socket.emit('room', 'EUR-NLG');
    };
});

//exports.setHeader = timelineModule.setHeader(user);
//exports.setTimeline = timelineModule.setTimeline(user);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LXNlcnZpY2UuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzhlNTJmY2FhZGFlMGQ0NTUzZjQiLCJ3ZWJwYWNrOi8vL3B1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc2VydmljZXMvdGVtcGxhdGUtdGFibGUucHVnIiwid2VicGFjazovLy9wdWJsaWNfaHRtbC9qcy9zb2NrZXQuaW8vc29ja2V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpY19odG1sL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM4ZTUyZmNhYWRhZTBkNDU1M2Y0IiwiZnVuY3Rpb24gdXBkYXRlVGFibGUoZWxlbWVudCwgb2JqZWN0VmFsdWUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbGVtID0gb2JqZWN0VmFsdWVbaV07XG4gICAgICAgIHZhciBiaWQgPSAnPHRyPjx0ZD4nICsgTWF0aC5yb3VuZChlbGVtWydzdW0nXSAqIDEwMDAwKSAvIDEwMDAwICsgJzwvdGQ+XFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4nICsgTWF0aC5yb3VuZChlbGVtWyd0b3RhbCddICogMTAwMDApIC8gMTAwMDAgKyAnPC90ZD5cXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPicgKyBlbGVtWydzaXplKG5nbCknXSArICc8L3RkPlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JyArIGVsZW1bJ2JpZChidGMpJ10gKyAnPC90ZD48L3RyPic7XG4gICAgICAgICQoZWxlbWVudCkuZmluZCgndHI6ZXEoICcgKyAoaSArIDIpICsgJyknKS5yZXBsYWNlV2l0aChiaWQpO1xuICAgIH1cbiAgICA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhYmxlKGVsZW1lbnQpIHtcbiAgICB2YXIgbWVzc2FnZVRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZS10YWJsZS5wdWcnKTtcbiAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgICAuZmluZCgndGJvZHknKVxuICAgICAgICAgICAgLmh0bWwoJycpXG4gICAgICAgICAgICAuYXBwZW5kKG1lc3NhZ2VUZW1wbGF0ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZVRhYmxlOiBjcmVhdGVUYWJsZSxcbiAgICB1cGRhdGVUYWJsZTogdXBkYXRlVGFibGVcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zZXJ2aWNlcy9jcmVhdGVUYWJsZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8dHI+PC90cj48dGg+U3VtPC90aD48dGg+VG90YWw8L3RoPjx0aD5TaXplIChOTEcpPC90aD48dGg+QmlkIChCVEMpPC90aD48dHIgY2xhc3M9XFxcInJvdy0wXFxcIj48dGQ+MDwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj48dHIgY2xhc3M9XFxcInJvdy0xXFxcIj48dGQ+MTwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj48dHIgY2xhc3M9XFxcInJvdy0yXFxcIj48dGQ+MjwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj48dHIgY2xhc3M9XFxcInJvdy0zXFxcIj48dGQ+MzwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj48dHIgY2xhc3M9XFxcInJvdy00XFxcIj48dGQ+NDwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj48dHIgY2xhc3M9XFxcInJvdy01XFxcIj48dGQ+NTwvdGQ+PHRkPjE8L3RkPjx0ZD4yPC90ZD48dGQ+MzwvdGQ+PC90cj5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljX2h0bWwvanMvc29ja2V0LmlvL3NlcnZpY2VzL3RlbXBsYXRlLXRhYmxlLnB1Z1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbmNvbnNvbGUubG9nKCdzYyBpcyB3b3JraW5nJyk7XG5pZiAoIXdpbmRvdy5XZWJTb2NrZXQpIHtcbiAgICBhbGVydCgnb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJTb2NrZXQuJyk7XG59XG5cbmltcG9ydCB0YWJsZSBmcm9tICcuL3NlcnZpY2VzL2NyZWF0ZVRhYmxlJztcblxudGFibGUuY3JlYXRlVGFibGUoJCgnI3RhYmxlLWJpZHMnKSk7XG50YWJsZS5jcmVhdGVUYWJsZSgkKCcjdGFibGUtYXNrJykpO1xuXG52YXIgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5jb25zb2xlLmxvZyhwYXRobmFtZSk7XG5cbi8vIGNyZWF0ZSBjb25uZWN0aW9uXG52YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyk7XG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKCdhc2snLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRhYmxlLnVwZGF0ZVRhYmxlKCQoJyN0YWJsZS1hc2snKSwgbXNnKTtcbiAgICB9KTtcbiAgICBcbiAgICBzb2NrZXQub24oJ2JpZHMnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRhYmxlLnVwZGF0ZVRhYmxlKCQoJyN0YWJsZS1iaWRzJyksIG1zZyk7XG4gICAgfSk7XG4gICAgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1eV9idXR0b24nKS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgncm9vbScsICdFVVItTkxHJyk7XG4gICAgfTtcbn0pO1xuXG5cblxuXG4vL2V4cG9ydHMuc2V0SGVhZGVyID0gdGltZWxpbmVNb2R1bGUuc2V0SGVhZGVyKHVzZXIpO1xuLy9leHBvcnRzLnNldFRpbWVsaW5lID0gdGltZWxpbmVNb2R1bGUuc2V0VGltZWxpbmUodXNlcik7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpY19odG1sL2pzL3NvY2tldC5pby9zb2NrZXQuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBOzs7Ozs7QUNwQkE7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=