import { AssetClass, Instrument } from './types';

export const FOREX_PAIRS: Instrument[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: AssetClass.FOREX },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: AssetClass.FOREX },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: AssetClass.FOREX },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', type: AssetClass.FOREX },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', type: AssetClass.FOREX },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', type: AssetClass.FOREX },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', type: AssetClass.FOREX },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', type: AssetClass.FOREX },
];

export const CRYPTO_PAIRS: Instrument[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', type: AssetClass.CRYPTO },
  { symbol: 'ETH/USDT', name: 'Ethereum', type: AssetClass.CRYPTO },
  { symbol: 'SOL/USDT', name: 'Solana', type: AssetClass.CRYPTO },
  { symbol: 'XRP/USDT', name: 'Ripple', type: AssetClass.CRYPTO },
  { symbol: 'ADA/USDT', name: 'Cardano', type: AssetClass.CRYPTO },
];

export const STOCK_TICKERS: Instrument[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: AssetClass.STOCK },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: AssetClass.STOCK },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: AssetClass.STOCK },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: AssetClass.STOCK },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: AssetClass.STOCK },
];

export const ALL_INSTRUMENTS = [...FOREX_PAIRS, ...CRYPTO_PAIRS, ...STOCK_TICKERS];