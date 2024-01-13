const mongoose = require('mongoose');

const verificationsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length >= 6;
      },
      message: 'Password should be at least 6 characters long'
    }
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return ['admin', 'user'].includes(value);
      },
      message: 'Invalid role'
    }
  },
  phonenumber: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\+375\d{9}$/.test(value);
      },
      message: 'Invalid phone number format. Should start with +375 and contain 13 digits in total'
    }
  }
});

const Verifications = mongoose.model('Verifications', verificationsSchema);

module.exports = Verifications;
