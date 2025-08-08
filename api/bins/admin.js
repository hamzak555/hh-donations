// Vercel Serverless Function - Get All Bins
const sqlite3 = require('sqlite3').verbose();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Database connection
const getDb = () => {
  const dbPath = '/tmp/hh-donations.db';
  const db = new sqlite3.Database(dbPath);
  
  // Initialize tables if they don't exist
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      hours TEXT,
      type TEXT DEFAULT 'Outdoor',
      driveUp BOOLEAN DEFAULT 0,
      notes TEXT,
      distance TEXT,
      status TEXT DEFAULT 'active',
      bin_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Insert sample bins if table is empty
    db.get('SELECT COUNT(*) as count FROM bins', [], (err, row) => {
      if (!err && row.count === 0) {
        const sampleBins = [
          ['Walmart Supercentre', '3045 Mavis Rd, Mississauga, ON L5C 1T7', 43.5890, -79.7170, '24/7', 'Outdoor', 1, 'Main entrance area', '2.5 km', 'active', 'WM001'],
          ['No Frills', '6677 Meadowvale Town Centre Cir, Mississauga, ON L5N 2R5', 43.5825, -79.7380, '8 AM - 10 PM', 'Indoor', 0, 'Near customer service', '3.1 km', 'active', 'NF002'],
          ['Canadian Tire', '6040 Glen Erin Dr, Mississauga, ON L5N 1A4', 43.5756, -79.7298, '8 AM - 9 PM Mon-Sat, 9 AM - 6 PM Sun', 'Indoor', 1, 'Front lobby area', '1.8 km', 'active', 'CT003']
        ];
        
        sampleBins.forEach(bin => {
          db.run(`INSERT INTO bins (name, address, latitude, longitude, hours, type, driveUp, notes, distance, status, bin_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, bin);
        });
      }
    });
  });
  
  return db;
};

module.exports = async (req, res) => {
  // Handle CORS
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    
    db.all('SELECT * FROM bins ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows || []);
      db.close();
    });
  } catch (error) {
    console.error('Bins fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};