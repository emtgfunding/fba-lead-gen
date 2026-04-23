/**
 * Mock provider - deterministic realistic Amazon product data.
 * Replace with real API (Keepa/Rainforest) in production.
 */

const CATEGORIES = [
  { id: 'home-kitchen', name: 'Home & Kitchen', referralPct: 0.15 },
  { id: 'beauty', name: 'Beauty & Personal Care', referralPct: 0.15 },
  { id: 'health', name: 'Health & Household', referralPct: 0.15 },
  { id: 'toys-games', name: 'Toys & Games', referralPct: 0.15 },
  { id: 'sports-outdoors', name: 'Sports & Outdoors', referralPct: 0.15 },
  { id: 'electronics', name: 'Electronics', referralPct: 0.08 },
  { id: 'office-products', name: 'Office Products', referralPct: 0.15 },
  { id: 'pet-supplies', name: 'Pet Supplies', referralPct: 0.15 },
  { id: 'baby', name: 'Baby Products', referralPct: 0.08 },
  { id: 'grocery', name: 'Grocery & Gourmet Food', referralPct: 0.08 },
  { id: 'tools', name: 'Tools & Home Improvement', referralPct: 0.15 },
  { id: 'automotive', name: 'Automotive', referralPct: 0.12 },
  { id: 'clothing', name: 'Clothing, Shoes & Jewelry', referralPct: 0.17 },
  { id: 'books', name: 'Books', referralPct: 0.15 },
  { id: 'patio-garden', name: 'Patio, Lawn & Garden', referralPct: 0.15 },
  { id: 'arts-crafts', name: 'Arts, Crafts & Sewing', referralPct: 0.15 }
];

