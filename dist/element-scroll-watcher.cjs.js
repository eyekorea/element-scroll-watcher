'use strict';

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
  const xPosReg = /left|right|center/g;
  const yPosReg = /top|bottom|middle/g;
  const x = xPosReg.test(_x) ? _x : parseInt(_x, 10);
  const y = yPosReg.test(_y) ? _y : parseInt(_y, 10);
  return { x, y };
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
class EswItem {
  /**
   * 클래스 생성시 감시되는 element 와 메인으로 실행되는 클래스 자신을 받음.
   * @constructor EswItem
   * @param {HTMLElement} element
   * @param {ElementScrollWatcher} root
   */
  constructor(element, root) {
    this.id = uid(); // object 체크를 위한 id 난수
    this.element = element;
    this.element.dataset.eswId = this.id;

    // element 의 개별 셋팅 값이 있는지 체크 하여 저장
    this.datumPointX = (() => {
      if (element.dataset.eswCheckX) {
        return checkTargetPosXY(element.dataset.eswCheckX, 0).x;
      } else {
        return root.checkX;
      }
    })();

    // element 의 개별 셋팅 y 값이 있는지 체크 하고 없으면 기본 셋팅값을 저장.
    this.datumPointY = (() => {
      if (element.dataset.eswCheckY) {
        return checkTargetPosXY(0, element.dataset.eswCheckY).y;
      } else {
        return root.checkY;
      }
    })();
    // element 의 개별 셋팅 delay 값이 있는지 체크 하고 없으면 기본 셋팅값을 적용.
    this.activeTimer = (() => {
      if (element.dataset.eswDelay) {
        return parseInt(element.dataset.eswDelay, 10);
      } else {
        return root.option.activeDelay;
      }
    })();
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
  set isIntersecting(value) {
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
  get percentY() {
    const { element, datumPointY } = this;
    const rect = element.getBoundingClientRect();
    const pointY = (() => {
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
    })();
    const winHeight = window.innerHeight;
    const y = rect.y + pointY;
    const percentY = ((winHeight - y) / winHeight) * 100;
    return percentY;
  }

  /**
   * 엘리먼트 개별 기준값 을 대입한 값을 참고하여 화면기준으로 감시되는 엘리면트가 위치하는 X 값의 백분율
   * @returns {Number}
   */
  // TODO: 개발 필요.
  get percentX() {
    const { element, datumPointX } = this;
    const rect = element.getBoundingClientRect();
    const pointX = (() => {
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
    })();
    const winWidth = window.innerWidth;
    const x = rect.x + pointX;
    const percentX = ((winWidth - x) / winWidth) * 100;
    return percentX;
  }

  /**
   * 타이머와 상관없이 진입시 실행되는 함수.
   */
  direct() {
    if (this._isIntersecting) {
      this.directFunction && this.directFunction(this.element);
    }
  }

  /**
   * 타이머를 활성화 하고, 함수 실행 준비 상태로 변경.
   * _isIntersecting 이 true 인 경우 최종 activeFunction 를 실행.
   * @method
   */
  active() {
    const { activeTimer } = this;
    if (this.timer === null) {
      this.timer = window.setTimeout(() => {
        if (this._isIntersecting) {
          this.activeFunction && this.activeFunction(this.element);
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
  deActive() {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.deActiveFunction && this.deActiveFunction(this.element);
  }
}

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
const defaultSetting = {
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
  checkX: 'left',
};

/**
 * 메인 class.
 * 새로운 스크롤 감시자를 생성한다.
 * @class
 */
class ElementScrollWatcher {
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
  constructor(elements, setting = {}) {
    // set
    const option = Object.assign({}, defaultSetting, setting);
    option.root = option.root === null ? window : option.root;
    const items = elementsArray(elements);
    const checkItems = [];
    const eswObject = {};
    const XY = checkTargetPosXY(option.checkX, option.checkY);
    const checkY = XY.y;
    const checkX = XY.x;
    const io = new IntersectionObserver((entries) => {
      // IO 를 지정.
      entries.forEach((entry) => {
        const target = entry.target;
        const item = this.getEswObj(target);
        item.esw.isIntersecting = entry.isIntersecting; // esw item 의 intersecting 값을 셋팅 한다.

        // 화면에 들어오는 element 는 checkItems 에 넣고,
        // 화면에서 나간 element 는 checkItems 에서 제거함.
        // 스크롤시 loop 가 계속 돌게 되기 때문에 성능을 고려하여...
        if (entry.isIntersecting) {
          this.checkItems.push(target);
        } else {
          const index = this.checkItems.indexOf(target);
          if (index >= 0) {
            this.checkItems.splice(index, 1);
          }
        }
      });
    });

    Object.assign(this, {
      option,
      items,
      io,
      checkItems,
      checkY,
      checkX,
      eswObject,
      isInit: false,
      isDisable: false, // 비활성화 유무
      boundMot: null, // scroll event 를 저장함.
    });
    option.init && this.init();
  }

  /**
   * element 의 dataset.eswId 값을 체크하여 object 를 리턴함.
   * @param {element} element
   * @returns {Object} HTMLElement, id, esw object
   */
  getEswObj(element) {
    const id = element.dataset.eswId;
    const esw = this.eswObject[id];
    return { element, id, esw };
  }

  // 스크롤시 실행함.
  mot() {
    if (this.isDisable) return false;
    const { checkItems, option } = this;
    checkItems.forEach((element) => {
      const item = this.getEswObj(element);
      const itemYPercent = item.esw.percentY;
      const itemXPercent = item.esw.percentX;
      const isIntersecting = item.esw._isIntersecting;

      const isActiveY = option.activePercentY < itemYPercent;
      const isDeActiveY = option.deActivePercentY < itemYPercent;
      const isActiveX = option.activePercentX < itemXPercent;
      const isDeActiveX = option.deActivePercentX < itemXPercent;

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
      const percent = {
        x: itemXPercent,
        y: itemYPercent,
      };
      option.scroll && option.scroll(element, percent, isIntersecting);
    });
  }

  init() {
    const { items, io, option, mot } = this;
    this.boundMot = mot.bind(this);
    if (!this.isInit) {
      option.root.addEventListener('scroll', this.boundMot, false);
    }

    items.forEach((element) => {
      if (!element.dataset.eswInit) {
        const esw = new EswItem(element, this);
        this.eswObject[esw.id] = esw;
        io.observe(element, option.threshold);
        element.dataset.eswInit = 'init';
      }
    });
    this.isInit = true;
    window.addEventListener('load', () => {
      this.mot();
    });
    this.mot();
  }

  /**
   * 동적으로 element 가 생성 된 경우 사용.
   * @param {HTMLCollection|HTMLElement|String} elements String = selector ex) `.element` or `#id`
   */
  update(elements) {
    const addItems = elementsArray(elements);
    this.items = this.items.concat(addItems);
    this.init();
  }
  disable() {
    this.isDisable = true;
  }
  enable() {
    this.isDisable = false;
  }
  destroy() {
    const { items, io, option } = this;
    option.root.removeEventListener('scroll', this.boundMot, false);
    items.forEach((element) => {
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
  }
}

module.exports = ElementScrollWatcher;
