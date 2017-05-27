/**
 * Created by Neil on 2017/1/16.
 */
const {toggleAll} = require('../actions/index');
const {connect} = require('react-redux');
const React = require('react');
const {getVisibleTodos} = require('../selectors/TodoItemSelector');

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="main">
				<input
					className="toggle-all"
					type="checkbox"
					defaultChecked={false}
					onChange={this.props.onSelectAll}/>
				<label htmlFor="toggle-all">Mark all as complete</label>
				<ul className="todo-list">
					{this.props.TodoCons}
				</ul>
			</section>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		TodoCons: getVisibleTodos(state, ownProps),
		params: ownProps.params
	};
}

function mapDispatchToProps(dispatch, props) {
	return {
		onSelectAll: function (e) {
			dispatch(toggleAll(e.target.checked));
		}
	};
}

const MainCon = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainCon;
