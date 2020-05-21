import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Container } from "react-bootstrap";
import axios from "axios";

import { setCookie } from "../Authentication/cookies";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      email: "",
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
      email: this.state.email,
      password: this.state.password,
      isAuthenticated: false,
    };

    await axios.post("http://localhost:80/auth/register", user_data).then(
      (response) => {
        alert(
          "User registered successfully. Welcome to F-Society, " +
            user_data.username
        );
        setCookie("token", user_data.username, 1);
        this.setState({ isAuthenticated: true });
      },
      (error) => {
        alert("Registration Unsuccesful. Please check your credentials.");
      }
    );
    this.setState({ username: "", email: "", password: "" });
  };

  render() {
    if (this.state.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Container className="auth">
        <Form className="my-form" onSubmit={this.handleSubmit}>
          <Form.Row className="justify-content-md-center">
            <h3>Sign Up</h3>
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
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="I accept usage of cookies for authentication purposes only."
            />
          </Form.Group>
          <Form.Row>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSubmit}
              >
                Sign Up
              </Button>
            </Col>
            <Col>
              <a href="./login"> I already have an account</a>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    );
  }
}

export default Register;
