import React, { useState, useMemo } from 'react';
import { Search, Flame, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useCatalog } from './context/CatalogContext';

const SpellCard = ({ spell, isExpanded, onToggle, showSchool, knownSpell, onLearnSpell }) => {
    return (
        <div className="bg-fl-paper-bright border border-fl-paper rounded mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div
                onClick={onToggle}
                className="p-3 flex items-center justify-between cursor-pointer bg-fl-paper-light border-b border-fl-paper"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-fl-nav flex items-center justify-center text-white">
                        <Flame size={16} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-fl-surface text-lg leading-none">{spell.name}</h3>
                        <div className="text-[10px] uppercase font-bold text-fl-primary mt-1 tracking-wider">
                            {showSchool && <span className="text-fl-text-muted">{spell._school} • </span>}
                            Stupeň {spell.rank} • {spell.range} • {spell.duration}
                        </div>
                    </div>
                </div>
                <button className="text-fl-primary hover:text-fl-surface transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 bg-fl-card">
                    {spell.ingredient && (
                        <div className="mb-3 flex gap-2 text-xs">
                            <span className="font-bold text-fl-text-muted uppercase">Pomůcka:</span>
                            <span className="text-fl-surface">{spell.ingredient}</span>
                        </div>
                    )}
                    <p className="text-sm text-fl-surface-hover leading-relaxed font-serif">
                        {spell.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-fl-paper flex flex-col gap-2">
                        {knownSpell && (
                            <div className="text-[11px] uppercase tracking-wider text-fl-text-muted">
                                Toto kúzlo už máš v denníku.
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!knownSpell && onLearnSpell) {
                                    onLearnSpell(spell);
                                }
                            }}
                            disabled={!onLearnSpell || Boolean(knownSpell)}
                            className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                                knownSpell
                                    ? 'bg-fl-paper text-fl-text-muted border border-fl-paper cursor-not-allowed'
                                    : 'bg-fl-primary text-white hover:bg-fl-primary-hover border border-fl-primary-hover shadow-sm'
                            }`}
                        >
                            <Plus size={14} />
                            {knownSpell ? 'Už ovládaš' : 'Pridať kúzlo'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SpellsSection = ({ char, onLearnSpell }) => {
    const { spells: catalogSpells } = useCatalog();
    const schools = Object.keys(catalogSpells).filter(s => catalogSpells[s].length > 0);
    const [activeTab, setActiveTab] = useState(schools[0] || 'Obecná');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const knownSpells = Array.isArray(char?.spells) ? char.spells : [];

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isSearching = search.trim().length > 0;

    const filteredSpells = useMemo(() => {
        const lowerSearch = search.toLowerCase().trim();

        if (!lowerSearch) {
            // No search — show only the selected school
            return (catalogSpells[activeTab] || []).map(s => ({ ...s, _school: activeTab }));
        }

        // Search active — search across ALL schools
        const allSpells = [];
        for (const school of schools) {
            for (const spell of catalogSpells[school]) {
                allSpells.push({ ...spell, _school: school });
            }
        }

        return allSpells.filter(s =>
            s.name.toLowerCase().includes(lowerSearch) ||
            s.description.toLowerCase().includes(lowerSearch) ||
            (s.ingredient && s.ingredient.toLowerCase().includes(lowerSearch)) ||
            s._school.toLowerCase().includes(lowerSearch)
        );
    }, [activeTab, catalogSpells, search, schools]);

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Search & Filter */}
            <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                    <input
                        type="text"
                        placeholder="Hledat kouzla ve všech školách..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-fl-card border border-fl-paper rounded text-fl-surface placeholder:text-fl-border focus:border-fl-primary focus:outline-none"
                    />
                </div>

                {/* School tabs - scrollable, dimmed when searching */}
                <div className={`overflow-x-auto pb-1 scrollbar-hide transition-opacity ${isSearching ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex gap-1 bg-fl-nav p-1 rounded min-w-max">
                        {schools.map(school => (
                            <button
                                key={school}
                                onClick={() => setActiveTab(school)}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                    ${activeTab === school ? 'bg-fl-primary text-white shadow-sm' : 'text-fl-text-muted dark:text-fl-border hover:text-white'}`}
                            >
                                {school}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search result count */}
                {isSearching && (
                    <div className="text-xs text-fl-text-muted text-center">
                        Nalezeno <span className="font-bold text-fl-primary">{filteredSpells.length}</span> kouzel ve všech školách
                    </div>
                )}
            </div>

            {/* Spells List */}
            <div className="space-y-1">
                {filteredSpells.length > 0 ? (
                    filteredSpells.map(spell => (
                        <SpellCard
                            key={`${spell._school}-${spell.id}`}
                            spell={spell}
                            isExpanded={!!expanded[spell.id]}
                            onToggle={() => toggleExpand(spell.id)}
                            showSchool={isSearching}
                            knownSpell={knownSpells.find(item => item.id === spell.id)}
                            onLearnSpell={onLearnSpell}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-fl-primary opacity-60 italic">
                        Žádná kouzla nenalezena...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellsSection;
