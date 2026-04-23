/**
 * Keepa API provider
 *
 * Sign up: https://keepa.com/#!api
 * Pricing: ~€19-149/mo depending on request volume
 * Docs: https://keepa.com/api.php
 *
 * Provides: price history, sales rank history, estimated monthly sales,
 * buy box data, review counts, category tree, product dimensions.
 *
 * Status: STUB - uncomment and test when API key is available.
 */

async function search(params) {
  throw new Error('Keepa provider not yet implemented. Set DATA_PROVIDER=mock or add integration code.');
  // Example implementation:
  //
  // const axios = require('axios');
  // const res = await axios.get('https://api.keepa.com/query', {
  //   params: {
  //     key: process.env.KEEPA_API_KEY,
  //     domain: 1, // amazon.com
  //     selection: JSON.stringify({
  //       category: params.category,
  //       current_SALES_lte: params.maxBsr,
  //       current_SALES_gte: params.minBsr,
  //       current_AMAZON_gte: (params.minPrice || 0) * 100,
  //       current_AMAZON_lte: (params.maxPrice || 999) * 100,
  //       perPage: params.limit || 50
  //     })
  //   }
  // });
  // return res.data.asinList.map(normalizeKeepaProduct);
}

async function getByAsin(asin) {
  throw new Error('Keepa provider not yet implemented.');
}

async function getCategories() {
  throw new Error('Keepa provider not yet implemented.');
}

module.exports = { search, getByAsin, getCategories };
