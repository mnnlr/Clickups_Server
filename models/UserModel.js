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

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(`Error hashing password: ${err}`);
  }
});

// // Check if the model is already compiled before defining it
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = UserModel;
