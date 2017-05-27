/**
 * Created by Neil on 2017/1/16.
 */
const ADD_TODO = 'ADD_TODO';
const UPDATE_TODO = 'UPDATE_TODO';
const TOGGLE_ALL = 'TOGGLE_ALL';
const REMOVE_TODO = 'REMOVE_TODO';
const REMOVE_COMPLETE = 'REMOVE_COMPLETE';

function addTodo(text) {
	return {
		type: ADD_TODO,
		text: text
	};
}

function updateTodo(index, text, completed) {
	return {
		type: UPDATE_TODO,
		index: index,
		text: text,
		completed: completed
	};
}

function toggleAll(completed) {
	return {type: TOGGLE_ALL, completed: completed};
}

function removeTodo(index) {
	return {type: REMOVE_TODO, index: index};
}

function removeComplete() {
	return {
		type: REMOVE_COMPLETE
	};
}

export default {
	ADD_TODO,
	UPDATE_TODO,
	TOGGLE_ALL,
	REMOVE_TODO,
	REMOVE_COMPLETE,
	addTodo,
	updateTodo,
	toggleAll,
	removeTodo,
	removeComplete
};
