// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"elementScrollWatcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uid = uid;
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * class ElementScrollWatcher
 * @author sanghyun jeung <eyekorea@cttd.co.kr>
 */

/**
 * _x, _y 값을 체크하여 문자열인경우 유효한 값인지, 유효한 값이 아닌경우 px 값(Number)으로 리턴.
 * @param {String|Number} _x left|right|center or pixel number
 * @param {String|Number} _y top|bottom|middle or pixel number
 * @returns {Object} x, y string|number
 */
function checkTargetPosXY(_x, _y) {
  var xPosReg = /left|right|center/g;
  var yPosReg = /top|bottom|middle/g;
  var x = xPosReg.test(_x) ? _x : parseInt(_x, 10);
  var y = yPosReg.test(_y) ? _y : parseInt(_y, 10);
  return {
    x: x,
    y: y
  };
}
/**
 * 난수를 리턴하는 함수.
 * @param {number} len
 * @returns {Number} len 의 값의 자릿수를 갖는 난수를 리턴
 */


function uid(len) {
  len = len || 7;
  return Math.random().toString(35).substr(2, len);
}
/**
 * esw 제어를 위한 클래스
 * 감시 되는 엘리먼트 별로 해당 클래스가 생성됨.
 * @class
 */


var EswItem = /*#__PURE__*/function () {
  /**
   * 클래스 생성시 감시되는 element 와 메인으로 실행되는 클래스 자신을 받음.
   * @constructor EswItem
   * @param {HTMLElement} element 
   * @param {ElementScrollWatcher} root 
   */
  function EswItem(element, root) {
    _classCallCheck(this, EswItem);

    this.id = uid(); // object 체크를 위한 id 난수

    this.element = element;
    this.element.dataset.eswId = this.id; // element 의 개별 셋팅 값이 있는지 체크 하여 저장

    this.datumPointX = function () {
      if (element.dataset.eswCheckX) {
        return checkTargetPosXY(element.dataset.eswCheckX, 0).x;
      } else {
        return root.checkX;
      }

      ;
    }(); // element 의 개별 셋팅 y 값이 있는지 체크 하고 없으면 기본 셋팅값을 저장.


    this.datumPointY = function () {
      if (element.dataset.eswCheckY) {
        return checkTargetPosXY(0, element.dataset.eswCheckY).y;
      } else {
        return root.checkY;
      }

      ;
    }(); // element 의 개별 셋팅 delay 값이 있는지 체크 하고 없으면 기본 셋팅값을 적용.


    this.activeTimer = function () {
      if (element.dataset.eswDelay) {
        return parseInt(element.dataset.eswDelay, 10);
      } else {
        return root.option.activeDelay;
      }
    }();

    this._isIntersecting = false; // 화면에 들어왔는지 유무

    this.timer = null; // 타이머가 지정됨

    this.activeFunction = root.option.active; // 활성화 되었을때 실행될 함수

    this.deActiveFunction = root.option.deActive; // 비활성화 되었을때 실행될 함수

    this.directFunction = root.option.direct; // 대기시간 없이 바로 실행될 함수
  }
  /**
   * 화면안으로 들어오거나 나갔을때 해당 값을 셋팅 할 수 있음.
   * 해당 값이 변경되면, 타이머를 초기화 하고 deActiveFunction 을 실행함.
   * @param {boolean} value 
   */


  _createClass(EswItem, [{
    key: "direct",

    /**
     * 타이머와 상관없이 진입시 실행되는 함수.
     */
    value: function direct() {
      if (this._isIntersecting) {
        this.directFunction && this.directFunction(this.element);
      }
    }
    /**
     * 타이머를 활성화 하고, 함수 실행 준비 상태로 변경.
     * _isIntersecting 이 true 인 경우 최종 activeFunction 를 실행.
     * @method
     */

  }, {
    key: "active",
    value: function active() {
      var _this = this;

      var activeTimer = this.activeTimer;

      if (this.timer === null) {
        this.timer = window.setTimeout(function () {
          if (_this._isIntersecting) {
            _this.activeFunction && _this.activeFunction(_this.element);
          }
        }, activeTimer);
        this.direct();
      }
    }
    /**
     * _isIntersecting 값과 무관하게 강제로 함수 실행을 초기하고,
     * deActiveFunction 을 실행함.
     * @method
     */

  }, {
    key: "deActive",
    value: function deActive() {
      if (this.timer !== null) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      this.deActiveFunction && this.deActiveFunction(this.element);
    }
  }, {
    key: "isIntersecting",
    set: function set(value) {
      if (value !== this._isIntersecting) {
        if (this.timer !== null) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
      }

      if (!value) {
        this.deActiveFunction && this.deActiveFunction(this.element);
      }

      this._isIntersecting = value;
    }
    /**
     * 엘리먼트 개별 기준값 을 대입한 값을 참고하여 화면기준으로 감시되는 엘리면트가 위치하는 Y 값의 백분율
     * @returns {Number} 
     */

  }, {
    key: "percentY",
    get: function get() {
      var element = this.element,
          datumPointY = this.datumPointY;
      var rect = element.getBoundingClientRect();

      var pointY = function () {
        if (typeof datumPointY === 'string') {
          switch (datumPointY) {
            case 'top':
              return 0;

            case 'bottom':
              return rect.height;

            default:
              return rect.height / 2;
          }
        } else {
          return datumPointY;
        }
      }();

      var winHeight = window.innerHeight;
      var y = rect.y + pointY;
      var percentY = (winHeight - y) / winHeight * 100;
      return percentY;
    }
    /**
     * 엘리먼트 개별 기준값 을 대입한 값을 참고하여 화면기준으로 감시되는 엘리면트가 위치하는 X 값의 백분율
     * @returns {Number} 
     */
    // TODO: 개발 필요.

  }, {
    key: "percentX",
    get: function get() {
      var element = this.element,
          datumPointX = this.datumPointX;
      var rect = element.getBoundingClientRect();

      var pointX = function () {
        if (typeof datumPointX === 'string') {
          switch (datumPointX) {
            case 'left':
              return 0;

            case 'right':
              return rect.width;

            default:
              return rect.width / 2;
          }
        } else {
          return datumPointX;
        }
      }();

      var winWidth = window.innerWidth;
      var x = rect.x + pointX;
      var percentX = (winWidth - x) / winWidth * 100;
      return percentX;
    }
  }]);

  return EswItem;
}();
/**
 * string, nodeList, element 를 체크하여, [element] 로 리턴함.
 * @param {String|HTMLElement|NodeList} elements 
 * @returns {Array} [... elements] 
 */


