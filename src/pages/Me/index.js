import React, { Component } from 'react';
import './style.css';
import HaikuContainer from '../App/Components/HaikuContainer';


export default class Me extends Component {
	render() {
		return (
            <div>
			    <h1>Your haikus</h1>
				<HaikuContainer />
			</div>
		);
	}
}