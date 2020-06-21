# 模拟 React Hook 接口实现

参考文章：https://github.com/brickspert/blog/issues/26

## 一、useState 简单实现

* 核心功能：state 和 setState

```
const render = () => {
	ReactDOM.render(
		<App />,
		document.querySelector('#root')
	)
}

let state = undefined;
function useState(initialValue) {
	if (!state) {
		state = initialValue
	}
	function setState(newState) {
		state = newState;
		render();
	}
	return [state, setState];
}
```

## 二、useEffect 简单实现

核心功能：

* 第一次渲染组件时执行一次
* 监控数据变化，在发生变化时执行一次
* 第二参数为空数组时，只执行一次

```
let oldDeps = undefined // 记录上一次数组，第一次当然未定义
function useEffect(callback, depArray) {
	const hasDeps = depArray
	// 空数组永远返回 true
	// 有值的数组时，一一对比是否和上一次对比是否一变化，第一次对比一定返回 false，以后有变化时返回 false
	// depArray.every((item,i)=>item === oldDeps[i]}  
	const hasChangedDeps = oldDeps ? !depArray.every((item, i) => item === oldDeps[i]) : true
	if (hasChangedDeps || !hasDeps) {
		callback()
		oldDeps = depArray
	}
}
```

## 三、完善

* 以上 state 只是定义了一个全局变量，无法满足多个 state 的情况
* 可以使用一个数组存放每个 state 的状态

```
let memoizedState = []; // hooks 存放在这个数组，放 useState 的 state 和 useEffect 的监控数组
let cursor = 0; // 当前 memoizedState 下标

const render = ()=>{
	ReactDOM.render(
  	<App />,
    document.querySelector('#root')
  )
}

// [100,101]
//   0   1  2
// 每次使用 useState 时，cursor 会指向数组的下一位
// 每个 setState 都会使用之前记录下的 currentCursor
function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```

• 这是闭包的经典使用

• 真正的 React 里不是用的数组，而是链表，但是原理类似

• 难点是每次 render 后，数组要对上号