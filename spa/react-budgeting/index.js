import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, HashRouter, hashHistory } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import App from './containers/App';
import store from './store';

const renderApp = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter history={hashHistory}>
        <AppContainer>
          <Component />
        </AppContainer>
      </HashRouter>
    </Provider>,
    document.getElementById('root')
  );
};

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('containers/App', () => renderApp(App));
}
