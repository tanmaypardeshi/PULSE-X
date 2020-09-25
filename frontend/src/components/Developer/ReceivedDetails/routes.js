import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Amazon from './amazon'
import Twitter from './twitter'

function Routes() {
    return (
        <Switch>
            <Route path='/developer/received/amazon' component={Amazon} />
            <Route path='/developer/received/twitter' component={Twitter} />
            <Redirect from='/developer/received' to='/developer/received/twitter'/>
        </Switch>
    )
}

export default Routes