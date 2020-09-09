/**
 * 
 * @param {*} _x /left|right|center/ or pixel number
 * @param {*} _y /top|bottom|middle/ or pixel number
 * _x, _y 값을 체크하여 문자열인경우 유효한 값인지, 유효한 값이 아닌경우 px 값으로 리턴.
 */
function checkTargetPosXY(_x, _y){
  const xPosReg = /left|right|center/g;
  const yPosReg = /top|bottom|middle/g; 
  const x = (xPosReg.test(_x)) ? _x : parseInt(_x, 10);
  const y = (yPosReg.test(_y)) ? _y : parseInt(_y, 10);
  return {x, y};
}

/**
 *
 * @param {number} len
 * number 값의 자릿수를 갖는 난수를 리턴
 */
export function uid(len) {
  len = len || 7;
  return Math.random()
    .toString(35)
    .substr(2, len);
}

/**
 * esw 제어를 위한 클래스
 * 감시 되는 엘리먼트 별로 해당 클래스가 생성됨.
 */
class ESW_ITEM {
  constructor(element, root){
    this.id = uid(); // object 체크를 위한 id 난수
    this.element = element;
    this.element.dataset['eswId'] = this.id; 

    // element 의 개별 셋팅 값이 있는지 체크 하여 저장
    this.datumPointX = (()=>{
      if( element.dataset['eswCheckX'] ) {
        return checkTargetPosXY(element.dataset['eswCheckX'], 0).x;
      } else {
        return root.checkX;
      };
    })();

    // element 의 개별 셋팅 값이 있는지 체크 하여 저장
    this.datumPointY = (()=>{
      if( element.dataset['eswCheckX'] ) {
        return checkTargetPosXY(0, element.dataset['eswCheckY']).y;
      } else {
        return root.checkY;
      };
    })();

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
  set setIntersecting(value){
    if( value !== this.isIntersecting ){
      if( this.timer !== null ){
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    }
    if( !value ){
      this.deActiveFunction(this.element);
    }
    this.isIntersecting = value;
  }
  
  // 화면을 기준으로 element 가 몇퍼센트에 위치하는지 리턴함.
  // 엘리먼트 개별 기준값 을 대입한 값.
  get getPercentY(){
    const { element, datumPointY } = this;
    const rect = element.getBoundingClientRect();
    const pointY = (()=>{
      if( typeof datumPointY === 'string' ) {
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
    const percentY = (winHeight - y) / winHeight * 100;
    return percentY;
  }

  // 화면을 기준으로 element 가 몇퍼센트에 위치하는지 리턴함.
  // 엘리먼트 개별 기준값 을 대입한 값.
  get getPercentX(){
    const { element, datumPointX } = this;
    const rect = element.getBoundingClientRect();
    const pointX = (()=>{
      if( typeof datumPointX === 'string' ) {
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
    })();
    const winWidth = window.innerWidth;
    const x = rect.x + pointX;
    const percentX = (winWidth - x) / winWidth * 100;
    return percentX;
  }

  // 타이머를 활성화 하고, 함수 실행 준비 상태로 변경.
  // isIntersecting 이 true 인 경우 최종 activeFunction 를 실행.
  active(){
    if( this.timer === null ){
      this.timer = window.setTimeout(()=>{
        if( this.isIntersecting ){
          this.activeFunction(this.element);
        }
      }, this.activeTimer);
    }
  }

  // isIntersecting 값과 무관하게 강제로 함수 실행을 초기하고,
  // deActiveFunction 을 실행함.
  deActive(){
    if( this.timer !== null ){
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.deActiveFunction(this.element);
  }
}

/**
 * 
 * @param {*} elements 
 * string, nodeList, element 를 체크하여, [element] 로 리턴함.
 */
function elementsArray(elements){
  if( typeof elements === 'string' ){
    return Array.from(document.querySelectorAll(elements));
  } else {
    if( elements.length ) {
      return Array.from(elements);
    } else {
      if( elements ) return [elements]
    }
  }
}



class ESW {
  constructor(elements, set){
    // set
    const option = set;
    option.root = set.root === null ? window : set.root
    const items = elementsArray(elements);
    const checkItems = [];
    const eswObject = {};
    const XY = checkTargetPosXY(set.checkX, set.checkY);
    const checkY = XY.y;
    const checkX = XY.x;
    const io = new IntersectionObserver(entries=>{ // IO 를 지정.
      entries.forEach(entry => {
        const target = entry.target;
        const item = this.getEswObj(target);
        item.esw.setIntersecting = entry.isIntersecting; // esw item 의 intersecting 값을 셋팅 한다.

        // 화면에 들어오는 element 는 checkItems 에 넣고,
        // 화면에서 나간 element 는 checkItems 에서 제거함.
        // 스크롤시 loop 가 계속 돌게 되기 때문에 성능을 고려하여...
        if( entry.isIntersecting ){
          this.checkItems.push(target);
        } else {
          const index = this.checkItems.indexOf( target );
          if( index >= 0 ){
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
      isInit : false
    });
    option.init && this.init();
  }

  /**
   * 
   * @param {element} element 
   * element 의 dataset.eswId 값을 체크하여 object 를 리턴함.
   * 없을 경우의 수는 없다....
   */
  getEswObj(element){
    const id = element.dataset['eswId'];
    const esw = this.eswObject[id];
    return {element, id, esw};
  }

  // 스크롤시 실행함.
  mot(){
    const { checkItems , option } = this;
    checkItems.forEach(element => {
      const item = this.getEswObj(element);
      const itemYPercent = item.esw.getPercentY;
      
      if( option.activePercentY < itemYPercent ){
        if(option.deActivePercentY < itemYPercent ) {
          item.esw.deActive();
        } else {
          item.esw.active();
        }
      } else {
        item.esw.deActive();
      }
    });
  }

  init(){
    const { items, io, option } = this;
    if( !this.isInit ) {
      option.root.addEventListener('scroll', ()=>{
        this.mot();
      });
    }

    items.forEach(element => {
      if( !element.dataset['eswInit'] ){
        const esw = new ESW_ITEM(element, this);
        this.eswObject[esw.id] = esw;
        io.observe(element, option.threshold);
        element.dataset['eswInit'] = 'init'
      }
    })
    this.isInit = true;
    window.addEventListener('load', ()=>{
      this.mot();  
    });
    this.mot();
  }

  // 동적으로 element 가 생성 된 경우 사용.
  update(elements){
    const addItems = elementsArray(elements);
    this.items = this.items.concat(addItems);
    this.init();
  }
  disable(){
    
  }
  enable(){

  }
  destroyed(){
    
  }
}

const defaultSetting = {
  root: null, // scroll event bind element
  activePercentY: 60, // 진입 체크 시작 포인트 
  deActivePercentY : 90, // 진입 체크 엔드 포인드
  activePercentX: 0,
  deActivePercentX : 100,
  activeDelay: 1000, // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1, // intersectionObserve 의 threshold 
  active: null, // 진입했을때 실행될 callback 
  deActive: null, // 나갔을때 실행될 callback
  init: true, // 최초 init 을 할지 옵션
  checkY: 'top', // top, middle, bottom, custom number(px) , target 의 기준점.
  checkX: 'left' // left, center, right, custom number(px)
}

function ElementScrollWatcher(elements, setting={}){
  const set = Object.assign({}, defaultSetting, setting);
  return new ESW(elements, set);
}

export default ElementScrollWatcher;