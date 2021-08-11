import React, {Component} from 'react';
import '../style.css'
import User from './User'

export default class UserContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {users: []};
	}

	componentDidMount() {
		let currentComponent = this;
		fetch('http://localhost:8999/api/users/')
			.then(
				function(response) {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' +
					response.status);
					return;
				}

				response.json().then(function(data) {
					console.log(data);
					currentComponent.setState({users: data});
				});
			}
		)
		.catch(function(err) {
			console.log('Fetch Error :-S', err);
		});
		console.log('Fetch to get users has been attempted.');
	}

	render() {
		return (
			<div>
				{this.state.users.map((user) => (
					<User key={user._id} name={user.name} desc={user.desc} />
				))}
			</div>
		);
	}
}
