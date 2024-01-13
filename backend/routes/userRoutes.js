const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.delete('/:code', userController.deleteUser);
router.get('/:code', userController.getUserByCode);

module.exports = router;