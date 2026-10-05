import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import useDialog from '../../hooks/useDialog';

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

const WeightMenu = ({ anchorRect, value, onSelect, onClose }) => {
    const panelRef = useDialog(onClose);
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: anchorRect.bottom + 6, left: Math.max(12, anchorRect.right - 192) });

    // Menu drží u tlačítka; když se pod něj nevejde, otevře se nahoru.
    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;
        const { height, width } = menu.getBoundingClientRect();
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const preferredTop = spaceBelow < height + 96 ? anchorRect.top - height - 6 : anchorRect.bottom + 6;
        const top = Math.min(window.innerHeight - height - 12, Math.max(12, preferredTop));
        const left = Math.min(window.innerWidth - width - 12, Math.max(12, anchorRect.right - width));
        setPosition({ top, left });
    }, [anchorRect]);

    return createPortal(
        <div className="fixed inset-0 z-[9000]" onClick={onClose}>
            <div
                ref={(node) => { menuRef.current = node; panelRef.current = node; }}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Zátěž předmětu"
                className="fixed w-48 overflow-hidden rounded-xl border border-fl-border bg-fl-card p-1 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-150"
                style={{ top: position.top, left: position.left }}
                onClick={(event) => event.stopPropagation()}
            >
                {WEIGHT_OPTIONS.map(option => {
                    const isSelected = option.value === Number(value);
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSelect(option.value)}
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
            </div>
        </div>,
        document.body
    );
};

/* Minimalistická zátěž předmětu: čtyři tečky, plný popis až v menu. */
const WeightSelect = ({ value, onChange, className = '' }) => {
    const buttonRef = useRef(null);
    const [anchorRect, setAnchorRect] = useState(null);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setAnchorRect(buttonRef.current?.getBoundingClientRect() || null)}
                data-readonly-in-game
                aria-haspopup="dialog"
                aria-expanded={Boolean(anchorRect)}
                aria-label={`Zátěž ${weightLabel(value)}, změnit`}
                title={`Zátěž ${weightLabel(value)}`}
                className={`flex h-10 shrink-0 items-center justify-center rounded-lg px-2 transition-colors hover:bg-fl-paper active:bg-fl-paper ${className}`}
            >
                <WeightDots value={value} />
            </button>
            {anchorRect && (
                <WeightMenu
                    anchorRect={anchorRect}
                    value={value}
                    onSelect={(next) => { onChange(next); setAnchorRect(null); }}
                    onClose={() => setAnchorRect(null)}
                />
            )}
        </>
    );
};

export default WeightSelect;
