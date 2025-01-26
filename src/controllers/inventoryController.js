const Inventory = require('../models/inventoryModel');
const Category = require('../models/Category');
const crypto = require('crypto');

// Helper function for slug generation
const generateSlug = (name) => {
  const shortUUID = crypto.randomBytes(3).toString('hex').substring(0, 5); // 5-character random string
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${shortUUID}`;
};

// Get all inventory items or filter by categoryId
const getAllItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const queryOptions = {
      include: Category,
    };

    if (categoryId) {
      queryOptions.where = { categoryId };
    }

    const items = await Inventory.findAll(queryOptions);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
};

// Get an inventory item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findByPk(id, { include: Category });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

// Get items by slug name
const getItemsBySlugName = async (req, res) => {
  try {
    const { slugName } = req.params;
    const item = await Inventory.findOne({
      where: { inventory__slug: slugName },
      include: Category,
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item by slug', error });
  }
};

// Create a new inventory item
const createItem = async (req, res) => {
  try {
    const { 
      inventory_name, 
      description, 
      application, 
      performance, 
      recommendations, 
      categoryId 
    } = req.body;

    const image = req.files?.image?.[0]?.path || null;
    const tdsFile = req.files?.tds?.[0]?.path || null;
    const msdsFile = req.files?.msds?.[0]?.path || null;

    if (!inventory_name || !categoryId) {
      return res.status(400).json({ message: 'Inventory name and category ID are required' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const inventory__slug = generateSlug(inventory_name);

    const newItem = await Inventory.create({
      inventory_name,
      inventory__slug,
      image,
      tdsFile,
      msdsFile,
      description,
      application,
      performance: performance ? JSON.parse(performance) : [],
      recommendations: recommendations ? JSON.parse(recommendations) : [],
      categoryId,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventory:', error);
    res.status(500).json({ message: 'Error creating inventory', error });
  }
};

// Update an inventory item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inventory_name,
      description,
      application,
      performance,
      recommendations,
      categoryId,
    } = req.body;

    const image = req.files?.image?.[0]?.path || null;
    const tdsFile = req.files?.tds?.[0]?.path || null;
    const msdsFile = req.files?.msds?.[0]?.path || null;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const updatedSlug = inventory_name ? generateSlug(inventory_name) : item.inventory__slug;

    await item.update({
      inventory_name,
      inventory__slug: updatedSlug,
      description,
      application,
      performance: performance ? JSON.parse(performance) : item.performance,
      recommendations: recommendations ? JSON.parse(recommendations) : item.recommendations,
      ...(categoryId && { categoryId }),
      ...(image && { image }),
      ...(tdsFile && { tdsFile }),
      ...(msdsFile && { msdsFile }),
    });

    res.json(item);
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
  getItemsBySlugName,
};
