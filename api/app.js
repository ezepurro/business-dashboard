const express = require('express');

const app = express();

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'business-dashboard-api',
    timestamp: new Date().toISOString(),
  });
});

// Base route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Business Dashboard API running',
  });
});

module.exports = app;
