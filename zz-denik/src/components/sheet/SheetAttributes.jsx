import React from 'react';
import { Sword, Anchor, Brain, Smile, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

const AttributeBox = ({ label, value, onChange, onRoll, icon: Icon }) => (
    <div className="border border-fl-primary/30 p-2 bg-fl-paper-bright relative rounded-sm group hover:border-fl-primary/60 transition-colors">
        <div className="flex justify-between items-center mb-1 cursor-pointer hover:text-fl-primary" onClick={() => onRoll && onRoll(value.current, 0, 0)} title={`Hodit na atribut ${label}`}>
            <span className="font-bold uppercase text-xs tracking-wide text-fl-text-muted hover:text-fl-primary transition-colors">{label}</span>
            {Icon && <Icon size={14} className="text-fl-primary/50 group-hover:text-fl-primary transition-colors" />}
        </div>
        <div className="flex gap-2">
            <div className="flex-1 text-center">
                <label className="text-[9px] text-fl-primary uppercase block mb-0.5">Max</label>
                <input
                    type="number" autoComplete="off"
                    className="w-full text-center text-xl font-bold border-b border-fl-border focus:border-fl-primary bg-transparent focus:outline-none text-fl-surface"
                    value={value.max || ''}
                    onChange={(e) => onChange({ ...value, max: parseInt(e.target.value) || 0 })}
                />
            </div>
            <div className="flex-1 text-center">
                <label className="text-[9px] text-fl-primary uppercase block mb-0.5">Teď</label>
                <input
                    type="number" autoComplete="off"
                    className="w-full text-center text-xl font-bold border-b border-fl-border focus:border-fl-primary bg-transparent focus:outline-none text-red-800"
                    value={value.current || ''}
                    onChange={(e) => onChange({ ...value, current: parseInt(e.target.value) || 0 })}
                />
            </div>
        </div>
    </div>
);

const SheetAttributes = ({ char, updateField, onRoll, innerRef }) => {
    return (
        <>
            <section ref={innerRef}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <AttributeBox label="Síla" value={char.attributes.strength} onChange={(v) => updateField('attributes.strength', v)} onRoll={onRoll} icon={Sword} />
                    <AttributeBox label="Obrat" value={char.attributes.agility} onChange={(v) => updateField('attributes.agility', v)} onRoll={onRoll} icon={Anchor} />
                    <AttributeBox label="Bystr" value={char.attributes.wits} onChange={(v) => updateField('attributes.wits', v)} onRoll={onRoll} icon={Brain} />
                    <AttributeBox label="Osob" value={char.attributes.empathy} onChange={(v) => updateField('attributes.empathy', v)} onRoll={onRoll} icon={Smile} />
                </div>
            </section>

            <Card className="bg-fl-paper/30 mt-4">
                <h3 className="text-[10px] font-bold uppercase mb-3 text-fl-primary text-center tracking-widest">Stavy (Blokuje regeneraci)</h3>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: 'hungry', label: 'Hlad' }, { id: 'thirsty', label: 'Žízeň' },
                        { id: 'sleepy', label: 'Ospalost' }, { id: 'cold', label: 'Chlad' }
                    ].map(cond => (
                        <label key={cond.id} className="flex flex-col items-center cursor-pointer group">
                            <div className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center mb-1 transition-colors ${char.conditions[cond.id] ? 'border-red-700 bg-red-700 text-white' : 'border-fl-primary bg-[var(--fl-card)]'}`}>
                                {char.conditions[cond.id] && <CheckCircle size={16} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={char.conditions[cond.id]} onChange={(e) => updateField(`conditions.${cond.id}`, e.target.checked)} />
                            <span className={`text-[9px] font-bold uppercase ${char.conditions[cond.id] ? 'text-red-700' : 'text-fl-text-muted'}`}>{cond.label}</span>
                        </label>
                    ))}
                </div>
            </Card>

        <section className="grid grid-cols-2 gap-4 mt-4">
            <div className="border-2 border-fl-surface p-3 bg-[var(--fl-card)] text-center relative rounded-sm shadow-sm">
                <div className="absolute top-1 left-1 right-1 h-[1px] bg-fl-surface/10"></div>
                <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Vůle</label>
                <input type="number" autoComplete="off" value={char.willpower || ''} onChange={e => updateField('willpower', parseInt(e.target.value))} className="w-full text-center text-4xl font-bold bg-transparent outline-none font-serif text-fl-surface" />
            </div>
            <div className="border-2 border-fl-surface p-3 bg-[var(--fl-card)] text-center relative rounded-sm shadow-sm">
                <div className="absolute top-1 left-1 right-1 h-[1px] bg-fl-surface/10"></div>
                <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Zkušenosti</label>
                <input type="number" autoComplete="off" value={char.experience || ''} onChange={e => updateField('experience', parseInt(e.target.value))} className="w-full text-center text-4xl font-bold bg-transparent outline-none font-serif text-fl-surface" />
            </div>
        </section>
        </>
    );
};

export default SheetAttributes;
