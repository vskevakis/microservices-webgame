import React from "react";
import { Button, Row, Container, Col } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { checkCookie } from "../Authentication/cookies";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import Chessboard from "chessboardjsx";

const socket = io.connect();

const url = process.env.REACT_APP_SERVICE_URL;

class MyChess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: "start",
      username: "",
      game_type: "Chess",
      game_id: "",
      player1: "",
      player2: "",
      board: "start",
      turn: "",
      active: "",
      winner: "",
      tournament: false,
      waiting: "waitting to press play",
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    this.game = new Chess();

    this.setState((state) => ({ username: checkCookie() }));
    var that = this;
    that.game.load(that.state.board);
    socket.on("error", function (err) {
      //console.log("Error: ", err);
    });
    socket.on("playing", function (data) {
      //console.log("Playing",data.game_id);
      that.setState((state) => ({ game_id: data.game_id }));
      that.setState((state) => ({ player1: data.player1 }));
      that.setState((state) => ({ player2: data.player2 }));
      that.setState((state) => ({ board: data.board }));
      that.setState((state) => ({ turn: data.turn }));
      that.setState((state) => ({ active: data.active }));
      that.setState((state) => ({ winner: data.winner }));
      that.setState((state) => ({ tournament: data.tournament }));
      //useless atm not saving it at memory//useless atm not saving it at memory
      that.setState((state) => ({ waiting: "playing" }));
      console.log("playing,that.state.board", that.state.board);
      that.setState((state) => ({ fen: that.state.board }));
      that.game.load(that.state.board);
    });
    socket.on("waiting", function () {
      setTimeout(function () {
        //console.log("Waiting33");
        socket.emit("get_state", {
          game_id: that.state.game_id,
        });
      }, 1500);
    });
    socket.on("response get_state", function (game_info) {
      //console.log("Waiting22",game_info.turn,that.state.username);
      if (game_info.turn === that.state.username && game_info.active !== "0") {
        //console.log("response in");
        that.setState((state) => ({ game_id: game_info.game_id }));
        that.setState((state) => ({ player1: game_info.player1 }));
        that.setState((state) => ({ player2: game_info.player2 }));
        that.setState((state) => ({ board: game_info.board }));
        that.setState((state) => ({ turn: game_info.turn }));
        that.setState((state) => ({ active: game_info.active }));
        that.setState((state) => ({ winner: game_info.winner }));
        that.setState((state) => ({ tournament: game_info.tournament }));
        //useless atm not saving it at memory
        console.log("response get_state,that.state.board", that.state.board);
        that.setState((state) => ({ fen: that.state.board }));
        that.game.load(that.state.board);
        if (that.game.in_check()) {
          console.log("Check");
          //useless atm not saving it at memory
          that.setState((state) => ({ waiting: "Check" }));
        } else {
          that.setState((state) => ({ waiting: "playing" }));
        }
      } else if (game_info.active === "0" && game_info.winner !== "0") {
        that.setState((state) => ({ waiting: "waiting to press play " }));
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
          game_type: "Chess",
        });
        this.setState((state) => ({
          game_id: this.props.location.state.game_id,
        }));
        this.setState((state) => ({ tournament: true }));
        this.setState((state) => ({ game_type: "Chess" }));
        this.setState((state) => ({
          waiting: "waiting for second player to join",
        }));
        this.btn.setAttribute("disabled", "disabled");
      } else {
        await axios.post(url + "/gamemaster/start_Chess", this.state).then(
          (response) => {
            this.setState((state) => ({ game_id: response.data.gameid }));
            console.log("Game ID: ", this.state.game_id);
          },
          (error) => {
            console.log("gamemaster/start_Chess Error", error);
          }
        );
        socket.emit("start", {
          username: this.state.username,
          game_id: this.state.game_id,
          game_type: "Chess",
        });
        this.setState((state) => ({ game_type: "Chess" }));
        this.setState((state) => ({
          waiting: "waiting for second player to join",
        }));
        this.btn.setAttribute("disabled", "disabled");
      }
    } else {
      if (this.state.game_id === "") {
        await axios.post(url + "/gamemaster/start_Chess", this.state).then(
          (response) => {
            this.setState((state) => ({ game_id: response.data.gameid }));
            console.log("Game ID: ", this.state.game_id);
          },
          (error) => {
            console.log("gamemaster/start_Chess Error", error);
          }
        );
      }
      socket.emit("start", {
        username: this.state.username,
        game_id: this.state.game_id,
        game_type: "Chess",
      });
      this.setState((state) => ({ game_type: "Chess" }));
      this.setState((state) => ({
        waiting: "waiting for second player to join",
      }));
      this.btn.setAttribute("disabled", "disabled");
    }
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    console.log("Source Target Move", sourceSquare, targetSquare, move);

    // illegal move
    if (
      move === null ||
      this.state.active !== "1" ||
      this.state.username !== this.state.turn
    )
      return "snapback";
    if (this.state.turn === this.state.player1) {
      //console.log("next turn if palyer2",this.state.player2);
      this.setState({ turn: this.state.player2 });
    } else {
      //console.log("next turn else player1",this.state.player1);
      this.setState({ turn: this.state.player1 });
    }
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      //squareStyles: squareStyling({ pieceSquare, history })
    }));
    this.setState((state) => ({ board: this.game.fen() }));
    this.updateStatus();

    setTimeout(() => {
      //console.log("checkEnd",this.state.active,this.state.winner ,this.state.board);
      socket.emit("set_state", {
        game_id: this.state.game_id,
        player1: this.state.player1,
        player2: this.state.player2,
        board: this.state.board,
        turn: this.state.turn,
        active: this.state.active,
        winner: this.state.winner,
        tournament: this.state.tournament,
      });
    }, 10);
    setTimeout(() => {
      this.setState((state) => ({ waiting: "waiting" }));
    }, 20);
  };

  updateStatus() {
    if (this.game.in_checkmate()) {
      console.log("CheckMate");
      //useless atm not saving it at memory
      this.setState((state) => ({ waiting: "CheckMate" }));
      if (this.state.username === this.state.player1) {
        this.setState((state) => ({ winner: "1" }));
        this.setState((state) => ({ active: "0" }));
      } else {
        this.setState((state) => ({ winner: "2" }));
        this.setState((state) => ({ active: "0" }));
      }
    }
    // draw?
    else if (this.game.in_draw()) {
      console.log("DrawMate");
      this.setState((state) => ({ waiting: "DrawMate" }));
      this.setState((state) => ({ winner: "3" }));
      this.setState((state) => ({ active: "0" }));
    }
    // game still on
    else {
      console.log("NothingMate");
      // check?
      if (this.game.in_check()) {
        console.log("Check");
        //useless atm not saving it at memory
        this.setState((state) => ({ waiting: "Check" }));
      }
    }
    if (this.state.active === "0" && !this.state.tournament) {
      axios
        .post(url + "/gamemaster/updatescores", {
          player1: this.state.player1,
          player2: this.state.player2,
          winner: this.state.winner,
          game_type: "Chess",
        })
        .then(
          (response) => {
            console.log("gamemaster/updatescores with success", response);
          },
          (error) => {
            console.log("gamemaster/updatescores Error", error);
          }
        );
      //this.setState((state) => ({ game_id: "" }));
    }
    if (this.state.active === "0" && this.state.tournament) {
      axios
        .post(url + "/gamemaster/update_tournament", {
          player1: this.state.player1,
          player2: this.state.player2,
          winner: this.state.winner,
          game_type: "Chess",
          game_id: this.state.game_id,
        })
        .then(
          (response) => {
            alert("You won! Click ok and wait for your next game to start!");
            if (response.data.gameid !== "over") {
              this.setState((state) => ({ game_id: response.data.gameid }));
              this.game.reset();
              this.setState((state) => ({ board: "start" }));
              socket.emit("start", {
                username: this.state.username,
                game_id: response.data.gameid,
                game_type: "Chess",
              });
            }
            console.log("gamemaster/updatescores with success", response);
          },
          (error) => {
            console.log("gamemaster/updatescores Error", error);
          }
        );
      console.log("checkEnd", this.state.winner);
    }
  }

  render() {
    return (
      <Container fluid>
        <div className="chess-container">
          <Chessboard
            id="My-Chess"
            width={320}
            position={this.state.fen}
            onDrop={this.onDrop}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
          />

          <Row className="justify-content-md-center">{this.state.waiting}</Row>
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
        </div>
      </Container>
    );
  }
}

export default MyChess;
