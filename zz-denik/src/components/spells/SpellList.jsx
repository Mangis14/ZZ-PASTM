import React, { useEffect, useMemo, useState } from 'react';
import { Flame, Info, Plus, Search, X } from 'lucide-react';
import useDialog from '../../hooks/useDialog';
import { confirmAction } from '../common/ConfirmDialog';

const normalize = (value) => String(value || '').toLocaleLowerCase('cs-CZ').trim();

const SpellDetailPopup = ({ spell, onClose, onShowFull }) => {
    const panelRef = useDialog(onClose);

    return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        style={{ paddingTop: 'calc(var(--safe-top) + 1rem)', paddingBottom: 'calc(var(--safe-bottom) + 1rem)' }}
        onClick={onClose}
    >
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Kouzlo ${spell.name}`}
            className="w-full max-w-md max-h-full overflow-y-auto overscroll-contain rounded-2xl border border-fl-primary bg-fl-paper-bright shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
            onClick={event => event.stopPropagation()}
        >
            <div className="flex items-center justify-between border-b border-fl-primary bg-fl-nav p-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fl-primary text-white shadow-md" aria-hidden="true">
                        <Flame size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate font-serif text-lg font-bold leading-tight text-white">{spell.name}</h3>
                        <span className="text-[10px] uppercase tracking-wider text-fl-primary">{spell.school} · Stupeň {spell.rank}</span>
                    </div>
                </div>
                <button
                    data-game-action
                    type="button"
                    onClick={onClose}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-nav-hover hover:text-fl-paper-light active:bg-fl-nav-hover"
                    aria-label="Zavřít detail kouzla"
                >
                    <X size={22} />
                </button>
            </div>

            <div className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded border border-fl-paper bg-fl-card p-2">
                        <span className="block text-[9px] font-bold uppercase text-fl-primary">Vzdálenost</span>
                        <span className="text-fl-surface">{spell.range}</span>
                    </div>
                    <div className="rounded border border-fl-paper bg-fl-card p-2">
                        <span className="block text-[9px] font-bold uppercase text-fl-primary">Trvání</span>
                        <span className="text-fl-surface">{spell.duration}</span>
                    </div>
                </div>
                {spell.ingredient && (
                    <div className="rounded border border-fl-paper bg-fl-card p-2 text-xs">
                        <span className="text-[9px] font-bold uppercase text-fl-primary">Pomůcka: </span>
                        <span className="text-fl-surface">{spell.ingredient}</span>
                    </div>
                )}
                <div className="rounded border border-fl-paper bg-fl-card p-3">
                    <p className="font-serif text-sm leading-relaxed text-fl-surface-hover">{spell.description}</p>
                </div>
            </div>

            <div className="px-4 pb-4">
                <button
                    type="button"
                    onClick={() => { onShowFull(); onClose(); }}
                    className="flex w-full min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-border text-xs font-bold uppercase tracking-wider text-fl-primary hover:bg-fl-paper active:bg-fl-paper transition-colors"
                >
                    <Info size={14} aria-hidden="true" /> Zobrazit kompletní knihu kouzel
                </button>
            </div>
        </div>
    </div>
    );
};

const SpellList = ({ spells, onRemove, onOpenPicker, onShowFullSpell, onDetailOpenChange }) => {
    const [selectedSpell, setSelectedSpell] = useState(null);
    const [search, setSearch] = useState('');

    const filteredSpells = useMemo(() => {
        const query = normalize(search);
        return spells
            .map((spell, index) => ({ spell, index }))
            .filter(({ spell }) => !query || [spell.name, spell.school, spell.description, spell.ingredient].some(value => normalize(value).includes(query)));
    }, [search, spells]);

    useEffect(() => {
        onDetailOpenChange?.(Boolean(selectedSpell));
    }, [selectedSpell, onDetailOpenChange]);

    return (
        <div className="space-y-3">
            {spells.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={16} />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Hledat v naučených kouzlech..."
                        className="w-full rounded border border-fl-border bg-fl-paper-bright py-2.5 pl-9 pr-9 text-sm text-fl-surface placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-fl-text-muted" aria-label="Vymazat hledání">
                            <X size={15} />
                        </button>
                    )}
                </div>
            )}

            {filteredSpells.map(({ spell, index }) => (
                <div
                    key={`${spell.id}-${index}`}
                    className="relative flex w-full items-center gap-1 rounded-lg border border-fl-paper bg-fl-paper-bright transition-colors hover:border-fl-primary/50"
                >
                    <button
                        type="button"
                        onClick={() => setSelectedSpell({ ...spell, _index: index })}
                        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-l-lg p-3 text-left active:bg-fl-paper/50"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fl-nav text-white shadow-sm" aria-hidden="true">
                            <Flame size={16} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold uppercase tracking-wide text-fl-surface">{spell.name}</h4>
                            <span className="text-[10px] uppercase text-fl-primary">{spell.school} · Stupeň {spell.rank}</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={async (event) => {
                            event.stopPropagation();
                            const confirmed = await confirmAction({
                                title: `Zapomenout kouzlo ${spell.name}?`,
                                confirmLabel: 'Zapomenout',
                                danger: true
                            });
                            if (confirmed) onRemove(index);
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-fl-text-muted transition-colors hover:bg-red-900/20 hover:text-red-700 active:bg-red-900/20"
                        aria-label={`Zapomenout kouzlo ${spell.name}`}
                        title="Zapomenout kouzlo"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}

            {spells.length === 0 && (
                <div className="rounded border-2 border-dashed border-fl-border py-6 text-center italic text-fl-text-muted">Zatím žádná kouzla.</div>
            )}
            {spells.length > 0 && filteredSpells.length === 0 && (
                <div className="rounded border-2 border-dashed border-fl-border py-6 text-center italic text-fl-text-muted">Žádné naučené kouzlo neodpovídá hledání.</div>
            )}

            <button
                type="button"
                onClick={onOpenPicker}
                className="flex w-full min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-paper text-xs font-bold uppercase tracking-widest text-fl-primary transition-all hover:bg-fl-border active:scale-[0.99]"
            >
                <Plus size={16} aria-hidden="true" /> Přidat kouzlo
            </button>

            {selectedSpell && (
                <SpellDetailPopup spell={selectedSpell} onClose={() => setSelectedSpell(null)} onShowFull={onShowFullSpell} />
            )}
        </div>
    );
};

export default SpellList;
