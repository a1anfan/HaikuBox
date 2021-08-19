import React, {Component} from 'react';
import '../style.css'

export default class User extends Component {
	render() {
		return (
			<div className="haiku">
				<p className="name">{this.props.haiku}</p>
			</div>
		);
	}
}
