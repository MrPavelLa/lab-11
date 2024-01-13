
const jwt = require('jsonwebtoken');
const Verification = require('../models/verificationModel');
const secretKey = 'TigerEyes39!';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token.slice(7), secretKey);
    console.log('Декодированный токен:', decoded);
    return decoded;
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    return null;
  }
};

exports.createVerification = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData || tokenData.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { code, login, password, role, phonenumber } = req.body;

  try {
    const newVerification = new Verification({ code, login, password, role, phonenumber });
    await newVerification.save();

    res.status(201).json(newVerification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteVerification = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData || tokenData.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { code } = req.params;

  try {
    const deletedVerification = await Verification.findOneAndDelete({ code });

    if (!deletedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(deletedVerification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateVerification = async (req, res) => {
  const { login } = req.params;
  const { password } = req.body;

  try {
    const updatedVerification = await Verification.findOneAndUpdate({ login }, { password }, { new: true });

    if (!updatedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    return res.json({ status: 'good' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVerificationByLogin = async (req, res) => {

  const { login } = req.params;

  try {
    const verification = await Verification.findOne({ login });

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllVerification = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData || tokenData.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  try {
    const allVerification = await Verification.find();

    res.json(allVerification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkLoginAndPassword = async (req, res) => {
  const { login, phonenumber } = req.body;

  try {
    const verification = await Verification.findOne({ login });

    if (!verification) {
      return res.json({ status: 'Логин не существует' });
    }

    if (verification.phonenumber !== req.body.phonenumber) {
      return res.json({ status: 'Пароль не совпадает с логином' });
    }

    res.json({ status: 'Совпадает' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};