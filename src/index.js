import ElementScrollWatcher from './elementScrollWatcher'

const esw = new ElementScrollWatcher('.esw-element',{
  activePercentY: 60, // 진입 체크 시작 포인트 
  deActivePercentY : 98, // 진입 체크 엔드 포인드
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
  scroll(element, ypercent, isIntersecting){
    const p = ypercent.toFixed(2);
    const percentElement = element.querySelector('.percent');
    const intersectingElement = element.querySelector('.isIntersecting');
    percentElement.textContent = `${p}%`;
    intersectingElement.textContent = `${isIntersecting}`;

    // console.log(element, ypercent, isIntersecting);
  },
  deActivePercentY: 95,
  activePercentY: 60,
  checkY: 'middle'
})