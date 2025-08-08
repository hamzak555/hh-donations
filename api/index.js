// Vercel Serverless Function - Main API Handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('../hh-donations-backend/routes/auth');
const binRoutes = require('../hh-donations-backend/routes/bins');
const driverRoutes = require('../hh-donations-backend/routes/drivers');
const pickupRoutes = require('../hh-donations-backend/routes/pickups');
const uploadRoutes = require('../hh-donations-backend/routes/uploads');
const { initDatabase } = require('../hh-donations-backend/database/init');

const app = express();

// Initialize database
initDatabase();

// Security middleware
app.use(helmet());

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
    
    // In production, allow same-origin requests (same domain)
    if (process.env.NODE_ENV === 'production') {
      // Allow any https origin (for Vercel deployment)
      if (origin.startsWith('https://') && (origin.includes('hhdonations') || origin.includes('vercel'))) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
module.exports = app;