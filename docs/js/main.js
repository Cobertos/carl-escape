(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["partyPerson"] = factory();
	else
		root["partyPerson"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/data/story/index.js":
/*!*********************************!*\
  !*** ./src/data/story/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _story1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./story1.js */ "./src/data/story/story1.js");
/* harmony import */ var _story2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./story2.js */ "./src/data/story/story2.js");
/* harmony import */ var _story3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./story3.js */ "./src/data/story/story3.js");
/* harmony import */ var _story4_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./story4.js */ "./src/data/story/story4.js");
/* harmony import */ var _story5_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./story5.js */ "./src/data/story/story5.js");





/* harmony default export */ __webpack_exports__["default"] = ({
  story1: _story1_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  story2: _story2_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  story3: _story3_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  story4: _story4_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  story5: _story5_js__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/data/story/story1.js":
/*!**********************************!*\
  !*** ./src/data/story/story1.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  scene_1: {
    big: 'data',
    must: 'match Jame\'s data structure'
  }
});

/***/ }),

/***/ "./src/data/story/story2.js":
/*!**********************************!*\
  !*** ./src/data/story/story2.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  scene_1: {
    big: 'data',
    must: 'match Jame\'s data structure'
  }
});

/***/ }),

/***/ "./src/data/story/story3.js":
/*!**********************************!*\
  !*** ./src/data/story/story3.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  scene_1: {
    big: 'data',
    must: 'match Jame\'s data structure'
  }
});

/***/ }),

/***/ "./src/data/story/story4.js":
/*!**********************************!*\
  !*** ./src/data/story/story4.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  scene_1: {
    big: 'data',
    must: 'match Jame\'s data structure'
  }
});

/***/ }),

/***/ "./src/data/story/story5.js":
/*!**********************************!*\
  !*** ./src/data/story/story5.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  scene_1: {
    big: 'data',
    must: 'match Jame\'s data structure'
  }
});

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_story__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/story */ "./src/data/story/index.js");

console.log("We did it reddit", _data_story__WEBPACK_IMPORTED_MODULE_0__["default"].story1.scene_1.big);

/***/ })

/******/ });
});
//# sourceMappingURL=main.js.map