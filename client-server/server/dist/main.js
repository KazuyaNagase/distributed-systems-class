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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/packet.ts":
/*!***********************!*\
  !*** ./src/packet.ts ***!
  \***********************/
/*! exports provided: Layer1, Layer2, Payload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Layer1\", function() { return Layer1; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Layer2\", function() { return Layer2; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Payload\", function() { return Payload; });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\nvar Layer1 = /** @class */ (function () {\n    function Layer1(packet) {\n        this.size = 6;\n        var type = ('0000' + packet[0].toString(16) + packet[1].toString(16)).slice(-4); // 4桁の文字列にする\n        if (type === '0000') {\n            this.type = 'tcp';\n        }\n        else if (type === 'ffff') {\n            this.type = 'udp';\n        }\n        this.version = parseInt(packet[2].toString(16) + packet[3].toString(16));\n        this.ttl = parseInt(packet[4].toString(16) + packet[5].toString(16));\n    }\n    Layer1.prototype.output = function () {\n        console.log('\\n' + '--- layer1 -------------');\n        console.log('type ------ ' + this.type);\n        console.log('version --- ' + this.version);\n        console.log('ttl ------- ' + this.ttl);\n        console.log('--- end ----------------' + '\\n');\n    };\n    return Layer1;\n}());\n\n;\nvar Layer2 = /** @class */ (function () {\n    function Layer2(packet, protocol) {\n        this.size = 4;\n        this.isSafe = true;\n        this.type = packet[0].toString(16) + packet[1].toString(16);\n        this.len = parseInt(packet[2].toString(16) + packet[3].toString(16));\n        if (protocol === 'tcp') {\n            this.digest = ('00000000' +\n                packet[4].toString(16) +\n                packet[5].toString(16) +\n                packet[6].toString(16) +\n                packet[7].toString(16)).slice(-8); // 8桁の文字列にする\n            // ペイロード部分\n            var data = Buffer.from(packet.slice(8, packet.length));\n            var digest = ('00000000' + this.md5hex(data)).slice(-8); // 4桁の文字列にする\n            this.isSafe = (this.digest === digest);\n            this.size += 4;\n        }\n    }\n    Layer2.prototype.output = function () {\n        console.log('\\n' + '--- layer2 -------------');\n        console.log('type ------ ' + this.type);\n        console.log('len ------- ' + this.len);\n        this.digest ? console.log('digest ------- ' + this.digest) : '';\n        console.log('--- end ----------------' + '\\n');\n    };\n    // 文字列からmd5を返す\n    Layer2.prototype.md5hex = function (buf) {\n        var md5hash = crypto__WEBPACK_IMPORTED_MODULE_0__[\"createHash\"]('md5');\n        md5hash.update(buf);\n        return md5hash.digest('hex');\n    };\n    ;\n    return Layer2;\n}());\n\nvar Payload = /** @class */ (function () {\n    function Payload(payload) {\n        this.payload = payload;\n    }\n    Payload.prototype.output = function () {\n        console.log('\\n' + '--- payload -------------');\n        console.log(this.payload);\n        console.log('--- end ----------------' + '\\n');\n    };\n    return Payload;\n}());\n\n\n\n//# sourceURL=webpack:///./src/packet.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _packet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./packet */ \"./src/packet.ts\");\n/* harmony import */ var net__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! net */ \"net\");\n/* harmony import */ var net__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(net__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar server = net__WEBPACK_IMPORTED_MODULE_1__[\"createServer\"]();\nserver.maxConnections = 10;\nvar clients = {};\nvar clientsCounter = 0;\nserver.on('connection', function (socket) {\n    clients[++clientsCounter];\n    console.log('--- client No.' + clientsCounter + ' connection starts ---------------------------');\n    socket.on('data', function (packet) {\n        // layer1をparses\n        var layer1 = new _packet__WEBPACK_IMPORTED_MODULE_0__[\"Layer1\"](packet);\n        layer1.output();\n        // layer2をparse\n        var l2 = packet.slice(layer1.size, packet.length);\n        var layer2 = new _packet__WEBPACK_IMPORTED_MODULE_0__[\"Layer2\"](l2, layer1.type);\n        if (layer2.isSafe) {\n            layer2.output();\n        }\n        else {\n            socket.end(); // チェックサムが正しくない場合には切断する\n            return;\n        }\n        var p = packet.slice(layer1.size + layer2.size, packet.length);\n        var payload = new _packet__WEBPACK_IMPORTED_MODULE_0__[\"Payload\"](p);\n        payload.output();\n        // 切断する\n        socket.end();\n    });\n    socket.on('close', function () {\n        console.log('--- client No.' + clientsCounter + ' connection end ---------------------------');\n        clientsCounter--;\n    });\n});\nserver.on('close', function () {\n    console.log('Server Closed');\n});\nprocess.on('SIGINT', function () {\n    for (var i in clients) {\n        var socket = clients[i].socket;\n        socket.end();\n    }\n    server.close();\n});\nserver.on('listening', function () {\n    var addr = server.address();\n    console.log('Listening Start on Server --- ' + addr.address + '-' + addr.port + '-------------------');\n});\nserver.listen(2434, '127.0.0.1');\n\n\n//# sourceURL=webpack:///./src/server.ts?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");\n\n//# sourceURL=webpack:///external_%22net%22?");

/***/ })

/******/ });