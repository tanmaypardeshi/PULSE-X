import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Amazon from './amazon'
import Twitter from './twitter'

function Routes() {
    return (
        <Switch>
            <Route path='/employee/saved/amazon' component={Amazon} />
            <Route path='/employee/saved/twitter' component={Twitter} />
            <Redirect from='/employee/saved' to='/employee/saved/twitter'/>
        </Switch>
    )
}

export default Routes