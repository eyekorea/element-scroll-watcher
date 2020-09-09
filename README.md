# element-scroll-watcher
지정된 element 가 viewport 를 기준으로 지정된 위치에 왔을때 지정된 시간 이후 지정된 callback 을 실행한다.

## install
`npm install --save https://github.com/eyekorea/element-scroll-watcher.git`

## use
```js
import ElementScrollWatcher from 'element-scroll-watcher';

const esw = ElementScrollWatcher('.observeCheck', { 
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