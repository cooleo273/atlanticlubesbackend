const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventory = sequelize.define('Inventory', {
  inventory_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  application: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // Array of text for multiple applications
    allowNull: true,
  },
  performance: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // Array of text for multiple performance attributes
    allowNull: true,
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  properties: {
    type: DataTypes.ARRAY(DataTypes.TEXT), // Array of text for multiple properties
    allowNull: true,
  },
});

module.exports = Inventory;
