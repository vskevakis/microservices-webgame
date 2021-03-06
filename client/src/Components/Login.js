import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";

import axios from "axios";

import { checkCookie, setCookie } from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      isAuthenticated: checkCookie(),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // check it out: we get the event.target.name (which will be either "username" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const user_data = {
      username: this.state.username,
      password: this.state.password,
      isAuthenticated: false,
    };

    await axios.post(url + "/auth/login", user_data).then(
      (response) => {
        setCookie("token", response.data);
        this.setState({ isAuthenticated: true });
      },
      (error) => {
        alert("Authentication Unsuccesful. Please check your credentials.");
      }
    );
    this.setState({ username: "", password: "" });
  };

  render() {
    if (this.state.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Form
        fluid="md"
        className="my-form justify-content-center"
        onSubmit={this.handleSubmit}
      >
        <Form.Row className="justify-content-md-center">
          <h3>Sign In</h3>
        </Form.Row>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Row>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Login
            </Button>
          </Col>
          <Col>
            <a href="./register"> I don't have an account</a>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default Login;

// We can add Register Class Here
