import React, { useState, useEffect } from 'react';
import { Skull, Activity, AlertTriangle, HeartPulse, X, Sword, Hammer, Ghost, ShieldAlert } from 'lucide-react';
import { CRIT_TABLES } from './data/crit_tables';

const CriticalInjuryModal = ({ onClose }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [result, setResult] = useState(null);

    const handleRoll = () => {
        if (!selectedType) return;
        setIsRolling(true);
        setLoadingText("");
        setResult(null);

        const text = "Obdržel si zranění...";
        let i = 0;

        // Typing effect
        const typeInterval = setInterval(() => {
            setLoadingText(text.substring(0, i + 1));
            i++;
            if (i > text.length) clearInterval(typeInterval);
        }, 100);

        setTimeout(() => {
            // Roll d66 (11-66)
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const roll = d1 * 10 + d2;

            const table = CRIT_TABLES[selectedType];
            // Find the range that includes the roll
            // Ranges are like { min: 11, max: 12, ... }
            const injury = table.ranges.find(r => roll >= r.min && roll <= r.max);

            setResult({ roll, ...injury });
            setIsRolling(false);
        }, 5000); // 5 seconds delay
    };

    const types = [
        { id: 'slash', label: 'Řezná', icon: Sword, color: 'text-red-600', border: 'border-red-600' },
        { id: 'blunt', label: 'Tupá', icon: Hammer, color: 'text-stone-600', border: 'border-stone-600' },
        { id: 'stab', label: 'Bodná', icon: ShieldAlert, color: 'text-orange-600', border: 'border-orange-600' },
        { id: 'horror', label: 'Hrůza', icon: Ghost, color: 'text-purple-600', border: 'border-purple-600' },
    ];

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-fl-card w-full max-w-lg rounded shadow-2xl border-4 border-fl-primary p-6 relative min-h-[400px] flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-fl-primary hover:text-red-600"><X size={24} /></button>

                <h3 className="font-serif text-2xl font-bold uppercase text-center mb-6 text-fl-surface border-b-2 border-fl-primary pb-2 flex items-center justify-center gap-2">
                    <Skull className="text-red-800 dark:text-red-400" /> Kritické Zranění
                </h3>

                {!isRolling && !result && (
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            {types.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedType(t.id)}
                                    className={`p-4 rounded border-2 flex flex-col items-center gap-2 transition-all hover:bg-fl-paper hover:shadow-md
                    ${selectedType === t.id ? `${t.border} bg-fl-paper shadow-lg scale-105` : 'border-fl-border bg-fl-paper-bright opacity-80 hover:opacity-100'}`}
                                >
                                    <t.icon size={32} className={t.color} />
                                    <span className={`font-bold uppercase tracking-wider ${t.color}`}>{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleRoll}
                            disabled={!selectedType}
                            className={`w-full py-4 font-bold uppercase tracking-widest text-lg rounded shadow-lg transition-all
                ${selectedType
                                    ? 'bg-fl-primary text-white hover:bg-fl-primary-hover hover:scale-105'
                                    : 'bg-fl-border text-fl-paper-light cursor-not-allowed'}`}
                        >
                            Hodit na tabulku
                        </button>
                    </div>
                )}

                {isRolling && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <Activity size={64} className="text-red-800 dark:text-red-400 animate-pulse mb-6" />
                        <h2 className="font-serif text-3xl font-bold text-fl-surface mb-2 min-h-[2.5rem]">
                            {loadingText}
                        </h2>
                        <p className="text-fl-primary italic animate-pulse">Osud se rozhoduje...</p>
                    </div>
                )}

                {result && (
                    <div className="flex-1 flex flex-col gap-4 animate-in zoom-in-95 duration-300">
                        <div className="text-center border-b border-fl-border pb-4">
                            <span className="text-4xl font-black text-fl-surface block mb-1">{result.roll}</span>
                            <h2 className="font-serif text-2xl font-bold text-red-800 dark:text-red-400 uppercase">{result.effect}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-fl-paper p-3 rounded">
                                <span className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Smrtelnost</span>
                                <span className={`font-bold ${result.lethal === 'Ne' ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.lethal}
                                </span>
                                {result.limit && <span className="text-xs block text-red-600">({result.limit})</span>}
                            </div>
                            <div className="bg-fl-paper p-3 rounded">
                                <span className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Léčení</span>
                                <span className="font-bold text-fl-surface">{result.heal}</span>
                            </div>
                        </div>

                        {result.note && (
                            <div className="bg-fl-paper-bright p-4 rounded border border-fl-border">
                                <span className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Efekt</span>
                                <p className="text-fl-surface-hover font-serif italic">{result.note}</p>
                            </div>
                        )}

                        <button
                            onClick={() => { setResult(null); setSelectedType(null); }}
                            className="mt-auto w-full py-3 bg-fl-nav text-white font-bold uppercase tracking-wider hover:bg-fl-nav-hover rounded transition-colors"
                        >
                            Zavřít
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CriticalInjuryModal;
