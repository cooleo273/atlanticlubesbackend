const { Sequelize } = require('sequelize');

// Use DATABASE_URL directly for connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Ensure SSL is used in production
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  },
  logging: false, // Disable logging for production (optional)
});

module.exports = sequelize;