// Product name seed pools per category for realistic-sounding titles
const PRODUCT_TEMPLATES = {
  'home-kitchen': [
    'Stainless Steel {item} Set of {n}', 'Silicone {item} with Non-Slip Grip',
    'Premium {item} Organizer', 'Collapsible {item} for Small Spaces',
    '{item} with LED Display', 'Heavy Duty {item} Rack',
    'Bamboo {item} Cutting Board', 'Reusable {item} Storage Bags'
  ],
  'beauty': [
    'Vitamin C {item} Serum 30ml', 'Hyaluronic Acid {item} Face Cream',
    'Organic {item} Oil Cold Pressed', 'Sulfate Free {item} Shampoo',
    'Retinol {item} Night Cream', '{item} Hair Growth Treatment',
    'Jade Roller {item} Massager'
  ],
  'health': [
    '{item} Supplement 60 Capsules', 'Digital {item} Thermometer',
    '{item} Vitamin Gummies 120ct', 'Posture Corrector {item} Brace',
    '{item} Essential Oil 100% Pure', 'Probiotic {item} 50 Billion CFU'
  ],
  'toys-games': [
    'STEM {item} Building Kit', 'Educational {item} for Kids Ages 4-8',
    'Wooden {item} Puzzle Set', 'Remote Control {item} Car',
    'Sensory {item} Fidget Toy', '{item} Board Game Family Edition'
  ],
  'sports-outdoors': [
    'Resistance Bands {item} Set', 'Yoga {item} Mat Non-Slip',
    'Insulated {item} Water Bottle 32oz', 'Foam Roller {item} Deep Tissue',
    '{item} Jump Rope Tangle Free', 'Hiking {item} Backpack 40L'
  ],
  'electronics': [
    'Wireless {item} Earbuds Bluetooth 5.3', 'USB-C {item} Hub 7-in-1',
    '{item} Charging Cable 6ft Braided', 'LED {item} Ring Light 10 inch',
    'Portable {item} Power Bank 20000mAh', '{item} Screen Protector Tempered Glass'
  ],
  'office-products': [
    '{item} Desk Organizer Mesh', 'Ergonomic {item} Wrist Rest',
    'Sticky {item} Notes 12 Pack', '{item} Laminator Machine',
    'Monitor {item} Stand Riser', 'Heavy Duty {item} Stapler'
  ],
  'pet-supplies': [
    '{item} Dog Treats Grain Free', 'Interactive {item} Cat Toy',
    'Slow Feeder {item} Bowl', 'Retractable {item} Dog Leash 16ft',
    '{item} Pet Grooming Brush', 'Orthopedic {item} Dog Bed'
  ],
  'baby': [
    '{item} Silicone Baby Bib', 'Convertible {item} Car Seat',
    '{item} Baby Monitor HD', 'Organic {item} Baby Lotion',
    'Teething {item} Toy BPA Free', '{item} Diaper Bag Backpack'
  ],
  'grocery': [
    'Organic {item} Coffee Beans 2lb', '{item} Protein Powder Chocolate 2lb',
    '{item} Matcha Green Tea Powder', 'Himalayan {item} Pink Salt',
    '{item} Collagen Peptides Unflavored'
  ],
  'tools': [
    '{item} Drill Bit Set 100pc', 'Cordless {item} Screwdriver 4V',
    'Magnetic {item} Wristband', '{item} Tape Measure 25ft',
    'Laser {item} Level Self Leveling', '{item} Tool Bag 14 inch'
  ],
  'automotive': [
    '{item} Phone Mount for Car', 'Microfiber {item} Cleaning Cloth 12pk',
    '{item} Dash Cam 1080p', 'Leather {item} Steering Wheel Cover',
    '{item} Trunk Organizer Collapsible', '{item} Tire Pressure Gauge Digital'
  ],
  'clothing': [
    '{item} Compression Socks 6 Pair', 'Moisture Wicking {item} Running Shirt',
    '{item} No Show Socks Women', 'Fleece {item} Beanie Hat',
    '{item} Athletic Shorts Quick Dry'
  ],
  'books': [
    'The {item} Cookbook', '{item}: A Complete Guide',
    'Mastering {item} in 30 Days', '{item} for Beginners',
    'The Art of {item}'
  ],
  'patio-garden': [
    '{item} Solar Lights Outdoor 8pk', 'Self Watering {item} Planter',
    '{item} Garden Hose 50ft Expandable', 'Raised {item} Garden Bed',
    '{item} Weed Puller Tool'
  ],
  'arts-crafts': [
    '{item} Acrylic Paint Set 24 Colors', 'Diamond {item} Painting Kit',
    '{item} Calligraphy Pens 8pc', 'Washi {item} Tape 48 Rolls',
    '{item} Resin Kit Crystal Clear'
  ]
};

const ITEMS_BY_CATEGORY = {
  'home-kitchen': ['Measuring Cup', 'Spice Jar', 'Knife', 'Can Opener', 'Mixing Bowl', 'Kitchen Scale', 'Spatula', 'Storage Container'],
  'beauty': ['Face', 'Hair', 'Skin', 'Eye', 'Lip', 'Nail', 'Body'],
  'health': ['Magnesium', 'Vitamin D3', 'Zinc', 'Omega 3', 'Melatonin', 'Turmeric'],
  'toys-games': ['Robot', 'Science', 'Magnetic', 'Dinosaur', 'Unicorn', 'Puzzle'],
  'sports-outdoors': ['Training', 'Workout', 'Fitness', 'Athletic', 'Outdoor', 'Camping'],
  'electronics': ['Phone', 'Laptop', 'Gaming', 'Audio', 'Video', 'Travel'],
  'office-products': ['Desk', 'File', 'Paper', 'Cable', 'Document', 'Label'],
  'pet-supplies': ['Dog', 'Cat', 'Puppy', 'Small Dog', 'Large Breed'],
  'baby': ['Infant', 'Toddler', 'Newborn', 'Baby Shower', 'Nursery'],
  'grocery': ['Keto', 'Vegan', 'Organic', 'Gluten Free', 'Plant Based'],
  'tools': ['Power', 'Hand', 'Impact', 'Rotary', 'Precision'],
  'automotive': ['Auto', 'Car', 'Truck', 'SUV', 'Vehicle'],
  'clothing': ['Men', 'Women', 'Kids', 'Athletic', 'Casual'],
  'books': ['Productivity', 'Finance', 'Cooking', 'Fitness', 'Gardening'],
  'patio-garden': ['Garden', 'Lawn', 'Patio', 'Backyard', 'Outdoor'],
  'arts-crafts': ['Professional', 'Beginner', 'Artist', 'Craft', 'DIY']
};

