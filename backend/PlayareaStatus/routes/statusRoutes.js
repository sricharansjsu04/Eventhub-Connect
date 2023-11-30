const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Route to handle status update
router.put('/:playareaId', statusController.changePlayAreaStatus);

module.exports = router;
