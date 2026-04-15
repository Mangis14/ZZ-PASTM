import React from 'react';
import { Flame, Utensils, Droplets, Target, Wine, Cigarette } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const DICE_VALUES = [0, 'K6', 'K8', 'K10', 'K12'];
const RESOURCE_CONFIG = [
    { label: 'Jídlo', key: 'food', icon: Utensils },
    { label: 'Voda', key: 'water', icon: Droplets },
    { label: 'Šípy', key: 'arrows', icon: Target },
    { label: 'Pochodně', key: 'torches', icon: Flame },
    { label: 'Alkohol', key: 'alcohol', icon: Wine },
    { label: 'Tabák', key: 'tobacco', icon: Cigarette }
];

const SheetConsumables = ({ char, updateField, innerRef }) => {
    const cycleUp = (key) => {
        const current = char.consumables[key] || 0;
        const idx = DICE_VALUES.indexOf(current);
        if (idx === -1 || idx >= DICE_VALUES.length - 1) return;
        updateField(`consumables.${key}`, DICE_VALUES[idx + 1]);
    };

    const cycleDown = (key) => {
        const current = char.consumables[key] || 0;
        const idx = DICE_VALUES.indexOf(current);
        if (idx <= 0) return;
        updateField(`consumables.${key}`, DICE_VALUES[idx - 1]);
    };

    const getDisplayValue = (val) => {
        if (!val || val === 0) return 'Prázdné';
        return val;
    };

    const getColorClass = (val) => {
        if (!val || val === 0) return 'text-fl-text-muted';
        if (val === 'K6') return 'text-red-600 dark:text-red-400';
        if (val === 'K8') return 'text-amber-600 dark:text-amber-400';
        if (val === 'K10') return 'text-green-700 dark:text-green-400';
        if (val === 'K12') return 'text-fl-primary';
        return 'text-fl-surface';
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Zdroje" icon={Flame} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {RESOURCE_CONFIG.map(({ label, key, icon: Icon }) => {
                    const val = char.consumables[key];
                    const isEmpty = !val || val === 0;
                    const isMax = val === DICE_VALUES[DICE_VALUES.length - 1];

                    return (
                        <div
                            key={key}
                            className="rounded-2xl border border-fl-paper bg-fl-paper-bright p-3 shadow-sm flex flex-col justify-between"
                        >
                            <div className="flex flex-col items-center gap-1 mb-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fl-paper text-fl-primary">
                                    <Icon size={18} />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-fl-text-muted">{label}</p>
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-1 border-t border-fl-paper pt-3">
                                <button
                                    type="button"
                                    onClick={() => cycleDown(key)}
                                    disabled={isEmpty}
                                    aria-label={`Znížit zdroj ${label}`}
                                    className={`flex h-8 w-8 items-center justify-center rounded text-lg font-bold leading-none transition-colors touch-manipulation border ${
                                        isEmpty
                                            ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50'
                                            : 'bg-fl-primary/10 hover:bg-fl-primary/30 text-fl-primary border-fl-primary/30'
                                    }`}
                                >
                                    -
                                </button>

                                <span className={`text-xl font-black tabular-nums whitespace-nowrap text-center ${getColorClass(val)}`}>
                                    {getDisplayValue(val)}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => cycleUp(key)}
                                    disabled={isMax}
                                    aria-label={`Zvýšit zdroj ${label}`}
                                    className={`flex h-8 w-8 items-center justify-center rounded text-lg font-bold leading-none transition-colors touch-manipulation border ${
                                        isMax
                                            ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50'
                                            : 'bg-fl-primary/10 hover:bg-fl-primary/30 text-fl-primary border-fl-primary/30'
                                    }`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default SheetConsumables;
