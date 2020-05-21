import React, { Component } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import { checkCookie } from "../Authentication/cookies";

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
    };
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col md="auto">
            <h4>
              Hello {this.state.username}, this is the dashboard and we will
              display user stats and options
            </h4>
          </Col>
          <Col></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button className="dashboard" href="./chess">
              Chess
            </Button>
          </Col>
          <Col md="auto">
            <Button className="dashboard" href="./tictactoe">
              Tic Tac Toe
            </Button>
          </Col>
          <Col md="auto">
            <Button className="dashboard" href="./logout">
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DashboardPage;
