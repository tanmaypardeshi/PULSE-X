import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Received from './received'
import Employees from './employees'
import Profile from './profile'

function Routes() {
    return (
        <Switch>
            <Route path='/manager/received' component={Received} />
            <Route path='/manager/employees' component={Employees} />
            <Route path='/manager/profile' component={Profile} />
            <Redirect from='/manager' to='/manager/received'/>
        </Switch>
    )
}

export default Routes