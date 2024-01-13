const mongoose = require('mongoose');
const validator = require('validator');

const applicationsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  loanName: {
    type: String,
    required: true
  },
  loanTerm: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

const Applications = mongoose.model('Applications', applicationsSchema);

module.exports = Applications;

