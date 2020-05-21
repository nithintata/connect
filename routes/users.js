var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

    Users.create(req.body)
    .then((user) => {
      console.log("User Created Successfully");
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    }, (err) => next(err)).catch((err) => next(err));
  }, (err) => next(err)).catch((err) => next(err));
});

module.exports = router;
