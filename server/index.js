'use strict';

const express = require('express');
const path = require('path');
const app = express();

// Lets us get the data from a POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

var apiRouter = require('./api')
app.use('/api', apiRouter);

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

//Choose our port and launch the server
let PORT = 8999;
if(process.env.NODE_ENV == 'production'){
  PORT = 80;
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
