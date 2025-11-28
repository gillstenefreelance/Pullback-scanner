import { Instrument, Signal, Candle, TrendDirection, PullbackType, AssetClass, ExecutionType } from '../types';

// Helper to generate random realistic candles
const generateCandles = (basePrice: number, count: number, trend: TrendDirection): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const volatility = basePrice * 0.005;

  for (let i = 0; i < count; i++) {
    const time = new Date(Date.now() - (count - i) * 60 * 60 * 1000).toISOString(); // Hourly
    
    let change = (Math.random() - 0.5) * volatility;
    // Bias the change based on trend
    if (trend === TrendDirection.UP) change += volatility * 0.2;
    if (trend === TrendDirection.DOWN) change -= volatility * 0.2;

    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    currentPrice = close;

    candles.push({ time, open, high, low, close });
  }

  // Calculate EMAs (simplified)
  let ema20 = candles[0].close;
  let ema50 = candles[0].close;
  const k20 = 2 / (20 + 1);
  const k50 = 2 / (50 + 1);

  return candles.map((c, i) => {
    ema20 = c.close * k20 + ema20 * (1 - k20);
    ema50 = c.close * k50 + ema50 * (1 - k50);
    return { ...c, ema20: i > 20 ? ema20 : undefined, ema50: i > 50 ? ema50 : undefined };
  });
};

// The "AI" Scanner Logic
export const analyzeInstrument = (instrument: Instrument): Signal => {
  const isCrypto = instrument.type === AssetClass.CRYPTO;
  const isForex = instrument.type === AssetClass.FOREX;
  
  // Randomly determine the market state for simulation purposes
  // In a real app, this would come from analyzing the 'candles' array real data
  const trendSeed = Math.random();
  let trend = TrendDirection.NEUTRAL;
  if (trendSeed > 0.6) trend = TrendDirection.UP;
  else if (trendSeed < 0.4) trend = TrendDirection.DOWN;

  const basePrice = isCrypto ? 45000 : isForex ? 1.0800 : 150;
  const candles = generateCandles(basePrice, 100, trend);
  const currentPrice = candles[candles.length - 1].close;
  
  const trendStrength = trend === TrendDirection.NEUTRAL ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 4) + 6; // 6-10 for trend
  
  // Pullback detection logic (Simulated)
  let pullbackType = PullbackType.NONE;
  let pullbackQuality = 0;
  
  if (trend !== TrendDirection.NEUTRAL) {
    const pbSeed = Math.random();
    if (pbSeed > 0.3) {
      pullbackType = pbSeed > 0.7 ? PullbackType.EMA_20 : PullbackType.FIB_50;
      pullbackQuality = Math.floor(Math.random() * 3) + 7; // 7-10 quality
    }
  }

  const isValid = trend !== TrendDirection.NEUTRAL && pullbackType !== PullbackType.NONE && trendStrength > 6;
  
  let setup = null;
  const reasoning: string[] = [];

  if (isValid) {
    const atr = currentPrice * 0.01; // Simulated ATR
    
    // Construct Reasoning
    reasoning.push(`Higher Timeframe (4H) is in a clear ${trend} trend.`);
    reasoning.push(`Trend Strength Score: ${trendStrength}/10. Higher ${trend === TrendDirection.UP ? 'highs' : 'lows'} observed.`);
    reasoning.push(`Price has pulled back to ${pullbackType}, offering a value entry.`);
    
    // Determine Order Type Simulation
    // Randomize whether the setup is "Waiting for level" (Limit) or "Confirmation" (Stop/Market)
    const orderTypeSeed = Math.random();
    let entryPrice = currentPrice;
    let executionType = ExecutionType.MARKET;

    if (trend === TrendDirection.UP) {
      if (orderTypeSeed > 0.6) {
        // Pending Limit Order (Waiting for price to drop slightly more to the perfect level)
        entryPrice = currentPrice * 0.998; 
        executionType = ExecutionType.BUY_LIMIT;
        reasoning.push("Pending Buy Limit placed at precise support level.");
      } else if (orderTypeSeed < 0.2) {
         // Stop Order (Waiting for break of local high)
         entryPrice = currentPrice * 1.002;
         executionType = ExecutionType.BUY_STOP;
         reasoning.push("Buy Stop set above recent consolidation high for confirmation.");
      } else {
        // Market Execution
        executionType = ExecutionType.MARKET;
        reasoning.push("Bullish candlestick rejection detected. Instant execution valid.");
      }

      const sl = entryPrice - (atr * 1.5);
      const tp1 = entryPrice + (atr * 2);
      const tp2 = entryPrice + (atr * 3.5);
      const tp3 = entryPrice + (atr * 5);
      
      setup = {
        direction: 'BUY',
        executionType,
        entry: entryPrice,
        stopLoss: sl,
        tp1, tp2, tp3,
        rrRatio: parseFloat(((tp2 - entryPrice) / (entryPrice - sl)).toFixed(2))
      };
    } else {
      if (orderTypeSeed > 0.6) {
        // Pending Sell Limit (Waiting for price to rise slightly)
        entryPrice = currentPrice * 1.002;
        executionType = ExecutionType.SELL_LIMIT;
        reasoning.push("Pending Sell Limit placed at resistance test.");
      } else if (orderTypeSeed < 0.2) {
         // Sell Stop (Waiting for break of local low)
         entryPrice = currentPrice * 0.998;
         executionType = ExecutionType.SELL_STOP;
         reasoning.push("Sell Stop set below recent consolidation low.");
      } else {
        // Market Execution
        executionType = ExecutionType.MARKET;
        reasoning.push("Bearish momentum shift confirmed. Instant execution valid.");
      }

      const sl = entryPrice + (atr * 1.5);
      const tp1 = entryPrice - (atr * 2);
      const tp2 = entryPrice - (atr * 3.5);
      const tp3 = entryPrice - (atr * 5);
      
      setup = {
        direction: 'SELL',
        executionType,
        entry: entryPrice,
        stopLoss: sl,
        tp1, tp2, tp3,
        rrRatio: parseFloat(((entryPrice - tp2) / (sl - entryPrice)).toFixed(2))
      };
    }
  } else {
    if (trend === TrendDirection.NEUTRAL) reasoning.push("Market is ranging/choppy. No valid trend identified.");
    else reasoning.push("Trend exists, but no valid pullback to value area detected yet.");
  }

  const confidence = isValid ? Math.floor((trendStrength + pullbackQuality) / 2) : 0;

  return {
    id: `${instrument.symbol}-${Date.now()}`,
    instrument,
    timestamp: new Date().toISOString(),
    trendDirection: trend,
    trendStrength,
    pullbackType,
    pullbackQuality,
    setup: setup as any,
    confidence,
    reasoning,
    isValid,
    candles
  };
};

export const scanMarket = (instruments: Instrument[]): Signal[] => {
  return instruments.map(analyzeInstrument).sort((a, b) => b.confidence - a.confidence);
};