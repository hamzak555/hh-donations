// Vercel Serverless Function - Health Check
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'HH Donations API is running',
    environment: process.env.NODE_ENV || 'development'
  });
};