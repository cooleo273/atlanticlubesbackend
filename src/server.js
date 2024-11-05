    const express = require('express');
    const cors = require('cors'); // Import CORS package
    const bodyParser = require('body-parser');
    const inventoryRoutes = require('./routes/inventoryRoutes');
    const categoryRoutes = require('./routes/categoryRoutes');
    const sequelize = require('./config/db'); // Ensure you have sequelize set up correctly
    const { createClient } = require('@supabase/supabase-js'); // Supabase client
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 5001; // Set the port to listen on

    // Initialize Supabase client
    const supabaseUrl = 'https://euflaebxyipiwrhlpqud.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = process.env.SUPABASE_KEY; // Store your Supabase Key in an environment variable
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Enable CORS for all routes
    app.use(cors({ origin: ["https://atlanticlubes-n46j.vercel.app", "http://localhost:3000"] }));
    app.use(bodyParser.json()); // For parsing application/json

    // Base URL for inventory routes
    app.use('/api', inventoryRoutes);
    app.use('/api/category', categoryRoutes);
    // User Authentication Routes
    // Sign Up
    app.post('/api/signup', async (req, res) => {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ user: data.user, session: data.session });
    });



    // Sign In
    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const { user, session, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return res.status(401).json({ error: error.message });
            }

            res.status(200).json({ user, session });
        } catch (err) {
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
    });


    // Middleware to protect routes
    app.use('/api/protected', async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401); // Unauthorized

        const { data, error } = await supabase.auth.api.getUser(token);

        if (error || !data) return res.sendStatus(403); // Forbidden

        req.user = data; // Add user info to request
        next();
    });

    // Protected Route Example
    app.get('/api/protected/user', (req, res) => {
        res.json(req.user); // Return user info
    });

    // File Upload Route
   

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
