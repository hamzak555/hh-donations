const express = require('express');
const { db } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all pickups with bin and driver details (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const { status, driver_id, date } = req.query;

  let sql = `
    SELECT 
      p.id,
      p.pickup_date,
      p.pickup_time,
      p.load_type,
      p.load_weight,
      p.status,
      p.notes,
      p.created_at,
      p.updated_at,
      b.id as bin_id,
      b.bin_number,
      b.name as bin_name,
      b.address as bin_address,
      d.id as driver_id,
      d.name as driver_name,
      d.phone as driver_phone
    FROM pickups p
    LEFT JOIN donation_bins b ON p.bin_id = b.id
    LEFT JOIN drivers d ON p.driver_id = d.id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    sql += ' AND p.status = ?';
    params.push(status);
  }

  if (driver_id) {
    sql += ' AND p.driver_id = ?';
    params.push(driver_id);
  }

  if (date) {
    sql += ' AND p.pickup_date = ?';
    params.push(date);
  }

  sql += ' ORDER BY p.pickup_date DESC, p.pickup_time DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching pickups:', err);
      return res.status(500).json({ error: 'Failed to fetch pickups' });
    }

    res.json(rows);
  });
});

// Get pickup statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  const statsQueries = [
    { name: 'total_pickups', query: 'SELECT COUNT(*) as count FROM pickups' },
    { name: 'scheduled_pickups', query: 'SELECT COUNT(*) as count FROM pickups WHERE status = "scheduled"' },
    { name: 'completed_pickups', query: 'SELECT COUNT(*) as count FROM pickups WHERE status = "completed"' },
    { name: 'total_weight', query: 'SELECT COALESCE(SUM(load_weight), 0) as weight FROM pickups WHERE status = "completed"' }
  ];

  const stats = {};
  let completed = 0;

  statsQueries.forEach(({ name, query }) => {
    db.get(query, [], (err, row) => {
      if (err) {
        console.error(`Error fetching ${name}:`, err);
        stats[name] = 0;
      } else {
        stats[name] = row.count !== undefined ? row.count : row.weight;
      }

      completed++;
      if (completed === statsQueries.length) {
        res.json(stats);
      }
    });
  });
});

// Get single pickup by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.*,
      b.bin_number,
      b.name as bin_name,
      b.address as bin_address,
      d.name as driver_name,
      d.phone as driver_phone
    FROM pickups p
    LEFT JOIN donation_bins b ON p.bin_id = b.id
    LEFT JOIN drivers d ON p.driver_id = d.id
    WHERE p.id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching pickup:', err);
      return res.status(500).json({ error: 'Failed to fetch pickup' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    res.json(row);
  });
});

// Create new pickup (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const {
    bin_id,
    driver_id,
    pickup_date,
    pickup_time,
    load_type,
    load_weight,
    notes
  } = req.body;

  // Validation
  if (!bin_id || !pickup_date) {
    return res.status(400).json({ 
      error: 'Bin ID and pickup date are required' 
    });
  }

  // Validate load_type if provided
  if (load_type && !['high_quality', 'medium_quality', 'low_quality', 'mixed'].includes(load_type)) {
    return res.status(400).json({ 
      error: 'Load type must be one of: high_quality, medium_quality, low_quality, mixed' 
    });
  }

  // Check if bin exists
  db.get('SELECT id FROM donation_bins WHERE id = ?', [bin_id], (err, bin) => {
    if (err) {
      console.error('Error checking bin:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!bin) {
      return res.status(400).json({ error: 'Bin not found' });
    }

    // Check if driver exists (if provided)
    const validateDriver = (callback) => {
      if (!driver_id) {
        callback(null);
        return;
      }

      db.get('SELECT id FROM drivers WHERE id = ? AND status = "active"', [driver_id], (err, driver) => {
        if (err) {
          callback(err);
          return;
        }

        if (!driver) {
          callback(new Error('Driver not found or inactive'));
          return;
        }

        callback(null);
      });
    };

    validateDriver((err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const sql = `
        INSERT INTO pickups (bin_id, driver_id, pickup_date, pickup_time, load_type, load_weight, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        bin_id,
        driver_id || null,
        pickup_date,
        pickup_time || null,
        load_type || null,
        load_weight || null,
        notes || null
      ];

      db.run(sql, params, function(err) {
        if (err) {
          console.error('Error creating pickup:', err);
          return res.status(500).json({ error: 'Failed to create pickup' });
        }

        // Return the created pickup with joined data
        const selectSql = `
          SELECT 
            p.*,
            b.bin_number,
            b.name as bin_name,
            b.address as bin_address,
            d.name as driver_name
          FROM pickups p
          LEFT JOIN donation_bins b ON p.bin_id = b.id
          LEFT JOIN drivers d ON p.driver_id = d.id
          WHERE p.id = ?
        `;

        db.get(selectSql, [this.lastID], (err, row) => {
          if (err) {
            console.error('Error fetching created pickup:', err);
            return res.status(500).json({ error: 'Pickup created but failed to fetch details' });
          }

          res.status(201).json({
            message: 'Pickup scheduled successfully',
            pickup: row
          });
        });
      });
    });
  });
});

// Update pickup (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    driver_id,
    pickup_date,
    pickup_time,
    load_type,
    load_weight,
    status,
    notes
  } = req.body;

  // Validation
  if (status && !['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be one of: scheduled, in_progress, completed, cancelled' 
    });
  }

  if (load_type && !['high_quality', 'medium_quality', 'low_quality', 'mixed'].includes(load_type)) {
    return res.status(400).json({ 
      error: 'Load type must be one of: high_quality, medium_quality, low_quality, mixed' 
    });
  }

  // Build dynamic update query
  const updates = [];
  const params = [];

  if (driver_id !== undefined) { updates.push('driver_id = ?'); params.push(driver_id); }
  if (pickup_date !== undefined) { updates.push('pickup_date = ?'); params.push(pickup_date); }
  if (pickup_time !== undefined) { updates.push('pickup_time = ?'); params.push(pickup_time); }
  if (load_type !== undefined) { updates.push('load_type = ?'); params.push(load_type); }
  if (load_weight !== undefined) { updates.push('load_weight = ?'); params.push(load_weight); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const sql = `UPDATE pickups SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating pickup:', err);
      return res.status(500).json({ error: 'Failed to update pickup' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    // Return updated pickup
    const selectSql = `
      SELECT 
        p.*,
        b.bin_number,
        b.name as bin_name,
        b.address as bin_address,
        d.name as driver_name
      FROM pickups p
      LEFT JOIN donation_bins b ON p.bin_id = b.id
      LEFT JOIN drivers d ON p.driver_id = d.id
      WHERE p.id = ?
    `;

    db.get(selectSql, [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated pickup:', err);
        return res.status(500).json({ error: 'Pickup updated but failed to fetch details' });
      }

      res.json({
        message: 'Pickup updated successfully',
        pickup: row
      });
    });
  });
});

// Delete pickup (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM pickups WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting pickup:', err);
      return res.status(500).json({ error: 'Failed to delete pickup' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    res.json({ message: 'Pickup deleted successfully' });
  });
});

module.exports = router;