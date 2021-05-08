import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import configureStore from './reducer/ConfigureStore';
import RouteLoad from './components/RouteLoad';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createHashHistory } from 'history';
const history = createHashHistory({
  hashType: 'slash' // the default
});
const store = configureStore();
ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>    
      <RouteLoad />
    </Provider>
  </Router>,
  document.getElementById('app')
);
if(module.hot)
    module.hot.accept();