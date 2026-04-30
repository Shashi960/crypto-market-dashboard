import { ArrowRightLeft, Calculator, Receipt, TrendingUp, ChevronDown, Search, ChevronRight, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getCurrencySymbol } from "../utils/formatters";
import { AnimatePresence, motion } from "framer-motion";

function CustomSelect({ coins, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedCoin = coins.find(c => c.id === value) || coins[0];
  const filteredCoins = coins.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.symbol || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div 
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedCoin?.image && <img src={selectedCoin.image} alt={selectedCoin.name} className="w-5 h-5 rounded-full flex-shrink-0" />}
          <span className="font-medium truncate">{selectedCoin ? selectedCoin.name : "Select coin"}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[240px] mt-1 bg-white dark:bg-[#1A1E29] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50 dark:bg-[#131722]">
            <Search className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search coins..." 
              className="w-full bg-transparent outline-none text-sm dark:text-gray-200"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto overscroll-contain">
            {filteredCoins.length > 0 ? filteredCoins.map(c => (
              <div 
                key={c.id} 
                className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2A2E39] cursor-pointer flex items-center gap-3 transition-colors"
                onClick={() => {
                  onChange(c.id);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full flex-shrink-0" />
                <span className="font-medium dark:text-gray-200 truncate">{c.name}</span>
                <span className="text-gray-400 text-xs ml-auto uppercase font-medium">{c.symbol}</span>
              </div>
            )) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No coins found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolsView({ coins, currency }) {
  const [activeTool, setActiveTool] = useState(null); // 'il', 'roi', 'tax'

  // Converter State
  const [amount, setAmount] = useState(1);
  const [fromCoinId, setFromCoinId] = useState(coins[0]?.id || "");
  const [toCoinId, setToCoinId] = useState(coins[1]?.id || "");

  // IL State
  const [ilTokenAInitial, setIlTokenAInitial] = useState(100);
  const [ilTokenBInitial, setIlTokenBInitial] = useState(1);
  const [ilTokenAFinal, setIlTokenAFinal] = useState(120);
  const [ilTokenBFinal, setIlTokenBFinal] = useState(1);

  // ROI State
  const [roiInitial, setRoiInitial] = useState(1000);
  const [roiBuyPrice, setRoiBuyPrice] = useState(50000);
  const [roiSellPrice, setRoiSellPrice] = useState(65000);

  // Tax State
  const [taxCountry, setTaxCountry] = useState("US");
  const [taxBuyAmount, setTaxBuyAmount] = useState(1000);
  const [taxSellAmount, setTaxSellAmount] = useState(1500);
  const [taxRate, setTaxRate] = useState(20);

  // Converter Logic
  const fromCoin = coins.find((c) => c.id === fromCoinId) || coins[0];
  const toCoin = coins.find((c) => c.id === toCoinId) || coins[1];
  const convertedAmount = fromCoin && toCoin && amount
    ? (amount * fromCoin.current_price) / toCoin.current_price
    : 0;

  // IL Logic
  const calculateIL = () => {
    if (!ilTokenAInitial || !ilTokenBInitial || !ilTokenAFinal || !ilTokenBFinal) return { ilPct: "0.00", hodl: "0.00", lp: "0.00" };
    const ratioInitial = ilTokenAInitial / ilTokenBInitial;
    const ratioFinal = ilTokenAFinal / ilTokenBFinal;
    if (ratioInitial <= 0 || ratioFinal <= 0) return { ilPct: "0.00", hodl: "0.00", lp: "0.00" };
    
    const priceRatio = ratioFinal / ratioInitial;
    if (priceRatio <= 0) return { ilPct: "0.00", hodl: "0.00", lp: "0.00" };
    
    const il = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
    
    // Assume $1000 initial investment ($500 each)
    const initialInvestment = 1000;
    const half = initialInvestment / 2;
    const qtyA = half / ilTokenAInitial;
    const qtyB = half / ilTokenBInitial;
    
    const hodlValue = qtyA * ilTokenAFinal + qtyB * ilTokenBFinal;
    const lpValue = hodlValue * (1 + il);

    return {
      ilPct: (il * 100).toFixed(2), // Negative value
      hodl: hodlValue.toFixed(2),
      lp: lpValue.toFixed(2)
    };
  };

  // ROI Logic
  const calculateROI = () => {
    if (!roiBuyPrice || !roiSellPrice) return { pct: "0.00", val: roiInitial, rawPct: 0 };
    const returnPct = ((roiSellPrice - roiBuyPrice) / roiBuyPrice) * 100;
    const finalValue = roiInitial * (1 + returnPct / 100);
    
    let displayPct = returnPct.toFixed(2);
    if (Math.abs(returnPct) > 0 && Math.abs(returnPct) < 0.01) {
      displayPct = returnPct > 0 ? "< 0.01" : "> -0.01";
    }

    return { pct: displayPct, val: finalValue.toFixed(2), rawPct: returnPct };
  };

  // Tax Logic
  const calculateTax = () => {
    const buy = Number(taxBuyAmount) || 0;
    const sell = Number(taxSellAmount) || 0;
    const profit = sell - buy;
    
    if (taxCountry === "IN") {
      const tds = sell * 0.01;
      const capitalGainsTax = profit > 0 ? profit * 0.30 : 0;
      const totalTax = tds + capitalGainsTax;
      return {
        profit: profit.toFixed(2),
        netProfit: (profit - totalTax).toFixed(2),
        tax: totalTax.toFixed(2),
        breakdown: `30% Tax: $${capitalGainsTax.toFixed(2)} + 1% TDS: $${tds.toFixed(2)}`
      };
    } else {
      const rate = Number(taxRate) || 0;
      const tax = profit > 0 ? profit * (rate / 100) : 0;
      return {
        profit: profit.toFixed(2),
        netProfit: (profit - tax).toFixed(2),
        tax: tax.toFixed(2),
        breakdown: `${rate}% Tax: $${tax.toFixed(2)}`
      };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Crypto Tools</h2>
        <p className="text-gray-500 dark:text-gray-400">Essential utilities for your crypto journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Converter Tool */}
        <div className="bg-white dark:bg-[#131722] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Coin Converter</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="w-full md:w-[45%]">
                <CustomSelect 
                  coins={coins} 
                  value={fromCoinId} 
                  onChange={setFromCoinId} 
                  label="From" 
                />
              </div>
              <div className="pt-0 md:pt-6 rotate-90 md:rotate-0 flex-shrink-0">
                <ArrowRightLeft className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-full md:w-[45%]">
                <CustomSelect 
                  coins={coins} 
                  value={toCoinId} 
                  onChange={setToCoinId} 
                  label="To" 
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Converted Value</p>
              <p className="text-2xl font-bold truncate">
                {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCoin?.symbol?.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                1 {fromCoin?.symbol?.toUpperCase()} = {(fromCoin?.current_price / toCoin?.current_price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCoin?.symbol?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Other Tools Accordion */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* Impermanent Loss Calculator */}
          <motion.div layout className={`bg-white dark:bg-[#131722] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all overflow-hidden ${activeTool === 'il' ? 'ring-1 ring-purple-500' : 'hover:border-purple-500/50'}`}>
            <motion.div layout="position"
              className="p-6 flex items-start gap-4 cursor-pointer"
              onClick={() => setActiveTool(activeTool === 'il' ? null : 'il')}
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-1 flex items-center justify-between">
                  Impermanent Loss Calculator
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeTool === 'il' ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimate potential losses when providing liquidity to AMMs.</p>
              </div>
            </motion.div>
            
            <AnimatePresence initial={false}>
              {activeTool === 'il' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Initial Price Token A</label>
                        <input type="number" value={ilTokenAInitial} onChange={e => setIlTokenAInitial(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Initial Price Token B</label>
                        <input type="number" value={ilTokenBInitial} onChange={e => setIlTokenBInitial(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Final Price Token A</label>
                        <input type="number" value={ilTokenAFinal} onChange={e => setIlTokenAFinal(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Final Price Token B</label>
                        <input type="number" value={ilTokenBFinal} onChange={e => setIlTokenBFinal(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500" />
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-purple-200/50 dark:border-purple-800/50">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Impermanent Loss</p>
                            <div className="group relative">
                              <Info className="w-4 h-4 text-purple-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                <p className="font-semibold mb-2 border-b border-gray-700 pb-1">How calculated?</p>
                                <p className="font-mono text-[10px] text-gray-300">r = (Final Price Ratio) / (Initial Price Ratio)</p>
                                <p className="font-mono text-[11px] mt-1.5 text-purple-300">IL = (2 * √r) / (1 + r) - 1</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-red-500">{calculateIL().ilPct}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">HODL Value ($1k Start)</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">${calculateIL().hodl}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">LP Value</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">${calculateIL().lp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Crypto ROI Calculator */}
          <motion.div layout className={`bg-white dark:bg-[#131722] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all overflow-hidden ${activeTool === 'roi' ? 'ring-1 ring-green-500' : 'hover:border-green-500/50'}`}>
            <motion.div layout="position"
              className="p-6 flex items-start gap-4 cursor-pointer"
              onClick={() => setActiveTool(activeTool === 'roi' ? null : 'roi')}
            >
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-1 flex items-center justify-between">
                  Crypto ROI Calculator
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeTool === 'roi' ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Calculate your return on investment for historical crypto purchases.</p>
              </div>
            </motion.div>

            <AnimatePresence initial={false}>
              {activeTool === 'roi' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Initial Investment ($)</label>
                        <input type="number" value={roiInitial} onChange={e => setRoiInitial(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-green-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Buy Price ($)</label>
                          <input type="number" value={roiBuyPrice} onChange={e => setRoiBuyPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-green-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Sell Price ($)</label>
                          <input type="number" value={roiSellPrice} onChange={e => setRoiSellPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-900/30 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Return (%)</p>
                          <div className="group relative">
                            <Info className="w-4 h-4 text-green-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                              <p className="font-semibold mb-2 border-b border-gray-700 pb-1">How calculated?</p>
                              <p className="font-mono text-[11px] text-green-300">ROI = (Sell - Buy) / Buy * 100</p>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <p className={`text-xl font-bold ${calculateROI().rawPct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{calculateROI().pct}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Final Value</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${calculateROI().val}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tax Estimator */}
          <motion.div layout className={`bg-white dark:bg-[#131722] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all overflow-hidden ${activeTool === 'tax' ? 'ring-1 ring-red-500' : 'hover:border-red-500/50'}`}>
            <motion.div layout="position"
              className="p-6 flex items-start gap-4 cursor-pointer"
              onClick={() => setActiveTool(activeTool === 'tax' ? null : 'tax')}
            >
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-1 flex items-center justify-between">
                  Tax Estimator
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeTool === 'tax' ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get a quick estimate of your capital gains tax liability.</p>
              </div>
            </motion.div>

            <AnimatePresence initial={false}>
              {activeTool === 'tax' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Purchase Amount ($)</label>
                          <input type="number" value={taxBuyAmount} onChange={e => setTaxBuyAmount(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Sale Amount ($)</label>
                          <input type="number" value={taxSellAmount} onChange={e => setTaxSellAmount(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Country Rules</label>
                          <select value={taxCountry} onChange={e => setTaxCountry(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-500">
                            <option value="US">US / Custom</option>
                            <option value="IN">India (30% + TDS)</option>
                          </select>
                        </div>
                        {taxCountry !== "IN" && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Tax Rate (%)</label>
                            <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-red-200/50 dark:border-red-800/50">
                        <div>
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Gross Profit</p>
                          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">${calculateTax().profit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Estimated Tax</p>
                          <p className="text-xl font-bold text-red-600 dark:text-red-400">-${calculateTax().tax}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-green-600 dark:text-green-400 font-bold">Net Profit</p>
                          <div className="group relative">
                            <Info className="w-4 h-4 text-green-500 cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                              <p className="font-semibold mb-2 border-b border-gray-700 pb-1">How calculated?</p>
                              <p className="font-mono text-[11px] text-green-300">Net = Gross Profit - Tax</p>
                              <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-green-500">${calculateTax().netProfit}</p>
                      </div>
                      <p className="text-xs text-red-500/70 text-right mt-3">{calculateTax().breakdown}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
