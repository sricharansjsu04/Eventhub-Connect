const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);

router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

module.exports = router;
