import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './Login/login'
import Register from './Login/register'
import Employee from './Employee/employee'
import Manager from './Manager/manager'
import Developer from './Developer/developer'

const EmployeeRoute = ({ component: Component, ...rest }) => {
    let loggedIn = JSON.parse(sessionStorage.getItem("user"));
  
    return (
      <Route
        {...rest}
        render={(props) => (
          loggedIn && loggedIn.token && loggedIn.is_employee ? 
            <Component {...rest} {...props} /> : 
            <Redirect to="/" />
        )}
      />
    );
};

const ManagerRoute = ({ component: Component, ...rest }) => {
    let loggedIn = JSON.parse(sessionStorage.getItem("user"));

    return (
        <Route
        {...rest}
        render={(props) => (
            loggedIn && loggedIn.token && loggedIn.is_manager ? 
            <Component {...rest} {...props} /> : 
            <Redirect to="/" />
        )}
        />
    );
};

const DeveloperRoute = ({ component: Component, ...rest }) => {
    let loggedIn = JSON.parse(sessionStorage.getItem("user"));

    return (
        <Route
        {...rest}
        render={(props) => (
            loggedIn && loggedIn.token && loggedIn.is_rnd ? 
            <Component {...rest} {...props} /> : 
            <Redirect to="/" />
        )}
        />
    );
};


function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/register' component={Register} />
                <EmployeeRoute path='/employee' component={Employee} />
                <ManagerRoute path='/manager' component={Manager} />
                <DeveloperRoute path='/developer' component={Developer} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes