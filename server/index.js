require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const qaRoutes = require('./routes/qa');
const historyRoutes = require('./routes/history');
const modelRoutes = require('./routes/model');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// MongoDB connection (optional - falls back to in-memory if not configured)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️  MongoDB not connected, using in-memory storage:', err.message));
}

// Routes
app.use('/api/qa', qaRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/model', modelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    activeModel: process.env.ACTIVE_MODEL || 'claude',
    customModelUrl: process.env.CUSTOM_MODEL_URL || null,
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🏛️  Bangladesh Law QA Server running on port ${PORT}`);
  console.log(`📡 Active model: ${process.env.ACTIVE_MODEL || 'claude'}`);
  if (process.env.CUSTOM_MODEL_URL) {
    console.log(`🔗 Custom model URL: ${process.env.CUSTOM_MODEL_URL}`);
  }
});
