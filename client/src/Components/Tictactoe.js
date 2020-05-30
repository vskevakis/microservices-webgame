import React from "react";
import { Button, Row, Container, Col, Spinner } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { checkCookie } from "../Authentication/cookies";

const socket = io.connect();

function Square(props) {
  return (
    <button className="gamesquare" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Tictactoe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      game_id: "",
      game_type: "Tic_tac_toe",
      player1: "",
      player2: "",
      board: [],
      turn: "",
      active: "",
      winner: "",
      tournament: false,
      waiting: true,
    };
    this.setState = this.setState.bind(this);
  }
  calculateWinner(board) {
    var winner;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winner = this.state.board[[a]];
      }
    }
    return winner;
  }

  checkEnd() {
    if (this.calculateWinner(this.state.board) === "X") {
      this.setState((state) => ({ active: "0" }));
      this.setState((state) => ({ winner: "2" }));
    } else if (this.calculateWinner(this.state.board) === "O") {
      this.setState((state) => ({ active: "0" }));
      this.setState((state) => ({ winner: "1" }));
    } else if (this.state.board.every((x) => x !== null)) {
      this.setState((state) => ({ active: "0" }));
      this.setState((state) => ({ winner: "3" }));
    }
    console.log(
      "updating scores first not then ok",
      this.state.game_type,
      this.state.tournament
    );
    if (this.state.active === "0" && !this.state.tournament) {
      axios
        .post("http://localhost:80/gamemaster/updatescores", {
          player1: this.state.player1,
          player2: this.state.player2,
          winner: this.state.winner,
          game_type: "Tic_tac_toe",
        })
        .then(
          (response) => {
            console.log("gamemaster/updatescores with success", response);
          },
          (error) => {
            console.log("gamemaster/updatescores Error", error);
          }
        );
      console.log("checkEnd", this.state.winner);
      //this.setState((state) => ({ game_id: "" }));
    }
    if (this.state.active === "0" && this.state.tournament) {
      axios
        .post("http://localhost:80/gamemaster/update_tournament", {
          player1: this.state.player1,
          player2: this.state.player2,
          winner: this.state.winner,
          game_type: "Tic_tac_toe",
          game_id: this.state.game_id,
        })
        .then(
          (response) => {
            alert("You won! Click ok and wait for your next game to start!");
            console.log(
              "gamemaster/update_tournament with success",
              response.data.gameid
            );
            if (response.data.gameid !== "over") {
              this.setState((state) => ({ game_id: response.data.gameid }));
              socket.emit("start", {
                username: this.state.username,
                game_id: response.data.gameid,
                game_type: "Tic_tac_toe",
              });
            }
          },
          (error) => {
            console.log("gamemaster/update_tournament Error", error);
          }
        );
      console.log("checkEnd", this.state.winner);
    }
  }

  handleMove(i) {
    if (
      this.state.board[i] !== null ||
      this.state.active !== "1" ||
      this.state.username !== this.state.turn
    ) {
      return;
    }
    this.setState((state) => {
      const board = state.board.map((item, j) => {
        if (j === i && this.state.username !== this.state.player1) {
          return "X";
        } else if (j === i && this.state.username !== this.state.player2) {
          return "O";
        } else {
          return this.state.board[j];
        }
      });
      return {
        board,
      };
    });
    if (this.state.turn === this.state.player1) {
      this.setState({ turn: this.state.player2 });
    } else {
      this.setState({ turn: this.state.player1 });
    }
    setTimeout(() => {
      this.checkEnd();
      setTimeout(() => {
        socket.emit("set_state", {
          game_id: this.state.game_id,
          game_type: this.state.game_type,
          player1: this.state.player1,
          player2: this.state.player2,
          board: this.state.board,
          turn: this.state.turn,
          active: this.state.active,
          winner: this.state.winner,
          tournament: this.state.tournament,
        });
      }, 10);
      return;
    }, 10);
  }

  componentDidMount() {
    this.setState((state) => ({ username: checkCookie() }));
    var that = this;
    socket.on("error", function (err) {
      console.log("Error: ", err);
    });
    socket.on("playing", function (data) {
      that.setState((state) => ({ game_id: data.game_id }));
      that.setState((state) => ({ game_type: data.game_type }));
      that.setState((state) => ({ player1: data.player1 }));
      that.setState((state) => ({ player2: data.player2 }));
      that.setState((state) => ({ board: data.board }));
      that.setState((state) => ({ turn: data.turn }));
      that.setState((state) => ({ active: data.active }));
      that.setState((state) => ({ winner: data.winner }));
      that.setState((state) => ({ tournament: data.tournament }));
      that.setState((state) => ({ waiting: false }));
    });
    socket.on("waiting", function () {
      that.setState((state) => ({ waiting: true }));
      setTimeout(function () {
        socket.emit("get_state", {
          game_id: that.state.game_id,
        });
      }, 1000);
    });
    socket.on("response get_state", function (game_info) {
      if (game_info.turn === that.state.username && game_info.active !== "0") {
        that.setState((state) => ({ game_id: game_info.game_id }));
        that.setState((state) => ({ game_type: game_info.game_type }));
        that.setState((state) => ({ player1: game_info.player1 }));
        that.setState((state) => ({ player2: game_info.player2 }));
        that.setState((state) => ({ board: game_info.board }));
        that.setState((state) => ({ turn: game_info.turn }));
        that.setState((state) => ({ active: game_info.active }));
        that.setState((state) => ({ winner: game_info.winner }));
        that.setState((state) => ({ tournament: game_info.tournament }));
        that.setState((state) => ({ waiting: false }));
      } else if (game_info.active === "0" && game_info.winner !== "0") {
        if (game_info.winner === "3") {
          alert("It's a tie");
        } else if (game_info.winner === "2") {
          if (game_info.player2 === that.state.username) {
            alert("You won!");
          } else {
            alert("Sorry, you lost!");
          }
        } else {
          if (game_info.player1 === that.state.username) {
            alert("You won!");
          } else {
            alert("Sorry, you lost!");
          }
        }
      } else {
        socket.emit("get_state", {
          game_id: that.state.game_id,
        });
      }
    });
  }

  handleSubmit = async (event) => {
    if (typeof this.props.location.state !== "undefined") {
      if (!!this.props.location.state.game_id) {
        socket.emit("start", {
          username: this.state.username,
          game_id: this.props.location.state.game_id,
          game_type: "Tic_tac_toe",
        });
        this.setState((state) => ({
          game_id: this.props.location.state.game_id,
        }));
        this.setState((state) => ({ tournament: true }));
        this.setState((state) => ({ game_type: "Tic_tac_toe" }));
        this.btn.setAttribute("disabled", "disabled");
      } else {
        await axios
          .post("http://localhost:80/gamemaster/starttictactoe", this.state)
          .then(
            (response) => {
              this.setState((state) => ({ game_id: response.data.gameid }));
              console.log("Game ID: ", this.state.game_id);
            },
            (error) => {
              console.log("gamemaster/StartTicTacToe Error", error);
            }
          );
        socket.emit("start", {
          username: this.state.username,
          game_id: this.state.game_id,
          game_type: "Tic_tac_toe",
        });
        this.setState((state) => ({ game_type: "Tic_tac_toe" }));
        this.btn.setAttribute("disabled", "disabled");
      }
    } else {
      if (this.state.game_id === "") {
        await axios
          .post("http://localhost:80/gamemaster/starttictactoe", this.state)
          .then(
            (response) => {
              this.setState((state) => ({ game_id: response.data.gameid }));
              console.log("Game ID: ", this.state.game_id);
            },
            (error) => {
              console.log("gamemaster/StartTicTacToe Error", error);
            }
          );
      }
      socket.emit("start", {
        username: this.state.username,
        game_id: this.state.game_id,
        game_type: "Tic_tac_toe",
      });
      this.setState((state) => ({ game_type: "Tic_tac_toe" }));
      this.btn.setAttribute("disabled", "disabled");
    }
  };

  renderSquare(i) {
    return (
      <Square value={this.state.board[i]} onClick={() => this.handleMove(i)} />
    );
  }

  renderWaiting() {
    if (this.state.waiting) {
      return <Spinner animation="border" />;
    }
    return <h4>Playing...</h4>;
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </Row>
        <Row className="justify-content-md-center">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </Row>
        <Row className="justify-content-md-center">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </Row>
        <Row className="justify-content-md-center">{this.renderWaiting()}</Row>
        <Row className="justify-content-md-center playbtn">
          <Col className="justify-content-md-center">
            <Button
              ref={(btn) => {
                this.btn = btn;
              }}
              onClick={this.handleSubmit}
            >
              Play!
            </Button>
          </Col>
          <Col className="justify-content-md-center">
            <Button href="./dashboard">Exit</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Tictactoe;
