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
		console.log(newState)
		state = newState;
		render();
	}
	return [state, setState];
}

const App = () => {
	const [count, setCount] = useState(0)
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