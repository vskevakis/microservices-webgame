import React, { Component } from 'react';
// import { Provider } from 'unstated'
// import logo from './logo.svg';
import './App.css';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';


import Nav from './Components/Nav'
import Routes from './Components/Routes'
// import Login from './Components/Login';
// import Register from './Components/Register';
// import Home from './Components/Home';

class App extends Component {
  render() {
    return (
      // <Provider inject={[UserContainer]}>
        <Router>
          <div className="wrapper">
            <Nav/>
            <Routes/>
          </div>
        </Router>
      // </Provider>
    );
  }
//   render() {
//     return (
//       <Router>
//         <div className="App">
//           <header className="App-header">
//             <img src={logo} className="App-logo" alt="logo" />
//             <h1 className="App-title">Please Login</h1>
//             <Link to="/">Home</Link>
//             <Link to="/register">Register</Link>
//             <Link to="/login">Login</Link>
//           </header>
//           <div>
//             <Route exact path="/" component={Home} />
//             <Route path="/register" component={Register} />
//             <Route path="/login" component={Login} />
//           </div>
//         </div>
//       </Router>
//     );
//   }
}

export default App;
