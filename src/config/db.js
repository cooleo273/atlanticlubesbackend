const { Sequelize } = require('sequelize');
const pg = require('pg');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,  
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For Vercel environments
    },
  },
});

module.exports = sequelize;
