import React from 'react'
import {
    BrowserRouter as Router, 
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

import Homepage from './pages/Home'
import RegisterComponent from './pages/CreatePoint'

const RouteConfig = () => (
    <Router>
        <Switch>
            <Route path="/" component={Homepage} exact/>

            <Route path="/register" component={RegisterComponent} exact/>

            <Route path="*" component={() => <Redirect to={{ pathname: "/" }} />} />
        </Switch>
    </Router>
);

export default RouteConfig