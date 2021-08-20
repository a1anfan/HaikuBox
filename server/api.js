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

  
// router.get('/users', (req, res) => {
//   User.find((err, users) => {
//     if(err) {
//       console.log(err);
//       res.send([]);
//     } else {
//       res.json(users);
//     }
//   });
// });

router.post('/haiku', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(userToUpdate => {
      if (!userToUpdate) res.sendStatus(204); // 'No content' status
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
        if (!user) res.sendStatus(204); // 'No content' status
        else {
            bcrypt.compare(req.body.password, user.password)
              .then(passwordMatch => passwordMatch ? res.sendStatus(200) : res.sendStatus(204))
              .then(jwt.sign(user.toJSON(), 'secret_key', {expiresIn: '2d'}, (err, token) => { // Token expires in two days
                if (err) {
                  console.log(err);
                } else {
                  console.log(token);
                  console.log(user.username);
                  res.json(token);
                  // localStorage.setItem('access_token', token);
                  // localStorage.setItem('username', user.username);
                  console.log("Put stuff in local storage");
                }
              }))
              .then(console.log("User has successfully logged in and token has been generated."));
        }
    })
});

router.post('/validateUsername', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => user ? res.sendStatus(204) : res.sendStatus(200));
});

// router.get('/users', (req, res) => {
//   User.find((err, users) => {
//     if(err) {
//       console.log(err);
//       res.send([]);
//     } else {
//       res.json(users);
//     }
//   });
// });

router.get('/me', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secret_key', (err, authData) => {
    if (err) { // Token is invalid
      console.log(err);
      res.sendStatus(403); // Send 'Forbidden' status
      // TODO: Redirect to login page
    } else {
      User.findOne({ username: req.body.username })
        .then(user => {
          if (!user) res.sendStatus(204); // Send 'No Content' status
          else {
            res.json(user.haikus);
          }
        });
    }
  });
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['token'];
  // console.log(bearerHeader + " haiiiii westoo");
  // console.log(typeof bearerHeader);
  // haiiii
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    bearerToken = bearer[1]; // Parses the header to get the token
    req.token = bearerToken;
    next();
  } else { // Token is invalid
    res.sendStatus(403) // Send 'Forbidden' status
    location.replace('/login'); // Redirect to login page
  }
}

module.exports = router;