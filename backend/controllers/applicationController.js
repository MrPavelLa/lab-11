const Applications = require('../models/applicationModel');
const secretKey = 'TigerEyes39!';
const jwt = require('jsonwebtoken');


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

exports.createApplications = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  console.log(String(tokenData.role));
  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  const { code, loanName, loanTerm, amount, date, time } = req.body;

  const applications = new Applications({
    code,
    loanName,
    loanTerm,
    amount,
    date,
    time,
  });

  try {
    const newApplications = await applications.save();
    res.status(201).json(newApplications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getAllApplications = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const applications = await Applications.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

