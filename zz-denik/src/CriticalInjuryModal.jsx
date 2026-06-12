import React, { useState } from 'react';
import { Skull, Activity, X, Sword, Hammer, Ghost, ShieldAlert } from 'lucide-react';
import { CRIT_TABLES } from './data/crit_tables';
import useDialog from './hooks/useDialog';
import { hapticTick } from './native/platform';

const CriticalInjuryModal = ({ onClose }) => {
    const panelRef = useDialog(onClose);
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
            hapticTick(40);
        }, 5000); // 5 seconds delay
    };

    const types = [
        { id: 'slash', label: 'Řezná', icon: Sword, color: 'text-red-600', border: 'border-red-600' },
        { id: 'blunt', label: 'Tupá', icon: Hammer, color: 'text-stone-600', border: 'border-stone-600' },
        { id: 'stab', label: 'Bodná', icon: ShieldAlert, color: 'text-orange-600', border: 'border-orange-600' },
        { id: 'horror', label: 'Hrůza', icon: Ghost, color: 'text-purple-600', border: 'border-purple-600' },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ paddingTop: 'calc(var(--safe-top) + 1rem)', paddingBottom: 'calc(var(--safe-bottom) + 1rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Kritické zranění"
                className="relative flex max-h-full min-h-[400px] w-full max-w-lg flex-col overflow-y-auto overscroll-contain rounded-2xl border-2 border-fl-primary bg-fl-card p-6 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Zavřít"
                    className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-paper hover:text-red-600 active:bg-fl-paper"
                >
                    <X size={24} />
                </button>

                <h3 className="font-serif text-2xl font-bold uppercase text-center mb-6 text-fl-surface border-b-2 border-fl-primary pb-2 flex items-center justify-center gap-2">
                    <Skull className="text-red-800 dark:text-red-400" /> Kritické Zranění
                </h3>

                {!isRolling && !result && (
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Typ zranění">
                            {types.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedType(t.id)}
                                    role="radio"
                                    aria-checked={selectedType === t.id}
                                    className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-fl-paper hover:shadow-md active:scale-[0.97]
                    ${selectedType === t.id ? `${t.border} bg-fl-paper shadow-lg` : 'border-fl-border bg-fl-paper-bright opacity-80 hover:opacity-100'}`}
                                >
                                    <t.icon size={32} className={t.color} aria-hidden="true" />
                                    <span className={`font-bold uppercase tracking-wider ${t.color}`}>{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleRoll}
                            disabled={!selectedType}
                            className={`w-full min-h-14 rounded-xl font-bold uppercase tracking-widest text-lg shadow-lg transition-all
                ${selectedType
                                    ? 'bg-fl-primary text-white hover:bg-fl-primary-hover active:scale-[0.98]'
                                    : 'bg-fl-border text-fl-text-muted cursor-not-allowed opacity-60'}`}
                        >
                            {selectedType ? 'Hodit na tabulku' : 'Nejdřív zvolte typ zranění'}
                        </button>
                    </div>
                )}

                {isRolling && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500" role="status">
                        <Activity size={64} className="text-red-800 dark:text-red-400 animate-pulse mb-6" aria-hidden="true" />
                        <h2 className="font-serif text-3xl font-bold text-fl-surface mb-2 min-h-[2.5rem]">
                            {loadingText}
                        </h2>
                        <p className="text-fl-primary italic animate-pulse">Osud se rozhoduje...</p>
                    </div>
                )}

                {result && (
                    <div className="flex-1 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
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
                            className="mt-auto w-full min-h-12 rounded-xl bg-fl-nav font-bold uppercase tracking-wider text-white transition-all hover:bg-fl-nav-hover active:scale-[0.98]"
                        >
                            Nový hod
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CriticalInjuryModal;
