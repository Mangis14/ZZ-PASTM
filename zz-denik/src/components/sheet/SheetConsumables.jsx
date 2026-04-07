import React from 'react';
import { Flame, Utensils, Droplets, Target, Wine, Cigarette } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const SheetConsumables = ({ char, updateField, innerRef }) => {
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
                ].map(({ label, key, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between bg-fl-paper-bright p-2 rounded border border-fl-paper">
                        <div className="flex items-center gap-2">
                            <Icon size={16} className="text-fl-primary" />
                            <span className="text-xs font-bold uppercase text-fl-text-muted">{label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => updateField(`consumables.${key}`, Math.max(0, (char.consumables[key] || 0) - 1))}
                                className="text-fl-border hover:text-fl-primary font-bold px-1"
                            >-</button>
                            <input
                                type="number"
                                className="w-8 text-center bg-transparent font-bold text-fl-surface"
                                value={char.consumables[key]}
                                onChange={e => updateField(`consumables.${key}`, parseInt(e.target.value) || 0)}
                            />
                            <button
                                onClick={() => updateField(`consumables.${key}`, (char.consumables[key] || 0) + 1)}
                                className="text-fl-border hover:text-fl-primary font-bold px-1"
                            >+</button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SheetConsumables;
