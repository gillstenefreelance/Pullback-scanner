import React from 'react';
import { Signal, ExecutionType } from '../types';
import { ChevronRight, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

interface Props {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
  selectedId: string | null;
}

const Scanner: React.FC<Props> = ({ signals, onSelect, selectedId }) => {
  return (
    <div className="h-full bg-surface border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-gray-200 flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-primary" /> Live Scanner
        </h2>
        <span className="text-xs text-gray-500 bg-background px-2 py-1 rounded-full">
            {signals.filter(s => s.isValid).length} Opportunities
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {signals.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Running market analysis...
          </div>
        ) : (
          signals.map(signal => {
            if (!signal.isValid) return null;
            const isSelected = selectedId === signal.id;
            const isBuy = signal.setup?.direction === 'BUY';
            const executionLabel = signal.setup?.executionType === ExecutionType.MARKET 
                ? 'Market' 
                : signal.setup?.executionType.includes('Limit') ? 'Limit' : 'Stop';

            return (
              <div 
                key={signal.id}
                onClick={() => onSelect(signal)}
                className={`p-4 border-b border-gray-700/50 cursor-pointer transition-all hover:bg-gray-700/30 ${isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-gray-200 text-sm">{signal.instrument.symbol}</div>
                    <div className="text-[10px] text-gray-500">{signal.instrument.type} • 1H</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center justify-end gap-1 ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isBuy ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                        {signal.setup?.direction}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{executionLabel}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-400">
                        Score: <span className={signal.confidence >= 8 ? "text-success font-bold" : "text-gray-300"}>{signal.confidence}/10</span>
                    </div>
                    <div className="text-gray-500">
                        R:R {signal.setup?.rrRatio}
                    </div>
                </div>
                
                <div className="mt-2 text-[10px] text-gray-500 line-clamp-1">
                    {signal.pullbackType}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Scanner;