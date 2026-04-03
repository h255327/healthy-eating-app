const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// GET  /api/users/profile
router.get('/profile', usersController.getProfile);

// PUT  /api/users/profile
router.put('/profile', usersController.updateProfile);

// DELETE /api/users/profile
router.delete('/profile', usersController.deleteAccount);

module.exports = router;
