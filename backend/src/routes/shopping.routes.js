const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shopping.controller');

// GET    /api/shopping
router.get('/',             shoppingController.getList);

// POST   /api/shopping/generate
router.post('/generate',    shoppingController.generateFromMeals);

// POST   /api/shopping
router.post('/',            shoppingController.addItem);

// DELETE /api/shopping/:id
router.delete('/:id',       shoppingController.removeItem);

module.exports = router;
