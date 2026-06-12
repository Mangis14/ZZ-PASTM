import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Backpack, CircleDollarSign, HeartPulse, Menu, Sparkles } from 'lucide-react';

const StatusChip = ({ icon: Icon, label, shortLabel, value, tone = 'default', onClick }) => {
    const toneClasses = {
        default: 'border-fl-border bg-fl-paper text-fl-primary',
        warning: 'border-amber-700/50 bg-amber-900/15 text-amber-600 dark:text-amber-400',
        danger: 'border-red-800/60 bg-red-900/20 text-red-600 dark:text-red-400'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-12 min-w-0 flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-center transition-colors hover:border-fl-primary hover:bg-fl-primary/10 active:bg-fl-primary/15 ${toneClasses[tone]}`}
        >
            <div className="flex min-w-0 items-center justify-center gap-1">
                <Icon size={12} className="shrink-0" aria-hidden="true" />
                <span className="hidden truncate text-[10px] font-bold uppercase tracking-wide opacity-75 min-[400px]:inline">
                    {label}
                </span>
                <span className="truncate text-[10px] font-bold uppercase tracking-wide opacity-75 min-[400px]:hidden">
                    {shortLabel || label}
                </span>
            </div>
            <span className="mt-0.5 text-sm font-bold leading-none tabular-nums">{value}</span>
        </button>
    );
};

const MoneyPurse = ({ money, onClick }) => {
    const currencies = [
        { key: 'gold', color: 'border-yellow-600 bg-yellow-500 text-yellow-950' },
        { key: 'silver', color: 'border-slate-400 bg-slate-300 text-slate-800' },
        { key: 'copper', color: 'border-orange-800 bg-orange-700 text-orange-100' }
    ];

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-lg border border-amber-800/50 bg-amber-950/10 px-2 py-1.5 transition-colors hover:border-amber-700 hover:bg-amber-900/15 active:bg-amber-900/20"
            aria-label="Otevřít měšec"
            title="Otevřít měšec"
        >
            {currencies.map(currency => (
                <span key={currency.key} className="flex flex-col items-center gap-0.5">
                    <CircleDollarSign size={16} className={`rounded-full border ${currency.color}`} aria-hidden="true" />
                    <span className="min-w-4 text-[10px] font-black leading-none tabular-nums text-fl-surface">
                        {money?.[currency.key] || 0}
                    </span>
                </span>
            ))}
        </button>
    );
};

const Header = ({
    char,
    toggleMenu,
    isSaving,
    totalWeight,
    encumbranceLimit,
    isOverencumbered,
    onNavigate
}) => {
    const headerRef = useRef(null);

    // Skutočná výška headera (mení sa so škálovaním písma aj šírkou)
    // sa premieta do --app-header-height, z ktorej vychádza odsadenie obsahu.
    useEffect(() => {
        const element = headerRef.current;
        if (!element) return undefined;

        const updateHeight = () => {
            document.documentElement.style.setProperty('--app-header-height', `${element.offsetHeight}px`);
        };
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const attributes = Object.values(char.attributes || {});
    const damagedAttributes = attributes.filter(attribute => Number(attribute.current) < Number(attribute.max)).length;
    const depletedAttributes = attributes.filter(attribute => Number(attribute.current) <= 0).length;
    const activeConditions = Object.values(char.conditions || {}).filter(Boolean).length;
    const capacityRatio = encumbranceLimit > 0 ? totalWeight / encumbranceLimit : 0;

    return (
        <header
            ref={headerRef}
            data-mobile-header
            className="fixed left-0 right-0 top-0 z-40 border-b border-fl-primary bg-fl-card text-fl-surface shadow-xl"
            style={{
                paddingTop: 'calc(var(--safe-top) + 8px)',
                paddingLeft: 'var(--safe-left)',
                paddingRight: 'var(--safe-right)'
            }}
        >
            <div className="mx-auto max-w-3xl px-3 pb-2">
                <div className="flex min-h-12 items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="-ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-text-muted transition-colors hover:bg-fl-paper/40 hover:text-fl-primary active:bg-fl-paper/60"
                            aria-label="Otevřít menu"
                            aria-haspopup="dialog"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="truncate font-serif text-lg font-bold uppercase leading-none tracking-wider text-fl-surface">
                                    {char.name || 'Bezejmenný'}
                                </h1>
                                {isSaving && (
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500"
                                        title="Ukládám"
                                        role="status"
                                        aria-label="Ukládám změny"
                                    />
                                )}
                            </div>
                            <div className="mt-1 truncate font-mono text-[10px] font-bold uppercase tracking-wide text-fl-primary">
                                {char.kin || 'Rasa'} · {char.profession || 'Povolání'}
                            </div>
                        </div>
                    </div>

                    <MoneyPurse money={char.money} onClick={() => onNavigate('money')} />
                </div>

                <div className="grid grid-cols-4 gap-1">
                    <StatusChip
                        icon={HeartPulse}
                        label="Vlastnosti"
                        shortLabel="Vlast."
                        value={damagedAttributes === 0 ? 'OK' : damagedAttributes}
                        tone={depletedAttributes > 0 ? 'danger' : damagedAttributes > 0 ? 'warning' : 'default'}
                        onClick={() => onNavigate('attributes')}
                    />
                    <StatusChip
                        icon={AlertTriangle}
                        label="Stavy"
                        shortLabel="Stavy"
                        value={activeConditions}
                        tone={activeConditions > 0 ? 'danger' : 'default'}
                        onClick={() => onNavigate('attributes')}
                    />
                    <StatusChip icon={Sparkles} label="Vůle" shortLabel="Vůle" value={char.willpower || 0} onClick={() => onNavigate('attributes')} />
                    <StatusChip
                        icon={Backpack}
                        label="Zátěž"
                        shortLabel="Zátěž"
                        value={`${totalWeight}/${encumbranceLimit}`}
                        tone={isOverencumbered ? 'danger' : capacityRatio >= 0.8 ? 'warning' : 'default'}
                        onClick={() => onNavigate('inventory')}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
