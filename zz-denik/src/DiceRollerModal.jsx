import React, { useState } from 'react';
import { Sword, Skull, Hammer, Dices, RefreshCw, Flame, X, Minus, Plus } from 'lucide-react';
import useDialog from './hooks/useDialog';
import { hapticTick } from './native/platform';

const Stepper = ({ value, onDecrement, onIncrement, decrementLabel, incrementLabel, compact = false }) => (
    <div className="flex items-center justify-center gap-1.5">
        <button
            onClick={onDecrement}
            disabled={value <= 0}
            aria-label={decrementLabel}
            className={`flex items-center justify-center rounded-lg border border-fl-border bg-fl-paper font-bold text-fl-primary transition-colors hover:bg-fl-paper-light active:bg-fl-border disabled:opacity-30 ${
                compact ? 'h-9 w-9' : 'h-11 w-11'
            }`}
        >
            <Minus size={compact ? 14 : 18} />
        </button>
        <span
            className={`text-center font-mono font-bold tabular-nums text-fl-surface ${compact ? 'w-6 text-lg' : 'w-8 text-2xl'}`}
            aria-live="polite"
        >
            {value}
        </span>
        <button
            onClick={onIncrement}
            aria-label={incrementLabel}
            className={`flex items-center justify-center rounded-lg border border-fl-border bg-fl-paper font-bold text-fl-primary transition-colors hover:bg-fl-paper-light active:bg-fl-border ${
                compact ? 'h-9 w-9' : 'h-11 w-11'
            }`}
        >
            <Plus size={compact ? 14 : 18} />
        </button>
    </div>
);

const DiceRollerModal = ({ initialRoll, onClose }) => {
    const panelRef = useDialog(onClose);
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
        hapticTick(20);

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
            hapticTick(35);
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
        hapticTick(20);

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
            hapticTick(35);
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ paddingTop: 'calc(var(--safe-top) + 1rem)', paddingBottom: 'calc(var(--safe-bottom) + 1rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Hod kostkami"
                className="relative max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border-2 border-fl-primary bg-fl-card p-6 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Zavřít"
                    className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-paper hover:text-red-600 active:bg-fl-paper"
                >
                    <X size={24} />
                </button>
                <h3 className="font-serif text-2xl font-bold uppercase text-center mb-4 text-fl-surface border-b-2 border-fl-primary pb-2 flex items-center justify-center gap-2">
                    <Dices aria-hidden="true" /> Hod Kostkami
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { label: 'Vlastnost', key: 'base', color: 'text-fl-text-muted' },
                        { label: 'Dovednost', key: 'skill', color: 'text-red-800 dark:text-red-400' },
                        { label: 'Vybavení', key: 'gear', color: 'text-fl-surface' }
                    ].map(d => (
                        <div key={d.key} className="text-center">
                            <span className={`block text-[10px] font-bold uppercase ${d.color} mb-1.5`}>{d.label}</span>
                            <Stepper
                                value={counts[d.key]}
                                onDecrement={() => setCounts(p => ({ ...p, [d.key]: Math.max(0, p[d.key] - 1) }))}
                                onIncrement={() => setCounts(p => ({ ...p, [d.key]: p[d.key] + 1 }))}
                                decrementLabel={`Ubrat kostku — ${d.label}`}
                                incrementLabel={`Přidat kostku — ${d.label}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-5 mb-5 border-t border-fl-border pt-4">
                    {['d8', 'd10', 'd12'].map(k => (
                        <div key={k} className="flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-500 mb-1.5">{k}</span>
                            <Stepper
                                compact
                                value={counts[k]}
                                onDecrement={() => setCounts(p => ({ ...p, [k]: Math.max(0, p[k] - 1) }))}
                                onIncrement={() => setCounts(p => ({ ...p, [k]: p[k] + 1 }))}
                                decrementLabel={`Ubrat artefaktovou kostku ${k}`}
                                incrementLabel={`Přidat artefaktovou kostku ${k}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={handleRoll}
                        disabled={isRolling}
                        className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-fl-nav font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-fl-nav-hover active:scale-[0.98] disabled:opacity-60"
                    >
                        {isRolling ? 'Házím…' : <><RefreshCw size={18} aria-hidden="true" /> Hodit</>}
                    </button>
                    {canPush && !isRolling && (
                        <button
                            onClick={handlePush}
                            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-900 bg-amber-700 font-bold uppercase tracking-wider text-fl-paper-light shadow-lg transition-all hover:bg-amber-800 active:scale-[0.98] animate-in fade-in duration-200"
                        >
                            <Flame size={18} aria-hidden="true" /> Zkusit štěstí
                        </button>
                    )}
                </div>

                <div className="min-h-[8rem] rounded-xl border border-fl-border/50 bg-fl-paper p-4 shadow-inner" aria-live="polite">
                    {isRolling ? (
                        <div className="flex flex-wrap gap-3 justify-center opacity-50">
                            {/* Placeholder for animation - just showing some shaking squares */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-fl-primary opacity-50 rounded dice-shake"></div>
                            ))}
                        </div>
                    ) : results ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-center gap-8 text-2xl font-black border-b-2 border-fl-border pb-3">
                                <div className="flex flex-col items-center text-green-800 dark:text-green-400" title="Úspěchy">
                                    <Sword className="mb-1" aria-hidden="true" />
                                    <span aria-label={`${countSuccesses()} úspěchů`}>{countSuccesses()}</span>
                                </div>
                                <div className="flex flex-col items-center text-stone-600 dark:text-stone-400" title="Zranění (Vlastnost)">
                                    <Skull className="mb-1" aria-hidden="true" />
                                    <span aria-label={`${countBanes('base')} zranění vlastnosti`}>{countBanes('base')}</span>
                                </div>
                                <div className="flex flex-col items-center text-stone-900 dark:text-stone-300" title="Poškození (Vybavení)">
                                    <Hammer className="mb-1" aria-hidden="true" />
                                    <span aria-label={`${countBanes('gear')} poškození vybavení`}>{countBanes('gear')}</span>
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
                        <div className="text-center text-fl-text-muted italic pt-8">
                            Zvolte počet kostek a hoďte…
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiceRollerModal;
