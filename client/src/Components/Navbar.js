import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../f-logo.svg";

import { checkCookie } from "../Authentication/cookies";

class NavBar extends Component {
  render() {
    if (checkCookie()) {
      return (
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">
            <img
              alt={logo}
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {"  "}
            F-Society
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link style={{ color: "#5299d3" }} href="/">
                Home
              </Nav.Link>
              <Nav.Link style={{ color: "#5299d3" }} href="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">
          <img
            alt={logo}
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          {"  "}
          F-Society
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link style={{ color: "#5299d3" }} href="/">
              Home
            </Nav.Link>
            <Nav.Link style={{ color: "#5299d3" }} href="/login">
              Login
            </Nav.Link>
            <Nav.Link style={{ color: "#5299d3" }} href="/register">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
