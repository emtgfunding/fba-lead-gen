// ======== State ========
const state = {
  mode: 'all',
  leads: new Map()
};

// ======== Elements ========
const $ = (id) => document.getElementById(id);
const els = {
  searchPanel: $('searchPanel'),
  leadsPanel: $('leadsPanel'),
  calcPanel: $('calcPanel'),
  navSearch: $('navSearch'),
  navLeads: $('navLeads'),
  navCalc: $('navCalc'),
  leadCount: $('leadCount'),
  results: $('results'),
  emptyState: $('emptyState'),
  resultCount: $('resultCount'),
  modeTabs: document.querySelectorAll('.mode-tab'),
  btnSearch: $('btnSearch'),
  btnReset: $('btnReset'),
  category: $('category'),
  modal: $('modal'),
  modalBody: $('modalBody'),
  leadsList: $('leadsList'),
  leadsEmpty: $('leadsEmpty'),
  toast: $('toast')
};

// ======== Helpers ========
const money = (n) => '$' + Number(n).toFixed(2);
const num = (n) => Number(n).toLocaleString('en-US');
const pct = (n) => `${n}%`;

function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.remove('hidden');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => els.toast.classList.add('hidden'), 2400);
}

function setPanel(name) {
  els.searchPanel.classList.toggle('hidden', name !== 'search');
  els.leadsPanel.classList.toggle('hidden', name !== 'leads');
  els.calcPanel.classList.toggle('hidden', name !== 'calc');
  if (name === 'leads') renderLeads();
  if (name === 'calc') runCalc();
}

// ======== Nav ========
els.navSearch.onclick = () => setPanel('search');
els.navLeads.onclick = () => setPanel('leads');
els.navCalc.onclick = () => setPanel('calc');

// ======== Mode tabs ========
els.modeTabs.forEach(tab => {
  tab.onclick = () => {
    els.modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.mode = tab.dataset.mode;
    runSearch();
  };
});

// ======== Load categories ========
async function loadCategories() {
  try {
    const res = await fetch('/api/search/categories');
    const data = await res.json();
    els.category.innerHTML = '<option value="">All categories</option>' +
      data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  } catch (e) { console.error('Failed to load categories', e); }
}

// ======== Search ========
function buildSearchUrl() {
  const p = new URLSearchParams();
  const q = $('q').value.trim();
  if (q) p.set('q', q);
  if ($('category').value) p.set('category', $('category').value);
  if ($('minPrice').value) p.set('minPrice', $('minPrice').value);
  if ($('maxPrice').value) p.set('maxPrice', $('maxPrice').value);
  if ($('maxBsr').value) p.set('maxBsr', $('maxBsr').value);
  if ($('minSales').value) p.set('minSales', $('minSales').value);
  if ($('minRoi').value) p.set('minRoi', $('minRoi').value);
  if ($('maxReviews').value) p.set('maxReviews', $('maxReviews').value);
  if ($('minRating').value) p.set('minRating', $('minRating').value);
  if ($('sellerType').value) p.set('sellerType', $('sellerType').value);
  p.set('sortBy', $('sortBy').value);
  p.set('limit', '60');
  if (state.mode !== 'all') p.set('mode', state.mode);
  return '/api/search?' + p.toString();
}

function showSkeleton() {
  els.emptyState.classList.add('hidden');
  els.results.innerHTML = Array.from({ length: 8 }, () => '<div class="skeleton-card"></div>').join('');
  els.results.className = 'skeleton-grid';
}

async function runSearch() {
  showSkeleton();
  els.resultCount.textContent = 'Searching...';
  try {
    const res = await fetch(buildSearchUrl());
    const data = await res.json();
    renderResults(data.results);
    els.resultCount.textContent = data.results.length === 0
      ? 'No products match these filters'
      : `${data.results.length} products found`;
  } catch (e) {
    console.error(e);
    els.resultCount.textContent = 'Search failed';
  }
}

