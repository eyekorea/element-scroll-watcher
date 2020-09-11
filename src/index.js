import ElementScrollWatcher from './elementScrollWatcher'

const esw = new ElementScrollWatcher('.esw-element',{
  activePercentY: 60, // 진입 체크 시작 포인트 
  deActivePercentY : 98, // 진입 체크 엔드 포인드
  activePercentX: 20, // 진입 체크 시작 포인트 
  deActivePercentX : 98, // 진입 체크 엔드 포인드
  activeDelay: 1000, // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1, // intersectionObserve 의 threshold 
  direct: element=>{
    const indexElement = element.querySelector('.index');
    indexElement.textContent = `${indexElement.textContent} inserted !!`;
    element.classList.add('direct');
  },
  active: element=>{
    element.classList.add('active');
  }, // 진입했을때 실행될 callback 
  deActive: element=>{
    const indexElement = element.querySelector('.index');
    indexElement.textContent = indexElement.textContent.replace(' inserted !!', '');
    element.classList.remove('active');
    element.classList.remove('direct');
  }, // 나갔을때 실행될 callback
  scroll(element, percent, isIntersecting){
    const y = percent.y.toFixed(2);
    const x = percent.x.toFixed(2);
    const percentElement = element.querySelector('.percent');
    const intersectingElement = element.querySelector('.isIntersecting');
    percentElement.textContent = `Y : ${y}%, X : ${x}`;
    intersectingElement.textContent = `${isIntersecting}`;

    // console.log(element, ypercent, isIntersecting);
  },
  checkY: 'middle'
});
/**
 *
 * @param {string} str
 * @return {HTMLElement}
 */
const stringToHtm = str => {
  const domparser = new DOMParser();

  return domparser.parseFromString(str, 'text/html').body.firstChild;
};

const template = ()=>{
  return `<div class="esw-element">
    <span class="index">new</span>
    <span class="percent">0</span>
    <span class="isIntersecting">false</span>
  </div>`
}
const prependBtn = document.querySelector('#prepend');
const updateBtn = document.querySelector('#update');
const disableBtn = document.querySelector('#disable');
const enableBtn = document.querySelector('#enable');
const destroyedBtn = document.querySelector('#destroyed');
const wrapElement = document.querySelector('.wrap');
const rowScrollElement = document.querySelector('#rowScroll');
const eswEvent = esw.mot.bind(esw);
rowScrollElement.addEventListener('scroll', eswEvent);

prependBtn.addEventListener('click',()=>{
  const htm = stringToHtm(template());
  wrapElement.prepend(htm);
});
updateBtn.addEventListener('click',()=>{
  esw.update('.esw-element');
});
disableBtn.addEventListener('click', ()=>{
  esw.disable();
});
enableBtn.addEventListener('click', ()=>{
  esw.enable();
});
destroyedBtn.addEventListener('click', ()=>{
  esw.destroyed();
  console.log(esw);
  rowScrollElement.removeEventListener('scroll', eswEvent);
});

