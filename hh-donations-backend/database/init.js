const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/hh-donations.db';

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📦 Connected to SQLite database');
  }
});

// Initialize database tables
const initDatabase = () => {
  // Users table for admin authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('✅ Users table ready');
      createDefaultAdmin();
    }
  });

  // Donation bins table
  db.run(`
    CREATE TABLE IF NOT EXISTS donation_bins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bin_number TEXT UNIQUE,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      hours TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Indoor', 'Outdoor')),
      drive_up BOOLEAN DEFAULT 0,
      notes TEXT,
      distance TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'maintenance')),
      contract_pdf_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating donation_bins table:', err.message);
    } else {
      console.log('✅ Donation bins table ready');
      createPickupTables();
    }
  });

  // Create pickup-related tables
  const createPickupTables = () => {
    // Drivers table
    db.run(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        license_number TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating drivers table:', err.message);
      } else {
        console.log('✅ Drivers table ready');
      }
    });

    // Pickups table
    db.run(`
      CREATE TABLE IF NOT EXISTS pickups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bin_id INTEGER NOT NULL,
        driver_id INTEGER,
        pickup_date DATE NOT NULL,
        pickup_time TIME,
        load_type TEXT CHECK(load_type IN ('high_quality', 'medium_quality', 'low_quality', 'mixed')),
        load_weight DECIMAL(10,2),
        status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bin_id) REFERENCES donation_bins (id),
        FOREIGN KEY (driver_id) REFERENCES drivers (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating pickups table:', err.message);
      } else {
        console.log('✅ Pickups table ready');
      }
    });

    // Load tracking table for detailed load information
    db.run(`
      CREATE TABLE IF NOT EXISTS load_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pickup_id INTEGER NOT NULL,
        item_category TEXT NOT NULL,
        quantity INTEGER,
        weight DECIMAL(10,2),
        quality_rating TEXT CHECK(quality_rating IN ('excellent', 'good', 'fair', 'poor')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pickup_id) REFERENCES pickups (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating load_tracking table:', err.message);
      } else {
        console.log('✅ Load tracking table ready');
        insertDefaultData();
      }
    });
  };
};

// Generate auto bin number
const generateBinNumber = (callback) => {
  db.get('SELECT COUNT(*) as count FROM donation_bins', (err, row) => {
    if (err) {
      callback(err, null);
      return;
    }
    const nextNumber = (row.count + 1).toString().padStart(4, '0');
    const binNumber = `HH-${nextNumber}`;
    callback(null, binNumber);
  });
};

// Insert default data for all tables
const insertDefaultData = () => {
  insertDefaultBins();
  insertDefaultDrivers();
};

// Create default admin user
const createDefaultAdmin = () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hh-donations.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Check if admin already exists
  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
    if (err) {
      console.error('Error checking for admin user:', err.message);
      return;
    }

    if (!row) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [adminEmail, hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating admin user:', err.message);
          } else {
            console.log('👤 Default admin user created');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
            console.log('⚠️  Please change the default password after first login!');
          }
        }
      );
    }
  });
};

// Insert default donation bins (from your existing data)
const insertDefaultBins = () => {
  db.get('SELECT COUNT(*) as count FROM donation_bins', (err, row) => {
    if (err) {
      console.error('Error counting bins:', err.message);
      return;
    }

    if (row.count === 0) {
      const defaultBins = [
        {
          name: 'Yorkdale Shopping Centre',
          address: '3401 Dufferin Street, Toronto, ON M6A 2T9',
          latitude: 43.7255,
          longitude: -79.4523,
          hours: 'Mon-Sat 10:00 AM - 9:00 PM, Sun 11:00 AM - 7:00 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Located near entrance 1. Drive-up access available at loading dock.',
          distance: '8.2 km'
        },
        {
          name: 'Scarborough Town Centre',
          address: '300 Borough Drive, Scarborough, ON M1P 4P5',
          latitude: 43.7766,
          longitude: -79.2578,
          hours: 'Mon-Sat 10:00 AM - 9:00 PM, Sun 11:00 AM - 7:00 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Inside mall near food court. Security available for assistance.',
          distance: '15.3 km'
        },
        {
          name: 'Etobicoke Community Centre',
          address: '65 Horner Avenue, Etobicoke, ON M8Z 4X5',
          latitude: 43.6024,
          longitude: -79.5089,
          hours: 'Open 24/7',
          type: 'Outdoor',
          drive_up: 1,
          notes: 'Large capacity bin. Easy access from parking lot.',
          distance: '12.7 km'
        },
        {
          name: 'North York Civic Centre',
          address: '5100 Yonge Street, North York, ON M2N 5V7',
          latitude: 43.7678,
          longitude: -79.4142,
          hours: 'Mon-Fri 8:30 AM - 4:30 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Located in main lobby. Closed on weekends and holidays.',
          distance: '9.5 km'
        },
        {
          name: 'Dundas Square',
          address: '10 Dundas Street East, Toronto, ON M5B 2G9',
          latitude: 43.6561,
          longitude: -79.3802,
          hours: 'Open 24/7',
          type: 'Outdoor',
          drive_up: 0,
          notes: 'High traffic area. Bin secured and monitored.',
          distance: '0.8 km'
        },
        {
          name: 'Beaches Recreation Centre',
          address: '6 Williamson Road, Toronto, ON M4E 1K7',
          latitude: 43.6761,
          longitude: -79.2977,
          hours: 'Mon-Fri 7:00 AM - 10:00 PM, Weekends 8:00 AM - 8:00 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Located near main entrance. Staff available during operating hours.',
          distance: '6.4 km'
        },
        {
          name: 'High Park',
          address: '1873 Bloor Street West, Toronto, ON M6R 2Z3',
          latitude: 43.6465,
          longitude: -79.4637,
          hours: 'Open 24/7',
          type: 'Outdoor',
          drive_up: 1,
          notes: 'Near parking lot entrance. Well-lit and accessible.',
          distance: '7.1 km'
        },
        {
          name: 'Mississauga Community Centre',
          address: '300 City Centre Drive, Mississauga, ON L5B 3C1',
          latitude: 43.5890,
          longitude: -79.6441,
          hours: 'Mon-Fri 6:00 AM - 11:00 PM, Weekends 7:00 AM - 9:00 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Large facility with multiple drop-off points. Drive-up at west entrance.',
          distance: '22.3 km'
        },
        {
          name: 'Markham Civic Centre',
          address: '101 Town Centre Blvd, Markham, ON L3R 9W3',
          latitude: 43.8561,
          longitude: -79.3370,
          hours: 'Mon-Fri 8:30 AM - 5:00 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Located in the main atrium. Closed on statutory holidays.',
          distance: '25.6 km'
        },
        {
          name: 'Liberty Village Market',
          address: '171 East Liberty Street, Toronto, ON M6K 3P6',
          latitude: 43.6380,
          longitude: -79.4197,
          hours: 'Daily 8:00 AM - 10:00 PM',
          type: 'Outdoor',
          drive_up: 1,
          notes: 'Located at the back of the market. Drive-up access from Liberty Street.',
          distance: '3.2 km'
        },
        {
          name: 'Richmond Hill Community Centre',
          address: '8501 Yonge Street, Richmond Hill, ON L4C 6Z2',
          latitude: 43.8823,
          longitude: -79.4380,
          hours: 'Mon-Fri 6:00 AM - 10:00 PM, Weekends 7:00 AM - 9:00 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Large facility with dedicated donation area. Drive-up at north entrance.',
          distance: '28.5 km'
        },
        {
          name: 'Kensington Market',
          address: '238 Augusta Avenue, Toronto, ON M5T 2L7',
          latitude: 43.6544,
          longitude: -79.4004,
          hours: 'Daily 9:00 AM - 7:00 PM',
          type: 'Outdoor',
          drive_up: 0,
          notes: 'Located at market entrance. High foot traffic area with regular monitoring.',
          distance: '2.1 km'
        },
        {
          name: 'Woodbine Beach Pavilion',
          address: '1675 Lake Shore Blvd E, Toronto, ON M4L 3W6',
          latitude: 43.6634,
          longitude: -79.3086,
          hours: 'Daily 6:00 AM - 11:00 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Seasonal hours may vary. Located near main pavilion building.',
          distance: '8.7 km'
        },
        {
          name: 'Vaughan Mills Shopping Centre',
          address: '1 Bass Pro Mills Drive, Vaughan, ON L4K 5W4',
          latitude: 43.8254,
          longitude: -79.5386,
          hours: 'Mon-Sat 10:00 AM - 9:00 PM, Sun 11:00 AM - 7:00 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Located near entrance 4. Large capacity bin with easy vehicle access.',
          distance: '32.1 km'
        },
        {
          name: 'Ajax Community Centre',
          address: '75 Centennial Road, Ajax, ON L1S 4L1',
          latitude: 43.8407,
          longitude: -79.0204,
          hours: 'Mon-Fri 6:00 AM - 10:00 PM, Weekends 7:00 AM - 8:00 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Located in main lobby. Staff assistance available during business hours.',
          distance: '45.6 km'
        },
        {
          name: 'Harbourfront Centre',
          address: '235 Queens Quay West, Toronto, ON M5J 2G8',
          latitude: 43.6387,
          longitude: -79.3816,
          hours: 'Daily 10:00 AM - 6:00 PM',
          type: 'Outdoor',
          drive_up: 0,
          notes: 'Waterfront location with scenic views. Bin secured and weather-protected.',
          distance: '1.4 km'
        },
        {
          name: 'Brampton City Hall',
          address: '2 Wellington Street West, Brampton, ON L6Y 4R2',
          latitude: 43.6834,
          longitude: -79.7587,
          hours: 'Mon-Fri 8:30 AM - 4:30 PM',
          type: 'Indoor',
          drive_up: 1,
          notes: 'Government building with secure access. Drive-up available at service entrance.',
          distance: '35.4 km'
        },
        {
          name: 'Oakville Town Square',
          address: '1225 Trafalgar Road, Oakville, ON L6H 0H3',
          latitude: 43.4675,
          longitude: -79.6877,
          hours: 'Mon-Fri 9:00 AM - 9:00 PM, Weekends 10:00 AM - 6:00 PM',
          type: 'Outdoor',
          drive_up: 1,
          notes: 'Central location with ample parking. Well-lit and monitored area.',
          distance: '40.2 km'
        },
        {
          name: 'Casa Loma',
          address: '1 Austin Terrace, Toronto, ON M5R 1X8',
          latitude: 43.6780,
          longitude: -79.4094,
          hours: 'Daily 9:30 AM - 5:00 PM',
          type: 'Indoor',
          drive_up: 0,
          notes: 'Historic castle location. Bin located near visitor centre entrance.',
          distance: '4.8 km'
        },
        {
          name: 'Don Valley Brick Works Park',
          address: '550 Bayview Avenue, Toronto, ON M4W 3X8',
          latitude: 43.6859,
          longitude: -79.3648,
          hours: 'Open 24/7',
          type: 'Outdoor',
          drive_up: 1,
          notes: 'Park setting with easy vehicle access. Environmentally themed location.',
          distance: '5.9 km'
        }
      ];

      let insertedCount = 0;
      defaultBins.forEach((bin, index) => {
        // Generate unique bin number based on index
        const binNumber = `HH-${(index + 1).toString().padStart(4, '0')}`;
        
        const stmt = db.prepare(`
          INSERT INTO donation_bins 
          (bin_number, name, address, latitude, longitude, hours, type, drive_up, notes, distance)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run([
          binNumber, bin.name, bin.address, bin.latitude, bin.longitude,
          bin.hours, bin.type, bin.drive_up, bin.notes, bin.distance
        ], function(err) {
          if (err) {
            console.error('Error inserting bin:', err.message);
          } else {
            insertedCount++;
            if (insertedCount === defaultBins.length) {
              console.log('📍 Default donation bins inserted with auto-generated numbers');
            }
          }
        });

        stmt.finalize();
      });
    }
  });
};

// Insert default drivers
const insertDefaultDrivers = () => {
  db.get('SELECT COUNT(*) as count FROM drivers', (err, row) => {
    if (err) {
      console.error('Error counting drivers:', err.message);
      return;
    }

    if (row.count === 0) {
      const defaultDrivers = [
        {
          name: 'John Smith',
          email: 'john.smith@hh-donations.com',
          phone: '(416) 555-0101',
          license_number: 'D1234567'
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@hh-donations.com',
          phone: '(416) 555-0102',
          license_number: 'D1234568'
        },
        {
          name: 'Mike Wilson',
          email: 'mike.wilson@hh-donations.com',
          phone: '(416) 555-0103',
          license_number: 'D1234569'
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO drivers (name, email, phone, license_number)
        VALUES (?, ?, ?, ?)
      `);

      defaultDrivers.forEach(driver => {
        stmt.run([driver.name, driver.email, driver.phone, driver.license_number]);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error inserting default drivers:', err.message);
        } else {
          console.log('🚛 Default drivers inserted');
        }
      });
    }
  });
};

module.exports = { initDatabase, db, generateBinNumber };