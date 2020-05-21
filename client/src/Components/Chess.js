import React, { Component } from "react";
import { Button, Row, Container, Col } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { checkCookie } from "../Authentication/cookies";

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

        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(0)}</Col>
          <Col xl="auto">{this.renderSquare(1)}</Col>
          <Col xl="auto">{this.renderSquare(2)}</Col>
          <Col xl="auto">{this.renderSquare(3)}</Col>
          <Col xl="auto">{this.renderSquare(4)}</Col>
          <Col xl="auto">{this.renderSquare(5)}</Col>
          <Col xl="auto">{this.renderSquare(6)}</Col>
          <Col xl="auto">{this.renderSquare(7)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(8)}</Col>
          <Col xl="auto">{this.renderSquare(9)}</Col>
          <Col xl="auto">{this.renderSquare(10)}</Col>
          <Col xl="auto">{this.renderSquare(11)}</Col>
          <Col xl="auto">{this.renderSquare(12)}</Col>
          <Col xl="auto">{this.renderSquare(13)}</Col>
          <Col xl="auto">{this.renderSquare(14)}</Col>
          <Col xl="auto">{this.renderSquare(15)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(16)}</Col>
          <Col xl="auto">{this.renderSquare(17)}</Col>
          <Col xl="auto">{this.renderSquare(18)}</Col>
          <Col xl="auto">{this.renderSquare(19)}</Col>
          <Col xl="auto">{this.renderSquare(20)}</Col>
          <Col xl="auto">{this.renderSquare(21)}</Col>
          <Col xl="auto">{this.renderSquare(22)}</Col>
          <Col xl="auto">{this.renderSquare(23)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(24)}</Col>
          <Col xl="auto">{this.renderSquare(25)}</Col>
          <Col xl="auto">{this.renderSquare(26)}</Col>
          <Col xl="auto">{this.renderSquare(27)}</Col>
          <Col xl="auto">{this.renderSquare(28)}</Col>
          <Col xl="auto">{this.renderSquare(29)}</Col>
          <Col xl="auto">{this.renderSquare(30)}</Col>
          <Col xl="auto">{this.renderSquare(31)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(32)}</Col>
          <Col xl="auto">{this.renderSquare(33)}</Col>
          <Col xl="auto">{this.renderSquare(34)}</Col>
          <Col xl="auto">{this.renderSquare(35)}</Col>
          <Col xl="auto">{this.renderSquare(36)}</Col>
          <Col xl="auto">{this.renderSquare(37)}</Col>
          <Col xl="auto">{this.renderSquare(38)}</Col>
          <Col xl="auto">{this.renderSquare(39)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(40)}</Col>
          <Col xl="auto">{this.renderSquare(41)}</Col>
          <Col xl="auto">{this.renderSquare(42)}</Col>
          <Col xl="auto">{this.renderSquare(43)}</Col>
          <Col xl="auto">{this.renderSquare(44)}</Col>
          <Col xl="auto">{this.renderSquare(45)}</Col>
          <Col xl="auto">{this.renderSquare(46)}</Col>
          <Col xl="auto">{this.renderSquare(47)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(48)}</Col>
          <Col xl="auto">{this.renderSquare(49)}</Col>
          <Col xl="auto">{this.renderSquare(50)}</Col>
          <Col xl="auto">{this.renderSquare(51)}</Col>
          <Col xl="auto">{this.renderSquare(52)}</Col>
          <Col xl="auto">{this.renderSquare(53)}</Col>
          <Col xl="auto">{this.renderSquare(54)}</Col>
          <Col xl="auto">{this.renderSquare(55)}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xl="auto">{this.renderSquare(56)}</Col>
          <Col xl="auto">{this.renderSquare(57)}</Col>
          <Col xl="auto">{this.renderSquare(58)}</Col>
          <Col xl="auto">{this.renderSquare(59)}</Col>
          <Col xl="auto">{this.renderSquare(60)}</Col>
          <Col xl="auto">{this.renderSquare(61)}</Col>
          <Col xl="auto">{this.renderSquare(62)}</Col>
          <Col xl="auto">{this.renderSquare(63)}</Col>
        </Row>
        <Button onClick={this.handleSubmit}>PLAY!</Button>
      </Container>
    );
  }
}

export default Tictactoe;
