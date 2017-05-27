/**
 * Created by Neil on 2017/1/16.
 */
const {connect} = require('react-redux');
const React = require('react');
const {removeComplete} = require('../actions/index');
const {Link} = require('react-router');

function Footer(props) {
	return (
		<footer className="footer">
			<span className="todo-count"><strong>{props.itemLeft}</strong> item left</span>
			<ul className="filters">
				<li>
					<Link activeClassName="selected" to="/">All</Link>
				</li>
				<li>
					<Link activeClassName="selected" to="/active">Active</Link>
				</li>
				<li>
					<Link activeClassName="selected" to="/completed">Completed</Link>
				</li>
			</ul>
			<button className="clear-completed" onClick={props.clearComplete}>Clear completed</button>
		</footer>
	);
}

function mapStateToProps(state, props) {
	return {
		itemLeft: state.todos.filter((todo) => !todo.completed).length
	};
}

function mapDispatchToProps(dispatch, props) {
	return {
		clearComplete: function () {
			dispatch(removeComplete());
		},
	};
}
const FooterCon = connect(mapStateToProps, mapDispatchToProps)(Footer);

export default FooterCon;
