import React, { useState } from 'react';
import { Trash2, Flame, Info, ChevronDown, ChevronUp, X } from 'lucide-react';

const SpellDetailPopup = ({ spell, onClose, onShowFull }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-fl-paper-bright w-full max-w-md rounded-lg shadow-2xl border border-fl-primary overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 bg-fl-nav border-b border-fl-primary flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-fl-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                            <Flame size={20} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-white text-lg leading-tight">{spell.name}</h3>
                            <span className="text-[10px] uppercase text-fl-primary tracking-wider">
                                {spell.school} • Stupeň {spell.rank}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-fl-primary hover:text-fl-paper-light transition-colors">
                        <X size={22} />
                    </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-fl-card p-2 rounded border border-fl-paper">
                            <span className="font-bold text-fl-primary uppercase block text-[9px]">Vzdálenost</span>
                            <span className="text-fl-surface">{spell.range}</span>
                        </div>
                        <div className="bg-fl-card p-2 rounded border border-fl-paper">
                            <span className="font-bold text-fl-primary uppercase block text-[9px]">Trvání</span>
                            <span className="text-fl-surface">{spell.duration}</span>
                        </div>
                    </div>
                    {spell.ingredient && (
                        <div className="bg-[var(--fl-card)] p-2 rounded border border-fl-paper text-xs">
                            <span className="font-bold text-fl-primary uppercase text-[9px]">Pomůcka: </span>
                            <span className="text-fl-surface">{spell.ingredient}</span>
                        </div>
                    )}
                    <div className="bg-fl-card p-3 rounded border border-fl-paper">
                        <p className="text-sm text-fl-surface-hover leading-relaxed font-serif">{spell.description}</p>
                    </div>
                </div>

                {/* Info button */}
                <div className="px-4 pb-4">
                    <button
                        onClick={() => { onShowFull(); onClose(); }}
                        className="w-full py-2 rounded text-fl-primary font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-fl-paper transition-colors border border-fl-border"
                    >
                        <Info size={14} /> Zobrazit kompletní knihu kouzel
                    </button>
                </div>
            </div>
        </div>
    );
};

const SpellList = ({ spells, onRemove, onOpenPicker, onShowFullSpell }) => {
    const [selectedSpell, setSelectedSpell] = useState(null);

    return (
        <div className="space-y-3">
            {/* List of learned spells */}
            {spells.map((spell, index) => (
                <div
                    key={`${spell.id}-${index}`}
                    className="bg-fl-paper-bright border border-fl-paper rounded relative group cursor-pointer hover:border-fl-primary/50 transition-colors"
                    onClick={() => setSelectedSpell({ ...spell, _index: index })}
                >
                    <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-fl-nav text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                                <Flame size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-fl-surface text-sm uppercase tracking-wide">{spell.name}</h4>
                                <span className="text-[10px] text-fl-primary uppercase">
                                    {spell.school} • Stupeň {spell.rank}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if(window.confirm(`Opravdu zapomenout kouzlo ${spell.name}?`)) onRemove(index); 
                                }}
                                className="w-6 h-6 flex items-center justify-center text-fl-border hover:text-red-700 opacity-50 group-hover:opacity-100 transition-all rounded hover:bg-red-900/30"
                                title="Zapomenout kouzlo"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {spells.length === 0 && (
                <div className="text-center py-6 text-fl-text-muted italic border-2 border-dashed border-fl-border rounded">
                    Zatím žádná kouzla.
                </div>
            )}

            {/* Add Button */}
            <button
                onClick={onOpenPicker}
                className="w-full py-3 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
            >
                <Flame size={16} /> Přidat Kouzlo
            </button>

            {/* Detail Popup */}
            {selectedSpell && (
                <SpellDetailPopup
                    spell={selectedSpell}
                    onClose={() => setSelectedSpell(null)}
                    onShowFull={onShowFullSpell}
                />
            )}
        </div>
    );
};

export default SpellList;
