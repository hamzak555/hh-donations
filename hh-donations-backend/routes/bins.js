const express = require('express');
const { db, generateBinNumber } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all donation bins (public endpoint)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      id,
      bin_number,
      name,
      address,
      latitude,
      longitude,
      hours,
      type,
      drive_up as driveUp,
      notes,
      distance,
      status
    FROM donation_bins 
    WHERE status = 'active'
    ORDER BY name
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching bins:', err);
      return res.status(500).json({ error: 'Failed to fetch donation bins' });
    }

    // Convert drive_up from 0/1 to boolean
    const bins = rows.map(bin => ({
      ...bin,
      driveUp: Boolean(bin.driveUp)
    }));

    res.json(bins);
  });
});

// Get all bins including inactive (admin only)
router.get('/admin', authenticateToken, requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      id,
      bin_number,
      name,
      address,
      latitude,
      longitude,
      hours,
      type,
      drive_up as driveUp,
      notes,
      distance,
      status,
      created_at,
      updated_at
    FROM donation_bins 
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching bins:', err);
      return res.status(500).json({ error: 'Failed to fetch donation bins' });
    }

    const bins = rows.map(bin => ({
      ...bin,
      driveUp: Boolean(bin.driveUp)
    }));

    res.json(bins);
  });
});

// Get single bin by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id,
      bin_number,
      name,
      address,
      latitude,
      longitude,
      hours,
      type,
      drive_up as driveUp,
      notes,
      distance,
      status
    FROM donation_bins 
    WHERE id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching bin:', err);
      return res.status(500).json({ error: 'Failed to fetch donation bin' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Donation bin not found' });
    }

    res.json({
      ...row,
      driveUp: Boolean(row.driveUp)
    });
  });
});

// Create new donation bin (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const {
    name,
    address,
    latitude,
    longitude,
    hours,
    type,
    driveUp,
    notes,
    distance
  } = req.body;

  // Validation
  if (!name || !address || !hours || !type) {
    return res.status(400).json({ 
      error: 'Name, address, hours, and type are required' 
    });
  }

  if (!['Indoor', 'Outdoor'].includes(type)) {
    return res.status(400).json({ 
      error: 'Type must be either "Indoor" or "Outdoor"' 
    });
  }

  // Generate auto bin number
  generateBinNumber((err, binNumber) => {
    if (err) {
      console.error('Error generating bin number:', err);
      return res.status(500).json({ error: 'Failed to generate bin number' });
    }

    const sql = `
      INSERT INTO donation_bins 
      (bin_number, name, address, latitude, longitude, hours, type, drive_up, notes, distance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      binNumber,
      name,
      address,
      latitude || null,
      longitude || null,
      hours,
      type,
      driveUp ? 1 : 0,
      notes || null,
      distance || null
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error creating bin:', err);
        return res.status(500).json({ error: 'Failed to create donation bin' });
      }

      // Return the created bin
      db.get(
        'SELECT * FROM donation_bins WHERE id = ?',
        [this.lastID],
        (err, row) => {
          if (err) {
            console.error('Error fetching created bin:', err);
            return res.status(500).json({ error: 'Bin created but failed to fetch details' });
          }

          res.status(201).json({
            message: 'Donation bin created successfully',
            bin: {
              ...row,
              driveUp: Boolean(row.drive_up)
            }
          });
        }
      );
    });
  });
});

// Update donation bin (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    latitude,
    longitude,
    hours,
    type,
    driveUp,
    notes,
    distance,
    status
  } = req.body;

  // Validation
  if (type && !['Indoor', 'Outdoor'].includes(type)) {
    return res.status(400).json({ 
      error: 'Type must be either "Indoor" or "Outdoor"' 
    });
  }

  if (status && !['active', 'inactive', 'maintenance'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be "active", "inactive", or "maintenance"' 
    });
  }

  // Build dynamic update query
  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (address !== undefined) { updates.push('address = ?'); params.push(address); }
  if (latitude !== undefined) { updates.push('latitude = ?'); params.push(latitude); }
  if (longitude !== undefined) { updates.push('longitude = ?'); params.push(longitude); }
  if (hours !== undefined) { updates.push('hours = ?'); params.push(hours); }
  if (type !== undefined) { updates.push('type = ?'); params.push(type); }
  if (driveUp !== undefined) { updates.push('drive_up = ?'); params.push(driveUp ? 1 : 0); }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
  if (distance !== undefined) { updates.push('distance = ?'); params.push(distance); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const sql = `UPDATE donation_bins SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating bin:', err);
      return res.status(500).json({ error: 'Failed to update donation bin' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Donation bin not found' });
    }

    // Return updated bin
    db.get(
      'SELECT * FROM donation_bins WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('Error fetching updated bin:', err);
          return res.status(500).json({ error: 'Bin updated but failed to fetch details' });
        }

        res.json({
          message: 'Donation bin updated successfully',
          bin: {
            ...row,
            driveUp: Boolean(row.drive_up)
          }
        });
      }
    );
  });
});

// Delete donation bin (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM donation_bins WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting bin:', err);
      return res.status(500).json({ error: 'Failed to delete donation bin' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Donation bin not found' });
    }

    res.json({ message: 'Donation bin deleted successfully' });
  });
});

module.exports = router;