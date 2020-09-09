import ElementScrollWatcher from './elementScrollWatcher'

const esw = new ElementScrollWatcher('.esw-element',{
  activePercentY: 60, // 진입 체크 시작 포인트 
  deActivePercentY : 90, // 진입 체크 엔드 포인드
  activeDelay: 1000, // 진입시 해당 시간 후 함수 실행됨.
  threshold: 0.1, // intersectionObserve 의 threshold 
  active: element=>{
    element.classList.add('active');
  }, // 진입했을때 실행될 callback 
  deActive: element=>{
    element.classList.remove('active');
  }, // 나갔을때 실행될 callback
})