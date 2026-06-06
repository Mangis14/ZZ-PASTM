import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Flame, Plus, Search, X } from 'lucide-react';
import { useCatalog } from './context/CatalogContext';

const normalize = (value) => String(value || '').toLocaleLowerCase('cs-CZ').trim();

const toggleValue = (values, value) => (
    values.includes(value) ? values.filter(item => item !== value) : [...values, value]
);

const SpellCard = ({ spell, isExpanded, onToggle, knownSpell, onLearnSpell }) => (
    <div className="mb-3 overflow-hidden rounded border border-fl-paper bg-fl-paper-bright shadow-sm">
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-3 border-b border-fl-paper bg-fl-paper-light p-3 text-left transition-colors hover:bg-fl-paper"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fl-nav text-white">
                    <Flame size={16} />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-serif text-lg font-bold leading-none text-fl-surface">{spell.name}</h3>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-fl-primary">
                        <span className="text-fl-text-muted">{spell._school} · </span>
                        Stupeň {spell.rank} · {spell.range}
                    </div>
                </div>
            </div>
            {isExpanded ? <ChevronUp size={20} className="shrink-0 text-fl-primary" /> : <ChevronDown size={20} className="shrink-0 text-fl-primary" />}
        </button>

        {isExpanded && (
            <div className="bg-fl-card p-4">
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded border border-fl-paper bg-fl-paper-bright p-2">
                        <span className="block text-[9px] font-bold uppercase text-fl-primary">Dosah</span>
                        {spell.range}
                    </div>
                    <div className="rounded border border-fl-paper bg-fl-paper-bright p-2">
                        <span className="block text-[9px] font-bold uppercase text-fl-primary">Trvání</span>
                        {spell.duration}
                    </div>
                </div>
                {spell.ingredient && (
                    <div className="mb-3 text-xs">
                        <span className="font-bold uppercase text-fl-text-muted">Pomůcka: </span>
                        <span className="text-fl-surface">{spell.ingredient}</span>
                    </div>
                )}
                <p className="font-serif text-sm leading-relaxed text-fl-surface-hover">{spell.description}</p>
                <div className="mt-4 border-t border-fl-paper pt-3">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (!knownSpell) onLearnSpell?.(spell);
                        }}
                        disabled={!onLearnSpell || Boolean(knownSpell)}
                        className={`flex w-full items-center justify-center gap-2 rounded py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                            knownSpell
                                ? 'cursor-not-allowed border border-fl-paper bg-fl-paper text-fl-text-muted'
                                : 'border border-fl-primary-hover bg-fl-primary text-white hover:bg-fl-primary-hover'
                        }`}
                    >
                        {knownSpell ? <Check size={14} /> : <Plus size={14} />}
                        {knownSpell ? 'Už ovládáš' : 'Přidat kouzlo'}
                    </button>
                </div>
            </div>
        )}
    </div>
);

