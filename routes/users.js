var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');
const config = require('../config');
const authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/test', authenticate.verifyUser, function(req, res, next) {
  res.send('responded after authentication');
});

/*Registering new Users*/

router.post('/signup', (req, res, next) => {
  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    res.statusCode = 422;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: "Please fill all the fields"});
    return;
  }

  Users.findOne({email:email})
  .then((user) => {
    if (user) {
      res.statusCode = 422;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: "User already exists with this email"});
      return;
    }

    bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      Users.create({name: name, email: email, password: hashedPassword})
      .then((user) => {
        console.log("User Created Successfully");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }, (err) => next(err));

    }, (err) => next(err));

  }, (err) => next(err)).catch((err) => next(err));
});


/*Logging in of registered users*/
router.post('/signin', (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.statusCode = 422;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: "Please fill all the fields"});
    return;
  }

  Users.findOne({email: email})
  .then((user) => {
    if (!user) {
      res.statusCode = 422;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: "User not registered"});
    }
    else {
      bcrypt.compare(password, user.password)
      .then((isSame) => {
        if (isSame) {
          const token = jwt.sign({_id: user._id}, config.secretKey);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({token});
        }
        else {
          res.statusCode = 422;
          res.setHeader('Content-Type', 'application/json');
          res.json({error: "Invalid email or password"});
        }
      }, (err) => next(err));
    }
  }, (err) => next(err)).catch((err) => next(err));
});

module.exports = router;
