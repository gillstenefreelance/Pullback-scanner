import React, { useState, useEffect } from 'react';
import { Signal, TrendDirection } from '../types';
import { ShieldCheck, Target, TrendingUp, AlertTriangle, Calculator, CheckCircle2, Gavel } from 'lucide-react';

interface Props {
  signal: Signal;
}

const SignalInspector: React.FC<Props> = ({ signal }) => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [positionSize, setPositionSize] = useState<string>('0');

  useEffect(() => {
    if (signal.setup) {
      const riskAmount = balance * (riskPercent / 100);
      const distance = Math.abs(signal.setup.entry - signal.setup.stopLoss);
      
      let units = 0;
      if (distance > 0) {
        units = riskAmount / distance;
      }
      
      // Rough formatting based on asset class
      if (signal.instrument.type === 'Forex') {
        setPositionSize(`${(units / 100000).toFixed(2)} Lots`);
      } else if (signal.instrument.type === 'Crypto') {
        setPositionSize(`${units.toFixed(4)} Units`);
      } else {
        setPositionSize(`${Math.floor(units)} Shares`);
      }
    }
  }, [balance, riskPercent, signal]);

  if (!signal.isValid || !signal.setup) {
    return (
      <div className="bg-surface rounded-lg p-6 border border-gray-700 h-full flex flex-col items-center justify-center text-center opacity-70">
        <AlertTriangle className="w-12 h-12 text-warning mb-4" />
        <h3 className="text-xl font-bold text-gray-200">No Valid Trade Setup</h3>
        <p className="text-gray-400 mt-2">
          {signal.reasoning[0] || "Market conditions do not meet pullback strategy requirements."}
        </p>
        <div className="mt-4 text-sm text-gray-500">
            Trend Strength: {signal.trendStrength}/10 <br/>
            Wait for a clear trend and pullback.
        </div>
      </div>
    );
  }

  const isBuy = signal.setup.direction === 'BUY';

  return (
    <div className="bg-surface rounded-lg border border-gray-700 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {signal.instrument.name}
            <span className={`px-2 py-0.5 text-xs rounded font-bold ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {signal.setup.direction}
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs font-mono text-gray-400">ID: {signal.id.slice(-8)}</span>
             <span className="text-[10px] uppercase bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                {signal.setup.executionType}
             </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-primary">{signal.confidence}/10</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">Confidence</div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto custom-scrollbar space-y-6">
        
        {/* Setup Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background p-3 rounded border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
                <Gavel className="w-3 h-3 text-gray-600" />
            </div>
            <div className="text-gray-400 text-xs uppercase mb-1">Entry Price</div>
            <div className="flex items-end gap-2">
                <div className="text-lg font-mono font-bold text-white leading-none">
                    {signal.setup.entry.toFixed(signal.instrument.type === 'Forex' ? 5 : 2)}
                </div>
                <div className="text-[10px] text-primary font-bold mb-0.5 whitespace-nowrap">
                    {signal.setup.executionType.replace(' Execution', '')}
                </div>
            </div>
          </div>
          <div className="bg-background p-3 rounded border border-gray-700">
            <div className="text-gray-400 text-xs uppercase mb-1">Risk/Reward</div>
            <div className="text-lg font-mono font-bold text-warning leading-none">1:{signal.setup.rrRatio}</div>
          </div>
          <div className="bg-background p-3 rounded border border-gray-700 border-l-4 border-l-red-500">
            <div className="text-gray-400 text-xs uppercase mb-1">Stop Loss</div>
            <div className="text-lg font-mono font-bold text-gray-200 leading-none">{signal.setup.stopLoss.toFixed(signal.instrument.type === 'Forex' ? 5 : 2)}</div>
          </div>
          <div className="bg-background p-3 rounded border border-gray-700 border-l-4 border-l-green-500">
            <div className="text-gray-400 text-xs uppercase mb-1">Take Profit 1</div>
            <div className="text-lg font-mono font-bold text-gray-200 leading-none">{signal.setup.tp1.toFixed(signal.instrument.type === 'Forex' ? 5 : 2)}</div>
          </div>
        </div>

        {/* AI Analysis */}
        <div>
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Strategy Analysis
          </h3>
          <ul className="space-y-2">
            {signal.reasoning.map((reason, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-400 items-start">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
             <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Trend Strength</span>
                    <span className="text-white font-bold">{signal.trendStrength}/10</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${signal.trendStrength * 10}%` }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Pullback Quality</span>
                    <span className="text-white font-bold">{signal.pullbackQuality}/10</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${signal.pullbackQuality * 10}%` }}></div>
                </div>
             </div>
        </div>

        {/* Risk Calculator */}
        <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
             <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" /> Position Sizing
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Account Balance</label>
                    <input 
                        type="number" 
                        value={balance} 
                        onChange={(e) => setBalance(Number(e.target.value))}
                        className="w-full bg-background border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Risk %</label>
                    <input 
                        type="number" 
                        value={riskPercent} 
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="w-full bg-background border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center bg-background p-2 rounded">
                <span className="text-xs text-gray-400">Recommended Size:</span>
                <span className="font-mono font-bold text-primary">{positionSize}</span>
            </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-xs text-red-200/80">
            <strong>Disclaimer:</strong> This is an AI-generated analysis for educational purposes. 
            Do not trade blindly. Always manage your risk.
        </div>
      </div>
    </div>
  );
};

export default SignalInspector;