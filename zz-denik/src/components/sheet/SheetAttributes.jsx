import React from 'react';
import {
    Anchor,
    BedDouble,
    Brain,
    Check,
    Dices,
    Droplets,
    Minus,
    Plus,
    Smile,
    Snowflake,
    Sparkles,
    Star,
    Sword,
    Utensils
} from 'lucide-react';
import { confirmAction } from '../common/ConfirmDialog';

const StepButton = ({ onClick, label, compact = false, disabled = false, gameAction = false }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        data-game-action={gameAction || undefined}
        className={`flex shrink-0 items-center justify-center rounded-md border border-fl-primary/30 bg-fl-primary/10 font-bold text-fl-primary transition-colors hover:border-fl-primary/60 hover:bg-fl-primary/25 active:bg-fl-primary/40 disabled:cursor-not-allowed disabled:opacity-30 ${
            compact ? 'h-7 w-7' : 'h-10 w-10'
        }`}
    >
        {label.startsWith('Snížit') ? <Minus size={compact ? 13 : 17} /> : <Plus size={compact ? 13 : 17} />}
    </button>
);

const AttributeCard = ({ label, shortLabel, value, onChange, onRoll, icon: Icon }) => {
    const current = Number(value?.current) || 0;
    const max = Number(value?.max) || 0;
    const isDamaged = current < max;
    const isDepleted = max > 0 && current === 0;
    const damage = Math.max(0, max - current);
    const confirmMaximumChange = async (nextMax) => {
        const lowersCurrent = nextMax < current;
        const confirmed = await confirmAction({
            title: `Změnit maximum vlastnosti ${label}?`,
            message: lowersCurrent
                ? `Maximum se změní z ${max} na ${nextMax}. Aktuální hodnota se zároveň sníží na ${nextMax}.`
                : `Maximum se změní z ${max} na ${nextMax}.`,
            confirmLabel: 'Změnit'
        });
        if (!confirmed) return;
        onChange({ ...value, max: nextMax, current: Math.min(current, nextMax) });
    };

    const toneClasses = isDepleted
        ? 'border-red-800/70 bg-red-900/10'
        : isDamaged
            ? 'border-amber-700/60 bg-amber-900/10'
            : 'border-green-800/35 bg-green-900/5';

    return (
        <article className={`overflow-hidden rounded-lg border shadow-sm transition-colors ${toneClasses}`}>
            <div className="flex items-center gap-1.5 border-b border-fl-primary/15 px-2 py-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    isDepleted ? 'bg-red-800 text-white' : isDamaged ? 'bg-amber-700 text-white' : 'bg-green-800/15 text-green-800 dark:text-green-400'
                }`}>
                    <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-sm font-bold uppercase tracking-wide text-fl-surface">{label}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${
                        isDepleted ? 'text-red-700 dark:text-red-400' : isDamaged ? 'text-amber-700 dark:text-amber-400' : 'text-green-800 dark:text-green-400'
                    }`}>
                        {isDepleted ? 'Vyřazena' : isDamaged ? `Poškozena · ${damage}` : 'V pořádku'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onRoll?.(current, 0, 0)}
                    disabled={current <= 0}
                    data-game-action
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-fl-primary/30 bg-fl-card text-fl-primary transition-colors hover:border-fl-primary hover:bg-fl-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Hodit na atribut ${label}`}
                    title={`Hodit na atribut ${label}`}
                >
                    <Dices size={15} />
                </button>
            </div>

            <div className="px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                    <StepButton
                        label={`Snížit aktuální hodnotu ${label}`}
                        onClick={() => onChange({ ...value, current: Math.max(0, current - 1) })}
                        disabled={current <= 0}
                        gameAction
                    />
                    <div className="min-w-0 text-center">
                        <div className={`font-serif text-4xl font-bold leading-none tabular-nums ${
                            isDepleted ? 'text-red-700 dark:text-red-400' : isDamaged ? 'text-amber-700 dark:text-amber-400' : 'text-fl-surface'
                        }`}>
                            {current}
                            <span className="ml-1 text-lg text-fl-text-muted">/{max}</span>
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-fl-text-muted">{shortLabel}</div>
                    </div>
                    <StepButton
                        label={`Zvýšit aktuální hodnotu ${label}`}
                        onClick={() => onChange({ ...value, current: Math.min(max, current + 1) })}
                        disabled={current >= max}
                        gameAction
                    />
                </div>

                <div className="mt-3 flex items-center justify-between rounded-md bg-fl-paper/60 px-1.5 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fl-text-muted">Max</span>
                    <div className="flex items-center gap-1">
                        <StepButton
                            compact
                            label={`Snížit maximum ${label}`}
                            onClick={() => confirmMaximumChange(Math.max(0, max - 1))}
                            disabled={max <= 0}
                        />
                        <span className="w-7 text-center text-sm font-bold tabular-nums text-fl-surface">{max}</span>
                        <StepButton
                            compact
                            label={`Zvýšit maximum ${label}`}
                            onClick={() => confirmMaximumChange(max + 1)}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};

const CONDITIONS = [
    { id: 'hungry', label: 'Hlad', icon: Utensils },
    { id: 'thirsty', label: 'Žízeň', icon: Droplets },
    { id: 'sleepy', label: 'Ospalost', icon: BedDouble },
    { id: 'cold', label: 'Chlad', icon: Snowflake }
];

const ConditionButton = ({ condition, active, onToggle }) => {
    const Icon = condition.icon;

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={active}
            data-game-action
            className={`flex min-h-16 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                active
                    ? 'border-red-800/60 bg-red-900/15 text-red-700 dark:text-red-400'
                    : 'border-fl-paper bg-fl-card text-fl-text-muted hover:border-fl-primary/50 hover:text-fl-primary'
            }`}
        >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                active ? 'bg-red-800 text-white' : 'bg-fl-paper text-fl-primary'
            }`}>
                {active ? <Check size={16} /> : <Icon size={15} />}
            </span>
            <span className="min-w-0">
                <span className="block truncate text-[11px] font-bold uppercase tracking-wide">{condition.label}</span>
                <span className="block text-[10px] font-bold uppercase tracking-wide opacity-70">{active ? 'Aktivní' : 'Neaktivní'}</span>
            </span>
        </button>
    );
};

