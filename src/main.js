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

const App = () => {
	const [count, setCount] = useState(0)
	useEffect(() => {
		console.log(`挂载时：${count}`)
	}, [count])
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