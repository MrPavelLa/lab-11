const mongoose = require('mongoose');
const validator = require('validator');

const transactionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  operationName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value >= 0, 
      message: 'Сумма не может быть отрицательной',
    },
  },
  category: {
    type: String,
    required: true,
  },
  accounts: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  isdeleted: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

