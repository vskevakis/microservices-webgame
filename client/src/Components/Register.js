import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {

  constructor () {
    super();
    this.state = {
      username: '',
      password: '',
      email: ''
    };
    this.handleChange = this.handleChange.bind(this);
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
      email: this.state.email,
      password: this.state.password
    }

    await axios.post('http://localhost:80/auth/register', user_data
    ).then((response) => {
        alert('User registered successfully. Welcome to F-Society, ' + user_data.username);
      }, (error) => {
        alert('Registration Unsuccesful. Please check your credentials.');
      });
    this.setState({ username: '' , email: '', password: '' });
  }
    


    
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
      
        <label>Username</label>
        <input type="text" name="username" onChange={this.handleChange} />
        <br/>
        <label>Email</label>
        <input type="email" name="email" onChange={this.handleChange} />
        <br/>
        <label>Password</label>
        <input type="password" name="password" onChange={this.handleChange} />
        <br/>
        <button>Submit</button>

      </form>
    );
  }
  }

export default Register;