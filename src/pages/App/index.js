import React, { Component } from 'react';
import './style.css';
import UserContainer from './Components/UserContainer';
import AddPersonForm from './Components/AddPersonForm';
import {Link} from 'react-router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to="/login">Login</Link>
        <br></br>
        <Link to="/register">Register</Link>
        <AddPersonForm />
        <UserContainer />
      </div>
    );
  }
}

export default App;