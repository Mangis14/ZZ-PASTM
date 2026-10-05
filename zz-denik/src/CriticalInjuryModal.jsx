import React, { useMemo, useState } from 'react';
import { Activity, BookmarkPlus, Check, Ghost, Hammer, RefreshCcw, ShieldAlert, Skull, Sword, X } from 'lucide-react';
import { CRIT_TABLES } from './data/crit_tables';
import useDialog from './hooks/useDialog';
import { hapticTick } from './native/platform';

const rollD66 = () => (Math.floor(Math.random() * 6) + 1) * 10 + Math.floor(Math.random() * 6) + 1;

const CriticalInjuryModal = ({ char, onClose, onSaveInjury, onUseLuck }) => {
    const panelRef = useDialog(onClose);
    const [selectedType, setSelectedType] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [choices, setChoices] = useState([]);
    const [savedToJournal, setSavedToJournal] = useState(false);
    const [luckApplied, setLuckApplied] = useState(false);
    const [resultCanUseSwap, setResultCanUseSwap] = useState(false);
    const [manualSearch, setManualSearch] = useState('');

    const luckyTalent = useMemo(
        () => (Array.isArray(char?.talents) ? char.talents : []).find(talent => talent.id === 'stastlivec'),
        [char?.talents]
    );
    const luckyRank = Number(luckyTalent?.rank || 0);
    const luckAvailable = luckyRank > 0 && !char?.luckUsedThisQuarterDay;

    const getInjury = (type, roll) => {
        const injury = CRIT_TABLES[type]?.ranges.find(range => roll >= range.min && roll <= range.max);
        return injury ? { roll, ...injury } : null;
    };

    const consumeLuck = () => {
        if (luckApplied) return;
        setLuckApplied(true);
        onUseLuck?.();
    };

    const finishRoll = (useLuck) => {
        const first = getInjury(selectedType, rollD66());
        if (useLuck) {
            const second = getInjury(selectedType, rollD66());
            setChoices([first, second].filter(Boolean));
            consumeLuck();
        } else {
            setResult(first);
            setResultCanUseSwap(luckyRank >= 2 && luckAvailable);
        }
        setIsRolling(false);
        hapticTick(40);
    };

    const handleRoll = (useLuck = false) => {
        if (!selectedType || isRolling) return;
        setIsRolling(true);
        setResult(null);
        setChoices([]);
        setSavedToJournal(false);
        window.setTimeout(() => finishRoll(useLuck), 700);
    };

    const selectResult = (injury, usesLuck = false) => {
        setResult(injury);
        setChoices([]);
        setSavedToJournal(false);
        setResultCanUseSwap(luckyRank >= 2 && (usesLuck || luckAvailable));
        if (usesLuck) consumeLuck();
    };

    const swapDigits = () => {
        if (!result || !resultCanUseSwap) return;
        const swappedRoll = (result.roll % 10) * 10 + Math.floor(result.roll / 10);
        const swapped = getInjury(selectedType, swappedRoll);
        if (!swapped) return;
        setResult(swapped);
        setSavedToJournal(false);
        setResultCanUseSwap(false);
        consumeLuck();
    };

    const handleSaveToJournal = () => {
        if (!result || !onSaveInjury || savedToJournal) return;
        const isLethal = result.lethal !== 'Ne';
        onSaveInjury({
            description: result.effect || '',
            lethal: isLethal,
            healingTime: (isLethal && result.limit) ? result.limit : (result.heal || '')
        });
        setSavedToJournal(true);
    };

    const resetRoll = () => {
        setResult(null);
        setChoices([]);
        setSelectedType(null);
        setSavedToJournal(false);
        setResultCanUseSwap(false);
        setManualSearch('');
    };

    const manualChoices = selectedType
        ? CRIT_TABLES[selectedType].ranges.filter(injury =>
            !manualSearch.trim() || injury.effect.toLocaleLowerCase('cs-CZ').includes(manualSearch.toLocaleLowerCase('cs-CZ').trim())
        )
        : [];

    const types = [
        { id: 'slash', label: 'Řezná', icon: Sword, color: 'text-red-600', border: 'border-red-600' },
        { id: 'blunt', label: 'Tupá', icon: Hammer, color: 'text-stone-600', border: 'border-stone-600' },
        { id: 'stab', label: 'Bodná', icon: ShieldAlert, color: 'text-orange-600', border: 'border-orange-600' },
        { id: 'horror', label: 'Hrůza', icon: Ghost, color: 'text-purple-600', border: 'border-purple-600' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-sm sm:items-center sm:p-4" style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }} onClick={onClose}>
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Kritické zranění"
                className="relative flex max-h-full min-h-[400px] w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl border-2 border-b-0 border-fl-primary bg-fl-card p-6 shadow-2xl outline-none sm:rounded-2xl sm:border-b-2"
                style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
                onClick={event => event.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Zavřít" className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-fl-primary hover:bg-fl-paper">
                    <X size={24} />
                </button>
                <h3 className="mb-4 flex items-center justify-center gap-2 border-b-2 border-fl-primary pb-2 text-center font-serif text-2xl font-bold uppercase text-fl-surface">
                    <Skull className="text-red-800 dark:text-red-400" /> Kritické zranění
                </h3>

                {luckyRank > 0 && (
                    <div className={`mb-4 rounded-lg border p-3 text-sm ${luckAvailable ? 'border-fl-primary bg-fl-paper text-fl-surface' : 'border-fl-border bg-fl-paper/50 text-fl-text-muted'}`}>
                        <strong>Šťastlivec {luckyRank}:</strong> {luckAvailable ? 'připraven k použití' : 'už byl tento čtvrtden použit'}
                    </div>
                )}

                {!isRolling && !result && choices.length === 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Typ zranění">
                            {types.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    role="radio"
                                    aria-checked={selectedType === type.id}
                                    className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 transition-all hover:bg-fl-paper active:scale-[0.97] ${selectedType === type.id ? `${type.border} bg-fl-paper shadow-lg` : 'border-fl-border bg-fl-paper-bright'}`}
                                >
                                    <type.icon size={28} className={type.color} />
                                    <span className={`font-bold uppercase tracking-wider ${type.color}`}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => handleRoll(false)} disabled={!selectedType} className="min-h-12 w-full rounded-xl bg-fl-nav font-bold uppercase tracking-wider text-white hover:bg-fl-nav-hover disabled:opacity-50">
                            Hodit normálně
                        </button>
                        {luckAvailable && luckyRank >= 1 && (
                            <button onClick={() => handleRoll(true)} disabled={!selectedType} className="min-h-12 w-full rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white hover:bg-fl-primary-hover disabled:opacity-50">
                                Použít štěstí: hodit 2x
                            </button>
                        )}
                        {luckAvailable && luckyRank >= 3 && selectedType && (
                            <div className="rounded-xl border border-fl-primary bg-fl-paper p-3">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-fl-primary">Libovolný výběr</label>
                                <input
                                    type="search"
                                    value={manualSearch}
                                    onChange={event => setManualSearch(event.target.value)}
                                    placeholder="Hledat zranění..."
                                    className="mb-2 min-h-11 w-full rounded-lg border border-fl-border bg-fl-paper-bright px-3 text-fl-surface outline-none focus:border-fl-primary"
                                />
                                <div className="max-h-52 space-y-1 overflow-y-auto">
                                    {manualChoices.map(injury => (
                                        <button key={`${injury.min}-${injury.max}`} onClick={() => selectResult({ roll: injury.min, ...injury }, true)} className="w-full rounded-md border border-fl-border bg-fl-paper-bright p-2 text-left text-sm font-bold text-fl-surface hover:border-fl-primary">
                                            {injury.effect} <span className="text-xs font-normal text-fl-text-muted">({injury.min}{injury.max !== injury.min ? `-${injury.max}` : ''})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isRolling && (
                    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center" role="status">
                        <Activity size={64} className="mb-5 animate-pulse text-red-800 dark:text-red-400" />
                        <h2 className="font-serif text-2xl font-bold text-fl-surface">Osud se rozhoduje...</h2>
                    </div>
                )}

                {choices.length > 0 && (
                    <div>
                        <h4 className="mb-3 text-center font-bold uppercase tracking-wider text-fl-primary">Vyber výsledek</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {choices.map((choice, index) => (
                                <button key={`${choice.roll}-${index}`} onClick={() => selectResult(choice, true)} className="rounded-xl border-2 border-fl-border bg-fl-paper-bright p-4 text-left hover:border-fl-primary">
                                    <span className="block text-3xl font-black text-fl-surface">{choice.roll}</span>
                                    <span className="font-serif font-bold text-red-800 dark:text-red-400">{choice.effect}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {result && (
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="border-b border-fl-border pb-4 text-center">
                            <span className="mb-1 block text-4xl font-black text-fl-surface">{result.roll}</span>
                            <h2 className="font-serif text-2xl font-bold uppercase text-red-800 dark:text-red-400">{result.effect}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded bg-fl-paper p-3"><span className="block text-[10px] font-bold uppercase text-fl-primary">Smrtelnost</span><strong>{result.lethal}</strong>{result.limit && <span className="block text-xs text-red-600">({result.limit})</span>}</div>
                            <div className="rounded bg-fl-paper p-3"><span className="block text-[10px] font-bold uppercase text-fl-primary">Léčení</span><strong>{result.heal}</strong></div>
                        </div>
                        {result.note && <div className="rounded border border-fl-border bg-fl-paper-bright p-4 text-sm italic text-fl-surface-hover">{result.note}</div>}
                        {resultCanUseSwap && (
                            <button onClick={swapDigits} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-fl-primary bg-fl-paper font-bold uppercase tracking-wider text-fl-primary hover:bg-fl-border">
                                <RefreshCcw size={17} /> Prohodit cifry kostky
                            </button>
                        )}
                        {onSaveInjury && (
                            <button onClick={handleSaveToJournal} disabled={savedToJournal} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white disabled:opacity-60">
                                {savedToJournal ? <><Check size={17} /> Zapsáno do deníku</> : <><BookmarkPlus size={17} /> Zapsat do deníku</>}
                            </button>
                        )}
                        <button onClick={resetRoll} className="min-h-12 w-full rounded-xl bg-fl-nav font-bold uppercase tracking-wider text-white hover:bg-fl-nav-hover">Nový hod</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CriticalInjuryModal;
