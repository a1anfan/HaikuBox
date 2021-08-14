import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {
  UserRegistration,
  UsernameValidation,
} from '../services/RegistrationService';
import Message from '../elements/Message';
import Error from '../elements/Error';

export default class Register extends Component {
  constructor (props) {
    super (props);
    this.state = {
      first_name: '',
      last_name: '',
      user_name: '',
      password: '',
      register: false,
      error: false,
    };
  }

  handleOnChangeFirstName = e => {
    this.setState ({
      first_name: e.target.value,
    });
  };

  handleOnChangeLastName = e => {
    this.setState ({
      last_name: e.target.value,
    });
  };

  handleOnChangeUserName = e => {
    this.setState ({
      user_name: e.target.value,
    });
  };

  handleOnChangePassword = e => {
    this.setState ({
      password: e.target.value,
    });
  };

  handleOnBlur = async e => {
    this.setState ({
      user_name: e.target.value,
    });
    const data = {
      user_name: this.state.user_name,
    };
    const isUsernameTaken = await UsernameValidation (data);

    isUsernameTaken === 204
      ? this.setState ({user_name_taken: true})
      : this.setState ({user_name_taken: false});
  };

  onSubmit = async e => {
    e.preventDefault ();
    const data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      user_name: this.state.user_name,
      password: this.state.password,
    };

    const registerStatus = await UserRegistration (data);
    if (registerStatus === 200) {
      this.setState ({
        first_name: '',
        last_name: '',
        user_name: '',
        password: '',
        register: true,
        error: false,
      });
    } else
      this.setState ({
        error: true,
        register: false,
      });
  };

  render () {
    const {register, error, user_name_taken} = this.state;

    return (
      <div className="Registration">
        <h1> Register </h1> <form
          onSubmit={this.onSubmit}>
          <div>
            </div> <div className="fields">
              <p> Username </p>
              {' '}
              <input
                type="text"
                className={classNames ({error: user_name_taken})}
                value={this.state.user_name}
                name="Username"
                onBlur={this.handleOnBlur}
                onChange={this.handleOnChangeUserName}
                autoComplete="Username"
                required
              />
            </div> <div className="fields">
              <p> Password </p>
              {' '}
              <input
                type="password"
                value={this.state.password}
                name="Password"
                onChange={this.handleOnChangePassword}
                autoComplete="password"
                required
              />
            </div> <div className="buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={user_name_taken}
              >
                {' '}Register{' '}
              </button>
              {' '}
              <Link to="/login"> Already have an account? </Link>
              {' '}
            </div>{' '}
        </form>
        {' '}
        {error && <Error message="There was an error registering your account." />}
        {' '}
        {register && <Message message="Your account has been registered successfully!" />}
        {' '}
      </div>
    );
  }
}