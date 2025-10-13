const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internship');

const app = express();
console.log('internshipRoutes:', internshipRoutes);

app.use(cors({
  origin: 'http://localhost:3000', // frontend
  credentials: true,               // allow cookies
}));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/internship', internshipRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