function renderResults(products) {
  els.results.className = 'results';
  if (!products.length) {
    els.results.innerHTML = '';
    els.emptyState.classList.remove('hidden');
    els.emptyState.querySelector('h3').textContent = 'No matches found';
    els.emptyState.querySelector('p').innerHTML = 'Try loosening your filters or switching modes.';
    return;
  }
  els.emptyState.classList.add('hidden');
  els.results.innerHTML = products.map(cardHtml).join('');
  els.results.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const asin = btn.dataset.asin;
      const product = products.find(p => p.asin === asin);
      if (action === 'save') saveLead(product);
      if (action === 'detail') showDetail(product);
    };
  });
}

function cardHtml(p) {
  const { calc } = p;
  const netClass = calc.netProfit >= 0 ? 'pos' : 'neg';
  const spread = p.price - p.sourcePrice;
  const arbSignal = p.avg90dPrice > p.price
    ? `<span style="color: var(--success); font-size: 11px;">↓ $${(p.avg90dPrice - p.price).toFixed(2)} below 90d avg</span>`
    : '';

  return `
    <div class="product-card">
      <div class="product-head">
        <img class="product-img" src="${p.imageUrl}" alt="" loading="lazy" />
        <div class="product-head-text">
          <div class="product-title">${escapeHtml(p.title)}</div>
          <div class="product-meta">
            <span class="product-asin">${p.asin}</span>
            <span>·</span>
            <span>${p.categoryName}</span>
          </div>
          <div class="product-meta" style="margin-top: 4px;">
            <span class="verdict verdict-${calc.verdict.color}">${calc.verdict.label}</span>
            <span>${p.sellerType}</span>
          </div>
        </div>
      </div>

      <div class="product-stats">
        <div class="stat">
          <div class="stat-label">Amazon price</div>
          <div class="stat-value stat-value-lg">${money(p.price)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Source cost</div>
          <div class="stat-value">${money(p.sourcePrice)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Est. monthly sales</div>
          <div class="stat-value">${num(p.estMonthlySales)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Best Sellers Rank</div>
          <div class="stat-value">#${num(p.bsr)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Reviews · Rating</div>
          <div class="stat-value">${num(p.reviews)} · ${p.rating}★</div>
        </div>
        <div class="stat">
          <div class="stat-label">Sellers</div>
          <div class="stat-value">${p.sellerCount}</div>
        </div>
      </div>

      <div class="product-profit">
        <div>
          <div class="profit-label">Net profit</div>
          <div class="profit-net ${netClass}">${money(calc.netProfit)}</div>
          ${arbSignal}
        </div>
        <div style="text-align: right;">
          <div class="profit-label">ROI · Margin</div>
          <div class="profit-roi"><strong class="${calc.roi >= 30 ? 'pos' : ''}">${calc.roi}%</strong> · ${calc.margin}%</div>
        </div>
      </div>

      <div class="product-actions">
        <button class="btn btn-sm btn-ghost" data-action="detail" data-asin="${p.asin}">View details</button>
        <button class="btn btn-sm btn-primary" data-action="save" data-asin="${p.asin}">Save lead</button>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ======== Detail modal ========
function showDetail(p) {
  const { calc } = p;
  els.modalBody.innerHTML = `
    <div style="display: flex; gap: 16px; margin-bottom: 20px;">
      <img src="${p.imageUrl}" style="width: 120px; height: 120px; border-radius: 10px; background: var(--bg-input);" />
      <div style="flex: 1;">
        <h3 style="font-size: 18px; font-weight: 700; line-height: 1.3;">${escapeHtml(p.title)}</h3>
        <div class="product-meta" style="margin-top: 8px;">
          <span class="product-asin">${p.asin}</span> ·
          <span>${p.brand}</span> ·
          <span>${p.categoryName}</span>
        </div>
        <div style="margin-top: 10px;"><span class="verdict verdict-${calc.verdict.color}">${calc.verdict.label}</span></div>
      </div>
    </div>

    <h4 style="font-size: 13px; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.05em; margin-bottom: 10px;">Product</h4>
    <div class="product-stats" style="margin-bottom: 20px; border-radius: 8px; overflow: hidden;">
      <div class="stat"><div class="stat-label">Amazon price</div><div class="stat-value stat-value-lg">${money(p.price)}</div></div>
      <div class="stat"><div class="stat-label">90-day avg</div><div class="stat-value">${money(p.avg90dPrice)}</div></div>
      <div class="stat"><div class="stat-label">BSR</div><div class="stat-value">#${num(p.bsr)}</div></div>
      <div class="stat"><div class="stat-label">Est. monthly sales</div><div class="stat-value">${num(p.estMonthlySales)}</div></div>
      <div class="stat"><div class="stat-label">Reviews</div><div class="stat-value">${num(p.reviews)}</div></div>
      <div class="stat"><div class="stat-label">Rating</div><div class="stat-value">${p.rating}★</div></div>
      <div class="stat"><div class="stat-label">Weight</div><div class="stat-value">${p.weight} lb</div></div>
      <div class="stat"><div class="stat-label">Sellers</div><div class="stat-value">${p.sellerCount} (${p.sellerType})</div></div>
    </div>

    <h4 style="font-size: 13px; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.05em; margin-bottom: 10px;">Profit breakdown</h4>
    <div class="calc-breakdown" style="margin-bottom: 20px;">
      <div class="row"><span>Sale price</span><span>${money(calc.salePrice)}</span></div>
      <div class="row"><span>− Referral fee (${Math.round(p.referralFeePct*100)}%)</span><span>${money(calc.referralFee)}</span></div>
      <div class="row"><span>− FBA fulfillment fee</span><span>${money(calc.fbaFee)}</span></div>
      <div class="row"><span>− Source cost</span><span>${money(calc.sourceCost)}</span></div>
      <div class="row row-total"><span>= Net profit</span><span class="${calc.netProfit >= 0 ? 'pos' : 'neg'}">${money(calc.netProfit)}</span></div>
    </div>

    <div class="calc-metrics" style="margin-bottom: 20px;">
      <div><span>ROI</span><strong class="${calc.roi >= 30 ? 'pos' : ''}">${calc.roi}%</strong></div>
      <div><span>Margin</span><strong>${calc.margin}%</strong></div>
      <div><span>Break-even</span><strong>${money(calc.breakEvenPrice)}</strong></div>
    </div>

    <div style="display: flex; gap: 10px;">
      <a class="btn btn-secondary" href="${p.amazonUrl}" target="_blank" rel="noopener">View on Amazon</a>
      <button class="btn btn-primary" id="modalSave">Save Lead</button>
      <button class="btn btn-ghost" id="modalClose" style="margin-left: auto;">Close</button>
    </div>
  `;
  els.modal.classList.remove('hidden');
  $('modalSave').onclick = () => { saveLead(p); closeModal(); };
  $('modalClose').onclick = closeModal;
  els.modal.querySelector('.modal-backdrop').onclick = closeModal;
}
function closeModal() { els.modal.classList.add('hidden'); }

// ======== Leads ========
async function saveLead(p) {
  const payload = {
    asin: p.asin, title: p.title, brand: p.brand, category: p.categoryName,
    price: p.price, sourcePrice: p.sourcePrice,
    estMonthlySales: p.estMonthlySales, bsr: p.bsr,
    reviews: p.reviews, rating: p.rating,
    netProfit: p.calc.netProfit, roi: p.calc.roi,
    imageUrl: p.imageUrl, amazonUrl: p.amazonUrl
  };
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    showToast(`Saved: ${p.title.slice(0, 40)}...`);
    await refreshLeadCount();
  } catch (e) {
    showToast('Save failed');
  }
}

async function refreshLeadCount() {
  const res = await fetch('/api/leads');
  const data = await res.json();
  els.leadCount.textContent = data.leads.length;
  state.leads = new Map(data.leads.map(l => [l.asin, l]));
}

async function renderLeads() {
  const res = await fetch('/api/leads');
  const data = await res.json();
  if (data.leads.length === 0) {
    els.leadsList.innerHTML = '';
    els.leadsEmpty.classList.remove('hidden');
    return;
  }
  els.leadsEmpty.classList.add('hidden');
  els.leadsList.innerHTML = data.leads.map(l => `
    <div class="lead-row">
      <img src="${l.imageUrl}" alt="" />
      <div>
        <div class="lead-title">${escapeHtml(l.title || '')}</div>
        <div class="lead-meta">${l.asin} · ${l.category || ''} · ${l.brand || ''}</div>
      </div>
      <div class="lead-stat">
        <div class="lead-stat-label">Price</div>
        <div class="lead-stat-value">${money(l.price || 0)}</div>
      </div>
      <div class="lead-stat">
        <div class="lead-stat-label">Net profit</div>
        <div class="lead-stat-value ${l.netProfit >= 0 ? 'pos' : 'neg'}">${money(l.netProfit || 0)}</div>
      </div>
      <div class="lead-stat">
        <div class="lead-stat-label">ROI</div>
        <div class="lead-stat-value">${l.roi || 0}%</div>
      </div>
      <div style="display: flex; gap: 6px; align-items: center;">
        <select class="status-select" data-asin="${l.asin}">
          ${['researching','sourced','listed','sold','skip'].map(s =>
            `<option value="${s}" ${l.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-sm btn-danger" data-del="${l.asin}">Remove</button>
      </div>
    </div>
  `).join('');

  els.leadsList.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = async () => {
      await fetch('/api/leads/' + b.dataset.del, { method: 'DELETE' });
      await refreshLeadCount();
      renderLeads();
    };
  });
  els.leadsList.querySelectorAll('.status-select').forEach(s => {
    s.onchange = async () => {
      await fetch('/api/leads/' + s.dataset.asin, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: s.value })
      });
    };
  });
}

