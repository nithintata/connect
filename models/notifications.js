const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;
const pushSchema = new Schema({
  userId: {
    type: String,
    required: true
  },

  subscription: {
    type: Object,
    required: true
  }

}, {
  timestamps: true
});

var Notifications = mongoose.model("Notification", pushSchema);
module.exports = Notifications;
