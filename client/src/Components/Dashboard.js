import React, { Component } from "react";
import { Container, Button, Col, Row, Table } from "react-bootstrap";
import { checkCookie, checkUser } from "../Authentication/cookies";
import axios from "axios";

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      t_wins: 0,
      t_ties: 0,
      t_loses: 0,
      c_wins: 0,
      c_ties: 0,
      c_loses: 0,
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    axios
      .post("http://localhost:80/gamemaster/getscores", {
        username: this.state.username,
      })
      .then(
        (response) => {
          console.log(response.data);
          this.setState((state) => ({
            t_wins: response.data.t_wins,
            t_ties: response.data.t_ties,
            t_loses: response.data.t_loses,
            c_wins: response.data.c_wins,
            c_ties: response.data.c_ties,
            c_loses: response.data.c_loses,
          }));
        },
        (error) => {
          console.log("Gamemaster/GetScores - Axios Error.");
        }
      );
  }

  renderAdmin() {
    if (this.state.user_role === "admin") {
      return (
        <Col md="auto">
          <Button className="dashboard" href="./admin">
            Admin Panel
          </Button>
        </Col>
      );
    }
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>
              Welcome {this.state.username}! Your role is {this.state.user_role}{" "}
              This is the dashboard and we will display your stats. Feel free to
              play Tic Tac Toe online.
            </h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Table responsive>
            <thead>
              <tr>
                <th> </th>
                <th>Tic Tac Toe</th>
                <th>Chess</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Wins</td>
                <td>{this.state.t_wins}</td>
                <td>{this.state.c_wins}</td>
              </tr>
              <tr>
                <td>Ties</td>
                <td>{this.state.t_ties}</td>
                <td>{this.state.c_ties}</td>
              </tr>
              <tr>
                <td>Loses</td>
                <td>{this.state.t_loses}</td>
                <td>{this.state.c_loses}</td>
              </tr>
            </tbody>
          </Table>
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
            <Button className="dashboard" href="./tournament">
              Tournament
            </Button>
          </Col>
        </Row>
        <Row>
          {this.renderAdmin()}
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
