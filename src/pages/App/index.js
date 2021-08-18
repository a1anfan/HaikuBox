import React, { Component } from 'react';
import './style.css';
import HaikuForm from './Components/HaikuForm';
import {Link} from 'react-router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to="/login">Log In</Link>
        <br></br>
        <Link to="/register">Sign Up</Link>
        <br></br>
        <br></br>
        <HaikuForm />
      </div>
    );
  }
}

export default App;