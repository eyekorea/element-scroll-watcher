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
  <div class="observeCheck" style="height:400px">observeCheck</div>
  <div class="observeCheck" style="height:400px">observeCheck</div>
  <div class="observeCheck" style="height:400px">observeCheck</div>
  <div class="observeCheck" style="height:400px">observeCheck</div>
<div>
```

## options
- `root` : `default window` scroll event 가 bind 되는 타겟
- `activePercentY` : `default 60` 진입 체크 시작 포인트 
- `deActivePercentY`  : `default 90` 진입 체크 엔드 포인드
- `activePercentX` : 0, 개발중.
- `deActivePercentX`  : 100, 개발중
- `activeDelay` : `default 1000`  진입시 해당 시간 후 함수 실행됨 ( ms ).
- `threshold` : `default 0.1` intersectionObserve 의 threshold 
- `active` : `default null` 진입했을때 실행될 callback 함수
- `deActive` : `default null` 나갔을때 실행될 callback 함수
- `init` : `default true` 최초 init 을 할지 옵션
- `checkY` : `default top` top, middle, bottom, custom number(px) , target 의 기준점.
- `checkX` : 'left' 개발중

## 개별 지정
- 전체 셋팅 값과 별도로 개별 element 에 기준점을 부여 할 수 있다.
- 개별 이벤트, 개별 delay 는 추가 개발 중...
```html
<div class="observeCheck" data-esw-check-y="top" style="height:400px">대상의 상단을 기준</div>
<div class="observeCheck" data-esw-check-y="middle" style="height:400px">대상의 중앙을 기준</div>
<div class="observeCheck" data-esw-check-y="bottom" style="height:400px">대상의 하단을 기준</div>
<div class="observeCheck" data-esw-check-y="100" style="height:400px">대상의 상단으로 부터 n px 아래를 기준</div>
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

## 동적 생성
- 동적으로 생성된 엘리먼트를 바인드 할 수 있다.
```js
const esw = ElementScrollWatcher('.observeCheck');

esw.update('.observeCheck') // update
```
- 셀럭터( String ) 를 넘기거나, nodeList, element 를 넘겨줄 수 있다.