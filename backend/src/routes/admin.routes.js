const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// GET    /api/admin/users
router.get('/users',        adminController.getUsers);

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminController.deleteUser);

// GET    /api/admin/stats
router.get('/stats',        adminController.getStats);

module.exports = router;
