const express = require('express');
const router = express.Router();
const { getAllItems, createItem, getItemById } = require('../controllers/inventoryController');
const upload = require('../middleware/uploads'); // Ensure you import the multer upload middleware

// GET all inventory items
router.get('/inventory', getAllItems);
router.get('/inventory/:id', getItemById);

// POST a new inventory item
router.post('/inventory', upload.single('photo'), createItem);

module.exports = router;
