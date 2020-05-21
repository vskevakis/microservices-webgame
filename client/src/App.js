import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Components/Routes";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default App;
