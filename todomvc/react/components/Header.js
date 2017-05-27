/**
 * Created by Neil on 2017/1/16.
 */
// import {addTodo} from '../actions/index'
// import {connect} from 'react-redux'
// import React from 'react'
const {addTodo} = require('../actions/index');
const {connect} = require('react-redux');
const React = require('react');

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {input: ''};
		this.onInputChange = this.onInputChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	render() {
		return (
			<header className="header">
				<h1>todos</h1>
				<input
					className="new-todo"
					placeholder="What needs to be done?"
					autoFocus
					value={this.state.input}
					onKeyDown={this.handleKeyDown}
					onChange={this.onInputChange}/>
			</header>
		);
	}

	handleKeyDown(e) {
		if ('Enter' === e.key && this.state.input.trim()) {
			this.props.onInputSubmit(this.state.input);
			this.setState({input: ''});
		}
	}

	onInputChange(e) {
		this.setState({input: e.target.value});
	}
}
function mapStateToProps(state, props) {
	return {};
}

function mapDispatchToProps(dispatch, props) {
	return {
		onInputSubmit: function (input) {
			dispatch(addTodo(input));
		}
	};

}
const HeaderCon = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderCon;
