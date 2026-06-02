import React, { useState, useMemo } from 'react';
import { Search, X, Plus, ChevronDown, ChevronUp, Flame, Check } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

const SpellPicker = ({ char, onAdd, onClose }) => {
    const { spells: catalogSpells } = useCatalog();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSchool, setActiveSchool] = useState(Object.keys(catalogSpells)[0] || "Obecná");
    const [expandedSpell, setExpandedSpell] = useState(null);

    const schools = Object.keys(catalogSpells).filter(s => catalogSpells[s].length > 0);
    const knownSpells = Array.isArray(char.spells) ? char.spells : [];

    const filteredSpells = useMemo(() => {
        const data = catalogSpells[activeSchool] || [];
        if (!searchTerm) return data;
        return data.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeSchool, catalogSpells, searchTerm]);

    const isKnown = (spellId) => knownSpells.some(s => s.id === spellId);

    const handleAdd = (spell) => {
        onAdd({
            id: spell.id,
            name: spell.name,
            rank: spell.rank,
            range: spell.range,
            duration: spell.duration,
            ingredient: spell.ingredient,
            description: spell.description,
            school: activeSchool
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-fl-card w-full max-w-2xl h-[85vh] rounded-lg shadow-2xl border border-fl-primary flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-fl-border flex justify-between items-center bg-fl-card rounded-t-lg">
                    <h2 className="text-xl font-serif font-bold text-fl-primary flex items-center gap-2">
                        <Flame size={24} /> Vybrat Kouzlo
                    </h2>
                    <button onClick={onClose} className="text-fl-text-muted hover:text-fl-primary">
                        <X size={24} />
                    </button>
                </div>

                {/* School tabs */}
                <div className="p-3 border-b border-fl-border bg-fl-paper-light overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                        {schools.map(school => (
                            <button
                                key={school}
                                className={`px-3 py-1.5 font-bold uppercase text-[10px] rounded transition-colors whitespace-nowrap
                                    ${activeSchool === school ? 'bg-fl-primary text-white shadow-sm' : 'bg-fl-paper-light text-fl-text-muted hover:bg-fl-border'}`}
                                onClick={() => setActiveSchool(school)}
                            >
                                {school}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-fl-border bg-fl-paper-light">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                        <input
                            type="text"
                            placeholder="Hledat kouzlo..."
                            className="w-full pl-10 pr-4 py-2 bg-fl-paper-bright border border-fl-border rounded text-fl-surface focus:border-fl-primary focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Spell list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-fl-paper-bright">
                    {filteredSpells.map(spell => {
                        const known = isKnown(spell.id);
                        return (
                            <div key={spell.id} className="bg-fl-paper-bright border border-fl-border rounded overflow-hidden">
                                <button
                                    className="w-full p-3 flex justify-between items-center hover:bg-fl-paper/50 transition-colors text-left"
                                    onClick={() => setExpandedSpell(expandedSpell === spell.id ? null : spell.id)}
                                >
                                    <div>
                                        <div className="font-bold text-fl-surface flex items-center gap-2">
                                            {spell.name}
                                            {known && <Check size={14} className="text-green-700" />}
                                        </div>
                                        <div className="text-[10px] uppercase text-fl-primary">
                                            Stupeň {spell.rank} • {spell.range} • {spell.duration}
                                        </div>
                                    </div>
                                    {expandedSpell === spell.id ? <ChevronUp size={20} className="text-fl-text-muted" /> : <ChevronDown size={20} className="text-fl-text-muted" />}
                                </button>

                                {expandedSpell === spell.id && (
                                    <div className="p-3 border-t border-fl-border bg-fl-paper/20">
                                        {spell.ingredient && (
                                            <p className="text-xs text-fl-text-muted mb-2">
                                                <span className="font-bold">Pomůcka:</span> {spell.ingredient}
                                            </p>
                                        )}
                                        <p className="text-sm text-fl-surface-hover leading-relaxed mb-3 font-serif">{spell.description}</p>
                                        <button
                                            onClick={() => handleAdd(spell)}
                                            disabled={known}
                                            className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1 transition-colors w-full justify-center
                                                ${known
                                                    ? 'bg-green-900/10 text-green-700 border border-green-900/30 cursor-not-allowed'
                                                    : 'bg-fl-primary text-white hover:bg-fl-primary-hover shadow-sm'}`}
                                        >
                                            {known ? <><Check size={14} /> Naučeno</> : <><Plus size={14} /> Naučit se</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filteredSpells.length === 0 && (
                        <div className="text-center py-8 text-fl-text-muted italic">
                            Žádná kouzla nenalezena.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpellPicker;
