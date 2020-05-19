import React, { Component } from "react";
import { Button, Row, Container, Col } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { checkCookie } from "../Authentication/cookies";

function Square(props) {
  return <Button size="lg" variant="dark" class="Square"></Button>;
}
const socket = io.connect();

class Tictactoe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      game_id: "",
      game_state: [],
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ username: checkCookie() });

    socket.on("error", function (err) {
      console.log("Error: ", err);
    });
    socket.on("playing", function () {
      console.log("Playing");
    });
    socket.on("waiting", function () {
      console.log("Waiting");
    });
    socket.on("my_error", function (data) {
      console.log("My_Error", data);
    });
  }

  handleSubmit = async (event) => {
    await axios
      .post("http://localhost:80/gamemaster/starttictactoe", this.state)
      .then(
        (response) => {
          this.setState({ game_id: JSON.stringify(response.data) });
          console.log("Game ID: ", this.state.game_id);
        },
        (error) => {
          console.log("gamemaster/StartTicTacToe Error", error);
        }
      );
    console.log("username: ", this.state.username, this.state.game_id);
    socket.emit("start", {
      username: this.state.username,
      game_id: this.state.game_id,
    });
  };

  renderSquare(i) {
    return (
      <Square
      // value={this.props.squares[i]}
      // onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(0)}</Col>
          <Col xl="auto">{this.renderSquare(1)}</Col>
          <Col xl="auto">{this.renderSquare(2)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(3)}</Col>
          <Col xl="auto">{this.renderSquare(4)}</Col>
          <Col xl="auto">{this.renderSquare(5)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(6)}</Col>
          <Col xl="auto">{this.renderSquare(7)}</Col>
          <Col xl="auto">{this.renderSquare(8)}</Col>
        </Row>
        <Button onClick={this.handleSubmit}>PLAY!</Button>
      </Container>
    );
  }
}

export default Tictactoe;
