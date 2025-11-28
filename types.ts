export enum AssetClass {
  FOREX = 'Forex',
  CRYPTO = 'Crypto',
  STOCK = 'Stock'
}

export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  NEUTRAL = 'NEUTRAL'
}

export enum PullbackType {
  FIB_38 = '38.2% Fib Retracement',
  FIB_50 = '50% Fib Retracement',
  FIB_61 = '61.8% Fib Retracement',
  EMA_20 = '20 EMA Dynamic Support',
  EMA_50 = '50 EMA Dynamic Support',
  STRUCTURE = 'Structure Retest',
  NONE = 'None'
}

export enum ExecutionType {
  MARKET = 'Market Execution',
  BUY_LIMIT = 'Buy Limit',
  SELL_LIMIT = 'Sell Limit',
  BUY_STOP = 'Buy Stop',
  SELL_STOP = 'Sell Stop'
}

export interface Instrument {
  symbol: string;
  name: string;
  type: AssetClass;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ema20?: number;
  ema50?: number;
}

export interface TradeSetup {
  direction: 'BUY' | 'SELL';
  executionType: ExecutionType;
  entry: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  rrRatio: number;
}

export interface Signal {
  id: string;
  instrument: Instrument;
  timestamp: string;
  trendDirection: TrendDirection;
  trendStrength: number; // 1-10
  pullbackType: PullbackType;
  pullbackQuality: number; // 1-10
  setup: TradeSetup | null;
  confidence: number; // 1-10
  reasoning: string[]; // Bullet points
  isValid: boolean;
  candles: Candle[]; // For visualization
}

export interface UserSettings {
  accountBalance: number;
  riskPercentage: number;
}