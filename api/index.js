// Vercel Serverless Function Handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const authRoutes = require('../hh-donations-backend/routes/auth');
const binRoutes = require('../hh-donations-backend/routes/bins');
const driverRoutes = require('../hh-donations-backend/routes/drivers');
const pickupRoutes = require('../hh-donations-backend/routes/pickups');
const uploadRoutes = require('../hh-donations-backend/routes/uploads');

// Initialize database
const { initDatabase } = require('../hh-donations-backend/database/init');

const app = express();

// Initialize database on first request
let databaseInitialized = false;

const ensureDatabase = async () => {
  if (!databaseInitialized) {
    await initDatabase();
    databaseInitialized = true;
  }
};

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://www.hhdonations.com',
      'https://hhdonations.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // Allow Vercel preview deployments and main domain
    if (origin.startsWith('https://') && 
        (origin.includes('hhdonations') || 
         origin.includes('vercel.app') || 
         origin.includes('hamzak555'))) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins for now to debug
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to ensure database is initialized
app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/bins', binRoutes);
app.use('/drivers', driverRoutes);
app.use('/pickups', pickupRoutes);
app.use('/uploads', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Export for Vercel
module.exports = app;