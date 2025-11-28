import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area
} from 'recharts';
import { Signal } from '../types';

interface ChartProps {
  signal: Signal;
}

const Chart: React.FC<ChartProps> = ({ signal }) => {
  const data = signal.candles.map(c => ({
    ...c,
    // Format numbers for chart
    close: parseFloat(c.close.toFixed(signal.instrument.type === 'Forex' ? 4 : 2)),
    ema20: c.ema20 ? parseFloat(c.ema20.toFixed(signal.instrument.type === 'Forex' ? 4 : 2)) : null,
  }));

  const minPrice = Math.min(...data.map(d => d.low)) * 0.999;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.001;

  return (
    <div className="w-full h-[400px] bg-slate-800 rounded-lg p-4 border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          {signal.instrument.symbol} <span className="text-xs font-normal text-gray-400">1H Timeframe</span>
        </h3>
        <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Price</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> EMA 20</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            tickFormatter={(t) => new Date(t).getHours() + ':00'} 
            stroke="#94a3b8"
            tick={{fontSize: 12}}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#94a3b8" 
            tick={{fontSize: 12}}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
            itemStyle={{ color: '#e2e8f0' }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          
          {/* Main Price Line */}
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            fill="url(#colorPrice)" 
            fillOpacity={0.1}
            strokeWidth={2}
          />

          {/* Indicators */}
          <Line type="monotone" dataKey="ema20" stroke="#f59e0b" dot={false} strokeWidth={1.5} />

          {/* Trade Setup Lines */}
          {signal.setup && (
            <>
              <ReferenceLine y={signal.setup.entry} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: '#3b82f6', fontSize: 10 }} />
              <ReferenceLine y={signal.setup.stopLoss} stroke="#ef4444" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={signal.setup.tp1} stroke="#10b981" label={{ position: 'right', value: 'TP1', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine y={signal.setup.tp2} stroke="#10b981" strokeDasharray="3 3" />
            </>
          )}

          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;