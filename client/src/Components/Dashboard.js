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
              Welcome {this.state.username}! This is the dashboard and we will
              display your stats. Feel free to play Tic Tac Toe with your
              online.
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
