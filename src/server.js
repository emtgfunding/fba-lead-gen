require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const searchRoutes = require('./routes/search');
const leadsRoutes = require('./routes/leads');
const calcRoutes = require('./routes/calc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api/search', searchRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/calc', calcRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: process.env.DATA_PROVIDER || 'mock',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`FBA Lead Gen running on http://localhost:${PORT}`);
  console.log(`Data provider: ${process.env.DATA_PROVIDER || 'mock'}`);
});
