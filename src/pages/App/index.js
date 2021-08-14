import React, { Component } from 'react';
import './style.css';
import UserContainer from './Components/UserContainer';
import AddPersonForm from './Components/AddPersonForm';
import {Link} from 'react-router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to="/login">Log In</Link>
        <br></br>
        <Link to="/register">Sign Up</Link>
        <AddPersonForm />
        <UserContainer />
      </div>
    );
  }
}

export default App;