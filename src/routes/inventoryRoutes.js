const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); // Middleware for handling file uploads
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/inventoryController');

// GET all items
router.get('/inventory', getAllItems);

// GET a specific item by ID
router.get('/inventory/:id', getItemById);

// POST a new inventory item
router.post('/inventory', upload.fields([ { name: 'photo', maxCount: 1 }, { name: 'tds', maxCount: 1 }, { name: 'msds', maxCount: 1 }, ]), createItem);

// PUT (Update) an existing inventory item by ID
router.put('/inventory/:id', upload.fields([ { name: 'photo', maxCount: 1 }, { name: 'tds', maxCount: 1 }, { name: 'msds', maxCount: 1 }, ]), updateItem);

// DELETE an inventory item by ID
router.delete('/inventory/:id', deleteItem);

module.exports = router;
