// Express router for our API.
// Every URL starting with /api/ will be directed here
// This is a basic CRUD API for our Users MongoDB database

const express = require('express');
var router = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/my_database', { useNewUrlParser: true, useUnifiedTopology: true });


//Define schemas

const haikuSchema = new Schema({
  haiku: {
    type: String,
    required: [true, "can't be blank"],
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

const userSchema = new Schema({
  username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'no special characters allowed in username'],
      index: true,
  },
  password: {
      type: String,
      required: true,
      trim: true
  },
  haikus: [haikuSchema]
});

var User = mongoose.model('User', userSchema);

// If the database is empty, insert some dummy data into it
// User.find((err, users) => {
//   if(users.length == 0) {
//     var testUsers = [
//       { name: 'Alan', desc : 'gamah' },
//       { name: 'Westoo', desc : 'absolute gamah' },
//       { name: 'Ali', desc : 'apex legends player' }
//     ];

//     User.collection.insert(testUsers, (err, users) => { if (err) console.log(err); });
//   }
// });

// Now, we list all of our routes.
// Note that the actual routes you specify here will be prefixed by /api

  
// User.find((err, users) => {
//   if(err) {
//     console.log(err);
//     res.send([]);
//   } else {
//     res.json(users);
//   }
// });

router.post('/haikus', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(userToUpdate => {
      if (!userToUpdate) res.sendStatus(204);
      else {
        if (userToUpdate.haikus !== undefined) {
          userToUpdate.haikus.push(req.body.haiku);
        } else {
          userToUpdate.haikus = [req.body.haiku];
        }
        userToUpdate.save();
      }
    });
});

router.post('/register', (req, res) => {
  let newUser = new User(req.body);
  newUser.save()
    .then(reg => {
        res.sendStatus(200);
    })
    .catch(err => {
        res.status(400).send("Failed to store to database");
    });
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
        console.log("User from login", user)
        if (!user) res.sendStatus(204);
        else {
            bcrypt.compare(req.body.password, user.password)
              .then(passwordMatch => passwordMatch ? res.sendStatus(200) : res.sendStatus(204))
              .then(jwt.sign(user, 'secret_key', {expiresIn: '1d'}, (err, token) => { // Token expires in one day
                res.json({
                  token
              })
              .then(console.log("User has successfully logged in and token has been generated."));
              }));
        }
    })
});

router.post('/validateUsername', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => user ? res.sendStatus(204) : res.sendStatus(200));
});

router.post('/me', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret_key', (err, authData) => {
    if (err) { // Token is invalid
      res.sendStatus(403) // Send 'Forbidden' status
      window.location.replace('login'); // Redirect to login page
    } else {
      User.findOne({ username: req.body.username })
        .then(user => {
          if (!user) res.sendStatus(204);
          else {
            res.json(user.haikus);
          }
        });
    }
  });

})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== undefined) {
    const token = bearerHeader.split(' ')[1]; // Parses the header to get the token
    req.token = token;
    next();
  } else {  // Token is invalid
    res.sendStatus(403) // Send 'Forbidden' status
    window.location.replace('/login'); // Redirect to login page
  }
}

module.exports = router;