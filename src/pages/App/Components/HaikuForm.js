import React, {Component} from 'react';
import '../style.css';

export default class AddPersonForm extends Component {
    constructor(props) {
        super(props);
        let initialState = { haiku: "" };
        this.state = initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({haiku: event.target.haiku});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        var username = localStorage.getItem('username');
        if (username === null) username = 'anonymous';
        console.log(`The username rn is ${username}`);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({'username': username, 'haiku': this.state.haiku}),
            headers: {'Content-Type': 'application/json'}
        };
        this.setState(() => this.initialState);
        return fetch('/api/haiku/', requestOptions)
            .then(response => response.json())
            .then(data => console.log(`Data: ${data}`))
            //.then(window.location.replace('/')); // reloads this page
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <textarea name="haikuText" rows="3" cols="90" wrap="hard" maxLength="270" required></textarea>
                <br></br>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}