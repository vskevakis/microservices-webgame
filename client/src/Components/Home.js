import React, { Component } from 'react'
import { Container, Icon, Segment, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
  render() {
    return (
      <Container className="page">
        <Header as='h1'>
          <Icon name='rocket'/>
          Welcome to our Project!
        </Header>
        <Segment>
          <p>This is a boilerplate app using React for the front-end, and Python + Postgres + Redis for the backend.</p>
          <p>The only things implemented are...</p>
          <ul>
            <li>Account Creation</li>
            <li>User Login</li>
            <li>Some backend boring stuff</li>
          </ul>
          <p><Link to="/signup">Sign Up</Link> Now!.</p>
          <p> Or <Link to="/login">Login</Link> instead!</p>
        </Segment>
      </Container>
    );
  }
}