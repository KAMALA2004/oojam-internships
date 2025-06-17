const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
        }
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json({ message: 'User registered successfully' });
    }
  );
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check internship registration status
    db.query(
      'SELECT * FROM internship_registrations WHERE email = ?',
      [email],
      (regErr, regResults) => {
        if (regErr) return res.status(500).json({ message: 'Registration check failed' });

        const isRegistered = regResults.length > 0;
        res.status(200).json({ message: 'Login successful', isRegistered });
      }
    );
  });
});

module.exports = router;
