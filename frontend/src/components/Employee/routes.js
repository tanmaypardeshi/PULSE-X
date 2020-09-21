import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Newest from './newest'
import Saved from './saved'
import Statistics from './statistics'
import Profile from './profile'

function Routes() {
    return (
        <Switch>
            <Route path='/employee/newest' component={Newest} />
            <Route path='/employee/saved' component={Saved} />
            <Route path='/employee/statistics' component={Statistics} />
            <Route path='/employee/profile' component={Profile} />
            <Redirect from='/employee' to='/employee/newest'/>
        </Switch>
    )
}

export default Routes