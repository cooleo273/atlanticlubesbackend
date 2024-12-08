const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); // Middleware for handling file uploads
const {
    getAllItems,
    createItem,
    deleteItem
} = require('../controllers/imageContoller');

// GET all items
router.get('/', getAllItems);

// POST a new inventory item
router.post('/', upload.fields([ { name: 'image', maxCount: 1 }, { name: 'tds', maxCount: 1 }, { name: 'msds', maxCount: 1 }, ]), createItem);

// PUT (Update) an existing  item by ID

// DELETE an  item by ID
router.delete('/:id', deleteItem);

module.exports = router;
