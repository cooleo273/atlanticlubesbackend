// models/Inventory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category"); // Import Category model

const Inventory = sequelize.define("Inventory", {
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  performance: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  recommendations: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  properties: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  tdsFile: { type: DataTypes.STRING, allowNull: true },
  msdsFile: { type: DataTypes.STRING, allowNull: true },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: "id", // Foreign key to Category table
    },
    allowNull: false, // Ensure every inventory item has a category
  },
});

// Establish the relationship
Inventory.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Inventory, { foreignKey: "categoryId" });

module.exports = Inventory;
