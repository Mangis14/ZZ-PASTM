import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { parseGearValue } from '../../utils/items';

/* Hodnota výbavy jako AKTUÁLNÍ/MAX (bonus zbraně, třída zbroje). Poškození
   snižuje aktuální hodnotu, maximum zůstává pro opravu. Chybějící maximum
   se bere z aktuální hodnoty a uloží se při první změně. */
const GearStat = ({ label, value, maxValue, onChange, onMaxChange, signed = false, disabled = false }) => {
    const current = parseGearValue(value);
    const storedMax = parseGearValue(maxValue);
    const max = storedMax ?? current;
    const format = (number) => (signed && number > 0 ? `+${number}` : String(number));

    // Nečíselná hodnota (např. „+X“) – necháme volný text.
    if (current === null && String(value ?? '').trim()) {
        return (
            <label className="flex min-w-0 flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">{label}</span>
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="min-h-10 w-full rounded-lg border border-fl-border bg-fl-card px-2 text-center text-sm font-bold text-fl-surface focus:border-fl-primary focus:outline-none"
                />
            </label>
        );
    }

    const setCurrent = (next) => {
        if (storedMax === null && max !== null) onMaxChange(format(max));
        onChange(format(next));
    };
    const isDamaged = current !== null && max !== null && current < max;

    return (
        <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">{label}</span>
            <div className={`flex items-center gap-1 rounded-lg border px-1 ${isDamaged ? 'border-amber-600/60 bg-amber-900/10' : 'border-fl-border bg-fl-card'}`}>
                <button
                    type="button"
                    onClick={() => setCurrent(Math.max(0, (current ?? 0) - 1))}
                    disabled={disabled || (current ?? 0) <= 0}
                    aria-label={`Snížit ${label}`}
                    className="flex h-10 w-9 shrink-0 items-center justify-center rounded-md text-fl-primary transition-colors hover:bg-fl-primary/15 active:bg-fl-primary/25 disabled:opacity-30"
                >
                    <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className={`min-w-[1.75rem] text-center font-serif text-lg font-bold tabular-nums ${isDamaged ? 'text-amber-600 dark:text-amber-400' : 'text-fl-surface'}`}>
                    {current === null ? '–' : format(current)}
                </span>
                <span className="text-fl-text-muted" aria-hidden="true">/</span>
                <input
                    type="text"
                    inputMode="numeric"
                    aria-label={`Maximum ${label}`}
                    value={max === null ? '' : String(max)}
                    placeholder="max"
                    onChange={(event) => {
                        const next = parseGearValue(event.target.value);
                        if (event.target.value.trim() === '') {
                            onMaxChange('');
                            return;
                        }
                        if (next === null) return;
                        onMaxChange(format(next));
                        if (current === null || current > next) onChange(format(next));
                    }}
                    className="h-10 w-9 min-w-0 rounded-md bg-transparent text-center text-sm font-bold text-fl-text-muted focus:bg-fl-paper focus:text-fl-surface focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => setCurrent(Math.min(max ?? (current ?? 0) + 1, (current ?? 0) + 1))}
                    disabled={disabled || (max !== null && (current ?? 0) >= max)}
                    aria-label={`Zvýšit ${label}`}
                    className="flex h-10 w-9 shrink-0 items-center justify-center rounded-md text-fl-primary transition-colors hover:bg-fl-primary/15 active:bg-fl-primary/25 disabled:opacity-30"
                >
                    <Plus size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default GearStat;
