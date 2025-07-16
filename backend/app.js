const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const vehicleRoutes = require('./routes/vehicle');
const preBookingRoutes = require('./routes/preBooking');
const roomRoutes = require('./routes/room');

// Load env vars
dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://your-netlify-site.netlify.app', // Replace with your actual Netlify URL after deploy
  'https://akr.lk' // For future use
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/prebookings', preBookingRoutes);
app.use('/api/rooms', roomRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;

