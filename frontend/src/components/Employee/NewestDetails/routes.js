import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Amazon from './amazon'
import Twitter from './twitter'

function Routes() {
    return (
        <Switch>
            <Route path='/employee/newest/amazon' component={Amazon} />
            <Route path='/employee/newest/twitter' component={Twitter} />
            <Redirect from='/employee/newest' to='/employee/newest/twitter'/>
        </Switch>
    )
}

export default Routes