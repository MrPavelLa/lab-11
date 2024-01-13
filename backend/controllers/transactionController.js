

const Transaction = require('../models/transactionModel');
const jwt = require('jsonwebtoken');
const secretKey = 'TigerEyes39!';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token.slice(7), secretKey);
    return decoded;
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    return null;
  }
};

exports.getAllTransactions = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { code, operationName, date, time, amount, category, accounts, target, isdeleted } = req.body;

  const transaction = new Transaction({
    code,
    operationName,
    date,
    time,
    amount,
    category,
    accounts,
    target,
    isdeleted,
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { id } = req.params;
  const { amount, target } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, { amount, target }, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndUpdate(id, { isdeleted: true }, { new: true });

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(deletedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTransactionsForCode = async (req, res) => {
  const { code } = req.params;
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  try {
    const transactions = await Transaction.find({ code });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recoverTransaction = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { id } = req.params;

  try {
    const recoveredTransaction = await Transaction.findByIdAndUpdate(id, { isdeleted: false }, { new: true });

    if (!recoveredTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(recoveredTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

