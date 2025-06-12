// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/new', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const query = 'INSERT IGNORE INTO users (email) VALUES (?)';
  db.query(query, [email], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User added or already exists' });
  });
});

module.exports = router;
