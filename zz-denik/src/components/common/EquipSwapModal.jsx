import React from 'react';
import { X, ArrowRightLeft, Shield, Sword } from 'lucide-react';

const EquipSwapModal = ({ itemData, slotType, options, onConfirm, onCancel }) => {
    // options format: [{ idx: 0, current: { name: 'Dýka', weight: 0.5 }, type: 'weapon' }, ...]
    
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm rounded-xl border border-fl-primary bg-fl-card/95 backdrop-blur-xl shadow-2xl p-6 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)]">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-bold tracking-wider text-fl-surface textShadow-sm">
                            VÝMENA VÝZBROJE
                        </h2>
                        <p className="mt-1 text-xs text-fl-border font-bold uppercase tracking-widest opacity-80">
                            Sloty sú plné
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="rounded p-1 text-fl-primary hover:bg-fl-primary/20 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="mb-4 space-y-1">
                    <p className="text-sm font-bold text-fl-surface-hover mb-3">
                        Ktorý predmet chceš odložiť do batohu, aby si si mohol nasadiť <span className="text-fl-primary">{itemData.Předmět}</span>?
                    </p>
                    
                    <div className="space-y-2 mt-4">
                        {options.map((opt) => (
                            <button
                                key={opt.key ? opt.key : opt.idx}
                                onClick={() => onConfirm(opt)}
                                className="w-full flex items-center gap-3 p-3 rounded bg-fl-paper hover:bg-fl-primary/20 border border-fl-primary/30 hover:border-fl-primary transition-all text-left group"
                            >
                                <div className="text-fl-primary opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all flex-shrink-0">
                                    {opt.type === 'weapon' ? <Sword size={20} /> : <Shield size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-fl-surface truncate">
                                        {opt.current.name}
                                    </div>
                                    <div className="text-[10px] text-fl-border uppercase tracking-widest">
                                        {opt.type === 'weapon' ? `Slot zbraně ${opt.idx + 1}` : opt.key === 'armor' ? 'Zbroj' : opt.key === 'helmet' ? 'Helma' : 'Štít'}
                                    </div>
                                </div>
                                <ArrowRightLeft size={16} className="text-fl-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onCancel}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-transparent hover:bg-white/5 border border-fl-border text-fl-border hover:text-white font-bold uppercase tracking-widest text-xs rounded transition-all"
                    >
                        Zrušiť
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipSwapModal;
