const express = require('express');
const store = require('../services/leadStore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ leads: store.getAllLeads() });
});

router.get('/export.csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="fba-leads.csv"');
  res.send(store.toCsv());
});

router.post('/', (req, res) => {
  if (!req.body.asin) return res.status(400).json({ error: 'asin required' });
  const saved = store.saveLead(req.body);
  res.status(201).json(saved);
});

router.patch('/:asin', (req, res) => {
  const updated = store.updateLead(req.params.asin, req.body);
  if (!updated) return res.status(404).json({ error: 'Lead not found' });
  res.json(updated);
});

router.delete('/:asin', (req, res) => {
  const deleted = store.deleteLead(req.params.asin);
  if (!deleted) return res.status(404).json({ error: 'Lead not found' });
  res.json({ ok: true });
});

module.exports = router;
