import React, { Component } from "react";
import {
  Container,
  Button,
  Col,
  Row,
  ListGroup,
  Dropdown,
  Table,
} from "react-bootstrap";
import { checkCookie, checkUser } from "../Authentication/cookies";
import axios from "axios";

import My_Chess from "./Chess";
import TicTacToe from "./Tictactoe";

function Item(props) {
  console.log(props.item);
  if (props.item.tour_id === null) {
    return <h3> Loading Live Tournaments </h3>;
  } else {
    return (
      <tr>
        <td onClick={props.onClick}>{props.item.game_type}</td>
        <td onClick={props.onClick}>{props.item.tour_id}</td>
        <td onClick={props.onClick}>{props.item.current_players}</td>
        <Button onClick={props.onClick}>Join Tournament</Button>
      </tr>
    );
  }
}

function Create(props) {
  return <Dropdown.Item onClick={props.onClick}>{props.type}</Dropdown.Item>;
}

class Tournament extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      tour_list: [],
      first_time: true,
      choice: "",
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    console.log(this.state.first_time);
    if (this.state.first_time) {
      console.log("componentdidmount");
      axios.get("http://localhost:80/gamemaster/Tour_list").then((response) => {
        const tour_list = response.data.items;
        console.log("Tournament List: ", tour_list);
        this.setState({ tour_list });
      });
      this.setState({ first_time: false });
    }
  }

  componentDidUpdate() {
    //Fetch the list every 5 seconds
    setTimeout(() => {
      console.log("request");
      axios.get("http://localhost:80/gamemaster/Tour_list").then((response) => {
        const tour_list = response.data.items;
        console.log("Tournament List: ", tour_list);
        this.setState({ tour_list });
      });
    }, 5000);
  }

  renderGreetings() {
    if (
      this.state.user_role === "admin" ||
      this.state.user_role === "official"
    ) {
      return (
        <h4>
          Welcome {this.state.username}! You have {this.state.user_role} rights!
          Please what game type tournament you would like to create
        </h4>
      );
    }
    return (
      <h4>
        Welcome {this.state.username}! Please what game type tournament you
        would like to join
      </h4>
    );
  }

  renderOfficial() {
    if (
      this.state.user_role === "admin" ||
      this.state.user_role === "official"
    ) {
      return (
        <Row>
          <div> Or just create a new tournament</div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Create
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Create
                name={"Chess"}
                onClick={() => this.handleCreate("Chess")}
              />
              <Create
                name={"TicTacToe"}
                onClick={() => this.handleCreate("Tic_tac_toe")}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      );
    }
    return null;
  }

  handleCreate = async (game_type) => {
    await axios
      .post("http://localhost:80/gamemaster/start_Tour", {
        game_type: game_type,
        user_role: checkUser(),
      })
      .then((response) => {
        console.log(response.data, game_type);
      });
  };

  renderChess() {
    return <My_Chess />;
  }

  renderTicTacToe() {
    return <TicTacToe />;
  }

  handleClick(choice) {
    console.log("i chooooooooose: ", choice);
    this.setState({ choice });
    axios
      .post("http://localhost:80/gamemaster/join_Tour", {
        tour_id: choice,
        username: checkCookie(),
      })
      .then((response) => {
        console.log(response.data, choice);
      });
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col md="auto">{this.renderGreetings()}</Col>
        </Row>
        <Row>
          <h4>Join a tournament based on the game you prefer</h4>
        </Row>
        <Row className="justify-content-md-center">
          <Col>{this.renderOfficial()}</Col>
        </Row>
        <Row>
          <Col md="auto">
            <Button className="dashboard" href="./logout">
              Logout
            </Button>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover>
            <thread>
              <tr>
                <th> Game Type </th>
                <th> Tournament ID </th>
                <th> Current Players </th>
              </tr>
            </thread>
            <tbody>
              {this.state.tour_list.map((item, index) => (
                <Item
                  key={index}
                  item={item}
                  onClick={() => this.handleClick(item.tour_id)}
                />
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default Tournament;