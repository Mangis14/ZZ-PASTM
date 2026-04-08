import React from 'react';
import { Flame, Utensils, Droplets, Target, Wine, Cigarette } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const DICE_VALUES = [0, 'K6', 'K8', 'K10', 'K12'];

const SheetConsumables = ({ char, updateField, innerRef }) => {
    const cycleUp = (key) => {
        const current = char.consumables[key] || 0;
        const idx = DICE_VALUES.indexOf(current);
        if (idx === -1 || idx >= DICE_VALUES.length - 1) return; // Already at max
        updateField(`consumables.${key}`, DICE_VALUES[idx + 1]);
    };

    const cycleDown = (key) => {
        const current = char.consumables[key] || 0;
        const idx = DICE_VALUES.indexOf(current);
        if (idx <= 0) return; // Already at 0
        updateField(`consumables.${key}`, DICE_VALUES[idx - 1]);
    };

    const getDisplayValue = (val) => {
        if (!val || val === 0) return '—';
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Jídlo', key: 'food', icon: Utensils },
                    { label: 'Voda', key: 'water', icon: Droplets },
                    { label: 'Šípy', key: 'arrows', icon: Target },
                    { label: 'Pochodně', key: 'torches', icon: Flame },
                    { label: 'Alkohol', key: 'alcohol', icon: Wine },
                    { label: 'Tabák', key: 'tobacco', icon: Cigarette }
                ].map(({ label, key, icon: Icon }) => {
                    const val = char.consumables[key];
                    return (
                        <div key={key} className="flex items-center justify-between bg-fl-paper-bright p-2 rounded border border-fl-paper">
                            <div className="flex items-center gap-2">
                                <Icon size={16} className="text-fl-primary" />
                                <span className="text-xs font-bold uppercase text-fl-text-muted">{label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => cycleDown(key)}
                                    className="w-7 h-7 flex items-center justify-center text-fl-border hover:text-fl-primary hover:bg-fl-paper rounded-full font-bold text-lg transition-colors"
                                >−</button>
                                <span className={`font-mono font-bold text-sm w-10 text-center ${getColorClass(val)}`}>
                                    {getDisplayValue(val)}
                                </span>
                                <button
                                    onClick={() => cycleUp(key)}
                                    className="w-7 h-7 flex items-center justify-center text-fl-border hover:text-fl-primary hover:bg-fl-paper rounded-full font-bold text-lg transition-colors"
                                >+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default SheetConsumables;
