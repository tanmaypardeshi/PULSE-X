import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Received from './received'
import Employees from './employees'
import Profile from './profile'
import Employee from './employee'
import Statistics from './statistics'

function Routes() {
    return (
        <Switch>
            <Route path='/manager/received' component={Received} />
            <Route exact path='/manager/employees' component={Employees} />
            <Route path='/manager/employees/:employeeId' component={Employee} />
            <Route path='/manager/statistics' component={Statistics}/>
            <Route path='/manager/profile' component={Profile} />
            <Redirect from='/manager' to='/manager/received'/>
        </Switch>
    )
}

export default Routes