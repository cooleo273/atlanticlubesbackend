const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); // Multer config
const categoryController = require('../controllers/categoryController');

// Routes for categories
router.get('/', categoryController.getAllCategories);
router.post('/', upload.single('image'), categoryController.createCategory);
router.put('/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
