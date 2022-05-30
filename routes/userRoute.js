const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signUp', authController.signUp);
router.get('/getUserInfo/:id', authController.protect, userController.getUserInfo);
router.patch('/updateUser/:id', userController.updateUser);
router.post('/logIn', authController.logIn);

module.exports = router;
