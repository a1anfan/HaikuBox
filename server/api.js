// Express router for our API.
// Every URL starting with /api/ will be directed here
// This is a basic CRUD API for our Users MongoDB database

const express = require('express');
var router = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://127.0.0.1/my_database', { useNewUrlParser: true, useUnifiedTopology: true });

//Define our schema for User
var User = mongoose.model('User', {
  username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
  },
  password: {
      type: String,
      required: true,
      trim: true
  }
});

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

//Routed to GET /api/users
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if(err) {
      console.log(err);
      res.send([]);
    } else {
      res.json(users);
    }
  });
});

//Routed to POST /api/users
// router.post('/users', (req, res) => {
//   const newDocument = new User({ name: req.body.name, desc : req.body.desc });
//   newDocument.save();
// });

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
        }
    });
});

router.post('/validateUsername', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => user ? res.sendStatus(204) : res.sendStatus(200));
});

module.exports = router;