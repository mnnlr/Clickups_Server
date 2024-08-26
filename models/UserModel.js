const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
    default: "User"
  },
  email: {
    type: String,
    required: true
  },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(`Error on hasing password: ${err}`);
  }
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
