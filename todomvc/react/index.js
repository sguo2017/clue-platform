import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './assets/app.css';

/**
 * Created by Neil on 2017/1/16.
 */
const todoApp = require('./reducers/index').default;
const {createStore} = require('redux');
const HeaderCon = require('./components/Header').default;
const MainCon = require('./components/Main').default;
const FooterCon = require('./components/Footer').default;
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Route, HashRouter, hashHistory } from 'react-router-dom';


function Todo(props) {

	return (
		<section className="todoapp">
			<HeaderCon/>
			<MainCon params={props.params}/>
			<FooterCon/>
		</section>
	);
}

//mock state
let initialState = {todos: [{text: 'nihao', completed: true}, {text: 'haha', completed: false}]};
let store = createStore(todoApp, initialState);

ReactDOM.render(
	<Provider store={store}>
		<HashRouter history={hashHistory}>
			<Route path='/(:state)' component={Todo}/>
		</HashRouter>
	</Provider>,
	document.querySelector('#root'));
