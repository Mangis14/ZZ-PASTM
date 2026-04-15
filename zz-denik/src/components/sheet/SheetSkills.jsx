import React from 'react';
import { Save } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const SkillRow = ({ label, value, onChange, onRoll, attr }) => (
    <div className="flex justify-between items-center border-b border-fl-border pb-1 hover:bg-fl-paper-bright">
        <span
            className="text-sm font-bold text-fl-surface-hover cursor-pointer hover:text-fl-primary transition-colors flex-1 pr-2 py-1"
            onClick={onRoll}
            title={`Hodit na dovednost ${label}`}
        >
            {label} <span className="text-[10px] font-normal text-fl-primary ml-1">({attr})</span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
            <button
                type="button"
                onClick={() => onChange(Math.max(0, (value || 0) - 1))}
                className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold leading-none select-none
                    bg-fl-primary/10 hover:bg-fl-primary/30 active:bg-fl-primary/50
                    text-fl-primary border border-fl-primary/30 hover:border-fl-primary/60
                    transition-all touch-manipulation"
            >−</button>
            <span className="w-6 text-center font-serif font-bold text-lg text-fl-surface select-none">
                {value || 0}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(5, (value || 0) + 1))}
                className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold leading-none select-none
                    bg-fl-primary/10 hover:bg-fl-primary/30 active:bg-fl-primary/50
                    text-fl-primary border border-fl-primary/30 hover:border-fl-primary/60
                    transition-all touch-manipulation"
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
