import React from 'react'
import ReactDOM from 'react-dom'

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

// 空数组，只执行 1 次
// 有值的数组，执行 1+ 次
// 不写，执行 1+ 次
let _deps = undefined // 记录上一次数组，第一次当然未定义
function useEffect(callback, depArray) {
	const hasDeps = depArray
	// 空数组永远返回 true
	// 有值的数组时，一一对比是否和上一次对比是否一变化，第一次对比一定返回 false，以后有变化时返回 false
	// depArray.every((array,i)=>{depArray[i]===_deps[i]}  
	const hasChangedDeps = _deps ? !depArray.every((array, i) => array === _deps[i]) : true
	if (hasChangedDeps || !hasDeps) {
		callback()
		_deps = depArray
	}
}

const App = () => {
	const [count, setCount] = useState(0)
	useEffect(() => {
		console.log(`挂载时：${count}`)
	}, [])
	return (
		<div>
			<div>{count}</div>
			<button onClick={() => { setCount(count + 1) }}>+1</button>
			<button onClick={() => { setCount(count - 1) }}>-1</button>
		</div>
	)
}

ReactDOM.render(
	<App />,
	document.querySelector('#root')
)