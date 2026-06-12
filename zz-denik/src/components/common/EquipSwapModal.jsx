import React from 'react';
import { ArrowRightLeft, Shield, Sword, X } from 'lucide-react';
import useDialog from '../../hooks/useDialog';

const EquipSwapModal = ({ itemData, slotType, options, onConfirm, onCancel }) => {
    const panelRef = useDialog(onCancel);
    const itemName = itemData?.Předmět || itemData?.name || 'predmet';

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/80 animate-in fade-in duration-200 sm:items-center sm:p-4"
            style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}
            onClick={onCancel}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Výmena výzbroje"
                className="relative w-full max-w-sm max-h-full overflow-y-auto overscroll-contain rounded-t-3xl border border-b-0 border-fl-primary bg-fl-card/95 backdrop-blur-xl shadow-2xl p-6 outline-none animate-in fade-in slide-in-from-bottom-8 duration-300 sm:rounded-2xl sm:border-b sm:slide-in-from-bottom-0 sm:zoom-in-95 sm:duration-200"
                style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-fl-border sm:hidden" aria-hidden="true" />
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-bold tracking-wider text-fl-surface">
                            VÝMENA VÝZBROJE
                        </h2>
                        <p className="mt-1 text-xs text-fl-text-muted font-bold uppercase tracking-widest">
                            {slotType === 'weapon' ? 'Sloty zbraní sú plné' : 'Slot výstroje je obsadený'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Zrušit"
                        className="-mr-2 -mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-primary hover:bg-fl-primary/20 hover:text-white active:bg-fl-primary/20 transition-colors"
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
                                <div className="text-[10px] text-fl-text-muted uppercase tracking-widest">
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
                    className="mt-6 w-full min-h-12 flex items-center justify-center gap-2 bg-transparent hover:bg-fl-paper border border-fl-border text-fl-text-muted hover:text-fl-surface font-bold uppercase tracking-widest text-xs rounded-lg transition-all active:scale-[0.98]"
                >
                    Zrušiť
                </button>
            </div>
        </div>
    );
};

export default EquipSwapModal;
