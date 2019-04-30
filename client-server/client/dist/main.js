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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _packet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./packet */ \"./src/packet.ts\");\n/* harmony import */ var net__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! net */ \"net\");\n/* harmony import */ var net__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(net__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n// 引数を受け取る\nvar protocol = process.argv[2];\nvar fileName = process.argv[3];\n// バイナリ形式ファイルを読み込む\n// nodeのfs(file system)にbinary modeが見つからなかったため、ホストのbashを実行、xxd -p 'fileName'の出力を受け取る\nvar execStr = child_process__WEBPACK_IMPORTED_MODULE_2__[\"execSync\"]('xxd -p resource/' + fileName).toString();\n// 1024バイト以上を切り捨てる\nvar str = execStr.slice(0, 1024 * 2);\nvar socket = new net__WEBPACK_IMPORTED_MODULE_1__[\"Socket\"]();\n// 送信するpacketを作成\nvar packet = new _packet__WEBPACK_IMPORTED_MODULE_0__[\"Packet\"](protocol, str);\n// const L1Data = packet.createL1Header(protocol);\n// const L2Data = packet.createL2Header(protocol, binary);\n// ヘッダとデータを結合\nvar data = packet.createCombData();\n// port: 2434, localhostに接続\nsocket.connect(2434, 'localhost', function () {\n    console.log('--- connected to server ----------------------');\n    socket.write(''); // あとで書き換える\n});\n// データを送信\nsocket.on('data', function () {\n    console.log('Response -> received');\n});\n// コネクションを切断\nsocket.on('close', function () {\n    console.log('socket-> connection is closed');\n});\n\n\n//# sourceURL=webpack:///./src/client.ts?");

/***/ }),

/***/ "./src/packet.ts":
/*!***********************!*\
  !*** ./src/packet.ts ***!
  \***********************/
/*! exports provided: Packet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Packet\", function() { return Packet; });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\nvar Packet = /** @class */ (function () {\n    function Packet(protocol, binary) {\n        // レイヤ1の情報\n        this.layer1 = new layer1(protocol);\n        // レイヤ2の情報\n        this.layer2 = new layer2(protocol, binary);\n        // ペイロード部分\n        this.data = Uint8Array.from(Buffer.from(binary, 'hex'));\n        // 結合後のデータの長さを確保\n        this.combData = new Uint8Array(this.layer1.size + this.layer2.size + this.data.length);\n    }\n    Packet.prototype.createCombData = function () {\n        var pos = 0;\n        pos = this.combL1(pos);\n        pos = this.combL2(pos);\n        this.pushToComData(this.data, pos);\n        console.log(this.combData);\n    };\n    Packet.prototype.combL1 = function (pos) {\n        pos = this.pushToComData(this.layer1.type, pos);\n        pos = this.pushToComData(this.layer1.version, pos);\n        pos = this.pushToComData(this.layer1.ttl, pos);\n        return pos;\n    };\n    Packet.prototype.combL2 = function (pos) {\n        pos = this.pushToComData(this.layer2.type, pos);\n        pos = this.pushToComData(this.layer2.len, pos);\n        if (this.layer2.digest) {\n            pos = this.pushToComData(this.layer2.digest, pos);\n        }\n        return pos;\n    };\n    // 引数に渡したUint8Arrayのデータを後ろにくっつける\n    Packet.prototype.pushToComData = function (segments, pos) {\n        var sumLength = segments.length * Uint8Array.BYTES_PER_ELEMENT;\n        this.combData.set(segments, pos);\n        return pos + sumLength;\n    };\n    return Packet;\n}());\n\nvar layer1 = /** @class */ (function () {\n    function layer1(protocol) {\n        this.size = 6;\n        this.version = Uint8Array.from([0x00, 0x05]);\n        this.ttl = new Uint8Array(2);\n        // protocolでtypeをTCP(0000)/UDP(FFFF)を設定する\n        switch (protocol) {\n            case 'tcp':\n            case 'TCP':\n                this.type = Uint8Array.from([0x00, 0x00]);\n                break;\n            case 'udp':\n            case 'UDP':\n                this.type = Uint8Array.from([0xff, 0xff]);\n                break;\n        }\n    }\n    return layer1;\n}());\nvar layer2 = /** @class */ (function () {\n    function layer2(protocol, binary) {\n        this.size = 6;\n        this.type = Uint8Array.from([0xdd, 0xdd]); // L3(Data)のタイプにDDDDを設定\n        var len = ('0000' + binary.length.toString(16)).slice(-4); // 4桁の文字列にする\n        this.len = Uint8Array.from([parseInt(len.slice(0, 2), 16), parseInt(len.slice(2, 4), 16)]); // 前半後半で切り分けて格納\n        // プロトコルがTCPの場合にはmd5を設定する\n        switch (protocol) {\n            case 'tcp':\n            case 'TCP':\n                var digest = ('0000' + this.md5hex(binary)).slice(-4); // 4桁の文字列にする\n                this.digest = Uint8Array.from([parseInt(digest.slice(0, 2), 16), parseInt(digest.slice(2, 4), 16)]); // 前半後半で切り分けて格納\n                this.size += 6;\n                break;\n        }\n    }\n    // 文字列からmd5を返す\n    layer2.prototype.md5hex = function (src) {\n        var md5hash = crypto__WEBPACK_IMPORTED_MODULE_0__[\"createHash\"]('md5');\n        md5hash.update(src, 'utf8');\n        return md5hash.digest('hex');\n    };\n    ;\n    return layer2;\n}());\n;\n\n\n//# sourceURL=webpack:///./src/packet.ts?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"child_process\");\n\n//# sourceURL=webpack:///external_%22child_process%22?");

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