import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Amazon from './amazon'
import Twitter from './twitter'

function Routes() {
    return (
        <Switch>
            <Route path='/manager/received/amazon' component={Amazon} />
            <Route path='/manager/received/twitter' component={Twitter} />
            <Redirect from='/manager/received' to='/manager/received/twitter'/>
        </Switch>
    )
}

export default Routes