// ======== Calculator ========
const calcInputs = ['c_salePrice','c_sourceCost','c_fbaFee','c_referral','c_prep','c_ship','c_misc'];
calcInputs.forEach(id => $(id).addEventListener('input', runCalc));
async function runCalc() {
  const body = {
    salePrice: Number($('c_salePrice').value),
    sourceCost: Number($('c_sourceCost').value),
    fbaFee: Number($('c_fbaFee').value),
    referralFeePct: Number($('c_referral').value),
    prepCost: Number($('c_prep').value),
    shipToAmazonCost: Number($('c_ship').value),
    miscCost: Number($('c_misc').value)
  };
  const res = await fetch('/api/calc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const c = await res.json();
  const v = $('calcVerdict');
  v.textContent = c.verdict.label;
  v.className = 'calc-verdict verdict-' + c.verdict.color;
  $('calcProfit').textContent = money(c.netProfit);
  $('calcProfit').className = 'calc-profit-value ' + (c.netProfit >= 0 ? 'pos' : 'neg');
  $('calcRoi').textContent = c.roi + '%';
  $('calcMargin').textContent = c.margin + '%';
  $('calcBreakeven').textContent = money(c.breakEvenPrice);
  $('calcSale').textContent = money(c.salePrice);
  $('calcRef').textContent = money(c.referralFee);
  $('calcFba').textContent = money(c.fbaFee);
  $('calcCost').textContent = money(c.totalCost);
  $('calcProfit2').textContent = money(c.netProfit);
  $('calcProfit2').className = c.netProfit >= 0 ? 'pos' : 'neg';
}

// ======== Init ========
els.btnSearch.onclick = runSearch;
els.btnReset.onclick = () => {
  ['q','minPrice','maxPrice','maxBsr','minSales','minRoi','maxReviews'].forEach(id => $(id).value = '');
  ['category','minRating','sellerType'].forEach(id => $(id).selectedIndex = 0);
  $('sortBy').value = 'sales';
  runSearch();
};
$('q').addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });

loadCategories();
refreshLeadCount();
runSearch(); // show results immediately on load
