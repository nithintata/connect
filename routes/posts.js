var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Posts = require('../models/posts');
const config = require('../config');
const authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.get('/all', authenticate.verifyUser, (req, res, next) => {
  Posts.find({})
  .populate("postedBy", "_id name")
  .populate("comments.postedBy", "_id name")
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
  .populate("comments.postedBy", "_id name")
  .then((posts ) => {
    res.json(posts);
  }, (err) => next(err)).catch((err) => next(err));
});

router.put('/like', authenticate.verifyUser, (req, res, next) => {
  Posts.findByIdAndUpdate(req.body.postId, {
    $push:{likes:req.user._id}
  },{new: true})
  .populate("postedBy", "_id name")
  .populate("comments.postedBy", "_id name")
  .exec((err, result) => {
     if (err) {
       return res.status(422).json({error: err})
     }
     else {
       res.json(result)
     }
  })
})

router.put('/unlike', authenticate.verifyUser, (req, res, next) => {
  Posts.findByIdAndUpdate(req.body.postId, {
    $pull:{likes:req.user._id}
  },{new: true})
  .populate("postedBy", "_id name")
  .populate("comments.postedBy", "_id name")
  .exec((err, result) => {
     if (err) {
       return res.status(422).json({error: err})
     }
     else {
       res.json(result)
     }
  })
})

router.put('/comment', authenticate.verifyUser, (req, res, next) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }
  Posts.findByIdAndUpdate(req.body.postId, {
    $push:{comments:comment}
  },{new: true})
  .populate("postedBy", "_id name")
  .populate("comments.postedBy", "_id name")
  .exec((err, result) => {
     if (err) {
       return res.status(422).json({error: err})
     }
     else {
       res.json(result)
     }
  })
})

router.delete('/deletepost/:postId', authenticate.verifyUser, (req, res, next) => {
  Posts.findOne({_id: req.params.postId})
  .populate("postedBy", "_id name")
  .exec((err, post) => {
    if (err || !post) {
      return res.status(422).json({error: err})
    }
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      post.remove()
      .then(result => {
        res.json(result)
      }).catch(err => {
        console.log(err)
      })
    }
  })
})


module.exports = router;
