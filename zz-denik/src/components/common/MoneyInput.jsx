import React from 'react';
import { Coins } from 'lucide-react';

const MoneyInput = ({ money, onChange }) => {
    const handleUpdate = (currency, val) => {
        onChange({ ...money, [currency]: Math.max(0, val || 0) });
    };

    return (
        <div className="flex flex-col justify-center gap-2 bg-fl-paper-bright p-3 rounded border border-fl-border w-full">
            <div className="flex justify-between items-center border-b border-fl-border pb-2">
                <span className="text-xs font-bold uppercase text-fl-primary">Měšec</span>
                <Coins size={16} className="text-fl-border" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
                {['gold', 'silver', 'copper'].map(c => (
                    <div key={c} className="flex flex-col items-center">
                        <div className="flex items-center justify-between w-full bg-fl-paper-light rounded-sm border border-fl-paper overflow-hidden focus-within:border-fl-primary">
                            <button
                                onClick={() => handleUpdate(c, (money[c] || 0) - 1)}
                                className="w-6 h-6 flex items-center justify-center text-fl-primary hover:text-white hover:bg-fl-primary font-bold transition-colors"
                            >-</button>
                            <input
                                type="number"
                                min="0"
                                value={money[c] || 0}
                                onChange={e => handleUpdate(c, parseInt(e.target.value) || 0)}
                                className="flex-1 w-full text-center font-bold bg-transparent focus:outline-none text-fl-surface text-sm py-1 appearance-none m-0"
                            />
                            <button
                                onClick={() => handleUpdate(c, (money[c] || 0) + 1)}
                                className="w-6 h-6 flex items-center justify-center text-fl-primary hover:text-white hover:bg-fl-primary font-bold transition-colors"
                            >+</button>
                        </div>
                        <span className={`text-[9px] uppercase font-bold mt-1 ${c === 'gold' ? 'text-[#FFD700]' : c === 'silver' ? 'text-gray-400' : 'text-[#9E6649]'}`}>
                            {c === 'gold' ? 'ZL (Zlaté)' : c === 'silver' ? 'ST (Stříbrné)' : 'MĚ (Měděné)'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoneyInput;
