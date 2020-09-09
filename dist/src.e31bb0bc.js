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
 * 
 * @param {*} _x /left|right|center/ or pixel number
 * @param {*} _y /top|bottom|middle/ or pixel number
 * _x, _y 값을 체크하여 문자열인경우 유효한 값인지, 유효한 값이 아닌경우 px 값으로 리턴.
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
 *
 * @param {number} len
 * number 값의 자릿수를 갖는 난수를 리턴
 */


function uid(len) {
  len = len || 7;
  return Math.random().toString(35).substr(2, len);
}
/**
 * esw 제어를 위한 클래스
 * 감시 되는 엘리먼트 별로 해당 클래스가 생성됨.
 */


var ESW_ITEM = /*#__PURE__*/function () {
  function ESW_ITEM(element, root) {
    _classCallCheck(this, ESW_ITEM);

    this.id = uid(); // object 체크를 위한 id 난수

    this.element = element;
    this.element.dataset['eswId'] = this.id; // element 의 개별 셋팅 값이 있는지 체크 하여 저장

    this.datumPointX = function () {
      if (element.dataset['eswCheckX']) {
        return checkTargetPosXY(element.dataset['eswCheckX'], 0).x;
      } else {
        return root.checkX;
      }

      ;
    }(); // element 의 개별 셋팅 값이 있는지 체크 하여 저장


    this.datumPointY = function () {
      if (element.dataset['eswCheckX']) {
        return checkTargetPosXY(0, element.dataset['eswCheckY']).y;
      } else {
        return root.checkY;
      }

      ;
    }();

    this.activeTimer = root.option.activeDelay; // 딜레이시간

    this.isIntersecting = false; // 화면에 들어왔는지 유무

    this.timer = null; // 타이머가 지정됨

    this.activeFunction = root.option.active; // 활성화 되었을때 실행될 함수

    this.deActiveFunction = root.option.deActive; // 비활성화 되었을때 실행될 함수
  }
  /**
   * @param {boolean} value
   * 화면안으로 들어오거나 나갔을때 해당 값을 셋팅 할 수 있음.
   * 들어왔을 경우 true
   * 나갔을 경우 false
   * 해당 값이 변경되면, 타이머를 초기화 하고 deActiveFunction 을 실행함.
   */


  _createClass(ESW_ITEM, [{
    key: "active",
    // 타이머를 활성화 하고, 함수 실행 준비 상태로 변경.
    // isIntersecting 이 true 인 경우 최종 activeFunction 를 실행.
    value: function active() {
      var _this = this;

      if (this.timer === null) {
        this.timer = window.setTimeout(function () {
          if (_this.isIntersecting) {
            _this.activeFunction(_this.element);
          }
        }, this.activeTimer);
      }
    } // isIntersecting 값과 무관하게 강제로 함수 실행을 초기하고,
    // deActiveFunction 을 실행함.

  }, {
    key: "deActive",
    value: function deActive() {
      if (this.timer !== null) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      this.deActiveFunction(this.element);
    }
  }, {
    key: "setIntersecting",
    set: function set(value) {
      if (value !== this.isIntersecting) {
        if (this.timer !== null) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
      }

      if (!value) {
        this.deActiveFunction(this.element);
      }

      this.isIntersecting = value;
    } // 화면을 기준으로 element 가 몇퍼센트에 위치하는지 리턴함.
    // 엘리먼트 개별 기준값 을 대입한 값.

  }, {
    key: "getPercentY",
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
    } // 화면을 기준으로 element 가 몇퍼센트에 위치하는지 리턴함.
    // 엘리먼트 개별 기준값 을 대입한 값.

  }, {
    key: "getPercentX",
    get: function get() {
      var element = this.element,
          datumPointX = this.datumPointX;
      var rect = element.getBoundingClientRect();

      var pointX = function () {
        if (typeof datumPointX === 'string') {
          switch (datumPointX) {
            case 'top':
              return 0;

            case 'bottom':
              return rect.height;

            default:
              return rect.height / 2;
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

  return ESW_ITEM;
}();
/**
 * 
 * @param {*} elements 
 * string, nodeList, element 를 체크하여, [element] 로 리턴함.
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

var ESW = /*#__PURE__*/function () {
  function ESW(elements, set) {
    var _this2 = this;

    _classCallCheck(this, ESW);

    // set
    var option = set;
    option.root = set.root === null ? window : set.root;
    var items = elementsArray(elements);
    var checkItems = [];
    var eswObject = {};
    var XY = checkTargetPosXY(set.checkX, set.checkY);
    var checkY = XY.y;
    var checkX = XY.x;
    var io = new IntersectionObserver(function (entries) {
      // IO 를 지정.
      entries.forEach(function (entry) {
        var target = entry.target;

        var item = _this2.getEswObj(target);

        item.esw.setIntersecting = entry.isIntersecting; // esw item 의 intersecting 값을 셋팅 한다.
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
      isInit: false
    });
    option.init && this.init();
  }
  /**
   * 
   * @param {element} element 
   * element 의 dataset.eswId 값을 체크하여 object 를 리턴함.
   * 없을 경우의 수는 없다....
   */


  _createClass(ESW, [{
    key: "getEswObj",
    value: function getEswObj(element) {
      var id = element.dataset['eswId'];
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

      var checkItems = this.checkItems,
          option = this.option;
      checkItems.forEach(function (element) {
        var item = _this3.getEswObj(element);

        var itemYPercent = item.esw.getPercentY;

        if (option.activePercentY < itemYPercent) {
          if (option.deActivePercentY < itemYPercent) {
            item.esw.deActive();
          } else {
            item.esw.active();
          }
        } else {
          item.esw.deActive();
        }
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this4 = this;

      var items = this.items,
          io = this.io,
          option = this.option;

      if (!this.isInit) {
        option.root.addEventListener('scroll', function () {
          _this4.mot();
        });
      }

      items.forEach(function (element) {
        if (!element.dataset['eswInit']) {
          var esw = new ESW_ITEM(element, _this4);
          _this4.eswObject[esw.id] = esw;
          io.observe(element, option.threshold);
          element.dataset['eswInit'] = 'init';
        }
      });
      this.isInit = true;
      window.addEventListener('load', function () {
        _this4.mot();
      });
      this.mot();
    } // 동적으로 element 가 생성 된 경우 사용.

  }, {
    key: "update",
    value: function update(elements) {
      var addItems = elementsArray(elements);
      this.items = this.items.concat(addItems);
      this.init();
    }
  }, {
    key: "disable",
    value: function disable() {}
  }, {
    key: "enable",
    value: function enable() {}
  }, {
    key: "destroyed",
    value: function destroyed() {}
  }]);

  return ESW;
}();

var defaultSetting = {
  root: null,
  // scroll event bind element
  activePercentY: 60,
  // 진입 체크 시작 포인트 
  deActivePercentY: 90,
  // 진입 체크 엔드 포인드
  activePercentX: 0,
  deActivePercentX: 100,
  activeDelay: 1000,
  // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1,
  // intersectionObserve 의 threshold 
  active: null,
  // 진입했을때 실행될 callback 
  deActive: null,
  // 나갔을때 실행될 callback
  init: true,
  // 최초 init 을 할지 옵션
  checkY: 'top',
  // top, middle, bottom, custom number(px) , target 의 기준점.
  checkX: 'left' // left, center, right, custom number(px)

};

function ElementScrollWatcher(elements) {
  var setting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var set = Object.assign({}, defaultSetting, setting);
  return new ESW(elements, set);
}

var _default = ElementScrollWatcher;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _elementScrollWatcher = _interopRequireDefault(require("./elementScrollWatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var esw = new _elementScrollWatcher.default('.esw-element', {
  activePercentY: 60,
  // 진입 체크 시작 포인트 
  deActivePercentY: 90,
  // 진입 체크 엔드 포인드
  activeDelay: 1000,
  // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1,
  // intersectionObserve 의 threshold 
  active: function active(element) {
    element.classList.add('active');
  },
  // 진입했을때 실행될 callback 
  deActive: function deActive(element) {
    element.classList.remove('active');
  } // 나갔을때 실행될 callback

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59651" + '/');

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