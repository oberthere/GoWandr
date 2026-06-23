/** Compact number, e.g. 230000 -> "230K". */
export function compact(n: number): string {
  if (n == null || Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/** Currency + compact amount, e.g. "IDR 230K". */
export function money(currency: string, n: number): string {
  return `${currency ?? ''} ${compact(n)}`.trim();
}
