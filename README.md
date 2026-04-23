# FBA Lead Generator

Amazon FBA product research tool. Search, filter, and save potential leads for retail arbitrage, online arbitrage, wholesale, and private label sourcing. Includes an FBA profit calculator.

**Status:** Prototype running on mock data. Pluggable provider layer ready for Keepa and Rainforest APIs.

## Features

- **4 research modes:** All Products, Arbitrage Scanner, Wholesale/OA, Private Label
- **Advanced filters:** category, price range, BSR, monthly sales, reviews, rating, seller type, ROI
- **FBA profit calculator:** referral fees, FBA fulfillment fees, prep, shipping — with verdict labels (Home Run → Skip)
- **Saved leads:** status workflow (researching → sourced → listed → sold), CSV export
- **Pluggable data providers:** swap between mock / Keepa / Rainforest with a single env variable

## Local Development

```bash
cp .env.example .env
npm install
npm start
```

Visit http://localhost:3000

For auto-reload during dev:
```bash
npm run dev
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo. Railway auto-detects Node.
4. In the service settings → Variables, add:
   - `DATA_PROVIDER=mock` (or `keepa` / `rainforest` once you have API keys)
5. Deploy. Railway gives you a `*.up.railway.app` URL.

To use a custom domain: Settings → Networking → Add Custom Domain.

## Switching to Real Amazon Data

The app ships with a mock provider so it works out of the box. When you're ready for real data:

### Option A — Keepa (recommended for FBA research)
Best for: sales rank history, price history, estimated monthly sales.
Pricing: ~€19–€149/mo depending on request volume.

1. Sign up at https://keepa.com/#!api
2. Add Railway env vars:
   ```
   DATA_PROVIDER=keepa
   KEEPA_API_KEY=your_key_here
   ```
3. Implement the TODOs in `src/providers/keepa.js` (example code included)

### Option B — Rainforest API (live data)
Best for: live search results, product pages, review data.
Pricing: ~$50/mo starter.

1. Sign up at https://www.rainforestapi.com/
2. Add Railway env vars:
   ```
   DATA_PROVIDER=rainforest
   RAINFOREST_API_KEY=your_key_here
   ```
3. Implement the TODOs in `src/providers/rainforest.js`

Most serious FBA tools combine both — Keepa for historical, Rainforest for live.

## Project Structure

```
src/
  server.js                  Express app entry
  providers/
    index.js                 Provider factory (mock/keepa/rainforest)
    mock.js                  Realistic fake data (dev default)
    keepa.js                 Keepa API adapter (stub)
    rainforest.js            Rainforest API adapter (stub)
  services/
    profitCalc.js            FBA fee + ROI math
    leadStore.js             Saved leads (in-memory; swap for Postgres)
  routes/
    search.js                /api/search
    leads.js                 /api/leads (CRUD + CSV export)
    calc.js                  /api/calc
  public/
    index.html
    styles.css
    app.js
```

## Production Checklist

Before going live with real data & real users:

- [ ] Subscribe to Keepa and/or Rainforest API
- [ ] Swap in-memory lead storage for Postgres (Railway provides it)
- [ ] Add user auth (so leads are per-user, not shared)
- [ ] Cache API responses in Postgres to avoid burning tokens
- [ ] Add a real product image scraper (current images are placeholders)
- [ ] Set up custom domain + SSL via Railway
- [ ] Add rate limiting per user
- [ ] Add error tracking (Sentry)

## API Reference

### `GET /api/search`
Query params: `q, category, minPrice, maxPrice, minBsr, maxBsr, minSales, maxReviews, minRating, minRoi, sellerType, sortBy, mode, limit`

### `GET /api/search/categories`
Returns category list.

### `GET /api/search/asin/:asin`
Single product lookup.

### `GET /api/leads`
Returns all saved leads.

### `GET /api/leads/export.csv`
Downloads all leads as CSV.

### `POST /api/leads`
Body: full product object (must include `asin`).

### `PATCH /api/leads/:asin`
Update status, notes, etc.

### `DELETE /api/leads/:asin`

### `POST /api/calc`
Body: `{ salePrice, sourceCost, fbaFee, referralFeePct, prepCost, shipToAmazonCost, miscCost }`
Returns ROI, margin, net profit, verdict.

### `GET /health`
Railway healthcheck endpoint.
