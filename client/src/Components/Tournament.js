import React, { Component } from "react";
import {
  Container,
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import { checkCookie, checkUser } from "../Authentication/cookies";
import { withRouter } from "react-router-dom";
import axios from "axios";

import MyChess from "./Chess";
import TicTacToe from "./Tictactoe";

function Item(props) {
  console.log(props.item);
  if (props.item.tour_id === null) {
    return <h3> Loading Live Tournaments </h3>;
  } else {
    return (
      <tr>
        <td>{props.item.game_type}</td>
        <td>{props.item.tour_id}</td>
        <td>{props.item.current_players + "/8"}</td>
        <td>
          <Button onClick={props.onClick}>Join Tournament</Button>
        </td>
      </tr>
    );
  }
}

function Create(props) {
  return <Dropdown.Item onClick={props.onClick}>{props.name}</Dropdown.Item>;
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
      axios.get("http://localhost:80/gamemaster/Tour_list").then((response) => {
        const tour_list = response.data.items;
        console.log("Tournament List: ", tour_list);
        this.setState({ tour_list });
      });
    }, 10000);
  }

  renderGreetings() {
    if (
      this.state.user_role === "admin" ||
      this.state.user_role === "official"
    ) {
      return (
        <h4>
          Welcome {this.state.username}! You have {this.state.user_role} rights!
          Please choose what tournament you would like to join.
        </h4>
      );
    }
    return (
      <h4>
        Welcome {this.state.username}! Please choose what tournament you would
        like to join.
      </h4>
    );
  }

  renderOfficial() {
    if (
      this.state.user_role === "admin" ||
      this.state.user_role === "official"
    ) {
      return (
        <Row className="justify-content-md-center">
          <div>
            <h4>Or just create a new tournament</h4>{" "}
          </div>
          <DropdownButton
            as={ButtonGroup}
            title="Create Tournament"
            id="bg-nested-dropdown"
          >
            <Create name={"Chess"} onClick={() => this.handleCreate("Chess")} />
            <Create
              name={"TicTacToe"}
              onClick={() => this.handleCreate("Tic_tac_toe")}
            />
          </DropdownButton>
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
    return <MyChess />;
  }

  renderTicTacToe() {
    return <TicTacToe />;
  }

  handleClick(choice) {
    console.log(
      "i chooooooooose: ",
      choice.tour_id,
      "current players ",
      choice.current_players
    );
    var gameid = "";
    var trash = "";
    axios
      .post("http://localhost:80/gamemaster/join_Tour", {
        tour_id: choice.tour_id,
        username: checkCookie(),
      })
      .then((response) => {
        gameid = response.data.gameid;
        trash = response.data.current_players;
        console.log("Game ID:  ", gameid, "current_players ID:  ", trash);
        if (choice.game_type === "Tic_tac_toe") {
          console.log("Game ID2: ", gameid);
          this.props.history.push({
            //("/tictactoe");
            pathname: "/tictactoe",
            state: { game_id: gameid },
          });
        } else if (choice.game_type === "Chess") {
          this.props.history.push("/chess");
        } else {
          console.log("Invalid Game Type ", choice.game_type);
        }
      });
    console.log(choice.game_type);
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col md="auto">{this.renderGreetings()}</Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>{this.renderOfficial()}</Col>
        </Row>
        <Row>
          <Col md="auto">
            <Button className="dashboard" href="./dashboard">
              Go Back
            </Button>
          </Col>
        </Row>
        <Row>
          <Table responsive striped bordered hover>
            <thread>
              <tr>
                <th> Game Type </th>
              </tr>
            </thread>
            <tbody>
              {this.state.tour_list.map((item, index) => (
                <Item
                  key={index}
                  item={item}
                  onClick={() => this.handleClick(item)}
                />
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Tournament);
