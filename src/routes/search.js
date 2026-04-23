const express = require('express');
const { getProvider } = require('../providers');
const { calculate } = require('../services/profitCalc');

const router = express.Router();

router.get('/categories', async (req, res, next) => {
  try {
    const provider = getProvider();
    const cats = await provider.getCategories();
    res.json({ categories: cats });
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const provider = getProvider();
    const requestedLimit = Math.min(Number(req.query.limit) || 50, 200);
    const hasPostFilter = !!(req.query.mode || req.query.minRoi);
    // Oversample when post-filters are present so the final set isn't empty
    const fetchLimit = hasPostFilter ? 200 : requestedLimit;

    const params = {
      query: req.query.q || '',
      category: req.query.category || '',
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minBsr: req.query.minBsr ? Number(req.query.minBsr) : undefined,
      maxBsr: req.query.maxBsr ? Number(req.query.maxBsr) : undefined,
      minSales: req.query.minSales ? Number(req.query.minSales) : undefined,
      maxReviews: req.query.maxReviews ? Number(req.query.maxReviews) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      sellerType: req.query.sellerType || undefined,
      sortBy: req.query.sortBy || 'sales',
      limit: fetchLimit
    };

    const results = await provider.search(params);

    // Attach profit calc to each result
    const enriched = results.map(p => {
      const calc = calculate({
        salePrice: p.price,
        sourceCost: p.sourcePrice,
        fbaFee: p.fbaFee,
        referralFeePct: p.referralFeePct
      });
      return { ...p, calc };
    });

    // Apply post-filter for ROI if requested (done after calc)
    let final = enriched;
    if (req.query.minRoi) {
      const minRoi = Number(req.query.minRoi);
      final = final.filter(p => p.calc.roi >= minRoi);
    }
    if (req.query.mode === 'arbitrage') {
      // Arbitrage mode: require a decent ROI AND price < 90d avg
      final = final.filter(p => p.calc.roi >= 30 && p.price < p.avg90dPrice);
    }
    if (req.query.mode === 'private_label') {
      // Private label: low-moderate reviews, decent sales, manageable competition
      final = final.filter(p => p.reviews < 1500 && p.estMonthlySales > 100 && p.sellerCount < 15);
    }
    if (req.query.mode === 'wholesale') {
      // Wholesale/OA: high volume movers
      final = final.filter(p => p.estMonthlySales > 500 && p.calc.roi >= 20);
    }

    // Truncate to requested limit after post-filtering
    final = final.slice(0, requestedLimit);

    res.json({
      count: final.length,
      provider: process.env.DATA_PROVIDER || 'mock',
      results: final
    });
  } catch (e) { next(e); }
});

router.get('/asin/:asin', async (req, res, next) => {
  try {
    const provider = getProvider();
    const product = await provider.getByAsin(req.params.asin);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const calc = calculate({
      salePrice: product.price,
      sourceCost: product.sourcePrice,
      fbaFee: product.fbaFee,
      referralFeePct: product.referralFeePct
    });
    res.json({ ...product, calc });
  } catch (e) { next(e); }
});

module.exports = router;
