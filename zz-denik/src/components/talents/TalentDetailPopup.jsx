import React, { useMemo } from 'react';
import { X, Star, ChevronUp, ChevronDown, Info, Plus, Minus } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

const TalentDetailPopup = ({ talent, onClose, onUpgrade, onDowngrade, onShowFull }) => {
    const { talents: catalogTalents } = useCatalog();

    // Find the full talent data to show all rank descriptions
    const fullTalent = useMemo(() => {
        const allTalents = [...(catalogTalents.profession || []), ...(catalogTalents.general || [])];
        return allTalents.find(t => t.id === talent.id);
    }, [catalogTalents, talent.id]);

    const maxRank = fullTalent ? fullTalent.ranks.length : talent.rank;
    const canUpgrade = talent.rank < maxRank;
    const canDowngrade = talent.rank > 1;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-fl-paper-bright w-full max-w-md rounded-lg shadow-2xl border border-fl-primary overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 bg-fl-nav border-b border-fl-primary flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-fl-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl shadow-md">
                            {talent.rank}
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-white text-lg leading-tight">{talent.name}</h3>
                            {talent.profession && <span className="text-[10px] uppercase text-fl-primary tracking-wider">{talent.profession}</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-fl-primary hover:text-fl-paper-light transition-colors">
                        <X size={22} />
                    </button>
                </div>

                {/* Learned Ranks */}
                <div className="p-4 space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-fl-primary tracking-widest mb-2">Naučené úrovně</h4>
                    {fullTalent && fullTalent.ranks.map((rank) => {
                        const isLearned = rank.rank <= talent.rank;

                        return (
                            <div
                                key={rank.rank}
                                className={`flex gap-3 text-sm p-3 rounded border shadow-sm transition-opacity ${
                                    isLearned
                                        ? 'bg-fl-card border-fl-paper'
                                        : 'bg-fl-card/70 border-fl-paper opacity-70'
                                }`}
                            >
                                <div
                                    className={`min-w-[28px] h-7 flex items-center justify-center font-bold rounded-full text-xs shadow-sm ${
                                        isLearned
                                            ? 'bg-fl-primary text-white'
                                            : 'bg-fl-paper text-fl-text-muted'
                                    }`}
                                >
                                    {rank.rank}
                                </div>
                                <p className={`leading-relaxed flex-1 ${isLearned ? 'text-fl-surface-hover' : 'text-fl-text-muted'}`}>
                                    {rank.description}
                                </p>
                            </div>
                        );
                    })}

                    {/* If no full data available, show the single description */}
                    {!fullTalent && (
                        <div className="flex gap-3 text-sm p-3 rounded bg-[var(--fl-card)] border border-fl-paper shadow-sm">
                            <div className="min-w-[28px] h-7 flex items-center justify-center bg-fl-primary text-white font-bold rounded-full text-xs shadow-sm">
                                {talent.rank}
                            </div>
                            <p className="text-fl-surface-hover leading-relaxed flex-1">{talent.description}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                    <button
                        onClick={() => canDowngrade && onDowngrade(talent)}
                        disabled={!canDowngrade}
                        className={`flex-1 py-3 rounded font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors border
                            ${canDowngrade
                                ? 'bg-red-900/10 text-red-800 border-red-800/30 hover:bg-red-900/20'
                                : 'bg-fl-paper text-fl-border border-fl-paper cursor-not-allowed'}`}
                    >
                        <Minus size={14} /> Snížit
                    </button>
                    <button
                        onClick={() => canUpgrade && onUpgrade(talent)}
                        disabled={!canUpgrade}
                        className={`flex-1 py-3 rounded font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors border
                            ${canUpgrade
                                ? 'bg-fl-primary text-white border-fl-primary hover:bg-fl-primary-hover shadow-sm'
                                : 'bg-fl-paper text-fl-border border-fl-paper cursor-not-allowed'}`}
                    >
                        <Plus size={14} /> Zvýšit ({talent.rank}/{maxRank})
                    </button>
                </div>

                {/* Info button */}
                {fullTalent && (
                    <div className="px-4 pb-4">
                        <button
                            onClick={() => onShowFull(talent)}
                            className="w-full py-2 rounded text-fl-primary font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-fl-paper transition-colors border border-fl-border"
                        >
                            <Info size={14} /> Zobrazit plný popis všech úrovní
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TalentDetailPopup;
