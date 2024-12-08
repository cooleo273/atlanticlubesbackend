// models/Inventory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// Import Category model

const SlidingImage = sequelize.define("Image", {
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  }

});


module.exports = SlidingImage;