function elementsArray(elements) {
  if (typeof elements === 'string') {
    return Array.from(document.querySelectorAll(elements));
  } else {
    if (elements.length) {
      return Array.from(elements);
    } else {
      if (elements) return [elements];
    }
  }
}
/**
 * ElementScrollWatcher 의 기본 setting 값
 * @namespace defaultSetting
 * @property {Window|HTMLElement} root - 스크롤 이벤트가 바인드 되는 영역.
 * @property {Number} activePercentY   - 진입 체크 시작 포인트 
 * @property {Number} deActivePercentY -  진입 체크 엔드 포인드
 * @property {Number} activePercentX
 * @property {Number} deActivePercentX
 * @property {Number} activeDelay      - 진입시 해당 시간 후 함수 실행됨.
 * @property {Number} threshold        - intersectionObserve 의 threshold 
 * @property {null|function} direct    - 진입했을때 대기 없이 바로 실행 되는 callback
 * @property {null|function} active    - 진입했을때 실행될 callback 
 * @property {null|function} deActive  - 나갔을때 실행될 callback
 * @property {null|function} scroll    - 스크롤 될때 실행될 callback
 * @property {boolean} init            - 최초 init 을 할지 옵션
 * @property {string|number} checkY    - top|middle|bottom|custom number(px),target 의 기준점.
 * @property {string|number} checkX    - left|center|right|custom number(px)
 */


var defaultSetting = {
  root: null,
  activePercentY: 60,
  deActivePercentY: 90,
  activePercentX: 0,
  deActivePercentX: 100,
  activeDelay: 1000,
  threshold: 0.1,
  direct: null,
  active: null,
  deActive: null,
  scroll: null,
  init: true,
  checkY: 'top',
  checkX: 'left'
};
/**
 * 메인 class.
 * 새로운 스크롤 감시자를 생성한다.
 * @class
 */