const BRANDS = ['Amazon Basics', 'Generic', 'HomePro', 'PrimeChoice', 'EliteGear', 'NovaCraft', 'PureLife', 'ZenLiving', 'NorthPeak', 'CoreEssentials', 'VitalTouch', 'MaxReach'];

// Seeded RNG for deterministic results
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function range(rng, min, max) {
  return min + rng() * (max - min);
}

function generateAsin(rng) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let asin = 'B0';
  for (let i = 0; i < 8; i++) asin += chars[Math.floor(rng() * chars.length)];
  return asin;
}

// Generate a category-themed inline SVG placeholder (reliable, no external dependency)
function generatePlaceholderSvg(brand, categoryId) {
  const colors = {
    'home-kitchen':    ['#fef3c7', '#92400e'],
    'beauty':          ['#fce7f3', '#9f1239'],
    'health':          ['#dcfce7', '#166534'],
    'toys-games':      ['#fef9c3', '#854d0e'],
    'sports-outdoors': ['#dbeafe', '#1e40af'],
    'electronics':     ['#e0e7ff', '#3730a3'],
    'office-products': ['#f1f5f9', '#334155'],
    'pet-supplies':    ['#ffedd5', '#9a3412'],
    'baby':            ['#fae8ff', '#86198f'],
    'grocery':         ['#ecfccb', '#365314'],
    'tools':           ['#fef2f2', '#991b1b'],
    'automotive':      ['#f3f4f6', '#1f2937'],
    'clothing':        ['#cffafe', '#155e75'],
    'books':           ['#fef3c7', '#713f12'],
    'patio-garden':    ['#d1fae5', '#065f46'],
    'arts-crafts':     ['#fce7f3', '#831843']
  };
  const [bg, fg] = colors[categoryId] || ['#f1f5f9', '#334155'];
  const letter = (brand || 'P').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet"><rect width="200" height="200" fill="${bg}"/><text x="100" y="125" font-family="Helvetica, Arial, sans-serif" font-size="90" font-weight="700" fill="${fg}" text-anchor="middle">${letter}</text></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

function generateProduct(seed, categoryId) {
  const rng = mulberry32(seed);
  const cat = CATEGORIES.find(c => c.id === categoryId) || pick(rng, CATEGORIES);
  const template = pick(rng, PRODUCT_TEMPLATES[cat.id] || PRODUCT_TEMPLATES['home-kitchen']);
  const item = pick(rng, ITEMS_BY_CATEGORY[cat.id] || ITEMS_BY_CATEGORY['home-kitchen']);
  const brand = pick(rng, BRANDS);
  const title = `${brand} ${template.replace('{item}', item).replace('{n}', Math.floor(range(rng, 2, 12)))}`;

  // Amazon price
  const amazonPrice = Math.round(range(rng, 7.99, 89.99) * 100) / 100;
  // Source/supplier cost (what you'd pay at retail/wholesale)
  const sourcePrice = Math.round(amazonPrice * range(rng, 0.25, 0.55) * 100) / 100;
  // BSR - lower is better
  const bsr = Math.floor(range(rng, 500, 250000));
  // Estimated monthly sales (inverse relationship with BSR, roughly)
  const baseSales = Math.max(30, Math.floor(30000 / Math.sqrt(bsr)));
  const estMonthlySales = Math.floor(baseSales * range(rng, 0.7, 1.5));
  const reviews = Math.floor(range(rng, 5, 8500));
  const rating = Math.round(range(rng, 3.4, 4.9) * 10) / 10;
  const weight = Math.round(range(rng, 0.1, 6.0) * 10) / 10; // lbs
  const sellerCount = Math.floor(range(rng, 1, 25));

  // FBA fee estimate (size-based, simplified)
  let fbaFee;
  if (weight < 0.75) fbaFee = 3.22;
  else if (weight < 1) fbaFee = 3.77;
  else if (weight < 2) fbaFee = 4.75;
  else if (weight < 3) fbaFee = 5.40;
  else fbaFee = 5.40 + (weight - 3) * 0.38;
  fbaFee = Math.round(fbaFee * 100) / 100;

  // Reference/historical average for arbitrage signal
  const avg90dPrice = Math.round(amazonPrice * range(rng, 1.0, 1.35) * 100) / 100;

  // Trending signal (random-ish but some bias toward lower BSR)
  const trendScore = Math.round((rng() * 100 - (bsr / 10000)) * 10) / 10;

  const sellerType = pick(rng, ['FBA', 'FBA', 'FBA', 'FBM', 'Amazon']);

  return {
    asin: generateAsin(rng),
    title,
    brand,
    category: cat.id,
    categoryName: cat.name,
    imageUrl: generatePlaceholderSvg(brand, cat.id),
    amazonUrl: `https://www.amazon.com/dp/${generateAsin(rng)}`,
    price: amazonPrice,
    sourcePrice,
    avg90dPrice,
    bsr,
    estMonthlySales,
    reviews,
    rating,
    weight,
    sellerCount,
    sellerType,
    fbaFee,
    referralFeePct: cat.referralPct,
    trendScore,
    dateFirstAvailable: new Date(Date.now() - Math.floor(range(rng, 30, 1500)) * 86400000).toISOString().split('T')[0]
  };
}

// ---------- Public API ----------

async function getCategories() {
  return CATEGORIES.map(c => ({ id: c.id, name: c.name }));
}

async function search({ query = '', category = '', minPrice, maxPrice, minBsr, maxBsr, minSales, maxReviews, minRating, sellerType, sortBy = 'sales', limit = 50 }) {
  const seed = hashString(`${query}|${category}|${minPrice}|${maxPrice}|${sortBy}`);
  const rng = mulberry32(seed);
  const pool = [];

  // Generate a larger candidate pool; filter down
  const targetCount = 200;
  for (let i = 0; i < targetCount; i++) {
    const catId = category || pick(rng, CATEGORIES).id;
    pool.push(generateProduct(seed + i * 7919, catId));
  }

  const filterRng = mulberry32(seed + 1);
  let filtered = pool.filter(p => {
    if (query) {
      const q = query.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) {
        // Soft-match: keep ~30% of non-matches so query still returns useful variety
        if (filterRng() > 0.3) return false;
      }
    }
    if (minPrice != null && p.price < minPrice) return false;
    if (maxPrice != null && p.price > maxPrice) return false;
    if (minBsr != null && p.bsr < minBsr) return false;
    if (maxBsr != null && p.bsr > maxBsr) return false;
    if (minSales != null && p.estMonthlySales < minSales) return false;
    if (maxReviews != null && p.reviews > maxReviews) return false;
    if (minRating != null && p.rating < minRating) return false;
    if (sellerType && p.sellerType !== sellerType) return false;
    return true;
  });

  // Sort
  const sorts = {
    sales: (a, b) => b.estMonthlySales - a.estMonthlySales,
    bsr: (a, b) => a.bsr - b.bsr,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    reviews: (a, b) => b.reviews - a.reviews,
    newest: (a, b) => new Date(b.dateFirstAvailable) - new Date(a.dateFirstAvailable),
    trend: (a, b) => b.trendScore - a.trendScore
  };
  filtered.sort(sorts[sortBy] || sorts.sales);

  return filtered.slice(0, limit);
}

async function getByAsin(asin) {
  const seed = hashString(asin);
  return generateProduct(seed, pick(mulberry32(seed), CATEGORIES).id);
}

module.exports = { search, getByAsin, getCategories };