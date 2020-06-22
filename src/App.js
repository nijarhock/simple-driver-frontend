import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import PublicRoute from './Utils/PublicRoute';
import PrivateRoute from './Utils/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './style/main.css';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <PublicRoute exact path="/" component={Login} />
                    <PublicRoute path="/register" component={Register} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/dashboard/:root" component={Dashboard} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;