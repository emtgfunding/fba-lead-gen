/**
 * Rainforest API provider
 *
 * Sign up: https://www.rainforestapi.com/
 * Pricing: ~$50/mo starter, scales up
 * Docs: https://www.rainforestapi.com/docs
 *
 * Provides: live Amazon search results, product pages, offers, reviews,
 * seller data, bestseller lists, category browse.
 *
 * Best paired with Keepa (Keepa = historical, Rainforest = live).
 *
 * Status: STUB - uncomment and test when API key is available.
 */

async function search(params) {
  throw new Error('Rainforest provider not yet implemented. Set DATA_PROVIDER=mock or add integration code.');
  // Example:
  //
  // const axios = require('axios');
  // const res = await axios.get('https://api.rainforestapi.com/request', {
  //   params: {
  //     api_key: process.env.RAINFOREST_API_KEY,
  //     type: 'search',
  //     amazon_domain: 'amazon.com',
  //     search_term: params.query,
  //     category_id: params.category,
  //     sort_by: 'featured',
  //     page: 1
  //   }
  // });
  // return res.data.search_results.map(normalizeRainforestProduct);
}

async function getByAsin(asin) {
  throw new Error('Rainforest provider not yet implemented.');
}

async function getCategories() {
  throw new Error('Rainforest provider not yet implemented.');
}

module.exports = { search, getByAsin, getCategories };
