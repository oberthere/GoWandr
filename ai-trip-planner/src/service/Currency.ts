// Free, no-key exchange rates (base USD). Cached in-memory and in localStorage
// for 12h so the view-trip page converts costs without a request on every visit.
const ENDPOINT = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'fx-usd-rates';
const TTL_MS = 12 * 60 * 60 * 1000;

/** Units of each currency per 1 USD, e.g. { USD: 1, IDR: 16250, EUR: 0.92 }. */
type Rates = Record<string, number>;

let memo: Rates | null = null;
let inflight: Promise<Rates> | null = null;

function readCache(): Rates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, rates } = JSON.parse(raw) as { ts: number; rates: Rates };
    return Date.now() - ts > TTL_MS ? null : rates;
  } catch {
    return null;
  }
}

export async function getUsdRates(): Promise<Rates> {
  if (memo) return memo;
  const cached = readCache();
  if (cached) {
    memo = cached;
    return cached;
  }
  if (inflight) return inflight;

  inflight = fetch(ENDPOINT)
    .then((r) => r.json())
    .then((j) => {
      const rates: Rates = j?.rates ?? {};
      memo = rates;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates }));
      } catch {
        /* localStorage unavailable in-memory cache still applies */
      }
      return rates;
    })
    .catch(() => ({}) as Rates)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
