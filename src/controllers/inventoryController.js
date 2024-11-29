const Inventory = require('../models/inventoryModel');
const Category = require('../models/Category'); // Import Category model
const { Json } = require('sequelize/lib/utils');

// Get all inventory items or filter by categoryId
const getAllItems = async (req, res) => {
    try {
        const { categoryId } = req.query; // Get categoryId from query parameters
        const queryOptions = {
            include: Category, // Include category data
        };

        // If categoryId is provided, filter the results
        if (categoryId) {
            queryOptions.where = { categoryId }; // Filter by categoryId
        }

        const items = await Inventory.findAll(queryOptions); // Fetch items based on the query options
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};

// Get an inventory item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Inventory.findByPk(id, { include: Category }); // Include category data

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
            application, 
            performance, 
            recommendations, 
            properties,
            categoryId // Category association
        } = req.body;

        const image = req.file ? req.file.path : null;

        if (!image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Ensure the category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newItem = await Inventory.create({
            inventory_name,
            image: req.file.path,
            description,
            application: application ? JSON.parse(application) : [],
            performance: performance ? JSON.parse(performance) : [],
            recommendations: recommendations ? JSON.parse(recommendations) : [], 
            properties: properties ? JSON.parse(properties) : [],
            categoryId, // Save category association
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating inventory', error });
    }
};

// Update an existing inventory item by ID
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            inventory_name, 
            description, 
            application, 
            performance, 
            recommendations, 
            properties,
            categoryId // Update category if needed
        } = req.body;

        const image = req.file ? req.file.path : null;

        const updatedItem = await Inventory.findByPk(id);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Ensure the new category exists if provided
        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // Update the fields, including the image if provided
        await updatedItem.update({
            inventory_name,
            description,
            application: application ? JSON.parse(application) : [],
            performance: performance ? JSON.parse(performance) : [],
            recommendations: recommendations? JSON.parse(recommendations): [],
            properties: properties ? JSON.parse(properties) : [],
            ...(categoryId && { categoryId }), // Update categoryId if provided
            ...(image && { image }), // Only update the image if a new one is uploaded
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// Delete an inventory item by ID
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Inventory.findByPk(id);

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
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
