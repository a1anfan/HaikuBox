import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route } from 'react-router';
import './index.css';

import App from './pages/App';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Me from './pages/Me';
import NotFound from './pages/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/me" component={Me} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(
  <Routes history={hashHistory} />,
  document.getElementById('root')
);
