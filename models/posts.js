const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;
const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  photo: {
    type: String,
    required: true
  },

  likes: [{type: ObjectId, ref: "User"}],

  comments: [{
    text:String,
    postedBy: {type: ObjectId, ref: "User"}
  }],
  
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

var Posts = mongoose.model("Post", postSchema);
module.exports = Posts;
