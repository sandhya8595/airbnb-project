const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedHomes } = require('./data/homeStore');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // Built-in middleware for parsing JSON
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/reservations', reservationRoutes);

// Root route for API health check
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Airbnb Clone REST API' });
});

// Root route for direct browser visits to the backend port
app.get('/', (req, res) => {
  res.send('<h2>Airbnb Backend API is Running!</h2><p>Please visit the frontend at <a href="http://localhost:5173">http://localhost:5173</a> to see the application.</p>');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedHomes();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });
