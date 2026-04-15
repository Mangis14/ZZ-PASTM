import React from 'react';
import { Sword, Anchor, Brain, Smile, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

/* ── Shared stepper button ───────────────────────────────────── */
const StepBtn = ({ onClick, children, sm = false, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        className={[
            'flex items-center justify-center rounded font-bold leading-none select-none',
            'bg-fl-primary/10 hover:bg-fl-primary/30 active:bg-fl-primary/50',
            'text-fl-primary border border-fl-primary/30 hover:border-fl-primary/60',
            'transition-all touch-manipulation',
            sm ? 'w-5 h-5 text-xs' : 'w-8 h-8 text-base',
            className,
        ].join(' ')}
    >
        {children}
    </button>
);

/* ── Single attribute card ───────────────────────────────────── */
const AttributeBox = ({ label, value, onChange, onRoll, icon: Icon }) => (
    <div className="border border-fl-primary/30 bg-fl-paper-bright rounded-sm group
                    hover:border-fl-primary/60 transition-colors overflow-hidden">

        {/* Header – click to roll */}
        <div
            className="flex justify-between items-center px-2 pt-2 pb-1
                       cursor-pointer hover:text-fl-primary"
            onClick={() => onRoll && onRoll(value.current, 0, 0)}
            title={`Hodit na atribut ${label}`}
        >
            <span className="font-bold uppercase text-[11px] tracking-wide
                             text-fl-text-muted group-hover:text-fl-primary transition-colors">
                {label}
            </span>
            {Icon && <Icon size={13} className="text-fl-primary/50 group-hover:text-fl-primary transition-colors" />}
        </div>

        {/* Divider */}
        <div className="h-px bg-fl-primary/10 mx-2" />

        {/* MAX row – compact */}
        <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
            <span className="text-[8px] uppercase tracking-widest text-fl-primary/60 w-6">Max</span>
            <div className="flex items-center gap-1">
                <StepBtn sm onClick={() => onChange({ ...value, max: Math.max(0, (value.max || 0) - 1) })}>−</StepBtn>
                <span className="text-sm font-bold text-fl-surface w-5 text-center tabular-nums">
                    {value.max ?? 0}
                </span>
                <StepBtn sm onClick={() => onChange({ ...value, max: (value.max || 0) + 1 })}>+</StepBtn>
            </div>
        </div>

        {/* TEĎ row – dominant */}
        <div className="flex items-center justify-between px-2 pt-0.5 pb-2">
            <span className="text-[8px] uppercase tracking-widest text-red-700 dark:text-red-400 w-6">Teď</span>
            <div className="flex items-center gap-1.5">
                <StepBtn sm onClick={() => onChange({ ...value, current: Math.max(0, (value.current || 0) - 1) })}>−</StepBtn>
                <span className="text-2xl font-bold text-red-800 dark:text-red-400 w-7 text-center tabular-nums leading-none">
                    {value.current ?? 0}
                </span>
                <StepBtn sm onClick={() => onChange({ ...value, current: Math.min(value.max || 99, (value.current || 0) + 1) })}>+</StepBtn>
            </div>
        </div>
    </div>
);

/* ── Main component ──────────────────────────────────────────── */
const SheetAttributes = ({ char, updateField, onRoll, innerRef }) => {
    return (
        <>
            <section ref={innerRef}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <AttributeBox label="Síla"  value={char.attributes.strength} onChange={(v) => updateField('attributes.strength', v)} onRoll={onRoll} icon={Sword}  />
                    <AttributeBox label="Obrat" value={char.attributes.agility}  onChange={(v) => updateField('attributes.agility',  v)} onRoll={onRoll} icon={Anchor} />
                    <AttributeBox label="Bystr" value={char.attributes.wits}     onChange={(v) => updateField('attributes.wits',     v)} onRoll={onRoll} icon={Brain}  />
                    <AttributeBox label="Osob"  value={char.attributes.empathy}  onChange={(v) => updateField('attributes.empathy',  v)} onRoll={onRoll} icon={Smile}  />
                </div>
            </section>

            {/* Stavy */}
            <Card className="bg-fl-paper/30 mt-3">
                <h3 className="text-[10px] font-bold uppercase mb-3 text-fl-primary text-center tracking-widest">
                    Stavy (Blokuje regeneraci)
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: 'hungry',  label: 'Hlad'     },
                        { id: 'thirsty', label: 'Žízeň'    },
                        { id: 'sleepy',  label: 'Ospalost' },
                        { id: 'cold',    label: 'Chlad'    },
                    ].map(cond => (
                        <label key={cond.id} className="flex flex-col items-center cursor-pointer group">
                            <div className={`w-7 h-7 border-2 rounded-sm flex items-center justify-center mb-1
                                            transition-colors
                                            ${char.conditions[cond.id]
                                                ? 'border-red-700 bg-red-700 text-white'
                                                : 'border-fl-primary bg-fl-card'}`}>
                                {char.conditions[cond.id] && <CheckCircle size={16} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={char.conditions[cond.id]}
                                onChange={(e) => updateField(`conditions.${cond.id}`, e.target.checked)}
                            />
                            <span className={`text-[9px] font-bold uppercase text-center leading-tight
                                            ${char.conditions[cond.id] ? 'text-red-700 dark:text-red-400' : 'text-fl-text-muted'}`}>
                                {cond.label}
                            </span>
                        </label>
                    ))}
                </div>
            </Card>

            {/* Vůle + Zkušenosti */}
            <section className="grid grid-cols-2 gap-3 mt-3">
                {[
                    { label: 'Vůle',       field: 'willpower',  value: char.willpower  },
                    { label: 'Zkušenosti', field: 'experience', value: char.experience },
                ].map(({ label, field, value }) => (
                    <div key={field}
                         className="border-2 border-fl-border bg-fl-card rounded-sm shadow-sm
                                    text-center px-2 py-3">
                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-2 tracking-widest">
                            {label}
                        </label>
                        <div className="flex items-center justify-center gap-3">
                            <StepBtn onClick={() => updateField(field, Math.max(0, (value || 0) - 1))}>−</StepBtn>
                            <span className="text-4xl font-bold font-serif text-fl-surface min-w-[2.5rem] text-center tabular-nums">
                                {value ?? 0}
                            </span>
                            <StepBtn onClick={() => updateField(field, (value || 0) + 1)}>+</StepBtn>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
};

export default SheetAttributes;
