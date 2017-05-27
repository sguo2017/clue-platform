/**
 * Created by Neil on 2017/1/16.
 */
const {ADD_TODO, UPDATE_TODO, TOGGLE_ALL, REMOVE_TODO, REMOVE_COMPLETE} = require('../actions/index');


function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return [...state, {text: action.text, completed: false}];
		case UPDATE_TODO:
			return state.map(function (todo, index) {
				if (index === action.index) {
					return {
						text: action.text === null ? todo.text : action.text,
						completed: action.completed === null ? todo.completed : action.completed
					};
				} else {
					return todo;
				}
			});
		case TOGGLE_ALL:
			return state.map((item) => {
				return {
					text: item.text,
					completed: action.completed
				};
			});
		case REMOVE_TODO:
			console.log('remove');
			let temp = state.map(item => item);
			temp.splice(action.index, 1);
			return temp;
		case REMOVE_COMPLETE:
			return state.map(item => item)
				.filter((item) => !item.completed);
		default:
			return state;
	}
}

function todoApp(state, action) {
	return {
		todos: todos(state.todos, action)
	};
}

export default todoApp;
