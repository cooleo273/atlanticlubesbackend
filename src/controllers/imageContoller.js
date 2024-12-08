// Import Category model
const { Json } = require('sequelize/lib/utils');
const SlidingImage = require('../models/Image');

// Get all inventory items or filter by categoryId
const getAllItems = async (req, res) => {
    try {
        const items = await SlidingImage.findAll(); // Fetch items based on the query options
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Image', error });
    }
};

// Create a new inventory item with image upload
const createItem = async (req, res) => {
    try {
        const image = req.files?.image?.[0]?.path || null;

        if (!image) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Create new item in the database
        const newItem = await SlidingImage.create({
            image,
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating Image:", error);
        res.status(500).json({ message: error.message });
    }
};




// Delete an inventory item by ID
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await SlidingImage.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};

module.exports = {
    getAllItems,
    createItem,
    deleteItem,
};
