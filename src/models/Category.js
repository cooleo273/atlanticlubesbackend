const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING, // Store the image URL as a string
    allowNull: true, // Optional field
  },
  order:{
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default order is 0 if not provided
    unique: true, // Ensure each category has a unique order number
  }
});

module.exports = Category;
