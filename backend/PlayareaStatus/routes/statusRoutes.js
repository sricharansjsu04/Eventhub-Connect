const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Route to handle status update
router.put('/:playareaId', statusController.changePlayAreaStatus);

router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

module.exports = router;
