export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Compact axis labels, e.g. ৳12.5k */
export function formatCurrencyCompact(value: number) {
  const n = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `৳${(n / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `৳${(n / 1_000).toFixed(0)}k`;
  }
  return `৳${n.toFixed(0)}`;
}
