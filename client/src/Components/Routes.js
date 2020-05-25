import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./Helpers";

import Register from "./Register";
import Login from "./Login";
import { Logout } from "./Logout";

import Dashboard from "./Dashboard";
import Tictactoe from "./Tictactoe";
import My_Chess from "./Chess";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/logout" component={Logout} />
    <PrivateRoute path="/dashboard" component={Dashboard} />
    <PrivateRoute path="/tictactoe" component={Tictactoe} />
    <PrivateRoute path="/chess" component={My_Chess} />
  </Switch>
);

export default Routes;
