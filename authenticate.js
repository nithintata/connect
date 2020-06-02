const jwt = require('jsonwebtoken');
const config = require('./config/config');
const mongoose = require('mongoose');
const Users = mongoose.model("User");

exports.verifyUser = (req, res, next) => {
  const{authorization} = req.headers;
  if (!authorization) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: "You must be logged in"});
    return;
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, config.secretKey, (err, payload) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: "You must be logged in"});
      return;
    }

    const {_id} = payload;
    Users.findById(_id).then((user) => {
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({error: "Invalid token"});
        return;
      }
      req.user = user;
      req.user.password = undefined;
      req.user.createdAt = undefined; req.user.updatedAt = undefined;
      next();
    }, (err) => next(err)).catch((err) => next(err));
  });
}
