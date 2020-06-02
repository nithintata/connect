const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type : String,
    required: true
  },

  email: {
    type : String,
    required: true
  },

  password: {
    type : String,
    required: true
  },

  resetToken: String,
  
  expireToken: Date,

  pic: {
    type: String,
    default: "https://res.cloudinary.com/nithin/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1590493126/avatar_bfwjyx.jpg"
  },

  followers: [{
    type: ObjectId,
    ref: "User"
  }],

  following: [{
    type: ObjectId,
    ref: "User"
  }],

  favourites: [{type: ObjectId, ref: "Post"}]
}, {
    timestamps: true
});

var Users = mongoose.model("User", userSchema);
module.exports = Users;
