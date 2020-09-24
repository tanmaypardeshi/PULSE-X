import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Received from './received'
import Profile from './profile'

function Routes() {
    return (
        <Switch>
            <Route path='/developer/received' component={Received} />
            <Route path='/developer/profile' component={Profile} />
            <Redirect from='/developer' to='/developer/received'/>
        </Switch>
    )
}

export default Routes