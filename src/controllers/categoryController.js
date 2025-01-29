const Category = require('../models/Category');
const Inventory = require('../models/inventoryModel');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']], // Order by id in ascending order
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};


// Create a new category with image upload
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    const newCategory = await Category.create({
      name,
      image, // Save image path if provided
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({
      name,
      ...(image && { image }), // Update the image only if provided
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete dependent inventories first (if you want to delete them)
        await Inventory.destroy({ where: { categoryId: id } });
        
        // Now delete the category
        const result = await Category.destroy({ where: { id } });
        
        if (!result) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
