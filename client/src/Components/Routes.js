import React from "react";
// import { Subscribe } from 'unstated'
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./Helpers";

import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Tictactoe from "./Tictactoe";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <PrivateRoute path="/dashboard" component={Dashboard} />
    <Route path="/tictactoe" component={Tictactoe} />
  </Switch>
);

export default Routes;
