const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/logIn', authController.logIn);

module.exports = router;
