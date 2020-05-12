import React, { Component } from 'react';
import axios from 'axios';

class Tictactoe extends Component {

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  state = {
    data: []
  }

  handleChange (event) {
    // check it out: we get the event.target.name (which will be either "username" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async event => {
    event.preventDefault();

    const user_data = {
      username: this.state.username,
      password: this.state.password
    }
    await axios.post('http://localhost:80/gamemaster/starttictactoe', user_data
    ).then((response) => {
        alert('Authentication is Successful. Welcome to F-Society, ' + user_data.username);
      }, (error) => {
        alert('Authentication Unsuccesful. Please check your credentials.');
      });
    this.setState({ username: '' , password: '' });
  }




  render() {
    var status;
    if (this.state.data === 3) {
      status = 'Tie Game';
    } else if(this.state.winner)
      status = 'Game over, ' + this.state.winner + ' wins the game!';
    else if(this.state.symbol !== this.state.turnSymbol) {
      status = 'Waiting for ' + this.state.turnSymbol + ' to move ...';
    } else {
      status = 'It\'s your turn to move, ' + this.state.turnSymbol;
    }
    return (
      <div className="centered">
        <div className="status">{status}</div>
        <div className="game-board">
          <div className="box">{this.renderSquare(0)}</div>
          <div className="box">{this.renderSquare(1)}</div>
          <div className="box">{this.renderSquare(2)}</div>
          <div className="box">{this.renderSquare(3)}</div>
          <div className="box">{this.renderSquare(4)}</div>
          <div className="box">{this.renderSquare(5)}</div>
          <div className="box">{this.renderSquare(6)}</div>
          <div className="box">{this.renderSquare(7)}</div>
          <div className="box">{this.renderSquare(8)}</div>
      </div>
        <br />
        <div className="status">
          <button onClick={this.resetGame}>Reset Game</button>
        </div>
      </div>
    );

  }


  }

export default Tictactoe;

// We can add Register Class Here