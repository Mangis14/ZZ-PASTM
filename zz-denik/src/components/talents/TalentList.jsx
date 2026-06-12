import React, { useEffect, useMemo, useState } from 'react';
import { X, Star } from 'lucide-react';
import TalentDetailPopup from './TalentDetailPopup';
import { confirmAction } from '../common/ConfirmDialog';

const TalentList = ({ talents, onRemove, onOpenPicker, onUpgrade, onDowngrade, onShowFullTalent, onDetailOpenChange }) => {
    const [selectedTalentId, setSelectedTalentId] = useState(null);

    const selectedTalent = useMemo(() => {
        if (!selectedTalentId) return null;
        return talents.find(talent => talent.id === selectedTalentId) || null;
    }, [selectedTalentId, talents]);

    useEffect(() => {
        onDetailOpenChange?.(Boolean(selectedTalent));
    }, [selectedTalent, onDetailOpenChange]);

    const handleUpgrade = (talent) => {
        onUpgrade(talent);
    };

    const handleDowngrade = (talent) => {
        onDowngrade(talent);
    };

    return (
        <div className="space-y-3">
            {/* List of existing talents */}
            {talents.map((talent, index) => (
                <div
                    key={`${talent.id}-${index}`}
                    className="bg-fl-paper-bright border border-fl-paper rounded-lg relative flex items-center hover:border-fl-primary/50 transition-colors"
                >
                    <button
                        type="button"
                        onClick={() => setSelectedTalentId(talent.id)}
                        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 p-3 text-left active:bg-fl-paper/50 rounded-l-lg"
                    >
                        <div className="bg-fl-primary text-white w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-serif font-bold text-lg shadow-sm" aria-hidden="true">
                            {talent.rank}
                        </div>
                        <div className="min-w-0">
                            <h4 className="truncate font-bold text-fl-surface text-sm uppercase tracking-wide">{talent.name}</h4>
                            {talent.profession && <span className="text-[10px] text-fl-primary uppercase">{talent.profession}</span>}
                        </div>
                    </button>
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            const confirmed = await confirmAction({
                                title: `Zapomenout talent ${talent.name}?`,
                                confirmLabel: 'Zapomenout',
                                danger: true
                            });
                            if (confirmed) onRemove(index);
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-fl-text-muted transition-colors hover:bg-red-900/20 hover:text-red-700 active:bg-red-900/20"
                        aria-label={`Zapomenout talent ${talent.name}`}
                        title="Zapomenout talent"
                    >
                        <X size={16} />
                    </button>
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
                className="w-full min-h-12 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 border border-fl-primary/30"
            >
                <Star size={16} aria-hidden="true" /> Přidat Talent
            </button>

            {/* Detail Popup */}
            {selectedTalent && (
                <TalentDetailPopup
                    talent={selectedTalent}
                    onClose={() => setSelectedTalentId(null)}
                    onUpgrade={handleUpgrade}
                    onDowngrade={handleDowngrade}
                    onShowFull={(t) => {
                        setSelectedTalentId(null);
                        onShowFullTalent(t);
                    }}
                />
            )}
        </div>
    );
};

export default TalentList;