const ResourceCounter = ({ label, value, icon: Icon, onChange }) => (
    <div className="flex items-center gap-3 rounded-lg border border-fl-paper bg-fl-card p-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fl-paper text-fl-primary">
            <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-fl-text-muted">{label}</div>
            <div className="font-serif text-3xl font-bold leading-none tabular-nums text-fl-surface">{value || 0}</div>
        </div>
        <div className="flex items-center gap-1.5">
            <StepButton
                compact
                label={`Snížit ${label}`}
                onClick={() => onChange(Math.max(0, (value || 0) - 1))}
                disabled={(value || 0) <= 0}
                gameAction
            />
            <StepButton compact gameAction label={`Zvýšit ${label}`} onClick={() => onChange((value || 0) + 1)} />
        </div>
    </div>
);

const SheetAttributes = ({ char, updateField, onRoll, innerRef }) => {
    const activeConditionCount = CONDITIONS.filter(condition => char.conditions?.[condition.id]).length;

    return (
        <div ref={innerRef} className="space-y-4">
            <div className="grid grid-cols-1 gap-2 min-[340px]:grid-cols-2 sm:grid-cols-4">
                <AttributeCard label="Síla" shortLabel="SIL" value={char.attributes.strength} onChange={(value) => updateField('attributes.strength', value)} onRoll={onRoll} icon={Sword} />
                <AttributeCard label="Obrat" shortLabel="OBR" value={char.attributes.agility} onChange={(value) => updateField('attributes.agility', value)} onRoll={onRoll} icon={Anchor} />
                <AttributeCard label="Osobnost" shortLabel="OSO" value={char.attributes.empathy} onChange={(value) => updateField('attributes.empathy', value)} onRoll={onRoll} icon={Smile} />
                <AttributeCard label="Bystrost" shortLabel="BYS" value={char.attributes.wits} onChange={(value) => updateField('attributes.wits', value)} onRoll={onRoll} icon={Brain} />
            </div>

            <section className={`rounded-lg border p-3 ${
                activeConditionCount > 0 ? 'border-red-900/40 bg-red-900/5' : 'border-fl-paper bg-fl-paper/30'
            }`}>
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                        <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-fl-surface">Stavy</h3>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-fl-text-muted">Aktivní stavy blokují regeneraci</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        activeConditionCount > 0 ? 'bg-red-800 text-white' : 'bg-fl-paper text-fl-primary'
                    }`}>
                        {activeConditionCount} aktivní
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CONDITIONS.map(condition => (
                        <ConditionButton
                            key={condition.id}
                            condition={condition}
                            active={!!char.conditions?.[condition.id]}
                            onToggle={() => updateField(`conditions.${condition.id}`, !char.conditions?.[condition.id])}
                        />
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-2 min-[340px]:grid-cols-2">
                <ResourceCounter label="Vůle" value={char.willpower} icon={Sparkles} onChange={(value) => updateField('willpower', value)} />
                <ResourceCounter label="Zkušenosti" value={char.experience} icon={Star} onChange={(value) => updateField('experience', value)} />
            </section>
        </div>
    );
};

export default SheetAttributes;
