import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Flame, Plus, Search, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import useDialog from '../../hooks/useDialog';

const normalize = (value) => String(value || '').toLocaleLowerCase('cs-CZ').trim();
const toggleValue = (values, value) => values.includes(value) ? values.filter(item => item !== value) : [...values, value];

const SpellPicker = ({ char, onAdd, onClose }) => {
    const panelRef = useDialog(onClose);
    const { spells: catalogSpells } = useCatalog();
    const schools = useMemo(
        () => Object.keys(catalogSpells).filter(school => catalogSpells[school]?.length > 0),
        [catalogSpells]
    );
    const ranks = useMemo(
        () => [...new Set(schools.flatMap(school => catalogSpells[school].map(spell => Number(spell.rank))))].sort(),
        [catalogSpells, schools]
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [selectedRanks, setSelectedRanks] = useState([]);
    const [expandedSpell, setExpandedSpell] = useState(null);
    const knownSpells = Array.isArray(char.spells) ? char.spells : [];
    const knownIds = useMemo(() => new Set(knownSpells.map(spell => spell.id)), [knownSpells]);

    const filteredSpells = useMemo(() => {
        const query = normalize(searchTerm);
        return schools
            .flatMap(school => catalogSpells[school].map(spell => ({ ...spell, _school: school })))
            .filter(spell => selectedSchools.length === 0 || selectedSchools.includes(spell._school))
            .filter(spell => selectedRanks.length === 0 || selectedRanks.includes(Number(spell.rank)))
            .filter(spell => !query || [spell.name, spell.description, spell.ingredient, spell._school].some(value => normalize(value).includes(query)));
    }, [catalogSpells, schools, searchTerm, selectedRanks, selectedSchools]);

    const handleAdd = (spell) => {
        onAdd({
            id: spell.id,
            name: spell.name,
            rank: spell.rank,
            range: spell.range,
            duration: spell.duration,
            ingredient: spell.ingredient,
            description: spell.description,
            school: spell._school
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ paddingTop: 'calc(var(--safe-top) + 0.75rem)', paddingBottom: 'calc(var(--safe-bottom) + 0.75rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Vybrat kouzlo"
                className="flex h-[88dvh] max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-fl-primary bg-fl-card shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-fl-border bg-fl-card p-4">
                    <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-fl-primary">
                        <Flame size={24} aria-hidden="true" /> Vybrat kouzlo
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper"
                        aria-label="Zavřít výběr kouzla"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-3 border-b border-fl-border bg-fl-paper-light p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                        <input
                            type="search"
                            placeholder="Hledat kouzlo..."
                            className="w-full rounded border border-fl-border bg-fl-paper-bright py-2 pl-10 pr-4 text-fl-surface focus:border-fl-primary focus:outline-none"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
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
                                    className={`flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors active:opacity-80 ${
                                        selected ? 'border-fl-primary bg-fl-primary text-white' : 'border-fl-border bg-fl-paper-bright text-fl-surface'
                                    }`}
                                >
                                    <span className="truncate text-[10px] font-bold uppercase">{school}</span>
                                    <span className="shrink-0 text-[10px] font-black opacity-75">{catalogSpells[school].length}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-fl-primary">Stupeň</span>
                        {ranks.map(rank => {
                            const selected = selectedRanks.includes(rank);
                            return (
                                <button
                                    key={rank}
                                    type="button"
                                    onClick={() => setSelectedRanks(current => toggleValue(current, rank))}
                                    aria-pressed={selected}
                                    aria-label={`Stupeň ${rank}`}
                                    className={`h-10 min-w-10 rounded-lg border text-xs font-black transition-colors active:opacity-80 ${selected ? 'border-fl-primary bg-fl-primary text-white' : 'border-fl-border bg-fl-paper-bright text-fl-surface'}`}
                                >
                                    {rank}
                                </button>
                            );
                        })}
                        <span className="ml-auto text-[10px] text-fl-text-muted" aria-live="polite">{filteredSpells.length} kouzel</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto overscroll-contain bg-fl-paper-bright p-3">
                    {filteredSpells.map(spell => {
                        const known = knownIds.has(spell.id);
                        return (
                            <div key={`${spell._school}-${spell.id}`} className="overflow-hidden rounded border border-fl-border bg-fl-paper-bright">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-fl-paper/50"
                                    onClick={() => setExpandedSpell(expandedSpell === spell.id ? null : spell.id)}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 font-bold text-fl-surface">
                                            <span className="truncate">{spell.name}</span>
                                            {known && <Check size={14} className="shrink-0 text-green-700" />}
                                        </div>
                                        <div className="text-[10px] uppercase text-fl-primary">
                                            {spell._school} · Stupeň {spell.rank} · {spell.range}
                                        </div>
                                    </div>
                                    {expandedSpell === spell.id ? <ChevronUp size={20} className="shrink-0 text-fl-text-muted" /> : <ChevronDown size={20} className="shrink-0 text-fl-text-muted" />}
                                </button>

                                {expandedSpell === spell.id && (
                                    <div className="border-t border-fl-border bg-fl-paper/20 p-3">
                                        {spell.ingredient && (
                                            <p className="mb-2 text-xs text-fl-text-muted"><span className="font-bold">Pomůcka:</span> {spell.ingredient}</p>
                                        )}
                                        <p className="mb-3 font-serif text-sm leading-relaxed text-fl-surface-hover">{spell.description}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleAdd(spell)}
                                            disabled={known}
                                            className={`flex min-h-12 w-full items-center justify-center gap-1 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all ${
                                                known
                                                    ? 'cursor-not-allowed border border-green-900/30 bg-green-900/10 text-green-700'
                                                    : 'bg-fl-primary text-white hover:bg-fl-primary-hover active:scale-[0.98]'
                                            }`}
                                        >
                                            {known ? <><Check size={14} /> Naučeno</> : <><Plus size={14} /> Naučit se</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filteredSpells.length === 0 && (
                        <div className="py-8 text-center italic text-fl-text-muted">Žádná kouzla nenalezena.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpellPicker;
