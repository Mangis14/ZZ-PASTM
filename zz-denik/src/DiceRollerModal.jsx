import React, { useState } from 'react';
import { Sword, Skull, Hammer, Dices, RefreshCw, Flame, X } from 'lucide-react';

const DiceRollerModal = ({ initialRoll, onClose }) => {
    const [counts, setCounts] = useState(() => {
        return initialRoll ? { ...initialRoll, d8: 0, d10: 0, d12: 0 } : { base: 0, skill: 0, gear: 0, d8: 0, d10: 0, d12: 0 };
    });
    const [results, setResults] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [canPush, setCanPush] = useState(false);

    const rollDie = (type) => Math.floor(Math.random() * type) + 1;

    // Helper for executing the roll logic without triggering infinite loops
    const executeRoll = (currentCounts) => {
        setIsRolling(true);
        setResults(null);
        setCanPush(false);

        setTimeout(() => {
            const newResults = {
                base: Array.from({ length: currentCounts.base }, (_, i) => ({ id: `b${i}`, val: rollDie(6), type: 'base' })),
                skill: Array.from({ length: currentCounts.skill }, (_, i) => ({ id: `s${i}`, val: rollDie(6), type: 'skill' })),
                gear: Array.from({ length: currentCounts.gear }, (_, i) => ({ id: `g${i}`, val: rollDie(6), type: 'gear' })),
                artifacts: [
                    ...Array.from({ length: currentCounts.d8 }, (_, i) => ({ id: `a8${i}`, val: rollDie(8), type: 'art', max: 8 })),
                    ...Array.from({ length: currentCounts.d10 }, (_, i) => ({ id: `a10${i}`, val: rollDie(10), type: 'art', max: 10 })),
                    ...Array.from({ length: currentCounts.d12 }, (_, i) => ({ id: `a12${i}`, val: rollDie(12), type: 'art', max: 12 }))
                ]
            };
            setResults(newResults);
            setCanPush(true);
            setIsRolling(false);
        }, 600);
    };

    const handleRoll = () => {
        executeRoll(counts);
    };

    React.useEffect(() => {
        if (initialRoll) {
            executeRoll({ ...initialRoll, d8: 0, d10: 0, d12: 0 });
        }
    }, [initialRoll]);



    const handlePush = () => {
        if (!results) return;
        setIsRolling(true);
        setCanPush(false);

        setTimeout(() => {
            const reroll = (dice, isSkill) => dice.map(d => {
                if (d.val === 6) return d; // Keep success
                if (!isSkill && d.val === 1) return d; // Keep banes on base/gear
                return { ...d, val: rollDie(6) }; // Reroll
            });

            setResults({
                base: reroll(results.base, false),
                skill: reroll(results.skill, true),
                gear: reroll(results.gear, false),
                artifacts: results.artifacts
            });
            setIsRolling(false);
        }, 600);
    };

    const countSuccesses = () => {
        if (!results) return 0;
        let s = 0;
        [...results.base, ...results.skill, ...results.gear].forEach(d => { if (d.val === 6) s++; });
        results.artifacts.forEach(d => { if (d.val >= 6) s++; if (d.val >= 10) s++; if (d.val >= 11) s++; });
        return s;
    };

    const countBanes = (type) => {
        if (!results || !results[type]) return 0;
        return results[type].filter(d => d.val === 1).length;
    };

    // Komponent pre zobrazenie kocky (podľa obrázka)
    const DieDisplay = ({ val, type, max }) => {
        // Base: Béžová, čierny text, okraj
        let colorClass = "bg-[#e8e4dd] text-stone-900 border-2 border-stone-800";

        // Skill: Tmavočervená, biely text
        if (type === 'skill') colorClass = "bg-[#7a2828] text-fl-paper-light border-2 border-[#a55]";

        // Gear: Čierna, biely text
        if (type === 'gear') colorClass = "bg-[#1a1a1a] text-fl-paper-light border-2 border-stone-500";

        // Artifacts
        if (type === 'art') {
            if (max === 8) colorClass = "bg-[#4a7a4a] text-white border-2 border-green-300"; // Green d8
            if (max === 10) colorClass = "bg-[#4a6a8a] text-white border-2 border-blue-300"; // Blue d10
            if (max === 12) colorClass = "bg-[#d68a4a] text-white border-2 border-orange-300"; // Orange d12
        }

        let content = val;
        if (type !== 'art') {
            if (val === 6) content = <Sword size={24} strokeWidth={2.5} className="fill-current" />; // Úspech
            else if (val === 1 && type !== 'skill') content = <Skull size={24} strokeWidth={2.5} className="fill-current" />; // Bane
        } else {
            // Artefakt kocky ukazujú čísla, pri 6+ je to úspech
            if (val >= 6) content = (
                <div className="flex flex-col items-center justify-center -mt-1">
                    <span className="text-sm font-bold leading-none">{val}</span>
                    <div className="flex -space-x-1">
                        <Sword size={10} />
                        {val >= 10 && <Sword size={10} />}
                        {val >= 11 && <Sword size={10} />}
                    </div>
                </div>
            );
        }

        return (
            <div className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-xl shadow-md ${colorClass} relative overflow-hidden`}>
                {/* Decorative border effect */}
                <div className="absolute inset-0 border-2 border-dashed border-opacity-30 pointer-events-none"></div>
                {content}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-fl-surface/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Style pre animáciu trasenia */}
            <style>{`
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-1deg); }
                20% { transform: translate(-3px, 0px) rotate(1deg); }
                30% { transform: translate(3px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(1deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(3px, 1px) rotate(-1deg); }
                80% { transform: translate(-1px, -1px) rotate(1deg); }
                90% { transform: translate(1px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
            .dice-shake {
                animation: shake 0.5s;
                animation-iteration-count: infinite;
            }
        `}</style>

            <div className="bg-fl-paper-light w-full max-w-md rounded shadow-2xl border-4 border-fl-primary p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-fl-primary hover:text-red-600"><X size={24} /></button>
                <h3 className="font-serif text-2xl font-bold uppercase text-center mb-4 text-fl-surface border-b-2 border-fl-primary pb-2 flex items-center justify-center gap-2">
                    <Dices /> Hod Kostkami
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Vlastnost', key: 'base', color: 'text-fl-text-muted' },
                        { label: 'Dovednost', key: 'skill', color: 'text-red-800' },
                        { label: 'Vybavení', key: 'gear', color: 'text-fl-surface' }
                    ].map(d => (
                        <div key={d.key} className="text-center">
                            <label className={`block text-[10px] font-bold uppercase ${d.color} mb-1`}>{d.label}</label>
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => setCounts(p => ({ ...p, [d.key]: Math.max(0, p[d.key] - 1) }))} className="w-8 h-8 bg-fl-paper border border-fl-border text-fl-primary rounded hover:bg-fl-paper-light font-bold text-xl pb-1">-</button>
                                <span className="font-mono font-bold text-2xl w-8 text-[var(--fl-surface)]">{counts[d.key]}</span>
                                <button onClick={() => setCounts(p => ({ ...p, [d.key]: p[d.key] + 1 }))} className="w-8 h-8 bg-fl-paper border border-fl-border text-fl-primary rounded hover:bg-fl-paper-light font-bold text-xl pb-1">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-6 mb-6 border-t border-fl-border pt-4">
                    {['d8', 'd10', 'd12'].map(k => (
                        <div key={k} className="flex flex-col items-center">
                            <span className="text-[9px] font-bold uppercase text-amber-700 mb-1">{k}</span>
                            <div className="flex gap-1 items-center">
                                <button onClick={() => setCounts(p => ({ ...p, [k]: Math.max(0, p[k] - 1) }))} className="w-6 h-6 bg-fl-paper border border-fl-border text-fl-primary rounded hover:bg-fl-paper-light">-</button>
                                <span className="font-bold text-lg w-4 text-center text-[var(--fl-surface)]">{counts[k]}</span>
                                <button onClick={() => setCounts(p => ({ ...p, [k]: p[k] + 1 }))} className="w-6 h-6 bg-fl-paper border border-fl-border text-fl-primary rounded hover:bg-fl-paper-light">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mb-6">
                    <button onClick={handleRoll} disabled={isRolling} className="flex-1 py-4 bg-fl-surface text-fl-paper-light font-bold uppercase tracking-wider hover:bg-fl-surface-hover transition-colors rounded-sm flex items-center justify-center gap-2 shadow-lg">
                        {isRolling ? 'Házím...' : <><RefreshCw size={18} /> Hodit</>}
                    </button>
                    {canPush && !isRolling && (
                        <button onClick={handlePush} className="flex-1 py-4 bg-amber-700 text-fl-paper-light font-bold uppercase tracking-wider hover:bg-amber-800 transition-colors rounded-sm flex items-center justify-center gap-2 shadow-lg border border-amber-900">
                            <Flame size={18} /> Zkusit štěstí
                        </button>
                    )}
                </div>

                <div className="min-h-[8rem] bg-fl-paper rounded p-4 border-inner shadow-inner">
                    {isRolling ? (
                        <div className="flex flex-wrap gap-3 justify-center opacity-50">
                            {/* Placeholder for animation - just showing some shaking squares */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-fl-primary opacity-50 rounded dice-shake"></div>
                            ))}
                        </div>
                    ) : results ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-center gap-8 text-2xl font-black border-b-2 border-fl-border pb-3">
                                <div className="flex flex-col items-center text-green-800" title="Úspěchy">
                                    <Sword className="mb-1" />
                                    <span>{countSuccesses()}</span>
                                </div>
                                <div className="flex flex-col items-center text-stone-600" title="Zranění (Vlastnost)">
                                    <Skull className="mb-1" />
                                    <span>{countBanes('base')}</span>
                                </div>
                                <div className="flex flex-col items-center text-stone-900" title="Poškození (Vybavení)">
                                    <Hammer className="mb-1" />
                                    <span>{countBanes('gear')}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center content-start">
                                {results.base.map(d => <DieDisplay key={d.id} val={d.val} type="base" />)}
                                {results.skill.map(d => <DieDisplay key={d.id} val={d.val} type="skill" />)}
                                {results.gear.map(d => <DieDisplay key={d.id} val={d.val} type="gear" />)}
                                {results.artifacts.map(d => <DieDisplay key={d.id} val={d.val} type="art" max={d.max} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-stone-400 italic pt-8">
                            Zvolte počet kostek a hoďte...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiceRollerModal;
