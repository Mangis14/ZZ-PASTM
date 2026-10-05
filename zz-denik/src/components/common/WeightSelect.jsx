import React from 'react';

export const WEIGHT_OPTIONS = [
    { value: 0, short: '0', label: 'Drobná', compact: 'drobná' },
    { value: 0.5, short: '½', label: 'Lehká', compact: 'lehká' },
    { value: 1, short: '1', label: 'Normální', compact: 'norm.' },
    { value: 2, short: '2', label: 'Těžká', compact: 'těžká' }
];

export const weightLabel = (value) => {
    const option = WEIGHT_OPTIONS.find(item => item.value === Number(value));
    return option ? `${option.short} · ${option.label}` : String(value ?? 0);
};

/* Čitelná váha předmětu: číslo zátěže i slovní označení. */
const WeightSelect = ({ value, onChange, className = '', compact = false }) => {
    const numericValue = Number(value);
    const isKnown = WEIGHT_OPTIONS.some(option => option.value === numericValue);

    return (
        <select
            aria-label="Váha předmětu"
            title="Zátěž předmětu"
            className={`min-h-10 shrink-0 cursor-pointer rounded-lg border border-fl-border bg-fl-card px-2 text-xs font-bold text-fl-surface transition-colors hover:border-fl-primary/60 focus:border-fl-primary focus:outline-none ${className}`}
            value={isKnown ? numericValue : 1}
            onChange={(e) => onChange(parseFloat(e.target.value))}
        >
            {WEIGHT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                    {compact ? `${option.short} ${option.compact}` : `${option.short} · ${option.label}`}
                </option>
            ))}
        </select>
    );
};

export default WeightSelect;
