import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./components/Login";
import LoginChangePassword from "./components/LoginChangePassword";
import AuthState from "./Context/AuthContext/AuthState";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import loginIcon from './loginIcon.svg'

ReactDOM.render(
  <Router>
  <AuthState>
    <Switch>
      <Route exact path="/" component={() =>{
        return(
          <div style={{display:'flex',justifyContent:'center', marginTop:30}}>
            {/* <LoginChangePassword /> */}
            <Login />
            {/* <img src={loginIcon} style={{width:'300px',height:'300px'}}/> */}
          </div>
        )
      }} />
      <Route path="/home" component={App} />
      {/* <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} /> */}
    </Switch>
  </AuthState>
</Router>,
  document.getElementById('root')
);

serviceWorkerRegistration.unregister();
reportWebVitals();
