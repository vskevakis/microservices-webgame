import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { checkCookie, setCookie } from "../Authentication/cookies";

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      logoutUser: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.setState({ username: checkCookie(), logoutUser: true });
    setCookie("token", this.state.username, 0);
  }

  render() {
    if (this.state.logoutUser) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h4>Dashboard Here We will display user stats and options</h4>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

export default DashboardPage;
