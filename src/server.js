const express = require('express');
const cors = require('cors'); // Import CORS package
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routes/inventoryRoutes');
const sequelize = require('./config/db'); // Ensure you have sequelize set up correctly
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Set the port to listen on

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
}));

app.use(bodyParser.json()); // For parsing application/json

// Base URL for inventory routes
const upload = require('./middleware/uploads'); 
app.use('/api', inventoryRoutes);
app.post('/api/upload', upload.single('photo'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
      }
      res.json({ message: 'File uploaded successfully', imageUrl: req.file.path });
    } catch (error) {
      res.status(500).json({ error: 'File upload failed', details: error });
    }
  });
  
const startServer = async () => {
    try {
        await sequelize.authenticate(); // Check DB connection
        console.log('Connected to the database');

        await sequelize.sync(); // Sync models to create tables
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
