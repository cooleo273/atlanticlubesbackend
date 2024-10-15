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
router.post('/inventory', upload.single('photo'), createItem);

// PUT (Update) an existing inventory item by ID
router.put('/inventory/:id', upload.single('photo'), updateItem);

// DELETE an inventory item by ID
router.delete('/inventory/:id', deleteItem);

module.exports = router;
