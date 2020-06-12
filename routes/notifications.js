var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Notifications = require('../models/notifications');
const config = require('../config/config');
const authenticate = require('../authenticate');
const webpush = require("web-push");

const vapidKeys = {
  privateKey: config.privateVapidKey,
  publicKey: config.publicVapidKey
};

webpush.setVapidDetails("mailto:destructerdavid@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);


var router = express.Router();
router.use(bodyParser.json());

router.post('/subscription', authenticate.verifyUser, (req, res, next) => {
  const subscriptionRequest = req.body;
  const userId = req.user._id;
  Notifications.create({userId: userId, subscription: subscriptionRequest})
  .then((subscription) => {
    console.log("Subscribed Successfully");
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.json({message: "Subscribed Successfully"});
  }, (err) => next(err)).catch((err) => next(err));
});


router.post('/subscription/:id', (req, res, next) => {
  const userId = req.params.id;
  Notifications.find({userId: userId})
  .then((subscriptions) => {
    if (!subscriptions) {
      return res.status(202).json({});
    }
    subscriptions.map(subscription => {
      console.log(subscription);
      webpush
        .sendNotification(
          subscription.subscription,
          JSON.stringify({
            title: req.body.title,
            image: req.body.image,
            url: req.body.url,
            text: req.body.text,
            tag: req.body.tag,
          })
        )
        .catch(err => {
          console.log(err);
        });
    });
    res.status(202).json({message: "Push Notification received Successfully"});
  }, (err) => next(err)).catch((err) => next(err));
});

module.exports = router;