const SpellsSection = ({ char, onLearnSpell }) => {
    const { spells: catalogSpells } = useCatalog();
    const schools = useMemo(
        () => Object.keys(catalogSpells).filter(school => catalogSpells[school]?.length > 0),
        [catalogSpells]
    );
    const ranks = useMemo(
        () => [...new Set(schools.flatMap(school => catalogSpells[school].map(spell => Number(spell.rank))))].sort(),
        [catalogSpells, schools]
    );
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [selectedRanks, setSelectedRanks] = useState([]);
    const [knownFilter, setKnownFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const knownSpells = Array.isArray(char?.spells) ? char.spells : [];
    const knownIds = useMemo(() => new Set(knownSpells.map(spell => spell.id)), [knownSpells]);

    const filteredSpells = useMemo(() => {
        const query = normalize(search);
        return schools
            .flatMap(school => catalogSpells[school].map(spell => ({ ...spell, _school: school })))
            .filter(spell => selectedSchools.length === 0 || selectedSchools.includes(spell._school))
            .filter(spell => selectedRanks.length === 0 || selectedRanks.includes(Number(spell.rank)))
            .filter(spell => knownFilter === 'all' || (knownFilter === 'known' ? knownIds.has(spell.id) : !knownIds.has(spell.id)))
            .filter(spell => !query || [spell.name, spell.description, spell.ingredient, spell._school].some(value => normalize(value).includes(query)));
    }, [catalogSpells, knownFilter, knownIds, schools, search, selectedRanks, selectedSchools]);

    const clearFilters = () => {
        setSelectedSchools([]);
        setSelectedRanks([]);
        setKnownFilter('all');
        setSearch('');
    };

    const hasFilters = selectedSchools.length > 0 || selectedRanks.length > 0 || knownFilter !== 'all' || search.trim();

    return (
        <div className="space-y-4">
            <section className="space-y-3 rounded-lg border border-fl-border bg-fl-card p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                    <input
                        type="search"
                        placeholder="Hledat název, školu, popis nebo pomůcku..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full rounded border border-fl-border bg-fl-paper-bright py-2.5 pl-10 pr-9 text-fl-surface placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-fl-text-muted" aria-label="Vymazat hledání">
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-fl-primary">Školy magie</h2>
                        <button type="button" onClick={() => setSelectedSchools([])} className="text-[10px] font-bold uppercase text-fl-text-muted hover:text-fl-primary">
                            Všechny
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                        {schools.map(school => {
                            const selected = selectedSchools.includes(school);
                            return (
                                <button
                                    key={school}
                                    type="button"
                                    onClick={() => setSelectedSchools(current => toggleValue(current, school))}
                                    aria-pressed={selected}
                                    className={`flex min-w-0 items-center justify-between gap-2 rounded border px-2.5 py-2 text-left transition-colors ${
                                        selected ? 'border-fl-primary bg-fl-primary text-white' : 'border-fl-border bg-fl-paper-light text-fl-surface hover:border-fl-primary'
                                    }`}
                                >
                                    <span className="truncate text-[10px] font-bold uppercase tracking-wide">{school}</span>
                                    <span className={`shrink-0 text-[9px] font-black ${selected ? 'text-white/80' : 'text-fl-primary'}`}>{catalogSpells[school].length}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1.5fr]">
                    <div>
                        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-fl-primary">Stupeň</h2>
                        <div className="flex gap-1">
                            {ranks.map(rank => {
                                const selected = selectedRanks.includes(rank);
                                return (
                                    <button
                                        key={rank}
                                        type="button"
                                        onClick={() => setSelectedRanks(current => toggleValue(current, rank))}
                                        aria-pressed={selected}
                                        className={`h-9 flex-1 rounded border text-xs font-black ${selected ? 'border-fl-primary bg-fl-primary text-white' : 'border-fl-border bg-fl-paper-light text-fl-surface'}`}
                                    >
                                        {rank}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-fl-primary">Znalost</h2>
                        <div className="grid grid-cols-3 gap-1">
                            {[['all', 'Vše'], ['known', 'Naučené'], ['unknown', 'Ostatní']].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setKnownFilter(value)}
                                    aria-pressed={knownFilter === value}
                                    className={`h-9 rounded border px-1 text-[9px] font-bold uppercase ${knownFilter === value ? 'border-fl-primary bg-fl-primary text-white' : 'border-fl-border bg-fl-paper-light text-fl-surface'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-fl-border pt-3 text-xs text-fl-text-muted">
                    <span>Nalezeno <strong className="text-fl-primary">{filteredSpells.length}</strong> kouzel</span>
                    {hasFilters && <button type="button" onClick={clearFilters} className="font-bold uppercase text-fl-primary">Zrušit filtry</button>}
                </div>
            </section>

            <div className="space-y-1">
                {filteredSpells.map(spell => (
                    <SpellCard
                        key={`${spell._school}-${spell.id}`}
                        spell={spell}
                        isExpanded={Boolean(expanded[spell.id])}
                        onToggle={() => setExpanded(current => ({ ...current, [spell.id]: !current[spell.id] }))}
                        knownSpell={knownIds.has(spell.id)}
                        onLearnSpell={onLearnSpell}
                    />
                ))}
                {filteredSpells.length === 0 && (
                    <div className="rounded border-2 border-dashed border-fl-border py-12 text-center italic text-fl-text-muted">
                        Žádná kouzla neodpovídají vybraným filtrům.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellsSection;
