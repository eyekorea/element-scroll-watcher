# element-scroll-watcher
지정된 element 가 viewport 를 기준으로 지정된 위치에 왔을때 지정된 시간 이후 지정된 callback 을 실행 합니다..

## install
`npm install --save https://github.com/eyekorea/element-scroll-watcher.git`

## use

```js
import ElementScrollWatcher from 'element-scroll-watcher';

const esw = ElementScrollWatcher('.observeCheck', {  // 셀럭터( String ) 를 넘기거나, nodeList, element 를 넘겨줄 수 있다.
  root : window,
  active : (element)=>{
    element.classList.add('active');
  },
  deActive: (element)=>{
    element.classList.remove('active');
  }
});
```

```html
<div>
  <div class="observeCheck">observeCheck</div>
  <div class="observeCheck">observeCheck</div>
  <div class="observeCheck">observeCheck</div>
  <div class="observeCheck">observeCheck</div>
<div>
```

## options
- `root` : `default window` scroll event 가 bind 되는 타겟
- `activePercentY` : `default 60` 진입 체크 Y축 시작 포인트 
- `deActivePercentY`  : `default 90` 진입 체크 Y축 엔드 포인드
- `activePercentX` : 0, 진입 체크 X축 시작 포인트 .
- `deActivePercentX`  : 100, 진입 체크 X축 엔드 포인드
- `activeDelay` : `default 1000`  진입시 해당 시간 후 함수 실행됨 ( ms ).
- `threshold` : `default 0.1` intersectionObserve 의 threshold 
- `active` : `default null` 진입 후 지연시간이 지나면 실행되는 callback 함수
  - `element` 를 인자로 받을 수 있음
- `deActive` : `default null` 나갔을때 실행될 callback 함수
  - `element` 를 인자로 받을 수 있음
- `direct` : `default null` 지연시간과 무관하게 바로 실행 되는 callback 함수
  - `element` 를 인자로 받을 수 있음
- `scroll` : `default null` 스크롤 될때 실행되는 callback 함수
  - 화면에 진입된 element 만 argument 로 받을 수 있음.
  - `element` 값에 대한 HTMLelement 
  - `itemYPercent` element 의 이동량( 백분율 )
  - `isIntersecting` element 의 화면 진입 유무 ( 항시 true )
- `init` : `default true` 최초 init 을 할지 옵션
- `checkY` : `default top` top, middle, bottom, custom number(px) , target 의 기준점.
- `checkX` : 'left' 개발중

## 개별 지정
### 기준점 지정
- 전체 셋팅 값과 별도로 개별 element 에 기준점을 부여 할 수 있다.
```html
<div class="observeCheck" data-esw-check-y="top">대상의 상단을 기준</div>
<div class="observeCheck" data-esw-check-y="middle">대상의 중앙을 기준</div>
<div class="observeCheck" data-esw-check-y="bottom">대상의 하단을 기준</div>
<div class="observeCheck" data-esw-check-y="100">대상의 상단으로 부터 n px 아래를 기준</div>

<div class="observeCheck" data-esw-check-x="left">대상의 좌측을 기준</div>
<div class="observeCheck" data-esw-check-x="center">대상의 중앙을 기준</div>
<div class="observeCheck" data-esw-check-x="right">대상의 우측을 기준</div>
<div class="observeCheck" data-esw-check-x="100">대상의 좌측으로 부터 n px 우측을 기준</div>
```
### 지연시간 지정
- 전체 셋팅 값과 별도로 개별 element 에 지연시간을 부여 할 수 있다.
```html
<div class="observeCheck" data-esw-delay="100">active 지연시간을 100ms 로 설정</div>
```


## callback
- active , deActive 에 callback 을 지정할 수 있다.
```js
  active : (element)=>{
    element.classList.add('active');
  },
  deActive: (element)=>{
    element.classList.remove('active');
  }
```
## method
### 동적 생성
- 동적으로 생성된 엘리먼트를 바인드 할 수 있다.
```js
const esw = ElementScrollWatcher('.observeCheck');

esw.update('.observeCheck') // update
```
- 셀럭터( String ) 를 넘기거나, nodeList, element 를 넘겨줄 수 있다.

### 실행을 중단 및 실행
- 감시를 정지 시키거나 실행 시킨다.
```js
const esw = ElementScrollWatcher('.observeCheck');

esw.disable(); // 감시를 비활성화

esw.enable(); // 감시를 활성화
```
### 외부에서 이벤트를 바인드 ( 터치 및 별도 영역 스크롤 등 )
- 외부에서 이벤트를 강제로 발생 시킬 수 있다.
```js
const esw = ElementScrollWatcher('.observeCheck');
const rowScrollElement = document.querySelector('#rowScroll');
const eswEvent = esw.mot.bind(esw);

rowScrollElement.addEventListener('scroll', eswEvent); // rowScroll 영역에 스크롤 발생시 이벤트 발생.
```

### 삭제
- ElementScrollWatcher 를 삭제 한다.
```js
const esw = ElementScrollWatcher('.observeCheck');

esw.destroy(); // 클래스를 삭제
```