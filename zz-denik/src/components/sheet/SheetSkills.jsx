import React from 'react';
import { Save } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const SkillRow = ({ label, value, onChange, onRoll, attr }) => (
    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-fl-border group hover:bg-fl-paper-bright">
        <button
            type="button"
            data-game-action
            className="min-w-0 flex-1 self-stretch py-1 text-left text-sm font-bold text-fl-surface-hover transition-colors hover:text-fl-primary active:text-fl-primary"
            onClick={onRoll}
            title={`Hodit na dovednost ${label}`}
        >
            {label} <span className="text-[10px] font-normal text-fl-primary ml-1">({attr})</span>
        </button>
        <div className="flex items-center">
            <button
                onClick={() => onChange(Math.max(0, (value || 0) - 1))}
                disabled={(value || 0) <= 0}
                aria-label={`Snížit dovednost ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper disabled:opacity-30"
            >−</button>
            <input
                type="number" inputMode="numeric" autoComplete="off"
                aria-label={`Hodnota dovednosti ${label}`}
                className="w-8 text-center bg-transparent font-serif font-bold text-lg border-none focus:outline-none focus:ring-0 text-fl-surface p-0"
                value={value || ''}
                placeholder="0"
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            />
            <button
                onClick={() => onChange((value || 0) + 1)}
                aria-label={`Zvýšit dovednost ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper"
            >+</button>
        </div>
    </div>
);

const SheetSkills = ({ char, updateField, onRoll, innerRef }) => {
    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Dovednosti" icon={Save} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                {[
                    { title: "Síla", attr: "SIL", baseKey: 'strength', items: [['Svaly', 'might'], ['Výdrž', 'endurance'], ['Boj zblízka', 'melee'], ['Řemesla', 'crafting']] },
                    { title: "Obratnost", attr: "OBR", baseKey: 'agility', items: [['Plížení', 'stealth'], ['Zlodějina', 'sleightOfHand'], ['Mrštnost', 'move'], ['Střelba', 'marksmanship']] },
                    { title: "Bystrost", attr: "BYS", baseKey: 'wits', items: [['Ostražitost', 'scouting'], ['Příběhy', 'lore'], ['Přežití', 'survival'], ['Empatie', 'insight']] },
                    { title: "Osobnost", attr: "OSO", baseKey: 'empathy', items: [['Manipulace', 'manipulation'], ['Vystupování', 'performance'], ['Léčení', 'healing'], ['Zvířata', 'animalHandling']] }
                ].map((group, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-bold uppercase text-fl-primary mb-3 border-b border-fl-paper pb-1">{group.title}</h3>
                        <div className="space-y-2">
                            {group.items.map(([label, key]) => (
                                <SkillRow 
                                    key={key} 
                                    label={label} 
                                    attr={group.attr} 
                                    value={char.skills[key]} 
                                    onChange={(v) => updateField(`skills.${key}`, v)}
                                    onRoll={() => onRoll && onRoll(char.attributes[group.baseKey].current, char.skills[key] || 0, 0)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SheetSkills;
