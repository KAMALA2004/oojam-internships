// index.js
require('dotenv').config(); // ← load .env variables
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internship');

const app = express();
console.log('internshipRoutes:', internshipRoutes);

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // frontend
  credentials: true,               // allow cookies
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET, // ← using .env secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true if using HTTPS
  })
);

// Routes
app.use('/api', authRoutes);
app.use('/api/internship', internshipRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
