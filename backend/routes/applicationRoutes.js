const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationController');

router.post('/', applicationsController.createApplications);
router.get('/', applicationsController.getAllApplications);

module.exports = router;