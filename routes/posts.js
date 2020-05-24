var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Posts = require('../models/posts');
const config = require('../config');
const authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.get('/all', (req, res, next) => {
  Posts.find({})
  .populate("postedBy", "_id name")
  .then((posts) => {
    res.json(posts);
  }, (err) => next(err)).catch((err) => next(err));
});

router.post('/createpost', authenticate.verifyUser, (req, res, next) => {
  const{title, body, pic} = req.body;
  if (!title || !body || !pic) {
    res.statusCode = 422;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: "Please fill all the fields"});
    return;
  }
  Posts.create({title: title, body: body, photo: pic, postedBy: req.user})
  .then((post) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(post);
  }, (err) => next(err)).catch((err) => next(err));
});

router.get('/myposts', authenticate.verifyUser, (req, res, next) => {
  Posts.find({postedBy: req.user._id})
  .populate("postedBy", "_id name")
  .then((posts ) => {
    res.json(posts);
  }, (err) => next(err)).catch((err) => next(err));
});


module.exports = router;