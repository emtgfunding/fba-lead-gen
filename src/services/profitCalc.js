/**
 * FBA Profit Calculator
 * Computes net profit, ROI, margin given Amazon price + source cost + fees.
 *
 * Formulas follow Amazon's standard fee structure:
 *   Net Profit = Sale Price - Referral Fee - FBA Fee - Source Cost - Prep/Ship
 *   ROI        = Net Profit / Source Cost
 *   Margin     = Net Profit / Sale Price
 */

function calculate({ salePrice, sourceCost, fbaFee, referralFeePct = 0.15, prepCost = 0, shipToAmazonCost = 0, miscCost = 0 }) {
  salePrice = Number(salePrice) || 0;
  sourceCost = Number(sourceCost) || 0;
  fbaFee = Number(fbaFee) || 0;
  referralFeePct = Number(referralFeePct) || 0.15;
  prepCost = Number(prepCost) || 0;
  shipToAmazonCost = Number(shipToAmazonCost) || 0;
  miscCost = Number(miscCost) || 0;

  const referralFee = Math.round(salePrice * referralFeePct * 100) / 100;
  const totalFees = Math.round((referralFee + fbaFee) * 100) / 100;
  const totalCost = Math.round((sourceCost + prepCost + shipToAmazonCost + miscCost) * 100) / 100;
  const netProfit = Math.round((salePrice - totalFees - totalCost) * 100) / 100;
  const roi = sourceCost > 0 ? Math.round((netProfit / sourceCost) * 1000) / 10 : 0; // %
  const margin = salePrice > 0 ? Math.round((netProfit / salePrice) * 1000) / 10 : 0; // %
  const breakEvenPrice = Math.round((totalCost / (1 - referralFeePct) + fbaFee / (1 - referralFeePct)) * 100) / 100;

  return {
    salePrice,
    sourceCost,
    referralFee,
    fbaFee,
    totalFees,
    totalCost,
    netProfit,
    roi,
    margin,
    breakEvenPrice,
    verdict: verdictFor(roi, margin, netProfit)
  };
}

function verdictFor(roi, margin, netProfit) {
  if (netProfit < 1) return { label: 'Skip', color: 'red', reason: 'Negative or near-zero profit' };
  if (roi >= 100 && margin >= 30) return { label: 'Home Run', color: 'green', reason: 'Excellent ROI and margin' };
  if (roi >= 50 && margin >= 20) return { label: 'Strong Buy', color: 'green', reason: 'Strong FBA candidate' };
  if (roi >= 30 && margin >= 15) return { label: 'Good', color: 'lime', reason: 'Solid ROI for FBA' };
  if (roi >= 15) return { label: 'Marginal', color: 'yellow', reason: 'Watch carefully, thin margins' };
  return { label: 'Weak', color: 'orange', reason: 'Below FBA seller minimums' };
}

module.exports = { calculate };
