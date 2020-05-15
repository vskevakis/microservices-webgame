import React, { Component } from "react";
import { Button, Row, Container, Col } from "react-bootstrap";

import axios from "axios";
import { checkCookie } from "../Authentication/cookies";

function Square(props) {
  return <Button size="lg" variant="dark" class="Square"></Button>;
}

class Tictactoe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: checkCookie(),
      game_id: "",
      game_state: [],
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    var self = this;
    // this.socket = io.connect(location.protocol + '//' + document.domain + ':' +  location.port + '/playmaster');
    this.socket = io.connect("http://localhost:80/playmaster");
    this.socket.on("connect", function () {
      self.socket.emit("hi", {
        game_id: this.props.game_id,
        username: this.props.username,
      });
    });

    self.socket.emit("set_state", { game_id: this.props.game_id });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    // var socket = io.connect('http://localhost:80/playmaster/' + document.domain + ':' + location.port + '/test');

    const user_data = {
      username: "",
    };
    this.setState({ username: checkCookie() });
    await axios
      .post("http://localhost:80/gamemaster/starttictactoe", user_data)
      .then(
        (response) => {
          this.setState({ game_id: JSON.stringify(response.data) });
          alert("Game ID: ", this.game_id);
        },
        (error) => {
          alert("gamemaster/StartTicTacToe Error");
        }
      );
    // this.setState({ username: "", password: "" });

    const game_id = {
      gameid: this.state.game_id,
    };

    await axios.post("http://localhost:80/playmaster/getstate", game_id).then(
      (response) => {
        this.setState({ game_state: JSON.stringify(response.data) });
        alert("Game Found! Game State: ", this.state.game_state);
      },
      (error) => {
        alert("playmaster/Error");
      }
    );
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
