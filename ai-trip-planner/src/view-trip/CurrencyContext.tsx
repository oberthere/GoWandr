import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getUsdRates } from '@/service/Currency';
import { money } from './format';

type Display = 'native' | 'usd';

interface CurrencyValue {
  /** The trip's native currency code, e.g. "IDR". */
  native: string;
  display: Display;
  /** True once a USD rate is known and the native currency isn't already USD. */
  canConvert: boolean;
  setDisplay: (d: Display) => void;
  /** Formats a native-currency amount in whichever display mode is active. */
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyValue | null>(null);

export function CurrencyProvider({ native, children }: { native?: string; children: ReactNode }) {
  const code = (native || 'USD').toUpperCase();
  // Default to USD (familiar baseline); user can flip to the trip's native currency.
  const [display, setDisplay] = useState<Display>('usd');
  // Units of `code` per 1 USD (1 when the trip is already in USD).
  const [rate, setRate] = useState<number | null>(code === 'USD' ? 1 : null);

  useEffect(() => {
    if (code === 'USD') {
      setRate(1);
      return;
    }
    let active = true;
    getUsdRates().then((rates) => {
      if (active) setRate(rates[code] ?? null);
    });
    return () => {
      active = false;
    };
  }, [code]);

  const value = useMemo<CurrencyValue>(() => {
    const canConvert = code !== 'USD' && rate != null;
    return {
      native: code,
      display,
      canConvert,
      setDisplay,
      format: (amount: number) =>
        display === 'usd' && rate ? money('USD', amount / rate) : money(code, amount),
    };
  }, [code, display, rate]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs with its provider
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
