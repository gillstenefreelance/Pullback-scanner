import React, { useState, useEffect } from 'react';
import { ALL_INSTRUMENTS } from './constants';
import { scanMarket } from './services/marketService';
import { Signal, AssetClass } from './types';
import Chart from './components/Chart.tsx';
import SignalInspector from './components/SignalInspector.tsx';
import Scanner from './components/Scanner.tsx';
import { LayoutDashboard, Settings, Bell, Search, PlayCircle } from 'lucide-react';

function App() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  const runScan = () => {
    setIsScanning(true);
    // Simulate API latency
    setTimeout(() => {
      const results = scanMarket(ALL_INSTRUMENTS);
      setSignals(results);
      // Auto-select the best signal
      const best = results.find(s => s.isValid);
      if (best) setSelectedSignal(best);
      setIsScanning(false);
    }, 800);
  };

  useEffect(() => {
    runScan();
  }, []);

  const filteredSignals = filterType === 'ALL' 
    ? signals 
    : signals.filter(s => s.instrument.type === filterType);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col overflow-hidden">
      
      {/* Top Navigation */}
      <header className="h-16 border-b border-gray-700 bg-slate-800/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">Pullback<span className="text-blue-500">Pro</span></h1>
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={runScan}
                disabled={isScanning}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isScanning ? (
                    <span className="animate-pulse">Scanning Markets...</span>
                ) : (
                    <>
                        <PlayCircle className="w-4 h-4" /> Run AI Scan
                    </>
                )}
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-4 text-gray-400">
                <Search className="w-5 h-5 hover:text-white cursor-pointer" />
                <Bell className="w-5 h-5 hover:text-white cursor-pointer" />
                <Settings className="w-5 h-5 hover:text-white cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-gray-600">
                    JD
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-64 bg-slate-800 border-r border-gray-700 hidden lg:flex flex-col shrink-0">
            <div className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Market Segments</h3>
                <nav className="space-y-1">
                    {['ALL', AssetClass.FOREX, AssetClass.CRYPTO, AssetClass.STOCK].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${filterType === type ? 'bg-blue-500/10 text-blue-500' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}
                        >
                            {type === 'ALL' ? 'All Markets' : type}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-gray-700">
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="text-blue-400 text-sm font-bold mb-1">Pro Strategy Tip</h4>
                    <p className="text-xs text-blue-200/70">
                        Always wait for a candle close above/below the EMA before entering. Patience pays.
                    </p>
                </div>
            </div>
        </aside>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <div className="p-6 h-full flex flex-col gap-6">
                
                {/* Top Section: Chart */}
                <div className="flex-1 min-h-[400px]">
                   {selectedSignal ? (
                       <Chart signal={selectedSignal} />
                   ) : (
                       <div className="w-full h-full bg-slate-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">
                           Select a signal to view chart analysis
                       </div>
                   )}
                </div>

                {/* Bottom Section: Details Grid */}
                {selectedSignal && (
                    <div className="h-[350px]">
                         <SignalInspector signal={selectedSignal} />
                    </div>
                )}
            </div>
        </div>

        {/* Right Sidebar (Scanner Feed) */}
        <aside className="w-80 shrink-0 border-l border-gray-700 bg-slate-800 shadow-2xl z-10">
            <Scanner 
                signals={filteredSignals} 
                onSelect={setSelectedSignal} 
                selectedId={selectedSignal?.id || null} 
            />
        </aside>

      </main>

    </div>
  );
}

export default App;