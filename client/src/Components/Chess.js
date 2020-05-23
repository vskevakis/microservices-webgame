import React, { Component } from "react";
import { Button, Row, Container, Col } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { checkCookie } from "../Authentication/cookies";
import { Chess } from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import Chessboard from "chessboardjsx";

// var board = Chessboard('myBoard')
// var game = new Chess()
const socket = io.connect();

//function Square(props) {
//  return <Button size="lg" variant="dark" class="Square"></Button>;
//}
function Square(props) {
  return (
    <button className="gamesquare" onClick={props.onClick}>{props.value}</button>
  );
}

class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      game_type:"Chess",
      game_id: "",
      player1: "",
      player2: "",
      board: [],
      turn: "",
      active: "",
      winner: "",
    };
    this.setState = this.setState.bind(this);
  }

  checkEnd() {
    if (this.state.board.every(x => x !== "K")){
        this.setState((state) => ({ active: "0"}));
        this.setState((state) => ({ winner: "1"}));
    }else if (this.state.board.every(x => x !== "k")){
        this.setState((state) => ({ active: "0"}));
        this.setState((state) => ({ winner: "1"}));
    }
    // }else if(this.calculateWinner(this.state.board)==='O'){
    //   this.setState((state) => ({ active: "0"}));
    //   this.setState((state) => ({ winner: "1"}));
    // }else if(this.state.board.every(x => x !== 0)){
    //   this.setState((state) => ({ active: "0"}));
    //   this.setState((state) => ({ winner: "3"}));
    // }
    //console.log("checkEnd,stateactive",this.state.active,this.state.winner ,this.state.board);
    if (this.state.active==="0"){
       axios
       .post("http://localhost:80/gamemaster/updatescores", this.state)
       .then(
         (response) => {console.log("gamemaster/updatescores with success", response);},
         (error) => {
           console.log("gamemaster/updatescores Error", error);
         }
       );
    }
    //console.log("checkEnd",this.state.active,this.state.winner ,this.state.board);
  }

  handleMove(i) {
    //this.checkEnd();
    //console.log(this.state.game_id);
    //console.log("handle move1",i,this.state.active,this.state.turn,this.state.username,this.state.board[i]);
    if(this.state.active!== "1" || this.state.username !== this.state.turn) {
      //console.log("handle move3");
      return;
    }
    //change this to make move
    //console.log("handle move");
    //   this.setState(state => {
    //   const board = state.board.map((item, j) => {
    //     if (j === i && this.state.username !== this.state.player1) {
    //       return 'X';
    //     }else if(j === i && this.state.username !== this.state.player2){
    //       return 'O';
    //     } 
    //     else {
    //       return this.state.board[j];
    //     }
    //   });
    //   return {
    //     board,
    //   };
    //   });
      if (this.state.turn === this.state.player1)
        {//console.log("next turn if palyer2",this.state.player2);
        this.setState({ turn:this.state.player2 });
        }
      else{
        //console.log("next turn else player1",this.state.player1);
        this.setState({ turn:this.state.player1 });
      }
    //console.log("currnet player ,next turn",this.state.username,this.state.turn,this.state.board[i]);
    setTimeout(() => {
      //console.log("checkEnd",this.state.active,this.state.winner ,this.state.board);
      //console.log("currnet player ,next turn",this.state.username,this.state.turn,this.state.board[i],this.state.game_id);
      this.checkEnd();
      setTimeout(() => {
          //console.log("checkEnd",this.state.active,this.state.winner ,this.state.board);
          socket.emit("set_state", {
            game_id : this.state.game_id,
            player1 : this.state.player1,
            player2 : this.state.player2,
            board : this.state.board,
            turn : this.state.turn,
            active : this.state.active,
            winner : this.state.winner
          });
      }, 10);  
      return; 
    }, 10);  
    //console.log("currnet player ,next turn",this.state.username,this.state.turn,this.state.board[i]);
  }


  componentDidMount() {
    this.setState((state) => ({ username: checkCookie()}));
    var that = this;
    socket.on("error", function (err) {
      //console.log("Error: ", err);
    });
    socket.on("playing", function (data) {
      //console.log("Playing",data.game_id);
      that.setState((state) => ({ game_id: data.game_id}));
      that.setState((state) => ({ player1: data.player1}));
      that.setState((state) => ({ player2: data.player2}));
      that.setState((state) => ({ board: data.board}));
      that.setState((state) => ({ turn: data.turn}));
      that.setState((state) => ({ active: data.active}));
      that.setState((state) => ({ winner: data.winner}));

    });
    socket.on("waiting", function () {
      //console.log("Waiting");
      //console.log("Waiting",that.state.game_id);
      setTimeout(function () {
        //console.log("Waiting33");
        socket.emit("get_state",  {
          game_id : that.state.game_id
        });
      }, 1500);
    });

    socket.on("response get_state", function (game_info) {
      //console.log("Waiting22",game_info.turn,that.state.username);
      if (game_info.turn === that.state.username && game_info.active!=='0') {
        //console.log("response in");
        that.setState((state) => ({ game_id: game_info.game_id}));
        that.setState((state) => ({ player1: game_info.player1}));
        that.setState((state) => ({ player2: game_info.player2}));
        that.setState((state) => ({ board: game_info.board}));
        that.setState((state) => ({ turn: game_info.turn}));
        that.setState((state) => ({ active: game_info.active}));
        that.setState((state) => ({ winner: game_info.winner}));
      }else if(game_info.active==='0' && game_info.winner!=='0'){
        //setTimeout(function () {alert("gameover");}, 1000);
        if (game_info.winner==="3"){
          alert("It's a tie");
        }else if (game_info.winner==="2"){
          alert("Player 2 won :"+ game_info.player2);
        }else{
          alert("Player 1 won :" + game_info.player1);
        }
      }
      else{
        //console.log("response else");
        socket.emit("get_state",  {
          game_id : that.state.game_id
        });
      }

    });
  }

  handleSubmit = async (event) => {
    await axios
      .post("http://localhost:80/gamemaster/start_Chess", this.state)
      .then(
        (response) => {
          this.setState((state) => ({ game_id: response.data.gameid}));
          //console.log("Game ID: ", this.state.game_id);

          //console.log("start ", this.state.game_id);
        },
        (error) => {
          //console.log("gamemaster/StartTicTacToe Error", error);
        }
      );
      socket.emit("start", { 
        username: this.state.username,
        game_id: this.state.game_id,
        game_type :"Chess"
      });
    //console.log("username: ", this.state.username, this.state.game_id);
  };

  renderSquare(i) {
    return (
      <Square
        value={this.state.board[i]}
        onClick={() => this.handleMove(i)}
      />
    );
  }

  render() {
    return (
      <Container fluid>

        <div style={boardsContainer}>
          <WithMoveValidation />
        </div>
        <Row className="justify-content-md-center">{this.renderWaiting()}</Row>
        <Row className="justify-content-md-center playbtn">
          <Col className="justify-content-md-center">
            <Button ref={btn => { this.btn = btn; }}  onClick={this.handleSubmit}>Play!</Button>
          </Col>
        <Col className="justify-content-md-center">
            <Button href="./dashboard">Exit</Button>
        </Col>
        </Row>
      </Container>
    );
  }
}

export default Chess;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50
};