import React from 'react';
import { Check } from 'lucide-react';
import AnchoredMenu, { useAnchoredMenu } from './AnchoredMenu';

export const WEIGHT_OPTIONS = [
    { value: 0, short: '0', label: 'Drobná' },
    { value: 0.5, short: '½', label: 'Lehká' },
    { value: 1, short: '1', label: 'Normální' },
    { value: 2, short: '2', label: 'Těžká' }
];

// Čtyři tečky od nejmenší zelené (0) po největší červenou (2).
const DOTS = [
    { size: 'h-1.5 w-1.5', color: 'bg-green-500' },
    { size: 'h-2 w-2', color: 'bg-lime-500' },
    { size: 'h-2.5 w-2.5', color: 'bg-orange-500' },
    { size: 'h-3 w-3', color: 'bg-red-600' }
];

const levelOf = (value) => {
    const index = WEIGHT_OPTIONS.findIndex(option => option.value === Number(value));
    return index === -1 ? 2 : index;
};

export const weightLabel = (value) => {
    const option = WEIGHT_OPTIONS[levelOf(value)];
    return `${option.short} · ${option.label}`;
};

export const WeightDots = ({ value }) => {
    const level = levelOf(value);
    return (
        <span className="flex items-center gap-[3px]" aria-hidden="true">
            {DOTS.map((dot, index) => (
                <span
                    key={index}
                    className={`rounded-full ${dot.size} ${index <= level ? dot.color : 'border border-fl-text-muted/50 bg-transparent'}`}
                />
            ))}
        </span>
    );
};

/* Minimalistická zátěž předmětu: čtyři tečky, plný popis až v menu. */
const WeightSelect = ({ value, onChange, className = '' }) => {
    const menu = useAnchoredMenu();

    return (
        <>
            <button
                type="button"
                onClick={menu.open}
                data-readonly-in-game
                aria-haspopup="dialog"
                aria-expanded={menu.isOpen}
                aria-label={`Zátěž ${weightLabel(value)}, změnit`}
                title={`Zátěž ${weightLabel(value)}`}
                className={`flex h-10 shrink-0 items-center justify-center rounded-lg px-2 transition-colors hover:bg-fl-paper active:bg-fl-paper ${className}`}
            >
                <WeightDots value={value} />
            </button>
            {menu.isOpen && (
                <AnchoredMenu anchorRect={menu.anchorRect} onClose={menu.close} label="Zátěž předmětu">
                    {WEIGHT_OPTIONS.map(option => {
                        const isSelected = option.value === Number(value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => { onChange(option.value); menu.close(); }}
                                aria-pressed={isSelected}
                                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors active:bg-fl-paper ${
                                    isSelected ? 'bg-fl-primary/10 font-bold text-fl-primary' : 'text-fl-surface hover:bg-fl-paper'
                                }`}
                            >
                                <span className="w-11 shrink-0"><WeightDots value={option.value} /></span>
                                <span className="flex-1 whitespace-nowrap"><span className="tabular-nums">{option.short}</span> · {option.label}</span>
                                {isSelected && <Check size={14} aria-hidden="true" />}
                            </button>
                        );
                    })}
                </AnchoredMenu>
            )}
        </>
    );
};

export default WeightSelect;
