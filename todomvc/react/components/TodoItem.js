/**
 * Created by Neil on 2017/1/16.
 */
// import {connect} from 'react-redux'
// import {updateTodo,removeTodo} from '../actions/index'
// import React from 'react'

const {updateTodo, removeTodo} = require('../actions/index');
const {connect} = require('react-redux');
const React = require('react');

class TodoItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editing: false, editingText: this.props.todo.text};
		this.onEdit = this.onEdit.bind(this);
		this.onDbClick = this.onDbClick.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.handleDestroy = this.handleDestroy.bind(this);
		this.handleEditSubmit = this.handleEditSubmit.bind(this);
		this.onRandomClick = this.onRandomClick.bind(this);
	}

	render() {
		// console.log('completed?= ' + this.props.completed);
		return (
			<li className={`${this.props.todo.completed ? 'completed' : ''} ${this.state.editing ? 'editing' : ''}`}>
				<div className='view'>
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.todo.completed}
						onChange={this.handleCheck}/>
					<label onDoubleClick={this.onDbClick}>{this.props.todo.text}</label>
					<button className="destroy" onClick={this.handleDestroy}/>
				</div>
				<input
					type="text"
					className="edit"
					ref={(input) => {
						this.editInput = input;
					} }
					value={this.state.editingText}
					onChange={this.onEdit}
					onKeyDown={this.handleEditSubmit}/>
			</li>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.editing && this.state.editing) {
			this.editInput.focus();
		}
	}

	componentDidMount() {
		window.addEventListener('click', this.onRandomClick)
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.onRandomClick);
	}

	onRandomClick(e) {
		if (e.target != this.editInput) {
			this.setState({editing: false, editingText: this.props.todo.text});
		}
	}


	onEdit(e) {
		this.setState({editingText: e.target.value});
	}

	onDbClick() {
		this.setState({editing: true});
	}

	handleCheck(e) {
		this.props.onCheck(e);
	}

	handleDestroy() {
		this.props.onDestroy();
	}

	handleEditSubmit(e) {
		if ('Enter' === e.key && this.state.editingText.trim()) {
			this.props.onEditSubmit(this.state.editingText);
			this.setState({editing: false});
		}
	}
}

function mapStateToProps(state, ownProps) {
	return {};
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		onCheck: function (e) {
			dispatch(updateTodo(ownProps.index, null, e.target.checked));
		},
		onDestroy: function () {
			dispatch(removeTodo(ownProps.index));
		},
		onEditSubmit: function (text) {
			dispatch(updateTodo(ownProps.index, text, null));
		},
	};

}
const TodoItemCon = connect(mapStateToProps, mapDispatchToProps)(TodoItem);

export default TodoItemCon;
