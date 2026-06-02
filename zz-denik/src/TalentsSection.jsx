import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Shield, Zap } from 'lucide-react';
import { useCatalog } from './context/CatalogContext';

const TalentCard = ({ talent, isExpanded, onToggle, knownTalent, onLearnTalent }) => {
    const maxRank = talent.ranks?.length || 1;
    const isKnown = Boolean(knownTalent);
    const isMaxRank = isKnown && knownTalent.rank >= maxRank;
    const actionLabel = !isKnown
        ? 'Naučiť sa talent'
        : isMaxRank
            ? 'Už ovládaš'
            : `Zvýšiť úroveň (${knownTalent.rank}/${maxRank})`;

    return (
        <div className="bg-fl-paper-bright border border-fl-paper rounded mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div
                onClick={onToggle}
                className="p-3 flex items-center justify-between cursor-pointer bg-fl-paper-light border-b border-fl-paper"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-full shrink-0 ${talent.profession ? 'bg-fl-primary text-white' : 'bg-fl-border text-fl-surface'}`}>
                        {talent.profession ? <Shield size={16} /> : <Star size={16} />}
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-fl-surface uppercase tracking-wide text-sm break-words">{talent.name}</h4>
                        {talent.profession && <span className="text-[10px] font-mono text-fl-primary uppercase">{talent.profession}</span>}
                    </div>
                </div>
                <button className="text-fl-primary shrink-0 ml-2">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 bg-fl-card">
                    {talent.description && (
                        <p className="text-sm text-fl-surface-hover leading-relaxed font-serif italic mb-3 pb-3 border-b border-fl-paper">
                            {talent.description}
                        </p>
                    )}
                    {talent.ranks.length > 0 && (
                        <div className="space-y-3">
                            {talent.ranks.map((rank, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <div className="min-w-[24px] h-6 flex items-center justify-center bg-fl-paper text-fl-primary font-bold rounded-full text-xs">
                                        {rank.rank}
                                    </div>
                                    <p className="text-fl-surface-hover leading-relaxed">{rank.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-fl-paper flex flex-col gap-2">
                        {isKnown && (
                            <div className="text-[11px] uppercase tracking-wider text-fl-text-muted">
                                Aktuálna úroveň v denníku: <span className="font-bold text-fl-primary">{knownTalent.rank}/{maxRank}</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isMaxRank && onLearnTalent) {
                                    onLearnTalent(talent);
                                }
                            }}
                            disabled={!onLearnTalent || isMaxRank}
                            className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                                isMaxRank
                                    ? 'bg-fl-paper text-fl-text-muted border border-fl-paper cursor-not-allowed'
                                    : 'bg-fl-primary text-white hover:bg-fl-primary-hover border border-fl-primary-hover shadow-sm'
                            }`}
                        >
                            <Zap size={14} />
                            {actionLabel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TalentsSection = ({ char, onLearnTalent }) => {
    const { talents: catalogTalents } = useCatalog();
    const [activeTab, setActiveTab] = useState('profession'); // 'profession' | 'general'
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const knownTalents = Array.isArray(char?.talents) ? char.talents : [];

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Fulltext search across ALL categories when search is active
    const filteredList = useMemo(() => {
        const lowerSearch = search.toLowerCase().trim();

        if (!lowerSearch) {
            // No search — show only the selected tab
            return activeTab === 'profession' ? catalogTalents.profession : catalogTalents.general;
        }

        // Search active — search across BOTH profession and general
        const allTalents = [
            ...(catalogTalents.profession || []).map(t => ({ ...t, _source: 'profession' })),
            ...(catalogTalents.general || []).map(t => ({ ...t, _source: 'general' }))
        ];

        return allTalents.filter(t =>
            t.name.toLowerCase().includes(lowerSearch) ||
            (t.profession && t.profession.toLowerCase().includes(lowerSearch)) ||
            t.ranks.some(r => r.description.toLowerCase().includes(lowerSearch))
        );
    }, [activeTab, catalogTalents, search]);

    const isSearching = search.trim().length > 0;

    return (
        <div className="pb-20">
            {/* Search & Tabs */}
            <div className="bg-fl-paper-bright pb-3 pt-4 border-b border-fl-border mb-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                    <input
                        type="text"
                        placeholder="Hledat talent ve všech kategoriích..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-fl-card border border-fl-paper rounded text-fl-surface placeholder:text-fl-border focus:border-fl-primary focus:outline-none"
                    />
                </div>

                {/* Tabs — dimmed when searching */}
                <div className={`flex p-1 bg-fl-nav rounded border border-fl-nav-hover transition-opacity ${isSearching ? 'opacity-40 pointer-events-none' : ''}`}>
                    <button
                        onClick={() => setActiveTab('profession')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                        ${activeTab === 'profession' ? 'bg-fl-primary text-white shadow-md' : 'text-fl-text-muted dark:text-fl-border hover:text-white'}`}
                    >
                        <Shield size={14} /> Povolání
                    </button>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                        ${activeTab === 'general' ? 'bg-fl-primary text-white shadow-md' : 'text-fl-text-muted dark:text-fl-border hover:text-white'}`}
                    >
                        <Star size={14} /> Obecné
                    </button>
                </div>

                {/* Search result count */}
                {isSearching && (
                    <div className="mt-2 text-xs text-fl-text-muted text-center">
                        Nalezeno <span className="font-bold text-fl-primary">{filteredList.length}</span> talentů ve všech kategoriích
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-1 mt-2">
                {filteredList.length > 0 ? (
                    filteredList.map(talent => (
                        <TalentCard
                            key={talent.id}
                            talent={talent}
                            isExpanded={expanded[talent.id]}
                            onToggle={() => toggleExpand(talent.id)}
                            knownTalent={knownTalents.find(item => item.id === talent.id)}
                            onLearnTalent={onLearnTalent}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-fl-text-muted italic">
                        Žádné talenty nenalezeny...
                    </div>
                )}
            </div>
        </div>
    );
};

export default TalentsSection;
