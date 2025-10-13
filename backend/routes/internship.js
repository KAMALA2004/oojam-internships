const express = require('express');
const db = require('../db');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route
router.post('/', upload.fields([
  { name: 'photo' },
  { name: 'resume' },
  { name: 'adhaar_card' }
]), (req, res) => {
  const data = req.body;
  console.log('Files:', req.files);
  console.log('Received internship data:', data);  // ← add this

  const query = `
    INSERT INTO internship_registrations 
    (full_name, gender, dob, email, phone_number, address, university_name, course_program, 
      year_of_study, major, current_gpa, internship_area, internship_duration, start_date, 
      internship_mode, relevant_skills, portfolio_links, emergency_contact_name, emergency_contact_phone,
      photo_path, resume_path, adhaar_card_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.full_name, data.gender, data.dob, data.email, data.phone_number, data.address,
    data.university_name, data.course_program, data.year_of_study, data.major, data.current_gpa,
    data.internship_area, data.internship_duration, data.start_date, data.internship_mode,
    data.relevant_skills, data.portfolio_links, data.emergency_contact_name, data.emergency_contact_phone,
    req.files.photo ? req.files.photo[0].path : null,
    req.files.resume ? req.files.resume[0].path : null,
    req.files.adhaar_card ? req.files.adhaar_card[0].path : null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Internship registration saved successfully' });
  });
});

module.exports = router;
