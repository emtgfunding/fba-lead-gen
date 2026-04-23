/**
 * Lead storage - in-memory for prototype.
 * In production: swap for Postgres/Railway DB.
 */

const leads = new Map(); // asin -> lead

function saveLead(lead) {
  const entry = {
    ...lead,
    status: lead.status || 'researching',
    notes: lead.notes || '',
    savedAt: new Date().toISOString()
  };
  leads.set(lead.asin, entry);
  return entry;
}

function getLead(asin) {
  return leads.get(asin);
}

function getAllLeads() {
  return Array.from(leads.values()).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}

function deleteLead(asin) {
  return leads.delete(asin);
}

function updateLead(asin, updates) {
  const existing = leads.get(asin);
  if (!existing) return null;
  const updated = { ...existing, ...updates, asin };
  leads.set(asin, updated);
  return updated;
}

function toCsv() {
  const rows = getAllLeads();
  if (rows.length === 0) return 'asin,title\n';
  const headers = ['asin', 'title', 'brand', 'category', 'price', 'sourcePrice', 'estMonthlySales', 'bsr', 'reviews', 'rating', 'netProfit', 'roi', 'status', 'notes', 'savedAt'];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map(h => esc(r[h])).join(','));
  }
  return lines.join('\n');
}

module.exports = { saveLead, getLead, getAllLeads, deleteLead, updateLead, toCsv };
