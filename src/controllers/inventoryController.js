const Inventory = require('../models/inventoryModel');

// Get all inventory items
const getAllItems = async (req, res) => {
    try {
        const items = await Inventory.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};

// Get an inventory item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Inventory.findByPk(id); // Or `findById` depending on your ORM

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error });
    }
};

// Create a new inventory item with image upload
const createItem = async (req, res) => {
    try {
      const { 
        inventory_name, 
        description, 
        application,  // Expecting this to be an array
        performance,  // Expecting this to be an array
        recommendations, 
        properties  // Expecting this to be an array
      } = req.body;
      
      const image = req.file ? req.file.path : null;
  
      if (!image) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
  
      const newItem = await Inventory.create({ 
        inventory_name, 
        image, 
        description, 
        application: application ? JSON.parse(application) : [], // Convert JSON string to array
        performance: performance ? JSON.parse(performance) : [], // Convert JSON string to array
        recommendations, 
        properties: properties ? JSON.parse(properties) : [],  // Convert JSON string to array
      });
      
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating inventory', error });
    }
};

module.exports = {
    getAllItems,
    getItemById,  // Export the new function
    createItem,
};
