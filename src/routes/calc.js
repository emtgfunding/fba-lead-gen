const express = require('express');
const { calculate } = require('../services/profitCalc');

const router = express.Router();

router.post('/', (req, res) => {
  const result = calculate(req.body);
  res.json(result);
});

module.exports = router;