var ElementScrollWatcher = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {String|HTMLElement|HTMLCollection} elements String = selector ex) `.element` or `#id`
   * @param {Ojbect} setting
   * @param {Window|HTMLElement} setting.root - 스크롤 이벤트가 바인드 되는 영역.
   * @param {Number} setting.activePercentY   - 진입 체크 시작 포인트 
   * @param {Number} setting.deActivePercentY -  진입 체크 엔드 포인드
   * @param {Number} setting.activePercentX
   * @param {Number} setting.deActivePercentX
   * @param {Number} setting.activeDelay     - 진입시 해당 시간 후 함수 실행됨.
   * @param {Number} setting.threshold       - intersectionObserve 의 threshold 
   * @param {null|function} setting.direct   - 진입했을때 대기 없이 바로 실행 되는 callback
   * @param {null|function} setting.active   - 진입했을때 실행될 callback 
   * @param {null|function} setting.deActive - 나갔을때 실행될 callback
   * @param {null|function} setting.scroll   - 스크롤 될때 실행될 callback
   * @param {boolean} setting.init           - 최초 init 을 할지 옵션
   * @param {string|number} setting.checkY   - top|middle|bottom|custom number(px),target 의 기준점.
   * @param {string|number} setting.checkX   - left|center|right|custom number(px)
   */
  function ElementScrollWatcher(elements) {
    var _this2 = this;

    var setting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ElementScrollWatcher);

    // set
    var option = Object.assign({}, defaultSetting, setting);
    ;
    option.root = option.root === null ? window : option.root;
    var items = elementsArray(elements);
    var checkItems = [];
    var eswObject = {};
    var XY = checkTargetPosXY(option.checkX, option.checkY);
    var checkY = XY.y;
    var checkX = XY.x;
    var io = new IntersectionObserver(function (entries) {
      // IO 를 지정.
      entries.forEach(function (entry) {
        var target = entry.target;

        var item = _this2.getEswObj(target);

        item.esw.isIntersecting = entry.isIntersecting; // esw item 의 intersecting 값을 셋팅 한다.
        // 화면에 들어오는 element 는 checkItems 에 넣고,
        // 화면에서 나간 element 는 checkItems 에서 제거함.
        // 스크롤시 loop 가 계속 돌게 되기 때문에 성능을 고려하여...

        if (entry.isIntersecting) {
          _this2.checkItems.push(target);
        } else {
          var index = _this2.checkItems.indexOf(target);

          if (index >= 0) {
            _this2.checkItems.splice(index, 1);
          }
        }
      });
    });
    Object.assign(this, {
      option: option,
      items: items,
      io: io,
      checkItems: checkItems,
      checkY: checkY,
      checkX: checkX,
      eswObject: eswObject,
      isInit: false,
      isDisable: false,
      // 비활성화 유무
      boundMot: null // scroll event 를 저장함.

    });
    option.init && this.init();
  }
  /**
   * element 의 dataset.eswId 값을 체크하여 object 를 리턴함.
   * @param {element} element 
   * @returns {Object} HTMLElement, id, esw object
   */


  _createClass(ElementScrollWatcher, [{
    key: "getEswObj",
    value: function getEswObj(element) {
      var id = element.dataset.eswId;
      var esw = this.eswObject[id];
      return {
        element: element,
        id: id,
        esw: esw
      };
    } // 스크롤시 실행함.

  }, {
    key: "mot",
    value: function mot() {
      var _this3 = this;

      if (this.isDisable) return false;
      var checkItems = this.checkItems,
          option = this.option;
      checkItems.forEach(function (element) {
        var item = _this3.getEswObj(element);

        var itemYPercent = item.esw.percentY;
        var itemXPercent = item.esw.percentX;
        var isIntersecting = item.esw._isIntersecting;
        var isActiveY = option.activePercentY < itemYPercent;
        var isDeActiveY = option.deActivePercentY < itemYPercent;
        var isActiveX = option.activePercentX < itemXPercent;
        var isDeActiveX = option.deActivePercentX < itemXPercent;

        if (isActiveY && isActiveX) {
          if (isDeActiveY || isDeActiveX) {
            item.esw.deActive();
          } else {
            item.esw.active();
          }
        } else {
          item.esw.deActive();
        }
        /**
         * @namespace percent
         * @property {Number} x - x축으로 이동된 양(백분율)
         * @property {Number} y - y축으로 이동된 양(백분율)
         */


        var percent = {
          x: itemXPercent,
          y: itemYPercent
        };
        option.scroll && option.scroll(element, percent, isIntersecting);
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this4 = this;

      var items = this.items,
          io = this.io,
          option = this.option,
          mot = this.mot;
      this.boundMot = mot.bind(this);

      if (!this.isInit) {
        option.root.addEventListener('scroll', this.boundMot, false);
      }

      items.forEach(function (element) {
        if (!element.dataset.eswInit) {
          var esw = new EswItem(element, _this4);
          _this4.eswObject[esw.id] = esw;
          io.observe(element, option.threshold);
          element.dataset.eswInit = 'init';
        }
      });
      this.isInit = true;
      window.addEventListener('load', function () {
        _this4.mot();
      });
      this.mot();
    }
    /**
     * 동적으로 element 가 생성 된 경우 사용.
     * @param {HTMLCollection|HTMLElement|String} elements String = selector ex) `.element` or `#id`
     */

  }, {
    key: "update",
    value: function update(elements) {
      var addItems = elementsArray(elements);
      this.items = this.items.concat(addItems);
      this.init();
    }
  }, {
    key: "disable",
    value: function disable() {
      this.isDisable = true;
    }
  }, {
    key: "enable",
    value: function enable() {
      this.isDisable = false;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var items = this.items,
          io = this.io,
          option = this.option;
      option.root.removeEventListener('scroll', this.boundMot, false);
      items.forEach(function (element) {
        io.unobserve(element);
        delete element.dataset.eswId;
        delete element.dataset.eswInit;
      });
      delete this.boundMot;
      delete this.io;
      delete this.items;
      delete this.checkItems;
      delete this.checkY;
      delete this.checkX;
      delete this.eswObject;
      delete this.isInit;
      delete this.isDisable;
      delete this.option;
      delete this;
    }
  }]);

  return ElementScrollWatcher;
}();

exports.default = ElementScrollWatcher;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _elementScrollWatcher = _interopRequireDefault(require("./elementScrollWatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var esw = new _elementScrollWatcher.default('.esw-element', {
  activePercentY: 60,
  // 진입 체크 시작 포인트 
  deActivePercentY: 98,
  // 진입 체크 엔드 포인드
  activePercentX: 20,
  // 진입 체크 시작 포인트 
  deActivePercentX: 98,
  // 진입 체크 엔드 포인드
  activeDelay: 1000,
  // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1,
  // intersectionObserve 의 threshold 
  direct: function direct(element) {
    var indexElement = element.querySelector('.index');
    indexElement.textContent = "".concat(indexElement.textContent, " inserted !!");
    element.classList.add('direct');
  },
  active: function active(element) {
    element.classList.add('active');
  },
  // 진입했을때 실행될 callback 
  deActive: function deActive(element) {
    var indexElement = element.querySelector('.index');
    indexElement.textContent = indexElement.textContent.replace(' inserted !!', '');
    element.classList.remove('active');
    element.classList.remove('direct');
  },
  // 나갔을때 실행될 callback
  scroll: function scroll(element, percent, isIntersecting) {
    var y = percent.y.toFixed(2);
    var x = percent.x.toFixed(2);
    var percentElement = element.querySelector('.percent');
    var intersectingElement = element.querySelector('.isIntersecting');
    percentElement.textContent = "Y : ".concat(y, "%, X : ").concat(x);
    intersectingElement.textContent = "".concat(isIntersecting); // console.log(element, ypercent, isIntersecting);
  },
  checkY: 'middle'
});
/**
 *
 * @param {string} str
 * @return {HTMLElement}
 */

var stringToHtm = function stringToHtm(str) {
  var domparser = new DOMParser();
  return domparser.parseFromString(str, 'text/html').body.firstChild;
};

var template = function template() {
  return "<div class=\"esw-element\">\n    <span class=\"index\">new</span>\n    <span class=\"percent\">0</span>\n    <span class=\"isIntersecting\">false</span>\n  </div>";
};

var prependBtn = document.querySelector('#prepend');
var updateBtn = document.querySelector('#update');
var disableBtn = document.querySelector('#disable');
var enableBtn = document.querySelector('#enable');
var destroyedBtn = document.querySelector('#destroyed');
var wrapElement = document.querySelector('.wrap');
var rowScrollElement = document.querySelector('#rowScroll');
var eswEvent = esw.mot.bind(esw);
rowScrollElement.addEventListener('scroll', eswEvent);
prependBtn.addEventListener('click', function () {
  var htm = stringToHtm(template());
  wrapElement.prepend(htm);
});
updateBtn.addEventListener('click', function () {
  esw.update('.esw-element');
});
disableBtn.addEventListener('click', function () {
  esw.disable();
});
enableBtn.addEventListener('click', function () {
  esw.enable();
});
destroyedBtn.addEventListener('click', function () {
  esw.destroy();
  console.log(esw);
  rowScrollElement.removeEventListener('scroll', eswEvent);
});
},{"./elementScrollWatcher":"elementScrollWatcher.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56920" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map