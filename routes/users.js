var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');
const Posts = mongoose.model("Post")
const config = require('../config/config');
const authenticate = require('../authenticate');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: config.nodemailer_api
  }
}));
var router = express.Router();
router.use(bodyParser.json());

/*Profile of users*/
router.get('/:userId',authenticate.verifyUser, (req, res, next) => {
  Users.findById(req.params.userId)
  .select("-password")
  .then((user) => {
    if (!user) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: "User not found"});
      return;
    }
    Posts.find({postedBy: req.params.userId})
    .populate("postedBy", "_id, name")
    .then((posts) => {
      if (posts) {
        res.json({user, posts})
      }
    })
  }, (err) => next(err)).catch(err => next(err));
})

/* Get list of users you are folloing */
router.post('/followinglist', authenticate.verifyUser, (req, res, next) => {
  console.log(req.body._ids);
  Users.find({_id: {$in: req.body._ids}})
  .select("_id email name pic")
  .then(users => {
    res.json(users);
  }, err => next(err)).catch((err) => next(err));
});




/* GET users listing. */
router.post('/search-users', (req, res, next) => {
  let userPattern = new RegExp("^"+req.body.query)
  Users.find({
    $or: [
      {email: {$regex:userPattern , $options : "i"}},
      {name: {$regex: userPattern , $options : "i"}}
    ]
  })
  .select("_id email name pic")
  .then(users => {
    res.json({users: users});
  }, err => next(err)).catch((err) => next(err));
});

/*Registering new Users*/

router.post('/signup', (req, res, next) => {
  const {name, email, password, pic} = req.body;
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
      Users.create({name: name, email: email, password: hashedPassword, pic:pic})
      .then((user) => {
        transporter.sendMail({
          to: user.email,
          from: "destructerdavid@gmail.com",
          subject: "Signup Success",
          html: "<h2>Welcome to Connect</h2><p>Your account has been created Successfully</p><p><a href='https://connect-in.herokuapp.com/'>click here</a>to login into your account</p>"
        })
        console.log("User Created Successfully");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: "Saved Successfully"});
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
          const {_id, name, email, followers, following, pic, favourites} = user;
          res.json({token, user:{_id, name, email, followers, following, pic, favourites}});
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

router.put('/addtofav', authenticate.verifyUser, (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, {
    $push:{favourites:req.body.postId}
  },{new: true}).select("-password")
  .exec((err, result) => {
     if (err) {
       return res.status(422).json({error: err})
     }
     else {
       res.json(result)
     }
  })
});

router.put('/removefromfav', authenticate.verifyUser, (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, {
    $pull:{favourites:req.body.postId}
  },{new: true}).select("-password")
  .exec((err, result) => {
     if (err) {
       return res.status(422).json({error: err})
     }
     else {
       res.json(result)
     }
  })
});

router.put('/follow', authenticate.verifyUser, (req, res, next) => {
  Users.findByIdAndUpdate(req.body.followId, {
    $push:{followers:req.user._id}
  }, {new: true}, (err, result) => {
    if (err) {
      return res.status(422).json({error: err});
    }

    Users.findByIdAndUpdate(req.user._id, {
      $push:{following: req.body.followId}
    }, {new: true}).select("-password").then(result => {
      res.json(result);
    }, err => next(err)).catch(err => next(err));
  })

})

router.put('/unfollow', authenticate.verifyUser, (req, res, next) => {
  Users.findByIdAndUpdate(req.body.unfollowId, {
    $pull:{followers:req.user._id}
  }, {new: true}, (err, result) => {
    if (err) {
      return res.status(422).json({error: err});
    }

    Users.findByIdAndUpdate(req.user._id, {
      $pull:{following: req.body.unfollowId}
    }, {new: true}).select("-password").then(result => {
      res.json(result);
    }, err => next(err)).catch(err => next(err));
  })

})

router.put('/updatepic', authenticate.verifyUser, (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, {$set: {pic:req.body.pic}},{new: true}, (err, result) => {
    if (err) {
      return res.status(422).json({error: "pic cannot be updated"});
    }
    res.json(result)
  })
})

router.post('/reset-password', (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex")
    Users.findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        return res.status(422).json({error: "User doesn't exist with that email"})
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "destructerdavid@gmail.com",
          subject: "password-reset",
          html: `
          <p>Your have requested for your password reset</p>
          <h5>click this <a href="${config.domain}/reset/${token}">link</a> to reset your password</h5>
          `
        })
        res.json({message: "Check your mail!"})
      })
    })
  })
})

router.post('/update-password', (req, res, next) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  Users.findOne({resetToken: sentToken, expireToken:{$gt:Date.now()}})
  .then((user) => {
    if (!user) {
      return res.status(422).json({error: "This link has expired!"})
    }
    bcrypt.hash(newPassword, 12).then(hashedPassword => {
      user.password = hashedPassword
      user.resetToken = undefined
      user.expireToken = undefined
      user.save().then((savedUser) => {
        res.json({message: "Password updated Successfully"})
      })
    })
  }).catch((err) => next(err))
})

module.exports = router;
