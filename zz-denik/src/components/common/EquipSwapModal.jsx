import React from 'react';
import { ArrowRightLeft, Shield, Sword, X } from 'lucide-react';

const EquipSwapModal = ({ itemData, slotType, options, onConfirm, onCancel }) => {
    const itemName = itemData?.Předmět || itemData?.name || 'predmet';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4">
            <div className="relative w-full max-w-sm rounded-xl border border-fl-primary bg-fl-card/95 backdrop-blur-xl shadow-2xl p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-bold tracking-wider text-fl-surface">
                            VÝMENA VÝZBROJE
                        </h2>
                        <p className="mt-1 text-xs text-fl-border font-bold uppercase tracking-widest opacity-80">
                            {slotType === 'weapon' ? 'Sloty zbraní sú plné' : 'Slot výstroje je obsadený'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded p-1 text-fl-primary hover:bg-fl-primary/20 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="text-sm font-bold text-fl-surface-hover mb-4">
                    Ktorý predmet chceš odložiť do batohu, aby si si mohol nasadiť <span className="text-fl-primary">{itemName}</span>?
                </p>

                <div className="space-y-2">
                    {options.map((option) => (
                        <button
                            key={option.key || option.idx}
                            type="button"
                            onClick={() => onConfirm(option)}
                            className="w-full flex items-center gap-3 p-3 rounded bg-fl-paper hover:bg-fl-primary/20 border border-fl-primary/30 hover:border-fl-primary transition-all text-left group"
                        >
                            <div className="text-fl-primary opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0">
                                {option.type === 'weapon' ? <Sword size={20} /> : <Shield size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-fl-surface truncate">
                                    {option.current.name}
                                </div>
                                <div className="text-[10px] text-fl-border uppercase tracking-widest">
                                    {option.type === 'weapon'
                                        ? `Slot zbrane ${option.idx + 1}`
                                        : option.key === 'armor'
                                            ? 'Zbroj'
                                            : option.key === 'helmet'
                                                ? 'Helma'
                                                : 'Štít'}
                                </div>
                            </div>
                            <ArrowRightLeft size={16} className="text-fl-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-transparent hover:bg-white/5 border border-fl-border text-fl-border hover:text-white font-bold uppercase tracking-widest text-xs rounded transition-all"
                >
                    Zrušiť
                </button>
            </div>
        </div>
    );
};

export default EquipSwapModal;
