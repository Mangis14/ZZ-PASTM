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
                            className="rounded-2xl border border-fl-paper bg-fl-paper-bright p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fl-paper text-fl-primary">
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-fl-text-muted">{label}</p>
                                    <p className={`text-lg font-black leading-none ${getColorClass(val)}`}>
                                        {getDisplayValue(val)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => cycleDown(key)}
                                    disabled={isEmpty}
                                    data-game-action
                                    aria-label={`Znížit zdroj ${label}`}
                                    className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${
                                        isEmpty
                                            ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50'
                                            : 'border-fl-border bg-fl-paper text-fl-surface hover:border-fl-primary hover:text-fl-primary'
                                    }`}
                                >
                                    <span className="text-lg leading-none">-</span>
                                    <span>Ubrať</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cycleUp(key)}
                                    disabled={isMax}
                                    data-game-action
                                    aria-label={`Zvýšit zdroj ${label}`}
                                    className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${
                                        isMax
                                            ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50'
                                            : 'border-fl-primary bg-fl-primary/10 text-fl-primary hover:bg-fl-primary hover:text-white'
                                    }`}
                                >
                                    <span className="text-lg leading-none">+</span>
                                    <span>Pridať</span>
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
