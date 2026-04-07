import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import TalentDetailPopup from './TalentDetailPopup';

const TalentList = ({ talents, onRemove, onOpenPicker, onUpgrade, onDowngrade, onShowFullTalent }) => {
    const [selectedTalent, setSelectedTalent] = useState(null);

    const handleUpgrade = (talent) => {
        onUpgrade(talent);
        setSelectedTalent(null);
    };

    const handleDowngrade = (talent) => {
        onDowngrade(talent);
        setSelectedTalent(null);
    };

    return (
        <div className="space-y-3">
            {/* List of existing talents */}
            {talents.map((talent, index) => (
                <div
                    key={`${talent.id}-${index}`}
                    className="bg-fl-paper-bright border border-fl-paper rounded relative group cursor-pointer hover:border-fl-primary/50 transition-colors"
                    onClick={() => setSelectedTalent({ ...talent, _index: index })}
                >
                    <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-fl-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                                {talent.rank}
                            </div>
                            <div>
                                <h4 className="font-bold text-fl-surface text-sm uppercase tracking-wide">{talent.name}</h4>
                                {talent.profession && <span className="text-[10px] text-fl-primary uppercase">{talent.profession}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if(window.confirm(`Opravdu zapomenout talent ${talent.name}?`)) onRemove(index); 
                                }}
                                className="w-6 h-6 flex items-center justify-center text-fl-border hover:text-red-700 opacity-50 group-hover:opacity-100 transition-all rounded hover:bg-red-900/30"
                                title="Zapomenout talent"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {talents.length === 0 && (
                <div className="text-center py-6 text-fl-text-muted italic border-2 border-dashed border-fl-border rounded">
                    Zatím žádné talenty.
                </div>
            )}

            {/* Add Button */}
            <button
                onClick={onOpenPicker}
                className="w-full py-3 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
            >
                <Star size={16} /> Přidat Talent
            </button>

            {/* Detail Popup */}
            {selectedTalent && (
                <TalentDetailPopup
                    talent={selectedTalent}
                    onClose={() => setSelectedTalent(null)}
                    onUpgrade={handleUpgrade}
                    onDowngrade={handleDowngrade}
                    onShowFull={(t) => {
                        setSelectedTalent(null);
                        onShowFullTalent(t);
                    }}
                />
            )}
        </div>
    );
};

export default TalentList;
