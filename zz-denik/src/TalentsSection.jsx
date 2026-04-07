import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Shield, Zap } from 'lucide-react';
import { TALENTS_DATA } from './data/talents_data';

const TalentCard = ({ talent, isExpanded, onToggle }) => {
    return (
        <div className="bg-fl-paper-bright border border-fl-paper rounded mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div
                onClick={onToggle}
                className="p-3 flex items-center justify-between cursor-pointer bg-fl-paper-light border-b border-fl-paper"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${talent.profession ? 'bg-fl-primary text-white' : 'bg-fl-border text-fl-surface'}`}>
                        {talent.profession ? <Shield size={16} /> : <Star size={16} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-fl-surface uppercase tracking-wide text-sm">{talent.name}</h4>
                        {talent.profession && <span className="text-[10px] font-mono text-fl-primary uppercase">{talent.profession}</span>}
                    </div>
                </div>
                <button className="text-fl-primary">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 bg-[var(--fl-card)]">
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
                </div>
            )}
        </div>
    );
};

const TalentsSection = () => {
    const [activeTab, setActiveTab] = useState('profession'); // 'profession' | 'general'
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filterTalents = (list) => {
        return list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    };

    const currentList = activeTab === 'profession' ? TALENTS_DATA.profession : TALENTS_DATA.general;
    const filteredList = filterTalents(currentList);

    return (
        <div className="pb-20">
            {/* Search & Tabs */}
            <div className="sticky top-16 bg-fl-bg pt-4 pb-2 z-30 px-1">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                    <input
                        type="text"
                        placeholder="Hledat talent..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full w-full pl-10 pr-4 py-2 bg-[var(--fl-card)] border border-fl-paper rounded text-[var(--fl-surface)] placeholder:text-fl-border focus:border-fl-primary focus:outline-none"
                    />
                </div>

                <div className="flex p-1 bg-fl-surface rounded border border-fl-surface-hover">
                    <button
                        onClick={() => setActiveTab('profession')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                        ${activeTab === 'profession' ? 'bg-fl-primary text-white shadow-md' : 'text-fl-primary hover:text-fl-paper'}`}
                    >
                        <Shield size={14} /> Povolání
                    </button>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                        ${activeTab === 'general' ? 'bg-fl-border text-fl-surface shadow-md' : 'text-fl-primary hover:text-fl-paper'}`}
                    >
                        <Star size={14} /> Obecné
                    </button>
                </div>
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
