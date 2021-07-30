import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./components/Login";
import AuthState from "./Context/AuthContext/AuthState";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <Router>
  <AuthState>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/home" component={App} />
      {/* <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} /> */}
    </Switch>
  </AuthState>
</Router>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
