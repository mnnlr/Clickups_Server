const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  role:{type:String,required:true,enum:["User","Amdin"]},
  email: { type: String, required: true },
  timestamp:{type:Date,default:Date.now}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
