const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { query } = require('../database/connection');

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.*,
        u.name as creator_name,
        COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      GROUP BY e.id, u.name
      ORDER BY e.event_date DESC
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
        u.name as creator_name,
        COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id, u.name
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
    const { title, description, event_date, location, max_attendees, registration_required, settings } = req.body;
    const userId = req.user.id;

    const result = await query(`
      INSERT INTO events (user_id, title, description, event_date, location, max_attendees, registration_required, settings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [userId, title, description, event_date, location, max_attendees, registration_required, settings || {}]);

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
    const { title, description, event_date, location, max_attendees, registration_required, status, settings } = req.body;
    const userId = req.user.id;

    const result = await query(`
      UPDATE events 
      SET title = $1, description = $2, event_date = $3, location = $4, 
          max_attendees = $5, registration_required = $6, status = $7, 
          settings = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND user_id = $10
      RETURNING *
    `, [title, description, event_date, location, max_attendees, registration_required, status, settings || {}, id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
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
    const userId = req.user.id;

    const result = await query(`
      DELETE FROM events 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event registrations
router.get('/:id/registrations', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns the event
    const eventCheck = await query(`
      SELECT id FROM events WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    const result = await query(`
      SELECT * FROM event_registrations 
      WHERE event_id = $1 
      ORDER BY created_at DESC
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
    const { name, email, phone, organization, survey_responses } = req.body;

    // Check if event exists and allows registration
    const eventCheck = await query(`
      SELECT id, registration_required, max_attendees, 
             (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1) as current_registrations
      FROM events WHERE id = $1
    `, [id]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventCheck.rows[0];
    
    if (event.registration_required && event.max_attendees && event.current_registrations >= event.max_attendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    const result = await query(`
      INSERT INTO event_registrations (event_id, name, email, phone, organization, survey_responses)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, name, email, phone, organization, survey_responses || {}]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Update registration status
router.put('/:id/registrations/:registrationId', auth, async (req, res) => {
  try {
    const { id, registrationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check if user owns the event
    const eventCheck = await query(`
      SELECT id FROM events WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    const result = await query(`
      UPDATE event_registrations 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND event_id = $3
      RETURNING *
    `, [status, registrationId, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

// Delete registration
router.delete('/:id/registrations/:registrationId', auth, async (req, res) => {
  try {
    const { id, registrationId } = req.params;
    const userId = req.user.id;

    // Check if user owns the event
    const eventCheck = await query(`
      SELECT id FROM events WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    const result = await query(`
      DELETE FROM event_registrations 
      WHERE id = $1 AND event_id = $2
      RETURNING id
    `, [registrationId, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

module.exports = router; 