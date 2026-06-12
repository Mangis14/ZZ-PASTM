import React, { useState, useMemo } from 'react';
import { Search, X, Plus, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import useDialog from '../../hooks/useDialog';

const TalentPicker = ({ char, onAdd, onClose }) => {
    const panelRef = useDialog(onClose);
    const { talents: catalogTalents } = useCatalog();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("profession"); // 'profession' | 'general'
    const [expandedTalent, setExpandedTalent] = useState(null);

    const filteredTalents = useMemo(() => {
        const data = activeTab === 'profession' ? catalogTalents.profession : catalogTalents.general;
        if (!searchTerm) return data;
        return data.filter(t =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.profession && t.profession.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeTab, catalogTalents, searchTerm]);

    const handleAdd = (talent, rankIndex) => {
        onAdd({
            id: talent.id,
            name: talent.name,
            rank: rankIndex + 1,
            description: talent.ranks[rankIndex].description,
            // For profession talents, we might want to store the profession name too
            profession: talent.profession
        });
    };

    const talents = Array.isArray(char.talents) ? char.talents : [];

    const hasTalentRank = (talentId, rank) => {
        const existing = talents.find(t => t.id === talentId);
        return existing && existing.rank >= rank;
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200 sm:items-center sm:p-4"
            style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Vybrat talent"
                className="relative bg-fl-card w-full max-w-2xl h-[92dvh] max-h-full rounded-t-3xl border border-b-0 shadow-2xl border-fl-primary flex flex-col outline-none animate-in fade-in slide-in-from-bottom-8 duration-300 sm:h-[85dvh] sm:rounded-2xl sm:border-b sm:slide-in-from-bottom-0 sm:zoom-in-95 sm:duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-fl-border sm:hidden" aria-hidden="true" />
                <div className="p-4 pt-5 sm:pt-4 border-b border-fl-border flex justify-between items-center bg-fl-card rounded-t-3xl sm:rounded-t-2xl">
                    <h2 className="text-xl font-serif font-bold text-fl-primary flex items-center gap-2">
                        <Star size={24} aria-hidden="true" /> Vybrat Talent
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Zavřít výběr talentu"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 border-b border-fl-border bg-fl-paper-light flex flex-col gap-3">
                    <div className="flex gap-2" role="tablist" aria-label="Kategorie talentů">
                        <button
                            role="tab"
                            aria-selected={activeTab === 'profession'}
                            className={`min-h-12 flex-1 font-bold uppercase text-xs rounded-lg transition-colors active:opacity-80 ${activeTab === 'profession' ? 'bg-fl-primary text-white' : 'bg-fl-paper-light text-fl-text-muted hover:bg-fl-border'}`}
                            onClick={() => setActiveTab('profession')}
                        >
                            Povolání
                        </button>
                        <button
                            role="tab"
                            aria-selected={activeTab === 'general'}
                            className={`min-h-12 flex-1 font-bold uppercase text-xs rounded-lg transition-colors active:opacity-80 ${activeTab === 'general' ? 'bg-fl-primary text-white' : 'bg-fl-paper-light text-fl-text-muted hover:bg-fl-border'}`}
                            onClick={() => setActiveTab('general')}
                        >
                            Obecné
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Hledat talent..."
                            aria-label="Hledat talent"
                            className="w-full min-h-12 pl-10 pr-4 py-2 bg-fl-paper-bright border border-fl-border rounded-lg text-fl-surface placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2 bg-fl-paper-bright rounded-b-none sm:rounded-b-2xl"
                    style={{ paddingBottom: 'max(1rem, var(--safe-bottom))' }}
                >
                    {filteredTalents.map(talent => (
                        <div key={talent.id} className="bg-fl-paper-bright border border-fl-border rounded-lg overflow-hidden">
                            <button
                                className="w-full min-h-14 p-3 flex justify-between items-center hover:bg-fl-paper/50 active:bg-fl-paper/70 transition-colors text-left"
                                aria-expanded={expandedTalent === talent.id}
                                onClick={() => setExpandedTalent(expandedTalent === talent.id ? null : talent.id)}
                            >
                                <div>
                                    <div className="font-bold text-fl-surface">{talent.name}</div>
                                    {talent.profession && <div className="text-[10px] uppercase text-fl-primary">{talent.profession}</div>}
                                </div>
                                {expandedTalent === talent.id ? <ChevronUp size={20} className="text-fl-text-muted" /> : <ChevronDown size={20} className="text-fl-text-muted" />}
                            </button>

                            {expandedTalent === talent.id && (
                                <div className="p-3 border-t border-fl-border bg-fl-paper/20">
                                    {talent.description && <p className="text-sm italic text-fl-text-muted mb-3">{talent.description}</p>}
                                    <div className="space-y-2">
                                        {talent.ranks.map((rank, idx) => {
                                            const isOwned = hasTalentRank(talent.id, rank.rank);
                                            const canBuy = !isOwned && (rank.rank === 1 || hasTalentRank(talent.id, rank.rank - 1));

                                            return (
                                                <div key={rank.rank} className={`flex gap-3 text-sm p-2 rounded ${isOwned ? 'bg-green-900/10 border border-green-900/30' : 'bg-fl-bg border border-fl-border'}`}>
                                                    <div className="flex flex-col items-center justify-center min-w-[2.5rem]">
                                                        <span className="font-bold text-fl-primary text-xs">STUPEŇ</span>
                                                        <span className="font-serif text-xl font-bold">{rank.rank}</span>
                                                    </div>
                                                    <div className="flex-1 text-fl-surface opacity-90">{rank.description}</div>
                                                    <div className="flex items-center">
                                                        {isOwned ? (
                                                            <div className="text-green-700 font-bold text-xs uppercase flex items-center gap-1">
                                                                <Star size={12} fill="currentColor" /> Získáno
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAdd(talent, idx)}
                                                                disabled={!canBuy}
                                                                className={`min-h-11 px-3 rounded-lg text-xs font-bold uppercase flex items-center gap-1 transition-all
                                                                    ${canBuy
                                                                        ? 'bg-fl-primary text-white hover:bg-fl-primary-hover active:scale-[0.96] shadow-sm'
                                                                        : 'bg-fl-border text-fl-text-muted cursor-not-allowed opacity-50'}`}
                                                            >
                                                                <Plus size={14} aria-hidden="true" /> Získat
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredTalents.length === 0 && (
                        <div className="text-center py-8 text-fl-text-muted italic">
                            Žádné talenty nenalezeny.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentPicker;
