import React, { Component } from 'react';
import { Route, Switch, withRouter, HashRouter } from 'react-router-dom';
import Index from './appraisal/Index';
import Login from './appraisal/Login';
import Result from './appraisal/Result';
import EditPage from './config/EditPage';
import IndexNew from './appraisal/IndexNew';
import Loadable from 'react-loadable';
import configureStore from '../reducer/ConfigureStore';
const store = configureStore();
class RouteLoad extends Component {
    render() {
        return(
            <HashRouter>
                <Switch>
                    <Route exact path='/' component={Login}></Route>
                    <Route exact path='/index-old' component={Index}></Route>
                    <Route exact path='/result' component={Result}></Route>
                    <Route exact path='/config' component={EditPage}></Route>
                    <Route exact path='/index' component={IndexNew}></Route>
                </Switch>
            </HashRouter>
            );
    }
}

export default withRouter(RouteLoad);