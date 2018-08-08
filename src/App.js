import React, {Component} from 'react';
import logo from './logo.svg';
import {Router, Route, Switch, Link} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import Login from './components/login/login'
import Dashboard from './components/dashboard/dashboard'
import Items from './components/dashboard/items'
import CashCounter from './components/cash-counter/cash-counter'

    var config = {
    apiKey: "AIzaSyAXZUjKefwOhApZ6bxxxGgHjdwB7vGYh0s",
    authDomain: "login-app-39222.firebaseapp.com",
    databaseURL: "https://login-app-39222.firebaseio.com",
    projectId: "login-app-39222",
    storageBucket: "login-app-39222.appspot.com",
    messagingSenderId: "1069089693718"
};
    firebase.initializeApp(config);

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router history={history}>
                <div>
                <Switch>
                <Route exact path={'/'} component={Login}/>
                <Route exact path={'/login'} component={Login}/>
                <Route exact path={'/dashboard'} component={Dashboard}/>
                <Route exact path={'/items'} component={Items}/>
                <Route exact path={'/cash-counter'} component={CashCounter}/>
                </Switch>
                </div>
                </Router>

            </div>
        );
    }
}

export default App;

