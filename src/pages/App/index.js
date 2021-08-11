import React, { Component } from 'react';
import './style.css';
import UserContainer from './Components/UserContainer';
import AddPersonForm from './Components/AddPersonForm';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AddPersonForm />
        <UserContainer />
      </div>
    );
  }
}

export default App;