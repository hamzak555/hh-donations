const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/contracts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const binId = req.body.bin_id || 'unknown';
    const ext = path.extname(file.originalname);
    const filename = `contract-bin-${binId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

// File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload contract PDF for a specific bin (admin only)
router.post('/contract/:bin_id', authenticateToken, requireAdmin, (req, res) => {
  const { bin_id } = req.params;

  // Check if bin exists
  db.get('SELECT id, name FROM donation_bins WHERE id = ?', [bin_id], (err, bin) => {
    if (err) {
      console.error('Error checking bin:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!bin) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    // Set bin_id in body for multer filename generation
    req.body.bin_id = bin_id;

    // Handle file upload
    upload.single('contract')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Update bin with contract path
      const contractPath = req.file.path;
      
      db.run(
        'UPDATE donation_bins SET contract_pdf_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [contractPath, bin_id],
        function(err) {
          if (err) {
            console.error('Error updating bin contract:', err);
            
            // Delete uploaded file if database update fails
            fs.unlink(contractPath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });

            return res.status(500).json({ error: 'Failed to save contract reference' });
          }

          res.json({
            message: 'Contract uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            binId: bin_id,
            binName: bin.name
          });
        }
      );
    });
  });
});

// Download contract PDF for a specific bin (admin only)
router.get('/contract/:bin_id', authenticateToken, requireAdmin, (req, res) => {
  const { bin_id } = req.params;

  db.get(
    'SELECT contract_pdf_path, name FROM donation_bins WHERE id = ? AND contract_pdf_path IS NOT NULL',
    [bin_id],
    (err, bin) => {
      if (err) {
        console.error('Error fetching bin contract:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!bin) {
        return res.status(404).json({ error: 'Bin or contract not found' });
      }

      const contractPath = bin.contract_pdf_path;

      // Check if file exists
      if (!fs.existsSync(contractPath)) {
        return res.status(404).json({ error: 'Contract file not found on server' });
      }

      // Set appropriate headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="contract-${bin.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

      // Stream the file
      const fileStream = fs.createReadStream(contractPath);
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).json({ error: 'Error downloading file' });
      });
    }
  );
});

// Delete contract PDF for a specific bin (admin only)
router.delete('/contract/:bin_id', authenticateToken, requireAdmin, (req, res) => {
  const { bin_id } = req.params;

  db.get(
    'SELECT contract_pdf_path, name FROM donation_bins WHERE id = ? AND contract_pdf_path IS NOT NULL',
    [bin_id],
    (err, bin) => {
      if (err) {
        console.error('Error fetching bin contract:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!bin) {
        return res.status(404).json({ error: 'Bin or contract not found' });
      }

      const contractPath = bin.contract_pdf_path;

      // Update database first
      db.run(
        'UPDATE donation_bins SET contract_pdf_path = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [bin_id],
        function(err) {
          if (err) {
            console.error('Error updating bin contract:', err);
            return res.status(500).json({ error: 'Failed to remove contract reference' });
          }

          // Delete physical file
          fs.unlink(contractPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting contract file:', unlinkErr);
              // Don't return error here as database was updated successfully
            }

            res.json({
              message: 'Contract deleted successfully',
              binId: bin_id,
              binName: bin.name
            });
          });
        }
      );
    }
  );
});

// Get contract info for a specific bin (admin only)
router.get('/contract/:bin_id/info', authenticateToken, requireAdmin, (req, res) => {
  const { bin_id } = req.params;

  db.get(
    'SELECT id, name, contract_pdf_path FROM donation_bins WHERE id = ?',
    [bin_id],
    (err, bin) => {
      if (err) {
        console.error('Error fetching bin:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!bin) {
        return res.status(404).json({ error: 'Bin not found' });
      }

      const response = {
        binId: bin.id,
        binName: bin.name,
        hasContract: !!bin.contract_pdf_path
      };

      if (bin.contract_pdf_path) {
        // Check if file actually exists
        const fileExists = fs.existsSync(bin.contract_pdf_path);
        response.contractExists = fileExists;
        
        if (fileExists) {
          const stats = fs.statSync(bin.contract_pdf_path);
          response.contractSize = stats.size;
          response.contractModified = stats.mtime;
          response.filename = path.basename(bin.contract_pdf_path);
        }
      }

      res.json(response);
    }
  );
});

module.exports = router;