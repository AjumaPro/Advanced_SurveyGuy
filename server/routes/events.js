const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { query } = require('../database/connection');

// Create events table if it doesn't exist
  const createEventsTable = async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          time TIME NOT NULL,
          location VARCHAR(255),
          capacity INTEGER NOT NULL,
          price DECIMAL(10,2) DEFAULT 0,
          template VARCHAR(50) DEFAULT 'standard',
          registrations INTEGER DEFAULT 0,
          created_by INTEGER,
          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS event_registrations (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          attendees INTEGER DEFAULT 1,
          company VARCHAR(255),
          position VARCHAR(255),
          experience VARCHAR(50),
          goals TEXT,
          plus_one BOOLEAN DEFAULT FALSE,
          dietary VARCHAR(100),
          custom TEXT,
          template VARCHAR(50) DEFAULT 'standard',
          registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Error creating events tables:', error);
    }
  };

createEventsTable();

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.*,
        COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      GROUP BY e.id
      ORDER BY e.date DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        e.*,
        COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      capacity,
      price = 0,
      template = 'standard'
    } = req.body;

    if (!title || !date || !time || !location || !capacity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(`
      INSERT INTO events (title, description, date, time, location, capacity, price, template, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [title, description, date, time, location, capacity, price, template, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      capacity,
      price,
      template
    } = req.body;

    const result = await query(`
      UPDATE events 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          date = COALESCE($3, date),
          time = COALESCE($4, time),
          location = COALESCE($5, location),
          capacity = COALESCE($6, capacity),
          price = COALESCE($7, price),
          template = COALESCE($8, template),
          updated_date = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [title, description, date, time, location, capacity, price, template, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event registrations
router.get('/:id/registrations', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT * FROM event_registrations 
      WHERE event_id = $1 
      ORDER BY registration_date DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Register for event
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      attendees = 1,
      company,
      position,
      experience,
      goals,
      plusOne = false,
      dietary,
      custom,
      template = 'standard'
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if event exists and has capacity
    const eventResult = await query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];
    const currentRegistrations = await query(
      'SELECT COALESCE(SUM(attendees), 0) as total FROM event_registrations WHERE event_id = $1',
      [id]
    );

    const totalAttendees = parseInt(currentRegistrations.rows[0].total) + attendees;
    if (totalAttendees > event.capacity) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    // Check if user already registered
    const existingRegistration = await query(
      'SELECT * FROM event_registrations WHERE event_id = $1 AND email = $2',
      [id, email]
    );

    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    // Create registration
    const result = await query(`
      INSERT INTO event_registrations (
        event_id, name, email, phone, attendees, company, position, 
        experience, goals, plus_one, dietary, custom, template
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [id, name, email, phone, attendees, company, position, experience, goals, plusOne, dietary, custom, template]);

    // Update event registration count
    await query(
      'UPDATE events SET registrations = registrations + $1 WHERE id = $2',
      [attendees, id]
    );

    res.status(201).json({
      message: 'Registration successful',
      registration: result.rows[0]
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Get event statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const stats = await query(`
      SELECT 
        COUNT(*) as total_registrations,
        COALESCE(SUM(attendees), 0) as total_attendees,
        COUNT(DISTINCT template) as templates_used,
        COUNT(CASE WHEN dietary IS NOT NULL AND dietary != '' THEN 1 END) as dietary_requests,
        COUNT(CASE WHEN plus_one = true THEN 1 END) as plus_ones
      FROM event_registrations 
      WHERE event_id = $1
    `, [id]);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
});

module.exports = router; 