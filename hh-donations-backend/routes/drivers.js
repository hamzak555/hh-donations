const express = require('express');
const { db } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all drivers (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      license_number,
      status,
      created_at,
      updated_at
    FROM drivers 
    ORDER BY name
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching drivers:', err);
      return res.status(500).json({ error: 'Failed to fetch drivers' });
    }

    res.json(rows);
  });
});

// Get single driver by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      license_number,
      status,
      created_at,
      updated_at
    FROM drivers 
    WHERE id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching driver:', err);
      return res.status(500).json({ error: 'Failed to fetch driver' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(row);
  });
});

// Create new driver (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, phone, license_number } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const sql = `
    INSERT INTO drivers (name, email, phone, license_number)
    VALUES (?, ?, ?, ?)
  `;

  const params = [name, email || null, phone || null, license_number || null];

  db.run(sql, params, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error('Error creating driver:', err);
      return res.status(500).json({ error: 'Failed to create driver' });
    }

    // Return the created driver
    db.get('SELECT * FROM drivers WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created driver:', err);
        return res.status(500).json({ error: 'Driver created but failed to fetch details' });
      }

      res.status(201).json({
        message: 'Driver created successfully',
        driver: row
      });
    });
  });
});

// Update driver (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, license_number, status } = req.body;

  // Validation
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be "active" or "inactive"' 
    });
  }

  // Build dynamic update query
  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (email !== undefined) { updates.push('email = ?'); params.push(email); }
  if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
  if (license_number !== undefined) { updates.push('license_number = ?'); params.push(license_number); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const sql = `UPDATE drivers SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error('Error updating driver:', err);
      return res.status(500).json({ error: 'Failed to update driver' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Return updated driver
    db.get('SELECT * FROM drivers WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated driver:', err);
        return res.status(500).json({ error: 'Driver updated but failed to fetch details' });
      }

      res.json({
        message: 'Driver updated successfully',
        driver: row
      });
    });
  });
});

// Delete driver (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  // Check if driver has any active pickups
  db.get(
    'SELECT COUNT(*) as count FROM pickups WHERE driver_id = ? AND status IN ("scheduled", "in_progress")',
    [id],
    (err, row) => {
      if (err) {
        console.error('Error checking driver pickups:', err);
        return res.status(500).json({ error: 'Failed to check driver status' });
      }

      if (row.count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete driver with active pickups. Please reassign or cancel pickups first.' 
        });
      }

      // Delete the driver
      db.run('DELETE FROM drivers WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting driver:', err);
          return res.status(500).json({ error: 'Failed to delete driver' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Driver not found' });
        }

        res.json({ message: 'Driver deleted successfully' });
      });
    }
  );
});

module.exports = router;