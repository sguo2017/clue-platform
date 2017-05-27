/**
 * Created by Neil on 2017/1/18.
 */
const {createSelector} = require('reselect');
const TodoItemCon = require('../components/TodoItem').default
const React = require('react');

function getTodoCons(state, props) {
	return state.todos.map((todo, index) =>
		<TodoItemCon
			key={index}
			index={index}
			todo={todo}/>);
}

function getParams(state, props) {
	if (props.params) {
		return props.params.state;
	}
}

const getVisibleTodos = createSelector([getTodoCons, getParams],
	function (TodoCon, param) {
		switch (param) {
			case 'active':
				return TodoCon.filter((item) => !item.props.todo.completed);
			case 'completed':
				return TodoCon.filter((item) => item.props.todo.completed);
			default:
				return TodoCon;
		}
	});

function makeGetVisibleTodos() {
	return createSelector([getTodoCons, getParams],
		function (TodoCon, param) {
			switch (param) {
				case 'active':
					return TodoCon.filter((item) => !item.props.todo.completed);
				case 'completed':
					return TodoCon.filter((item) => item.props.todo.completed);
				default:
					return TodoCon;
			}
		}
	);
}

export default {getVisibleTodos};

