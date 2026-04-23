/**
 * Data Provider Factory
 *
 * Swappable data source. Mock by default. Drop in real API keys later.
 *
 * To switch to real data:
 *   1. Sign up for Keepa API (~$19-149/mo) and/or Rainforest API
 *   2. Set env vars: DATA_PROVIDER=keepa KEEPA_API_KEY=xxx
 *   3. Restart. No other code changes needed.
 */

const mockProvider = require('./mock');
const keepaProvider = require('./keepa');
const rainforestProvider = require('./rainforest');

const providers = {
  mock: mockProvider,
  keepa: keepaProvider,
  rainforest: rainforestProvider
};

function getProvider() {
  const name = (process.env.DATA_PROVIDER || 'mock').toLowerCase();
  const provider = providers[name];

  if (!provider) {
    console.warn(`Unknown provider "${name}", using mock`);
    return providers.mock;
  }
  if (name === 'keepa' && !process.env.KEEPA_API_KEY) {
    console.warn('KEEPA_API_KEY missing, using mock');
    return providers.mock;
  }
  if (name === 'rainforest' && !process.env.RAINFOREST_API_KEY) {
    console.warn('RAINFOREST_API_KEY missing, using mock');
    return providers.mock;
  }
  return provider;
}

module.exports = { getProvider };
