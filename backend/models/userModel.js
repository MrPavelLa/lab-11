const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  //   minlength: 6,
  // },
  photo: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Invalid URL format',
    },
  },
  accounts: {
    type: [String],
    validate: {
      validator: (value) => value.length >= 2,
      message: 'At least two accounts are required',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
