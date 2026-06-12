import React from 'react';
import { Backpack, Trash2, X } from 'lucide-react';
import useDialog from '../../hooks/useDialog';

const UnequipModal = ({ itemName, onStash, onDrop, onCancel }) => {
    const panelRef = useDialog(onCancel);

    return (
    <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in duration-200"
        onClick={onCancel}
    >
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Odložit ${itemName}`}
            className="relative w-full max-w-sm rounded-2xl border border-fl-primary bg-fl-card/95 backdrop-blur-xl shadow-2xl p-6 outline-none animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
        >
            <div className="mb-6 flex items-start justify-between">
                <h2 className="font-serif text-2xl font-bold tracking-wider text-fl-surface">
                    ODLOŽIŤ VÝZBROJ
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Zrušit"
                    className="-mr-2 -mt-2 flex h-12 w-12 items-center justify-center rounded-full text-fl-primary hover:bg-fl-primary/20 hover:text-white active:bg-fl-primary/20 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="mb-6 text-center">
                <p className="text-sm font-bold text-fl-surface-hover">
                    Čo chceš urobiť s:
                    <span className="text-xl text-fl-primary block mt-2">{itemName}</span>
                </p>
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={onStash}
                    className="w-full flex items-center justify-start gap-4 p-4 rounded-lg bg-fl-paper hover:bg-fl-primary/20 border border-fl-primary/30 hover:border-fl-primary transition-all text-left group"
                >
                    <div className="text-fl-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all bg-fl-primary/10 p-2 rounded-lg">
                        <Backpack size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-fl-surface tracking-wide uppercase">
                            Do batohu
                        </div>
                        <div className="text-[11px] text-fl-text-muted">
                            Presunie predmet do inventára
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onDrop}
                    className="w-full flex items-center justify-start gap-4 p-4 rounded-lg bg-fl-paper hover:bg-red-900/30 border border-red-900/30 hover:border-red-600 transition-all text-left group"
                >
                    <div className="text-red-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all bg-red-900/10 p-2 rounded-lg">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-red-500 tracking-wide uppercase">
                            Zahodiť úplne
                        </div>
                        <div className="text-[11px] text-fl-text-muted">
                            Vymaže predmet bez návratu
                        </div>
                    </div>
                </button>
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

export default UnequipModal;
