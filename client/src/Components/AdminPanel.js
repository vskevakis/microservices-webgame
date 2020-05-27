import React, { Component } from "react";
import {
  Container,
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from "react-bootstrap";
import { checkCookie, checkUser } from "../Authentication/cookies";
import axios from "axios";

function User(props) {
  console.log(props.users);
  return (
    <tr>
      <td>{props.users.username}</td>
      <td>{props.users.email}</td>
      <td>{props.users.user_role}</td>
      <td>
        <DropdownButton
          as={ButtonGroup}
          title="Change Role"
          id="bg-nested-dropdown"
        >
          <Dropdown.Item onClick={props.onClickAdmin}>Make Admin</Dropdown.Item>
          <Dropdown.Item onClick={props.onClickOfficial}>
            Make Official
          </Dropdown.Item>
        </DropdownButton>
      </td>
    </tr>
  );
}

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      users_list: [],
      users_fetched: false,
    };
    this.setState = this.setState.bind(this);
  }

  fetchUsersList() {
    axios.get("http://localhost:80/auth/get_users").then((response) => {
      const users_list = response.data.users_list;
      console.log("users fetched");
      this.setState({ users_list: users_list, users_fetched: true });
    });
  }

  handleClick(user, role) {
    if (user.username === this.state.username) {
      alert("You cannot change your own role!");
    } else {
      axios
        .post("http://localhost:80/auth/change_role", {
          username: user.username,
          user_role: role,
        })
        .then((response) => {
          console.log("User Role Changed");
        });
    }
    this.fetchUsersList();
  }

  render() {
    return (
      <Container bsPrefix="my-container">
        {this.state.users_fetched ? null : this.fetchUsersList()}
        <Row className="justify-content-md-center">
          <h4>
            Good to have you back {this.state.username}! This is your admin
            panel. You can promote users to Officials or Admins!
          </h4>
        </Row>
        <Row>
          <Table responsive striped bordered hover>
            <thread>
              <tr>
                <th> Username </th>
                <th> Email </th>
                <th> User Role </th>
              </tr>
            </thread>
            <tbody>
              {this.state.users_list.map((user, index) => (
                <User
                  key={index}
                  users={user}
                  onClickAdmin={() => this.handleClick(user, "admin")}
                  onClickOfficial={() => this.handleClick(user, "official")}
                />
              ))}
            </tbody>
          </Table>
        </Row>
        <Row className="justify-content-md-right">
          <Col md="auto">
            <Button className="dashboard" href="./dashboard">
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AdminPanel;
